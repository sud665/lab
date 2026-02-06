# Wireframe Boilerplate V2 Planning Document

> **Summary**: 와이어프레임 보일러플레이트 확장 - 추가 UI 컴포넌트 및 라이트모드
>
> **Project**: wireframe-boilerplate
> **Version**: 2.0.0
> **Author**: Claude
> **Date**: 2026-02-05
> **Status**: Draft
> **Base**: wireframe-boilerplate v1.0 (완료됨)

---

## 1. Overview

### 1.1 Purpose

기존 Grayscale 와이어프레임 보일러플레이트에 추가 UI 컴포넌트와 라이트모드를 확장하여
더 다양한 와이어프레임 시나리오를 지원한다.

### 1.2 Background

- V1에서 기본 컴포넌트 완성 (Button, Card, Input, Modal 등)
- 고객 요구사항: 날짜/시간 선택, 드롭다운, 차트 등 추가 필요
- 라이트모드 지원 요청

### 1.3 Related Documents

- V1 Plan: `docs/01-plan/features/wireframe-boilerplate.plan.md`
- V1 Design: `docs/02-design/features/wireframe-boilerplate.design.md`

---

## 2. Scope

### 2.1 In Scope - 새로운 UI 컴포넌트

| Category | Components | Priority |
|----------|------------|----------|
| **Form Controls** | DatePicker, TimePicker, Dropdown/Select | High |
| **Feedback** | Dialog (Alert, Confirm, Prompt) | High |
| **Data Display** | Chart (Bar, Line, Pie), Table, DataGrid | High |
| **Auth Forms** | LoginForm, SignupForm (UI only) | Medium |
| **Content** | Board/List (게시판 UI) | Medium |
| **Theme** | Light Mode Toggle | High |

### 2.2 In Scope - 예시 페이지

| Page | Description |
|------|-------------|
| `/examples/auth` | 로그인/회원가입 폼 예시 |
| `/examples/board` | 게시판 목록/상세 UI 예시 |
| `/examples/charts` | 차트 컴포넌트 쇼케이스 |

### 2.3 Out of Scope

- 실제 인증 로직 (API 연동 없음)
- 실제 데이터베이스 연동
- 게시판 CRUD API
- 차트 실시간 데이터

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | DatePicker: 날짜 선택 캘린더 UI | High | Pending |
| FR-02 | TimePicker: 시간 선택 UI | High | Pending |
| FR-03 | Dropdown/Select: 옵션 선택 드롭다운 | High | Pending |
| FR-04 | Dialog: Alert, Confirm, Prompt 타입 | High | Pending |
| FR-05 | Chart: Bar, Line, Pie 기본 차트 | High | Pending |
| FR-06 | Table: 정렬, 페이지네이션 지원 | Medium | Pending |
| FR-07 | LoginForm: 이메일/패스워드 폼 | Medium | Pending |
| FR-08 | SignupForm: 회원가입 폼 | Medium | Pending |
| FR-09 | BoardList: 게시판 목록 UI | Medium | Pending |
| FR-10 | BoardDetail: 게시판 상세 UI | Medium | Pending |
| FR-11 | Light Mode: 테마 토글 | High | Pending |
| FR-12 | ThemeProvider: 테마 상태 관리 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria |
|----------|----------|
| Performance | 차트 라이브러리 번들 사이즈 최소화 |
| Accessibility | 키보드 네비게이션 지원 |
| Consistency | 기존 Grayscale 디자인 토큰 유지 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 모든 새 컴포넌트 구현
- [ ] 라이트/다크 모드 토글 작동
- [ ] 예시 페이지에서 모든 컴포넌트 시연 가능
- [ ] TypeScript 에러 없음
- [ ] `npm run build` 성공

### 4.2 Quality Criteria

- [ ] 기존 V1 컴포넌트와 일관된 API
- [ ] 모든 컴포넌트 Grayscale 색상만 사용

---

## 5. Architecture

### 5.1 New Components Structure

