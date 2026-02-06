# ai-page-generator Plan

> **Feature**: AI Page Generator - 프롬프트 기반 React 페이지 자동 생성기
> **Level**: Dynamic
> **Created**: 2026-02-05
> **Status**: Draft

---

## 1. Overview

### 1.1 Problem Statement

- 개발자/비개발자가 빠르게 웹 페이지 프로토타입을 만들고 싶음
- 디자인 → 코드 변환 과정이 시간 소요
- Claude Artifact처럼 프롬프트만으로 즉시 결과를 보고 싶음

### 1.2 Solution

사용자가 자연어로 요구사항을 입력하면:
1. Claude API가 React/Next.js 컴포넌트 코드 생성
2. 실시간으로 브라우저에서 렌더링된 결과 미리보기
3. 생성된 코드 복사/다운로드 가능

### 1.3 Target Users

| User Type | Use Case |
|-----------|----------|
| 개발자 | 빠른 프로토타이핑, 보일러플레이트 생성 |
| 디자이너 | 아이디어를 즉시 코드로 검증 |
| PM/기획자 | 요구사항을 시각화하여 커뮤니케이션 |
| 비개발자 | 간단한 랜딩페이지, 포트폴리오 제작 |

---

## 2. Feature Requirements

### 2.1 Core Features (MVP)

| ID | Feature | Priority | Description |
|----|---------|:--------:|-------------|
| F01 | 프롬프트 입력 UI | P0 | 텍스트 영역 + 생성 버튼 |
| F02 | Claude API 연동 | P0 | Anthropic SDK로 코드 생성 요청 |
| F03 | 실시간 미리보기 | P0 | iframe/sandbox에서 생성된 코드 렌더링 |
| F04 | 코드 뷰어 | P0 | 생성된 코드 표시 (syntax highlighting) |
| F05 | 코드 복사 | P1 | 클립보드에 코드 복사 |
| F06 | 스트리밍 응답 | P1 | 코드 생성 과정을 실시간으로 표시 |

### 2.2 Enhanced Features (Phase 2)

| ID | Feature | Priority | Description |
|----|---------|:--------:|-------------|
| F07 | 프롬프트 히스토리 | P2 | 이전 생성 기록 저장/불러오기 |
| F08 | 템플릿 프리셋 | P2 | 랜딩페이지, 대시보드 등 프리셋 |
| F09 | 코드 다운로드 | P2 | .tsx 파일로 다운로드 |
| F10 | 다크/라이트 모드 | P2 | 에디터 테마 전환 |

### 2.3 Advanced Features (Phase 3)

| ID | Feature | Priority | Description |
|----|---------|:--------:|-------------|
| F11 | 수정 요청 | P3 | "버튼 색상 빨간색으로" 등 후속 수정 |
| F12 | 멀티 파일 생성 | P3 | 여러 컴포넌트 동시 생성 |
| F13 | 이미지 업로드 | P3 | 디자인 이미지 → 코드 변환 |

---

## 3. Technical Architecture

### 3.1 Tech Stack

| Category | Technology | Reason |
|----------|------------|--------|
| **App Framework** | Next.js 16 (App Router) | 최신 버전, Turbopack |
| **AI Backend** | Anthropic Claude API | 코드 생성 품질 우수 |
| **Styling** | Tailwind CSS v4 | 생성 코드에도 적용 |
| **Code Editor** | Monaco Editor / CodeMirror | Syntax highlighting |
| **Preview** | iframe + srcDoc | 샌드박스 렌더링 |

### 3.2 Generated Code Stack

| Category | Technology | Note |
|----------|------------|------|
| **Output** | Pure React (JSX/TSX) | Next.js 아님, 순수 React |
| **Styling** | Tailwind CSS (CDN) | iframe에서 CDN 로드 |
| **Rendering** | Babel Standalone | 브라우저에서 JSX 변환 |

### 3.3 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Prompt Input │  │ Code Viewer  │  │   Preview    │      │
│  │   (Textarea) │  │   (Monaco)   │  │   (iframe)   │      │
│  └──────┬───────┘  └──────▲───────┘  └──────▲───────┘      │
│         │                 │                 │               │
│         ▼                 │                 │               │
│  ┌──────────────────────────────────────────┐              │
│  │           State Management               │              │
│  │   (prompt, code, isLoading, error)       │              │
│  └──────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Route                                │
│                 /api/generate                                │
├─────────────────────────────────────────────────────────────┤
│  1. Receive prompt                                          │
│  2. Build system prompt (React/Tailwind constraints)        │
│  3. Call Claude API (streaming)                             │
│  4. Extract code from response                              │
│  5. Return generated code                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Claude API                                 │
│               (claude-3-5-sonnet)                           │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 Preview Sandbox Strategy

