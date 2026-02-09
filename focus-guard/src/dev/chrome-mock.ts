/**
 * Chrome API Mock — localhost 웹 개발 모드에서 chrome.storage, chrome.runtime을 모킹
 * localStorage를 백엔드로 사용하여 새로고침해도 데이터 유지
 */

const STORAGE_PREFIX = 'fg-mock:';

const storage: Record<string, unknown> = {};

// localStorage에서 초기 데이터 로드
function loadFromLocalStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      try {
        storage[key.slice(STORAGE_PREFIX.length)] = JSON.parse(localStorage.getItem(key)!);
      } catch { /* ignore parse errors */ }
    }
  }
}

loadFromLocalStorage();

type StorageChangeListener = (changes: Record<string, { oldValue?: unknown; newValue?: unknown }>, areaName: string) => void;
const changeListeners: StorageChangeListener[] = [];

const mockChrome = {
  storage: {
    sync: {
      get: (keys: string | string[], callback?: (items: Record<string, unknown>) => void): Promise<Record<string, unknown>> => {
        const keyList = typeof keys === 'string' ? [keys] : keys;
        const result: Record<string, unknown> = {};
        for (const key of keyList) {
          if (key in storage) result[key] = storage[key];
        }
        if (callback) callback(result);
        return Promise.resolve(result);
      },
      set: (items: Record<string, unknown>, callback?: () => void): Promise<void> => {
        const changes: Record<string, { oldValue?: unknown; newValue?: unknown }> = {};
        for (const [key, value] of Object.entries(items)) {
          changes[key] = { oldValue: storage[key], newValue: value };
          storage[key] = value;
          localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        }
        // 리스너에게 변경 알림
        for (const listener of changeListeners) {
          listener(changes, 'sync');
        }
        if (callback) callback();
        return Promise.resolve();
      },
    },
    onChanged: {
      addListener: (listener: StorageChangeListener) => {
        changeListeners.push(listener);
      },
      removeListener: (listener: StorageChangeListener) => {
        const idx = changeListeners.indexOf(listener);
        if (idx >= 0) changeListeners.splice(idx, 1);
      },
    },
  },
  runtime: {
    getURL: (path: string) => `/${path}`,
    sendMessage: (message: unknown) => {
      console.log('[Chrome Mock] sendMessage:', message);
    },
    onMessage: {
      addListener: (_callback: (message: unknown) => void) => {
        console.log('[Chrome Mock] onMessage.addListener registered');
      },
      removeListener: () => {},
    },
  },
  notifications: {
    create: (options: unknown) => {
      console.log('[Chrome Mock] notification:', options);
    },
  },
  tabs: {
    onUpdated: {
      addListener: () => {},
      removeListener: () => {},
    },
  },
};

// window.chrome이 없을 때만 mock 주입 (크롬 익스텐션이 아닌 일반 브라우저)
if (typeof globalThis.chrome === 'undefined' || !globalThis.chrome?.storage) {
  (globalThis as Record<string, unknown>).chrome = mockChrome;
}

export {};
