'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index: number
  featured?: boolean
}

export function ProjectCard({ project, index, featured }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(featured && 'sm:col-span-2')}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="group relative h-full overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
      >
        {/* Thumbnail gradient area */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--accent-muted)] via-[var(--bg-tertiary)] to-[var(--bg-elevated)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-[var(--accent)] opacity-20">
              {project.title.charAt(0)}
            </span>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="max-w-xs px-4 text-center text-sm text-[var(--text-secondary)]">
              {project.longDescription || project.description}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
            {project.title}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            {project.description}
          </p>

          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
              >
                <Github size={14} />
                Source
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
