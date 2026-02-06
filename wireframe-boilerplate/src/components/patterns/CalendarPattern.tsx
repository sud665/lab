'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Card, Button, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

interface CalendarEvent {
  id: number
  title: string
  date: string
  time?: string
  type?: string
}

interface CalendarPatternProps {
  title: string
  description?: string
  events: CalendarEvent[]
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

export function CalendarPattern({
  title,
  description,
  events,
  onDateClick,
  onEventClick,
}: CalendarPatternProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { locale: ko })
  const calendarEnd = endOfWeek(monthEnd, { locale: ko })

  const days: Date[] = []
  let day = calendarStart
  while (day <= calendarEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return events.filter((e) => e.date === dateStr)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateClick?.(date)
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-[var(--text-secondary)] mt-1">{description}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" padding="none">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>&#9664;</Button>
            <h2 className="font-semibold">{format(currentMonth, 'yyyy년 M월', { locale: ko })}</h2>
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>&#9654;</Button>
          </div>

          <div className="grid grid-cols-7 border-b border-[var(--border-default)]">
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
              <div key={d} className="p-2 text-center text-xs font-medium text-[var(--text-muted)]">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((d, i) => {
              const dayEvents = getEventsForDate(d)
              const isSelected = selectedDate && isSameDay(d, selectedDate)

              return (
                <button
                  key={i}
                  onClick={() => handleDateClick(d)}
                  className={cn(
                    'p-2 min-h-[80px] border-b border-r border-[var(--border-default)] text-left transition-colors',
                    !isSameMonth(d, currentMonth) && 'opacity-30',
                    isToday(d) && 'bg-white/5',
                    isSelected && 'bg-white/10',
                    'hover:bg-white/5'
                  )}
                >
                  <span className={cn('text-sm', isToday(d) && 'font-bold')}>{format(d, 'd')}</span>
                  {dayEvents.slice(0, 2).map((e) => (
                    <div key={e.id} className="mt-1 px-1 py-0.5 text-xs rounded bg-white/10 truncate">
                      {e.time && <span className="text-[var(--text-muted)]">{e.time} </span>}
                      {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="mt-1 text-xs text-[var(--text-muted)]">+{dayEvents.length - 2}건</div>
                  )}
                </button>
              )
            })}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">
            {selectedDate ? format(selectedDate, 'M월 d일 (E)', { locale: ko }) : '날짜를 선택하세요'}
          </h3>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">등록된 일정이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="w-full text-left p-3 rounded-lg border border-[var(--border-default)] hover:bg-white/5 transition-colors"
                >
                  <p className="text-sm font-medium">{event.title}</p>
                  {event.time && <p className="text-xs text-[var(--text-muted)] mt-1">{event.time}</p>}
                  {event.type && <Badge size="sm" variant="outline" className="mt-2">{event.type}</Badge>}
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
