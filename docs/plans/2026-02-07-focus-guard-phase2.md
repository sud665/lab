# Focus Guard Phase 2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Phase 2 미구현 기능 3개 완성 — 산만한 사이트 effect 모드, 보상 시스템, 통계 차트

**Architecture:** Content script가 background로부터 `SHOW_DISTRACTION_WARNING` 메시지를 수신하면 TopBar에 isDistracting 상태를 전달하고, store에 산만 시간을 누적한다. Store에 보상 로직과 DailyStats 집계 로직을 추가한다. Dashboard에 일간/주간 통계 섹션을 추가하고 recharts로 차트를 렌더링한다.

**Tech Stack:** React 19, Zustand, TypeScript, Tailwind CSS v4, Lucide React, Recharts (신규), date-fns

---

### Task 1: 산만한 사이트 effect 모드 — Content Script 메시지 수신

**Files:**
- Modify: `focus-guard/src/content/content.ts`

**Step 1: content.ts에 SHOW_DISTRACTION_WARNING 메시지 리스너 추가**

TopBar가 마운트된 컨테이너에 커스텀 이벤트를 dispatch하여 React 컴포넌트에 상태를 전달한다.

```typescript
// content.ts 끝에 추가 (console.log 위)
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SHOW_DISTRACTION_WARNING') {
    const { siteName } = message.payload;
    window.dispatchEvent(
      new CustomEvent('focus-guard-distraction', { detail: { siteName } })
    );
  }
});
```

**Step 2: 빌드 확인**

Run: `cd focus-guard && npm run build`
Expected: 빌드 성공, 에러 없음

**Step 3: Commit**

```bash
git add focus-guard/src/content/content.ts
git commit -m "feat(focus-guard): handle SHOW_DISTRACTION_WARNING in content script"
```

---

### Task 2: 산만한 사이트 effect 모드 — TopBar 빨간 바 + 손실 카운터

**Files:**
- Modify: `focus-guard/src/content/TopBar.tsx`

**Step 1: TopBar에 isDistracting 상태와 커스텀 이벤트 리스너 추가**

TODO 주석의 `const isDistracting = false;`를 실제 상태로 교체한다.

```tsx
// TopBar.tsx 변경사항
import { useEffect, useState, useCallback } from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

export function TopBar() {
  const { currentSession, tasks, settings } = useAppStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [isDistracting, setIsDistracting] = useState(false);
  const [distractingSiteName, setDistractingSiteName] = useState('');
  const [distractStartTime, setDistractStartTime] = useState<number | null>(null);
  const [distractElapsed, setDistractElapsed] = useState(0);

  const currentTask = tasks.find((t) => t.id === currentSession.taskId);

  // 산만한 사이트 감지 이벤트 리스너
  useEffect(() => {
    const handler = (e: Event) => {
      const { siteName } = (e as CustomEvent).detail;
      setIsDistracting(true);
      setDistractingSiteName(siteName);
      setDistractStartTime(Date.now());
    };
    window.addEventListener('focus-guard-distraction', handler);
    return () => window.removeEventListener('focus-guard-distraction', handler);
  }, []);

  // 기존 interval에 산만 시간 카운터 추가
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSession.isActive && currentSession.startTime) {
        const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
        setElapsedTime(currentTask ? currentTask.totalTime + elapsed : elapsed);
      }
      if (isDistracting && distractStartTime) {
        setDistractElapsed(Math.floor((Date.now() - distractStartTime) / 1000));
      }
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSession, currentTask, isDistracting, distractStartTime]);

  const lostMoney = calculateMoney(distractElapsed, settings.hourlyRate);
```

비활성 상태 바에도 산만 사이트 경고 표시:
```tsx
  if (isDistracting) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[999999] bg-red-600 animate-pulse text-white py-2 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingDown size={16} />
            <span className="font-semibold">⚠️ {distractingSiteName}에서 시간을 낭비하고 있습니다!</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono font-bold text-red-200">-{formatMoney(lostMoney)} 손실 중</span>
            <span className="font-mono">{formatTime(distractElapsed)}</span>
            <span className="font-mono">{currentTime}</span>
          </div>
        </div>
      </div>
    );
  }
```

기존 활성 바의 barClass 로직은 그대로 유지 (isDistracting이 true이면 위에서 이미 return).

**Step 2: 빌드 확인**

Run: `cd focus-guard && npm run build`
Expected: 빌드 성공

**Step 3: Commit**

```bash
git add focus-guard/src/content/TopBar.tsx
git commit -m "feat(focus-guard): show red warning bar with loss counter on distracting sites"
```

---

### Task 3: Store에 산만 시간 추적 + DailyStats 관리 로직 추가

