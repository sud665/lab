'use client'

import { Card, Badge, Avatar, Button } from '@/components/ui'
import { Chart } from '@/components/ui/Chart'
import type { ChartDataPoint, ChartType } from '@/components/ui/Chart'

interface StatCard {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down'
}

interface ChartConfig {
  title: string
  type: ChartType
  data: ChartDataPoint[]
  height?: number
}

interface ActivityItem {
  user: string
  action: string
  time: string
}

interface DashboardPatternProps {
  welcomeMessage?: string
  welcomeSubtext?: string
  stats: StatCard[]
  charts?: ChartConfig[]
  recentActivity?: ActivityItem[]
}

export function DashboardPattern({
  welcomeMessage = '안녕하세요',
  welcomeSubtext = '오늘의 현황을 확인하세요.',
  stats,
  charts,
  recentActivity,
}: DashboardPatternProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">{welcomeMessage}</h1>
        <p className="text-[var(--text-secondary)]">{welcomeSubtext}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--text-secondary)]">{stat.label}</span>
              {stat.change && (
                <Badge size="sm" variant={stat.trend === 'down' ? 'outline' : 'default'}>
                  {stat.change}
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {charts && charts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {charts.map((chart) => (
            <Card key={chart.title} header={<h2 className="font-semibold">{chart.title}</h2>}>
              <Chart
                type={chart.type}
                data={chart.data}
                height={chart.height || 250}
                showLegend={chart.type === 'pie'}
              />
            </Card>
          ))}
        </div>
      )}

      {recentActivity && recentActivity.length > 0 && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">최근 활동</h2>
              <Button variant="ghost" size="sm">전체 보기</Button>
            </div>
          }
        >
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <Avatar size="sm" fallback={activity.user.slice(0, 1)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-[var(--text-secondary)]">{activity.action}</span>
                  </p>
                </div>
                <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
