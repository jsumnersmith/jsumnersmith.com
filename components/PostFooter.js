import Link from 'next/link'

export default function PostFooter({ previous, next }) {
  return (
    <footer className="mt-10 border-t border-neutral-200 pt-6 dark:border-neutral-700">
      <ul className="flex list-none flex-wrap justify-between gap-4 p-0">
        <li>
          {previous ? (
            <Link href={previous.href} rel="prev" className="underline-wave">
              ← {previous.title}
            </Link>
          ) : null}
        </li>
        <li>
          {next ? (
            <Link href={next.href} rel="next" className="underline-wave">
              {next.title} →
            </Link>
          ) : null}
        </li>
      </ul>
    </footer>
  )
}
