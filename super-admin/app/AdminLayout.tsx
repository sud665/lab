'use client'

import { useState } from 'react'
import { Sidebar, Header } from '@/components/layout'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Header sidebarCollapsed={collapsed} />
      <main
        className="p-6 transition-all duration-300"
        style={{
          marginLeft: collapsed ? '64px' : '256px',
        }}
      >
        {children}
      </main>
    </div>
  )
}
