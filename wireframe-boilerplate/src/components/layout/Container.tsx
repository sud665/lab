import { cn } from '@/lib/utils'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Container({
  className,
  size = 'lg',
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto px-4',
        size === 'sm' && 'max-w-2xl',
        size === 'md' && 'max-w-4xl',
        size === 'lg' && 'max-w-6xl',
        size === 'xl' && 'max-w-7xl',
        size === 'full' && 'max-w-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
