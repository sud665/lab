import { useEffect, useState, useRef } from "react";
import { useAppStore } from "../../shared/store";
import { useChromeSync } from "../../shared/hooks/useChromeSync";
import { useAnimatedNumber } from "../../shared/hooks/useAnimatedNumber";
import { calculateMoney, getCurrentTime } from "../../shared/utils/time";
import type { Task } from "../../shared/types";

function getFormattedDate(): string {
  const now = new Date();
  return now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export function useDashboard() {
  const {
    settings,
    tasks,
    currentSession,
    rewardStatus,
    dailyStatsMap,
    addTask,
    updateTask,
    deleteTask,
    restoreTask,
    completeTask,
    startTask,
    stopTask,
    getDailyStats,
  } = useAppStore();

  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [formattedDate, setFormattedDate] = useState(getFormattedDate());
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskMinTime, setNewTaskMinTime] = useState(30);
  const [elapsedTime, setElapsedTime] = useState(0);

  const { isLoading } = useChromeSync();

  // Timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
      setFormattedDate(getFormattedDate());
      if (currentSession.isActive && currentSession.startTime) {
        const task = tasks.find((t) => t.id === currentSession.taskId);
        const elapsed = Math.floor(
          (Date.now() - currentSession.startTime) / 1000,
        );
        setElapsedTime(task ? task.totalTime + elapsed : elapsed);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSession, tasks]);

  const todayStats = getDailyStats();
  const isRewardActive =
    rewardStatus.unlimitedUntil !== null &&
    Date.now() < rewardStatus.unlimitedUntil;
  const totalFocusTime = tasks.reduce((sum, task) => sum + task.totalTime, 0);
  const activeFocusTime = currentSession.isActive
    ? elapsedTime
    : totalFocusTime;
  const earnedMoney = calculateMoney(activeFocusTime, settings.hourlyRate);
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const currentTask = tasks.find((t) => t.id === currentSession.taskId);

  const animatedFocusTime = useAnimatedNumber(activeFocusTime, {
    duration: 400,
    snapThreshold: 30,
  });
  const animatedEarned = useAnimatedNumber(earnedMoney, { duration: 600 });
  const animatedLost = useAnimatedNumber(todayStats.lostMoney, {
    duration: 600,
  });

  const taskInputRef = useRef<HTMLInputElement>(null);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({ title: newTaskTitle, minTime: newTaskMinTime });
      setNewTaskTitle("");
      setNewTaskMinTime(30);
      setTimeout(() => taskInputRef.current?.focus(), 0);
    }
  };

  // Inline task editing
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleStartEdit = (task: Task) => {
    if (task.isCompleted) return;
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const handleSaveEdit = () => {
    if (editingTaskId && editingTitle.trim()) {
      updateTask(editingTaskId, { title: editingTitle.trim() });
    }
    setEditingTaskId(null);
    setEditingTitle("");
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle("");
  };

  // Undo delete
  const [undoTask, setUndoTask] = useState<Task | null>(null);
  const undoTimerRef =
    useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleDelete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    deleteTask(taskId);
    setUndoTask(task);
    undoTimerRef.current = setTimeout(() => setUndoTask(null), 5000);
  };

  const handleUndo = () => {
    if (!undoTask) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    restoreTask(undoTask);
    setUndoTask(null);
  };

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const dismissUndo = () => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoTask(null);
  };

  // Task completion glow
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  const handleComplete = (taskId: string) => {
    completeTask(taskId);
    setJustCompletedId(taskId);
    setTimeout(() => setJustCompletedId(null), 800);
  };

  // Goal celebration
  const [showCelebration, setShowCelebration] = useState(false);
  const prevRewardRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevRewardRef.current === false && isRewardActive) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
    prevRewardRef.current = isRewardActive;
  }, [isRewardActive]);

  // Goal progress
  const goalHoursProgress = Math.min(
    (activeFocusTime / (settings.dailyGoal.hours * 3600)) * 100,
    100,
  );
  const goalTasksProgress =
    tasks.length > 0
      ? Math.min((completedCount / settings.dailyGoal.tasks) * 100, 100)
      : 0;

  // Arc calculations
  const goalTotalSeconds = settings.dailyGoal.hours * 3600;
  const arcProgress = Math.min(activeFocusTime / goalTotalSeconds, 1);
  const arcHours = Math.floor(activeFocusTime / 3600);
  const arcMinutes = Math.floor((activeFocusTime % 3600) / 60);

  return {
    // Store data
    settings,
    tasks,
    currentSession,
    dailyStatsMap,
    addTask,
    startTask,
    stopTask,

    // Computed
    currentTime,
    formattedDate,
    todayStats,
    isRewardActive,
    activeFocusTime,
    earnedMoney,
    completedCount,
    currentTask,
    isLoading,

    // Animated
    animatedFocusTime,
    animatedEarned,
    animatedLost,

    // Task input
    taskInputRef,
    newTaskTitle,
    setNewTaskTitle,
    newTaskMinTime,
    setNewTaskMinTime,
    handleAddTask,

    // Inline editing
    editingTaskId,
    editingTitle,
    setEditingTitle,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,

    // Undo
    undoTask,
    handleDelete,
    handleUndo,
    dismissUndo,

    // Completion glow
    justCompletedId,
    handleComplete,

    // Celebration
    showCelebration,

    // Goals
    goalHoursProgress,
    goalTasksProgress,

    // Arc
    arcProgress,
    arcHours,
    arcMinutes,
  };
}
