'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^#{2,3}\s+(.+)$/gm
  const headings: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim()
    const level = match[0].indexOf(' ')
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')

    headings.push({ id, text, level })
  }

  return headings
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const headings = extractHeadings(content)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px', threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav
      className="sticky top-24 hidden xl:block"
      style={{ maxHeight: 'calc(100vh - 8rem)' }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: 'var(--text-muted)' }}
      >
        On this page
      </p>
      <ul className="flex flex-col gap-1 list-none p-0 m-0">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <button
              onClick={() => handleClick(id)}
              className="text-left text-sm py-1 transition-colors duration-200 cursor-pointer bg-transparent border-none w-full"
              style={{
                paddingLeft: level === 3 ? '1rem' : '0',
                color: activeId === id ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: activeId === id ? 500 : 400,
              }}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
