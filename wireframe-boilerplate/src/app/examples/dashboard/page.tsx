'use client'

import { useState } from 'react'
import { Header, Sidebar, Container } from '@/components/layout'
import { Card, Button, Avatar, Badge } from '@/components/ui'
import type { SidebarItem } from '@/types'

const sidebarItems: SidebarItem[] = [
  {
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    label: 'Dashboard',
    href: '/examples/dashboard',
    active: true,
  },
  {
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    label: 'Users',
    href: '#',
  },
  {
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
    label: 'Analytics',
    href: '#',
  },
  {
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    label: 'Settings',
    href: '#',
  },
]

const stats = [
  { label: 'Total Users', value: '12,345', change: '+12%' },
  { label: 'Page Views', value: '54,321', change: '+8%' },
  { label: 'Uptime', value: '99.9%', change: '+0.1%' },
  { label: 'Revenue', value: '$45,678', change: '+23%' },
]

const activities = [
  { user: 'John Doe', action: 'signed up for an account', time: '2 min ago' },
  { user: 'Jane Smith', action: 'completed an order', time: '5 min ago' },
  { user: 'Bob Wilson', action: 'left a review', time: '10 min ago' },
  { user: 'Alice Brown', action: 'updated their profile', time: '15 min ago' },
  { user: 'Charlie Davis', action: 'made a payment', time: '20 min ago' },
]

export default function DashboardExample() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
            <span className="font-semibold">Dashboard</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-white/5">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <Avatar size="sm" fallback="JD" />
          </div>
        }
        sticky
      />

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            items={sidebarItems}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            className="h-[calc(100vh-64px)] sticky top-16"
          />
        </div>

        {/* Content */}
        <main className="flex-1 p-6">
          <Container size="full">
            {/* Welcome */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome back, John</h1>
              <p className="text-neutral-400">Here&apos;s what&apos;s happening with your projects today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-400">{stat.label}</span>
                    <Badge size="sm">{stat.change}</Badge>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </Card>
              ))}
            </div>

            {/* Activity */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Recent Activity</h2>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              }
            >
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Avatar size="sm" fallback={activity.user.split(' ').map(n => n[0]).join('')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-neutral-400">{activity.action}</span>
                      </p>
                    </div>
                    <span className="text-xs text-neutral-500 whitespace-nowrap">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Container>
        </main>
      </div>
    </div>
  )
}
