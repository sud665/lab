'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Avatar } from '@/components/ui'
import { navigationConfig, toSidebarItems } from '@/config'

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const sidebarItems = toSidebarItems(navigationConfig, pathname)

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        logo={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-white/5 md:hidden"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <span className="font-semibold">{title || navigationConfig.title}</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-secondary)]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <Avatar size="sm" fallback="AD" />
          </div>
        }
        sticky
      />

      <div className="flex-1 flex">
        <div className="hidden md:block">
          <Sidebar
            items={sidebarItems}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            className="h-[calc(100vh-64px)] sticky top-16"
          />
        </div>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
