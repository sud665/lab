# ai-page-generator Design Document

> **Feature**: AI Page Generator - 프롬프트 기반 React 페이지 자동 생성기
> **Version**: 1.0
> **Created**: 2026-02-05
> **Status**: Draft

---

## 1. Overview

Plan 문서 기반으로 MVP(Phase 1) 구현을 위한 상세 설계입니다.

### 1.1 Scope (MVP)

| Feature | Description | Priority |
|---------|-------------|:--------:|
| 프롬프트 입력 UI | 텍스트 영역 + 생성 버튼 | P0 |
| Claude API 연동 | Anthropic SDK 스트리밍 | P0 |
| 실시간 미리보기 | iframe sandbox 렌더링 | P0 |
| 코드 뷰어 | Syntax highlighting | P0 |
| 코드 복사 | 클립보드 복사 | P1 |

---

## 2. Project Structure

```
ai-page-generator/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Main generator page
│   │   ├── globals.css             # Global styles (Tailwind)
│   │   └── api/
│   │       └── generate/
│   │           └── route.ts        # Claude API endpoint
│   ├── components/
│   │   ├── generator/
│   │   │   ├── PromptInput.tsx     # 프롬프트 입력 컴포넌트
│   │   │   ├── CodeViewer.tsx      # 코드 표시 컴포넌트
│   │   │   ├── Preview.tsx         # iframe 미리보기
│   │   │   ├── GenerateButton.tsx  # 생성 버튼
│   │   │   └── index.ts            # barrel export
│   │   └── ui/
│   │       ├── Button.tsx          # 공통 버튼
│   │       ├── Textarea.tsx        # 공통 텍스트영역
│   │       ├── Spinner.tsx         # 로딩 스피너
│   │       └── index.ts
│   ├── lib/
│   │   ├── claude.ts               # Claude API 클라이언트
│   │   ├── prompts.ts              # System prompts
│   │   └── utils.ts                # 유틸리티 함수
│   └── types/
│       └── index.ts                # TypeScript 타입 정의
├── docs/                           # PDCA 문서
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.local                      # API 키 (gitignore)
```

---

## 3. Component Specifications

### 3.1 PromptInput

프롬프트 입력을 위한 텍스트 영역 컴포넌트.

```typescript
// src/components/generator/PromptInput.tsx

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

// Features:
// - 자동 높이 조절 (min 4줄, max 10줄)
// - 글자수 카운터
// - Ctrl+Enter로 제출 가능
// - 예시 플레이스홀더 표시
```

**UI 스펙:**
- Height: min 120px, max 300px
- Border: 1px solid var(--border-default)
- Focus: ring-2 ring-blue-500
- Placeholder: 예시 프롬프트 표시

### 3.2 CodeViewer

생성된 코드를 표시하는 컴포넌트.

```typescript
// src/components/generator/CodeViewer.tsx

interface CodeViewerProps {
  code: string;
  language?: 'typescript' | 'javascript';
  isLoading?: boolean;
  onCopy?: () => void;
}

// Features:
// - Syntax highlighting (Prism.js 또는 highlight.js)
// - 줄 번호 표시
// - 복사 버튼 (우상단)
// - 로딩 중 스켈레톤 표시
// - 스크롤 가능
```

**UI 스펙:**
- Background: var(--bg-secondary)
- Font: monospace, 14px
- Line numbers: 좌측 gutter
- Max height: 500px (스크롤)

### 3.3 Preview

생성된 React 코드를 실시간으로 렌더링하는 iframe 컴포넌트.

```typescript
// src/components/generator/Preview.tsx

interface PreviewProps {
  code: string;
  isLoading?: boolean;
  error?: string;
  onOpenNewTab?: () => void;
}

// Features:
// - iframe srcDoc 방식
// - Tailwind CSS CDN 로드
// - React + Babel 로드
// - 에러 시 에러 메시지 표시
// - 새 탭에서 열기 버튼
```

**iframe 템플릿:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${generatedCode}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
```

**보안:**
- sandbox="allow-scripts" (다른 권한 차단)
- 외부 도메인 접근 불가

### 3.4 GenerateButton

생성 요청을 트리거하는 버튼.

```typescript
// src/components/generator/GenerateButton.tsx

interface GenerateButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

// Features:
// - 로딩 중 스피너 표시
// - disabled 상태 스타일
// - 키보드 접근성
```

---

## 4. API Specifications

### 4.1 POST /api/generate

Claude API를 호출하여 React 코드를 생성하는 엔드포인트.

```typescript
// src/app/api/generate/route.ts

