import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'ai-page-generator',
    title: 'AI Page Generator',
    description:
      '자연어 프롬프트로 React 컴포넌트를 실시간 생성하는 AI 도구',
    longDescription:
      'Claude API와 SSE 스트리밍을 활용해 자연어 입력으로 React 컴포넌트를 실시간 생성합니다. iframe 샌드박스에서 즉시 미리보기가 가능하며, Babel 트랜스파일과 Tailwind CDN을 통한 스타일링을 지원합니다.',
    tags: ['Next.js', 'Claude API', 'SSE', 'React'],
    featured: true,
  },
  {
    id: 'focus-guard',
    title: 'Focus Guard',
    description:
      '시간의 금전적 가치를 시각화하여 집중력을 관리하는 크롬 익스텐션',
    longDescription:
      '방해 사이트에서 소비하는 시간을 금전적 가치로 환산하여 TopBar로 표시합니다. Zustand 기반 상태 관리와 Chrome Storage Sync로 디바이스 간 동기화를 지원합니다.',
    tags: ['Chrome Extension', 'React', 'Zustand', 'TypeScript'],
    featured: true,
  },
  {
    id: 'super-admin',
    title: 'Super Admin Dashboard',
    description:
      '10개 서비스의 트래픽과 사용자 분석을 통합 관리하는 어드민 대시보드',
    longDescription:
      'Recharts를 활용한 인터랙티브 차트와 다양한 시각화로 10개 서비스의 KPI를 한눈에 모니터링합니다. 다크 모드와 반응형 레이아웃을 지원합니다.',
    tags: ['Next.js', 'Recharts', 'TypeScript'],
    featured: false,
  },
  {
    id: 'wireframe-boilerplate',
    title: 'Wireframe Boilerplate',
    description:
      'AI 기반 와이어프레임 생성 + CLI 클라이언트 팩토리 시스템',
    longDescription:
      'Claude와 Replicate를 조합하여 AI 기반 와이어프레임 페이지를 생성합니다. CLI 팩토리로 새 클라이언트 프로젝트를 자동 생성하고 Vercel 프리뷰 배포까지 자동화합니다.',
    tags: ['Next.js', 'Replicate', 'MDX', 'CLI'],
    featured: true,
  },
]
