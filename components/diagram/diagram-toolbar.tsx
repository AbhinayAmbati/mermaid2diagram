"use client";

import {
  Copy,
  Grid3x3,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RotateCcw,
  Scan,
  Settings2,
  Check,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipButton } from "@/components/ui/tooltip";
import type { CanvasBackground } from "@/types/diagram";
import { cn } from "@/lib/utils";

export interface DiagramToolbarProps {
  zoomPercent: number;
  background: CanvasBackground;
  isFullscreen: boolean;
  copied: boolean;
  diagramType?: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onReset: () => void;
  onCycleBackground: () => void;
  onToggleFullscreen: () => void;
  onCopySvg: () => void;
  onOpenSettings: () => void;
  className?: string;
}

const BACKGROUND_LABEL: Record<CanvasBackground, string> = {
  white: "White background",
  transparent: "Transparent background",
  grid: "Grid background",
};

export function DiagramToolbar({
  zoomPercent,
  background,
  isFullscreen,
  copied,
  diagramType,
  onZoomIn,
  onZoomOut,
  onFit,
  onReset,
  onCycleBackground,
  onToggleFullscreen,
  onCopySvg,
  onOpenSettings,
  className,
}: DiagramToolbarProps) {
  return (
    <div
      className={cn(
        "flex h-11 shrink-0 items-center gap-1 border-b border-border px-3",
        className
      )}
    >
      <span className="text-sm font-medium">Preview</span>
      {diagramType && diagramType !== "unknown" && (
        <Badge variant="soft" className="ml-1 hidden sm:inline-flex">
          {diagramType}
        </Badge>
      )}

      <div className="ml-auto flex items-center gap-1">
        <TooltipButton label="Zoom out">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onZoomOut}
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </TooltipButton>

        <span
          className="w-12 select-none text-center font-mono text-xs tabular-nums text-muted-foreground"
          aria-live="polite"
        >
          {zoomPercent}%
        </span>

        <TooltipButton label="Zoom in">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onZoomIn}
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <TooltipButton label="Fit to screen">
          <Button variant="ghost" size="icon-sm" onClick={onFit} aria-label="Fit to screen">
            <Scan className="h-4 w-4" />
          </Button>
        </TooltipButton>

        <TooltipButton label="Reset zoom">
          <Button variant="ghost" size="icon-sm" onClick={onReset} aria-label="Reset zoom">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </TooltipButton>

        <TooltipButton label={BACKGROUND_LABEL[background]}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onCycleBackground}
            aria-label={`${BACKGROUND_LABEL[background]} — click to change`}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </TooltipButton>

        <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />

        <TooltipButton label={copied ? "SVG copied" : "Copy SVG"}>
          <Button variant="ghost" size="icon-sm" onClick={onCopySvg} aria-label="Copy SVG markup">
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </TooltipButton>

        <TooltipButton label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </TooltipButton>

        <TooltipButton label="Appearance settings">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenSettings}
            aria-label="Open appearance settings"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </TooltipButton>
      </div>
    </div>
  );
}
