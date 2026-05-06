import Head from 'next/head'
import { MDXRemote } from 'next-mdx-remote'
import Wrapper from '@/components/Wrapper'
import BackLink from '@/components/BackLink'
import PostFooter from '@/components/PostFooter'
import { mdxComponents } from '@/components/mdx-components'
import {
  getNoteBySlug,
  getAdjacentNotes,
  getAllNoteSlugs,
  serializeMdx,
} from '@/lib/mdx-content'

function formatDate(d) {
  if (!d) return null
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function NotePost({
  source,
  title,
  date,
  excerpt,
  previous,
  next,
}) {
  const dateLine = formatDate(date)

  return (
    <>
      <Head>
        <title>{`${title} — Notes`}</title>
        {excerpt ? (
          <meta name="description" content={String(excerpt).slice(0, 160)} />
        ) : null}
      </Head>
      <Wrapper>
        <article className="max-w-2xl">
          <BackLink href="/notes" title="Notes" />
          <header className="mb-8">
            <h1 className="mb-2 text-3xl font-bold leading-tight">{title}</h1>
            {dateLine ? (
              <time className="text-sm text-neutral-500 dark:text-neutral-400">
                {dateLine}
              </time>
            ) : null}
          </header>
          <div className="prose-note">
            <MDXRemote {...source} components={mdxComponents} />
          </div>
          <PostFooter previous={previous} next={next} />
        </article>
      </Wrapper>
    </>
  )
}

export async function getStaticPaths() {
  const slugs = getAllNoteSlugs()
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = getNoteBySlug(params.slug)
  if (!post) return { notFound: true }

  const source = await serializeMdx(post.body)
  const { previous, next } = getAdjacentNotes(params.slug)

  return {
    props: {
      source,
      title: post.data.title ?? params.slug,
      date:
        post.data.date instanceof Date
          ? post.data.date.toISOString().slice(0, 10)
          : post.data.date ?? null,
      excerpt: post.data.excerpt ?? null,
      previous,
      next,
    },
  }
}
