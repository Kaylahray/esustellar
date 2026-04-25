import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTO_LOCK_KEY = 'esustellar_auto_lock_timeout';
export const AUTO_LOCK_OPTIONS = [
  { label: '1 min', value: 60 },
  { label: '5 min', value: 300 },
  { label: '15 min', value: 900 },
  { label: 'Never', value: 0 },
] as const;
export const DEFAULT_TIMEOUT = 300; // 5 minutes

export async function getAutoLockTimeout(): Promise<number> {
  const stored = await AsyncStorage.getItem(AUTO_LOCK_KEY);
  return stored !== null ? parseInt(stored, 10) : DEFAULT_TIMEOUT;
}

export async function setAutoLockTimeout(seconds: number): Promise<void> {
  await AsyncStorage.setItem(AUTO_LOCK_KEY, String(seconds));
}

/**
 * Monitors AppState changes and calls `onLock` when the app resumes
 * after being backgrounded longer than the configured timeout.
 */
export function useAutoLock(onLock: () => void) {
  const backgroundedAt = useRef<number | null>(null);

  useEffect(() => {
    const handleChange = async (next: AppStateStatus) => {
      if (next === 'background' || next === 'inactive') {
        backgroundedAt.current = Date.now();
      } else if (next === 'active' && backgroundedAt.current !== null) {
        const timeout = await getAutoLockTimeout();
        if (timeout === 0) return; // Never
        const elapsed = (Date.now() - backgroundedAt.current) / 1000;
        if (elapsed >= timeout) onLock();
        backgroundedAt.current = null;
      }
    };

    const sub = AppState.addEventListener('change', handleChange);
    return () => sub.remove();
  }, [onLock]);
}
