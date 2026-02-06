'use client'

import { useState } from 'react'
import { Card, Button, Badge, Avatar } from '@/components/ui'
import { Icons } from '@/config'
import { cn } from '@/lib/utils'

interface DetailSection {
  label: string
  value: React.ReactNode
}

interface DetailTab {
  id: string
  label: string
  content: React.ReactNode
}

interface DetailPatternProps {
  title: string
  subtitle?: string
  avatar?: { src?: string; fallback: string }
  badge?: { label: string; variant?: 'default' | 'outline' }
  sections: DetailSection[]
  tabs?: DetailTab[]
  actions?: ('edit' | 'delete' | 'back')[]
  onBack?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function DetailPattern({
  title,
  subtitle,
  avatar,
  badge,
  sections,
  tabs,
  actions = ['back', 'edit'],
  onBack,
  onEdit,
  onDelete,
}: DetailPatternProps) {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || '')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {actions.includes('back') && (
            <Button variant="ghost" size="sm" icon={Icons.back} onClick={onBack}>뒤로</Button>
          )}
          <div className="flex items-center gap-3">
            {avatar && <Avatar size="lg" fallback={avatar.fallback} src={avatar.src} />}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{title}</h1>
                {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
              </div>
              {subtitle && <p className="text-[var(--text-secondary)] mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actions.includes('edit') && (
            <Button variant="outline" size="sm" icon={Icons.edit} onClick={onEdit}>수정</Button>
          )}
          {actions.includes('delete') && (
            <Button variant="ghost" size="sm" icon={Icons.trash} onClick={onDelete}>삭제</Button>
          )}
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div key={section.label}>
              <dt className="text-sm text-[var(--text-muted)] mb-1">{section.label}</dt>
              <dd className="text-sm font-medium">{section.value}</dd>
            </div>
          ))}
        </div>
      </Card>

      {tabs && tabs.length > 0 && (
        <div>
          <div className="flex border-b border-[var(--border-default)] mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                  activeTab === tab.id
                    ? 'border-white text-[var(--text-primary)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div>{tabs.find((t) => t.id === activeTab)?.content}</div>
        </div>
      )}
    </div>
  )
}
