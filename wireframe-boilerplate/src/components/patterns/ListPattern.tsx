'use client'

import { useState, useMemo } from 'react'
import { Card, Button, Input, Badge, Table } from '@/components/ui'
import type { TableColumn } from '@/components/ui/Table'
import { Icons } from '@/config'

interface ListPatternProps<T extends object> {
  title: string
  description?: string
  columns: TableColumn<T>[]
  data: T[]
  searchKey?: keyof T
  searchPlaceholder?: string
  actions?: ('create' | 'export' | 'filter')[]
  onCreateClick?: () => void
  onRowClick?: (row: T) => void
  pageSize?: number
}

export function ListPattern<T extends object>({
  title,
  description,
  columns,
  data,
  searchKey,
  searchPlaceholder = '검색...',
  actions = ['create'],
  onCreateClick,
  onRowClick,
  pageSize = 10,
}: ListPatternProps<T>) {
  const [search, setSearch] = useState('')

  const filteredData = useMemo(() => {
    if (!search || !searchKey) return data
    return data.filter((item) => {
      const value = item[searchKey]
      if (typeof value === 'string') {
        return value.toLowerCase().includes(search.toLowerCase())
      }
      return true
    })
  }, [data, search, searchKey])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-[var(--text-secondary)] mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions.includes('export') && (
            <Button variant="outline" size="sm" icon={Icons.download}>내보내기</Button>
          )}
          {actions.includes('create') && (
            <Button size="sm" icon={Icons.plus} onClick={onCreateClick}>새로 만들기</Button>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      {(searchKey || actions.includes('filter')) && (
        <div className="flex items-center gap-3">
          {searchKey && (
            <div className="flex-1 max-w-sm">
              <Input
                type="search"
                placeholder={searchPlaceholder}
                icon={Icons.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
          {actions.includes('filter') && (
            <Button variant="outline" size="sm" icon={Icons.filter}>필터</Button>
          )}
          {search && (
            <span className="text-sm text-[var(--text-muted)]">
              {filteredData.length}건 검색됨
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        data={filteredData}
        sortable
        pagination
        pageSize={pageSize}
        onRowClick={onRowClick ? (row) => onRowClick(row) : undefined}
      />
    </div>
  )
}
