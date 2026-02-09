'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SectionHeading, Badge } from '@/components/ui'
import { timeline } from '@/lib/constants'

function TimelineNode({
  event,
  index,
}: {
  event: (typeof timeline)[number]
  index: number
}) {
  const isLeft = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'relative flex w-full',
        isLeft ? 'md:justify-start' : 'md:justify-end'
      )}
    >
      {/* Center dot */}
      <div className="absolute left-4 top-2 z-10 h-3 w-3 rounded-full border-2 border-[var(--accent)] bg-[var(--bg-primary)] md:left-1/2 md:-translate-x-1/2" />

      {/* Content */}
      <div
        className={cn(
          'ml-10 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5',
          'md:ml-0 md:w-[45%]',
          isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
        )}
      >
        <span className="inline-block rounded-full bg-[var(--accent-muted)] px-3 py-1 text-xs font-bold text-[var(--accent)]">
          {event.year}
        </span>
        <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
          {event.title}
        </h3>
        {event.company && (
          <p className="text-sm text-[var(--text-muted)]">{event.company}</p>
        )}
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {event.description}
        </p>
        {event.tags && event.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function AboutSection() {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          title="About"
          subtitle="개발자로서의 여정과 경험"
        />

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
            AI와 웹 기술의 교차점에서 혁신적인 솔루션을 만들어가고 있습니다.
            사용자 경험에 대한 깊은 이해를 바탕으로, 기술적 도전을 즐기며
            끊임없이 성장하는 개발자입니다.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-[21px] top-0 h-full w-px bg-[var(--border-default)] md:left-1/2 md:-translate-x-px" />

          <div className="flex flex-col gap-8">
            {timeline.map((event, index) => (
              <TimelineNode key={event.year} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
