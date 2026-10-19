"use client";

import * as React from "react";
import { Check, ClipboardCopy, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { buildSvgDocument } from "@/lib/mermaid/export-svg";
import { getExportFormat, runExport } from "@/lib/mermaid/export";
import { suggestOrientation } from "@/lib/mermaid/export-pdf";
import { useDiagramStore } from "@/lib/store/use-diagram-store";
import { copyToClipboard, formatBytes, toSafeFileName } from "@/lib/utils";
import type { ExportFormat, ExportOptions } from "@/types/export";

import { ExportFormatPicker, ExportOptionFields } from "./export-options";

export interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const svg = useDiagramStore((s) => s.svg);
  const source = useDiagramStore((s) => s.source);
  const svgWidth = useDiagramStore((s) => s.svgWidth);
  const svgHeight = useDiagramStore((s) => s.svgHeight);
  const diagramType = useDiagramStore((s) => s.diagramType);
  const fileName = useDiagramStore((s) => s.fileName);
  const exportBackground = useDiagramStore((s) => s.settings.exportBackground);

  const [options, setOptions] = React.useState<ExportOptions>({
    format: "svg",
    fileName,
    scale: 2,
    background: exportBackground,
    orientation: "landscape",
  });
  const [busy, setBusy] = React.useState(false);
  const [copied, setCopied] = React.useState<"svg" | "source" | null>(null);

  // Reset the dialog to sensible defaults each time it opens.
  React.useEffect(() => {
    if (!open) return;
    setOptions({
      format: "svg",
      fileName,
      scale: 2,
      background: exportBackground,
      orientation: suggestOrientation(svgWidth || 16, svgHeight || 9),
    });
    setCopied(null);
  }, [open, fileName, exportBackground, svgWidth, svgHeight]);

  const patch = (next: Partial<ExportOptions>) =>
    setOptions((prev) => ({ ...prev, ...next }));

  const hasDiagram = Boolean(svg);
  const meta = getExportFormat(options.format);
  const isSourceExport = options.format === "mmd";
  const disabled = !isSourceExport && !hasDiagram;

  const handleDownload = async () => {
    setBusy(true);
    try {
      const result = await runExport({ svg, source, options });
      if (result.ok && result.filename) {
        toast.success(`Downloaded ${result.filename}`, {
          description: result.bytes ? formatBytes(result.bytes) : undefined,
        });
        onOpenChange(false);
      } else {
        toast.error("Export failed", { description: result.error });
      }
    } catch (error) {
      toast.error("Export failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred.",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async (kind: "svg" | "source") => {
    const text = kind === "svg" ? buildSvgDocument(svg ?? "", "transparent") : source;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(kind);
      toast.success(
        kind === "svg" ? "SVG copied to clipboard." : "Mermaid source copied."
      );
      setTimeout(() => setCopied(null), 1600);
    } else {
      toast.error("Could not copy to clipboard.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <span className="label-mono text-muted-foreground">Export</span>
          <DialogTitle>Download your diagram</DialogTitle>
          <DialogDescription>
            Everything is generated in your browser — your diagram never leaves
            this device.
          </DialogDescription>
        </DialogHeader>

        {!hasDiagram && !isSourceExport && (
          <div className="rounded-md border border-border bg-secondary/60 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground">
            Render a valid diagram first — there is nothing to export yet. You
            can still download the Mermaid source.
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="export-filename" className="label-mono text-muted-foreground">
              File name
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="export-filename"
                value={options.fileName}
                onChange={(e) =>
                  patch({ fileName: toSafeFileName(e.target.value, "diagram") })
                }
                placeholder="mermaid-diagram"
                spellCheck={false}
              />
              <span className="shrink-0 border-b border-input pb-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                .{meta.extension}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="label-mono text-muted-foreground">Format</Label>
            <ExportFormatPicker
              value={options.format}
              onChange={(format: ExportFormat) => patch({ format })}
            />
          </div>

          <ExportOptionFields
            options={options}
            onChange={patch}
            diagramSize={{ width: svgWidth, height: svgHeight }}
          />

          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {diagramType && diagramType !== "unknown" && (
              <span>{diagramType} · </span>
            )}
            {hasDiagram
              ? `Source ${Math.round(svgWidth)} × ${Math.round(svgHeight)} px`
              : "No rendered diagram"}
          </p>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5"
              disabled={!hasDiagram}
              onClick={() => handleCopy("svg")}
            >
              {copied === "svg" ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <ClipboardCopy className="h-3.5 w-3.5" />
              )}
              Copy SVG
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5"
              disabled={!source.trim()}
              onClick={() => handleCopy("source")}
            >
              {copied === "source" ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <ClipboardCopy className="h-3.5 w-3.5" />
              )}
              Copy source
            </Button>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={busy || disabled} className="gap-1.5">
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            {busy ? "Generating" : "Download"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
