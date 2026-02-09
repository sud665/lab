import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAppStore } from '../shared/store';
import { resetStore } from '@/__tests__/helpers';

// useChromeSync: 테스트에서는 isLoading: false 반환
vi.mock('../shared/hooks/useChromeSync', () => ({
  useChromeSync: () => ({ isLoading: false }),
}));

// openNewTab은 Popup.tsx에서 참조되나 정의 누락 — 전역 mock
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).openNewTab = vi.fn();

import { Popup } from './Popup';

beforeEach(() => {
  resetStore();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 1, 8, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Popup', () => {
  it('진행 중인 작업 없을 때 "진행 중인 작업이 없습니다" 표시', () => {
    render(<Popup />);
    expect(screen.getByText('진행 중인 작업이 없습니다')).toBeInTheDocument();
  });

  it('작업 진행 중일 때 현재 작업 카드 표시 (제목)', () => {
    useAppStore.getState().addTask({ title: '진행 중 작업', minTime: 30 });
    const taskId = useAppStore.getState().tasks[0].id;
    useAppStore.getState().startTask(taskId);

    render(<Popup />);

    expect(screen.getByText('진행 중 작업')).toBeInTheDocument();
    expect(screen.getByText('진행 중')).toBeInTheDocument();
    expect(screen.queryByText('진행 중인 작업이 없습니다')).not.toBeInTheDocument();
  });

  it('통계 카드 4개 렌더링 (집중 시간, 획득 금액, 손실 금액, 완료 작업)', () => {
    render(<Popup />);

    expect(screen.getByText('집중 시간')).toBeInTheDocument();
    expect(screen.getByText('획득 금액')).toBeInTheDocument();
    expect(screen.getByText('손실 금액')).toBeInTheDocument();
    expect(screen.getByText('완료 작업')).toBeInTheDocument();
  });

  it('모드 전환: 엄격 → 자동 클릭 시 설정 변경', () => {
    // 기본 mode가 strict
    expect(useAppStore.getState().settings.mode).toBe('strict');

    render(<Popup />);

    const autoBtn = screen.getByText('자동');
    fireEvent.click(autoBtn);

    expect(useAppStore.getState().settings.mode).toBe('auto');
  });

  it('모드 전환: 자동 → 엄격 클릭 시 설정 변경', () => {
    useAppStore.getState().setSettings({ mode: 'auto' });

    render(<Popup />);

    const strictBtn = screen.getByText('엄격');
    fireEvent.click(strictBtn);

    expect(useAppStore.getState().settings.mode).toBe('strict');
  });

  it('작업 진행 중일 때 중지 버튼 표시', () => {
    useAppStore.getState().addTask({ title: '중지 테스트', minTime: 30 });
    const taskId = useAppStore.getState().tasks[0].id;
    useAppStore.getState().startTask(taskId);

    render(<Popup />);

    expect(screen.getByText('중지')).toBeInTheDocument();
  });
});
