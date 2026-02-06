'use client'

import { ThemeToggle } from '@/components/providers'

interface HeaderProps {
  sidebarCollapsed?: boolean
  onMenuClick?: () => void
}

export function Header({ sidebarCollapsed, onMenuClick }: HeaderProps) {
  return (
    <header
      className="h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-default)] flex items-center justify-between px-6 sticky top-0 z-30"
      style={{
        marginLeft: sidebarCollapsed ? '64px' : '256px',
        width: sidebarCollapsed ? 'calc(100% - 64px)' : 'calc(100% - 256px)',
        transition: 'margin-left 0.3s, width 0.3s',
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Idea Validation Hub</h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
          <span className="text-sm font-medium">M</span>
        </div>
      </div>
    </header>
  )
}
