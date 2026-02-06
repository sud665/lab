'use client'

import { useRouter } from 'next/navigation'
import { ListPattern } from '@/components/patterns'
import { Badge } from '@/components/ui'
import { mockProducts, statusMap, formatCurrency } from '@/data/mock'
import type { Product } from '@/data/mock'
import type { TableColumn } from '@/components/ui/Table'

const columns: TableColumn<Product>[] = [
  {
    key: 'name',
    header: '상품명',
    sortable: true,
  },
  {
    key: 'category',
    header: '카테고리',
    render: (v) => <Badge variant="outline">{String(v)}</Badge>,
  },
  {
    key: 'price',
    header: '가격',
    align: 'right',
    sortable: true,
    render: (v) => formatCurrency(Number(v)),
  },
  {
    key: 'stock',
    header: '재고',
    align: 'center',
    render: (v) => String(v),
  },
  {
    key: 'status',
    header: '상태',
    render: (v) => {
      const status = String(v)
      const mapped = statusMap[status]
      return (
        <Badge variant={status === 'active' ? 'default' : 'outline'}>
          {mapped?.label || status}
        </Badge>
      )
    },
  },
]

export default function ProductsPage() {
  const router = useRouter()

  return (
    <ListPattern<Product>
      title="상품 관리"
      description="상품 목록을 조회하고 관리합니다."
      columns={columns}
      data={mockProducts}
      searchKey="name"
      searchPlaceholder="상품명으로 검색..."
      actions={['create', 'export']}
      onCreateClick={() => router.push('/products/new')}
    />
  )
}
