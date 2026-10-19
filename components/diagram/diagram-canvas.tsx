"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DEFAULT_SOURCE } from "@/lib/examples/templates";
import { diagramTypeLabel } from "@/lib/mermaid/diagram-type";
import { buildSvgDocument } from "@/lib/mermaid/export-svg";
import { useDiagramStore } from "@/lib/store/use-diagram-store";
import { copyToClipboard, cn } from "@/lib/utils";
import type { CanvasBackground } from "@/types/diagram";

import { DiagramToolbar } from "./diagram-toolbar";
import { RenderError } from "./render-error";

export interface DiagramCanvasProps {
  onOpenSettings: () => void;
  /** Called when the user asks to go back to the editor (mobile tab switch). */
  onFocusEditor?: () => void;
}

const BACKGROUND_CYCLE: CanvasBackground[] = ["grid", "white", "transparent"];

const CHECKERBOARD =
  "repeating-conic-gradient(var(--border) 0% 25%, transparent 0% 50%)";

export function DiagramCanvas({
  onOpenSettings,
  onFocusEditor,
}: DiagramCanvasProps) {
  const svg = useDiagramStore((s) => s.svg);
  const svgWidth = useDiagramStore((s) => s.svgWidth);
  const svgHeight = useDiagramStore((s) => s.svgHeight);
  const status = useDiagramStore((s) => s.status);
  const error = useDiagramStore((s) => s.error);
  const source = useDiagramStore((s) => s.source);
  const diagramType = useDiagramStore((s) => s.diagramType);
  const settings = useDiagramStore((s) => s.settings);
  const updateSettings = useDiagramStore((s) => s.updateSettings);
  const setSource = useDiagramStore((s) => s.setSource);

  const wrapperRef = React.useRef<ReactZoomPanPinchRef | null>(null);
  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  const prevSizeRef = React.useRef<{ w: number; h: number } | null>(null);

  const [scale, setScale] = React.useState(1);
  const [copied, setCopied] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const background = settings.canvasBackground;

  const fitToScreen = React.useCallback(() => {
    const wrapper = wrapperRef.current;
    const surface = surfaceRef.current;
    if (!wrapper || !surface || svgWidth <= 0 || svgHeight <= 0) return;
    const padding = 72;
    const availableWidth = Math.max(80, surface.clientWidth - padding);
    const availableHeight = Math.max(80, surface.clientHeight - padding);
    const target = Math.min(
      availableWidth / svgWidth,
      availableHeight / svgHeight,
      2
    );
    wrapper.centerView(Math.max(0.1, target), 200, "easeOut");
  }, [svgWidth, svgHeight]);

  /*
   * Refit whenever the diagram's intrinsic size changes materially, which is
   * what happens when a different example is loaded. Small size changes, from
   * editing the code, leave the user's own zoom and pan untouched. Without
   * this, swapping a small diagram for a large one kept the old transform and
   * could leave the new diagram mostly or entirely off screen.
   */
  React.useEffect(() => {
    if (!svg || svgWidth <= 0 || svgHeight <= 0) return;
    const prev = prevSizeRef.current;
    prevSizeRef.current = { w: svgWidth, h: svgHeight };

    const materiallyDifferent =
      !prev ||
      Math.abs(prev.w - svgWidth) / Math.max(prev.w, 1) > 0.1 ||
      Math.abs(prev.h - svgHeight) / Math.max(prev.h, 1) > 0.1;
    if (!materiallyDifferent) return;

    const timer = setTimeout(fitToScreen, 60);
    return () => clearTimeout(timer);
  }, [svg, svgWidth, svgHeight, fitToScreen]);

  /*
   * Fullscreen is a fixed overlay rather than the browser Fullscreen API.
   * Native fullscreen hides every element outside the fullscreen node, which
   * would make the appearance sheet, the export dialog and the toasts
   * unreachable while fullscreen is active. An in-app overlay keeps them
   * working, and Escape still leaves.
   */
  const toggleFullscreen = React.useCallback(() => {
    setIsFullscreen((value) => !value);
  }, []);

  React.useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // A dialog or sheet is open: let it handle Escape and close first.
      if (document.querySelector('[role="dialog"]')) return;
      setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  const cycleBackground = React.useCallback(() => {
    const next =
      BACKGROUND_CYCLE[(BACKGROUND_CYCLE.indexOf(background) + 1) % BACKGROUND_CYCLE.length];
    updateSettings({ canvasBackground: next, showGrid: next === "grid" });
  }, [background, updateSettings]);

  const handleCopySvg = React.useCallback(async () => {
    if (!svg) {
      toast.error("Nothing to copy yet.");
      return;
    }
    const doc = buildSvgDocument(svg, "transparent");
    const ok = await copyToClipboard(doc);
    if (ok) {
      setCopied(true);
      toast.success("SVG markup copied to clipboard.");
      setTimeout(() => setCopied(false), 1600);
    } else {
      toast.error("Could not copy the SVG.");
    }
  }, [svg]);

  const isEmpty = !svg && status !== "error" && !source.trim();
  const isError = status === "error" && !!error;
  const isRenderingFirst = status === "rendering" && !svg;

  const surfaceClasses = cn(
    "relative h-full w-full overflow-hidden",
    background === "white" && "bg-white",
    background === "transparent" && "bg-transparent",
    background === "grid" && "bg-card",
    background === "grid" && settings.showGrid && "grid-bg-dots"
  );

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden bg-card",
        isFullscreen && "fixed inset-0 z-40 h-dvh"
      )}
    >
      <DiagramToolbar
        zoomPercent={Math.round(scale * 100)}
        background={background}
        isFullscreen={isFullscreen}
        copied={copied}
        diagramType={diagramTypeLabel(diagramType)}
        onZoomIn={() => wrapperRef.current?.zoomIn(0.25)}
        onZoomOut={() => wrapperRef.current?.zoomOut(0.25)}
        onFit={fitToScreen}
        onReset={() => wrapperRef.current?.resetTransform(200)}
        onCycleBackground={cycleBackground}
        onToggleFullscreen={toggleFullscreen}
        onCopySvg={handleCopySvg}
        onOpenSettings={onOpenSettings}
      />

      <div
        ref={surfaceRef}
        className={surfaceClasses}
        style={
          background === "transparent"
            ? {
                backgroundImage: CHECKERBOARD,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 10px 10px",
              }
            : undefined
        }
      >
        {svg && !isError && (
          <TransformWrapper
            ref={wrapperRef}
            minScale={0.05}
            maxScale={8}
            initialScale={1}
            centerOnInit
            limitToBounds={false}
            wheel={{ step: 0.08 }}
            doubleClick={{ disabled: false, mode: "zoomIn", step: 0.7 }}
            panning={{ velocityDisabled: false }}
            onTransformed={(_ref, state) => setScale(state.scale)}
          >
            <TransformComponent
              wrapperClass="cursor-grab active:cursor-grabbing"
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{ width: "fit-content", height: "fit-content" }}
            >
              <div
                className="mermaid-canvas-pan p-10"
                data-testid="diagram-canvas"
                // Mermaid renders with securityLevel "strict", which sanitises
                // every user-supplied label before it reaches this markup.
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </TransformComponent>
          </TransformWrapper>
        )}

        <AnimatePresence>
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center p-6"
            >
              <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-md border border-border bg-secondary text-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="label-mono mt-6 block text-muted-foreground">
                  No diagram
                </span>
                <h3 className="mt-3 text-base font-semibold tracking-tight">
                  Nothing to preview yet
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Write or paste Mermaid code in the editor, or start from a
                  ready-made example.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Button size="sm" onClick={() => setSource(DEFAULT_SOURCE)}>
                    Load sample diagram
                  </Button>
                  {onFocusEditor && (
                    <Button size="sm" variant="secondary" onClick={onFocusEditor}>
                      Go to editor
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isError && error && (
          <div className="absolute inset-0 overflow-auto">
            <RenderError
              error={error}
              onBackToEditor={onFocusEditor}
              onLoadSample={() => setSource(DEFAULT_SOURCE)}
            />
          </div>
        )}

        <AnimatePresence>
          {isRenderingFirst && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex items-center gap-2.5 rounded-sm border border-border bg-card px-3.5 py-2.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground" />
                <span className="label-mono text-muted-foreground">
                  Rendering diagram
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {status === "rendering" && svg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 rounded-sm border border-border bg-card/95 px-2.5 py-1.5 backdrop-blur"
            >
              <Loader2 className="h-3 w-3 animate-spin text-foreground" />
              <span className="label-mono-sm text-muted-foreground">
                Rendering
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
