'use client'

import { Card, CardHeader, CardTitle, CardContent, Badge, Chart, MultiLineChart } from '@/components/ui'
import { formatNumber, formatPercent, formatDuration } from '@/lib/utils'
import { mockDailyStats, mockServiceRankings, mockTrafficSources, mockServiceComparison } from '@/lib/mockData'
import Link from 'next/link'

const statsCards = [
  {
    title: '총 방문자',
    value: 58500,
    change: 12.5,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
  },
  {
    title: '페이지뷰',
    value: 162000,
    change: 8.3,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: '평균 체류시간',
    value: 178,
    change: 5.2,
    isTime: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: '활성 서비스',
    value: 8,
    change: 0,
    total: 10,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">아이디어 검증 현황을 한눈에 확인하세요</p>
        </div>
        <Link
          href="/services/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 서비스 추가
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="hover:border-[var(--border-hover)] transition-colors">
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[var(--text-secondary)] text-sm">{stat.title}</span>
                <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg">{stat.icon}</div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">
                  {stat.isTime ? formatDuration(stat.value) : stat.total ? `${stat.value}/${stat.total}` : formatNumber(stat.value)}
                </span>
                {stat.change !== 0 && (
                  <Badge variant={stat.change > 0 ? 'success' : 'danger'} size="sm">
                    {formatPercent(stat.change)}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>일별 트래픽 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="area"
              data={mockDailyStats.map((d) => ({ name: d.date, value: d.visitors }))}
              height={280}
            />
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>유입 경로</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart type="pie" data={mockTrafficSources} height={280} />
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Comparison */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top 3 서비스 비교</CardTitle>
            <Link href="/ranking" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              전체 랭킹 보기 →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <MultiLineChart
            data={mockServiceComparison}
            lines={[
              { dataKey: 'AI Photo Editor', name: 'AI Photo Editor', color: 'var(--chart-1)' },
              { dataKey: 'Habit Tracker', name: 'Habit Tracker', color: 'var(--chart-2)' },
              { dataKey: 'Budget Tracker', name: 'Budget Tracker', color: 'var(--chart-3)' },
            ]}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Service Rankings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>서비스 랭킹</CardTitle>
            <Link href="/services" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              전체 서비스 관리 →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-default)]">
                  <th className="pb-3 font-medium">순위</th>
                  <th className="pb-3 font-medium">서비스</th>
                  <th className="pb-3 font-medium text-right">방문자</th>
                  <th className="pb-3 font-medium text-right">페이지뷰</th>
                  <th className="pb-3 font-medium text-right">체류시간</th>
                  <th className="pb-3 font-medium text-right">이탈률</th>
                  <th className="pb-3 font-medium text-right">추세</th>
                </tr>
              </thead>
              <tbody>
                {mockServiceRankings.slice(0, 5).map((item) => (
                  <tr key={item.service.id} className="border-b border-[var(--border-default)] last:border-0">
                    <td className="py-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${item.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : ''}
                        ${item.rank === 2 ? 'bg-gray-400/20 text-gray-400' : ''}
                        ${item.rank === 3 ? 'bg-amber-600/20 text-amber-600' : ''}
                        ${item.rank > 3 ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]' : ''}
                      `}>
                        {item.rank}
                      </div>
                    </td>
                    <td className="py-4">
                      <div>
                        <div className="font-medium">{item.service.name}</div>
                        <div className="text-sm text-[var(--text-muted)]">{item.service.description}</div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-mono">{formatNumber(item.totalVisitors)}</td>
                    <td className="py-4 text-right font-mono">{formatNumber(item.totalPageViews)}</td>
                    <td className="py-4 text-right font-mono">{formatDuration(item.avgSessionDuration)}</td>
                    <td className="py-4 text-right font-mono">{item.bounceRate}%</td>
                    <td className="py-4 text-right">
                      <Badge variant={item.trend > 0 ? 'success' : 'danger'} size="sm">
                        {formatPercent(item.trend)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
