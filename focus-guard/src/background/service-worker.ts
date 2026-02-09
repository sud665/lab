// Background service worker for Focus Guard

import type { UserSettings, RewardStatus, DailyStats } from '../shared/types';

const ICON_URL = 'public/icons/icon-48.png';

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SUGGEST_TASK') {
    const { text } = message.payload;

    // Show notification to suggest starting a task
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL(ICON_URL),
      title: 'Focus Guard',
      message: `"${text}" — 새 탭에서 작업으로 추가해보세요`,
    });
  }
});

// Listen for tab updates to detect distracting sites
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check reward status first
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

    if (settings?.distractingSites) {
      const isDistracting = settings.distractingSites.some((site) =>
        tab.url?.includes(site.url)
      );

      if (isDistracting) {
        const site = settings.distractingSites.find((s) => tab.url?.includes(s.url));

        if (site && site.action === 'redirect') {
          // Redirect to new tab
          chrome.tabs.update(tabId, {
            url: chrome.runtime.getURL('src/newtab/index.html'),
          });
        } else if (site && site.action === 'effect') {
          // Send message to content script to show warning
          chrome.tabs.sendMessage(tabId, {
            type: 'SHOW_DISTRACTION_WARNING',
            payload: { siteName: site.name },
          });
        }

        // 방해사이트 접속 알림
        if (settings.notifications?.enabled && settings.notifications?.distractionAlert) {
          chrome.notifications.create(`distraction-${Date.now()}`, {
            type: 'basic',
            iconUrl: chrome.runtime.getURL(ICON_URL),
            title: 'Focus Guard - 방해 사이트 감지',
            message: `${site?.name ?? '방해 사이트'}에 접속했습니다. 집중 모드로 돌아가세요!`,
          });
        }
      }
    }
  }
});

// 목표 달성 감지: storage 변경 리스너
chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== 'sync') return;

  // dailyStatsMap 변경 시 목표 달성 여부 확인
  if (changes.dailyStatsMap) {
    const result = await chrome.storage.sync.get(['settings']);
    const settings = result.settings as UserSettings | undefined;
    if (!settings?.notifications?.enabled || !settings?.notifications?.goalAchieved) return;

    const newStatsMap = changes.dailyStatsMap.newValue as Record<string, DailyStats> | undefined;
    const oldStatsMap = changes.dailyStatsMap.oldValue as Record<string, DailyStats> | undefined;
    if (!newStatsMap) return;

    const today = getTodayDateString();
    const newStats = newStatsMap[today];
    const oldStats = oldStatsMap?.[today];
    if (!newStats) return;

    const goalHours = settings.dailyGoal.hours;
    const goalTasks = settings.dailyGoal.tasks;

    // 시간 목표 달성 감지 (이전에는 미달성이었으나 지금 달성)
    const hoursNowMet = newStats.totalFocusTime >= goalHours * 3600;
    const hoursWasMet = oldStats ? oldStats.totalFocusTime >= goalHours * 3600 : false;
    if (hoursNowMet && !hoursWasMet) {
      chrome.notifications.create(`goal-hours-${today}`, {
        type: 'basic',
        iconUrl: chrome.runtime.getURL(ICON_URL),
        title: 'Focus Guard - 목표 달성!',
        message: `오늘의 집중 시간 목표 ${goalHours}시간을 달성했습니다! 수고하셨습니다!`,
      });
    }

    // 작업 목표 달성 감지
    const tasksNowMet = newStats.completedTasks >= goalTasks;
    const tasksWasMet = oldStats ? oldStats.completedTasks >= goalTasks : false;
    if (tasksNowMet && !tasksWasMet) {
      chrome.notifications.create(`goal-tasks-${today}`, {
        type: 'basic',
        iconUrl: chrome.runtime.getURL(ICON_URL),
        title: 'Focus Guard - 목표 달성!',
        message: `오늘의 작업 목표 ${goalTasks}개를 달성했습니다! 자유시간이 활성화됩니다!`,
      });
    }
  }
});

// 알림 클릭 시 새 탭 열기
chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('src/newtab/index.html'),
  });
  chrome.notifications.clear(notificationId);
});

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Keep service worker alive
setInterval(() => {
  console.log('Focus Guard: Service worker alive');
}, 20000);

console.log('Focus Guard: Background service worker loaded');
