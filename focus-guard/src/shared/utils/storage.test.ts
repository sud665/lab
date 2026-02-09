import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resetStore } from '@/__tests__/helpers';
import { saveWithRetry, cleanOldStats } from './storage';
import type { DailyStats } from '../types';

beforeEach(() => {
  resetStore();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 1, 8, 12, 0, 0));
  // 각 테스트 전에 chrome.storage.sync.set mock 초기화
  (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mockClear();
});

afterEach(() => {
  vi.useRealTimers();
  (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mockReset();
  // 기본 mock 동작 복원 (resolve)
  (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mockImplementation(
    (items: Record<string, unknown>) => {
      Object.assign({}, items);
      return Promise.resolve();
    }
  );
});

describe('saveWithRetry', () => {
  it('성공 케이스: 첫 시도에서 저장 성공', async () => {
    (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    const data = { settings: { hourlyRate: 20000 } };

    await saveWithRetry(data);

    expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
    expect(chrome.storage.sync.set).toHaveBeenCalledWith(data);
  });

  it('1차 실패 후 재시도 성공', async () => {
    const data = { settings: { hourlyRate: 20000 } };

    (chrome.storage.sync.set as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(undefined);

    const promise = saveWithRetry(data);

    // 첫 retry delay: 500ms
    await vi.advanceTimersByTimeAsync(600);

    await promise;

    expect(chrome.storage.sync.set).toHaveBeenCalledTimes(2);
  });

  it('3회 모두 실패 시 에러 throw', async () => {
    const data = { settings: { hourlyRate: 20000 } };

    (chrome.storage.sync.set as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error('Persistent error'))
      .mockRejectedValueOnce(new Error('Persistent error'))
      .mockRejectedValueOnce(new Error('Persistent error'));

    const promise = saveWithRetry(data);

    // promise가 reject될 때 unhandled rejection 방지를 위해 먼저 catch 핸들러 등록
    const resultPromise = promise.catch((e: Error) => e);

    // 1차 retry delay: 500ms, 2차 retry delay: 1000ms
    await vi.advanceTimersByTimeAsync(600);
    await vi.advanceTimersByTimeAsync(1100);

    const error = await resultPromise;
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('Persistent error');

    expect(chrome.storage.sync.set).toHaveBeenCalledTimes(3);
  });

  it('QUOTA_BYTES_PER_ITEM 에러 시 오래된 stats 정리 후 재시도', async () => {
    const oldDate = '2025-12-01';
    const recentDate = '2026-02-07';
    const statsMap: Record<string, DailyStats> = {
      [oldDate]: createDailyStats(oldDate),
      [recentDate]: createDailyStats(recentDate),
    };

    const data = { dailyStatsMap: statsMap };

    (chrome.storage.sync.set as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error('QUOTA_BYTES_PER_ITEM exceeded'))
      .mockResolvedValueOnce(undefined);

    const promise = saveWithRetry(data);

    // retry delay: 500ms
    await vi.advanceTimersByTimeAsync(600);

    await promise;

    expect(chrome.storage.sync.set).toHaveBeenCalledTimes(2);

    // 두 번째 호출에서는 oldDate가 제거된 statsMap이 포함되어야 함
    const secondCallArg = (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mock.calls[1][0];
    expect(secondCallArg.dailyStatsMap[oldDate]).toBeUndefined();
    expect(secondCallArg.dailyStatsMap[recentDate]).toBeDefined();
  });
});

describe('cleanOldStats', () => {
  it('30일 이전 데이터 제거', () => {
    // 현재 시간: 2026-02-08
    // 30일 전: 2026-01-09
    const statsMap: Record<string, DailyStats> = {
      '2026-01-01': createDailyStats('2026-01-01'),
      '2026-01-08': createDailyStats('2026-01-08'),
      '2026-01-09': createDailyStats('2026-01-09'),
      '2026-02-07': createDailyStats('2026-02-07'),
      '2026-02-08': createDailyStats('2026-02-08'),
    };

    const cleaned = cleanOldStats(statsMap, 30);

    expect(Object.keys(cleaned)).toHaveLength(3);
    expect(cleaned['2026-01-01']).toBeUndefined();
    expect(cleaned['2026-01-08']).toBeUndefined();
    expect(cleaned['2026-01-09']).toBeDefined();
    expect(cleaned['2026-02-07']).toBeDefined();
    expect(cleaned['2026-02-08']).toBeDefined();
  });

  it('빈 statsMap은 빈 객체 반환', () => {
    const cleaned = cleanOldStats({}, 30);
    expect(Object.keys(cleaned)).toHaveLength(0);
  });

  it('모든 데이터가 최근이면 전부 유지', () => {
    const statsMap: Record<string, DailyStats> = {
      '2026-02-06': createDailyStats('2026-02-06'),
      '2026-02-07': createDailyStats('2026-02-07'),
      '2026-02-08': createDailyStats('2026-02-08'),
    };

    const cleaned = cleanOldStats(statsMap, 30);
    expect(Object.keys(cleaned)).toHaveLength(3);
  });
});

function createDailyStats(date: string): DailyStats {
  return {
    date,
    totalFocusTime: 0,
    totalDistractTime: 0,
    earnedMoney: 0,
    lostMoney: 0,
    completedTasks: 0,
    tasks: [],
  };
}
