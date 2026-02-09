import { useEffect, useState } from 'react';
import { useAppStore } from '../store';

/** chrome.storage에서 초기 로드 + 변경 감지 리스너 등록 */
export function useChromeSync(): { isLoading: boolean } {
  const loadFromStorage = useAppStore((s) => s.loadFromStorage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFromStorage().then(() => setIsLoading(false));
    const handler = () => { loadFromStorage(); };
    chrome.storage.onChanged.addListener(handler);
    return () => chrome.storage.onChanged.removeListener(handler);
  }, [loadFromStorage]);

  return { isLoading };
}
