'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  primary:
    'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-[0.97]',
  secondary:
    'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)]',
  ghost:
    'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
  outline:
    'border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-muted)]',
} as const

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
          'disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button, type ButtonProps }
