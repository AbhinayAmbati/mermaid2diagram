"use client";

import { useEffect, useRef } from "react";

import { buildMermaidConfig } from "@/lib/mermaid/config";
import { nextRenderId, parseMermaidError, renderDiagram } from "@/lib/mermaid/render";
import { useDiagramStore } from "@/lib/store/use-diagram-store";

import { useDebouncedValue } from "./use-debounced-value";

/**
 * Owns the render lifecycle for the canvas.
 *
 * Two hazards are handled explicitly:
 *  1. Race conditions - Mermaid renders asynchronously, so we serialise every
 *     pass through a promise queue and tag each with a monotonic token. A pass
 *     whose token is stale by the time it resolves is discarded, so an old
 *     render can never overwrite a newer preview.
 *  2. Repeated renders - each pass gets a fresh element id and Mermaid's
 *     temporary DOM nodes are cleaned up (see render.ts), preventing duplicate
 *     SVG identifiers from accumulating.
 */
export function useMermaidRender(debounceMs = 350) {
  const source = useDiagramStore((s) => s.source);
  const settings = useDiagramStore((s) => s.settings);

  const debouncedSource = useDebouncedValue(source, debounceMs);
  const debouncedSettings = useDebouncedValue(settings, 150);

  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const tokenRef = useRef(0);

  useEffect(() => {
    const token = ++tokenRef.current;

    queueRef.current = queueRef.current
      .catch(() => undefined)
      .then(async () => {
        const store = useDiagramStore.getState();

        if (!debouncedSource.trim()) {
          store.clearRender();
          return;
        }

        // A newer pass was queued while we waited - let it win.
        if (token !== tokenRef.current) return;

        store.beginRender();

        try {
          const result = await renderDiagram({
            source: debouncedSource,
            config: buildMermaidConfig(debouncedSettings),
            id: nextRenderId(),
          });
          if (token !== tokenRef.current) return; // stale - discard
          useDiagramStore
            .getState()
            .resolveRender(
              result.svg,
              result.diagramType,
              result.width,
              result.height
            );
        } catch (error) {
          if (token !== tokenRef.current) return;
          useDiagramStore.getState().rejectRender(parseMermaidError(error));
        }
      });
  }, [debouncedSource, debouncedSettings]);
}
