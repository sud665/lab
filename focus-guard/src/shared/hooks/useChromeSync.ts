import { useEffect } from 'react';
import { useAppStore } from '../store';

/** chrome.storage에서 초기 로드 + 변경 감지 리스너 등록 */
export function useChromeSync() {
  const loadFromStorage = useAppStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
    const handler = () => { loadFromStorage(); };
    chrome.storage.onChanged.addListener(handler);
    return () => chrome.storage.onChanged.removeListener(handler);
  }, [loadFromStorage]);
}
