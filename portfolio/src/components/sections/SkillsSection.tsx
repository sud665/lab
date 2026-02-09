'use client'

import { motion } from 'framer-motion'
import { Monitor, Server, Brain, Cloud } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeading, Card } from '@/components/ui'
import { skillCategories } from '@/lib/constants'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Monitor,
  Server,
  Brain,
  Cloud,
}

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">{name}</span>
        <span className="text-xs text-[var(--text-muted)]">{level}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
        <motion.div
          className="h-full rounded-full bg-[var(--accent)]"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export function SkillsSection() {
  return (
    <section id="skills" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Skills"
          subtitle="기술 스택과 전문 분야"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, catIndex) => {
            const Icon = iconMap[category.icon]

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              >
                <Card className={cn('h-full p-6')}>
                  <div className="mb-4 flex items-center gap-3">
                    {Icon && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
                        <Icon size={20} className="text-[var(--accent)]" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mb-5 text-sm text-[var(--text-muted)]">
                    {category.description}
                  </p>
                  <div className="flex flex-col gap-3">
                    {category.skills.map((skill, skillIndex) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level ?? 0}
                        delay={catIndex * 0.1 + skillIndex * 0.05}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
