"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { redo, undo } from "@codemirror/commands";
import { Code2, Eye, Loader2, PanelLeftOpen } from "lucide-react";
import { toast } from "sonner";

import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { ExportDialog } from "@/components/export/export-dialog";
import { DiagramSettingsPanel } from "@/components/diagram/diagram-settings";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DEFAULT_SOURCE, getTemplate } from "@/lib/examples/templates";
import { useAutosave } from "@/lib/hooks/use-autosave";
import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts";
import { useIsMobile } from "@/lib/hooks/use-media-query";
import { useMermaidRender } from "@/lib/hooks/use-mermaid-render";
import { diagramTypeLabel } from "@/lib/mermaid/diagram-type";
import { useDiagramStore } from "@/lib/store/use-diagram-store";
import { copyToClipboard } from "@/lib/utils";
import type { DiagramSettings } from "@/types/diagram";

// Heavy, browser-only dependencies are code-split and never server-rendered.
const MermaidEditor = dynamic(
  () => import("@/components/editor/mermaid-editor").then((m) => m.MermaidEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    ),
  }
);

const DiagramCanvas = dynamic(
  () => import("@/components/diagram/diagram-canvas").then((m) => m.DiagramCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center gap-2.5 text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="label-mono">Loading canvas</span>
      </div>
    ),
  }
);

export function EditorWorkspace() {
  const source = useDiagramStore((s) => s.source);
  const settings = useDiagramStore((s) => s.settings);
  const diagramType = useDiagramStore((s) => s.diagramType);
  const setSource = useDiagramStore((s) => s.setSource);
  const reset = useDiagramStore((s) => s.reset);
  const hydrate = useDiagramStore((s) => s.hydrate);

  const editorRef = React.useRef<ReactCodeMirrorRef>(null);
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const setFileName = useDiagramStore((s) => s.setFileName);

  const [exportOpen, setExportOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [editorCollapsed, setEditorCollapsed] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [mobileTab, setMobileTab] = React.useState<"editor" | "preview">("editor");

  // Kick off the render pipeline (debounced + race-safe).
  useMermaidRender(350);

  // Local autosave + restore of the previous draft.
  const { restored, ready, clearDraft } = useAutosave({ source, settings });
  const didHydrate = React.useRef(false);

  // A ?example=<id> deep link from the landing page loads that template and
  // takes precedence over any locally-restored draft.
  const loadedExample = React.useRef<string | null>(null);
  React.useEffect(() => {
    const id = searchParams.get("example");
    if (!id || loadedExample.current === id) return;
    loadedExample.current = id;
    const template = getTemplate(id);
    if (template) {
      didHydrate.current = true;
      setSource(template.code);
      setFileName(`mermaid-${template.id}`);
    }
  }, [searchParams, setSource, setFileName]);

  React.useEffect(() => {
    if (!ready || didHydrate.current) return;
    didHydrate.current = true;
    if (restored?.source && restored.source !== DEFAULT_SOURCE) {
      hydrate({
        source: restored.source,
        settings: restored.settings as DiagramSettings | undefined,
      });
      toast.success("Restored your previous draft");
    }
  }, [ready, restored, hydrate]);

  const focusEditor = React.useCallback(() => {
    editorRef.current?.view?.focus();
  }, []);

  const handleUndo = React.useCallback(() => {
    const view = editorRef.current?.view;
    if (view) undo(view);
  }, []);

  const handleRedo = React.useCallback(() => {
    const view = editorRef.current?.view;
    if (view) redo(view);
  }, []);

  const handleCopyCode = React.useCallback(async () => {
    const ok = await copyToClipboard(source);
    if (ok) {
      setCopiedCode(true);
      toast.success("Mermaid source copied.");
      setTimeout(() => setCopiedCode(false), 1600);
    } else {
      toast.error("Could not copy the code.");
    }
  }, [source]);

  const handleNewDiagram = React.useCallback(() => {
    clearDraft();
    focusEditor();
  }, [clearDraft, focusEditor]);

  const shortcuts = React.useMemo(
    () => [
      {
        combo: "mod+s",
        allowInEditable: true,
        handler: () => setExportOpen(true),
      },
      {
        combo: "mod+enter",
        allowInEditable: true,
        handler: () => setExportOpen(true),
      },
      {
        combo: "mod+k",
        allowInEditable: true,
        handler: () => focusEditor(),
      },
      {
        combo: "mod+,",
        allowInEditable: true,
        handler: () => setSettingsOpen(true),
      },
    ],
    [focusEditor]
  );

  useKeyboardShortcuts(shortcuts);

  const editorPanel = (
    <div className="flex h-full min-h-0 flex-col bg-card">
      <EditorToolbar
        diagramType={diagramTypeLabel(diagramType)}
        copied={copiedCode}
        collapsed={editorCollapsed}
        onCopy={handleCopyCode}
        onClear={() => setConfirmReset(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onToggleCollapse={() => setEditorCollapsed((v) => !v)}
      />
      <div className="min-h-0 flex-1">
        <MermaidEditor
          value={source}
          onChange={setSource}
          editorRef={editorRef}
          autoFocus={!isMobile}
        />
      </div>
    </div>
  );

  const canvasPanel = (
    <DiagramCanvas
      onOpenSettings={() => setSettingsOpen(true)}
      onFocusEditor={() => {
        if (isMobile) setMobileTab("editor");
        else focusEditor();
      }}
    />
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-dvh flex-col overflow-hidden">
        <Navbar
          onOpenExport={() => setExportOpen(true)}
          onNewDiagram={handleNewDiagram}
        />

        {/* Full-screen workspace: panels run edge to edge beneath the pill nav. */}
        <main className="min-h-0 flex-1">
          {isMobile ? (
            <Tabs
              value={mobileTab}
              onValueChange={(v) => setMobileTab(v as "editor" | "preview")}
              className="flex h-full flex-col"
            >
              <div className="flex shrink-0 items-center border-b border-border p-2">
                <TabsList className="w-full">
                  <TabsTrigger value="editor" className="flex-1 gap-1.5">
                    <Code2 className="h-3.5 w-3.5" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex-1 gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent
                value="editor"
                className="mt-0 min-h-0 flex-1 data-[state=inactive]:hidden"
              >
                {editorPanel}
              </TabsContent>
              <TabsContent
                value="preview"
                className="mt-0 min-h-0 flex-1 data-[state=inactive]:hidden"
              >
                {canvasPanel}
              </TabsContent>
            </Tabs>
          ) : editorCollapsed ? (
            <div className="relative h-full">
              {canvasPanel}
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-4 left-4 z-10 gap-1.5 shadow-pop"
                onClick={() => setEditorCollapsed(false)}
              >
                <PanelLeftOpen className="h-3.5 w-3.5" />
                Show editor
              </Button>
            </div>
          ) : (
            <ResizablePanelGroup
              direction="horizontal"
              autoSaveId="mermaid2diagram-split"
            >
              <ResizablePanel defaultSize={40} minSize={30} className="min-w-0">
                {editorPanel}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={60} minSize={30} className="min-w-0">
                {canvasPanel}
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </main>
      </div>

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
      <DiagramSettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset to the sample diagram?"
        description="Your current Mermaid code will be replaced with the starter flowchart."
        confirmLabel="Reset editor"
        destructive
        onConfirm={() => {
          reset();
          focusEditor();
        }}
      />
    </TooltipProvider>
  );
}
