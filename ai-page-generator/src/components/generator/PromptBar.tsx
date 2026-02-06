'use client';

import { KeyboardEvent, useRef, useEffect } from 'react';

interface PromptBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function PromptBar({ value, onChange, onSubmit, isLoading }: PromptBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="border-t border-[var(--border-default)] bg-[var(--bg-primary)] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-default)] p-3 shadow-sm focus-within:border-[var(--accent-primary)] focus-within:shadow-md transition-all duration-200">
          {/* Sparkle icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the page you want to create..."
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none outline-none text-sm leading-relaxed disabled:opacity-50"
            style={{ maxHeight: '120px' }}
          />

          {/* Send button */}
          <button
            onClick={onSubmit}
            disabled={!value.trim() || isLoading}
            className={`
              flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
              transition-all duration-200
              ${value.trim() && !isLoading
                ? 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] shadow-sm'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

        {/* Hints */}
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-[var(--text-muted)]">
            Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[10px] font-mono">Shift+Enter</kbd> for new line
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {value.length}/2000
          </p>
        </div>
      </div>
    </div>
  );
}
