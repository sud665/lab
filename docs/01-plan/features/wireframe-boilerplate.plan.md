# Next.js 와이어프레임 보일러플레이트 Planning Document

> **Summary**: 고객에게 빠르게 와이어프레임을 보여주기 위한 Next.js 16 다크모드 보일러플레이트
>
> **Project**: lab
> **Version**: 1.0.0
> **Author**: Claude
> **Date**: 2026-02-05
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

고객에게 UI/UX 와이어프레임을 빠르게 제작하고 시연할 수 있는 Next.js 보일러플레이트를 제공한다.
다크모드 기반으로 검은색, 흰색, 회색, 투명도만 사용하여 "컬러 없는" 순수 와이어프레임 환경을 구축한다.

### 1.2 Background

- 고객 미팅 시 빠른 프로토타입 시연 필요
- 색상에 집중하지 않고 레이아웃과 구조에 집중할 수 있는 환경 필요
- 재사용 가능한 보일러플레이트로 프로젝트 시작 시간 단축

### 1.3 Related Documents

- Next.js 16 Documentation: https://nextjs.org/docs
- Tailwind CSS v4: https://tailwindcss.com/docs

---

## 2. Scope

### 2.1 In Scope

- [x] Next.js 16 App Router 기반 프로젝트 구조 (Turbopack 기본)
- [x] 다크모드 전용 테마 (라이트모드 미지원)
- [x] Grayscale 색상 팔레트 (검정, 흰색, 회색, 투명도)
- [x] 기본 와이어프레임 컴포넌트 (Layout, Card, Button, Input, Modal)
- [x] 반응형 그리드 시스템
- [x] 타이포그래피 시스템

### 2.2 Out of Scope

- 라이트모드 지원
- 컬러 팔레트 (유채색)
- 백엔드 API 연동
- 데이터베이스
- 인증/인가

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | Next.js 16 App Router 기반 프로젝트 구조 (Turbopack 기본) | High | Pending |
| FR-02 | Tailwind CSS v4 기반 스타일링 | High | Pending |
| FR-03 | Grayscale 전용 색상 시스템 | High | Pending |
| FR-04 | 기본 Layout 컴포넌트 (Header, Sidebar, Footer, Main) | High | Pending |
| FR-05 | 기본 UI 컴포넌트 (Button, Input, Card, Modal) | High | Pending |
| FR-06 | 반응형 그리드 시스템 | Medium | Pending |
| FR-07 | 타이포그래피 스케일 | Medium | Pending |
| FR-08 | 예시 와이어프레임 페이지 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | First Contentful Paint < 1s | Lighthouse |
| Accessibility | 기본 키보드 내비게이션 지원 | Manual Testing |
| DX | Hot Reload, TypeScript 지원 | 개발 환경 테스트 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [x] Next.js 16 프로젝트 정상 실행
- [x] 모든 기본 컴포넌트 구현
- [x] Grayscale 색상 시스템 적용
- [x] 예시 페이지에서 컴포넌트 시연 가능
- [x] TypeScript 에러 없음

### 4.2 Quality Criteria

- [x] `npm run build` 성공
- [x] Zero lint errors
- [x] 컴포넌트 재사용 가능

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Next.js 16 Turbopack 호환성 | Low | Low | 이미 안정화됨, 50%+ 사용중 |
| proxy.ts 마이그레이션 | Low | Low | middleware.ts에서 이름만 변경 |
| Tailwind v4 설정 복잡성 | Low | Medium | 공식 문서 참조 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | ✅ |
| **Dynamic** | Feature-based modules, services layer | Web apps with backend, SaaS MVPs | ☐ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems, complex architectures | ☐ |

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React / Vue | **Next.js 16.1** | Turbopack 기본, React 19.2, Cache Components |
| State Management | Context / Zustand / Redux | **None** | 와이어프레임용, 상태 불필요 |
| Styling | Tailwind / CSS Modules / styled-components | **Tailwind CSS v4** | 빠른 개발, 유틸리티 기반 |
| Language | TypeScript / JavaScript | **TypeScript** | 타입 안정성 |

