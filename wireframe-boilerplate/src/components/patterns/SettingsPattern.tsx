'use client'

import { useState } from 'react'
import { Card, Button, Input } from '@/components/ui'

interface SettingsItem {
  key: string
  label: string
  type: 'text' | 'number' | 'toggle' | 'select'
  value: string | number | boolean
  options?: string[]
}

interface SettingsSection {
  title: string
  items: SettingsItem[]
}

interface SettingsPatternProps {
  title: string
  description?: string
  sections: SettingsSection[]
  onSave?: (data: Record<string, string | number | boolean>) => void
}

export function SettingsPattern({
  title,
  description,
  sections,
  onSave,
}: SettingsPatternProps) {
  const [values, setValues] = useState<Record<string, string | number | boolean>>(() => {
    const initial: Record<string, string | number | boolean> = {}
    sections.forEach((section) => {
      section.items.forEach((item) => {
        initial[item.key] = item.value
      })
    })
    return initial
  })

  const handleChange = (key: string, value: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-[var(--text-secondary)] mt-1">{description}</p>}
        </div>
        <Button onClick={() => onSave?.(values)}>저장</Button>
      </div>

      {sections.map((section) => (
        <Card key={section.title}>
          <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
          <div className="space-y-4">
            {section.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <label className="text-sm font-medium">{item.label}</label>
                <div className="w-64">
                  {item.type === 'toggle' ? (
                    <button
                      onClick={() => handleChange(item.key, !values[item.key])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${values[item.key] ? 'bg-white/30' : 'bg-[var(--bg-tertiary)]'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${values[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  ) : item.type === 'select' && item.options ? (
                    <select
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] outline-none"
                      value={String(values[item.key])}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                    >
                      {item.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type="text"
                      value={String(values[item.key])}
                      onChange={(e) => handleChange(item.key, item.type === 'number' ? Number(e.target.value) : e.target.value)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
