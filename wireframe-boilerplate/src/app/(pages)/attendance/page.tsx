'use client'

import { CalendarPattern } from '@/components/patterns'
import { mockEvents } from '@/data/mock'

export default function AttendancePage() {
  const events = mockEvents.map((e, index) => ({
    id: index + 1,
    title: e.title,
    date: e.date,
    time: e.startTime,
    type: e.category,
  }))

  return (
    <CalendarPattern
      title="출석 관리"
      description="출석 현황 및 일정을 확인합니다."
      events={events}
    />
  )
}
