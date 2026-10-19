"use client";

import * as React from "react";

import {
  Check,
  FileCode2,
  FileImage,
  FileText,
  FileType2,
  Image as ImageIcon,
  ImageDown,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPORT_FORMATS } from "@/lib/mermaid/export";
import { makeStandaloneSvg } from "@/lib/mermaid/sanitize";
import { cn } from "@/lib/utils";
import type {
  ExportBackground,
  ExportFormat,
  ExportOptions,
  PdfOrientation,
} from "@/types/export";

const FORMAT_ICONS: Record<ExportFormat, React.ComponentType<{ className?: string }>> = {
  svg: FileCode2,
  png: ImageDown,
  webp: ImageIcon,
  jpeg: FileImage,
  pdf: FileText,
  mmd: FileType2,
};

export function ExportFormatPicker({
  value,
  onChange,
}: {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Export format"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3"
    >
      {EXPORT_FORMATS.map((format) => {
        const Icon = FORMAT_ICONS[format.id];
        const active = value === format.id;
        return (
          <button
            key={format.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(format.id)}
            className={cn(
              "relative flex flex-col gap-1.5 rounded-md border p-3 text-left transition-colors",
              active
                ? "border-foreground bg-accent"
                : "border-border bg-card hover:border-muted-foreground/40"
            )}
          >
            {active && (
              <Check className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-accent-foreground" />
            )}
            <span className="flex items-center gap-2">
              <Icon
                className={cn(
                  "h-3.5 w-3.5",
                  active ? "text-accent-foreground" : "text-muted-foreground"
                )}
              />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em]">
                {format.label}
              </span>
            </span>
            <span className="text-2xs leading-snug text-muted-foreground">
              {format.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="label-mono text-muted-foreground">{label}</Label>
      <div className="inline-flex w-full rounded-sm border border-border bg-secondary p-0.5">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              "flex-1 rounded-sm px-2 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] transition-colors",
              value === option.value
                ? "bg-card text-foreground shadow-subtle"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export interface ExportOptionFieldsProps {
  options: ExportOptions;
  onChange: (patch: Partial<ExportOptions>) => void;
  /** Intrinsic diagram size, used to show the resulting raster dimensions. */
  diagramSize?: { width: number; height: number };
}

export function ExportOptionFields({
  options,
  onChange,
  diagramSize,
}: ExportOptionFieldsProps) {
  const meta = EXPORT_FORMATS.find((f) => f.id === options.format)!;

  return (
    <div className="space-y-5">
      {meta.supportsBackground && (
        <Segmented<ExportBackground>
          label="Background"
          value={options.background}
          onChange={(value) => onChange({ background: value })}
          options={[
            { value: "white", label: "White" },
            { value: "transparent", label: "Clear" },
            { value: "dark", label: "Dark" },
          ]}
        />
      )}

      {meta.supportsScale && (
        <>
          <Segmented<1 | 2 | 3>
            label="Resolution"
            value={options.scale}
            onChange={(value) => onChange({ scale: value })}
            options={[
              { value: 1, label: "1×" },
              { value: 2, label: "2×" },
              { value: 3, label: "3×" },
            ]}
          />
          {diagramSize && diagramSize.width > 0 && (
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Output{" "}
              <span className="text-foreground">
                {Math.round(diagramSize.width * options.scale)} ×{" "}
                {Math.round(diagramSize.height * options.scale)} px
              </span>
            </p>
          )}
        </>
      )}

      {meta.supportsOrientation && (
        <div className="space-y-2">
          <Label htmlFor="pdf-orientation" className="label-mono text-muted-foreground">
            Page orientation
          </Label>
          <Select
            value={options.orientation}
            onValueChange={(value) =>
              onChange({ orientation: value as PdfOrientation })
            }
          >
            <SelectTrigger id="pdf-orientation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

const PREVIEW_BACKGROUND: Record<ExportBackground, string | undefined> = {
  white: "#ffffff",
  dark: "#0c1a15",
  transparent: undefined,
};

const CHECKERBOARD =
  "conic-gradient(#e2e5de 25%, transparent 0 50%, #e2e5de 0 75%, transparent 0)";

/**
 * A live preview of the exported diagram, showing the currently selected
 * background so the choice is visible before downloading.
 *
 * The SVG is rendered through an `<img>`, which makes it an isolated document:
 * no element ids are duplicated from the live canvas, and the result matches
 * how the raster exporters will draw it.
 */
export function ExportPreview({
  svg,
  background,
}: {
  svg: string | null;
  background: ExportBackground;
}) {
  const src = React.useMemo(
    () =>
      svg
        ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(makeStandaloneSvg(svg))}`
        : null,
    [svg]
  );

  if (!src) return null;

  return (
    <div className="space-y-2">
      <Label className="label-mono text-muted-foreground">Preview</Label>
      <div
        className="relative h-[200px] w-full overflow-hidden rounded-md border border-border"
        style={{ background: PREVIEW_BACKGROUND[background] }}
      >
        {background === "transparent" && (
          <div
            className="absolute inset-0"
            style={{ backgroundImage: CHECKERBOARD, backgroundSize: "16px 16px" }}
            aria-hidden
          />
        )}
        <div className="relative flex h-full w-full items-center justify-center p-5">
          <img
            src={src}
            alt="Preview of the exported diagram"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
