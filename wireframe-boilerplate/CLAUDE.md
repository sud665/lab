# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

그레이스케일 와이어프레임 보일러플레이트. 클라이언트별 와이어프레임을 빠르게 생성하는 프로젝트로, AI 페이지 생성과 CLI 클라이언트 팩토리를 포함한다.

- **스택**: Next.js 16, React 19, TypeScript strict, Tailwind CSS v4, Recharts
- **AI**: Anthropic SDK (코드 생성) + Replicate (이미지 생성)

## Commands

```bash
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint
npm run new:client   # 클라이언트 와이어프레임 생성 CLI (npx tsx scripts/new-client.ts)
```

## Environment Variables

- `ANTHROPIC_API_KEY` — Claude API 키 (AI 페이지 생성 필수)
- `REPLICATE_API_TOKEN` — Replicate API 토큰 (이미지 생성, 선택. 미설정 시 이미지 생성 건너뜀)

## Architecture

### 라우팅 구조

- `src/app/(pages)/` — AppLayout(Header+Sidebar)이 적용되는 메인 페이지들 (route group)
- `src/app/api/generate/` — AI 페이지 생성 SSE 엔드포인트
- `src/app/generator/` — AI 생성기 UI 페이지
- `src/app/examples/` — 독립 예제 페이지 (auth, board, charts, dashboard, form, landing)

### Navigation — Single Source of Truth

`src/config/navigation.ts`가 사이드바 메뉴의 유일한 설정 파일. CLI 스크립트(`scripts/new-client.ts`)가 클라이언트 생성 시 이 파일을 동적으로 수정한다.

### 컴포넌트 계층

- `components/ui/` — 기본 UI (Button, Card, Input, Modal, Table, Chart 등). barrel export via `index.ts`
- `components/patterns/` — 7개 패턴 컴포넌트 (Dashboard, List, Detail, Form, Chat, Calendar, Settings). 각 페이지에서 패턴을 조합하여 사용
- `components/layout/` — AppLayout, Header, Sidebar, Footer, Container
- `components/providers/` — ThemeProvider (`data-theme` 속성 + localStorage)

### AI 페이지 생성 파이프라인 (`/api/generate`)

1. Claude가 React 컴포넌트 코드 생성 (SSE `code` → `code_done`)
2. 코드에서 이미지 마커 추출: `{/* IMG: description | WxH */}`
3. Replicate Flux로 이미지 생성 (설정된 경우, 최대 3개 병렬)
4. 마커를 실제 URL로 교체 후 `done` 이벤트 전송

### 커스텀 아이콘

외부 아이콘 라이브러리 없음. `src/config/icons.tsx`에 커스텀 SVG 아이콘 정의. `IconName` 타입으로 타입 안전하게 참조.

### 목 데이터

`src/data/mock/`에 기능별로 분리 (dashboard, list, calendar, chat, form, settings). `common.ts`에 `formatDate`, `formatCurrency`, `statusMap` 등 공유 유틸리티.

## Styling Rules

- **그레이스케일 전용**: 컬러 액센트 없음. `neutral-*` 팔레트와 CSS 변수만 사용
- **CSS 변수**: `globals.css`에 정의 (`--bg-primary`, `--text-primary`, `--border-default` 등)
- **테마 전환**: `<html data-theme="light|dark">` 속성. 다크모드 기본
- **Tailwind v4**: `@import "tailwindcss"` 방식. `tailwind.config.js` 없음. `globals.css`의 `@theme inline` 블록으로 테마 토큰 설정
- **cn() 유틸리티**: `src/lib/utils.ts` — `clsx` + `tailwind-merge`로 className 병합
- 스타일링에 CSS 변수 참조: `bg-[var(--bg-primary)]`, `text-[var(--text-secondary)]`

## CLI 클라이언트 팩토리 (`scripts/new-client.ts`)

클라이언트별 와이어프레임 브랜치를 자동 생성하는 인터랙티브 CLI:
1. 클라이언트명 입력 → slug 생성
2. 프리셋(admin/platform/academy) 또는 커스텀 페이지 선택
3. 미선택 페이지 디렉토리 삭제 + `navigation.ts` 업데이트
4. `client/{slug}` 브랜치 생성 → 커밋 → 푸시
5. Vercel이 브랜치에서 자동 프리뷰 배포

## Path Alias

`@/*` → `./src/*`
