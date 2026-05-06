import Link from 'next/link'

function mergeClassNames(base, extra) {
  if (!extra) return base
  return `${base} ${extra}`.trim()
}

function InnerLink({ href, to, children, className, ...rest }) {
  const target = href ?? to
  if (!target) return <span className={className}>{children}</span>
  const internal = /^\/(?!\/)/.test(target)
  if (internal) {
    return (
      <Link
        href={target}
        className={mergeClassNames('underline-wave', className)}
        {...rest}
      >
        {children}
      </Link>
    )
  }
  return (
    <a
      href={target}
      className={mergeClassNames('underline-wave', className)}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </a>
  )
}

/** Pass to MDXRemote `components` prop (notes + letters). */
export const mdxComponents = {
  Link: InnerLink,
  a: (props) => <InnerLink {...props} />,
  h2: (props) => (
    <h2 className="mt-8 mb-3 text-xl font-semibold leading-snug" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-6 mb-2 text-lg font-semibold leading-snug" {...props} />
  ),
  h4: (props) => (
    <h4 className="mt-4 mb-2 text-base font-semibold" {...props} />
  ),
  p: (props) => (
    <p className="mb-4 leading-relaxed text-[rgb(var(--foreground-rgb))]" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-4 border-neutral-400 pl-4 italic dark:border-neutral-600"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="mb-4 list-disc space-y-1 pl-6" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-4 list-decimal space-y-1 pl-6" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  hr: (props) => (
    <hr className="my-8 border-neutral-300 dark:border-neutral-600" {...props} />
  ),
  strong: (props) => <strong className="font-semibold" {...props} />,
  table: (props) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-neutral-300 bg-neutral-100 px-2 py-1 dark:border-neutral-600 dark:bg-neutral-800"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border border-neutral-300 px-2 py-1 dark:border-neutral-600"
      {...props}
    />
  ),
}
