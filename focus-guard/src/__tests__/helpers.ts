import { useAppStore } from '@/shared/store';
import { clearMockStorage } from './setup';

export function resetStore() {
  useAppStore.setState(useAppStore.getInitialState());
  clearMockStorage();
}
