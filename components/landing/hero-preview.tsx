"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";

import { DEFAULT_SETTINGS, buildMermaidConfig } from "@/lib/mermaid/config";
import { nextRenderId, renderDiagram } from "@/lib/mermaid/render";

const DEMO_SOURCE = `flowchart LR
    A[Paste Mermaid] --> B{Valid syntax?}
    B -->|Yes| C[Style it]
    B -->|No| D[See the error]
    C --> E[Export]`;

const EXPORT_ROWS = [
  { label: "SVG", note: "vector, print-ready", value: "∞" },
  { label: "PNG", note: "1× · 2× · 3×", value: "3×" },
  { label: "WebP", note: "compact, keeps alpha", value: "webp" },
  { label: "PDF", note: "A4, portrait or landscape", value: "A4" },
  { label: "Source", note: ".mmd, still editable", value: ".mmd" },
];

/**
 * The hero's result panel. It inverts with the theme, so on the dark page it
 * becomes a light card. The diagram itself always renders on a white canvas.
 * Spacing is kept tight so the hero fits one screen.
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
    <div className="chamfer-lg-tl-br bg-panel p-5 text-on-panel sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <span className="label-mono text-on-panel-muted">Live preview</span>
          <p className="mt-2 max-w-[15rem] text-[1.35rem] font-medium leading-tight tracking-tight text-on-panel/85">
            Your diagram, rendered as you type.
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="h-2 w-2 rounded-full bg-signal" />
            <span className="font-mono text-[2.25rem] font-medium leading-none tracking-tight text-on-panel">
              6
            </span>
          </div>
          <span className="label-mono-sm mt-1.5 block text-on-panel-muted">
            Export formats
          </span>
        </div>
      </div>

      {/* Divider with lime signal */}
      <div className="relative my-4 h-px w-full bg-panel-line">
        <span className="absolute left-0 top-1/2 h-[3px] w-16 -translate-y-1/2 rounded-full bg-signal" />
      </div>

      {/* The actual rendered diagram */}
      <div className="relative overflow-hidden rounded-md bg-white">
        <div className="grid-bg-dots absolute inset-0 opacity-70" aria-hidden />
        <div className="relative flex min-h-[170px] items-center justify-center p-4">
          {svg ? (
            <div
              className="mermaid-canvas [&_svg]:h-auto [&_svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#0c1a15]/60">
              {failed ? (
                <span>Preview unavailable</span>
              ) : (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Rendering
                </>
              )}
            </div>
          )}
        </div>
        {/* Always a dark chip, so it reads on the white diagram canvas */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-sm bg-black/80 px-2 py-1">
          <Check className="h-3 w-3 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white">
            Rendered locally
          </span>
        </div>
      </div>

      {/* Format rows */}
      <dl className="mt-4 space-y-2">
        {EXPORT_ROWS.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <dt className="text-[0.875rem] text-on-panel">
              <span className="font-medium">{row.label}</span>{" "}
              <span className="text-on-panel-muted">({row.note})</span>
            </dt>
            <dd className="font-mono text-[0.875rem] text-on-panel-muted">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
