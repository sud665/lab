import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAppStore } from '../shared/store';
import { resetStore } from '@/__tests__/helpers';

// useChromeSync: 테스트에서는 isLoading: false 반환
vi.mock('../shared/hooks/useChromeSync', () => ({
  useChromeSync: () => ({ isLoading: false }),
}));

// exportImport: 테스트에서는 mock (Settings에서 import하지만 사이드바에서만 사용)
vi.mock('../shared/utils/exportImport', () => ({
  exportData: vi.fn(),
  importData: vi.fn(),
}));

import { Settings } from './Settings';

beforeEach(() => {
  resetStore();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 1, 8, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Settings', () => {
  it('시급 input 변경 → settings.hourlyRate 업데이트', () => {
    render(<Settings />);

    // 시급 설정 섹션의 number input
    const hourlyInput = screen.getByDisplayValue('20000');
    fireEvent.change(hourlyInput, { target: { value: '30000' } });

    expect(useAppStore.getState().settings.hourlyRate).toBe(30000);
  });

  it('방해사이트 추가: 이름+URL 입력 후 추가 → 목록에 표시', () => {
    render(<Settings />);

    const nameInput = screen.getByPlaceholderText('사이트 이름');
    const urlInput = screen.getByPlaceholderText('URL (예: twitter.com)');

    fireEvent.change(nameInput, { target: { value: '트위터' } });
    fireEvent.change(urlInput, { target: { value: 'twitter.com' } });
    fireEvent.click(screen.getAllByText('추가')[0]);

    // 기본 방해사이트 3개 + 추가 1개
    expect(useAppStore.getState().settings.distractingSites).toHaveLength(4);
    expect(screen.getByText('트위터')).toBeInTheDocument();
    expect(screen.getByText('twitter.com')).toBeInTheDocument();
  });

  it('방해사이트 삭제 → 목록에서 제거', () => {
    render(<Settings />);

    // 기본 방해사이트 3개: 유튜브 쇼츠, 인스타그램, 페이스북
    expect(screen.getByText('유튜브 쇼츠')).toBeInTheDocument();

    // 유튜브 쇼츠 삭제 버튼 클릭
    const deleteBtn = screen.getByLabelText('유튜브 쇼츠 삭제');
    fireEvent.click(deleteBtn);

    expect(screen.queryByText('유튜브 쇼츠')).not.toBeInTheDocument();
    expect(useAppStore.getState().settings.distractingSites).toHaveLength(2);
  });

  it('모드 카드 클릭 → settings.mode 변경', () => {
    expect(useAppStore.getState().settings.mode).toBe('strict');

    render(<Settings />);

    // "자동 모드" 카드 클릭
    const autoCard = screen.getByText('자동 모드');
    fireEvent.click(autoCard);

    expect(useAppStore.getState().settings.mode).toBe('auto');
  });

  it('뒤로 버튼 클릭 시 onNavigate("dashboard") 호출', () => {
    const onNavigate = vi.fn();
    render(<Settings onNavigate={onNavigate} />);

    const backBtn = screen.getByLabelText('뒤로');
    fireEvent.click(backBtn);

    expect(onNavigate).toHaveBeenCalledWith('dashboard');
  });

  it('빈 이름 또는 URL로 사이트 추가 시 추가되지 않음', () => {
    render(<Settings />);

    const initialCount = useAppStore.getState().settings.distractingSites.length;

    // 이름만 입력하고 추가
    const nameInput = screen.getByPlaceholderText('사이트 이름');
    fireEvent.change(nameInput, { target: { value: '테스트' } });
    fireEvent.click(screen.getAllByText('추가')[0]);

    expect(useAppStore.getState().settings.distractingSites).toHaveLength(initialCount);
  });
});
