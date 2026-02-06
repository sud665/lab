import { cn } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Avatar({
  className,
  src,
  alt = '',
  fallback,
  size = 'md',
  ...props
}: AvatarProps) {
  const initials = fallback?.slice(0, 2).toUpperCase()

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-neutral-800 flex items-center justify-center',
        'text-neutral-400 font-medium',
        size === 'sm' && 'h-8 w-8 text-xs',
        size === 'md' && 'h-10 w-10 text-sm',
        size === 'lg' && 'h-12 w-12 text-base',
        size === 'xl' && 'h-16 w-16 text-lg',
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  )
}