**Files:**
- Modify: `focus-guard/src/shared/store/index.ts`
- Modify: `focus-guard/src/shared/utils/time.ts`

**Step 1: utils/time.ts에 getTodayKey 헬퍼 확인**

이미 `getTodayDateString()`이 있으므로 그대로 사용.

**Step 2: Store에 DailyStats 업데이트 로직 + 보상 체크 action 추가**

```typescript
// AppState interface에 추가
recordDistractTime: (seconds: number) => void;
updateDailyStats: () => void;
checkAndGrantReward: () => void;
getDailyStats: () => DailyStats;
```

store의 dailyStats를 `Record<string, DailyStats>` 형태로 변경하여 날짜별 보관:

```typescript
// store state 변경
dailyStatsMap: Record<string, DailyStats>;  // dailyStats: DailyStats | null → 이것으로 교체
```

`getDailyStats()` — 오늘 날짜의 stats를 반환 (없으면 초기값 생성):
```typescript
getDailyStats: () => {
  const today = getTodayDateString();
  const { dailyStatsMap, tasks } = get();
  const stats = dailyStatsMap[today];
  if (stats) return stats;
  const totalFocusTime = tasks.reduce((sum, t) => sum + t.totalTime, 0);
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  return {
    date: today,
    totalFocusTime,
    totalDistractTime: 0,
    earnedMoney: calculateMoney(totalFocusTime, get().settings.hourlyRate),
    lostMoney: 0,
    completedTasks,
    tasks: [...tasks],
  };
},
```

`updateDailyStats()` — 현재 tasks 상태를 기반으로 오늘 stats 갱신:
```typescript
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
```

`recordDistractTime(seconds)` — 산만 시간 누적:
```typescript
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
```

**Step 3: loadFromStorage / saveToStorage에서 dailyStats → dailyStatsMap 마이그레이션**

```typescript
// loadFromStorage 수정
const data = await chrome.storage.sync.get(['settings', 'currentSession', 'tasks', 'dailyStatsMap', 'rewardStatus']);
set({
  settings: (data.settings as UserSettings) || DEFAULT_SETTINGS,
  currentSession: (data.currentSession as CurrentSession) || get().currentSession,
  tasks: (data.tasks as Task[]) || [],
  dailyStatsMap: (data.dailyStatsMap as Record<string, DailyStats>) || {},
  rewardStatus: (data.rewardStatus as RewardStatus) || get().rewardStatus,
});

// saveToStorage 수정
const { settings, currentSession, tasks, dailyStatsMap, rewardStatus } = get();
await chrome.storage.sync.set({ settings, currentSession, tasks, dailyStatsMap, rewardStatus });
```

**Step 4: 빌드 확인**

Run: `cd focus-guard && npm run build`
Expected: 빌드 성공

**Step 5: Commit**

```bash
git add focus-guard/src/shared/store/index.ts
git commit -m "feat(focus-guard): add dailyStatsMap, recordDistractTime, updateDailyStats"
```

---

### Task 4: 보상 시스템 구현

**Files:**
- Modify: `focus-guard/src/shared/store/index.ts`

**Step 1: checkAndGrantReward 구현**

```typescript
checkAndGrantReward: () => {
  const { settings, tasks, rewardStatus, dailyStatsMap } = get();
  const today = getTodayDateString();
  const stats = dailyStatsMap[today];

  if (!stats) return;

  const goalHoursMet = stats.totalFocusTime >= settings.dailyGoal.hours * 3600;
  const goalTasksMet = stats.completedTasks >= settings.dailyGoal.tasks;

  if (goalHoursMet || goalTasksMet) {
    // 오늘 자정까지 무제한 자유시간
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
    set({
      rewardStatus: {
        ...rewardStatus,
        unlimitedUntil: Math.max(rewardStatus.unlimitedUntil ?? 0, endOfDay),
      },
    });
  }

  // 초과 작업 보너스: 목표 초과 완료한 작업 × 60분
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
```

**Step 2: completeTask에서 checkAndGrantReward 호출**

```typescript
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
```

**Step 3: stopTask에서도 updateDailyStats 호출**

기존 `stopTask` 끝에 추가:
```typescript
get().updateDailyStats();
```

**Step 4: Background service worker에서 보상 상태 확인 후 산만 사이트 허용**

Modify: `focus-guard/src/background/service-worker.ts`

탭 업데이트 리스너에서 rewardStatus를 확인:
```typescript
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const result = await chrome.storage.sync.get(['settings', 'rewardStatus']);
    const settings = result.settings as UserSettings | undefined;
    const rewardStatus = result.rewardStatus as RewardStatus | undefined;

    // 보상으로 무제한 자유시간인 경우 통과
    if (rewardStatus?.unlimitedUntil && Date.now() < rewardStatus.unlimitedUntil) {
      return;
    }
    // 보너스 시간이 남아있는 경우 통과
    if (rewardStatus?.bonusMinutes && rewardStatus.bonusMinutes > 0) {
      return;
    }

    // 기존 산만 사이트 체크 로직 (동일)
    if (settings?.distractingSites) {
      // ... 기존 코드 그대로
    }
  }
});
```

