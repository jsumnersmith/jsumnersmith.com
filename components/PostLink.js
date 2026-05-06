import Link from 'next/link'

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

export default function PostLink({ title, href, date, excerpt }) {
  const label =
    typeof title === 'string' ? title : href?.replace(/^\//, '') ?? 'Post'
  const dateLine = formatDate(date)

  return (
    <article className="mb-10">
      <header>
        <h2 className="mb-1 text-xl font-semibold leading-snug">
          <Link
            href={href}
            className="mb-3 block underline-wave decoration-blue-800 dark:decoration-yellow-500"
          >
            {label}
          </Link>
        </h2>
        {dateLine ? (
          <time className="text-sm text-neutral-500 dark:text-neutral-400">
            {dateLine}
          </time>
        ) : null}
      </header>
      {excerpt ? (
        <section className="mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300">
          {excerpt}
        </section>
      ) : null}
    </article>
  )
}
