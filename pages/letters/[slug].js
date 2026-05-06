import Head from 'next/head'
import { MDXRemote } from 'next-mdx-remote'
import Wrapper from '@/components/Wrapper'
import BackLink from '@/components/BackLink'
import { mdxComponents } from '@/components/mdx-components'
import {
  getLetterByRouteKey,
  getAllLetterRouteKeys,
  serializeMdx,
} from '@/lib/mdx-content'
export default function LetterPost({ source, title, excerpt }) {
  return (
    <>
      <Head>
        <title>{`${title} — Letters`}</title>
        {excerpt ? (
          <meta name="description" content={String(excerpt).slice(0, 160)} />
        ) : null}
      </Head>
      <Wrapper>
        <article className="max-w-2xl">
          <BackLink href="/letters" title="Letters" />
          <h1 className="mb-8 text-3xl font-bold leading-snug">{title}</h1>
          <div className="letters-content">
            <MDXRemote {...source} components={mdxComponents} />
          </div>
        </article>
      </Wrapper>
    </>
  )
}

export async function getStaticPaths() {
  const keys = getAllLetterRouteKeys()
  return {
    paths: keys.map((slug) => ({ params: { slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = getLetterByRouteKey(params.slug)
  if (!post) return { notFound: true }

  const source = await serializeMdx(post.body)

  return {
    props: {
      source,
      title: post.data.title ?? params.slug,
      excerpt: post.data.excerpt ?? null,
    },
  }
}