**Step 5: 빌드 확인**

Run: `cd focus-guard && npm run build`
Expected: 빌드 성공

**Step 6: Commit**

```bash
git add focus-guard/src/shared/store/index.ts focus-guard/src/background/service-worker.ts
git commit -m "feat(focus-guard): implement reward system with daily goal and bonus time"
```

---

### Task 5: Dashboard에 손실 금액 표시 + 보상 상태 표시

**Files:**
- Modify: `focus-guard/src/newtab/Dashboard.tsx`

**Step 1: Dashboard에서 dailyStatsMap과 rewardStatus 사용**

```tsx
const { settings, tasks, currentSession, rewardStatus, dailyStatsMap,
        addTask, deleteTask, completeTask, startTask, loadFromStorage, getDailyStats } = useAppStore();

const todayStats = getDailyStats();
const isRewardActive = rewardStatus.unlimitedUntil !== null && Date.now() < rewardStatus.unlimitedUntil;
```

**Step 2: 통계 섹션에 손실 금액 카드 추가**

기존 "획득 금액" 카드 아래에:
```tsx
<div className="bg-red-900/50 rounded-lg p-6">
  <div className="flex items-center gap-2 mb-2">
    <TrendingDown size={20} className="text-red-400" />
    <div className="text-sm text-red-400">손실 금액</div>
  </div>
  <div className="text-3xl font-bold font-mono text-red-400">
    {formatMoney(todayStats.lostMoney)}
  </div>
  <div className="text-sm text-red-400/60 mt-1">
    산만 시간: {formatTime(todayStats.totalDistractTime)}
  </div>
</div>
```

**Step 3: 보상 상태 배너 추가 (현재 작업 섹션 위)**

```tsx
{isRewardActive && (
  <div className="max-w-6xl mx-auto mb-4">
    <div className="bg-green-900/50 border border-green-500/30 rounded-lg p-4 text-center">
      <span className="text-green-400 font-semibold">🎉 일일 목표 달성! 자유시간 활성화</span>
    </div>
  </div>
)}
```

**Step 4: import에 TrendingDown 추가**

```tsx
import { TrendingUp, TrendingDown, Plus, Check, Trash2 } from 'lucide-react';
```

**Step 5: 빌드 확인**

Run: `cd focus-guard && npm run build`
Expected: 빌드 성공

**Step 6: Commit**

```bash
git add focus-guard/src/newtab/Dashboard.tsx
git commit -m "feat(focus-guard): show lost money and reward status in dashboard"
```

---

### Task 6: recharts 의존성 추가 + 통계 차트 컴포넌트

**Files:**
- Create: `focus-guard/src/shared/components/StatsChart.tsx`

**Step 1: recharts 설치**

Run: `cd focus-guard && npm install recharts`

**Step 2: StatsChart 컴포넌트 작성**

7일간 집중시간 + 손실시간을 Bar 차트로 표시, 획득/손실 금액을 Area 차트로 표시.

```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DailyStats } from '../types';

interface StatsChartProps {
  dailyStatsMap: Record<string, DailyStats>;
}

export function StatsChart({ dailyStatsMap }: StatsChartProps) {
  // 최근 7일 데이터 생성
  const data = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const stats = dailyStatsMap[key];
    const dayLabel = `${date.getMonth() + 1}/${date.getDate()}`;
    return {
      name: dayLabel,
      집중: stats ? Math.round(stats.totalFocusTime / 60) : 0,
      산만: stats ? Math.round(stats.totalDistractTime / 60) : 0,
      획득: stats ? stats.earnedMoney : 0,
      손실: stats ? stats.lostMoney : 0,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">시간 (분)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#ffffff' }}
            />
            <Legend />
            <Bar dataKey="집중" fill="#FFD700" radius={[4, 4, 0, 0]} />
            <Bar dataKey="산만" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">금액 (₩)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#ffffff' }}
              formatter={(value: number) => `₩${value.toLocaleString('ko-KR')}`}
            />
            <Legend />
            <Bar dataKey="획득" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="손실" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

**Step 3: 빌드 확인**

Run: `cd focus-guard && npm run build`
Expected: 빌드 성공

**Step 4: Commit**

```bash
git add focus-guard/package.json focus-guard/package-lock.json focus-guard/src/shared/components/StatsChart.tsx
git commit -m "feat(focus-guard): add StatsChart component with recharts"
```

---

### Task 7: Dashboard에 주간 통계 차트 통합

**Files:**
- Modify: `focus-guard/src/newtab/Dashboard.tsx`

**Step 1: Dashboard에 StatsChart import 및 섹션 추가**

기존 2-column 그리드 아래에 full-width 차트 섹션 추가:

```tsx
import { StatsChart } from '../shared/components/StatsChart';

