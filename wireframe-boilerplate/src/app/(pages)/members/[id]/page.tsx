'use client'

import { useRouter } from 'next/navigation'
import { DetailPattern } from '@/components/patterns'
import { Badge } from '@/components/ui'
import { mockMembers, statusMap } from '@/data/mock'

export default function MemberDetailPage() {
  const router = useRouter()
  const member = mockMembers[0]

  const statusInfo = statusMap[member.status]

  return (
    <DetailPattern
      title={member.name}
      subtitle={member.email}
      avatar={{ fallback: member.name.slice(0, 1) }}
      badge={{ label: member.role }}
      sections={[
        { label: '이름', value: member.name },
        { label: '연락처', value: member.phone },
        { label: '이메일', value: member.email },
        {
          label: '등급',
          value: <Badge>{member.role}</Badge>,
        },
        {
          label: '상태',
          value: (
            <Badge variant={member.status === 'active' ? 'default' : 'outline'}>
              {statusInfo?.label || member.status}
            </Badge>
          ),
        },
        { label: '가입일', value: member.joinedAt },
      ]}
      tabs={[
        {
          id: 'activity',
          label: '활동 내역',
          content: (
            <div className="text-sm text-[var(--text-muted)] p-4">활동 내역이 없습니다.</div>
          ),
        },
        {
          id: 'payment',
          label: '결제 이력',
          content: (
            <div className="text-sm text-[var(--text-muted)] p-4">결제 이력이 없습니다.</div>
          ),
        },
        {
          id: 'memo',
          label: '메모',
          content: (
            <div className="text-sm text-[var(--text-muted)] p-4">메모가 없습니다.</div>
          ),
        },
      ]}
      actions={['back', 'edit', 'delete']}
      onBack={() => router.push('/members')}
    />
  )
}