// Request
interface GenerateRequest {
  prompt: string;
}

// Response (Streaming: text/event-stream)
// SSE 형식으로 스트리밍 응답

// Event Types:
// 1. code_delta: 코드 청크
//    data: {"type": "code_delta", "content": "export default..."}
//
// 2. done: 완료
//    data: {"type": "done", "code": "full code", "usage": {...}}
//
// 3. error: 에러
//    data: {"type": "error", "message": "Error message"}
```

**구현 로직:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        });

        let fullCode = '';

        for await (const event of response) {
          if (event.type === 'content_block_delta') {
            const text = event.delta.text;
            fullCode += text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'code_delta', content: text })}\n\n`)
            );
          }
        }

        // Extract code from markdown if needed
        const extractedCode = extractCodeFromMarkdown(fullCode);

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'done', code: extractedCode })}\n\n`)
        );
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### 4.2 System Prompt

```typescript
// src/lib/prompts.ts

export const SYSTEM_PROMPT = `You are a Pure React component generator. Generate a single React component based on the user's description.

## Rules (MUST follow strictly):

1. **PURE REACT ONLY**
   - NO Next.js specific code (no 'use client', no next/image, no next/link, no next/font)
   - NO import statements (React is available globally)
   - NO require statements

2. **Code Structure**
   - Export a single default function component named "App"
   - All code in a single file
   - Use TypeScript syntax with proper types

3. **Styling**
   - Use Tailwind CSS classes for ALL styling
   - Mobile-first responsive design
   - Modern, clean aesthetics

4. **Assets**
   - For images: use https://placehold.co/WIDTHxHEIGHT
   - For icons: use inline SVG or emoji
   - NO external image imports

5. **State & Hooks**
   - Use React.useState, React.useEffect (not destructured imports)
   - Example: const [count, setCount] = React.useState(0)

6. **Output Format**
   - Return ONLY the code, no explanations
   - No markdown code blocks
   - Start directly with: export default function App()

## Example Output:

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800">Counter: {count}</h1>
        <button
          onClick={() => setCount(count + 1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Increment
        </button>
      </div>
    </div>
  );
}`;
```

---

## 5. Type Definitions

```typescript
// src/types/index.ts

// API Types
export interface GenerateRequest {
  prompt: string;
}

export interface StreamEvent {
  type: 'code_delta' | 'done' | 'error';
  content?: string;
  code?: string;
  message?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

// Component State
export interface GeneratorState {
  prompt: string;
  code: string;
  isLoading: boolean;
  error: string | null;
}

// UI Types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
```

---

## 6. UI Layout Design

### 6.1 Main Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Header                                                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  🚀 AI Page Generator                               [GitHub]  │  │
│  └───────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│  Prompt Section                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │  Describe the page you want to create...                      │  │
│  │                                                               │  │
│  │  예: "모던한 SaaS 랜딩페이지. 히어로 섹션에 그라데이션 배경,   │  │
│  │  기능 소개 3개, 가격표, CTA 버튼, 푸터 포함"                   │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                    [Generate Page]   │
├─────────────────────────────────────────────────────────────────────┤
│  Result Section (50/50 split)                                        │
│  ┌─────────────────────────┬───────────────────────────────────────┐│
│  │  Code                   │  Preview                              ││
│  │  ┌───────────────────┐  │  ┌─────────────────────────────────┐ ││
│  │  │ 1│ export default │  │  │                                 │ ││
│  │  │ 2│ function App() │  │  │     [ Live Preview ]            │ ││
│  │  │ 3│ {              │  │  │                                 │ ││
│  │  │ 4│   return (     │  │  │                                 │ ││
│  │  │ 5│     <div>      │  │  │                                 │ ││
│  │  │  │       ...      │  │  │                                 │ ││
│  │  └───────────────────┘  │  └─────────────────────────────────┘ ││
│  │  [Copy Code]            │  [Open in New Tab]                    ││
│  └─────────────────────────┴───────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 768px) | 세로 스택 (Code 위, Preview 아래) |
| Tablet (768px - 1024px) | 50/50 가로 분할 |
| Desktop (> 1024px) | 50/50 가로 분할, 더 넓은 여백 |

### 6.3 Color Scheme (Dark Theme Default)

```css
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #171717;
  --bg-tertiary: #262626;
  --border-default: #404040;
  --text-primary: #fafafa;
  --text-secondary: #a3a3a3;
  --accent-primary: #3b82f6;
  --accent-hover: #2563eb;
}
```

---

## 7. Utility Functions

### 7.1 Code Extraction

```typescript
// src/lib/utils.ts

