'use client'

import { CalendarPattern } from '@/components/patterns'
import { mockEvents } from '@/data/mock'

export default function ReservationsPage() {
  const events = mockEvents.map((e, index) => ({
    id: index + 1,
    title: e.title,
    date: e.date,
    time: e.startTime,
    type: e.category,
  }))

  return (
    <CalendarPattern
      title="예약 관리"
      description="시설 및 프로그램 예약 일정을 관리합니다."
      events={events}
    />
  )
}
