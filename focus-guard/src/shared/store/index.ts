import { create } from 'zustand';
import type { CurrentSession, Task, UserSettings, DailyStats, RewardStatus } from '../types';

interface AppState {
  settings: UserSettings;
  currentSession: CurrentSession;
  tasks: Task[];
  dailyStats: DailyStats | null;
  rewardStatus: RewardStatus;

  // Actions
  setSettings: (settings: Partial<UserSettings>) => void;
  startTask: (taskId: string) => void;
  stopTask: () => void;
  completeTask: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'totalTime' | 'isCompleted'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
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
  dailyStats: null,
  rewardStatus: {
    unlimitedUntil: null,
    bonusMinutes: 0,
  },

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
      get().saveToStorage();
    }
  },

  completeTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: true, completedAt: Date.now() } : task
      ),
    }));
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

  loadFromStorage: async () => {
    try {
      const data = await chrome.storage.sync.get(['settings', 'currentSession', 'tasks', 'dailyStats', 'rewardStatus']);
      set({
        settings: (data.settings as UserSettings) || DEFAULT_SETTINGS,
        currentSession: (data.currentSession as CurrentSession) || get().currentSession,
        tasks: (data.tasks as Task[]) || [],
        dailyStats: (data.dailyStats as DailyStats) || null,
        rewardStatus: (data.rewardStatus as RewardStatus) || get().rewardStatus,
      });
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  },

  saveToStorage: async () => {
    try {
      const { settings, currentSession, tasks, dailyStats, rewardStatus } = get();
      await chrome.storage.sync.set({
        settings,
        currentSession,
        tasks,
        dailyStats,
        rewardStatus,
      });
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  },
}));
