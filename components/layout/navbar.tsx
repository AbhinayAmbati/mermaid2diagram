"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Download, FilePlus2 } from "lucide-react";

import { BrandLockup } from "@/components/layout/logo";
import { ExamplesMenu } from "@/components/examples/examples-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Separator } from "@/components/ui/separator";
import { TooltipButton } from "@/components/ui/tooltip";
import { DEFAULT_SOURCE, type MermaidTemplate } from "@/lib/examples/templates";
import { useDiagramStore } from "@/lib/store/use-diagram-store";

export interface NavbarProps {
  onOpenExport: () => void;
  /** Invoked after a new diagram is created (e.g. to clear the saved draft). */
  onNewDiagram?: () => void;
}

/**
 * The editor's navigation bar.
 *
 * Unlike the landing page's floating pill, this is a standard full-width bar
 * whose surface follows the active theme, so it reads as part of the editor
 * rather than floating above it: white with the light theme, near-black with
 * the dark theme.
 */
export function Navbar({ onOpenExport, onNewDiagram }: NavbarProps) {
  const source = useDiagramStore((s) => s.source);
  const reset = useDiagramStore((s) => s.reset);
  const setSource = useDiagramStore((s) => s.setSource);
  const setFileName = useDiagramStore((s) => s.setFileName);

  const [confirmNew, setConfirmNew] = React.useState(false);

  const isDirty = source.trim() !== DEFAULT_SOURCE.trim();

  const createNew = React.useCallback(() => {
    reset();
    onNewDiagram?.();
  }, [reset, onNewDiagram]);

  const handleNew = () => {
    if (isDirty) {
      setConfirmNew(true);
    } else {
      createNew();
    }
  };

  const handleExample = (template: MermaidTemplate) => {
    setSource(template.code);
    setFileName(`mermaid-${template.id}`);
  };

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-3 sm:px-4">
      <Link
        href="/"
        className="flex items-center rounded-md py-1 pl-1 pr-2 transition-opacity hover:opacity-80"
      >
        <BrandLockup />
        <Badge variant="outline" className="ml-2.5 hidden sm:inline-flex">
          Beta
        </Badge>
      </Link>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNew}
          className="gap-1.5"
        >
          <FilePlus2 className="h-3.5 w-3.5" />
          <span className="hidden md:inline">New</span>
        </Button>

        <ExamplesMenu onSelect={handleExample} />

        <TooltipButton label="Mermaid documentation">
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            aria-label="Open Mermaid documentation"
          >
            <a
              href="https://mermaid.js.org/intro/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <BookOpen className="h-4 w-4" />
            </a>
          </Button>
        </TooltipButton>

        <ThemeToggle />

        <Separator orientation="vertical" className="mx-1.5 h-5" />

        <Button size="sm" onClick={onOpenExport} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </Button>
      </div>

      <ConfirmDialog
        open={confirmNew}
        onOpenChange={setConfirmNew}
        title="Start a new diagram?"
        description="This clears the editor and any unsaved changes to your current diagram."
        confirmLabel="New diagram"
        destructive
        onConfirm={createNew}
      />
    </header>
  );
}
