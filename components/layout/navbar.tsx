"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Download, FilePlus2 } from "lucide-react";

import { BrandLockup } from "@/components/layout/logo";
import { NavDivider, NavPill } from "@/components/layout/nav-pill";
import { ExamplesMenu } from "@/components/examples/examples-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TooltipButton } from "@/components/ui/tooltip";
import { DEFAULT_SOURCE, type MermaidTemplate } from "@/lib/examples/templates";
import { useDiagramStore } from "@/lib/store/use-diagram-store";

export interface NavbarProps {
  onOpenExport: () => void;
  /** Invoked after a new diagram is created (e.g. to clear the saved draft). */
  onNewDiagram?: () => void;
}

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
    <header className="sticky top-0 z-40 px-3 py-3 sm:px-4 sm:py-4">
      <NavPill>
        <Link
          href="/"
          className="flex items-center rounded-pill py-1 pl-1.5 pr-2.5 transition-opacity hover:opacity-85"
        >
          <BrandLockup />
        </Link>

        <NavDivider />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNew}
          className="gap-1.5 rounded-pill text-nav-muted hover:bg-nav-hover hover:text-nav-foreground"
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
            className="rounded-pill text-nav-muted hover:bg-nav-hover hover:text-nav-foreground"
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

        <NavDivider />

        <Button size="sm" onClick={onOpenExport} className="gap-1.5 rounded-pill">
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </Button>
      </NavPill>

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
