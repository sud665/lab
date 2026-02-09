import React from 'react';
import { SORA } from '../utils/style';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Focus Guard] Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-surface-deep text-text-primary"
          style={{ fontFamily: "'Noto Sans KR', 'Sora', sans-serif" }}
        >
          <div className="card rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                background: 'rgba(232,185,49,0.08)',
                border: '1px solid rgba(232,185,49,0.15)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8b931" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-[18px] font-bold text-gold-400 mb-2" style={SORA}>
              오류가 발생했습니다
            </h2>
            <p className="text-[13px] text-text-muted mb-6 leading-relaxed">
              예상치 못한 문제가 발생했습니다.<br />
              아래 버튼을 눌러 다시 시도해주세요.
            </p>
            {this.state.error && (
              <div
                className="rounded-xl px-4 py-3 mb-6 text-left"
                style={{
                  background: 'var(--color-surface-base)',
                  border: '1px solid var(--color-surface-border)',
                }}
              >
                <p
                  className="text-[11px] text-text-muted break-all"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {this.state.error.message}
                </p>
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="btn btn-gold px-6 py-2.5 text-[13px] mx-auto"
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
