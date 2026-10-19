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
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <FileWarning className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="label-mono text-destructive">Parse error</span>
            <h3 className="mt-2 text-base font-semibold tracking-tight">
              This diagram has a syntax error
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Mermaid could not parse the code. Fix the highlighted line and the
              preview will update automatically.
            </p>

            <div className="mt-5 rounded-md border border-border bg-secondary/60 p-3.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="label-mono-sm text-muted-foreground">
                  Parser message
                </span>
                {typeof error.line === "number" && (
                  <span className="ml-auto rounded-sm bg-destructive/10 px-1.5 py-1 font-mono text-[10px] tracking-[0.1em] text-destructive">
                    LINE {error.line}
                    {typeof error.column === "number" ? `:${error.column}` : ""}
                  </span>
                )}
              </div>
              <p className="mt-2.5 break-words font-mono text-[11.5px] leading-relaxed text-foreground">
                {error.message}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {onBackToEditor && (
                <Button size="sm" onClick={onBackToEditor} className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" />
                  Back to editor
                </Button>
              )}
              {onLoadSample && (
                <Button size="sm" variant="secondary" onClick={onLoadSample}>
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