```tsx
// iframe srcDoc 방식으로 안전한 미리보기
<iframe
  srcDoc={`
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/babel">
        ${generatedCode}
        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
      </script>
    </body>
    </html>
  `}
  sandbox="allow-scripts"
/>
```

---

## 4. UI/UX Design

### 4.1 Main Layout

```
┌─────────────────────────────────────────────────────────────┐
│  AI Page Generator                            [Dark/Light]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Describe the page you want to create...            │   │
│  │                                                     │   │
│  │  예: "모던한 SaaS 랜딩페이지. 히어로 섹션에 그라데이션│   │
│  │  배경, 가격표 3개, 푸터 포함"                         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                          [Generate Page]    │
│                                                             │
├────────────────────────┬────────────────────────────────────┤
│      Code              │           Preview                  │
│  ┌──────────────────┐  │  ┌────────────────────────────┐   │
│  │ // Generated     │  │  │                            │   │
│  │ export default   │  │  │     [Live Preview]         │   │
│  │ function App() { │  │  │                            │   │
│  │   return (       │  │  │                            │   │
│  │     <div>...     │  │  │                            │   │
│  │   );             │  │  │                            │   │
│  │ }                │  │  │                            │   │
│  └──────────────────┘  │  └────────────────────────────┘   │
│  [Copy Code]           │  [Open in New Tab]                 │
└────────────────────────┴────────────────────────────────────┘
```

### 4.2 States

| State | UI |
|-------|-----|
| Initial | 빈 프롬프트, 플레이스홀더 예시 표시 |
| Loading | 스피너 + 스트리밍 코드 표시 |
| Success | 코드 뷰어 + 미리보기 렌더링 |
| Error | 에러 메시지 + 재시도 버튼 |

---

## 5. API Design

### 5.1 Generate Endpoint

```typescript
// POST /api/generate
interface GenerateRequest {
  prompt: string;
  options?: {
    framework?: 'react' | 'vue';  // 기본: react
    styling?: 'tailwind' | 'css'; // 기본: tailwind
    typescript?: boolean;          // 기본: true
  };
}

interface GenerateResponse {
  code: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

// Streaming Response (text/event-stream)
// data: {"type": "code_delta", "content": "export default..."}
// data: {"type": "done", "usage": {...}}
```

### 5.2 System Prompt

```
You are a Pure React component generator. Generate a single React component based on the user's description.

Rules:
1. Output PURE REACT code (NOT Next.js - no 'use client', no next/image, no next/link)
2. Use TypeScript with proper types
3. Use Tailwind CSS for all styling
4. Export a single default function component named "App"
5. Include all code in a single file (no imports - React is global)
6. Make it responsive (mobile-first)
7. Use modern, clean design aesthetics
8. For images, use placeholder URLs (e.g., https://placehold.co/600x400)
9. Do NOT include any explanations, only the code

Output format:
```tsx
export default function App() {
  return (
    // component code here
  );
}
```
```

---

## 6. Security Considerations

| Risk | Mitigation |
|------|------------|
| XSS in Preview | iframe sandbox="allow-scripts" 만 허용 |
| API Key 노출 | 서버사이드에서만 API 호출 |
| Prompt Injection | 시스템 프롬프트 강화 |
| 과도한 API 사용 | Rate limiting 적용 |

---

## 7. Implementation Phases

### Phase 1: MVP (Core)
- [ ] Next.js 프로젝트 셋업
- [ ] 프롬프트 입력 UI
- [ ] Claude API 연동 (/api/generate)
- [ ] 기본 코드 뷰어
- [ ] iframe 미리보기
- [ ] 코드 복사 기능

### Phase 2: Enhancement
- [ ] 스트리밍 응답
- [ ] Monaco Editor 적용
- [ ] 다크/라이트 모드
- [ ] 프롬프트 히스토리 (localStorage)
- [ ] 템플릿 프리셋

### Phase 3: Advanced
- [ ] 수정 요청 (대화형)
- [ ] 멀티 파일 생성
- [ ] 이미지 → 코드

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| 첫 생성까지 시간 | < 10초 |
| 미리보기 렌더링 성공률 | > 95% |
| 사용자 만족도 (코드 품질) | > 4/5 |

---

## 9. Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^16.x | App Framework (Turbopack) |
| react | ^19.x | React 19 |
| @anthropic-ai/sdk | ^0.x | Claude API |
| @monaco-editor/react | ^4.x | Code editor |
| tailwindcss | ^4.x | Styling |

---

## 10. Open Questions

1. **인증**: 로그인 없이 사용 가능? API 비용 관리는?
2. **Rate Limit**: 분당 몇 회 생성 허용?
3. **저장**: 생성된 코드를 서버에 저장할 필요?

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-05 | Initial plan draft | Claude |
