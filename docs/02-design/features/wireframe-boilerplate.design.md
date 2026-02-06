# wireframe-boilerplate Design Document

> **Summary**: Next.js 16 기반 Grayscale 다크모드 와이어프레임 보일러플레이트 기술 설계서
>
> **Project**: lab
> **Version**: 1.0.0
> **Author**: Claude
> **Date**: 2026-02-05
> **Status**: Draft
> **Planning Doc**: [wireframe-boilerplate.plan.md](../01-plan/features/wireframe-boilerplate.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- **빠른 프로토타이핑**: 최소한의 설정으로 와이어프레임 페이지 생성
- **일관된 스타일**: Grayscale 전용 디자인 토큰으로 통일성 유지
- **재사용성**: 모든 컴포넌트가 독립적으로 재사용 가능
- **개발 경험**: Turbopack 기반 빠른 HMR, TypeScript 완벽 지원

### 1.2 Design Principles

- **Grayscale Only**: 검정, 흰색, 회색, 투명도만 사용
- **Component First**: 모든 UI는 재사용 가능한 컴포넌트로 구성
- **Minimal Dependencies**: 핵심 기능만 포함, 불필요한 의존성 배제
- **Mobile First**: 반응형 그리드, 모바일 우선 디자인

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App Shell                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Header                             │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌──────────┐  ┌────────────────────────────────────────┐   │
│  │          │  │                                         │   │
│  │ Sidebar  │  │              Main Content               │   │
│  │ (옵션)   │  │                                         │   │
│  │          │  │   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │   │
│  │          │  │   │Card │ │Card │ │Card │ │Card │     │   │
│  │          │  │   └─────┘ └─────┘ └─────┘ └─────┘     │   │
│  │          │  │                                         │   │
│  └──────────┘  └────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Footer                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 File Structure

```
wireframe-boilerplate/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (다크모드 설정)
│   │   ├── page.tsx             # Home page (컴포넌트 쇼케이스)
│   │   ├── globals.css          # CSS 변수 & Tailwind
│   │   └── examples/
│   │       ├── dashboard/
│   │       │   └── page.tsx     # 대시보드 예시
│   │       ├── landing/
│   │       │   └── page.tsx     # 랜딩페이지 예시
│   │       └── form/
│   │           └── page.tsx     # 폼 예시
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # 헤더 컴포넌트
│   │   │   ├── Sidebar.tsx      # 사이드바 컴포넌트
│   │   │   ├── Footer.tsx       # 푸터 컴포넌트
│   │   │   └── Container.tsx    # 컨테이너 래퍼
│   │   └── ui/
│   │       ├── Button.tsx       # 버튼 컴포넌트
│   │       ├── Card.tsx         # 카드 컴포넌트
│   │       ├── Input.tsx        # 인풋 컴포넌트
│   │       ├── Modal.tsx        # 모달 컴포넌트
│   │       ├── Badge.tsx        # 뱃지 컴포넌트
│   │       ├── Avatar.tsx       # 아바타 컴포넌트
│   │       └── Skeleton.tsx     # 스켈레톤 로딩
│   ├── lib/
│   │   └── utils.ts             # cn() 유틸리티
│   └── types/
│       └── index.ts             # 공통 타입 정의
├── tailwind.config.ts           # Tailwind v4 설정
├── next.config.ts               # Next.js 16 설정
├── tsconfig.json                # TypeScript 설정
└── package.json
```

### 2.3 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^16.1.0 | Framework (Turbopack 기본) |
| `react` | ^19.2.0 | UI Library |
| `react-dom` | ^19.2.0 | React DOM |
| `tailwindcss` | ^4.0.0 | Styling |
| `clsx` | ^2.1.0 | 조건부 클래스 |
| `tailwind-merge` | ^2.5.0 | 클래스 병합 |
| `typescript` | ^5.7.0 | Type Safety |

---

## 3. Design Tokens

### 3.1 Color System (Grayscale Only)

```css
:root {
  /* Background */
  --bg-primary: #000000;      /* 메인 배경 */
  --bg-secondary: #0a0a0a;    /* 카드/섹션 배경 */
  --bg-tertiary: #171717;     /* 호버/액티브 */
  --bg-elevated: #1a1a1a;     /* 띄워진 요소 */

  /* Border */
  --border-default: #262626;  /* 기본 보더 */
  --border-hover: #404040;    /* 호버 보더 */
  --border-focus: #525252;    /* 포커스 보더 */

  /* Text */
  --text-primary: #ffffff;    /* 메인 텍스트 */
  --text-secondary: #a3a3a3;  /* 보조 텍스트 */
  --text-muted: #737373;      /* 비활성 텍스트 */
  --text-disabled: #525252;   /* 비활성화 텍스트 */
}
```

### 3.2 Tailwind Custom Colors

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        wire: {
          bg: {
            primary: '#000000',
            secondary: '#0a0a0a',
            tertiary: '#171717',
            elevated: '#1a1a1a',
          },
          border: {
            DEFAULT: '#262626',
            hover: '#404040',
            focus: '#525252',
          },
          text: {
            primary: '#ffffff',
            secondary: '#a3a3a3',
            muted: '#737373',
            disabled: '#525252',
          },
        },
      },
    },
  },
}
```

### 3.3 Opacity Scale

| Class | Value | Usage |
|-------|-------|-------|
| `opacity-5` | 5% | 미묘한 오버레이 |
| `opacity-10` | 10% | 약한 배경 |
| `opacity-20` | 20% | 호버 상태 |
| `opacity-50` | 50% | 중간 강조 |
| `opacity-75` | 75% | 강한 배경 |
| `opacity-100` | 100% | 완전 불투명 |

### 3.4 Typography Scale

```typescript
// Tailwind 기본 스케일 사용
const typography = {
  'text-xs': '12px / 16px',     // Caption
  'text-sm': '14px / 20px',     // Small
  'text-base': '16px / 24px',   // Body
  'text-lg': '18px / 28px',     // Large
  'text-xl': '20px / 28px',     // H4
  'text-2xl': '24px / 32px',    // H3
  'text-3xl': '30px / 36px',    // H2
  'text-4xl': '36px / 40px',    // H1
  'text-5xl': '48px / 48px',    // Display
}
```

### 3.5 Spacing & Grid

```typescript
// 8px 기반 간격 시스템
const spacing = {
  1: '4px',    // 0.5 unit
  2: '8px',    // 1 unit
  3: '12px',   // 1.5 unit
  4: '16px',   // 2 unit
  6: '24px',   // 3 unit
  8: '32px',   // 4 unit
  12: '48px',  // 6 unit
  16: '64px',  // 8 unit
}

