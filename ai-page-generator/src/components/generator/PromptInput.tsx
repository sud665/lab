'use client';

import { KeyboardEvent } from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  maxLength?: number;
}

const PLACEHOLDER = `Describe the page you want to create...

예시:
• "모던한 SaaS 랜딩페이지. 히어로 섹션에 그라데이션 배경, 기능 소개 3개, 가격표, CTA 버튼 포함"
• "다크 테마 대시보드. 사이드바 네비게이션, 카드형 통계, 차트 영역"
• "심플한 포트폴리오. 프로필 사진, 소개, 프로젝트 갤러리, 연락처 폼"`;

export function PromptInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  maxLength = 2000,
}: PromptInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={PLACEHOLDER}
        disabled={disabled}
        maxLength={maxLength}
        rows={6}
        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-neutral-500">
        <span>{value.length}/{maxLength}</span>
        <span className="hidden sm:inline">⌘+Enter to generate</span>
      </div>
    </div>
  );
}
