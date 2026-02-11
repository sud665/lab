import { useEffect, useState } from "react";
import {
  formatMoney,
  calculateMoney,
  getCurrentTime,
  getTodayDateString,
} from "../../shared/utils/time";
import { useAppStore } from "../../shared/store";

export function useTopBar() {
  const { currentSession, tasks, settings, loadFromStorage } = useAppStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [isDistracting, setIsDistracting] = useState(false);
  const [distractingSiteName, setDistractingSiteName] = useState("");
  const [distractStartTime, setDistractStartTime] = useState<number | null>(
    null,
  );
  const [distractElapsed, setDistractElapsed] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentTask = tasks.find((t) => t.id === currentSession.taskId);

  // collapsed 상태를 chrome.storage.local에서 복원
  useEffect(() => {
    chrome.storage.local.get("topBarCollapsed", (data) => {
      if (data.topBarCollapsed === true) setIsCollapsed(true);
    });
  }, []);

  const toggleCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    chrome.storage.local.set({ topBarCollapsed: collapsed });
  };

  // chrome.storage에서 초기 데이터 로드 + 변경 감지
  useEffect(() => {
    loadFromStorage();
    const handleStorageChange = () => {
      loadFromStorage();
    };
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, [loadFromStorage]);

  // 산만한 사이트 감지 이벤트 리스너
  useEffect(() => {
    const handler = (e: Event) => {
      const { siteName } = (e as CustomEvent).detail;
      setIsDistracting(true);
      setDistractingSiteName(siteName);
      setDistractStartTime(Date.now());
      setIsCollapsed(false);
      chrome.storage.local.set({ topBarCollapsed: false });
    };
    window.addEventListener("focus-guard-distraction", handler);
    return () =>
      window.removeEventListener("focus-guard-distraction", handler);
  }, []);

  // 타이머 interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSession.isActive && currentSession.startTime) {
        const elapsed = Math.floor(
          (Date.now() - currentSession.startTime) / 1000,
        );
        setElapsedTime(currentTask ? currentTask.totalTime + elapsed : elapsed);
      }
      if (isDistracting && distractStartTime) {
        setDistractElapsed(
          Math.floor((Date.now() - distractStartTime) / 1000),
        );
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
          const { dailyStatsMap } = useAppStore.getState();
          const today = getTodayDateString();
          const existing = dailyStatsMap[today] || {
            totalDistractTime: 0,
            lostMoney: 0,
            date: today,
          };
          const updated = {
            ...dailyStatsMap,
            [today]: {
              ...existing,
              date: today,
              totalDistractTime:
                (existing.totalDistractTime || 0) + seconds,
              lostMoney:
                (existing.lostMoney || 0) +
                Math.floor((seconds / 3600) * settings.hourlyRate),
            },
          };
          chrome.storage.sync.set({ dailyStatsMap: updated });
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDistracting, distractStartTime, settings.hourlyRate]);

  const lostMoney = calculateMoney(distractElapsed, settings.hourlyRate);
  const earnedMoney = currentSession.isActive
    ? calculateMoney(elapsedTime, settings.hourlyRate)
    : 0;

  // Collapsed pill data
  const dotClass = isDistracting
    ? "fg-dot fg-dot--danger"
    : currentSession.isActive && currentTask
      ? "fg-dot fg-dot--active"
      : "fg-dot fg-dot--idle";
  const pillClass = isDistracting
    ? "fg-pill--danger"
    : currentSession.isActive && currentTask
      ? "fg-pill--active"
      : "fg-pill--idle";
  const pillLabel = isDistracting
    ? `-${formatMoney(lostMoney)}`
    : currentSession.isActive && currentTask
      ? formatMoney(earnedMoney)
      : currentTime;

  // Active task progress
  const progress =
    currentTask && currentTask.minTime > 0
      ? Math.min((elapsedTime / (currentTask.minTime * 60)) * 100, 100)
      : 0;

  return {
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
  };
}
