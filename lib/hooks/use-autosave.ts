"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  clearDraft as clearStoredDraft,
  hasDraft as hasStoredDraft,
  readDraft,
  writeDraft,
  type StoredDraft,
} from "@/lib/storage/draft";

/**
 * Persist the working draft to localStorage (never to a server). The draft is
 * read once on mount and written on a debounce so typing stays smooth.
 */
export function useAutosave(
  payload: { source: string; settings: unknown },
  delay = 800
) {
  const [restored, setRestored] = useState<StoredDraft | null>(null);
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore once, after mount, to avoid SSR/hydration mismatches.
  useEffect(() => {
    setRestored(readDraft());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      writeDraft({
        source: payload.source,
        settings: payload.settings as StoredDraft["settings"],
        savedAt: Date.now(),
      });
    }, delay);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [payload.source, payload.settings, delay, ready]);

  const clearDraft = useCallback(() => {
    clearStoredDraft();
    setRestored(null);
  }, []);

  const hasDraft = useCallback(() => hasStoredDraft(), []);

  return { restored, ready, clearDraft, hasDraft };
}