// 반응형 그리드
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}
```

---

## 4. Component Specification

### 4.1 Layout Components

#### Header

```typescript
interface HeaderProps {
  logo?: React.ReactNode;
  navigation?: NavItem[];
  actions?: React.ReactNode;
  sticky?: boolean;
}

// Usage
<Header
  logo={<Logo />}
  navigation={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]}
  actions={<Button>Contact</Button>}
  sticky
/>
```

#### Sidebar

```typescript
interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

interface SidebarItem {
  icon?: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}
```

#### Footer

```typescript
interface FooterProps {
  copyright?: string;
  links?: FooterLink[];
  social?: SocialLink[];
}
```

### 4.2 UI Components

#### Button

```typescript
interface ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

// Variants
// solid: bg-white/10 hover:bg-white/20 border-transparent
// outline: bg-transparent border-wire-border hover:border-wire-border-hover
// ghost: bg-transparent hover:bg-white/5
```

#### Card

```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

// Styles
// default: bg-wire-bg-secondary border border-wire-border
// elevated: bg-wire-bg-elevated shadow-lg
// outlined: bg-transparent border border-wire-border
```

#### Input

```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search';
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

// Styles
// bg-wire-bg-tertiary border-wire-border
// focus:border-wire-border-focus focus:ring-1 focus:ring-wire-border-focus
```

#### Modal

```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

// Backdrop: bg-black/80
// Content: bg-wire-bg-secondary border border-wire-border
```

#### Badge

```typescript
interface BadgeProps {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}
```

#### Avatar

```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

#### Skeleton

```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

// Animation: animate-pulse bg-wire-bg-tertiary
```

---

## 5. Page Examples

### 5.1 Home Page (Component Showcase)

```
/src/app/page.tsx

┌────────────────────────────────────────────────────────────┐
│  Logo                                     [Nav] [Nav] [CTA]│
├────────────────────────────────────────────────────────────┤
│                                                            │
│  # Wireframe Boilerplate                                   │
│  Next.js 16 기반 Grayscale 와이어프레임 키트              │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ## Buttons                                           │ │
│  │  [Solid] [Outline] [Ghost]                           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ## Cards                                             │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐                    │ │
│  │  │Default │ │Elevated│ │Outlined│                    │ │
│  │  └────────┘ └────────┘ └────────┘                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ## Form Elements                                     │ │
│  │  [________] [________] [Open Modal]                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  © 2026 Wireframe Kit                    [Link] [Link]    │
└────────────────────────────────────────────────────────────┘
```

### 5.2 Dashboard Example

