# wireframe-v2 Design Document

> **Summary**: 와이어프레임 보일러플레이트 V2 - 추가 UI 컴포넌트 및 라이트모드 기술 설계서
>
> **Project**: wireframe-boilerplate
> **Version**: 2.0.0
> **Author**: Claude
> **Date**: 2026-02-05
> **Status**: Draft
> **Planning Doc**: [wireframe-v2.plan.md](../../01-plan/features/wireframe-v2.plan.md)
> **Base**: wireframe-boilerplate V1 (98% Match Rate 완료)

---

## 1. Overview

### 1.1 Design Goals

- **테마 확장**: 기존 다크모드 + 라이트모드 지원
- **폼 컴포넌트 확장**: DatePicker, TimePicker, Dropdown 추가
- **데이터 시각화**: Chart, Table 컴포넌트 추가
- **페이지 패턴**: 인증, 게시판 UI 패턴 제공

### 1.2 Design Principles (V1 유지)

- **Grayscale Only**: 검정, 흰색, 회색, 투명도만 사용
- **Component First**: 모든 UI는 재사용 가능한 컴포넌트로 구성
- **Minimal Dependencies**: 핵심 기능만 포함
- **Theme Aware**: 모든 컴포넌트가 라이트/다크 모드 지원

---

## 2. Architecture

### 2.1 Component Diagram (V2 추가분)

```
┌─────────────────────────────────────────────────────────────────┐
│                     ThemeProvider (NEW)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      App Shell                              │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  Header (+ Theme Toggle)                                   │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  NEW Components                                       │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │  │
│  │  │  │DatePicker│ │TimePicker│ │ Dropdown │            │  │  │
│  │  │  └──────────┘ └──────────┘ └──────────┘            │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │  │
│  │  │  │  Dialog  │ │  Table   │ │  Chart   │            │  │  │
│  │  │  └──────────┘ └──────────┘ └──────────┘            │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌──────────┐ ┌──────────┐                          │  │  │
│  │  │  │LoginForm │ │SignupForm│  (Auth Forms)            │  │  │
│  │  │  └──────────┘ └──────────┘                          │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌──────────┐ ┌──────────┐                          │  │  │
│  │  │  │BoardList │ │BoardDetail│ (Board)                 │  │  │
│  │  │  └──────────┘ └──────────┘                          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 File Structure (V2 추가분)

```
wireframe-boilerplate/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # ThemeProvider 래핑 추가
│   │   ├── page.tsx             # V2 컴포넌트 쇼케이스 추가
│   │   ├── globals.css          # Light mode CSS 변수 추가
│   │   └── examples/
│   │       ├── dashboard/       # 기존
│   │       ├── landing/         # 기존
│   │       ├── form/            # 기존
│   │       ├── auth/            # NEW: 로그인/회원가입 예시
│   │       │   └── page.tsx
│   │       ├── board/           # NEW: 게시판 예시
│   │       │   └── page.tsx
│   │       └── charts/          # NEW: 차트 예시
│   │           └── page.tsx
│   ├── components/
│   │   ├── layout/              # 기존 (Header에 테마 토글 추가)
│   │   ├── ui/
│   │   │   ├── ... (기존)
│   │   │   ├── DatePicker.tsx   # NEW
│   │   │   ├── TimePicker.tsx   # NEW
│   │   │   ├── Dropdown.tsx     # NEW
│   │   │   ├── Dialog.tsx       # NEW
│   │   │   ├── Table.tsx        # NEW
│   │   │   └── Chart.tsx        # NEW
│   │   ├── forms/               # NEW directory
│   │   │   ├── index.ts
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── board/               # NEW directory
│   │   │   ├── index.ts
│   │   │   ├── BoardList.tsx
│   │   │   └── BoardDetail.tsx
│   │   └── providers/           # NEW directory
│   │       ├── index.ts
│   │       └── ThemeProvider.tsx
│   └── types/
│       └── index.ts             # V2 타입 추가
├── package.json                 # recharts, date-fns 추가
└── ...
```

### 2.3 New Dependencies

| Package | Version | Purpose | Bundle Size |
|---------|---------|---------|-------------|
| `recharts` | ^2.15.0 | 차트 라이브러리 | ~200kb (tree-shaking) |
| `date-fns` | ^4.1.0 | 날짜 유틸리티 | ~10kb (tree-shaking) |

---

## 3. Theme System (NEW)

### 3.1 Theme Architecture

```typescript
// ThemeProvider context
interface ThemeContextType {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}
```

### 3.2 Color Tokens (Extended)

```css
/* globals.css */

