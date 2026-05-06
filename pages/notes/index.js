import Head from 'next/head'
import Wrapper from '@/components/Wrapper'
import PageHeader from '@/components/PageHeader'
import PostLink from '@/components/PostLink'
import { getAllNotesMeta } from '@/lib/mdx-content'

const DESCRIPTION =
  'Synthetic thoughts from reading and experience about product, strategy, and technology.'

export default function NotesIndex({ posts }) {
  return (
    <>
      <Head>
        <title>Notes — Joel Sumner Smith</title>
        <meta name="description" content={DESCRIPTION} />
      </Head>
      <Wrapper>
        <div className="max-w-2xl">
          <PageHeader title="Notes" description={DESCRIPTION} />
          {posts.map((p) => (
            <PostLink
              key={p.slug}
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
  const posts = getAllNotesMeta()
  return { props: { posts } }
}
