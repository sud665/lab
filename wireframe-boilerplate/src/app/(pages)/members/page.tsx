'use client'

import { useRouter } from 'next/navigation'
import { ListPattern } from '@/components/patterns'
import { Badge } from '@/components/ui'
import { mockMembers, statusMap } from '@/data/mock'
import type { Member } from '@/data/mock'
import type { TableColumn } from '@/components/ui/Table'

const columns: TableColumn<Member>[] = [
  {
    key: 'name',
    header: '이름',
    sortable: true,
  },
  {
    key: 'phone',
    header: '연락처',
  },
  {
    key: 'role',
    header: '등급',
    render: (v) => <Badge>{String(v)}</Badge>,
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
  {
    key: 'email',
    header: '이메일',
  },
  {
    key: 'joinedAt',
    header: '가입일',
    sortable: true,
  },
]

export default function MembersPage() {
  const router = useRouter()

  return (
    <ListPattern<Member>
      title="회원 관리"
      description="회원 목록을 조회하고 관리합니다."
      columns={columns}
      data={mockMembers}
      searchKey="name"
      searchPlaceholder="이름으로 검색..."
      actions={['create', 'export', 'filter']}
      onCreateClick={() => router.push('/members/new')}
      onRowClick={(row) => router.push(`/members/${row.id}`)}
    />
  )
}
