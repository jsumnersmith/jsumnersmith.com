import Head from 'next/head'
import Wrapper from '@/components/Wrapper'
import PageHeader from '@/components/PageHeader'

const NOTES_DESC =
  'Synthetic thoughts from reading and experience about product, strategy, and technology.'

const LETTERS_DESC =
  'Marginalia and exposition on literary and human themes.'

export default function Home() {
  return (
    <>
      <Head>
        <title>Joel Sumner Smith</title>
        <meta
          name="description"
          content="Notes on product and strategy; letters on literature and ideas."
        />
      </Head>
      <Wrapper>
        <div className="max-w-2xl">
          <PageHeader
            link="/notes"
            title="Notes"
            description={NOTES_DESC}
          />
          <PageHeader
            link="/letters"
            title="Letters"
            description={LETTERS_DESC}
          />
        </div>
      </Wrapper>
    </>
  )
}
