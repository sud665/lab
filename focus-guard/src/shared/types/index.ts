export interface UserSettings {
  hourlyRate: number;
  mode: 'strict' | 'auto';
  distractingSites: DistractingSite[];
  dailyGoal: {
    hours: number;
    tasks: number;
  };
  weeklyGoal: {
    hours: number;
  };
}

export interface DistractingSite {
  url: string;
  name: string;
  action: 'redirect' | 'effect';
}

export interface Task {
  id: string;
  title: string;
  minTime: number;
  startedAt?: number;
  completedAt?: number;
  totalTime: number;
  isCompleted: boolean;
}

export interface CurrentSession {
  taskId: string | null;
  startTime: number | null;
  isActive: boolean;
  accumulatedTime: number;
}

export interface DailyStats {
  date: string;
  totalFocusTime: number;
  totalDistractTime: number;
  earnedMoney: number;
  lostMoney: number;
  completedTasks: number;
  tasks: Task[];
}

export interface RewardStatus {
  unlimitedUntil: number | null;
  bonusMinutes: number;
}

export interface StorageData {
  settings: UserSettings;
  currentSession: CurrentSession;
  tasks: Task[];
  dailyStatsMap: Record<string, DailyStats>;
  rewardStatus: RewardStatus;
}
