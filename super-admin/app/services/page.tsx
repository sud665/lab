'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, Modal, Table } from '@/components/ui'
import { mockServices } from '@/lib/mockData'
import type { Service } from '@/types'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    ga4Id: '',
    mixpanelToken: '',
  })

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        url: service.url,
        description: service.description || '',
        ga4Id: service.ga4Id || '',
        mixpanelToken: service.mixpanelToken || '',
      })
    } else {
      setEditingService(null)
      setFormData({ name: '', url: '', description: '', ga4Id: '', mixpanelToken: '' })
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? { ...s, ...formData, updatedAt: new Date() }
            : s
        )
      )
    } else {
      const newService: Service = {
        id: String(Date.now()),
        ...formData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setServices([...services, newService])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setServices(services.filter((s) => s.id !== id))
    }
  }

  const handleToggleStatus = (id: string) => {
    setServices(
      services.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'active' ? 'inactive' : 'active', updatedAt: new Date() }
          : s
      )
    )
  }

  const columns = [
    {
      key: 'name',
      header: '서비스명',
      render: (row: Service) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-[var(--text-muted)]">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'url',
      header: 'URL',
      render: (row: Service) => (
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-info)] hover:underline text-sm"
        >
          {row.url}
        </a>
      ),
    },
    {
      key: 'status',
      header: '상태',
      render: (row: Service) => (
        <Badge
          variant={
            row.status === 'active' ? 'success' : row.status === 'inactive' ? 'danger' : 'warning'
          }
        >
          {row.status === 'active' ? '활성' : row.status === 'inactive' ? '비활성' : '대기중'}
        </Badge>
      ),
    },
    {
      key: 'tracking',
      header: '트래킹',
      render: (row: Service) => (
        <div className="flex gap-2">
          <Badge variant={row.ga4Id ? 'info' : 'default'} size="sm">
            GA4 {row.ga4Id ? '연결됨' : '미연결'}
          </Badge>
          <Badge variant={row.mixpanelToken ? 'info' : 'default'} size="sm">
            MP {row.mixpanelToken ? '연결됨' : '미연결'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '180px',
      render: (row: Service) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(row.id)}>
            {row.status === 'active' ? '비활성화' : '활성화'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>
            수정
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            삭제
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            총 {services.length}개 서비스 | 활성 {services.filter((s) => s.status === 'active').length}개
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 서비스 추가
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="서비스명 또는 설명으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card padding="none">
        <Table columns={columns} data={filteredServices} />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? '서비스 수정' : '새 서비스 추가'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSave}>저장</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="서비스명"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="AI Photo Editor"
          />
          <Input
            label="URL"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://my-service.vercel.app"
          />
          <Input
            label="설명"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="서비스에 대한 간단한 설명"
          />

          <div className="pt-4 border-t border-[var(--border-default)]">
            <h4 className="font-medium mb-4">트래킹 설정</h4>
            <div className="space-y-4">
              <Input
                label="Google Analytics 4 측정 ID"
                value={formData.ga4Id}
                onChange={(e) => setFormData({ ...formData, ga4Id: e.target.value })}
                placeholder="G-XXXXXXXXXX"
              />
              <Input
                label="Mixpanel Token"
                value={formData.mixpanelToken}
                onChange={(e) => setFormData({ ...formData, mixpanelToken: e.target.value })}
                placeholder="your_mixpanel_token"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-default)]">
            <Link
              href="/settings#tracking-guide"
              className="text-sm text-[var(--color-info)] hover:underline"
            >
              트래킹 코드 설치 가이드 보기 →
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  )
}
