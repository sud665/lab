'use client'

import { useState } from 'react'
import { Card, Button, Input, Dropdown } from '@/components/ui'
import { Icons } from '@/config'

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'number' | 'date' | 'time' | 'select' | 'textarea'
  required?: boolean
  placeholder?: string
  options?: string[]
}

interface FormSection {
  title: string
  fields: FormField[]
}

interface FormPatternProps {
  title: string
  description?: string
  fields?: FormField[]
  sections?: FormSection[]
  submitLabel?: string
  cancelLabel?: string
  onSubmit?: (data: Record<string, string>) => void
  onCancel?: () => void
}

export function FormPattern({
  title,
  description,
  fields,
  sections,
  submitLabel = '저장',
  cancelLabel = '취소',
  onSubmit,
  onCancel,
}: FormPatternProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  const renderField = (field: FormField) => {
    if (field.type === 'select' && field.options) {
      return (
        <div key={field.name}>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            {field.label}{field.required && ' *'}
          </label>
          <Dropdown
            options={field.options.map((opt) => ({ value: opt, label: opt }))}
            value={formData[field.name] || undefined}
            onChange={(val) => handleChange(field.name, val ?? '')}
            placeholder={field.placeholder || '선택하세요'}
          />
        </div>
      )
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.name}>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            {field.label}{field.required && ' *'}
          </label>
          <textarea
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--border-focus)] outline-none transition-colors resize-none"
            rows={4}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        </div>
      )
    }

    return (
      <Input
        key={field.name}
        type={field.type === 'number' ? 'text' : field.type}
        label={field.label + (field.required ? ' *' : '')}
        placeholder={field.placeholder}
        value={formData[field.name] || ''}
        onChange={(e) => handleChange(field.name, e.target.value)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-[var(--text-secondary)] mt-1">{description}</p>}
        </div>
        {onCancel && (
          <Button variant="ghost" size="sm" icon={Icons.back} onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {sections ? (
          sections.map((section) => (
            <Card key={section.title} className="mb-4">
              <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.fields.map(renderField)}
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(fields || []).map(renderField)}
            </div>
          </Card>
        )}

        <div className="flex justify-end gap-3 mt-6">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>{cancelLabel}</Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </div>
  )
}
