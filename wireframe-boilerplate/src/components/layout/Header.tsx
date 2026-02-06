import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { NavItem } from '@/types'

export interface HeaderProps {
  logo?: React.ReactNode
  navigation?: NavItem[]
  actions?: React.ReactNode
  sticky?: boolean
  className?: string
}

export function Header({
  logo,
  navigation,
  actions,
  sticky = false,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'w-full border-b border-neutral-800 bg-black/80 backdrop-blur-sm',
        sticky && 'sticky top-0 z-40',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          {logo || (
            <Link href="/" className="text-lg font-semibold">
              Wireframe
            </Link>
          )}

          {/* Navigation */}
          {navigation && navigation.length > 0 && (
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    item.active
                      ? 'text-white bg-white/10'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
