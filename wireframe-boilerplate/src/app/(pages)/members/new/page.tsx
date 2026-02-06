'use client'

import { useRouter } from 'next/navigation'
import { FormPattern } from '@/components/patterns'
import { mockFormFields } from '@/data/mock'

export default function MemberNewPage() {
  const router = useRouter()
  const config = mockFormFields.memberRegistration

  const fields = config.fields.map((f) => ({
    name: f.name,
    label: f.label,
    type: f.type,
    placeholder: f.placeholder,
    required: f.required,
    options: f.options?.map((o) => o.label),
  }))

  return (
    <FormPattern
      title={config.title}
      description={config.description}
      fields={fields}
      onSubmit={(data) => {
        console.log('Submit:', data)
        router.push('/members')
      }}
      onCancel={() => router.push('/members')}
    />
  )
}
