import { useEffect, useState } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { formatTime, formatMoney, calculateMoney, getCurrentTime } from '../shared/utils/time';
import { useAppStore } from '../shared/store';

export function TopBar() {
  const { currentSession, tasks, settings } = useAppStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  const currentTask = tasks.find((t) => t.id === currentSession.taskId);
  const isDistracting = false; // TODO: 산만한 사이트 감지

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSession.isActive && currentSession.startTime) {
        const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
        setElapsedTime(currentTask ? currentTask.totalTime + elapsed : elapsed);
      }
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession, currentTask]);

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

  const progress = currentTask.minTime > 0 ? Math.min((elapsedTime / (currentTask.minTime * 60)) * 100, 100) : 0;
  const earnedMoney = calculateMoney(elapsedTime, settings.hourlyRate);

  const barClass = isDistracting
    ? 'bg-red-600 animate-pulse'
    : 'bg-gradient-to-r from-yellow-500 to-orange-500';

  return (
    <div className={`fixed top-0 left-0 right-0 z-[999999] ${barClass} text-white py-2 px-4 shadow-lg`}>
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
