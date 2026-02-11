import { formatTime, formatMoney } from "../shared/utils/time";
import { useTopBar } from "./hooks/useTopBar";

function CollapseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3.5 8.75L7 5.25L10.5 8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TopBar() {
  const {
    currentSession,
    currentTask,
    currentTime,
    elapsedTime,
    isDistracting,
    distractingSiteName,
    distractElapsed,
    isCollapsed,
    toggleCollapsed,
    lostMoney,
    earnedMoney,
    dotClass,
    pillClass,
    pillLabel,
    progress,
  } = useTopBar();

  // ── Collapsed Pill ──
  if (isCollapsed) {
    return (
      <button
        className={`fg-pill ${pillClass}`}
        onClick={() => toggleCollapsed(false)}
        aria-label="Focus Guard 표시줄 열기"
      >
        <span className={dotClass} />
        <span className="fg-pill__label">{pillLabel}</span>
      </button>
    );
  }

  // ── Distraction Warning Bar ──
  if (isDistracting) {
    return (
      <div
        className="fg-bar fg-bar--danger"
        role="alert"
        aria-live="assertive"
        aria-label={`${distractingSiteName}에서 시간 낭비 중 - 손실 ${formatMoney(lostMoney)}`}
      >
        <div className="fg-left">
          <span className="fg-dot fg-dot--danger" />
          <span className="fg-danger-label">
            {distractingSiteName}에서 시간 낭비 중
          </span>
        </div>
        <div className="fg-right">
          <span className="fg-loss-amount">-{formatMoney(lostMoney)}</span>
          <span className="fg-separator" />
          <span className="fg-mono fg-time">
            {formatTime(distractElapsed)}
          </span>
          <span className="fg-separator" />
          <span className="fg-mono fg-time">{currentTime}</span>
          <button
            className="fg-collapse-btn"
            onClick={() => toggleCollapsed(true)}
            aria-label="최소화"
          >
            <CollapseIcon />
          </button>
        </div>
      </div>
    );
  }

  // ── Idle Bar (no task) ──
  if (!currentSession.isActive || !currentTask) {
    return (
      <div
        className="fg-bar fg-bar--idle"
        role="status"
        aria-label="Focus Guard - 대기 중"
      >
        <div className="fg-left">
          <span className="fg-dot fg-dot--idle" />
          <span className="fg-task-name" style={{ color: "#8e8e99" }}>
            작업을 시작하세요
          </span>
        </div>
        <div className="fg-right">
          <span className="fg-mono fg-time">{currentTime}</span>
          <button
            className="fg-collapse-btn"
            onClick={() => toggleCollapsed(true)}
            aria-label="최소화"
          >
            <CollapseIcon />
          </button>
        </div>
      </div>
    );
  }

  // ── Active Task Bar ──
  return (
    <div
      className="fg-bar fg-bar--active"
      role="status"
      aria-live="polite"
      aria-label={`${currentTask.title} 진행 중 - ${formatTime(elapsedTime)}`}
    >
      <div className="fg-left">
        <span className="fg-dot fg-dot--active" />
        <span className="fg-task-name">{currentTask.title}</span>
        <span className="fg-separator" />
        <span
          className="fg-mono"
          style={{ color: "#e8b931", fontWeight: 600 }}
        >
          {formatTime(elapsedTime)}
        </span>
      </div>

      <div className="fg-center">
        <div
          className="fg-progress"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`작업 진행률 ${progress.toFixed(0)}%`}
        >
          <div
            className="fg-progress__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="fg-progress-label">
          {progress.toFixed(0)}% · {currentTask.minTime}분
        </div>
      </div>

      <div className="fg-right">
        <span className="fg-mono fg-money--earn">
          {formatMoney(earnedMoney)}
        </span>
        <span className="fg-separator" />
        <span className="fg-mono fg-time">{currentTime}</span>
        <button
          className="fg-collapse-btn"
          onClick={() => toggleCollapsed(true)}
          aria-label="최소화"
        >
          <CollapseIcon />
        </button>
      </div>
    </div>
  );
}
