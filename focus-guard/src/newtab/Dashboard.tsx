import {
  TrendingDown,
  Plus,
  Trash2,
  Play,
  Square,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  Settings as SettingsIcon,
} from "lucide-react";
import { formatTime, formatMoney } from "../shared/utils/time";
import { MONO, SORA } from "../shared/utils/style";
import { StatsChart } from "../shared/components/StatsChart";
import { DashboardSkeleton } from "../shared/components/Skeleton";
import { BrandLogo } from "../shared/components/BrandLogo";
import { useDashboard } from "./hooks/useDashboard";
import { SectionTitle } from "./components/SectionTitle";
import { GoalCard } from "./components/GoalCard";
import { ProgressArc } from "./components/ProgressArc";

export function Dashboard({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const {
    settings,
    tasks,
    currentSession,
    dailyStatsMap,
    addTask,
    startTask,
    stopTask,
    currentTime,
    formattedDate,
    isRewardActive,
    activeFocusTime,
    completedCount,
    currentTask,
    isLoading,
    animatedFocusTime,
    animatedEarned,
    animatedLost,
    taskInputRef,
    newTaskTitle,
    setNewTaskTitle,
    newTaskMinTime,
    setNewTaskMinTime,
    handleAddTask,
    editingTaskId,
    editingTitle,
    setEditingTitle,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    undoTask,
    handleDelete,
    handleUndo,
    dismissUndo,
    justCompletedId,
    handleComplete,
    showCelebration,
    goalHoursProgress,
    goalTasksProgress,
    arcProgress,
    arcHours,
    arcMinutes,
  } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div
      className="min-h-screen w-full bg-surface-deep text-text-primary"
      style={{ fontFamily: "'Noto Sans KR', 'Sora', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* ═══ Header ═══ */}
        <header className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <BrandLogo size={22} />
            <span
              className="text-sm font-semibold tracking-[0.12em] uppercase text-text-secondary"
              style={SORA}
            >
              Focus Guard
            </span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate("settings")}
              className="btn btn-ghost p-2.5 rounded-xl"
              aria-label="설정"
            >
              <SettingsIcon size={18} />
            </button>
          )}
        </header>

        {/* ═══ Reward Banner ═══ */}
        {isRewardActive && (
          <div
            className="animate-fade-in mb-5 card rounded-xl px-5 py-3 text-center text-sm font-semibold text-earn"
            style={{
              borderColor: "rgba(52,211,153,0.2)",
              background: "rgba(52,211,153,0.06)",
            }}
          >
            <Zap size={14} className="inline mr-1.5 -mt-0.5" />
            일일 목표 달성! 자유시간 활성화
          </div>
        )}

        {/* ═══ Hero Section ═══ */}
        <section
          className="mb-6 animate-fade-in"
          style={{ animationDelay: "0.05s" }}
        >
          <div
            className="card-hero rounded-2xl p-6"
            style={{
              borderColor: currentTask ? "rgba(232,185,49,0.15)" : undefined,
            }}
          >
            <div className="flex items-stretch gap-8">
              {/* Left: Money-first Hero */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <span className="section-label-sm mb-1">오늘 획득</span>
                <h1
                  className="text-5xl font-bold text-gold-gradient leading-none font-tnum mb-3"
                  style={SORA}
                  aria-label={`오늘 획득 금액 ${formatMoney(animatedEarned)}`}
                >
                  {formatMoney(animatedEarned)}
                </h1>

                <div className="flex items-baseline gap-3 mb-5">
                  <span
                    className="text-xl font-light text-text-secondary font-tnum"
                    style={MONO}
                  >
                    {currentTime}
                  </span>
                  <span className="text-sm text-text-muted">
                    {formattedDate}
                  </span>
                </div>

                <div
                  className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
                  style={MONO}
                  aria-live="polite"
                >
                  <span
                    className="flex items-center gap-1.5 text-gold-400 font-tnum"
                    aria-label={`집중 시간 ${formatTime(animatedFocusTime)}`}
                  >
                    <Clock size={14} className="opacity-60" />
                    <span className="font-semibold">
                      {formatTime(animatedFocusTime)}
                    </span>
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-loss font-tnum"
                    aria-label={`손실 금액 ${formatMoney(animatedLost)}`}
                  >
                    <TrendingDown size={14} className="opacity-60" />
                    <span className="font-semibold">
                      {formatMoney(animatedLost)}
                    </span>
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-text-secondary font-tnum"
                    aria-label={`완료 작업 ${completedCount}개 중 ${tasks.length}개`}
                  >
                    <CheckCircle2 size={14} className="opacity-60" />
                    <span className="font-semibold">
                      {completedCount} / {tasks.length}
                    </span>
                  </span>
                </div>
              </div>

              {/* Right: Arc + Task */}
              <div className="w-[220px] flex flex-col items-center justify-center flex-shrink-0">
                <ProgressArc
                  progress={arcProgress}
                  hours={arcHours}
                  minutes={arcMinutes}
                  goalHours={settings.dailyGoal.hours}
                />
                <div className="mt-3 text-center w-full">
                  {currentTask ? (
                    <>
                      <p className="text-sm font-medium text-text-primary truncate mb-2 px-2">
                        {currentTask.title}
                      </p>
                      <button
                        onClick={stopTask}
                        className="btn btn-danger btn-sm mx-auto"
                        aria-label="작업 중지"
                      >
                        <Square size={10} fill="currentColor" /> 중지
                      </button>
                    </>
                  ) : tasks.length > 0 ? (
                    <p className="text-xs text-text-muted">작업을 시작하세요</p>
                  ) : (
                    <p className="text-xs text-text-muted">
                      오늘 하루를 가치 있게
                      <br />
                      만들어보세요
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Goals Strip ═══ */}
        <section
          className="grid grid-cols-2 gap-4 mb-6 animate-fade-in"
          style={{ animationDelay: "0.08s" }}
        >
          <GoalCard
            icon={<Clock size={14} />}
            label="집중 시간"
            current={`${Math.floor(activeFocusTime / 3600)}h ${Math.floor(
              (activeFocusTime % 3600) / 60,
            )}m`}
            target={`${settings.dailyGoal.hours}h`}
            progress={goalHoursProgress}
            color="#e8b931"
          />
          <GoalCard
            icon={<CheckCircle2 size={14} />}
            label="작업 완료"
            current={`${completedCount}개`}
            target={`${settings.dailyGoal.tasks}개`}
            progress={goalTasksProgress}
            color="#34d399"
          />
        </section>

        {/* ═══ Tasks Section ═══ */}
        <section
          className="mb-6 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <SectionTitle icon={<Target size={14} />} text="오늘 할 일" />

          {/* Add Task */}
          <div className="card rounded-xl px-4 py-3 mb-3">
            <div className="flex gap-2.5 items-center">
              <input
                ref={taskInputRef}
                type="text"
                placeholder="새 작업 입력... (Enter로 추가)"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                className="input-base flex-1 px-3 py-2 text-sm"
                aria-label="새 작업 제목"
              />
              <input
                type="number"
                value={newTaskMinTime}
                onChange={(e) => setNewTaskMinTime(Number(e.target.value))}
                min={5}
                step={5}
                className="input-base w-16 px-2 py-2 text-xs text-center"
                style={MONO}
                aria-label="목표 시간 (분)"
              />
              <span className="text-xs text-text-muted">분</span>
              <button
                onClick={handleAddTask}
                className="btn btn-gold btn-sm"
                aria-label="작업 추가"
              >
                <Plus size={14} /> 추가
              </button>
            </div>
          </div>

          {/* Task Items */}
          <div className="space-y-2" role="list" aria-label="작업 목록">
            {tasks.map((task) => {
              const isActive = currentSession.taskId === task.id;
              return (
                <div
                  key={task.id}
                  role="listitem"
                  className={`card card-interactive rounded-xl px-4 py-3 ${
                    justCompletedId === task.id ? "animate-task-complete" : ""
                  }`}
                  style={{
                    borderColor: isActive
                      ? "rgba(232,185,49,0.25)"
                      : undefined,
                    opacity: task.isCompleted ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="flex-shrink-0 cursor-pointer bg-transparent border-none p-0"
                      aria-label={task.isCompleted ? "완료됨" : "완료하기"}
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 size={18} className="text-earn" />
                      ) : (
                        <div
                          className="w-[18px] h-[18px] rounded-full"
                          style={{
                            border: "2px solid var(--color-surface-border)",
                          }}
                        />
                      )}
                    </button>

                    {/* Title — double-click to edit */}
                    <div className="flex-1 min-w-0">
                      {editingTaskId === task.id ? (
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit();
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          onBlur={handleSaveEdit}
                          autoFocus
                          className="input-base w-full px-2 py-0.5 text-sm font-medium"
                        />
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            task.isCompleted
                              ? "line-through text-text-muted"
                              : "text-text-primary cursor-text"
                          }`}
                          onDoubleClick={() => handleStartEdit(task)}
                          title={
                            task.isCompleted ? undefined : "더블클릭하여 수정"
                          }
                        >
                          {task.title}
                        </span>
                      )}
                    </div>

                    {/* Time */}
                    <span
                      className="text-xs text-text-muted flex-shrink-0"
                      style={MONO}
                    >
                      {formatTime(task.totalTime)}
                      <span className="text-text-muted/50">
                        {" "}
                        / {task.minTime}분
                      </span>
                    </span>

                    {/* Actions */}
                    {!task.isCompleted && !currentSession.isActive && (
                      <button
                        onClick={() => startTask(task.id)}
                        className="btn btn-gold btn-sm"
                        aria-label="시작"
                      >
                        <Play size={10} fill="currentColor" /> 시작
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(task.id)}
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
              <div className="card rounded-xl px-6 py-10 text-center">
                <div
                  className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(232,185,49,0.06)",
                    border: "1px solid rgba(232,185,49,0.12)",
                  }}
                >
                  <Target size={24} className="text-gold-400" />
                </div>
                <p className="text-base font-semibold text-text-primary mb-1">
                  오늘 하루를 가치 있게
                </p>
                <p className="text-sm text-text-muted mb-5">
                  작업을 추가하고 집중 시간을 추적하세요
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => addTask({ title: "독서", minTime: 30 })}
                    className="btn btn-gold btn-sm"
                  >
                    30분 독서
                  </button>
                  <button
                    onClick={() => addTask({ title: "코딩", minTime: 60 })}
                    className="btn btn-gold btn-sm"
                  >
                    1시간 코딩
                  </button>
                  <button
                    onClick={() => addTask({ title: "운동", minTime: 45 })}
                    className="btn btn-gold btn-sm"
                  >
                    45분 운동
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══ Weekly Chart ═══ */}
        <section
          className="animate-fade-in"
          style={{ animationDelay: "0.12s" }}
        >
          <div className="card rounded-xl p-5">
            <SectionTitle icon={<Clock size={14} />} text="주간 통계" compact />
            <div className="mt-4">
              <StatsChart dailyStatsMap={dailyStatsMap} />
            </div>
          </div>
        </section>
      </div>

      {/* ── Goal Celebration Overlay ── */}
      {showCelebration && (
        <div
          className="fixed inset-0 z-40 pointer-events-none animate-celebration"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                left: `${5 + ((i * 47) % 90)}%`,
                top: "-8px",
                width: `${6 + (i % 3) * 2}px`,
                height: `${6 + (i % 3) * 2}px`,
                background: [
                  "#fcd34d",
                  "#e8b931",
                  "#34d399",
                  "#fb7185",
                  "#d4a017",
                ][i % 5],
                animation: `confetti-fall ${1.5 + (i % 5) * 0.4}s ease-in ${
                  i * 0.06
                }s forwards`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-celebration-text">
              <div
                className="text-4xl font-bold text-gold-gradient mb-2"
                style={SORA}
              >
                목표 달성!
              </div>
              <p className="text-base text-text-secondary">
                자유시간이 활성화되었습니다
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Undo Toast ── */}
      {undoTask && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl animate-fade-in"
          style={{
            background: "var(--color-surface-elevated)",
            border: "1px solid var(--color-surface-border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <span className="text-sm text-text-secondary">
            <span className="text-text-primary font-medium">
              {undoTask.title}
            </span>{" "}
            삭제됨
          </span>
          <button onClick={handleUndo} className="btn btn-gold btn-sm">
            되돌리기
          </button>
          <button
            onClick={dismissUndo}
            className="text-text-muted hover:text-text-secondary transition-colors cursor-pointer bg-transparent border-none p-1 text-sm leading-none"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
