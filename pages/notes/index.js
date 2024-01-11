import Link from "next/link";
import Wrapper from "@/components/Wrapper";
import PageHeader from "@/components/PageHeader";
import { getAllNotes } from "@/lib/api";
const Index = ({allNotes}) => (
  <Wrapper> 
    <PageHeader 
      title="Notes" 
      description="Synthetic thoughts from reading and experience about product, strategy, and technology."/>
      <div>
        {
          allNotes?.map(note => (
            <div className="mb-5" key={note.title}>
              <h2 className="text-xl font-bold underline-wave"><Link href={`/notes/${note.slug}`}>{note.title}</Link></h2>
              <p>{note.excerpt}</p>
            </div>
          ))
        }
      </div>
  </Wrapper>
);  

export default Index;

export const getStaticProps = async () => {
  const allNotes = getAllNotes([
    'title',
    'slug',
    'category',
    'excerpt',
  ])

  return {
    props: { allNotes },
  }
}