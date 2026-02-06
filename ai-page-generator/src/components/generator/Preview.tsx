'use client';

import { useMemo, useState } from 'react';
import { generatePreviewHTML } from '@/lib/utils';
import { Spinner } from '@/components/ui';

interface PreviewProps {
  code: string;
  isLoading?: boolean;
  error?: string | null;
}

export function Preview({ code, isLoading = false, error }: PreviewProps) {
  const [iframeKey, setIframeKey] = useState(0);

  const previewHTML = useMemo(() => {
    if (!code) return '';
    return generatePreviewHTML(code);
  }, [code]);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenNewTab = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(previewHTML);
      newWindow.document.close();
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 rounded-lg border border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700">
        <span className="text-sm font-medium text-neutral-300">Preview</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={!code || isLoading}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Refresh"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={handleOpenNewTab}
            disabled={!code || isLoading}
            className="px-3 py-1 text-xs font-medium text-neutral-300 bg-neutral-700 rounded hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Open in New Tab
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-white relative">
        {error ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-2">Error</div>
              <div className="text-neutral-600 text-sm">{error}</div>
            </div>
          </div>
        ) : isLoading && !code ? (
          <div className="flex items-center justify-center h-full bg-neutral-100">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-3 text-neutral-500 text-sm">Generating...</p>
            </div>
          </div>
        ) : code ? (
          <iframe
            key={iframeKey}
            srcDoc={previewHTML}
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-0"
            title="Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-neutral-100">
            <div className="text-center text-neutral-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p>Preview will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
