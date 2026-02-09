import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Plus, Trash2, Play, Square, CheckCircle2, Clock, Target, Zap, Settings as SettingsIcon } from 'lucide-react';
import { useAppStore } from '../shared/store';
import { useChromeSync } from '../shared/hooks/useChromeSync';
import { useAnimatedNumber } from '../shared/hooks/useAnimatedNumber';
import { formatTime, formatMoney, calculateMoney, getCurrentTime } from '../shared/utils/time';
import { MONO, SORA, hexToRgba } from '../shared/utils/style';
import { StatsChart } from '../shared/components/StatsChart';

function getFormattedDate(): string {
  const now = new Date();
  return now.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });
}

export function Dashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const {
    settings, tasks, currentSession, rewardStatus, dailyStatsMap,
    addTask, deleteTask, completeTask, startTask, stopTask, getDailyStats,
  } = useAppStore();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [formattedDate, setFormattedDate] = useState(getFormattedDate());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskMinTime, setNewTaskMinTime] = useState(30);
  const [elapsedTime, setElapsedTime] = useState(0);

  useChromeSync();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
      setFormattedDate(getFormattedDate());
      if (currentSession.isActive && currentSession.startTime) {
        const task = tasks.find((t) => t.id === currentSession.taskId);
        const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
        setElapsedTime(task ? task.totalTime + elapsed : elapsed);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSession, tasks]);

  const todayStats = getDailyStats();
  const isRewardActive = rewardStatus.unlimitedUntil !== null && Date.now() < rewardStatus.unlimitedUntil;
  const totalFocusTime = tasks.reduce((sum, task) => sum + task.totalTime, 0);
  const activeFocusTime = currentSession.isActive ? elapsedTime : totalFocusTime;
  const earnedMoney = calculateMoney(activeFocusTime, settings.hourlyRate);
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const currentTask = tasks.find((t) => t.id === currentSession.taskId);

  // Animated numbers
  const animatedFocusTime = useAnimatedNumber(activeFocusTime, { duration: 400, snapThreshold: 30 });
  const animatedEarned = useAnimatedNumber(earnedMoney, { duration: 600 });
  const animatedLost = useAnimatedNumber(todayStats.lostMoney, { duration: 600 });

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({ title: newTaskTitle, minTime: newTaskMinTime });
      setNewTaskTitle('');
      setNewTaskMinTime(30);
    }
  };

  const goalHoursProgress = Math.min((activeFocusTime / (settings.dailyGoal.hours * 3600)) * 100, 100);
  const goalTasksProgress = tasks.length > 0 ? Math.min((completedCount / settings.dailyGoal.tasks) * 100, 100) : 0;

  // Arc calculations
  const goalTotalSeconds = settings.dailyGoal.hours * 3600;
  const arcProgress = Math.min(activeFocusTime / goalTotalSeconds, 1);
  const arcHours = Math.floor(activeFocusTime / 3600);
  const arcMinutes = Math.floor((activeFocusTime % 3600) / 60);

  return (
    <div className="min-h-screen bg-surface-deep text-text-primary" style={{ fontFamily: "'Noto Sans KR', 'Sora', sans-serif" }}>
      <div className="max-w-[1080px] mx-auto px-6 py-6">

        {/* ═══ Header ═══ */}
        <header className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-gold-400" style={{ boxShadow: '0 0 10px rgba(232,185,49,0.5)' }} />
            <span className="text-[13px] font-semibold tracking-[0.12em] uppercase text-text-secondary" style={SORA}>
              Focus Guard
            </span>
          </div>
          <div className="flex items-center gap-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('settings')}
                className="btn p-2.5 rounded-xl text-text-muted hover:text-gold-400 hover:bg-surface-elevated"
                aria-label="설정"
              >
                <SettingsIcon size={18} />
              </button>
            )}
          </div>
        </header>

        {/* ═══ Reward Banner ═══ */}
        {isRewardActive && (
          <div className="animate-fade-in mb-4 card rounded-xl px-5 py-3 text-center text-[13px] font-semibold text-earn"
            style={{ borderColor: 'rgba(52,211,153,0.2)', background: 'rgba(52,211,153,0.06)' }}>
            <Zap size={14} className="inline mr-1.5 -mt-0.5" />
            일일 목표 달성! 자유시간 활성화
          </div>
        )}

        {/* ═══ Hero Section ═══ */}
        <div className="mb-5 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <div className="card rounded-2xl p-6"
            style={{
              boxShadow: '0 4px 32px rgba(0,0,0,0.3), 0 0 24px rgba(232,185,49,0.04)',
              background: 'linear-gradient(160deg, #1a1a22, #12121a)',
              borderColor: currentTask ? 'rgba(232,185,49,0.15)' : undefined,
            }}>
            <div className="flex items-stretch gap-8">
              {/* ─── Left: Clock + Stats ─── */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                {/* Large Clock */}
                <h1 className="text-[64px] font-extralight text-gold-gradient leading-none font-tnum mb-1" style={SORA}>
                  {currentTime}
                </h1>
                <p className="text-[13px] text-text-muted mb-6">{formattedDate}</p>

                {/* Inline Stats */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]" style={MONO}>
                  <span className="flex items-center gap-1.5 text-gold-400 font-tnum">
                    <Clock size={14} className="opacity-60" />
                    <span className="font-semibold">{formatTime(animatedFocusTime)}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-earn font-tnum">
                    <TrendingUp size={14} className="opacity-60" />
                    <span className="font-semibold">{formatMoney(animatedEarned)}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-loss font-tnum">
                    <TrendingDown size={14} className="opacity-60" />
                    <span className="font-semibold">{formatMoney(animatedLost)}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-text-secondary font-tnum">
                    <CheckCircle2 size={14} className="opacity-60" />
                    <span className="font-semibold">{completedCount} / {tasks.length}</span>
                  </span>
                </div>
              </div>

              {/* ─── Right: Arc + Task ─── */}
              <div className="w-[220px] flex flex-col items-center justify-center flex-shrink-0">
                <ProgressArc progress={arcProgress} hours={arcHours} minutes={arcMinutes} goalHours={settings.dailyGoal.hours} />
                {/* Task info or idle message */}
                <div className="mt-3 text-center w-full">
                  {currentTask ? (
                    <>
                      <p className="text-[13px] font-medium text-text-primary truncate mb-2 px-2">{currentTask.title}</p>
                      <button onClick={stopTask} className="btn btn-danger px-3.5 py-1.5 text-[11px] mx-auto" aria-label="작업 중지">
                        <Square size={10} fill="currentColor" /> 중지
                      </button>
                    </>
                  ) : tasks.length > 0 ? (
                    <p className="text-[12px] text-text-muted">작업을 시작하세요</p>
                  ) : (
                    <p className="text-[12px] text-text-muted">오늘 하루를 가치 있게<br />만들어보세요</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Main Content: Tasks + Sidebar ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>

          {/* ─── Left: Task List (3/5) ─── */}
          <div className="lg:col-span-3">
            <SectionTitle icon={<Target size={14} />} text="오늘 할 일" />

            {/* Add Task */}
            <div className="card rounded-xl px-4 py-3 mb-3">
              <div className="flex gap-2.5 items-center">
                <input
                  type="text"
                  placeholder="새 작업 입력..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  className="input-base flex-1 px-3 py-2 text-[13px]"
                />
                <input
                  type="number"
                  value={newTaskMinTime}
                  onChange={(e) => setNewTaskMinTime(Number(e.target.value))}
                  min={5} step={5}
                  className="input-base w-16 px-2 py-2 text-[12px] text-center"
                  style={MONO}
                />
                <span className="text-[11px] text-text-muted">분</span>
                <button onClick={handleAddTask} className="btn btn-gold px-3.5 py-2 text-[12px]">
                  <Plus size={14} /> 추가
                </button>
              </div>
            </div>

            {/* Task Items */}
            <div className="space-y-2">
              {tasks.map((task) => {
                const isActive = currentSession.taskId === task.id;
                return (
                  <div key={task.id}
                    className="card rounded-xl px-4 py-3 transition-all duration-200"
                    style={{
                      borderColor: isActive ? 'rgba(232,185,49,0.25)' : undefined,
                      opacity: task.isCompleted ? 0.5 : 1,
                    }}>
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => completeTask(task.id)}
                        className="flex-shrink-0 cursor-pointer bg-transparent border-none p-0"
                        aria-label={task.isCompleted ? '완료됨' : '완료하기'}
                      >
                        {task.isCompleted ? (
                          <CheckCircle2 size={18} className="text-earn" />
                        ) : (
                          <div className="w-[18px] h-[18px] rounded-full" style={{ border: '2px solid var(--color-surface-border)' }} />
                        )}
                      </button>

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <span className={`text-[14px] font-medium ${task.isCompleted ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                          {task.title}
                        </span>
                      </div>

                      {/* Time */}
                      <span className="text-[12px] text-text-muted flex-shrink-0" style={MONO}>
                        {formatTime(task.totalTime)}<span className="text-text-muted/50"> / {task.minTime}분</span>
                      </span>

                      {/* Actions */}
                      {!task.isCompleted && !currentSession.isActive && (
                        <button onClick={() => startTask(task.id)} className="btn btn-gold px-2.5 py-1 text-[11px]" aria-label="시작">
                          <Play size={10} fill="currentColor" /> 시작
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-lg cursor-pointer opacity-30 hover:opacity-100 transition-opacity duration-200 text-loss bg-transparent border-none"
                        aria-label="삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {tasks.length === 0 && (
                <div className="card rounded-xl px-5 py-8 text-center">
                  <p className="text-[13px] text-text-muted">아직 작업이 없습니다</p>
                </div>
              )}
            </div>
          </div>

          {/* ─── Right: Goals + Chart (2/5) ─── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Daily Goal */}
            <div className="card rounded-xl p-5">
              <SectionTitle icon={<Target size={14} />} text="일일 목표" compact />
              <div className="space-y-4 mt-4">
                <GoalBar label="집중 시간"
                  current={`${Math.floor(activeFocusTime / 3600)}h ${Math.floor((activeFocusTime % 3600) / 60)}m`}
                  target={`${settings.dailyGoal.hours}h`}
                  progress={goalHoursProgress} color="#e8b931" />
                <GoalBar label="작업 완료"
                  current={`${completedCount}개`}
                  target={`${settings.dailyGoal.tasks}개`}
                  progress={goalTasksProgress} color="#34d399" />
              </div>
              <div className="mt-4 pt-3 flex justify-between text-[12px]" style={{ borderTop: '1px solid var(--color-surface-border)' }}>
                <span className="text-text-muted">시급</span>
                <span className="text-gold-400 font-bold" style={MONO}>{formatMoney(settings.hourlyRate)}</span>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="card rounded-xl p-5">
              <SectionTitle icon={<Clock size={14} />} text="주간 통계" compact />
              <div className="mt-4">
                <StatsChart dailyStatsMap={dailyStatsMap} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ Sub Components ═══ */

function SectionTitle({ icon, text, compact }: { icon: React.ReactNode; text: string; compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'mb-3'}`}>
      <span className="text-gold-400">{icon}</span>
      <h3 className="text-[11px] font-bold text-text-secondary tracking-widest uppercase" style={{ fontFamily: "'Sora', sans-serif" }}>
        {text}
      </h3>
    </div>
  );
}

function GoalBar({ label, current, target, progress, color }: {
  label: string; current: string; target: string; progress: number; color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-[12px] mb-1.5">
        <span className="text-text-secondary font-medium">{label}</span>
        <span className="text-text-muted" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{current} / {target}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${hexToRgba(color, 0.6)}, ${color})`,
          boxShadow: `0 0 8px ${hexToRgba(color, 0.2)}`,
        }} />
      </div>
    </div>
  );
}

/* ═══ SVG Progress Arc ═══ */

function ProgressArc({ progress, hours, minutes, goalHours }: {
  progress: number; hours: number; minutes: number; goalHours: number;
}) {
  const size = 180;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // 270-degree arc (bottom open) — starts at 135° ends at 405° (135°+270°)
  const startAngle = 135;
  const sweepAngle = 270;
  const endAngle = startAngle + sweepAngle;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcPath = (startDeg: number, endDeg: number) => {
    const x1 = center + radius * Math.cos(toRad(startDeg));
    const y1 = center + radius * Math.sin(toRad(startDeg));
    const x2 = center + radius * Math.cos(toRad(endDeg));
    const y2 = center + radius * Math.sin(toRad(endDeg));
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const trackPath = arcPath(startAngle, endAngle);
  const fillEndAngle = startAngle + sweepAngle * Math.min(progress, 1);
  const fillPath = progress > 0.005 ? arcPath(startAngle, fillEndAngle) : '';

  const pct = Math.round(progress * 100);
  const gradientId = 'arc-gold-gradient';

  return (
    <div className="relative animate-arc-glow" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="block">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="50%" stopColor="#e8b931" />
            <stop offset="100%" stopColor="#d4a017" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} strokeLinecap="round"
          style={{ animation: 'arc-breathe 4s ease-in-out infinite' }}
        />

        {/* Fill */}
        {fillPath && (
          <path d={fillPath} fill="none" stroke={`url(#${gradientId})`} strokeWidth={strokeWidth} strokeLinecap="round"
            style={{ transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        )}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingBottom: 8 }}>
        <span className="text-[32px] font-bold text-gold-gradient leading-none font-tnum" style={SORA}>
          {pct}%
        </span>
        <span className="text-[12px] text-text-muted mt-1 font-tnum" style={MONO}>
          {hours}h {minutes}m / {goalHours}h
        </span>
      </div>
    </div>
  );
}
