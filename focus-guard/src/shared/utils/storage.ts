import type { DailyStats } from '../types';

const MAX_RETRIES = 3;
const INITIAL_DELAY = 500;

export async function saveWithRetry(data: Record<string, unknown>): Promise<void> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await chrome.storage.sync.set(data);
      return;
    } catch (error) {
      lastError = error;

      // QUOTA_BYTES_PER_ITEM 초과 시 오래된 dailyStatsMap 항목 정리 후 재시도
      if (
        error instanceof Error &&
        error.message.includes('QUOTA_BYTES_PER_ITEM')
      ) {
        const statsMap = data.dailyStatsMap as Record<string, DailyStats> | undefined;
        if (statsMap) {
          data = { ...data, dailyStatsMap: cleanOldStats(statsMap, 30) };
        }
      }

      if (attempt < MAX_RETRIES - 1) {
        const delay = INITIAL_DELAY * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export function cleanOldStats(
  statsMap: Record<string, DailyStats>,
  keepDays: number = 30,
): Record<string, DailyStats> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - keepDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10); // YYYY-MM-DD

  const cleaned: Record<string, DailyStats> = {};
  for (const [date, stats] of Object.entries(statsMap)) {
    if (date >= cutoffStr) {
      cleaned[date] = stats;
    }
  }
  return cleaned;
}
