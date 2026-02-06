import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md'
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        // Variants
        variant === 'default' && 'bg-white/10 text-neutral-300',
        variant === 'outline' && 'bg-transparent border border-neutral-700 text-neutral-400',
        // Sizes
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-2.5 py-1 text-sm',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
