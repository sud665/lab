import { useEffect, useState } from 'react';
import { formatTime, formatMoney, calculateMoney, getCurrentTime, getTodayDateString } from '../shared/utils/time';
import { useAppStore } from '../shared/store';

export function TopBar() {
  const { currentSession, tasks, settings, loadFromStorage } = useAppStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [isDistracting, setIsDistracting] = useState(false);
  const [distractingSiteName, setDistractingSiteName] = useState('');
  const [distractStartTime, setDistractStartTime] = useState<number | null>(null);
  const [distractElapsed, setDistractElapsed] = useState(0);

  const currentTask = tasks.find((t) => t.id === currentSession.taskId);

  // chrome.storage에서 초기 데이터 로드 + 변경 감지
  useEffect(() => {
    loadFromStorage();
    const handleStorageChange = () => {
      loadFromStorage();
    };
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, [loadFromStorage]);

  // 산만한 사이트 감지 이벤트 리스너
  useEffect(() => {
    const handler = (e: Event) => {
      const { siteName } = (e as CustomEvent).detail;
      setIsDistracting(true);
      setDistractingSiteName(siteName);
      setDistractStartTime(Date.now());
    };
    window.addEventListener('focus-guard-distraction', handler);
    return () => window.removeEventListener('focus-guard-distraction', handler);
  }, []);

  // 타이머 interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSession.isActive && currentSession.startTime) {
        const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
        setElapsedTime(currentTask ? currentTask.totalTime + elapsed : elapsed);
      }
      if (isDistracting && distractStartTime) {
        setDistractElapsed(Math.floor((Date.now() - distractStartTime) / 1000));
      }
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSession, currentTask, isDistracting, distractStartTime]);

  // 페이지 이탈 시 산만 시간을 chrome storage에 기록 (동기식 — store에서 직접 읽기)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isDistracting && distractStartTime) {
        const seconds = Math.floor((Date.now() - distractStartTime) / 1000);
        if (seconds > 0) {
          const { dailyStatsMap } = useAppStore.getState();
          const today = getTodayDateString();
          const existing = dailyStatsMap[today] || { totalDistractTime: 0, lostMoney: 0, date: today };
          const updated = {
            ...dailyStatsMap,
            [today]: {
              ...existing,
              date: today,
              totalDistractTime: (existing.totalDistractTime || 0) + seconds,
              lostMoney: (existing.lostMoney || 0) + Math.floor((seconds / 3600) * settings.hourlyRate),
            },
          };
          chrome.storage.sync.set({ dailyStatsMap: updated });
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDistracting, distractStartTime, settings.hourlyRate]);

  const lostMoney = calculateMoney(distractElapsed, settings.hourlyRate);

  // ── Distraction Warning Bar ──
  if (isDistracting) {
    return (
      <div className="fg-bar fg-bar--danger">
        <div className="fg-left">
          <span className="fg-dot fg-dot--danger" />
          <span className="fg-danger-label">{distractingSiteName}에서 시간 낭비 중</span>
        </div>
        <div className="fg-right">
          <span className="fg-loss-amount">-{formatMoney(lostMoney)}</span>
          <span className="fg-separator" />
          <span className="fg-mono fg-time">{formatTime(distractElapsed)}</span>
          <span className="fg-separator" />
          <span className="fg-mono fg-time">{currentTime}</span>
        </div>
      </div>
    );
  }

  // ── Idle Bar (no task) ──
  if (!currentSession.isActive || !currentTask) {
    return (
      <div className="fg-bar fg-bar--idle">
        <div className="fg-left">
          <span className="fg-dot fg-dot--idle" />
          <span className="fg-task-name" style={{ color: '#8e8e99' }}>작업을 시작하세요</span>
        </div>
        <div className="fg-right">
          <span className="fg-mono fg-time">{currentTime}</span>
        </div>
      </div>
    );
  }

  // ── Active Task Bar ──
  const progress = currentTask.minTime > 0
    ? Math.min((elapsedTime / (currentTask.minTime * 60)) * 100, 100)
    : 0;
  const earnedMoney = calculateMoney(elapsedTime, settings.hourlyRate);

  return (
    <div className="fg-bar fg-bar--active">
      <div className="fg-left">
        <span className="fg-dot fg-dot--active" />
        <span className="fg-task-name">{currentTask.title}</span>
        <span className="fg-separator" />
        <span className="fg-mono" style={{ color: '#e8b931', fontWeight: 600 }}>
          {formatTime(elapsedTime)}
        </span>
      </div>

      <div className="fg-center">
        <div className="fg-progress">
          <div className="fg-progress__fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="fg-progress-label">
          {progress.toFixed(0)}% · {currentTask.minTime}분
        </div>
      </div>

      <div className="fg-right">
        <span className="fg-mono fg-money--earn">{formatMoney(earnedMoney)}</span>
        <span className="fg-separator" />
        <span className="fg-mono fg-time">{currentTime}</span>
      </div>
    </div>
  );
}
