'use client'

import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]',
        'transition-all duration-300',
        'hover:border-[var(--border-hover)] hover:shadow-lg hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  )
}
