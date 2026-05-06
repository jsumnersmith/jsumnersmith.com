import Link from 'next/link'

export default function BackLink({ href, title }) {
  return (
    <Link
      href={href}
      className="mb-6 flex max-w-xl items-center gap-2 text-inherit no-underline hover:opacity-80"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center" aria-hidden>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </span>
      <span className="text-lg font-medium underline-wave">{title}</span>
    </Link>
  )
}
