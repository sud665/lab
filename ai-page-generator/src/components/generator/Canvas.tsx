'use client';

import { useMemo, useState } from 'react';
import { generatePreviewHTML } from '@/lib/utils';

interface CanvasProps {
  code: string;
  isLoading: boolean;
}

type DeviceSize = 'mobile' | 'tablet' | 'desktop' | 'full';

const deviceSizes: Record<DeviceSize, { width: string; label: string; icon: React.ReactNode }> = {
  mobile: {
    width: '375px',
    label: 'Mobile',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  tablet: {
    width: '768px',
    label: 'Tablet',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  desktop: {
    width: '1280px',
    label: 'Desktop',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  full: {
    width: '100%',
    label: 'Full',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
  },
};

export function Canvas({ code, isLoading }: CanvasProps) {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('full');
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
    <div className="flex-1 flex flex-col bg-[var(--bg-canvas)] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-primary)] border-b border-[var(--border-default)]">
        {/* Device size toggles */}
        <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-1">
          {(Object.keys(deviceSizes) as DeviceSize[]).map((size) => (
            <button
              key={size}
              onClick={() => setDeviceSize(size)}
              className={`
                px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-medium
                transition-all duration-200
                ${deviceSize === size
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }
              `}
              title={deviceSizes[size].label}
            >
              {deviceSizes[size].icon}
              <span className="hidden sm:inline">{deviceSizes[size].label}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={!code || isLoading}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Refresh"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={handleOpenNewTab}
            disabled={!code || isLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 p-6 overflow-auto flex items-start justify-center">
        {isLoading && !code ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 animate-pulse-subtle">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <p className="text-sm font-medium">Generating your page...</p>
            <p className="text-xs mt-1">This may take a few seconds</p>
          </div>
        ) : code ? (
          <div
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 h-full"
            style={{
              width: deviceSizes[deviceSize].width,
              maxWidth: '100%',
            }}
          >
            <iframe
              key={iframeKey}
              srcDoc={previewHTML}
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full border-0"
              title="Preview"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
            <div className="w-20 h-20 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[var(--border-hover)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">No preview yet</p>
            <p className="text-xs mt-1">Describe your page below to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
