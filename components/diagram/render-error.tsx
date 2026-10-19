"use client";

import { AlertTriangle, FileWarning, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { RenderError as RenderErrorType } from "@/types/diagram";

export interface RenderErrorProps {
  error: RenderErrorType;
  onBackToEditor?: () => void;
  onLoadSample?: () => void;
}

/** Friendly, actionable error state shown when Mermaid cannot parse the source. */
export function RenderError({
  error,
  onBackToEditor,
  onLoadSample,
}: RenderErrorProps) {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-subtle">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <FileWarning className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold">This diagram has a syntax error</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Mermaid could not parse the code. Fix the highlighted line and the
              preview will update automatically.
            </p>

            <div className="mt-4 rounded-lg border border-border bg-secondary/60 p-3">
              <div className="flex items-center gap-2 text-2xs font-medium uppercase tracking-wider text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Parser message</span>
                {typeof error.line === "number" && (
                  <span className="ml-auto rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-[11px] text-destructive">
                    line {error.line}
                    {typeof error.column === "number" ? `:${error.column}` : ""}
                  </span>
                )}
              </div>
              <p className="mt-2 break-words font-mono text-xs leading-relaxed text-foreground">
                {error.message}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {onBackToEditor && (
                <Button size="sm" onClick={onBackToEditor} className="gap-1.5">
                  <Pencil className="h-4 w-4" />
                  Back to editor
                </Button>
              )}
              {onLoadSample && (
                <Button size="sm" variant="outline" onClick={onLoadSample}>
                  Load sample diagram
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
