'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui'
import { formatNumber, formatPercent, formatDuration, cn } from '@/lib/utils'
import { mockServiceRankings } from '@/lib/mockData'

export default function RankingPage() {
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])

  const top3 = mockServiceRankings.slice(0, 3)
  const rest = mockServiceRankings.slice(3)

  const toggleSelection = (id: string) => {
    setSelectedForComparison((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ranking</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            트래픽 기준 서비스 순위 | Top 3를 선정하세요
          </p>
        </div>
        {selectedForComparison.length >= 2 && (
          <Link href={`/analytics?compare=${selectedForComparison.join(',')}`}>
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {selectedForComparison.length}개 서비스 비교
            </Button>
          </Link>
        )}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {top3.map((item, index) => (
          <Card
            key={item.service.id}
            className={cn(
              'relative overflow-hidden transition-all',
              index === 0 && 'ring-2 ring-yellow-500/50 bg-yellow-500/5',
              index === 1 && 'ring-2 ring-gray-400/50 bg-gray-400/5',
              index === 2 && 'ring-2 ring-amber-600/50 bg-amber-600/5',
              selectedForComparison.includes(item.service.id) && 'ring-2 ring-[var(--color-info)]'
            )}
          >
            <div
              className={cn(
                'absolute top-0 right-0 w-20 h-20 flex items-center justify-center text-4xl font-bold opacity-10',
                index === 0 && 'text-yellow-500',
                index === 1 && 'text-gray-400',
                index === 2 && 'text-amber-600'
              )}
            >
              {item.rank}
            </div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl',
                    index === 0 && 'bg-yellow-500/20 text-yellow-500',
                    index === 1 && 'bg-gray-400/20 text-gray-400',
                    index === 2 && 'bg-amber-600/20 text-amber-600'
                  )}
                >
                  {item.rank}
                </div>
                <div>
                  <CardTitle>{item.service.name}</CardTitle>
                  <p className="text-sm text-[var(--text-muted)]">{item.service.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-[var(--text-secondary)]">방문자</div>
                  <div className="text-xl font-bold">{formatNumber(item.totalVisitors)}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--text-secondary)]">페이지뷰</div>
                  <div className="text-xl font-bold">{formatNumber(item.totalPageViews)}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--text-secondary)]">체류시간</div>
                  <div className="text-xl font-bold">{formatDuration(item.avgSessionDuration)}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--text-secondary)]">추세</div>
                  <Badge variant={item.trend > 0 ? 'success' : 'danger'} className="mt-1">
                    {formatPercent(item.trend)}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedForComparison.includes(item.service.id) ? 'solid' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleSelection(item.service.id)}
                >
                  {selectedForComparison.includes(item.service.id) ? '선택됨' : '비교 선택'}
                </Button>
                <Link href={`/analytics?service=${item.service.id}`} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">
                    상세보기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Decision Helper */}
      <Card className="bg-gradient-to-r from-[var(--chart-1)]/10 to-[var(--chart-2)]/10 border-[var(--chart-1)]/30">
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--chart-1)]/20 rounded-full">
              <svg className="w-6 h-6 text-[var(--chart-1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">다음 단계: Top 3 서비스를 선택하세요</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                현재 <strong>AI Photo Editor</strong>와 <strong>Habit Tracker</strong>가 가장 높은 성과를 보이고 있습니다.
                2주 더 테스트 후 최종 1개를 선정하는 것을 권장합니다.
              </p>
            </div>
            <Button variant="outline">
              A/B 테스트 시작
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rest of Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>전체 순위</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-default)]">
                  <th className="px-6 py-3 font-medium">순위</th>
                  <th className="px-6 py-3 font-medium">서비스</th>
                  <th className="px-6 py-3 font-medium text-right">방문자</th>
                  <th className="px-6 py-3 font-medium text-right">페이지뷰</th>
                  <th className="px-6 py-3 font-medium text-right">체류시간</th>
                  <th className="px-6 py-3 font-medium text-right">이탈률</th>
                  <th className="px-6 py-3 font-medium text-right">추세</th>
                  <th className="px-6 py-3 font-medium text-right">비교</th>
                </tr>
              </thead>
              <tbody>
                {mockServiceRankings.map((item) => (
                  <tr
                    key={item.service.id}
                    className={cn(
                      'border-b border-[var(--border-default)] last:border-0 transition-colors',
                      selectedForComparison.includes(item.service.id) && 'bg-[var(--color-info)]/5'
                    )}
                  >
                    <td className="px-6 py-4">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                          item.rank === 1 && 'bg-yellow-500/20 text-yellow-500',
                          item.rank === 2 && 'bg-gray-400/20 text-gray-400',
                          item.rank === 3 && 'bg-amber-600/20 text-amber-600',
                          item.rank > 3 && 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                        )}
                      >
                        {item.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{item.service.name}</div>
                        <div className="text-sm text-[var(--text-muted)]">{item.service.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono">{formatNumber(item.totalVisitors)}</td>
                    <td className="px-6 py-4 text-right font-mono">{formatNumber(item.totalPageViews)}</td>
                    <td className="px-6 py-4 text-right font-mono">{formatDuration(item.avgSessionDuration)}</td>
                    <td className="px-6 py-4 text-right font-mono">{item.bounceRate}%</td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant={item.trend > 0 ? 'success' : 'danger'} size="sm">
                        {formatPercent(item.trend)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <input
                        type="checkbox"
                        checked={selectedForComparison.includes(item.service.id)}
                        onChange={() => toggleSelection(item.service.id)}
                        className="w-4 h-4 rounded border-[var(--border-default)] bg-[var(--bg-tertiary)]"
                      />
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
