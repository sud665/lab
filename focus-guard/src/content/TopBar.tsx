import { useEffect, useState } from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { formatTime, formatMoney, calculateMoney, getCurrentTime } from '../shared/utils/time';
import { useAppStore } from '../shared/store';

export function TopBar() {
  const { currentSession, tasks, settings } = useAppStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [isDistracting, setIsDistracting] = useState(false);
  const [distractingSiteName, setDistractingSiteName] = useState('');
  const [distractStartTime, setDistractStartTime] = useState<number | null>(null);
  const [distractElapsed, setDistractElapsed] = useState(0);

  const currentTask = tasks.find((t) => t.id === currentSession.taskId);

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

  // 페이지 이탈 시 산만 시간을 chrome storage에 기록
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isDistracting && distractStartTime) {
        const seconds = Math.floor((Date.now() - distractStartTime) / 1000);
        if (seconds > 0) {
          chrome.storage.sync.get('dailyStatsMap', (data) => {
            const map = (data.dailyStatsMap as Record<string, { totalDistractTime: number; lostMoney: number; date: string }>) || {};
            const today = new Date().toISOString().split('T')[0];
            const existing = map[today] || { totalDistractTime: 0, lostMoney: 0, date: today };
            map[today] = {
              ...existing,
              date: today,
              totalDistractTime: (existing.totalDistractTime || 0) + seconds,
              lostMoney: (existing.lostMoney || 0) + Math.floor((seconds / 3600) * settings.hourlyRate),
            };
            chrome.storage.sync.set({ dailyStatsMap: map });
          });
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDistracting, distractStartTime, settings.hourlyRate]);

  const lostMoney = calculateMoney(distractElapsed, settings.hourlyRate);

  // 산만한 사이트 경고 바
  if (isDistracting) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[999999] bg-red-600 animate-pulse text-white py-2 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingDown size={16} />
            <span className="font-semibold">{distractingSiteName}에서 시간을 낭비하고 있습니다!</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono font-bold text-red-200">-{formatMoney(lostMoney)} 손실 중</span>
            <span className="font-mono">{formatTime(distractElapsed)}</span>
            <span className="font-mono">{currentTime}</span>
          </div>
        </div>
      </div>
    );
  }

  // 작업 없음 바
  if (!currentSession.isActive || !currentTask) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[999999] bg-gray-700 text-white py-2 px-4 flex items-center justify-between text-sm shadow-lg">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>작업을 시작하세요</span>
        </div>
        <div className="font-mono">{currentTime}</div>
      </div>
    );
  }

  // 작업 중 바
  const progress = currentTask.minTime > 0 ? Math.min((elapsedTime / (currentTask.minTime * 60)) * 100, 100) : 0;
  const earnedMoney = calculateMoney(elapsedTime, settings.hourlyRate);

  return (
    <div className="fixed top-0 left-0 right-0 z-[999999] bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
        {/* Left: Task Info */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span className="font-semibold">{currentTask.title}</span>
          </div>
          <div className="font-mono font-bold">{formatTime(elapsedTime)}</div>
        </div>

        {/* Center: Progress Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-center mt-1">
            {progress.toFixed(0)}% ({currentTask.minTime}분 목표)
          </div>
        </div>

        {/* Right: Money & Time */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="flex items-center gap-1">
            <TrendingUp size={16} />
            <span className="font-mono font-bold">{formatMoney(earnedMoney)}</span>
          </div>
          <div className="font-mono">{currentTime}</div>
        </div>
      </div>
    </div>
  );
}
