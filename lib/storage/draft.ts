import type { DiagramSettings } from "@/types/diagram";

/** Key under which the working draft is stored locally. */
export const DRAFT_STORAGE_KEY = "mermaid-studio:draft:v1";

export interface StoredDraft {
  source: string;
  settings?: Partial<DiagramSettings>;
  savedAt: number;
}

/**
 * Read the locally-saved draft. Never throws — corrupt or unavailable storage
 * simply yields `null`. Diagram content is only ever kept on this device.
 */
export function readDraft(): StoredDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDraft;
    if (!parsed || typeof parsed.source !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeDraft(draft: StoredDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* storage full or blocked — autosave is best-effort */
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasDraft(): boolean {
  return readDraft() !== null;
}
