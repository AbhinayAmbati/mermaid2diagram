"use client";

import * as React from "react";
import { ChevronDown, LayoutTemplate } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TEMPLATES, type MermaidTemplate } from "@/lib/examples/templates";
import { cn } from "@/lib/utils";

export interface ExamplesMenuProps {
  onSelect: (template: MermaidTemplate) => void;
  className?: string;
  /** Compact icon-only trigger for tight toolbars. */
  compact?: boolean;
  align?: "start" | "end";
  /** Renders the trigger for the dark navigation pill. */
  onNav?: boolean;
}

/** Grouped dropdown of every built-in Mermaid template. */
export function ExamplesMenu({
  onSelect,
  className,
  compact = false,
  align = "end",
  onNav = false,
}: ExamplesMenuProps) {
  const grouped = React.useMemo(() => {
    const map = new Map<string, MermaidTemplate[]>();
    for (const template of TEMPLATES) {
      const list = map.get(template.category) ?? [];
      list.push(template);
      map.set(template.category, list);
    }
    return Array.from(map.entries());
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon-sm" : "sm"}
          className={cn(
            "gap-1.5 rounded-pill",
            onNav && "text-nav-muted hover:bg-nav-hover hover:text-nav-foreground",
            className
          )}
          aria-label="Examples"
        >
          <LayoutTemplate className="h-3.5 w-3.5" />
          {!compact && (
            <>
              <span className="hidden sm:inline">Examples</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="max-h-[70vh] w-[22rem] overflow-y-auto"
      >
        {grouped.map(([category, items], index) => (
          <React.Fragment key={category}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel>{category}</DropdownMenuLabel>
            {items.map((template) => (
              <DropdownMenuItem
                key={template.id}
                onSelect={() => onSelect(template)}
                className="flex-col items-start gap-0.5 py-2"
              >
                <span className="text-sm font-medium">{template.name}</span>
                <span className="text-xs text-muted-foreground">
                  {template.description}
                </span>
              </DropdownMenuItem>
            ))}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
