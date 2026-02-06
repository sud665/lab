'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Select, Chart, MultiLineChart, Badge } from '@/components/ui'
import { formatNumber, formatPercent, formatDuration } from '@/lib/utils'
import { mockServices, mockDailyStats, mockServiceRankings } from '@/lib/mockData'

const periodOptions = [
  { value: '7d', label: '최근 7일' },
  { value: '30d', label: '최근 30일' },
  { value: '90d', label: '최근 90일' },
]

export default function AnalyticsPage() {
  const [selectedService, setSelectedService] = useState<string>('all')
  const [period, setPeriod] = useState('7d')

  const serviceOptions = [
    { value: 'all', label: '전체 서비스' },
    ...mockServices.map((s) => ({ value: s.id, label: s.name })),
  ]

  const selectedRanking = mockServiceRankings.find(
    (r) => r.service.id === selectedService
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-[var(--text-secondary)] mt-1">서비스별 상세 트래픽 분석</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex gap-4">
            <div className="w-64">
              <Select
                label="서비스 선택"
                options={serviceOptions}
                value={selectedService}
                onChange={setSelectedService}
              />
            </div>
            <div className="w-48">
              <Select
                label="기간"
                options={periodOptions}
                value={period}
                onChange={setPeriod}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      {selectedService !== 'all' && selectedRanking ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent>
              <div className="text-sm text-[var(--text-secondary)] mb-1">총 방문자</div>
              <div className="text-2xl font-bold">{formatNumber(selectedRanking.totalVisitors)}</div>
              <Badge variant={selectedRanking.trend > 0 ? 'success' : 'danger'} size="sm" className="mt-2">
                {formatPercent(selectedRanking.trend)}
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-[var(--text-secondary)] mb-1">페이지뷰</div>
              <div className="text-2xl font-bold">{formatNumber(selectedRanking.totalPageViews)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-[var(--text-secondary)] mb-1">평균 체류시간</div>
              <div className="text-2xl font-bold">{formatDuration(selectedRanking.avgSessionDuration)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-[var(--text-secondary)] mb-1">이탈률</div>
              <div className="text-2xl font-bold">{selectedRanking.bounceRate}%</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent>
              <div className="text-sm text-[var(--text-secondary)] mb-1">총 방문자</div>
              <div className="text-2xl font-bold">{formatNumber(58500)}</div>
              <Badge variant="success" size="sm" className="mt-2">+12.5%</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-[var(--text-secondary)] mb-1">총 페이지뷰</div>
              <div className="text-2xl font-bold">{formatNumber(162000)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-[var(--text-secondary)] mb-1">평균 체류시간</div>
              <div className="text-2xl font-bold">{formatDuration(178)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-[var(--text-secondary)] mb-1">평균 이탈률</div>
              <div className="text-2xl font-bold">43%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>일별 방문자 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="area"
              data={mockDailyStats.map((d) => ({ name: d.date, value: d.visitors }))}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>일별 페이지뷰 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="bar"
              data={mockDailyStats.map((d) => ({ name: d.date, value: d.pageViews }))}
              height={300}
              colors={['var(--chart-2)']}
            />
          </CardContent>
        </Card>
      </div>

      {/* Service Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>서비스별 트래픽 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <MultiLineChart
            data={[
              { name: '01/27', 'AI Photo Editor': 420, 'Habit Tracker': 380, 'Budget Tracker': 320, 'Recipe Finder': 280 },
              { name: '01/28', 'AI Photo Editor': 480, 'Habit Tracker': 420, 'Budget Tracker': 350, 'Recipe Finder': 300 },
              { name: '01/29', 'AI Photo Editor': 510, 'Habit Tracker': 460, 'Budget Tracker': 380, 'Recipe Finder': 320 },
              { name: '01/30', 'AI Photo Editor': 550, 'Habit Tracker': 520, 'Budget Tracker': 400, 'Recipe Finder': 350 },
              { name: '01/31', 'AI Photo Editor': 620, 'Habit Tracker': 580, 'Budget Tracker': 420, 'Recipe Finder': 380 },
              { name: '02/01', 'AI Photo Editor': 680, 'Habit Tracker': 650, 'Budget Tracker': 450, 'Recipe Finder': 400 },
              { name: '02/02', 'AI Photo Editor': 750, 'Habit Tracker': 720, 'Budget Tracker': 480, 'Recipe Finder': 430 },
            ]}
            lines={[
              { dataKey: 'AI Photo Editor', name: 'AI Photo Editor', color: 'var(--chart-1)' },
              { dataKey: 'Habit Tracker', name: 'Habit Tracker', color: 'var(--chart-2)' },
              { dataKey: 'Budget Tracker', name: 'Budget Tracker', color: 'var(--chart-3)' },
              { dataKey: 'Recipe Finder', name: 'Recipe Finder', color: 'var(--chart-4)' },
            ]}
            height={350}
          />
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>유입 경로</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="pie"
              data={[
                { name: 'Direct', value: 35 },
                { name: 'Organic Search', value: 28 },
                { name: 'Social', value: 22 },
                { name: 'Referral', value: 15 },
              ]}
              height={280}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>디바이스별 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="pie"
              data={[
                { name: 'Mobile', value: 58 },
                { name: 'Desktop', value: 35 },
                { name: 'Tablet', value: 7 },
              ]}
              height={280}
              colors={['var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)']}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
