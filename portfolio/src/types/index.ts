export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image?: string
  tags: string[]
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
}

export interface Skill {
  name: string
  icon?: string
  level?: number // 0-100
}

export interface SkillCategory {
  title: string
  icon: string
  description: string
  skills: Skill[]
}

export interface TimelineEvent {
  year: string
  title: string
  company?: string
  description: string
  tags?: string[]
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  readingTime: string
  content?: string
}
