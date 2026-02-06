'use client'

import { DashboardPattern } from '@/components/patterns'
import {
  mockStats,
  mockMonthlyRevenue,
  mockMemberGrowth,
  mockCategoryDistribution,
  mockRecentActivities,
  formatDateTime,
} from '@/data/mock'

export default function DashboardPage() {
  const stats = mockStats.map((s) => ({
    label: s.label,
    value: s.value,
    change: s.change,
    trend: s.changeType === 'neutral' ? undefined : (s.changeType as 'up' | 'down'),
  }))

  const charts = [
    {
      title: '월간 매출',
      type: 'bar' as const,
      data: mockMonthlyRevenue,
    },
    {
      title: '회원 성장 추이',
      type: 'line' as const,
      data: mockMemberGrowth,
    },
    {
      title: '카테고리별 분포',
      type: 'pie' as const,
      data: mockCategoryDistribution.map((c) => ({
        name: c.name,
        value: c.value,
      })),
    },
  ]

  const recentActivity = mockRecentActivities.map((a) => ({
    user: a.user,
    action: `${a.action} - ${a.target}`,
    time: formatDateTime(a.timestamp),
  }))

  return (
    <DashboardPattern
      welcomeMessage="대시보드"
      welcomeSubtext="오늘의 현황을 한눈에 확인하세요."
      stats={stats}
      charts={charts}
      recentActivity={recentActivity}
    />
  )
}