```
src/components/
├── ui/
│   ├── ... (기존 V1)
│   ├── DatePicker.tsx      # NEW
│   ├── TimePicker.tsx      # NEW
│   ├── Dropdown.tsx        # NEW (Select)
│   ├── Dialog.tsx          # NEW
│   ├── Table.tsx           # NEW
│   └── Chart.tsx           # NEW
├── forms/                   # NEW directory
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── board/                   # NEW directory
│   ├── BoardList.tsx
│   └── BoardDetail.tsx
└── providers/               # NEW directory
    └── ThemeProvider.tsx
```

### 5.2 New Example Pages

```
src/app/examples/
├── ... (기존)
├── auth/
│   └── page.tsx            # 로그인/회원가입 예시
├── board/
│   └── page.tsx            # 게시판 예시
└── charts/
    └── page.tsx            # 차트 예시
```

### 5.3 Dependencies to Add

| Package | Purpose | Alternative |
|---------|---------|-------------|
| `recharts` | 차트 라이브러리 | lightweight, React 기반 |
| `date-fns` | 날짜 유틸리티 | dayjs 대비 tree-shaking |

---

## 6. Component Specifications

### 6.1 DatePicker

```typescript
interface DatePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}
```

### 6.2 TimePicker

```typescript
interface TimePickerProps {
  value?: string // "HH:mm" format
  onChange?: (time: string) => void
  placeholder?: string
  disabled?: boolean
  step?: number // minutes interval
}
```

### 6.3 Dropdown/Select

```typescript
interface DropdownProps {
  options: { value: string; label: string }[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
}
```

### 6.4 Dialog

```typescript
interface DialogProps {
  type: 'alert' | 'confirm' | 'prompt'
  open: boolean
  onClose: () => void
  onConfirm?: (value?: string) => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}
```

### 6.5 Chart

```typescript
interface ChartProps {
  type: 'bar' | 'line' | 'pie'
  data: ChartData[]
  width?: number
  height?: number
  showLegend?: boolean
  showGrid?: boolean
}

interface ChartData {
  name: string
  value: number
  color?: string // grayscale only
}
```

### 6.6 Table

```typescript
interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
  onRowClick?: (row: T) => void
}

interface TableColumn<T> {
  key: keyof T
  header: string
  width?: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
}
```

### 6.7 Theme System

```typescript
// Light mode colors
const lightTheme = {
  bg: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    tertiary: '#e5e5e5',
  },
  border: {
    default: '#d4d4d4',
    hover: '#a3a3a3',
  },
  text: {
    primary: '#171717',
    secondary: '#525252',
    muted: '#737373',
  },
}

// Dark mode colors (기존)
const darkTheme = {
  bg: {
    primary: '#000000',
    secondary: '#0a0a0a',
    tertiary: '#171717',
  },
  // ...
}
```

---

## 7. Implementation Order

| Order | Task | Priority | Dependency |
|-------|------|----------|------------|
| 1 | ThemeProvider + Light/Dark toggle | High | - |
| 2 | Dropdown/Select | High | - |
| 3 | DatePicker | High | Dropdown |
| 4 | TimePicker | High | Dropdown |
| 5 | Dialog (Alert, Confirm, Prompt) | High | Modal |
| 6 | Table | Medium | - |
| 7 | Chart (recharts) | Medium | - |
| 8 | LoginForm | Medium | Input, Button |
| 9 | SignupForm | Medium | Input, Button |
| 10 | BoardList | Medium | Table, Card |
| 11 | BoardDetail | Medium | Card, Button |
| 12 | Auth 예시 페이지 | Low | Forms |
| 13 | Board 예시 페이지 | Low | Board |
| 14 | Charts 예시 페이지 | Low | Chart |
| 15 | Home 페이지 업데이트 | Low | All |

---

## 8. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| recharts 번들 사이즈 | Medium | Medium | tree-shaking 활용 |
| DatePicker 복잡도 | Medium | High | 단순한 캘린더 UI로 시작 |
| 테마 전환 깜빡임 | Low | Medium | CSS variables 사용 |

---

## 9. Next Steps

1. [ ] Design 문서 작성
2. [ ] ThemeProvider 구현부터 시작
3. [ ] 컴포넌트 순차 구현

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-05 | Initial draft | Claude |
