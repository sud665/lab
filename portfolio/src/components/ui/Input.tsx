'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3 py-2 text-sm',
            'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            'transition-colors duration-200',
            'focus:border-[var(--border-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, type InputProps }
