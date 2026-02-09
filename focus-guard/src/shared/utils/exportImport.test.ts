import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resetStore } from '@/__tests__/helpers';
import { exportData, importData } from './exportImport';

beforeEach(() => {
  resetStore();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 1, 8, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('exportData', () => {
  it('chrome.storage에서 데이터를 읽어 다운로드를 트리거', async () => {
    // storage에 미리 데이터 설정
    await chrome.storage.sync.set({
      settings: { hourlyRate: 20000, mode: 'strict', distractingSites: [], dailyGoal: { hours: 6, tasks: 3 }, weeklyGoal: { hours: 30 }, notifications: { enabled: true, sessionComplete: true, distractionAlert: true, goalAchieved: true } },
      currentSession: { taskId: null, startTime: null, isActive: false, accumulatedTime: 0 },
      tasks: [],
      dailyStatsMap: {},
      rewardStatus: { unlimitedUntil: null, bonusMinutes: 0 },
    });

    // DOM mock: createElement, appendChild, click, removeChild
    const clickMock = vi.fn();
    const appendChildMock = vi.fn();
    const removeChildMock = vi.fn();
    const revokeObjectURLMock = vi.fn();

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: revokeObjectURLMock,
    });

    const mockAnchor = {
      href: '',
      download: '',
      click: clickMock,
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement);
    vi.spyOn(document.body, 'appendChild').mockImplementation(appendChildMock);
    vi.spyOn(document.body, 'removeChild').mockImplementation(removeChildMock);

    await exportData();

    expect(chrome.storage.sync.get).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(mockAnchor.download).toBe('focus-guard-backup-2026-02-08.json');
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');

    vi.restoreAllMocks();
  });
});

describe('importData', () => {
  it('유효한 JSON 파일 가져오기 성공', async () => {
    const validData = {
      settings: {
        hourlyRate: 30000,
        mode: 'strict',
        distractingSites: [],
        dailyGoal: { hours: 8, tasks: 5 },
        weeklyGoal: { hours: 40 },
        notifications: { enabled: true, sessionComplete: true, distractionAlert: true, goalAchieved: true },
      },
      currentSession: { taskId: null, startTime: null, isActive: false, accumulatedTime: 0 },
      tasks: [{ id: '1', title: '테스트', minTime: 30, totalTime: 0, isCompleted: false }],
      dailyStatsMap: {},
      rewardStatus: { unlimitedUntil: null, bonusMinutes: 0 },
    };

    const file = createMockFile(JSON.stringify(validData), 'backup.json');

    const result = await importData(file);

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
    expect(chrome.storage.sync.set).toHaveBeenCalledWith(expect.objectContaining({
      settings: validData.settings,
      tasks: validData.tasks,
    }));
  });

  it('잘못된 형식의 JSON 파일 → 에러 반환', async () => {
    const invalidData = {
      settings: { hourlyRate: 'not_a_number' },
    };

    const file = createMockFile(JSON.stringify(invalidData), 'bad.json');

    const result = await importData(file);

    expect(result.success).toBe(false);
    expect(result.error).toContain('유효하지 않은 백업 파일');
  });

  it('JSON 파싱 실패 시 에러 반환', async () => {
    const file = createMockFile('not valid json {{', 'broken.json');

    const result = await importData(file);

    expect(result.success).toBe(false);
    expect(result.error).toContain('오류가 발생했습니다');
  });

  it('필수 필드 누락 시 검증 실패', async () => {
    // tasks 누락
    const incompleteData = {
      settings: { hourlyRate: 20000, mode: 'strict', distractingSites: [] },
      currentSession: { taskId: null, startTime: null, isActive: false, accumulatedTime: 0 },
      dailyStatsMap: {},
      rewardStatus: { unlimitedUntil: null, bonusMinutes: 0 },
    };

    const file = createMockFile(JSON.stringify(incompleteData), 'incomplete.json');

    const result = await importData(file);

    expect(result.success).toBe(false);
    expect(result.error).toContain('유효하지 않은 백업 파일');
  });
});

/** File.text()가 jsdom에서 동작하도록 보장하는 mock File */
function createMockFile(content: string, name: string): File {
  const file = new File([content], name, { type: 'application/json' });
  // jsdom의 File.text() 지원 여부와 관계없이 text()를 보장
  if (!file.text || typeof file.text !== 'function') {
    file.text = () => Promise.resolve(content);
  }
  return file;
}
