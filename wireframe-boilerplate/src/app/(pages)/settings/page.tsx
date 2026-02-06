'use client'

import { SettingsPattern } from '@/components/patterns'
import { mockSettingsSections } from '@/data/mock'

export default function SettingsPage() {
  const sections = mockSettingsSections.map((section) => ({
    title: section.title,
    items: section.items.map((item) => ({
      key: item.id,
      label: item.label,
      type: item.type,
      value: item.value,
      options: item.options?.map((o) => o.label),
    })),
  }))

  return (
    <SettingsPattern
      title="설정"
      description="시스템 설정을 관리합니다."
      sections={sections}
      onSave={(data) => {
        console.log('Settings saved:', data)
      }}
    />
  )
}
