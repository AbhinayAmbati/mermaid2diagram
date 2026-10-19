"use client";

import {
  Check,
  Copy,
  PanelLeftClose,
  PanelLeftOpen,
  Redo2,
  RotateCcw,
  Undo2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipButton } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface EditorToolbarProps {
  diagramType: string;
  copied: boolean;
  collapsed: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onCopy: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleCollapse: () => void;
  className?: string;
}

/**
 * The toolbar is scoped as a container: as the split is dragged narrow the
 * title truncates first, then the badges drop away, but the action icons are
 * never pushed out of view.
 */
export function EditorToolbar({
  diagramType,
  copied,
  collapsed,
  onCopy,
  onClear,
  onUndo,
  onRedo,
  onToggleCollapse,
  className,
}: EditorToolbarProps) {
  return (
    <div
      className={cn(
        "toolbar-scope flex h-12 shrink-0 items-center gap-2 border-b border-border px-4",
        className
      )}
    >
      <span className="label-mono min-w-0 flex-1 truncate text-muted-foreground">
        Mermaid Code
      </span>

      <Badge variant="outline" className="toolbar-optional-1 shrink-0">
        mermaid
      </Badge>

      {diagramType && diagramType !== "Unknown" && (
        <Badge variant="soft" className="toolbar-optional-2 shrink-0">
          {diagramType}
        </Badge>
      )}

      <div className="flex shrink-0 items-center gap-0.5">
        <TooltipButton label="Undo (⌘Z)">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onUndo}
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipButton>
        <TooltipButton label="Redo (⌘⇧Z)">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRedo}
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipButton>

        <Separator orientation="vertical" className="mx-1.5 h-5" />

        <TooltipButton label={copied ? "Copied" : "Copy code"}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onCopy}
            aria-label="Copy Mermaid code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </TooltipButton>

        <TooltipButton label="Reset to sample">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClear}
            aria-label="Reset editor to the sample diagram"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </TooltipButton>

        <Separator orientation="vertical" className="mx-1.5 hidden h-5 md:block" />

        <TooltipButton
          label={collapsed ? "Expand editor" : "Collapse editor"}
          className="hidden md:block"
        >
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand editor panel" : "Collapse editor panel"}
            className="hidden md:inline-flex"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </TooltipButton>
      </div>
    </div>
  );
}
