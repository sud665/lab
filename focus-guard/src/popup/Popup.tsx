import { useEffect } from 'react';
import { Pause } from 'lucide-react';
import { useAppStore } from '../shared/store';
import { formatTime, formatMoney, calculateMoney } from '../shared/utils/time';

export function Popup() {
  const { settings, currentSession, tasks, rewardStatus, loadFromStorage, stopTask, setSettings, getDailyStats } = useAppStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const currentTask = tasks.find((t) => t.id === currentSession.taskId);
  const totalFocusTime = tasks.reduce((sum, task) => sum + task.totalTime, 0);
  const earnedMoney = calculateMoney(totalFocusTime, settings.hourlyRate);
  const todayStats = getDailyStats();
  const isRewardActive = rewardStatus.unlimitedUntil !== null && Date.now() < rewardStatus.unlimitedUntil;

  return (
    <div className="w-80 bg-slate-900 text-white">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4">
        <h1 className="text-xl font-bold">⏰ Focus Guard 💰</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Reward Banner */}
        {isRewardActive && (
          <div className="bg-green-900/50 rounded-lg p-3 text-center">
            <span className="text-green-400 text-sm font-semibold">일일 목표 달성! 자유시간 활성화</span>
          </div>
        )}

        {/* Current Task */}
        {currentTask ? (
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">현재 작업</div>
            <div className="font-semibold mb-2">{currentTask.title}</div>
            <div className="flex items-center justify-between">
              <div className="font-mono">{formatTime(currentTask.totalTime)}</div>
              <button
                onClick={stopTask}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <Pause size={14} />
                중지
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg p-4 text-center text-slate-400">
            작업 없음
          </div>
        )}

        {/* Stats */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-2">오늘 통계</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>총 집중 시간</span>
              <span className="font-mono">{formatTime(totalFocusTime)}</span>
            </div>
            <div className="flex justify-between">
              <span>획득 금액</span>
              <span className="font-mono text-green-400">{formatMoney(earnedMoney)}</span>
            </div>
            <div className="flex justify-between">
              <span>손실 금액</span>
              <span className="font-mono text-red-400">{formatMoney(todayStats.lostMoney)}</span>
            </div>
            <div className="flex justify-between">
              <span>완료 작업</span>
              <span>{tasks.filter((t) => t.isCompleted).length} / {tasks.length}</span>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-2">모드</div>
          <div className="flex gap-2">
            <button
              onClick={() => setSettings({ mode: 'strict' })}
              className={`flex-1 py-2 rounded font-semibold ${
                settings.mode === 'strict'
                  ? 'bg-yellow-500 text-slate-900'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              엄격 모드
            </button>
            <button
              onClick={() => setSettings({ mode: 'auto' })}
              className={`flex-1 py-2 rounded font-semibold ${
                settings.mode === 'auto'
                  ? 'bg-yellow-500 text-slate-900'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              자동 모드
            </button>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-2">시급 설정</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={settings.hourlyRate}
              onChange={(e) => setSettings({ hourlyRate: Number(e.target.value) })}
              className="flex-1 bg-slate-700 rounded px-3 py-2 outline-none"
              step={1000}
            />
            <span className="text-sm">원</span>
          </div>
        </div>
      </div>
    </div>
  );
}
