'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { Spinner } from '@/components/ui';

interface CodeViewerProps {
  code: string;
  isLoading?: boolean;
}

export function CodeViewer({ code, isLoading = false }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 rounded-lg border border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700">
        <span className="text-sm font-medium text-neutral-300">Generated Code</span>
        <button
          onClick={handleCopy}
          disabled={!code || isLoading}
          className="px-3 py-1 text-xs font-medium text-neutral-300 bg-neutral-700 rounded hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading && !code ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" />
          </div>
        ) : code ? (
          <pre className="text-sm text-neutral-300 font-mono whitespace-pre-wrap break-words">
            <code>{code}</code>
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500">
            Generated code will appear here
          </div>
        )}
      </div>
    </div>
  );
}