```
/src/app/examples/dashboard/page.tsx

┌────────────────────────────────────────────────────────────┐
│  [=] Dashboard                               [🔔] [Avatar]│
├─────────┬──────────────────────────────────────────────────┤
│         │                                                  │
│ [Home]  │  Welcome back                                   │
│ [Users] │                                                  │
│ [Stats] │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐│
│ [Logs]  │  │  1,234  │ │  5,678  │ │  90%    │ │  $12K  ││
│         │  │ Users   │ │ Views   │ │ Uptime  │ │ Revenue││
│─────────│  └─────────┘ └─────────┘ └─────────┘ └────────┘│
│         │                                                  │
│ [Gear]  │  Recent Activity                                │
│         │  ┌────────────────────────────────────────────┐ │
│         │  │ User signed up...              2 min ago   │ │
│         │  │ Order completed...             5 min ago   │ │
│         │  │ Payment received...           10 min ago   │ │
│         │  └────────────────────────────────────────────┘ │
│         │                                                  │
└─────────┴──────────────────────────────────────────────────┘
```

### 5.3 Landing Example

```
/src/app/examples/landing/page.tsx

┌────────────────────────────────────────────────────────────┐
│  Logo               [Feature] [Pricing] [About]    [CTA]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│              Build Faster with Wireframes                  │
│         Prototype your ideas in minutes, not hours         │
│                                                            │
│                   [Get Started]  [Learn More]              │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐        │
│  │  Fast    │      │  Simple  │      │  Clean   │        │
│  │  ----    │      │  ----    │      │  ----    │        │
│  │  ------  │      │  ------  │      │  ------  │        │
│  └──────────┘      └──────────┘      └──────────┘        │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  © 2026                                      [Social Icons]│
└────────────────────────────────────────────────────────────┘
```

---

## 6. Implementation Guide

### 6.1 Implementation Order

| Order | Task | File | Priority |
|-------|------|------|----------|
| 1 | 프로젝트 초기화 (Next.js 16) | `package.json`, `next.config.ts` | High |
| 2 | Tailwind v4 설정 | `tailwind.config.ts`, `globals.css` | High |
| 3 | 유틸리티 함수 | `src/lib/utils.ts` | High |
| 4 | 타입 정의 | `src/types/index.ts` | High |
| 5 | Button 컴포넌트 | `src/components/ui/Button.tsx` | High |
| 6 | Card 컴포넌트 | `src/components/ui/Card.tsx` | High |
| 7 | Input 컴포넌트 | `src/components/ui/Input.tsx` | High |
| 8 | Modal 컴포넌트 | `src/components/ui/Modal.tsx` | Medium |
| 9 | Badge/Avatar/Skeleton | `src/components/ui/` | Medium |
| 10 | Header 컴포넌트 | `src/components/layout/Header.tsx` | High |
| 11 | Sidebar 컴포넌트 | `src/components/layout/Sidebar.tsx` | Medium |
| 12 | Footer 컴포넌트 | `src/components/layout/Footer.tsx` | Medium |
| 13 | Root Layout | `src/app/layout.tsx` | High |
| 14 | Home Page (Showcase) | `src/app/page.tsx` | High |
| 15 | Example Pages | `src/app/examples/` | Low |

### 6.2 Commands

```bash
# 프로젝트 생성
npx create-next-app@latest wireframe-boilerplate --typescript --tailwind --app --turbopack

# 의존성 설치
npm install clsx tailwind-merge

# 개발 서버 실행 (Turbopack 기본)
npm run dev

# 빌드
npm run build
```

---

## 7. Coding Conventions

### 7.1 Component Pattern

```typescript
// 컴포넌트 파일 구조
import { cn } from '@/lib/utils'

// Types
interface ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost'
  // ...
}

// Component
export function Button({ variant = 'solid', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'base-styles',
        variant === 'solid' && 'solid-styles',
        variant === 'outline' && 'outline-styles',
      )}
      {...props}
    />
  )
}
```

### 7.2 File Naming

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase.tsx | `Button.tsx` |
| Utility | camelCase.ts | `utils.ts` |
| Type | index.ts | `types/index.ts` |
| Page | page.tsx | `app/page.tsx` |

### 7.3 Import Order

```typescript
// 1. React/Next.js
import { useState } from 'react'
import Link from 'next/link'

// 2. Third-party
import { clsx } from 'clsx'

// 3. Internal (absolute)
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

// 4. Types
import type { ButtonProps } from '@/types'
```

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool |
|------|--------|------|
| Visual | 컴포넌트 렌더링 | Manual / Storybook (옵션) |
| Build | 빌드 성공 여부 | `npm run build` |
| Type | TypeScript 에러 | `tsc --noEmit` |

### 8.2 Acceptance Criteria

- [ ] `npm run dev` 정상 실행
- [ ] `npm run build` 성공
- [ ] 모든 컴포넌트 Grayscale 색상만 사용
- [ ] 반응형 동작 확인 (Mobile, Tablet, Desktop)
- [ ] TypeScript 에러 없음

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-05 | Initial draft | Claude |
