"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";

import { DEFAULT_SETTINGS, buildMermaidConfig } from "@/lib/mermaid/config";
import { nextRenderId, renderDiagram } from "@/lib/mermaid/render";

const BLUEPRINT_SOURCE = `flowchart LR
    subgraph Client
        UI[Next.js App Router]
        Store[Zustand store]
    end
    subgraph Edge
        CDN[CDN cache]
    end
    subgraph Services
        API[Export service]
        Worker[Render worker]
    end
    UI --> Store
    UI --> CDN
    CDN --> API
    API --> Worker`;

/**
 * A dark technical panel showing a real Mermaid render using Mermaid's dark
 * theme - the diagram itself becomes the blueprint artwork.
 */
export function BlueprintPanel() {
  const [svg, setSvg] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    renderDiagram({
      source: BLUEPRINT_SOURCE,
      config: buildMermaidConfig({
        ...DEFAULT_SETTINGS,
        theme: "dark",
        canvasBackground: "transparent",
        fontSize: 13,
      }),
      id: nextRenderId(),
    })
      .then((result) => {
        if (!cancelled) setSvg(result.svg);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden bg-panel">
      <div className="blueprint-grid absolute inset-0" aria-hidden />

      {/* Measurement marks, echoing a technical drawing */}
      <div className="absolute left-6 top-6 font-mono text-[11px] uppercase tracking-[0.18em] text-on-panel-muted/60">
        08
      </div>
      <div className="absolute bottom-6 left-6 h-16 w-px bg-panel-line" aria-hidden />
      <div className="absolute bottom-6 left-6 h-px w-16 bg-panel-line" aria-hidden />
      <div className="absolute bottom-6 right-6 font-mono text-[11px] uppercase tracking-[0.18em] text-on-panel-muted/60">
        13
      </div>

      <div className="relative flex h-full min-h-[420px] items-center justify-center p-10">
        {svg ? (
          <div
            className="mermaid-canvas [&_svg]:h-auto [&_svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-on-panel-muted">
            {failed ? (
              <span>Preview unavailable</span>
            ) : (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                Rendering
              </>
            )}
          </div>
        )}
      </div>

      <div className="absolute left-1/2 top-8 flex -translate-x-1/2 items-center gap-2 rounded-sm bg-black/30 px-3 py-1.5 backdrop-blur-sm">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Diagram rendered
        </span>
        <Check className="h-3.5 w-3.5 text-primary" />
      </div>
    </div>
  );
}
