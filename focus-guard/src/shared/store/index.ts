import { create } from 'zustand';
import type { CurrentSession, Task, UserSettings, DailyStats, RewardStatus } from '../types';
import { calculateMoney, getTodayDateString } from '../utils/time';
import { saveWithRetry } from '../utils/storage';

interface AppState {
  settings: UserSettings;
  currentSession: CurrentSession;
  tasks: Task[];
  dailyStatsMap: Record<string, DailyStats>;
  rewardStatus: RewardStatus;
  storageError: string | null;

  // Actions
  setSettings: (settings: Partial<UserSettings>) => void;
  startTask: (taskId: string) => void;
  stopTask: () => void;
  completeTask: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'totalTime' | 'isCompleted'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  restoreTask: (task: Task) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  clearStorageError: () => void;

  // Phase 2 Actions
  getDailyStats: () => DailyStats;
  updateDailyStats: () => void;
  recordDistractTime: (seconds: number) => void;
  checkAndGrantReward: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  hourlyRate: 20000,
  mode: 'strict',
  distractingSites: [
    { url: 'youtube.com/shorts', name: '유튜브 쇼츠', action: 'redirect' },
    { url: 'instagram.com', name: '인스타그램', action: 'effect' },
    { url: 'facebook.com', name: '페이스북', action: 'effect' },
  ],
  dailyGoal: {
    hours: 6,
    tasks: 3,
  },
  weeklyGoal: {
    hours: 30,
  },
  notifications: {
    enabled: true,
    sessionComplete: true,
    distractionAlert: true,
    goalAchieved: true,
  },
};

export const useAppStore = create<AppState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  currentSession: {
    taskId: null,
    startTime: null,
    isActive: false,
    accumulatedTime: 0,
  },
  tasks: [],
  dailyStatsMap: {},
  rewardStatus: {
    unlimitedUntil: null,
    bonusMinutes: 0,
  },
  storageError: null,

  clearStorageError: () => set({ storageError: null }),

  setSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
    get().saveToStorage();
  },

  startTask: (taskId) => {
    set({
      currentSession: {
        taskId,
        startTime: Date.now(),
        isActive: true,
        accumulatedTime: get().currentSession.accumulatedTime,
      },
    });
    get().saveToStorage();
  },

  stopTask: () => {
    const { currentSession, tasks } = get();
    if (currentSession.isActive && currentSession.taskId && currentSession.startTime) {
      const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
      const task = tasks.find((t) => t.id === currentSession.taskId);
      if (task) {
        get().updateTask(task.id, {
          totalTime: task.totalTime + elapsed,
        });
      }

      set({
        currentSession: {
          ...currentSession,
          isActive: false,
          startTime: null,
          accumulatedTime: currentSession.accumulatedTime + elapsed,
        },
      });
      get().updateDailyStats();
      get().saveToStorage();
    }
  },

  completeTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: true, completedAt: Date.now() } : task
      ),
    }));
    get().updateDailyStats();
    get().checkAndGrantReward();
    get().saveToStorage();
  },

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      totalTime: 0,
      isCompleted: false,
    };
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
    get().saveToStorage();
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
    get().saveToStorage();
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));
    get().saveToStorage();
  },

  restoreTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
    get().saveToStorage();
  },

  // Phase 2: DailyStats

  getDailyStats: () => {
    const today = getTodayDateString();
    const { dailyStatsMap, tasks, settings } = get();
    const stats = dailyStatsMap[today];
    if (stats) return stats;
    const totalFocusTime = tasks.reduce((sum, t) => sum + t.totalTime, 0);
    const completedTasks = tasks.filter((t) => t.isCompleted).length;
    return {
      date: today,
      totalFocusTime,
      totalDistractTime: 0,
      earnedMoney: calculateMoney(totalFocusTime, settings.hourlyRate),
      lostMoney: 0,
      completedTasks,
      tasks: [...tasks],
    };
  },

  updateDailyStats: () => {
    const today = getTodayDateString();
    const { tasks, settings, dailyStatsMap } = get();
    const existing = dailyStatsMap[today];
    const totalFocusTime = tasks.reduce((sum, t) => sum + t.totalTime, 0);
    const completedTasks = tasks.filter((t) => t.isCompleted).length;
    set({
      dailyStatsMap: {
        ...dailyStatsMap,
        [today]: {
          date: today,
          totalFocusTime,
          totalDistractTime: existing?.totalDistractTime ?? 0,
          earnedMoney: calculateMoney(totalFocusTime, settings.hourlyRate),
          lostMoney: existing?.lostMoney ?? 0,
          completedTasks,
          tasks: [...tasks],
        },
      },
    });
    get().saveToStorage();
  },

  recordDistractTime: (seconds) => {
    const today = getTodayDateString();
    const { dailyStatsMap, settings } = get();
    const existing = dailyStatsMap[today] || get().getDailyStats();
    set({
      dailyStatsMap: {
        ...dailyStatsMap,
        [today]: {
          ...existing,
          totalDistractTime: existing.totalDistractTime + seconds,
          lostMoney: existing.lostMoney + calculateMoney(seconds, settings.hourlyRate),
        },
      },
    });
    get().saveToStorage();
  },

  // Phase 2: Reward System

  checkAndGrantReward: () => {
    const { settings, rewardStatus, dailyStatsMap } = get();
    const today = getTodayDateString();
    const stats = dailyStatsMap[today];

    if (!stats) return;

    const goalHoursMet = stats.totalFocusTime >= settings.dailyGoal.hours * 3600;
    const goalTasksMet = stats.completedTasks >= settings.dailyGoal.tasks;

    if (goalHoursMet || goalTasksMet) {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
      set({
        rewardStatus: {
          ...rewardStatus,
          unlimitedUntil: Math.max(rewardStatus.unlimitedUntil ?? 0, endOfDay),
        },
      });
    }

    const extraTasks = Math.max(0, stats.completedTasks - settings.dailyGoal.tasks);
    if (extraTasks > 0) {
      set({
        rewardStatus: {
          ...get().rewardStatus,
          bonusMinutes: extraTasks * 60,
        },
      });
    }

    get().saveToStorage();
  },

  // Storage

  loadFromStorage: async () => {
    try {
      const data = await chrome.storage.sync.get(['settings', 'currentSession', 'tasks', 'dailyStatsMap', 'rewardStatus']);
      set({
        settings: (data.settings as UserSettings) || DEFAULT_SETTINGS,
        currentSession: (data.currentSession as CurrentSession) || get().currentSession,
        tasks: (data.tasks as Task[]) || [],
        dailyStatsMap: (data.dailyStatsMap as Record<string, DailyStats>) || {},
        rewardStatus: (data.rewardStatus as RewardStatus) || get().rewardStatus,
      });
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  },

  saveToStorage: async () => {
    try {
      const { settings, currentSession, tasks, dailyStatsMap, rewardStatus } = get();
      await saveWithRetry({
        settings,
        currentSession,
        tasks,
        dailyStatsMap,
        rewardStatus,
      });
      if (get().storageError) {
        set({ storageError: null });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '저장 중 알 수 없는 오류가 발생했습니다.';
      console.error('Failed to save to storage:', error);
      set({ storageError: message });
    }
  },
}));
