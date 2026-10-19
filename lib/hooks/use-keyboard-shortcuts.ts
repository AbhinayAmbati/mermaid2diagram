"use client";

import { useEffect } from "react";

export interface Shortcut {
  /** e.g. "mod+k", "mod+shift+e", "mod+enter" */
  combo: string;
  handler: (event: KeyboardEvent) => void;
  /** Allow the shortcut to fire while focus is inside an input/editor. */
  allowInEditable?: boolean;
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable ||
    target.closest(".cm-editor") !== null
  );
}

function matches(event: KeyboardEvent, combo: string): boolean {
  const parts = combo.toLowerCase().split("+");
  const key = parts[parts.length - 1];
  const needsMod = parts.includes("mod");
  const needsShift = parts.includes("shift");
  const needsAlt = parts.includes("alt");

  const mod = event.metaKey || event.ctrlKey;
  if (needsMod !== mod) return false;
  if (needsShift !== event.shiftKey) return false;
  if (needsAlt !== event.altKey) return false;

  return event.key.toLowerCase() === key;
}

/** Register a set of global keyboard shortcuts with a single effect. */
export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (!matches(event, shortcut.combo)) continue;
        if (!shortcut.allowInEditable && isEditable(event.target)) continue;
        event.preventDefault();
        shortcut.handler(event);
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcuts, enabled]);
}
