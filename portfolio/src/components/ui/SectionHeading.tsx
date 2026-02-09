'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('mb-12 text-center', className)}
    >
      <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-[var(--accent)]" />
      {subtitle && (
        <p className="mt-4 text-[var(--text-secondary)]">{subtitle}</p>
      )}
    </motion.div>
  )
}
