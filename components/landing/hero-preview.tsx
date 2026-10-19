"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { DEFAULT_SETTINGS, buildMermaidConfig } from "@/lib/mermaid/config";
import { nextRenderId, renderDiagram } from "@/lib/mermaid/render";

const DEMO_SOURCE = `flowchart LR
    A[Paste Mermaid] --> B{Valid syntax?}
    B -->|Yes| C[Style it]
    B -->|No| D[See the error]
    C --> E[Export]`;

/**
 * The hero's live demonstration: real Mermaid source rendered by the very same
 * engine the editor uses (no mockup, no screenshot).
 */
export function HeroPreview() {
  const [svg, setSvg] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    renderDiagram({
      source: DEMO_SOURCE,
      config: buildMermaidConfig({ ...DEFAULT_SETTINGS, canvasBackground: "white" }),
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
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-pop">
      <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-2 font-mono text-2xs text-muted-foreground">
          diagram.mmd
        </span>
      </div>
      <div className="grid md:grid-cols-2">
        <pre className="overflow-x-auto border-b border-border bg-secondary/50 p-4 text-xs leading-relaxed md:border-b-0 md:border-r">
          <code className="font-mono text-foreground">{DEMO_SOURCE}</code>
        </pre>
        <div className="flex min-h-[220px] items-center justify-center bg-white p-4">
          {svg ? (
            <div
              className="mermaid-canvas [&_svg]:max-w-full [&_svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {failed ? (
                <span>Preview unavailable</span>
              ) : (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Rendering…
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
