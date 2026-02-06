'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface SelectProps {
  options: Option[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
}

export function Select({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  label,
  error,
  disabled,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg text-left',
            'bg-[var(--bg-tertiary)] border border-[var(--border-default)]',
            'flex items-center justify-between',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            open && 'border-[var(--border-focus)]',
            error && 'border-[var(--color-danger)]'
          )}
        >
          <span className={cn(!selected && 'text-[var(--text-muted)]')}>
            {selected?.label || placeholder}
          </span>
          <svg
            className={cn('w-5 h-5 transition-transform', open && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-50 w-full mt-1 py-1 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg shadow-lg animate-slide-up">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange?.(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-tertiary)] transition-colors',
                  opt.value === value && 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-[var(--color-danger)]">{error}</p>}
    </div>
  )
}
