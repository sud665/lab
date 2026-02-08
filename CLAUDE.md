# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

이 저장소는 여러 독립 프로젝트를 포함하는 모노레포(monorepo)이다. 각 프로젝트는 자체 의존성과 빌드 시스템을 갖는다.

| 프로젝트 | 기술 스택 | 설명 |
|---------|----------|------|
| `ai-page-generator` | Next.js 16, React 19, Anthropic SDK | 자연어 프롬프트로 React 컴포넌트를 생성하는 AI 도구 |
| `focus-guard` | Chrome Extension (Manifest V3), React 19, Vite, Zustand | 시간을 금전적 가치로 환산하여 집중력 관리하는 크롬 익스텐션 |
| `super-admin` | Next.js 16, React 19, Recharts | 10개 서비스의 트래픽/분석 대시보드 (Idea Validation Hub) |
| `wireframe-boilerplate` | Next.js 16, React 19, Anthropic SDK, Replicate | 그레이스케일 와이어프레임 보일러플레이트 + AI 페이지 생성 + CLI 클라이언트 팩토리 |

## Build & Dev Commands

모든 Next.js 프로젝트 (ai-page-generator, super-admin, wireframe-boilerplate):
```bash
cd <project> && npm run dev      # 개발 서버
cd <project> && npm run build    # 프로덕션 빌드
cd <project> && npm run lint     # ESLint
```

focus-guard (Chrome Extension):
```bash
cd focus-guard && npm run dev    # Vite 개발 서버 + HMR
cd focus-guard && npm run build  # tsc + Vite 빌드 → dist/
# chrome://extensions → 개발자 모드 → dist/ 폴더 로드
```

wireframe-boilerplate 전용:
```bash
cd wireframe-boilerplate && npx tsx scripts/new-client.ts  # 클라이언트 와이어프레임 생성 CLI
```

## Architecture & Conventions

### 공통 패턴
- **TypeScript strict mode** 전 프로젝트 적용
- **Path alias**: `@/*` → `./src/*` (또는 프로젝트 루트)
- **Tailwind CSS v4** + PostCSS 사용 (v3 아님)
- **CSS 변수 기반 테마 시스템**: `data-theme` 속성으로 light/dark 전환
- **컴포넌트 구조**: `components/ui/` (재사용 UI), `components/layout/` (레이아웃), index.ts barrel export
- **cn() 유틸리티**: `clsx` + `tailwind-merge`로 className 병합 (super-admin, wireframe-boilerplate)

### ai-page-generator
- SSE(Server-Sent Events) 스트리밍으로 Claude 응답 실시간 전달
- API route (`/api/generate`): Claude SDK로 코드 생성 → ReadableStream으로 SSE 전송
- Canvas에서 iframe sandbox로 생성된 React 코드 미리보기 (Babel + React UMD + Tailwind CDN)
- `SYSTEM_PROMPT` (`lib/prompts.ts`): 순수 React만 사용, Next.js import 금지, `React.useState` 네임스페이스 접두사 필수
- 환경변수: `ANTHROPIC_API_KEY` (필수), `ANTHROPIC_MODEL` (선택, 기본 claude-sonnet-4-20250514)

### focus-guard
- **4개 진입점**: Background Service Worker, Content Script, Popup, New Tab Override
- **@crxjs/vite-plugin**으로 Chrome Extension 빌드
- **Zustand store** (`src/shared/store/`): 전역 상태 관리, `chrome.storage.sync`로 자동 저장/동기화
- Content Script가 모든 페이지에 TopBar 주입 (z-index: 999999)
- Background worker: 탭 변경 감지 → 방해 사이트 redirect 또는 경고 effect
- 통화 단위: ₩(원)

### super-admin
- 전체 mock 데이터 기반 (`lib/mockData.ts`), 실제 API 미연동
- Recharts로 Area/Bar/Line/Pie 차트 렌더링
- 4개 주요 페이지: Dashboard, Analytics, Ranking, Services, Settings
- 테마: 다크모드 기본, ThemeProvider Context + localStorage

### wireframe-boilerplate
- **그레이스케일 전용 디자인**: neutral-950, neutral-900 계열만 사용
- **7개 Pattern 컴포넌트**: Dashboard, List, Detail, Form, Chat, Calendar, Settings
- **AI 페이지 생성**: Claude(코드) + Replicate(이미지) → SSE 스트리밍
- **이미지 마커**: `{/* IMG: description | WxH */}` 형식으로 코드 내 이미지 위치 지정
- **CLI 클라이언트 팩토리**: `scripts/new-client.ts` → git branch 생성, 페이지 선택, navigation.ts 업데이트, Vercel 프리뷰 배포
- Navigation 설정: `src/config/navigation.ts` (single source of truth)
- 커스텀 SVG 아이콘: `src/config/icons.tsx`

## Documentation (docs/)

PDCA(Plan-Design-Check-Act) 프레임워크로 문서 관리:
- `docs/01-plan/` — 기획서
- `docs/02-design/` — 설계 명세서
- `docs/03-analysis/` — 갭 분석 보고서
- `docs/04-report/` — 완료 보고서
- `docs/plans/` — 프로젝트 설계 문서
