import { cn } from '@/lib/utils'

const variants = {
  default:
    'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-default)]',
  accent:
    'bg-[var(--accent-muted)] text-[var(--accent)] border-transparent',
  success:
    'bg-emerald-500/10 text-emerald-400 border-transparent',
  warning:
    'bg-amber-500/10 text-amber-400 border-transparent',
} as const

interface BadgeProps {
  children: React.ReactNode
  variant?: keyof typeof variants
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
