"use client";

import { FileCode2, FileImage, FileText, FileType2, ImageDown } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPORT_FORMATS } from "@/lib/mermaid/export";
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
              "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
              active
                ? "border-primary bg-accent"
                : "border-border bg-card hover:bg-secondary"
            )}
          >
            <span className="flex items-center gap-2">
              <Icon
                className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")}
              />
              <span className="text-sm font-medium">{format.label}</span>
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
      <Label className="text-xs font-normal text-muted-foreground">{label}</Label>
      <div className="inline-flex w-full rounded-lg border border-border bg-secondary p-0.5">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              value === option.value
                ? "bg-background text-foreground shadow-subtle"
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
    <div className="space-y-4">
      {meta.supportsBackground && (
        <Segmented<ExportBackground>
          label="Background"
          value={options.background}
          onChange={(value) => onChange({ background: value })}
          options={[
            { value: "white", label: "White" },
            { value: "transparent", label: "Transparent" },
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
            <p className="text-2xs text-muted-foreground">
              Output:{" "}
              <span className="font-mono">
                {Math.round(diagramSize.width * options.scale)} ×{" "}
                {Math.round(diagramSize.height * options.scale)} px
              </span>
            </p>
          )}
        </>
      )}

      {meta.supportsOrientation && (
        <div className="space-y-2">
          <Label htmlFor="pdf-orientation" className="text-xs font-normal text-muted-foreground">
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
