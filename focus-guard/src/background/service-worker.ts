// Background service worker for Focus Guard

import type { UserSettings } from '../shared/types';

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SUGGEST_TASK') {
    const { text } = message.payload;

    // Show notification to suggest starting a task
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../public/icons/icon-48.png',
      title: 'Focus Guard',
      message: `"${text}" 작업을 시작할까요?`,
      buttons: [
        { title: '시작' },
        { title: '무시' },
      ],
    });
  }
});

// Listen for tab updates to detect distracting sites
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if the URL matches any distracting sites
    const result = await chrome.storage.sync.get('settings');
    const settings = result.settings as UserSettings | undefined;

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
      }
    }
  }
});

// Keep service worker alive
setInterval(() => {
  console.log('Focus Guard: Service worker alive');
}, 20000);

console.log('Focus Guard: Background service worker loaded');
