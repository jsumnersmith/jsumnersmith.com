import Head from 'next/head'
import Wrapper from '@/components/Wrapper'
import PageHeader from '@/components/PageHeader'
import PostLink from '@/components/PostLink'
import { getAllLettersMeta } from '@/lib/mdx-content'

const DESCRIPTION =
  'Marginalia and exposition on literary and human themes.'

export default function LettersIndex({ posts }) {
  return (
    <>
      <Head>
        <title>Letters — Joel Sumner Smith</title>
        <meta name="description" content={DESCRIPTION} />
      </Head>
      <Wrapper>
        <div className="max-w-2xl">
          <PageHeader title="Letters" description={DESCRIPTION} />
          {posts.map((p) => (
            <PostLink
              key={p.routeKey}
              title={p.title}
              href={p.href}
              date={p.date}
              excerpt={p.excerpt}
            />
          ))}
        </div>
      </Wrapper>
    </>
  )
}

export async function getStaticProps() {
  const posts = getAllLettersMeta()
  return { props: { posts } }
}
