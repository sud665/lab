'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  loading?: boolean
  emptyMessage?: string
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  onRowClick,
  loading,
  emptyMessage = '데이터가 없습니다.',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey as keyof T]
    const bVal = b[sortKey as keyof T]
    if (aVal === bVal) return 0
    const comparison = aVal > bVal ? 1 : -1
    return sortOrder === 'asc' ? comparison : -comparison
  })

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-[var(--bg-tertiary)] rounded-t-lg mb-1" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-[var(--bg-secondary)] mb-1" />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border-default)]">
      <table className="w-full">
        <thead>
          <tr className="bg-[var(--bg-tertiary)]">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]',
                  col.sortable && 'cursor-pointer hover:text-[var(--text-primary)]'
                )}
                style={{ width: col.width }}
                onClick={() => col.sortable && handleSort(String(col.key))}
              >
                <div className="flex items-center gap-2">
                  {col.header}
                  {col.sortable && sortKey === String(col.key) && (
                    <svg
                      className={cn('w-4 h-4 transition-transform', sortOrder === 'desc' && 'rotate-180')}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-[var(--text-muted)]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => (
              <tr
                key={row.id ?? i}
                className={cn(
                  'border-t border-[var(--border-default)] transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-[var(--bg-tertiary)]'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-sm">
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
