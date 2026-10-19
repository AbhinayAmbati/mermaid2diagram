"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Download, FilePlus2 } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { ExamplesMenu } from "@/components/examples/examples-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-[1800px] items-center gap-2 px-3 sm:px-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-1 py-1 text-foreground transition-opacity hover:opacity-80"
        >
          <span className="text-primary">
            <Logo />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Mermaid Studio
          </span>
          <Badge variant="soft" className="hidden sm:inline-flex">
            BETA
          </Badge>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNew}
            className="gap-1.5"
          >
            <FilePlus2 className="h-4 w-4" />
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

          <Button size="sm" onClick={onOpenExport} className="ml-1 gap-1.5">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
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