// ... 기존 코드 ...

{/* 2-column grid 닫힌 후 */}
<div className="max-w-6xl mx-auto mt-8">
  <h2 className="text-2xl font-bold mb-4">📈 주간 통계</h2>
  <div className="bg-slate-800 rounded-lg p-6">
    <StatsChart dailyStatsMap={dailyStatsMap} />
  </div>
</div>
```

**Step 2: useAppStore에서 dailyStatsMap 가져오기**

```tsx
const { ..., dailyStatsMap } = useAppStore();
```

**Step 3: 빌드 확인**

Run: `cd focus-guard && npm run build`
Expected: 빌드 성공

**Step 4: Commit**

```bash
git add focus-guard/src/newtab/Dashboard.tsx
git commit -m "feat(focus-guard): integrate weekly stats chart in dashboard"
```

---

### Task 8: Popup에 보상 상태 + 손실 금액 표시

**Files:**
- Modify: `focus-guard/src/popup/Popup.tsx`

**Step 1: Popup 통계에 손실 금액 + 보상 상태 추가**

```tsx
const { ..., rewardStatus, getDailyStats } = useAppStore();
const todayStats = getDailyStats();
const isRewardActive = rewardStatus.unlimitedUntil !== null && Date.now() < rewardStatus.unlimitedUntil;
```

Stats 섹션에 추가:
```tsx
<div className="flex justify-between">
  <span>손실 금액</span>
  <span className="font-mono text-red-400">{formatMoney(todayStats.lostMoney)}</span>
</div>
```

보상 배너 (상단):
```tsx
{isRewardActive && (
  <div className="bg-green-900/50 rounded-lg p-3 text-center">
    <span className="text-green-400 text-sm font-semibold">🎉 자유시간 활성화</span>
  </div>
)}
```

**Step 2: 빌드 확인**

Run: `cd focus-guard && npm run build`
Expected: 빌드 성공

**Step 3: Commit**

```bash
git add focus-guard/src/popup/Popup.tsx
git commit -m "feat(focus-guard): show reward status and lost money in popup"
```

---

### Task 9: TopBar에서 산만 시간을 store에 기록

**Files:**
- Modify: `focus-guard/src/content/TopBar.tsx`

**Step 1: 페이지 이탈(unload) 시 산만 시간을 store에 기록**

```tsx
// TopBar 내부에 추가
useEffect(() => {
  const handleBeforeUnload = () => {
    if (isDistracting && distractStartTime) {
      const seconds = Math.floor((Date.now() - distractStartTime) / 1000);
      if (seconds > 0) {
        // Chrome Storage에 직접 기록 (content script에서는 store 사용 어려움)
        chrome.storage.sync.get('dailyStatsMap', (data) => {
          const map = (data.dailyStatsMap as Record<string, any>) || {};
          const today = new Date().toISOString().split('T')[0];
          const existing = map[today] || { totalDistractTime: 0, lostMoney: 0 };
          map[today] = {
            ...existing,
            date: today,
            totalDistractTime: (existing.totalDistractTime || 0) + seconds,
            lostMoney: (existing.lostMoney || 0) + Math.floor((seconds / 3600) * settings.hourlyRate),
          };
          chrome.storage.sync.set({ dailyStatsMap: map });
        });
      }
    }
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isDistracting, distractStartTime, settings.hourlyRate]);
```

**Step 2: 빌드 확인**

Run: `cd focus-guard && npm run build`
Expected: 빌드 성공

**Step 3: Commit**

```bash
git add focus-guard/src/content/TopBar.tsx
git commit -m "feat(focus-guard): record distract time to storage on page unload"
```

---

### Task 10: 최종 빌드 검증 + 타입 수정

**Files:**
- Modify: `focus-guard/src/shared/types/index.ts` (StorageData 타입 업데이트)

**Step 1: StorageData 인터페이스 업데이트**

```typescript
export interface StorageData {
  settings: UserSettings;
  currentSession: CurrentSession;
  tasks: Task[];
  dailyStatsMap: Record<string, DailyStats>;
  rewardStatus: RewardStatus;
}
```

**Step 2: 전체 빌드 + 타입 체크**

Run: `cd focus-guard && npm run build`
Expected: tsc + vite build 모두 성공

**Step 3: Commit**

```bash
git add focus-guard/src/shared/types/index.ts
git commit -m "feat(focus-guard): update StorageData type for dailyStatsMap"
```
