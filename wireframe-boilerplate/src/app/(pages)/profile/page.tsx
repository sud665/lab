'use client'

import { DetailPattern } from '@/components/patterns'
import { Badge } from '@/components/ui'
import { mockUsers } from '@/data/mock'

export default function ProfilePage() {
  const user = mockUsers[0]

  return (
    <DetailPattern
      title={user.name}
      subtitle="내 프로필 정보"
      avatar={{ fallback: user.name.slice(0, 1) }}
      sections={[
        { label: '이름', value: user.name },
        { label: '이메일', value: user.email },
        {
          label: '역할',
          value: <Badge>{user.role}</Badge>,
        },
      ]}
      actions={['edit']}
    />
  )
}
