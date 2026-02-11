import {
  Pause,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Zap,
  ExternalLink,
} from "lucide-react";
import {
  formatTime,
  formatMoney,
  calculateMoney,
} from "../shared/utils/time";
import { MONO, SORA, BODY_FONT, COLORS, hexToRgba } from "../shared/utils/style";
import { PopupSkeleton } from "../shared/components/Skeleton";
import { BrandLogo } from "../shared/components/BrandLogo";
import { usePopup } from "./hooks/usePopup";
import { PopupStat } from "./components/PopupStat";

function openNewTab() {
  chrome.tabs.create({ url: chrome.runtime.getURL("src/newtab/index.html") });
}

export function Popup() {
  const {
    settings,
    tasks,
    currentTime,
    elapsedTime,
    currentTask,
    todayStats,
    isRewardActive,
    isLoading,
    stopTask,
  } = usePopup();

  if (isLoading) return <PopupSkeleton />;

  return (
    <div
      className="w-[360px] bg-surface-deep text-text-primary"
      style={BODY_FONT}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <BrandLogo size={18} />
          <span
            className="text-xs font-bold tracking-[0.1em] uppercase text-text-secondary"
            style={SORA}
          >
            Focus Guard
          </span>
        </div>
        <span
          className="text-sm text-text-muted font-medium"
          style={{ ...MONO, fontFeatureSettings: "'tnum' 1" }}
        >
          {currentTime}
        </span>
      </div>

      <div className="px-4 pb-4 space-y-3">
        {/* ── Reward Banner ── */}
        {isRewardActive && (
          <div
            className="card rounded-xl px-4 py-2.5 text-center text-xs font-semibold text-earn"
            style={{
              borderColor: hexToRgba(COLORS.earn, 0.2),
              background: hexToRgba(COLORS.earn, 0.06),
            }}
          >
            <Zap size={13} className="inline mr-1.5 -mt-0.5" />
            일일 목표 달성! 자유시간 활성화
          </div>
        )}

        {/* ── Current Task Card ── */}
        {currentTask ? (
          <div
            className="card card-hero rounded-2xl p-4 animate-border-glow"
            style={{
              borderColor: hexToRgba(COLORS.gold400, 0.2),
              boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 16px ${hexToRgba(COLORS.gold400, 0.04)}`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-gold-400"
                  style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
                />
                <span
                  className="text-xs text-gold-400 font-bold tracking-widest uppercase"
                  style={SORA}
                >
                  진행 중
                </span>
              </div>
              <button
                onClick={stopTask}
                className="btn btn-danger px-2.5 py-1 text-xs"
                aria-label="작업 중지"
              >
                <Pause size={11} /> 중지
              </button>
            </div>

            <p className="text-base font-semibold text-text-primary mb-3 leading-snug">
              {currentTask.title}
            </p>

            {/* Progress */}
            <div
              className="mb-3"
              role="progressbar"
              aria-valuenow={Math.min(
                Math.round(
                  (elapsedTime / (currentTask.minTime * 60)) * 100,
                ),
                100,
              )}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`작업 진행률 ${Math.min(Math.round((elapsedTime / (currentTask.minTime * 60)) * 100), 100)}%`}
            >
              <div className="progress-track" style={{ height: "4px" }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min((elapsedTime / (currentTask.minTime * 60)) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${COLORS.gold600}, ${COLORS.gold400}, ${COLORS.gold300})`,
                    boxShadow: `0 0 8px ${hexToRgba(COLORS.gold400, 0.2)}`,
                  }}
                />
              </div>
              <div
                className="flex justify-between mt-1.5 text-xs text-text-muted"
                style={MONO}
              >
                <span>
                  {Math.min(
                    (elapsedTime / (currentTask.minTime * 60)) * 100,
                    100,
                  ).toFixed(0)}
                  %
                </span>
                <span>{currentTask.minTime}분 목표</span>
              </div>
            </div>

            {/* Time & Money */}
            <div className="flex items-end justify-between">
              <span
                className="text-xl font-bold text-text-primary leading-none"
                style={MONO}
              >
                {formatTime(elapsedTime)}
              </span>
              <span
                className="text-lg font-bold text-earn leading-none"
                style={MONO}
              >
                {formatMoney(
                  calculateMoney(elapsedTime, settings.hourlyRate),
                )}
              </span>
            </div>
          </div>
        ) : (
          <div className="card rounded-2xl p-5 text-center">
            <div
              className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{
                background: hexToRgba(COLORS.gold400, 0.08),
                border: `1px solid ${hexToRgba(COLORS.gold400, 0.15)}`,
              }}
            >
              <Clock size={18} className="text-gold-400" />
            </div>
            <p className="text-sm text-text-secondary mb-1">
              진행 중인 작업이 없습니다
            </p>
            <p className="text-xs text-text-muted mb-3">
              새 탭에서 작업을 추가하고 시작하세요
            </p>
            <button
              onClick={openNewTab}
              className="btn btn-gold px-4 py-1.5 text-xs mx-auto"
            >
              <ExternalLink size={12} /> 대시보드 열기
            </button>
          </div>
        )}

        {/* ── Stats Grid 2x2 ── */}
        <div className="grid grid-cols-2 gap-2.5" aria-live="polite">
          <PopupStat
            label="집중 시간"
            value={formatTime(todayStats.totalFocusTime)}
            accent={COLORS.gold400}
            icon={<Clock size={13} />}
          />
          <PopupStat
            label="획득 금액"
            value={formatMoney(todayStats.earnedMoney)}
            accent={COLORS.earn}
            icon={<TrendingUp size={13} />}
          />
          <PopupStat
            label="손실 금액"
            value={formatMoney(todayStats.lostMoney)}
            accent={COLORS.loss}
            icon={<TrendingDown size={13} />}
          />
          <PopupStat
            label="완료 작업"
            value={`${todayStats.completedTasks} / ${tasks.length || todayStats.tasks.length}`}
            accent={COLORS.textSecondary}
            icon={<CheckCircle2 size={13} />}
          />
        </div>

        {/* ── Dashboard Link ── */}
        <button
          onClick={openNewTab}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-text-muted hover:text-gold-400 transition-colors cursor-pointer bg-transparent border-none rounded-lg hover:bg-surface-card"
        >
          <ExternalLink size={11} />
          대시보드에서 자세히 보기
        </button>
      </div>
    </div>
  );
}
