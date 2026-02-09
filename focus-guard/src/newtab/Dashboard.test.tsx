import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAppStore } from '../shared/store';
import { resetStore } from '@/__tests__/helpers';

// StatsChart는 Recharts의 ResponsiveContainer를 사용하므로 jsdom에서 렌더링 불가 → mock
vi.mock('../shared/components/StatsChart', () => ({
  StatsChart: () => <div data-testid="stats-chart">StatsChart Mock</div>,
}));

// useAnimatedNumber: 애니메이션 없이 값 즉시 반환
vi.mock('../shared/hooks/useAnimatedNumber', () => ({
  useAnimatedNumber: (value: number) => value,
}));

// useChromeSync: 테스트에서는 isLoading: false 반환
vi.mock('../shared/hooks/useChromeSync', () => ({
  useChromeSync: () => ({ isLoading: false }),
}));

// Dashboard를 lazy import하면 mock이 적용됨
import { Dashboard } from './Dashboard';

beforeEach(() => {
  resetStore();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 1, 8, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Dashboard', () => {
  it('빈 상태일 때 "아직 작업이 없습니다" 표시', () => {
    render(<Dashboard />);
    expect(screen.getByText('아직 작업이 없습니다')).toBeInTheDocument();
  });

  it('새 작업 입력 후 추가 버튼 클릭 → 작업 목록에 표시', () => {
    render(<Dashboard />);

    const input = screen.getByPlaceholderText('새 작업 입력...');
    fireEvent.change(input, { target: { value: '테스트 작업' } });
    fireEvent.click(screen.getByText('추가'));

    expect(screen.getByText('테스트 작업')).toBeInTheDocument();
    expect(screen.queryByText('아직 작업이 없습니다')).not.toBeInTheDocument();
  });

  it('작업 삭제 버튼 클릭 → 목록에서 제거', () => {
    // 사전에 store에 작업 추가
    useAppStore.getState().addTask({ title: '삭제할 작업', minTime: 30 });

    render(<Dashboard />);
    expect(screen.getByText('삭제할 작업')).toBeInTheDocument();

    const deleteBtn = screen.getByLabelText('삭제');
    fireEvent.click(deleteBtn);

    expect(screen.queryByText('삭제할 작업')).not.toBeInTheDocument();
  });

  it('작업 시작 버튼 클릭 → currentSession 활성화', () => {
    useAppStore.getState().addTask({ title: '시작할 작업', minTime: 30 });

    render(<Dashboard />);
    const startBtn = screen.getByLabelText('시작');
    fireEvent.click(startBtn);

    const session = useAppStore.getState().currentSession;
    expect(session.isActive).toBe(true);
    expect(session.taskId).toBe(useAppStore.getState().tasks[0].id);
  });

  it('작업 완료 체크 → isCompleted 상태 변경', () => {
    useAppStore.getState().addTask({ title: '완료할 작업', minTime: 30 });

    render(<Dashboard />);
    const completeBtn = screen.getByLabelText('완료하기');
    fireEvent.click(completeBtn);

    expect(useAppStore.getState().tasks[0].isCompleted).toBe(true);
  });

  it('설정 버튼 클릭 시 onNavigate("settings") 호출', () => {
    const onNavigate = vi.fn();
    render(<Dashboard onNavigate={onNavigate} />);

    const settingsBtn = screen.getByLabelText('설정');
    fireEvent.click(settingsBtn);

    expect(onNavigate).toHaveBeenCalledWith('settings');
  });

  it('Enter 키로 작업 추가 가능', () => {
    render(<Dashboard />);

    const input = screen.getByPlaceholderText('새 작업 입력...');
    fireEvent.change(input, { target: { value: '엔터 작업' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('엔터 작업')).toBeInTheDocument();
  });

  it('빈 제목으로 추가 시 작업이 추가되지 않음', () => {
    render(<Dashboard />);

    fireEvent.click(screen.getByText('추가'));

    expect(screen.getByText('아직 작업이 없습니다')).toBeInTheDocument();
  });
});
