"use client";

import {
  Check,
  ChevronsDownUp,
  ChevronsUpDown,
  Copy,
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
        "flex h-11 shrink-0 items-center gap-2 border-b border-border px-3",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Mermaid Code</span>
        <Badge variant="outline" className="font-mono">
          mermaid
        </Badge>
      </div>

      {diagramType && diagramType !== "unknown" && (
        <Badge variant="soft" className="hidden sm:inline-flex">
          {diagramType}
        </Badge>
      )}

      <div className="ml-auto flex items-center gap-1">
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

        <Separator orientation="vertical" className="mx-1 h-5" />

        <TooltipButton label={copied ? "Copied" : "Copy code"}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onCopy}
            aria-label="Copy Mermaid code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" />
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

        <Separator orientation="vertical" className="mx-1 hidden h-5 md:block" />

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
              <ChevronsDownUp className="h-4 w-4" />
            ) : (
              <ChevronsUpDown className="h-4 w-4" />
            )}
          </Button>
        </TooltipButton>
      </div>
    </div>
  );
}
