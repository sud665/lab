import { useEffect, useState } from "react";
import { useAppStore } from "../../shared/store";
import { useChromeSync } from "../../shared/hooks/useChromeSync";
import { getCurrentTime } from "../../shared/utils/time";

export function usePopup() {
  const {
    settings,
    currentSession,
    tasks,
    rewardStatus,
    stopTask,
    getDailyStats,
  } = useAppStore();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [elapsedTime, setElapsedTime] = useState(0);

  const { isLoading } = useChromeSync();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
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

  const currentTask = tasks.find((t) => t.id === currentSession.taskId);
  const todayStats = getDailyStats();
  const isRewardActive =
    rewardStatus.unlimitedUntil !== null &&
    Date.now() < rewardStatus.unlimitedUntil;

  return {
    settings,
    currentSession,
    tasks,
    currentTime,
    elapsedTime,
    currentTask,
    todayStats,
    isRewardActive,
    isLoading,
    stopTask,
  };
}
