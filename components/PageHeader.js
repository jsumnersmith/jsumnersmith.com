import Link from 'next/link'

const PageHeaderContent = ({ title, description }) => {
  const isNotes = title === 'Notes'
  const imgLight = isNotes ? '/light-notes.png' : '/light-book.png'
  const imgDark = isNotes ? '/dark-notes.png' : '/dark-book.png'

  return (
    <div className="flex">
      <div className="min-w-[170px] p-6">
        <picture className="block w-full">
          <source srcSet={imgDark} media="(prefers-color-scheme: dark)" />
          <img
            src={imgLight}
            alt={`A page-level icon — ${title}`}
            width={100}
            height={100}
            className="h-auto w-[100px]"
          />
        </picture>
      </div>
      <div className="py-6 pr-6">
        <h2 className="mb-3 text-2xl font-bold underline-wave">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

const cardBorderClass =
  'border border-neutral-300 dark:border-neutral-600 rounded-md'

const PageHeader = ({ link, title, description }) => (
  <>
    {link ? (
      <Link
        href={link}
        className={`${cardBorderClass} mb-6 flex cursor-pointer text-inherit no-underline transition-colors hover:border-neutral-500 dark:hover:border-neutral-400`}
      >
        <PageHeaderContent title={title} description={description} />
      </Link>
    ) : (
      <div className={`${cardBorderClass} mb-6 border-transparent`}>
        <PageHeaderContent title={title} description={description} />
      </div>
    )}
  </>
)

export default PageHeader
