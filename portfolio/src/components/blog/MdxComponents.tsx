import { CodeBlock } from './CodeBlock'

/* eslint-disable @typescript-eslint/no-explicit-any */

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as const
  const sizes: Record<number, string> = {
    1: 'text-3xl font-bold mt-10 mb-4',
    2: 'text-2xl font-bold mt-8 mb-3',
    3: 'text-xl font-semibold mt-6 mb-2',
    4: 'text-lg font-semibold mt-5 mb-2',
    5: 'text-base font-semibold mt-4 mb-1',
    6: 'text-sm font-semibold mt-4 mb-1',
  }

  function Heading({ children, ...props }: any) {
    const id =
      typeof children === 'string'
        ? children
            .toLowerCase()
            .replace(/[^a-z0-9가-힣\s-]/g, '')
            .replace(/\s+/g, '-')
        : undefined

    return (
      <Tag
        id={id}
        className={`group scroll-mt-24 ${sizes[level]}`}
        style={{ color: 'var(--text-primary)' }}
        {...props}
      >
        {children}
        {id && (
          <a
            href={`#${id}`}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity no-underline"
            style={{ color: 'var(--text-muted)' }}
            aria-label={`Link to ${typeof children === 'string' ? children : 'heading'}`}
          >
            #
          </a>
        )}
      </Tag>
    )
  }

  Heading.displayName = `Heading${level}`
  return Heading
}

export const mdxComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),

  p: ({ children, ...props }: any) => (
    <p
      className="my-4 leading-relaxed"
      style={{ color: 'var(--text-secondary)' }}
      {...props}
    >
      {children}
    </p>
  ),

  a: ({ href, children, ...props }: any) => {
    const isExternal = href?.startsWith('http')
    return (
      <a
        href={href}
        className="font-medium underline underline-offset-4 transition-colors duration-200"
        style={{ color: 'var(--accent)' }}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
        {isExternal && <span className="inline-block ml-0.5">&nearr;</span>}
      </a>
    )
  },

  blockquote: ({ children, ...props }: any) => (
    <blockquote
      className="my-6 pl-4 italic"
      style={{
        borderLeft: '3px solid var(--accent)',
        color: 'var(--text-secondary)',
      }}
      {...props}
    >
      {children}
    </blockquote>
  ),

  ul: ({ children, ...props }: any) => (
    <ul
      className="my-4 ml-6 list-disc space-y-2"
      style={{ color: 'var(--text-secondary)' }}
      {...props}
    >
      {children}
    </ul>
  ),

  ol: ({ children, ...props }: any) => (
    <ol
      className="my-4 ml-6 list-decimal space-y-2"
      style={{ color: 'var(--text-secondary)' }}
      {...props}
    >
      {children}
    </ol>
  ),

  li: ({ children, ...props }: any) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),

  pre: ({ children, ...props }: any) => (
    <CodeBlock {...props}>{children}</CodeBlock>
  ),

  code: ({ children, className, ...props }: any) => {
    if (!className) {
      return (
        <code
          className="rounded px-1.5 py-0.5 text-sm font-mono"
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--accent)',
          }}
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },

  table: ({ children, ...props }: any) => (
    <div className="my-6 overflow-x-auto rounded-lg" style={{ border: '1px solid var(--border-default)' }}>
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),

  th: ({ children, ...props }: any) => (
    <th
      className="px-4 py-2 text-left font-semibold"
      style={{
        background: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-default)',
      }}
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }: any) => (
    <td
      className="px-4 py-2"
      style={{
        color: 'var(--text-secondary)',
        borderBottom: '1px solid var(--border-default)',
      }}
      {...props}
    >
      {children}
    </td>
  ),

  hr: (props: any) => (
    <hr
      className="my-8"
      style={{ border: 'none', borderTop: '1px solid var(--border-default)' }}
      {...props}
    />
  ),

  img: ({ alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-lg my-6 max-w-full"
      alt={alt ?? ''}
      loading="lazy"
      {...props}
    />
  ),
}
