import Image from 'next/image'
import Link from 'next/link'
import darkNotes from '../public/dark-notes.png'
import lightNotes from '../public/light-notes.png'
import darkBook from '../public/dark-book.png'
import lightBook from '../public/light-book.png'

const PageHeaderContent = ({title, description}) => {
  let imgLight = lightBook;
  let imgDark = darkBook; 
  if (title === 'Notes') {
    imgLight = lightNotes;
    imgDark = darkNotes; 
  } 
  return (
    <div className="flex">
      <div className="min-w-[170px] p-6">
        <picture className="w-[100%]">
          <source srcSet={imgDark.src} media="(prefers-color-scheme: dark)" />
          <Image
              src={imgLight}
              alt={`A page-level icon - ${title}`}
              width={100}
              height={100}
          />
        </picture>
      </div>
      <div className="py-6 pr-6">
        <h2 className="text-2xl underline-wave font-bold mb-3">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
};

const PageHeader = ({link, title, description}) => (
  <>
    { link ? <Link href={link} className="border-gray-200 border flex cursor-pointer mb-6"><PageHeaderContent title={title} description={description}/></Link>
            : <div className="border-transparent border"><PageHeaderContent title={title} description={description}/></div> }
  </>
);

export default PageHeader;