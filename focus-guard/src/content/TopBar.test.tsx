import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useAppStore } from '../shared/store';
import { resetStore } from '@/__tests__/helpers';

import { TopBar } from './TopBar';

beforeEach(() => {
  resetStore();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 1, 8, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('TopBar', () => {
  it('작업 미활성 시 "작업을 시작하세요" 표시', () => {
    render(<TopBar />);
    expect(screen.getByText('작업을 시작하세요')).toBeInTheDocument();
  });

  it('작업 활성 시 작업 제목 표시', () => {
    useAppStore.getState().addTask({ title: '집중 작업', minTime: 30 });
    const taskId = useAppStore.getState().tasks[0].id;
    useAppStore.getState().startTask(taskId);

    render(<TopBar />);

    expect(screen.getByText('집중 작업')).toBeInTheDocument();
    expect(screen.queryByText('작업을 시작하세요')).not.toBeInTheDocument();
  });

  it('방해사이트 경고 이벤트 시 경고 바 표시', async () => {
    useAppStore.getState().addTask({ title: '작업 중', minTime: 30 });
    const taskId = useAppStore.getState().tasks[0].id;
    useAppStore.getState().startTask(taskId);

    render(<TopBar />);

    // CustomEvent 발생으로 방해사이트 경고 트리거
    act(() => {
      window.dispatchEvent(
        new CustomEvent('focus-guard-distraction', {
          detail: { siteName: '유튜브 쇼츠' },
        })
      );
    });

    expect(screen.getByText(/유튜브 쇼츠에서 시간 낭비 중/)).toBeInTheDocument();
  });

  it('작업 활성 시 active bar 클래스 적용', () => {
    useAppStore.getState().addTask({ title: '활성 작업', minTime: 30 });
    const taskId = useAppStore.getState().tasks[0].id;
    useAppStore.getState().startTask(taskId);

    const { container } = render(<TopBar />);

    const bar = container.querySelector('.fg-bar--active');
    expect(bar).toBeInTheDocument();
  });

  it('작업 비활성 시 idle bar 클래스 적용', () => {
    const { container } = render(<TopBar />);

    const bar = container.querySelector('.fg-bar--idle');
    expect(bar).toBeInTheDocument();
  });
});
