/**
 * Markdown 코드 블록에서 실제 코드만 추출
 */
export function extractCodeFromMarkdown(text: string): string {
  // ```tsx 또는 ```jsx 블록에서 코드 추출
  const codeBlockRegex = /```(?:tsx?|jsx?|javascript|typescript)?\n?([\s\S]*?)```/;
  const match = text.match(codeBlockRegex);

  return match ? match[1].trim() : text.trim();
}

/**
 * Preview용 코드 정리 - import/export 문제 해결
 */
export function cleanCodeForPreview(code: string): string {
  // import 문 제거
  code = code.replace(/^import\s+.*?['"];?\s*$/gm, '');
  code = code.replace(/^import\s*{[\s\S]*?}\s*from\s*['"].*?['"];?\s*$/gm, '');
  code = code.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');

  // 'use client' 제거
  code = code.replace(/^['"]use client['"];?\s*$/gm, '');

  // export default function App -> function App
  code = code.replace(/export\s+default\s+function\s+App/g, 'function App');

  // export default App (끝에 있는 경우) 제거
  code = code.replace(/export\s+default\s+App\s*;?\s*$/gm, '');

  // 기타 export 제거
  code = code.replace(/^export\s+/gm, '');

  // 빈 줄 정리
  code = code.replace(/\n{3,}/g, '\n\n').trim();

  return code;
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

/**
 * Preview용 HTML 템플릿 생성
 */
export function generatePreviewHTML(code: string): string {
  // 코드 정리
  const cleanedCode = cleanCodeForPreview(code);

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
    #error-display { color: #ef4444; padding: 20px; font-family: monospace; background: #fef2f2; }
    #error-display h2 { margin: 0 0 10px 0; }
    #error-display pre { white-space: pre-wrap; word-break: break-word; }
  </style>
</head>
<body>
  <div id="root">
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: #666;">
      Loading preview...
    </div>
  </div>
  <script>
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      document.getElementById('root').innerHTML =
        '<div id="error-display"><h2>Runtime Error</h2><pre>' + msg + '</pre></div>';
      return true;
    };
  </script>
  <script type="text/babel" data-presets="react,typescript">
    ${cleanedCode}

    try {
      if (typeof App === 'undefined') {
        throw new Error('App component not found. Make sure your code exports a default function named App.');
      }
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
    } catch (error) {
      document.getElementById('root').innerHTML =
        '<div id="error-display"><h2>Render Error</h2><pre>' + error.message + '</pre></div>';
    }
  </script>
</body>
</html>`;
}

/**
 * 클립보드에 텍스트 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
