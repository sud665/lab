import { useEffect, useState } from 'react';
import { Pause, Clock, TrendingUp, TrendingDown, CheckCircle2, Zap, Shield, ExternalLink } from 'lucide-react';
import { useAppStore } from '../shared/store';
import { useChromeSync } from '../shared/hooks/useChromeSync';
import { formatTime, formatMoney, calculateMoney, getCurrentTime } from '../shared/utils/time';
import { MONO, SORA, BODY_FONT, COLORS, hexToRgba } from '../shared/utils/style';
import { PopupSkeleton } from '../shared/components/Skeleton';

function openNewTab() {
  chrome.tabs.create({ url: chrome.runtime.getURL('src/newtab/index.html') });
}

export function Popup() {
  const { settings, currentSession, tasks, rewardStatus, stopTask, setSettings, getDailyStats } = useAppStore();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [elapsedTime, setElapsedTime] = useState(0);

  const { isLoading } = useChromeSync();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
      if (currentSession.isActive && currentSession.startTime) {
        const task = tasks.find((t) => t.id === currentSession.taskId);
        const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
        setElapsedTime(task ? task.totalTime + elapsed : elapsed);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSession, tasks]);

  const currentTask = tasks.find((t) => t.id === currentSession.taskId);
  const todayStats = getDailyStats();
  const isRewardActive = rewardStatus.unlimitedUntil !== null && Date.now() < rewardStatus.unlimitedUntil;

  if (isLoading) return <PopupSkeleton />;

  return (
    <div className="w-[360px] bg-surface-deep text-text-primary" style={BODY_FONT}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-gold-400" style={{ boxShadow: `0 0 8px ${hexToRgba(COLORS.gold400, 0.5)}` }} />
          <span className="text-[12px] font-bold tracking-[0.1em] uppercase text-text-secondary" style={SORA}>
            Focus Guard
          </span>
        </div>
        <span className="text-[13px] text-text-muted font-medium" style={{ ...MONO, fontFeatureSettings: "'tnum' 1" }}>
          {currentTime}
        </span>
      </div>

      <div className="px-4 pb-4 space-y-3">

        {/* ── Reward Banner ── */}
        {isRewardActive && (
          <div className="card rounded-xl px-4 py-2.5 text-center text-[12px] font-semibold text-earn"
            style={{ borderColor: hexToRgba(COLORS.earn, 0.2), background: hexToRgba(COLORS.earn, 0.06) }}>
            <Zap size={13} className="inline mr-1.5 -mt-0.5" />
            일일 목표 달성! 자유시간 활성화
          </div>
        )}

        {/* ── Current Task Card ── */}
        {currentTask ? (
          <div className="card card-hero rounded-2xl p-4 animate-border-glow"
            style={{
              borderColor: hexToRgba(COLORS.gold400, 0.2),
              boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 16px ${hexToRgba(COLORS.gold400, 0.04)}`,
            }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                <span className="text-[10px] text-gold-400 font-bold tracking-widest uppercase" style={SORA}>
                  진행 중
                </span>
              </div>
              <button onClick={stopTask} className="btn btn-danger px-2.5 py-1 text-[11px]" aria-label="작업 중지">
                <Pause size={11} /> 중지
              </button>
            </div>

            <p className="text-[15px] font-semibold text-text-primary mb-3 leading-snug">{currentTask.title}</p>

            {/* Progress */}
            <div className="mb-3" role="progressbar"
              aria-valuenow={Math.min(Math.round((elapsedTime / (currentTask.minTime * 60)) * 100), 100)}
              aria-valuemin={0} aria-valuemax={100}
              aria-label={`작업 진행률 ${Math.min(Math.round((elapsedTime / (currentTask.minTime * 60)) * 100), 100)}%`}>
              <div className="progress-track" style={{ height: '4px' }}>
                <div className="progress-fill"
                  style={{
                    width: `${Math.min((elapsedTime / (currentTask.minTime * 60)) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${COLORS.gold600}, ${COLORS.gold400}, ${COLORS.gold300})`,
                    boxShadow: `0 0 8px ${hexToRgba(COLORS.gold400, 0.2)}`,
                  }} />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-text-muted" style={MONO}>
                <span>{Math.min((elapsedTime / (currentTask.minTime * 60)) * 100, 100).toFixed(0)}%</span>
                <span>{currentTask.minTime}분 목표</span>
              </div>
            </div>

            {/* Time & Money */}
            <div className="flex items-end justify-between">
              <span className="text-[22px] font-bold text-text-primary leading-none" style={MONO}>
                {formatTime(elapsedTime)}
              </span>
              <span className="text-[18px] font-bold text-earn leading-none" style={MONO}>
                {formatMoney(calculateMoney(elapsedTime, settings.hourlyRate))}
              </span>
            </div>
          </div>
        ) : (
          <div className="card rounded-2xl p-5 text-center">
            <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ background: hexToRgba(COLORS.gold400, 0.08), border: `1px solid ${hexToRgba(COLORS.gold400, 0.15)}` }}>
              <Clock size={18} className="text-gold-400" />
            </div>
            <p className="text-[13px] text-text-secondary mb-1">진행 중인 작업이 없습니다</p>
            <p className="text-[11px] text-text-muted mb-3">새 탭에서 작업을 추가하고 시작하세요</p>
            <button onClick={openNewTab} className="btn btn-gold px-4 py-1.5 text-[11px] mx-auto">
              <ExternalLink size={12} /> 대시보드 열기
            </button>
          </div>
        )}

        {/* ── Stats Grid 2x2 ── */}
        <div className="grid grid-cols-2 gap-2.5" aria-live="polite">
          <PopupStat label="집중 시간" value={formatTime(todayStats.totalFocusTime)} accent={COLORS.gold400} icon={<Clock size={13} />} />
          <PopupStat label="획득 금액" value={formatMoney(todayStats.earnedMoney)} accent={COLORS.earn} icon={<TrendingUp size={13} />} />
          <PopupStat label="손실 금액" value={formatMoney(todayStats.lostMoney)} accent={COLORS.loss} icon={<TrendingDown size={13} />} />
          <PopupStat label="완료 작업" value={`${todayStats.completedTasks} / ${tasks.length || todayStats.tasks.length}`} accent={COLORS.textSecondary} icon={<CheckCircle2 size={13} />} />
        </div>

        {/* ── Mode Toggle ── */}
        <div className="card rounded-xl p-3.5">
          <div className="text-[10px] text-text-muted font-bold mb-2.5 tracking-widest uppercase" style={{ fontFamily: "'Sora', sans-serif" }}>모드</div>
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-surface-border)' }}>
            <ModeBtn active={settings.mode === 'strict'} onClick={() => setSettings({ mode: 'strict' })} icon={<Shield size={13} />} label="엄격" />
            <ModeBtn active={settings.mode === 'auto'} onClick={() => setSettings({ mode: 'auto' })} icon={<Zap size={13} />} label="자동" />
          </div>
        </div>

        {/* ── Hourly Rate ── */}
        <div className="card rounded-xl p-3.5">
          <div className="text-[10px] text-text-muted font-bold mb-2.5 tracking-widest uppercase" style={{ fontFamily: "'Sora', sans-serif" }}>시급</div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-text-muted">₩</span>
            <input
              type="number"
              value={settings.hourlyRate}
              onChange={(e) => setSettings({ hourlyRate: Number(e.target.value) })}
              step={1000}
              aria-label="시급 (원)"
              className="input-base flex-1 px-3 py-1.5 text-[15px] font-bold"
              style={MONO}
            />
            <span className="text-[11px] text-text-muted">원/시간</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub Components ── */

function PopupStat({ label, value, accent, icon }: { label: string; value: string; accent: string; icon: React.ReactNode }) {
  const r = parseInt(accent.slice(1, 3), 16);
  const g = parseInt(accent.slice(3, 5), 16);
  const b = parseInt(accent.slice(5, 7), 16);
  return (
    <div className="card rounded-xl p-3" style={{ borderColor: `rgba(${r},${g},${b},0.1)` }}>
      <div className="flex items-center gap-1.5 mb-1.5" style={{ color: accent }}>
        {icon}
        <span className="text-[10px] font-bold tracking-wide">{label}</span>
      </div>
      <span className="text-[16px] font-bold block" style={{ ...{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.02em' }, color: accent }}>
        {value}
      </span>
    </div>
  );
}

function ModeBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold transition-all duration-200 cursor-pointer"
      style={{
        background: active ? 'rgba(232,185,49,0.1)' : 'transparent',
        color: active ? '#e8b931' : '#5c5c66',
        borderRight: '1px solid var(--color-surface-border)',
        border: 'none',
        borderLeft: 'none',
      }}
    >
      {icon} {label}
    </button>
  );
}