/* Dark Mode (기존 - 기본값) */
:root {
  --bg-primary: #000000;
  --bg-secondary: #0a0a0a;
  --bg-tertiary: #171717;
  --bg-elevated: #1a1a1a;

  --border-default: #262626;
  --border-hover: #404040;
  --border-focus: #525252;

  --text-primary: #ffffff;
  --text-secondary: #a3a3a3;
  --text-muted: #737373;
  --text-disabled: #525252;
}

/* Light Mode (NEW) */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --bg-tertiary: #f5f5f5;
  --bg-elevated: #ffffff;

  --border-default: #e5e5e5;
  --border-hover: #d4d4d4;
  --border-focus: #a3a3a3;

  --text-primary: #171717;
  --text-secondary: #525252;
  --text-muted: #737373;
  --text-disabled: #a3a3a3;
}
```

### 3.3 Theme Toggle Button

```typescript
interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

// 아이콘: Sun (Light) / Moon (Dark)
// 위치: Header 오른쪽
```

---

## 4. Component Specifications (NEW)

### 4.1 DatePicker

```typescript
interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  format?: string // default: "yyyy-MM-dd"
  className?: string
}
```

**Visual Design:**
```
┌─────────────────────────────┐
│  📅  Select date...      ▼  │
└─────────────────────────────┘

