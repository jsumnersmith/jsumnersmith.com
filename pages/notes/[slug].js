import { useRouter } from 'next/router'
import Wrapper from "@/components/Wrapper";
import { getNoteBySlug, getAllNotes } from '../../lib/api'
import markdownToHtml from "@/lib/markdownToHTML";
import ReactMarkdown from 'react-markdown'

const NotesPost = ({note}) => (
  <Wrapper>
    <article>
      <h2 className="text-xl font-bold underline-wave">{note.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: note.content }}></div>

    </article>
  </Wrapper>
);

export async function getStaticProps({ params }) {
  const note = getNoteBySlug(params.slug, [
    'title',
    'slug',
    'content',
  ])
  const content = await markdownToHtml(note.content || '')

  return {
    props: {
      note: {
        ...note,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllNotes(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}

export default NotesPost;