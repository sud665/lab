import type { SkillCategory } from '@/types'

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: 'Monitor',
    description: '인터랙티브하고 반응형인 웹 경험 구축',
    skills: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 90 },
      { name: 'TypeScript', level: 90 },
      { name: 'Three.js / R3F', level: 75 },
      { name: 'Framer Motion', level: 85 },
      { name: 'Tailwind CSS', level: 95 },
    ],
  },
  {
    title: 'Backend',
    icon: 'Server',
    description: '확장 가능한 서버 인프라와 API 설계',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Python', level: 80 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'Redis', level: 70 },
      { name: 'REST API', level: 90 },
      { name: 'GraphQL', level: 75 },
    ],
  },
  {
    title: 'AI / ML',
    icon: 'Brain',
    description: 'AI 에이전트와 지능형 시스템 구축',
    skills: [
      { name: 'Claude API', level: 90 },
      { name: 'LangChain', level: 80 },
      { name: 'RAG', level: 80 },
      { name: 'Multi-Agent', level: 85 },
      { name: 'Prompt Engineering', level: 90 },
      { name: 'Vector DB', level: 75 },
    ],
  },
  {
    title: 'DevOps',
    icon: 'Cloud',
    description: '안정적인 배포와 인프라 관리',
    skills: [
      { name: 'Docker', level: 80 },
      { name: 'AWS', level: 75 },
      { name: 'Vercel', level: 90 },
      { name: 'GitHub Actions', level: 80 },
      { name: 'Linux', level: 80 },
      { name: 'Nginx', level: 70 },
    ],
  },
]
