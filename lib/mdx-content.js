import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')
const LETTERS_DIR = path.join(process.cwd(), 'src/letters')

/** Remove Gatsby-era `import … from …` lines so MDX compiles without resolving modules. */
export function stripMdxImportLines(source) {
  return source
    .split('\n')
    .filter((line) => !/^\s*import\s+/.test(line))
    .join('\n')
}

function parsePostDate(d) {
  if (!d) return 0
  const t = new Date(d).getTime()
  return Number.isNaN(t) ? 0 : t
}

/** gray-matter YAML dates become Date objects — Next props must be JSON-serializable. */
function normalizeDateForProps(d) {
  if (d == null) return null
  if (d instanceof Date) return d.toISOString().slice(0, 10)
  if (typeof d === 'string') return d
  return String(d)
}

export function getNoteSlugFromFilename(filename) {
  return filename.replace(/\.mdx?$/i, '')
}

export function getNoteHref(slug) {
  return `/notes/${slug}`
}

export function getLetterRouteKeyFromSlug(frontmatterSlug) {
  if (!frontmatterSlug) return null
  const s = String(frontmatterSlug)
    .replace(/^\/letters\/?/i, '')
    .replace(/\/+$/, '')
  return s || null
}

export function getLetterHref(routeKey) {
  return `/letters/${routeKey}`
}

function readMdxFilenames(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
}

export function getAllNotesMeta() {
  const files = readMdxFilenames(POSTS_DIR)
  const items = files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
    const { data } = matter(raw)
    const slug = getNoteSlugFromFilename(file)
    return {
      slug,
      href: getNoteHref(slug),
      title: data.title ?? slug,
      date: normalizeDateForProps(data.date),
      excerpt: data.excerpt ?? null,
      sortTime: parsePostDate(data.date),
    }
  })
  items.sort((a, b) => b.sortTime - a.sortTime)
  return items
}

export function getAllLettersMeta() {
  const files = readMdxFilenames(LETTERS_DIR)
  const items = []
  for (const file of files) {
    const raw = fs.readFileSync(path.join(LETTERS_DIR, file), 'utf8')
    const { data } = matter(raw)
    if (data.draft === true) continue
    const routeKey =
      getLetterRouteKeyFromSlug(data.slug) ?? getNoteSlugFromFilename(file)
    if (!routeKey) continue
    items.push({
      routeKey,
      href: getLetterHref(routeKey),
      title: data.title ?? routeKey,
      date: normalizeDateForProps(data.date),
      excerpt: data.excerpt ?? null,
      sortTime: parsePostDate(data.date),
    })
  }
  items.sort((a, b) => b.sortTime - a.sortTime)
  return items
}

export function getNoteBySlug(slug) {
  const file = `${slug}.mdx`
  const full = path.join(POSTS_DIR, file)
  if (!fs.existsSync(full)) return null
  const raw = fs.readFileSync(full, 'utf8')
  const { data, content } = matter(raw)
  const body = stripMdxImportLines(content)
  return { data, body, slug }
}

export function getLetterByRouteKey(routeKey) {
  const files = readMdxFilenames(LETTERS_DIR)
  for (const file of files) {
    const raw = fs.readFileSync(path.join(LETTERS_DIR, file), 'utf8')
    const { data, content } = matter(raw)
    if (data.draft === true) continue
    const key =
      getLetterRouteKeyFromSlug(data.slug) ?? getNoteSlugFromFilename(file)
    if (key === routeKey) {
      return { data, body: stripMdxImportLines(content), routeKey: key }
    }
  }
  return null
}

/** List is newest-first. Previous = older article; next = newer. */
export function getAdjacentNotes(currentSlug) {
  const all = getAllNotesMeta()
  const idx = all.findIndex((n) => n.slug === currentSlug)
  if (idx === -1) return { previous: null, next: null }
  const older = all[idx + 1]
  const newer = all[idx - 1]
  return {
    previous: older
      ? { slug: older.slug, title: older.title, href: older.href }
      : null,
    next: newer ? { slug: newer.slug, title: newer.title, href: newer.href } : null,
  }
}

export function getAllNoteSlugs() {
  return getAllNotesMeta().map((n) => n.slug)
}

export function getAllLetterRouteKeys() {
  return getAllLettersMeta().map((l) => l.routeKey)
}

const mdxSerializeOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    format: 'mdx',
  },
}

export function serializeMdx(source) {
  return serialize(source, mdxSerializeOptions)
}
