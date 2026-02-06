'use client'

import { ListPattern } from '@/components/patterns'
import { Badge } from '@/components/ui'
import { mockNotifications, formatDateTime } from '@/data/mock'
import type { Notification } from '@/data/mock'
import type { TableColumn } from '@/components/ui/Table'

const columns: TableColumn<Notification>[] = [
  {
    key: 'title',
    header: '제목',
    sortable: true,
  },
  {
    key: 'message',
    header: '내용',
  },
  {
    key: 'type',
    header: '유형',
    render: (v) => <Badge variant="outline">{String(v)}</Badge>,
  },
  {
    key: 'read',
    header: '읽음 여부',
    render: (v) => (
      <Badge variant={v ? 'default' : 'outline'}>
        {v ? '읽음' : '안읽음'}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    header: '생성일시',
    sortable: true,
    render: (v) => formatDateTime(String(v)),
  },
]

export default function NotificationsPage() {
  return (
    <ListPattern<Notification>
      title="알림"
      description="시스템 알림을 확인합니다."
      columns={columns}
      data={mockNotifications}
      searchKey="title"
      searchPlaceholder="제목으로 검색..."
      actions={[]}
    />
  )
}