### 6.3 Clean Architecture Approach

```
Selected Level: Starter

Folder Structure Preview:
┌─────────────────────────────────────────────────────┐
│ src/                                                │
│   ├── app/                   # Next.js App Router   │
│   │   ├── layout.tsx         # Root layout          │
│   │   ├── page.tsx           # Home page            │
│   │   └── globals.css        # Global styles        │
│   ├── components/            # UI Components        │
│   │   ├── layout/            # Layout components    │
│   │   │   ├── Header.tsx                            │
│   │   │   ├── Sidebar.tsx                           │
│   │   │   └── Footer.tsx                            │
│   │   └── ui/                # UI primitives        │
│   │       ├── Button.tsx                            │
│   │       ├── Card.tsx                              │
│   │       ├── Input.tsx                             │
│   │       └── Modal.tsx                             │
│   ├── lib/                   # Utilities            │
│   │   └── utils.ts                                  │
│   └── types/                 # Type definitions     │
│       └── index.ts                                  │
└─────────────────────────────────────────────────────┘
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [ ] `CLAUDE.md` has coding conventions section
- [ ] `docs/01-plan/conventions.md` exists (Phase 2 output)
- [ ] `CONVENTIONS.md` exists at project root
- [ ] ESLint configuration (`.eslintrc.*`)
- [ ] Prettier configuration (`.prettierrc`)
- [ ] TypeScript configuration (`tsconfig.json`)

### 7.2 Color System (Grayscale Only)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#000000` | 메인 배경 |
| `--bg-secondary` | `#0a0a0a` | 카드/섹션 배경 |
| `--bg-tertiary` | `#171717` | 호버/액티브 상태 |
| `--border` | `#262626` | 보더 |
| `--border-hover` | `#404040` | 호버 보더 |
| `--text-primary` | `#ffffff` | 메인 텍스트 |
| `--text-secondary` | `#a3a3a3` | 보조 텍스트 |
| `--text-muted` | `#737373` | 비활성 텍스트 |

### 7.3 Opacity Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `opacity-0` | 0% | 완전 투명 |
| `opacity-10` | 10% | 미묘한 오버레이 |
| `opacity-25` | 25% | 약한 배경 |
| `opacity-50` | 50% | 중간 배경 |
| `opacity-75` | 75% | 강한 배경 |
| `opacity-100` | 100% | 완전 불투명 |

### 7.4 Typography Scale

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 12px | 16px | Caption |
| `text-sm` | 14px | 20px | Small body |
| `text-base` | 16px | 24px | Body |
| `text-lg` | 18px | 28px | Large body |
| `text-xl` | 20px | 28px | Heading 4 |
| `text-2xl` | 24px | 32px | Heading 3 |
| `text-3xl` | 30px | 36px | Heading 2 |
| `text-4xl` | 36px | 40px | Heading 1 |

---

## 8. Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 16.1 (latest) |
| Bundler | Turbopack | Built-in (기본) |
| React | React | 19.2 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Package Manager | npm / pnpm | latest |
| Node.js | Node.js | 20.x+ |

### 8.1 Next.js 16 주요 특징

| 기능 | 설명 |
|------|------|
| **Turbopack (기본)** | Webpack 대비 빠른 빌드, 이제 기본 번들러 |
| **Cache Components** | `"use cache"` 디렉티브로 명시적 캐싱 |
| **React Compiler** | 자동 메모이제이션, 수동 최적화 불필요 |
| **proxy.ts** | middleware.ts → proxy.ts로 이름 변경 |
| **View Transitions** | React 19.2 View Transitions API 지원 |

---

## 9. Next Steps

1. [ ] 팀 리뷰 및 승인
2. [ ] Design 문서 작성 (`wireframe-boilerplate.design.md`)
3. [ ] 구현 시작

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-05 | Initial draft | Claude |
