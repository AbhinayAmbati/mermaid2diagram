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
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const prevSvgRef = React.useRef<string | null>(null);

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

  // Auto-fit the very first successful render so the diagram is framed nicely.
  React.useEffect(() => {
    if (svg && !prevSvgRef.current) {
      const timer = setTimeout(fitToScreen, 60);
      prevSvgRef.current = svg;
      return () => clearTimeout(timer);
    }
    prevSvgRef.current = svg;
  }, [svg, fitToScreen]);

  // Track fullscreen state.
  React.useEffect(() => {
    const onChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = React.useCallback(() => {
    const node = containerRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void node.requestFullscreen?.().catch(() => {
        toast.error("Fullscreen is not available in this browser.");
      });
    }
  }, []);

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
    background === "grid" && "bg-background",
    background === "grid" && settings.showGrid && "grid-bg-dots"
  );

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full flex-col overflow-hidden bg-background"
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
        {/* Rendered diagram */}
        {svg && !isError && (
          <TransformWrapper
            ref={wrapperRef}
            minScale={0.05}
            maxScale={8}
            initialScale={1}
            centerOnInit
            limitToBounds={false}
            wheel={{ step: 0.08 }}
            doubleClick={{ disabled: true }}
            panning={{ velocityDisabled: false }}
            onTransformed={(_ref, state) => setScale(state.scale)}
          >
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{ width: "fit-content", height: "fit-content" }}
            >
              <div
                className="mermaid-canvas p-10"
                // Mermaid renders with securityLevel "strict", which sanitises
                // every user-supplied label before it reaches this markup.
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </TransformComponent>
          </TransformWrapper>
        )}

        {/* Empty state */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center p-6"
            >
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-subtle">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">
                  Nothing to preview yet
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Write or paste Mermaid code in the editor, or start from a
                  ready-made example.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Button size="sm" onClick={() => setSource(DEFAULT_SOURCE)}>
                    Load sample diagram
                  </Button>
                  {onFocusEditor && (
                    <Button size="sm" variant="outline" onClick={onFocusEditor}>
                      Go to editor
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        {isError && error && (
          <div className="absolute inset-0 overflow-auto">
            <RenderError
              error={error}
              onBackToEditor={onFocusEditor}
              onLoadSample={() => setSource(DEFAULT_SOURCE)}
            />
          </div>
        )}

        {/* First-render loading state */}
        <AnimatePresence>
          {isRenderingFirst && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-subtle">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Rendering diagram…
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle re-render indicator (previous diagram stays visible) */}
        <AnimatePresence>
          {status === "rendering" && svg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-2.5 py-1 text-2xs font-medium text-muted-foreground shadow-subtle backdrop-blur"
            >
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              Rendering…
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
