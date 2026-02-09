import { vi } from 'vitest';
import '@testing-library/jest-dom';

// jsdom에 필요한 전역 mock
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // requestAnimationFrame / cancelAnimationFrame (jsdom에서 누락될 수 있음)
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
      return window.setTimeout(() => cb(Date.now()), 0);
    });
    window.cancelAnimationFrame = vi.fn((id: number) => {
      window.clearTimeout(id);
    });
  }
}

let storage: Record<string, unknown> = {};

const chromeMock = {
  storage: {
    sync: {
      get: vi.fn((keys: string[]) => {
        const result: Record<string, unknown> = {};
        for (const key of keys) {
          if (key in storage) {
            result[key] = storage[key];
          }
        }
        return Promise.resolve(result);
      }),
      set: vi.fn((items: Record<string, unknown>) => {
        Object.assign(storage, items);
        return Promise.resolve();
      }),
      clear: vi.fn(() => {
        storage = {};
        return Promise.resolve();
      }),
    },
    onChanged: { addListener: vi.fn(), removeListener: vi.fn() },
  },
  runtime: {
    sendMessage: vi.fn(),
    onMessage: { addListener: vi.fn(), removeListener: vi.fn() },
    getURL: vi.fn((path: string) => `chrome-extension://mock-id/${path}`),
  },
  tabs: {
    query: vi.fn(() => Promise.resolve([])),
    update: vi.fn(() => Promise.resolve()),
    create: vi.fn(() => Promise.resolve()),
    onActivated: { addListener: vi.fn(), removeListener: vi.fn() },
    onUpdated: { addListener: vi.fn(), removeListener: vi.fn() },
  },
  notifications: {
    create: vi.fn(),
    clear: vi.fn(),
  },
};

vi.stubGlobal('chrome', chromeMock);

export function clearMockStorage() {
  storage = {};
}

export function getMockStorage() {
  return { ...storage };
}
