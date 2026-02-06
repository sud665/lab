import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  header?: React.ReactNode
  footer?: React.ReactNode
}

export function Card({
  className,
  variant = 'default',
  padding = 'md',
  header,
  footer,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl transition-colors',
        // Variants
        variant === 'default' && 'bg-neutral-950 border border-neutral-800',
        variant === 'elevated' && 'bg-neutral-900 shadow-lg shadow-black/50',
        variant === 'outlined' && 'bg-transparent border border-neutral-800',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-4 py-3 border-b border-neutral-800">
          {header}
        </div>
      )}
      <div
        className={cn(
          padding === 'none' && 'p-0',
          padding === 'sm' && 'p-3',
          padding === 'md' && 'p-4',
          padding === 'lg' && 'p-6'
        )}
      >
        {children}
      </div>
      {footer && (
        <div className="px-4 py-3 border-t border-neutral-800">
          {footer}
        </div>
      )}
    </div>
  )
}
