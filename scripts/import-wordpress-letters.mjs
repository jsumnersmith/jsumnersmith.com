#!/usr/bin/env node
/**
 * One-time import: WordPress.com posts → src/letters/*.mdx
 *
 * Usage:
 *   node scripts/import-wordpress-letters.mjs           # fetch via REST (public API)
 *   node scripts/import-wordpress-letters.mjs --dry-run
 *   node scripts/import-wordpress-letters.mjs --wxr=export.xml
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import he from 'he'
import { XMLParser } from 'fast-xml-parser'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const LETTERS_DIR = path.join(ROOT, 'src/letters')

const SITE = 'jsumner.wordpress.com'
const PAGE_SIZE = 100

function stripTags(html) {
  return he
    .decode(String(html).replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

function plainTitle(htmlTitle) {
  return stripTags(htmlTitle)
}

/** MDX treats `<http://...>` as JSX; normalize to a markdown link. */
function fixAngleBracketUrls(md) {
  return String(md).replace(
    /<(https?:\/\/[^>\s]+)>/g,
    (_, url) => `[${url}](${url})`,
  )
}

async function htmlToMarkdown(html) {
  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify, { bullets: '-', fence: '`' })
    .process(String(html ?? ''))
  return String(file).trim()
}

function matterEscape(s) {
  if (s == null) return ''
  const t = String(s)
  if (/["\n:#]/.test(t)) return JSON.stringify(t)
  return t
}

function buildFrontmatter({ title, date, slug, excerpt, wpId }) {
  const lines = [
    '---',
    `title: ${matterEscape(title)}`,
    `date: ${matterEscape(date)}`,
    `slug: "/letters/${slug}/"`,
    `excerpt: ${matterEscape(excerpt)}`,
    `template: "post"`,
    `draft: false`,
    `source: "wordpress"`,
    `wp_id: ${wpId}`,
    '---',
    '',
  ]
  return lines.join('\n')
}

function pathForSlug(slug) {
  return path.join(LETTERS_DIR, `${slug}.mdx`)
}

async function fetchAllWpComPosts() {
  const posts = []
  let offset = 0
  let total = Infinity

  while (offset < total) {
    const url = `https://public-api.wordpress.com/rest/v1.1/sites/${encodeURIComponent(SITE)}/posts?number=${PAGE_SIZE}&offset=${offset}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`WP REST ${res.status}: ${url}`)
    }
    const data = await res.json()
    total = data.found ?? 0
    const batch = data.posts ?? []
    if (batch.length === 0) break
    posts.push(...batch)
    offset += batch.length
  }

  return posts
}

function normalizeWxItems(channel) {
  const raw = channel.item
  if (!raw) return []
  return Array.isArray(raw) ? raw : [raw]
}

/** Map namespaced WXR tags to plain keys where possible */
function wxItemToPost(item) {
  const title = item.title ?? ''
  const slug =
    item['wp:post_name'] ??
    item.post_name ??
    (typeof item['wp:postmeta'] === 'object' ? null : null)
  const content =
    item['content:encoded'] ?? item['content:encodedCDATA'] ?? item.content ?? ''
  const date =
    item['wp:post_date_gmt'] ??
    item['wp:post_date'] ??
    item.pubDate ??
    item.post_date
  const excerpt = item.excerpt?.encoded ?? item['excerpt:encoded'] ?? ''
  const type = item['wp:post_type'] ?? 'post'
  const status = item['wp:status'] ?? 'publish'
  const id = item['wp:post_id'] ?? item['post_id']
  return {
    title,
    slug,
    content,
    date,
    excerpt,
    type,
    status,
    ID: id != null ? Number(id) : 0,
  }
}

async function loadFromWxr(filePath) {
  const xml = fs.readFileSync(filePath, 'utf8')
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: false,
    cdataPropName: '__cdata',
    tagValueProcessor: (_, val) => val,
  })
  const doc = parser.parse(xml)
  const channel = doc?.rss?.channel
  if (!channel) throw new Error('Invalid WXR: missing rss.channel')
  const items = normalizeWxItems(channel)
  const posts = []
  for (const item of items) {
    const p = wxItemToPost(item)
    if (p.type !== 'post') continue
    if (p.status !== 'publish') continue
    if (!p.slug) continue
    posts.push({
      ID: p.ID,
      slug: p.slug,
      title: p.title,
      date: p.date,
      content: typeof p.content === 'object' ? p.content.__cdata ?? '' : p.content,
      excerpt:
        typeof p.excerpt === 'object' ? p.excerpt.__cdata ?? '' : p.excerpt,
    })
  }
  return posts
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const wxrArg = args.find((a) => a.startsWith('--wxr='))
  const wxrPath = wxrArg ? path.resolve(wxrArg.slice('--wxr='.length)) : null

  if (!fs.existsSync(LETTERS_DIR)) {
    fs.mkdirSync(LETTERS_DIR, { recursive: true })
  }

  const posts = wxrPath
    ? await loadFromWxr(wxrPath)
    : await fetchAllWpComPosts()

  let written = 0
  let skipped = 0

  for (const post of posts) {
    const slug = post.slug
    if (!slug) {
      console.warn('Skip post without slug', post.ID)
      continue
    }

    const target = pathForSlug(slug)
    if (fs.existsSync(target)) {
      console.warn(`Skip (file exists): ${slug}`)
      skipped += 1
      continue
    }

    const title = plainTitle(post.title)
    const dateRaw = post.date
    const dateIso =
      dateRaw && !Number.isNaN(new Date(dateRaw).getTime())
        ? new Date(dateRaw).toISOString().slice(0, 10)
        : '1970-01-01'

    const excerptPlain =
      stripTags(post.excerpt ?? '').slice(0, 500) ||
      stripTags(post.content ?? '').slice(0, 200)

    const bodyMd =
      fixAngleBracketUrls(await htmlToMarkdown(post.content ?? '')) + '\n'
    const front = buildFrontmatter({
      title,
      date: dateIso,
      slug,
      excerpt: excerptPlain,
      wpId: post.ID,
    })

    const out = front + bodyMd

    if (dryRun) {
      console.log(`[dry-run] would write ${target} (${title})`)
      written += 1
      continue
    }

    fs.writeFileSync(target, out, 'utf8')
    console.log(`Wrote ${target}`)
    written += 1
  }

  console.log(`Done. Wrote ${written}, skipped ${skipped}, fetched ${posts.length}.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
