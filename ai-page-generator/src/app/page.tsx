'use client';

import { useState, useCallback, useEffect } from 'react';
import { Sidebar, PromptBar, Canvas, CodePanel } from '@/components/generator';
import { extractCodeFromMarkdown } from '@/lib/utils';
import type { GeneratorState, StreamEvent } from '@/types';

const initialState: GeneratorState = {
  prompt: '',
  code: '',
  isLoading: false,
  error: null,
};

export default function Home() {
  const [state, setState] = useState<GeneratorState>(initialState);
  const [isCodePanelOpen, setIsCodePanelOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const generate = useCallback(async () => {
    if (!state.prompt.trim() || state.isLoading) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null, code: '' }));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: state.prompt }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedCode = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.startsWith('data:'));

        for (const line of lines) {
          try {
            const jsonStr = line.slice(5).trim();
            if (!jsonStr) continue;

            const data: StreamEvent = JSON.parse(jsonStr);

            if (data.type === 'code_delta' && data.content) {
              accumulatedCode += data.content;
              setState((prev) => ({ ...prev, code: accumulatedCode }));
            } else if (data.type === 'done' && data.code) {
              setState((prev) => ({
                ...prev,
                code: data.code!,
                isLoading: false,
              }));
            } else if (data.type === 'error') {
              throw new Error(data.message || 'Unknown error');
            }
          } catch {
            // Skip invalid JSON lines
          }
        }
      }

      // Final cleanup
      setState((prev) => ({
        ...prev,
        code: extractCodeFromMarkdown(prev.code),
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      }));
    }
  }, [state.prompt, state.isLoading]);

  const setPrompt = useCallback((prompt: string) => {
    setState((prev) => ({ ...prev, prompt }));
  }, []);

  const handleSelectTemplate = useCallback((templatePrompt: string) => {
    setState((prev) => ({ ...prev, prompt: templatePrompt }));
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 bg-[var(--bg-primary)] border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <h1 className="text-base font-semibold text-[var(--text-primary)]">
            AI Page Generator
          </h1>
          <span className="px-2 py-0.5 bg-[var(--accent-light)] text-[var(--accent-primary)] text-xs font-medium rounded-full">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all duration-200"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {/* Code panel toggle */}
          <button
            onClick={() => setIsCodePanelOpen(!isCodePanelOpen)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200
              ${isCodePanelOpen
                ? 'bg-[var(--accent-light)] text-[var(--accent-primary)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Code
          </button>

          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar onSelectTemplate={handleSelectTemplate} activeTemplate={null} />

        {/* Canvas + Code Panel */}
        <div className="flex-1 flex relative overflow-hidden">
          <Canvas code={state.code} isLoading={state.isLoading} />
          <CodePanel
            code={state.code}
            isLoading={state.isLoading}
            isOpen={isCodePanelOpen}
            onToggle={() => setIsCodePanelOpen(!isCodePanelOpen)}
          />
        </div>
      </div>

      {/* Prompt bar */}
      <PromptBar
        value={state.prompt}
        onChange={setPrompt}
        onSubmit={generate}
        isLoading={state.isLoading}
      />

      {/* Error toast */}
      {state.error && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-3 bg-red-500 text-white rounded-lg shadow-lg flex items-center gap-3 animate-slide-up">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{state.error}</span>
          <button
            onClick={() => setState((prev) => ({ ...prev, error: null }))}
            className="p-1 hover:bg-red-600 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
