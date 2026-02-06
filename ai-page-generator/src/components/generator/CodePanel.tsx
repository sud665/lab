'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

interface CodePanelProps {
  code: string;
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export function CodePanel({ code, isLoading, isOpen, onToggle }: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'App.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Line numbers
  const lines = code.split('\n');
  const lineCount = lines.length;

  return (
    <>
      {/* Toggle button (when closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-lg shadow-md hover:shadow-lg hover:border-[var(--border-hover)] transition-all duration-200 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Code
        </button>
      )}

      {/* Panel */}
      <div
        className={`
          h-full bg-[var(--bg-primary)] border-l border-[var(--border-default)] flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-[420px]' : 'w-0'}
        `}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-default)]">
              <div className="flex items-center gap-2">
                <button
                  onClick={onToggle}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all duration-200"
                  title="Close panel"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-[var(--text-primary)]">Generated Code</span>
                {code && (
                  <span className="px-2 py-0.5 bg-[var(--bg-secondary)] rounded text-xs text-[var(--text-muted)]">
                    {lineCount} lines
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  disabled={!code || isLoading}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!code || isLoading}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>

            {/* Code area */}
            <div className="flex-1 overflow-auto">
              {isLoading && !code ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center text-[var(--text-muted)]">
                    <svg className="w-8 h-8 animate-spin mb-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-sm">Generating code...</p>
                  </div>
                </div>
              ) : code ? (
                <div className="flex text-sm font-mono">
                  {/* Line numbers */}
                  <div className="flex-shrink-0 py-4 px-3 text-right text-[var(--text-muted)] select-none bg-[var(--bg-secondary)] border-r border-[var(--border-default)]">
                    {lines.map((_, i) => (
                      <div key={i} className="leading-6">
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {/* Code content */}
                  <pre className="flex-1 py-4 px-4 overflow-x-auto">
                    <code className="text-[var(--text-primary)] leading-6 whitespace-pre">
                      {code}
                    </code>
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-3 text-[var(--border-hover)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <p className="text-sm">Code will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