/**
 * Markdown 코드 블록에서 실제 코드만 추출
 */
export function extractCodeFromMarkdown(text: string): string {
  // ```tsx 또는 ```jsx 블록에서 코드 추출
  const codeBlockRegex = /```(?:tsx?|jsx?|javascript|typescript)?\n?([\s\S]*?)```/;
  const match = text.match(codeBlockRegex);

  if (match) {
    return match[1].trim();
  }

  // 코드 블록이 없으면 전체 텍스트 반환
  return text.trim();
}

/**
 * 코드가 유효한 React 컴포넌트인지 기본 검증
 */
export function isValidReactCode(code: string): boolean {
  return (
    code.includes('export default function') &&
    code.includes('return') &&
    (code.includes('<') || code.includes('React.createElement'))
  );
}
```

### 7.2 Preview HTML Template

```typescript
// src/lib/utils.ts

export function generatePreviewHTML(code: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${code}

    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
    } catch (error) {
      document.getElementById('root').innerHTML =
        '<div style="color: red; padding: 20px;"><h2>Render Error</h2><pre>' +
        error.message + '</pre></div>';
    }
  </script>
</body>
</html>`;
}
```

---

## 8. State Management

메인 페이지에서 React useState로 간단히 관리.

```typescript
// src/app/page.tsx (상태 관리 부분)

interface PageState {
  prompt: string;
  code: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: PageState = {
  prompt: '',
  code: '',
  isLoading: false,
  error: null,
};

// Custom hook for generator logic
function useGenerator() {
  const [state, setState] = useState<PageState>(initialState);

  const generate = async () => {
    if (!state.prompt.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, code: '' }));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: state.prompt }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.startsWith('data:'));

        for (const line of lines) {
          const data = JSON.parse(line.slice(5));

          if (data.type === 'code_delta') {
            setState(prev => ({ ...prev, code: prev.code + data.content }));
          } else if (data.type === 'done') {
            setState(prev => ({ ...prev, code: data.code, isLoading: false }));
          } else if (data.type === 'error') {
            setState(prev => ({ ...prev, error: data.message, isLoading: false }));
          }
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      }));
    }
  };

  const setPrompt = (prompt: string) => {
    setState(prev => ({ ...prev, prompt }));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(state.code);
  };

  return { ...state, generate, setPrompt, copyCode };
}
```

---

## 9. Implementation Checklist

### Phase 1: MVP

| # | Task | File | Status |
|---|------|------|:------:|
| 1 | Next.js 16 프로젝트 생성 | - | ⬜ |
| 2 | Tailwind CSS v4 설정 | tailwind.config.ts, globals.css | ⬜ |
| 3 | 타입 정의 | src/types/index.ts | ⬜ |
| 4 | 유틸리티 함수 | src/lib/utils.ts | ⬜ |
| 5 | System Prompt | src/lib/prompts.ts | ⬜ |
| 6 | Claude API 클라이언트 | src/lib/claude.ts | ⬜ |
| 7 | API Route (/api/generate) | src/app/api/generate/route.ts | ⬜ |
| 8 | UI 컴포넌트 - Button | src/components/ui/Button.tsx | ⬜ |
| 9 | UI 컴포넌트 - Textarea | src/components/ui/Textarea.tsx | ⬜ |
| 10 | UI 컴포넌트 - Spinner | src/components/ui/Spinner.tsx | ⬜ |
| 11 | PromptInput 컴포넌트 | src/components/generator/PromptInput.tsx | ⬜ |
| 12 | CodeViewer 컴포넌트 | src/components/generator/CodeViewer.tsx | ⬜ |
| 13 | Preview 컴포넌트 | src/components/generator/Preview.tsx | ⬜ |
| 14 | GenerateButton 컴포넌트 | src/components/generator/GenerateButton.tsx | ⬜ |
| 15 | 메인 페이지 | src/app/page.tsx | ⬜ |
| 16 | 레이아웃 | src/app/layout.tsx | ⬜ |
| 17 | 환경 변수 설정 | .env.local | ⬜ |

---

## 10. Dependencies

```json
{
  "dependencies": {
    "next": "^16.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@anthropic-ai/sdk": "^0.32.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

---

## 11. Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-api...
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-05 | Initial design document | Claude |