┌─────────────────────────────┐  (Dropdown)
│  ◀  February 2026  ▶       │
├─────────────────────────────┤
│ Su Mo Tu We Th Fr Sa        │
│                    1        │
│  2  3  4  5 [6] 7  8       │
│  9 10 11 12 13 14 15       │
│ 16 17 18 19 20 21 22       │
│ 23 24 25 26 27 28          │
└─────────────────────────────┘
```

**Implementation Notes:**
- 캘린더 드롭다운은 `position: absolute`
- 날짜 셀은 grid 레이아웃
- 선택된 날짜: `bg-white/20` (dark) / `bg-neutral-900 text-white` (light)
- 오늘 날짜: ring 표시
- date-fns 사용: `format`, `startOfMonth`, `endOfMonth`, `eachDayOfInterval`

### 4.2 TimePicker

```typescript
interface TimePickerProps {
  value?: string // "HH:mm" format
  onChange?: (time: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  step?: number // minutes interval (default: 30)
  minTime?: string
  maxTime?: string
  className?: string
}
```

**Visual Design:**
```
┌─────────────────────────────┐
│  🕐  Select time...      ▼  │
└─────────────────────────────┘

┌─────────────────────────────┐  (Dropdown)
│  00:00                      │
│  00:30                      │
│  01:00                      │
│ [09:00] ← selected          │
│  09:30                      │
│  ...                        │
└─────────────────────────────┘
```

**Implementation Notes:**
- 시간 목록은 step 간격으로 생성
- 스크롤 가능한 드롭다운 (max-height)
- 선택된 시간 하이라이트

### 4.3 Dropdown (Select)

```typescript
interface DropdownOption {
  value: string
  label: string
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
  clearable?: boolean
  className?: string
}
```

**Visual Design:**
```
┌─────────────────────────────┐
│  Select option...        ▼  │
└─────────────────────────────┘

┌─────────────────────────────┐  (Dropdown)
│  🔍 Search...              │  (if searchable)
├─────────────────────────────┤
│  Option 1                   │
│ [Option 2] ← selected       │
│  Option 3                   │
│  Option 4 (disabled)        │
└─────────────────────────────┘
```

**Implementation Notes:**
- 기본 select 대체 커스텀 컴포넌트
- 키보드 네비게이션 지원 (Arrow Up/Down, Enter, Escape)
- 외부 클릭 시 닫힘

### 4.4 Dialog

```typescript
interface DialogProps {
  type: 'alert' | 'confirm' | 'prompt'
  open: boolean
  onClose: () => void
  onConfirm?: (value?: string) => void
  title: string
  message: string
  confirmText?: string // default: "확인"
  cancelText?: string // default: "취소"
  placeholder?: string // for prompt type
  defaultValue?: string // for prompt type
}
```

**Visual Design:**
```
┌─────────────────────────────────────┐
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ⚠️ Title                   │   │
│  │                              │   │
│  │  Message goes here...        │   │
│  │                              │   │
│  │  ┌─────────────────────┐    │   │  (prompt only)
│  │  │ Input value...      │    │   │
│  │  └─────────────────────┘    │   │
│  │                              │   │
│  │         [Cancel] [Confirm]  │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Types:**
- `alert`: 확인 버튼만
- `confirm`: 취소 + 확인 버튼
- `prompt`: 입력 필드 + 취소 + 확인 버튼

### 4.5 Table

```typescript
interface TableColumn<T> {
  key: keyof T | string
  header: string
  width?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, row: T, index: number) => React.ReactNode
}

interface TableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  sortable?: boolean
  pagination?: boolean
  pageSize?: number // default: 10
  currentPage?: number
  onPageChange?: (page: number) => void
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  onRowClick?: (row: T, index: number) => void
  emptyMessage?: string
  loading?: boolean
  className?: string
}
```

**Visual Design:**
```
┌────────────────────────────────────────────────────────┐
│ Name ▲         │ Email              │ Status │ Actions │
├────────────────────────────────────────────────────────┤
│ John Doe       │ john@example.com   │ Active │ [Edit]  │
│ Jane Smith     │ jane@example.com   │ Pending│ [Edit]  │
│ Bob Wilson     │ bob@example.com    │ Active │ [Edit]  │
├────────────────────────────────────────────────────────┤
│ ◀ 1 2 3 ... 10 ▶                     Showing 1-10 of 50│
└────────────────────────────────────────────────────────┘
```

**Features:**
- 헤더 정렬 표시 (▲/▼)
- 페이지네이션
- 로딩 상태 (Skeleton)
- 빈 상태 메시지

### 4.6 Chart

```typescript
interface ChartDataPoint {
  name: string
  value: number
  color?: string // grayscale only
}

interface ChartProps {
  type: 'bar' | 'line' | 'pie'
  data: ChartDataPoint[]
  width?: number | string
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  className?: string
}
```

**Visual Design (Bar Chart):**
```
┌─────────────────────────────────────────────────┐
│  Sales Data                                      │
│                                                  │
│  100 ┤                    ████                  │
│   80 ┤       ████         ████                  │
│   60 ┤       ████  ████   ████  ████           │
│   40 ┤ ████  ████  ████   ████  ████           │
│   20 ┤ ████  ████  ████   ████  ████           │
│    0 ┼─────────────────────────────────         │
│       Jan   Feb   Mar    Apr   May              │
│                                                  │
│  ■ Sales                                        │
└─────────────────────────────────────────────────┘
```

**Grayscale Colors for Charts:**
```typescript
const chartColors = [
  '#ffffff',  // white
  '#a3a3a3',  // gray-400
  '#737373',  // gray-500
  '#525252',  // gray-600
  '#404040',  // gray-700
  '#262626',  // gray-800
]
```

**recharts Components Used:**
- Bar Chart: `<BarChart>`, `<Bar>`, `<XAxis>`, `<YAxis>`, `<CartesianGrid>`
- Line Chart: `<LineChart>`, `<Line>`
- Pie Chart: `<PieChart>`, `<Pie>`, `<Cell>`

---

## 5. Form Components (NEW)

### 5.1 LoginForm

```typescript
interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void
  onForgotPassword?: () => void
  onSignup?: () => void
  loading?: boolean
  error?: string
  className?: string
}
```

**Visual Design:**
```
┌─────────────────────────────────────────┐
│                                         │
│              Welcome back               │
│         Sign in to your account         │
│                                         │
│  Email                                  │
│  ┌─────────────────────────────────┐   │
│  │ email@example.com               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Password                               │
│  ┌─────────────────────────────────┐   │
│  │ ••••••••                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ☐ Remember me      Forgot password?   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │           Sign In               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Don't have an account? Sign up        │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 SignupForm

```typescript
interface SignupFormProps {
  onSubmit?: (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => void
  onLogin?: () => void
  loading?: boolean
  error?: string
  className?: string
}
```

**Visual Design:**
```
┌─────────────────────────────────────────┐
│                                         │
│            Create account               │
│       Sign up to get started            │
│                                         │
│  Full Name                              │
│  ┌─────────────────────────────────┐   │
│  │ John Doe                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Email                                  │
│  ┌─────────────────────────────────┐   │
│  │ email@example.com               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Password                               │
│  ┌─────────────────────────────────┐   │
│  │ ••••••••                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Confirm Password                       │
│  ┌─────────────────────────────────┐   │
│  │ ••••••••                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ☐ I agree to Terms & Privacy Policy   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │          Create Account         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Already have an account? Sign in      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. Board Components (NEW)

### 6.1 BoardList

```typescript
interface BoardItem {
  id: string | number
  title: string
  author: string
  date: string | Date
  views?: number
  comments?: number
  category?: string
  pinned?: boolean
}

interface BoardListProps {
  items: BoardItem[]
  onItemClick?: (item: BoardItem) => void
  onPageChange?: (page: number) => void
  currentPage?: number
  totalPages?: number
  loading?: boolean
  emptyMessage?: string
  showCategory?: boolean
  className?: string
}
```

**Visual Design:**
```
┌─────────────────────────────────────────────────────────────────┐
│ 📋 게시판                                         [글쓰기]     │
├─────────────────────────────────────────────────────────────────┤
│ Category │ Title                          │ Author  │ Date     │
├─────────────────────────────────────────────────────────────────┤
│ 📌 공지  │ 중요 공지사항입니다            │ Admin   │ 02-05    │
├─────────────────────────────────────────────────────────────────┤
│ 일반     │ 첫 번째 게시글입니다           │ John    │ 02-04    │
│ 질문     │ 질문이 있습니다                │ Jane    │ 02-03    │
│ 일반     │ 안녕하세요!                    │ Bob     │ 02-02    │
├─────────────────────────────────────────────────────────────────┤
│                    ◀ 1 2 3 4 5 ▶                               │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 BoardDetail

```typescript
interface BoardDetailProps {
  title: string
  content: string
  author: string
  date: string | Date
  views?: number
  category?: string
  onBack?: () => void
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
  className?: string
}
```

**Visual Design:**
```
┌─────────────────────────────────────────────────────────────────┐
│ ← 목록으로                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [일반] 첫 번째 게시글입니다                                     │
│                                                                  │
│ 작성자: John Doe  │  작성일: 2026-02-04  │  조회수: 123         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ 본문 내용이 여기에 표시됩니다.                                  │
│                                                                  │
│ 여러 줄의 내용을 포함할 수 있습니다.                           │
│                                                                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                         [수정]  [삭제]          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Example Pages (NEW)

### 7.1 Auth Example (`/examples/auth`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Logo                                            [☀️/🌙] [Home] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐     ┌─────────────────────┐           │
│  │                     │     │                     │           │
│  │    [Login Form]     │     │   [Signup Form]     │           │
│  │                     │     │                     │           │
│  │                     │     │                     │           │
│  └─────────────────────┘     └─────────────────────┘           │
│                                                                  │
│  Toggle: [Login] [Signup]                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Board Example (`/examples/board`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Logo                                            [☀️/🌙] [Home] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Toggle: [List View] [Detail View]                              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │              [BoardList] or [BoardDetail]                 │   │
│  │                                                           │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Charts Example (`/examples/charts`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Logo                                            [☀️/🌙] [Home] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ## Chart Components                                            │
│                                                                  │
│  ┌───────────────────────┐  ┌───────────────────────┐         │
│  │     [Bar Chart]       │  │    [Line Chart]       │         │
│  │                       │  │                       │         │
│  └───────────────────────┘  └───────────────────────┘         │
│                                                                  │
│  ┌───────────────────────┐  ┌───────────────────────┐         │
│  │     [Pie Chart]       │  │     [Table]           │         │
│  │                       │  │                       │         │
│  └───────────────────────┘  └───────────────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Type Definitions (NEW)

```typescript
// src/types/index.ts (V2 추가분)

// Theme
export type Theme = 'light' | 'dark'

// DatePicker
export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  format?: string
  className?: string
}

// TimePicker
export interface TimePickerProps {
  value?: string
  onChange?: (time: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  step?: number
  minTime?: string
  maxTime?: string
  className?: string
}

// Dropdown
export interface DropdownOption {
  value: string
  label: string
  disabled?: boolean
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
  clearable?: boolean
  className?: string
}

// Dialog
export type DialogType = 'alert' | 'confirm' | 'prompt'

export interface DialogProps {
  type: DialogType
  open: boolean
  onClose: () => void
  onConfirm?: (value?: string) => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  placeholder?: string
  defaultValue?: string
}

// Table
export interface TableColumn<T> {
  key: keyof T | string
  header: string
  width?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, row: T, index: number) => React.ReactNode
}

export interface TableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  onRowClick?: (row: T, index: number) => void
  emptyMessage?: string
  loading?: boolean
  className?: string
}

// Chart
export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export type ChartType = 'bar' | 'line' | 'pie'

export interface ChartProps {
  type: ChartType
  data: ChartDataPoint[]
  width?: number | string
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  className?: string
}

// Board
export interface BoardItem {
  id: string | number
  title: string
  author: string
  date: string | Date
  views?: number
  comments?: number
  category?: string
  pinned?: boolean
}

export interface BoardListProps {
  items: BoardItem[]
  onItemClick?: (item: BoardItem) => void
  onPageChange?: (page: number) => void
  currentPage?: number
  totalPages?: number
  loading?: boolean
  emptyMessage?: string
  showCategory?: boolean
  className?: string
}

export interface BoardDetailProps {
  title: string
  content: string
  author: string
  date: string | Date
  views?: number
  category?: string
  onBack?: () => void
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
  className?: string
}

// Auth Forms
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms?: boolean
}

export interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void
  onForgotPassword?: () => void
  onSignup?: () => void
  loading?: boolean
  error?: string
  className?: string
}

export interface SignupFormProps {
  onSubmit?: (data: SignupFormData) => void
  onLogin?: () => void
  loading?: boolean
  error?: string
  className?: string
}
```

---

## 9. Implementation Order

| Order | Task | File(s) | Priority | Dependency |
|-------|------|---------|----------|------------|
| 1 | ThemeProvider | `providers/ThemeProvider.tsx` | High | - |
| 2 | globals.css Light Mode | `globals.css` | High | - |
| 3 | layout.tsx 수정 | `layout.tsx` | High | ThemeProvider |
| 4 | Dropdown | `ui/Dropdown.tsx` | High | - |
| 5 | DatePicker | `ui/DatePicker.tsx` | High | Dropdown, date-fns |
| 6 | TimePicker | `ui/TimePicker.tsx` | High | Dropdown |
| 7 | Dialog | `ui/Dialog.tsx` | High | Modal |
| 8 | Table | `ui/Table.tsx` | Medium | - |
| 9 | Chart | `ui/Chart.tsx` | Medium | recharts |
| 10 | LoginForm | `forms/LoginForm.tsx` | Medium | Input, Button |
| 11 | SignupForm | `forms/SignupForm.tsx` | Medium | Input, Button |
| 12 | BoardList | `board/BoardList.tsx` | Medium | Table, Card |
| 13 | BoardDetail | `board/BoardDetail.tsx` | Medium | Card, Button |
| 14 | Auth Example | `examples/auth/page.tsx` | Low | Forms |
| 15 | Board Example | `examples/board/page.tsx` | Low | Board |
| 16 | Charts Example | `examples/charts/page.tsx` | Low | Chart, Table |
| 17 | Home Page 업데이트 | `page.tsx` | Low | All |
| 18 | Types 추가 | `types/index.ts` | High | - |

---

## 10. Commands

```bash
# 새 의존성 설치
npm install recharts date-fns

# 개발 서버 실행
npm run dev

# 타입 체크
npx tsc --noEmit

# 빌드
npm run build
```

---

## 11. Acceptance Criteria

### 11.1 Functional

- [ ] 라이트/다크 모드 토글 작동
- [ ] 테마 상태 localStorage 저장
- [ ] DatePicker 날짜 선택 작동
- [ ] TimePicker 시간 선택 작동
- [ ] Dropdown 옵션 선택 작동
- [ ] Dialog (alert/confirm/prompt) 작동
- [ ] Table 정렬, 페이지네이션 작동
- [ ] Chart (bar/line/pie) 렌더링
- [ ] LoginForm 유효성 검사
- [ ] SignupForm 유효성 검사
- [ ] BoardList 목록 표시
- [ ] BoardDetail 상세 표시
- [ ] 모든 예시 페이지 정상 작동

### 11.2 Technical

- [ ] TypeScript 에러 없음
- [ ] `npm run build` 성공
- [ ] 모든 컴포넌트 Grayscale 색상만 사용
- [ ] 모든 컴포넌트 라이트/다크 모드 지원
- [ ] 키보드 네비게이션 지원 (Dropdown, DatePicker)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-05 | Initial draft | Claude |
