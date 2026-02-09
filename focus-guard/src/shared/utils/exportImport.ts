import type { StorageData } from '../types';

export async function exportData(): Promise<void> {
  const data = await chrome.storage.sync.get([
    'settings',
    'currentSession',
    'tasks',
    'dailyStatsMap',
    'rewardStatus',
  ]);

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const filename = `focus-guard-backup-${yyyy}-${mm}-${dd}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importData(file: File): Promise<{ success: boolean; error?: string }> {
  try {
    const text = await file.text();
    const data: unknown = JSON.parse(text);

    if (!validateStorageData(data)) {
      return { success: false, error: '유효하지 않은 백업 파일입니다. 필수 데이터가 누락되었습니다.' };
    }

    await chrome.storage.sync.set({
      settings: data.settings,
      currentSession: data.currentSession,
      tasks: data.tasks,
      dailyStatsMap: data.dailyStatsMap,
      rewardStatus: data.rewardStatus,
    });

    return { success: true };
  } catch {
    return { success: false, error: '파일을 읽거나 파싱하는 중 오류가 발생했습니다.' };
  }
}

function validateStorageData(data: unknown): data is StorageData {
  if (typeof data !== 'object' || data === null) return false;

  const d = data as Record<string, unknown>;

  // settings 검증
  if (typeof d.settings !== 'object' || d.settings === null) return false;
  const s = d.settings as Record<string, unknown>;
  if (typeof s.hourlyRate !== 'number') return false;
  if (s.mode !== 'strict' && s.mode !== 'auto') return false;
  if (!Array.isArray(s.distractingSites)) return false;

  // currentSession 검증
  if (typeof d.currentSession !== 'object' || d.currentSession === null) return false;
  const cs = d.currentSession as Record<string, unknown>;
  if (typeof cs.isActive !== 'boolean') return false;

  // tasks 검증
  if (!Array.isArray(d.tasks)) return false;

  // dailyStatsMap 검증
  if (typeof d.dailyStatsMap !== 'object' || d.dailyStatsMap === null) return false;

  // rewardStatus 검증
  if (typeof d.rewardStatus !== 'object' || d.rewardStatus === null) return false;

  return true;
}
