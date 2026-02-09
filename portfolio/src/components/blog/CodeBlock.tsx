'use client'

import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  'data-language'?: string
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const language = props['data-language']

  const handleCopy = useCallback(async () => {
    const code = extractText(children)
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }, [children])

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden">
      {language && (
        <div
          className="flex items-center justify-between px-4 py-2 text-xs font-mono"
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          <span>{language}</span>
          <button
            onClick={handleCopy}
            className={cn(
              'px-2 py-1 rounded text-xs transition-colors duration-200 cursor-pointer',
              'hover:bg-[var(--bg-tertiary)]'
            )}
            style={{ color: 'var(--text-muted)' }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre
        className={cn('overflow-x-auto p-4 text-sm leading-relaxed', className)}
        style={{ background: 'var(--bg-elevated)', margin: 0 }}
      >
        {children}
      </pre>
    </div>
  )
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (!node) return ''
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (typeof node === 'object' && node !== null && 'props' in node) {
    const element = node as { props?: { children?: React.ReactNode } }
    return extractText(element.props?.children)
  }
  return ''
}
