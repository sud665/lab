'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RevealTextProps {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function RevealText({
  text,
  className,
  delay = 0,
  as: Tag = 'p',
}: RevealTextProps) {
  const characters = text.split('')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: delay,
      },
    },
  }

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <Tag className={cn(className)}>
        {characters.map((char, i) => (
          <motion.span key={i} variants={child} className="inline-block">
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  )
}
