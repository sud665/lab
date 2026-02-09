import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAppStore } from './index';
import { resetStore } from '@/__tests__/helpers';
import { getMockStorage } from '@/__tests__/setup';

beforeEach(() => {
  resetStore();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 1, 8, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

// ──────────────────────────────────────────────
// Task CRUD
// ──────────────────────────────────────────────

describe('addTask', () => {
  it('새 태스크를 추가하고 id, totalTime, isCompleted를 자동 설정', () => {
    useAppStore.getState().addTask({ title: '코딩', minTime: 1800 });
    const tasks = useAppStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('코딩');
    expect(tasks[0].minTime).toBe(1800);
    expect(tasks[0].totalTime).toBe(0);
    expect(tasks[0].isCompleted).toBe(false);
    expect(tasks[0].id).toBeDefined();
  });

  it('여러 태스크를 순차 추가', () => {
    useAppStore.getState().addTask({ title: 'A', minTime: 60 });
    useAppStore.getState().addTask({ title: 'B', minTime: 120 });
    expect(useAppStore.getState().tasks).toHaveLength(2);
  });

  it('추가된 태스크는 고유한 id를 가짐', () => {
    useAppStore.getState().addTask({ title: 'A', minTime: 60 });
    useAppStore.getState().addTask({ title: 'B', minTime: 120 });
    const [a, b] = useAppStore.getState().tasks;
    expect(a.id).not.toBe(b.id);
  });
});

describe('updateTask', () => {
  it('기존 태스크 필드 부분 업데이트', () => {
    useAppStore.getState().addTask({ title: '원래', minTime: 60 });
    const id = useAppStore.getState().tasks[0].id;
    useAppStore.getState().updateTask(id, { title: '변경됨' });
    expect(useAppStore.getState().tasks[0].title).toBe('변경됨');
    expect(useAppStore.getState().tasks[0].minTime).toBe(60);
  });

  it('존재하지 않는 id 업데이트 시 다른 태스크에 영향 없음', () => {
    useAppStore.getState().addTask({ title: '유지', minTime: 60 });
    useAppStore.getState().updateTask('nonexistent', { title: '변경' });
    expect(useAppStore.getState().tasks[0].title).toBe('유지');
  });
});

describe('deleteTask', () => {
  it('태스크 삭제', () => {
    useAppStore.getState().addTask({ title: '삭제대상', minTime: 60 });
    const id = useAppStore.getState().tasks[0].id;
    useAppStore.getState().deleteTask(id);
    expect(useAppStore.getState().tasks).toHaveLength(0);
  });

  it('다른 태스크는 유지', () => {
    useAppStore.getState().addTask({ title: 'A', minTime: 60 });
    useAppStore.getState().addTask({ title: 'B', minTime: 60 });
    const idA = useAppStore.getState().tasks[0].id;
    useAppStore.getState().deleteTask(idA);
    expect(useAppStore.getState().tasks).toHaveLength(1);
    expect(useAppStore.getState().tasks[0].title).toBe('B');
  });
});

// ──────────────────────────────────────────────
// Session: startTask / stopTask
// ──────────────────────────────────────────────

describe('startTask', () => {
  it('세션을 활성화하고 taskId, startTime 설정', () => {
    useAppStore.getState().addTask({ title: '작업', minTime: 60 });
    const id = useAppStore.getState().tasks[0].id;
    useAppStore.getState().startTask(id);
    const session = useAppStore.getState().currentSession;
    expect(session.isActive).toBe(true);
    expect(session.taskId).toBe(id);
    expect(session.startTime).toBe(Date.now());
  });
});

describe('stopTask', () => {
  it('경과 시간을 태스크에 누적', () => {
    useAppStore.getState().addTask({ title: '작업', minTime: 60 });
    const id = useAppStore.getState().tasks[0].id;
    useAppStore.getState().startTask(id);

    // 5분(300초) 경과
    vi.advanceTimersByTime(300_000);
    useAppStore.getState().stopTask();

    expect(useAppStore.getState().tasks[0].totalTime).toBe(300);
    const session = useAppStore.getState().currentSession;
    expect(session.isActive).toBe(false);
    expect(session.startTime).toBeNull();
    expect(session.accumulatedTime).toBe(300);
  });

  it('비활성 세션에서 stopTask 호출 시 아무 변화 없음', () => {
    useAppStore.getState().addTask({ title: '작업', minTime: 60 });
    const before = useAppStore.getState().currentSession;
    useAppStore.getState().stopTask();
    expect(useAppStore.getState().currentSession).toEqual(before);
  });

  it('여러 세션의 시간이 누적됨', () => {
    useAppStore.getState().addTask({ title: '작업', minTime: 60 });
    const id = useAppStore.getState().tasks[0].id;

    // 첫 세션: 2분
    useAppStore.getState().startTask(id);
    vi.advanceTimersByTime(120_000);
    useAppStore.getState().stopTask();

    // 두 번째 세션: 3분
    useAppStore.getState().startTask(id);
    vi.advanceTimersByTime(180_000);
    useAppStore.getState().stopTask();

    expect(useAppStore.getState().tasks[0].totalTime).toBe(300);
  });
});

// ──────────────────────────────────────────────
// completeTask
// ──────────────────────────────────────────────

describe('completeTask', () => {
  it('isCompleted를 true로 설정하고 completedAt 기록', () => {
    useAppStore.getState().addTask({ title: '완료대상', minTime: 60 });
    const id = useAppStore.getState().tasks[0].id;
    useAppStore.getState().completeTask(id);
    const task = useAppStore.getState().tasks[0];
    expect(task.isCompleted).toBe(true);
    expect(task.completedAt).toBe(Date.now());
  });

  it('다른 태스크에는 영향 없음', () => {
    useAppStore.getState().addTask({ title: 'A', minTime: 60 });
    useAppStore.getState().addTask({ title: 'B', minTime: 60 });
    const idA = useAppStore.getState().tasks[0].id;
    useAppStore.getState().completeTask(idA);
    expect(useAppStore.getState().tasks[1].isCompleted).toBe(false);
  });

  it('완료 시 dailyStats가 업데이트됨', () => {
    useAppStore.getState().addTask({ title: '작업', minTime: 60 });
    const id = useAppStore.getState().tasks[0].id;
    useAppStore.getState().completeTask(id);
    const stats = useAppStore.getState().dailyStatsMap['2026-02-08'];
    expect(stats).toBeDefined();
    expect(stats.completedTasks).toBe(1);
  });
});

// ──────────────────────────────────────────────
// Settings
// ──────────────────────────────────────────────

describe('setSettings', () => {
  it('부분 설정 머지', () => {
    useAppStore.getState().setSettings({ hourlyRate: 30000 });
    expect(useAppStore.getState().settings.hourlyRate).toBe(30000);
    expect(useAppStore.getState().settings.mode).toBe('strict'); // 기존값 유지
  });

  it('dailyGoal 변경', () => {
    useAppStore.getState().setSettings({ dailyGoal: { hours: 8, tasks: 5 } });
    expect(useAppStore.getState().settings.dailyGoal.hours).toBe(8);
    expect(useAppStore.getState().settings.dailyGoal.tasks).toBe(5);
  });
});

// ──────────────────────────────────────────────
// DailyStats
// ──────────────────────────────────────────────

describe('getDailyStats', () => {
  it('캐시가 없으면 태스크 기반으로 생성', () => {
    useAppStore.getState().addTask({ title: '작업', minTime: 60 });
    useAppStore.getState().updateTask(useAppStore.getState().tasks[0].id, { totalTime: 3600 });
    const stats = useAppStore.getState().getDailyStats();
    expect(stats.date).toBe('2026-02-08');
    expect(stats.totalFocusTime).toBe(3600);
    expect(stats.earnedMoney).toBe(20000);
    expect(stats.totalDistractTime).toBe(0);
  });

  it('캐시가 있으면 캐시된 값 반환', () => {
    // updateDailyStats로 캐시 생성
    useAppStore.getState().addTask({ title: '작업', minTime: 60 });
    useAppStore.getState().updateDailyStats();

    // 태스크를 변경해도 캐시된 값이 반환됨
    useAppStore.getState().updateTask(useAppStore.getState().tasks[0].id, { totalTime: 9999 });
    const stats = useAppStore.getState().getDailyStats();
    expect(stats.totalFocusTime).toBe(0); // 캐시된 값 (태스크 totalTime은 addTask 시점의 0)
  });
});

describe('updateDailyStats', () => {
  it('오늘 날짜의 stats를 태스크 기반으로 갱신', () => {
    useAppStore.getState().addTask({ title: '작업', minTime: 60 });
    useAppStore.getState().updateTask(useAppStore.getState().tasks[0].id, { totalTime: 1800 });
    useAppStore.getState().updateDailyStats();
    const stats = useAppStore.getState().dailyStatsMap['2026-02-08'];
    expect(stats.totalFocusTime).toBe(1800);
    expect(stats.earnedMoney).toBe(10000);
  });

  it('기존 distractTime을 유지하면서 갱신', () => {
    useAppStore.getState().recordDistractTime(600);
    useAppStore.getState().addTask({ title: '작업', minTime: 60 });
    useAppStore.getState().updateTask(useAppStore.getState().tasks[0].id, { totalTime: 3600 });
    useAppStore.getState().updateDailyStats();
    const stats = useAppStore.getState().dailyStatsMap['2026-02-08'];
    expect(stats.totalDistractTime).toBe(600);
    expect(stats.totalFocusTime).toBe(3600);
  });
});

describe('recordDistractTime', () => {
  it('방해 시간 기록', () => {
    useAppStore.getState().recordDistractTime(300);
    const stats = useAppStore.getState().dailyStatsMap['2026-02-08'];
    expect(stats.totalDistractTime).toBe(300);
    expect(stats.lostMoney).toBe(1666); // 300/3600 * 20000 = 1666.66 → 1666
  });

  it('누적 기록', () => {
    useAppStore.getState().recordDistractTime(300);
    useAppStore.getState().recordDistractTime(600);
    const stats = useAppStore.getState().dailyStatsMap['2026-02-08'];
    expect(stats.totalDistractTime).toBe(900);
  });
});

// ──────────────────────────────────────────────
// Reward System
// ──────────────────────────────────────────────

describe('checkAndGrantReward', () => {
  it('시간 목표 달성 시 unlimitedUntil 설정', () => {
    // dailyGoal: 6시간, tasks: 3
    useAppStore.getState().addTask({ title: '작업', minTime: 60 });
    useAppStore.getState().updateTask(useAppStore.getState().tasks[0].id, { totalTime: 21600 }); // 6시간
    useAppStore.getState().updateDailyStats();
    useAppStore.getState().checkAndGrantReward();

    const reward = useAppStore.getState().rewardStatus;
    expect(reward.unlimitedUntil).not.toBeNull();
    // endOfDay: 2026-02-09 00:00:00
    const endOfDay = new Date(2026, 1, 9).getTime();
    expect(reward.unlimitedUntil).toBe(endOfDay);
  });

  it('작업 목표 달성 시 unlimitedUntil 설정', () => {
    for (let i = 0; i < 3; i++) {
      useAppStore.getState().addTask({ title: `작업${i}`, minTime: 60 });
    }
    const tasks = useAppStore.getState().tasks;
    tasks.forEach((t) => useAppStore.getState().completeTask(t.id));

    const reward = useAppStore.getState().rewardStatus;
    expect(reward.unlimitedUntil).not.toBeNull();
  });

  it('목표 미달성 시 보상 없음', () => {
    useAppStore.getState().addTask({ title: '작업', minTime: 60 });
    useAppStore.getState().updateTask(useAppStore.getState().tasks[0].id, { totalTime: 100 });
    useAppStore.getState().updateDailyStats();
    useAppStore.getState().checkAndGrantReward();

    expect(useAppStore.getState().rewardStatus.unlimitedUntil).toBeNull();
  });

  it('초과 작업 완료 시 bonusMinutes 부여', () => {
    // 5개 태스크 완료 (목표 3개, 초과 2개 → 120분 보너스)
    for (let i = 0; i < 5; i++) {
      useAppStore.getState().addTask({ title: `작업${i}`, minTime: 60 });
    }
    const tasks = useAppStore.getState().tasks;
    tasks.forEach((t) => useAppStore.getState().completeTask(t.id));

    expect(useAppStore.getState().rewardStatus.bonusMinutes).toBe(120);
  });

  it('dailyStats가 없으면 보상 검사 건너뜀', () => {
    useAppStore.getState().checkAndGrantReward();
    expect(useAppStore.getState().rewardStatus.unlimitedUntil).toBeNull();
    expect(useAppStore.getState().rewardStatus.bonusMinutes).toBe(0);
  });
});

// ──────────────────────────────────────────────
// Storage round-trip
// ──────────────────────────────────────────────

describe('saveToStorage / loadFromStorage', () => {
  it('저장 후 로드하면 동일한 상태 복원', async () => {
    useAppStore.getState().addTask({ title: '저장 테스트', minTime: 120 });
    useAppStore.getState().setSettings({ hourlyRate: 50000 });
    await useAppStore.getState().saveToStorage();

    const saved = getMockStorage();
    expect(saved.settings).toBeDefined();
    expect(saved.tasks).toBeDefined();

    // 리셋 후 로드
    resetStore();
    expect(useAppStore.getState().tasks).toHaveLength(0);

    // storage에 데이터 복원 후 로드
    (chrome.storage.sync.get as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => Promise.resolve(saved)
    );
    await useAppStore.getState().loadFromStorage();

    expect(useAppStore.getState().tasks).toHaveLength(1);
    expect(useAppStore.getState().tasks[0].title).toBe('저장 테스트');
    expect(useAppStore.getState().settings.hourlyRate).toBe(50000);
  });

  it('빈 스토리지에서 로드 시 기본값 사용', async () => {
    (chrome.storage.sync.get as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => Promise.resolve({})
    );
    await useAppStore.getState().loadFromStorage();

    expect(useAppStore.getState().settings.hourlyRate).toBe(20000);
    expect(useAppStore.getState().tasks).toEqual([]);
  });
});

// ──────────────────────────────────────────────
// storageError
// ──────────────────────────────────────────────

describe('storageError', () => {
  it('초기 storageError는 null', () => {
    expect(useAppStore.getState().storageError).toBeNull();
  });

  it('저장 실패 시 storageError가 설정됨', async () => {
    const error = new Error('Storage quota exceeded');
    (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    const promise = useAppStore.getState().saveToStorage();

    // saveWithRetry는 3회 재시도, delay: 500ms, 1000ms
    await vi.advanceTimersByTimeAsync(500);
    await vi.advanceTimersByTimeAsync(1000);

    await promise;

    expect(useAppStore.getState().storageError).toBe('Storage quota exceeded');
  });

  it('저장 성공 후 기존 storageError가 null로 초기화됨', async () => {
    // 먼저 에러 상태 설정
    useAppStore.setState({ storageError: '이전 에러' });
    expect(useAppStore.getState().storageError).toBe('이전 에러');

    // 저장 성공
    (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    await useAppStore.getState().saveToStorage();

    expect(useAppStore.getState().storageError).toBeNull();
  });
});

describe('clearStorageError', () => {
  it('storageError를 null로 초기화', () => {
    useAppStore.setState({ storageError: '테스트 에러' });
    expect(useAppStore.getState().storageError).toBe('테스트 에러');

    useAppStore.getState().clearStorageError();

    expect(useAppStore.getState().storageError).toBeNull();
  });
});
