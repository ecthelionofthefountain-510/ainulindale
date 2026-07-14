/**
 * Reading progress store. Tracks which works you've marked as read, persisted
 * locally so your bookshelf survives restarts. Simple on purpose — we can move
 * to SQLite later if the data grows.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'arda.reading.v1';

interface ReadingState {
  ready: boolean;
  readIds: Set<string>;
  isRead: (id: string) => boolean;
  toggle: (id: string) => void;
  readCount: number;
}

const ReadingContext = createContext<ReadingState | null>(null);

export function ReadingProvider({ children }: { children: React.ReactNode }) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setReadIds(new Set(JSON.parse(raw) as string[]));
      } catch {
        // First run or unreadable store — start empty.
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = useCallback((next: Set<string>) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next])).catch(() => {});
  }, []);

  const toggle = useCallback(
    (id: string) => {
      setReadIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const value = useMemo<ReadingState>(
    () => ({
      ready,
      readIds,
      isRead: (id: string) => readIds.has(id),
      toggle,
      readCount: readIds.size,
    }),
    [ready, readIds, toggle],
  );

  return <ReadingContext.Provider value={value}>{children}</ReadingContext.Provider>;
}

export function useReading(): ReadingState {
  const ctx = useContext(ReadingContext);
  if (!ctx) throw new Error('useReading must be used within ReadingProvider');
  return ctx;
}
