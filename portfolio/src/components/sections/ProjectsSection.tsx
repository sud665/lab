'use client'

import { SectionHeading } from '@/components/ui'
import { projects } from '@/lib/constants'
import { ProjectCard } from './ProjectCard'

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Projects"
          subtitle="최근 작업한 주요 프로젝트"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              featured={project.featured}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
