import { create } from "zustand";

import { DEFAULT_SETTINGS, getPreset } from "@/lib/mermaid/config";
import { DEFAULT_SOURCE } from "@/lib/examples/templates";
import type {
  DiagramSettings,
  RenderError,
  RenderStatus,
  ThemeVariables,
} from "@/types/diagram";

interface DiagramStore {
  /** Raw Mermaid source being edited. */
  source: string;
  /** Suggested base file name for exports. */
  fileName: string;
  /** Appearance settings. */
  settings: DiagramSettings;

  /** Latest successful render output. */
  svg: string | null;
  svgWidth: number;
  svgHeight: number;
  diagramType: string;

  /** Render lifecycle. */
  status: RenderStatus;
  error: RenderError | null;

  setSource: (source: string) => void;
  setFileName: (fileName: string) => void;
  updateSettings: (patch: Partial<DiagramSettings>) => void;
  applyPreset: (presetId: string) => void;
  updateThemeVariables: (patch: Partial<ThemeVariables>) => void;

  beginRender: () => void;
  resolveRender: (svg: string, type: string, width: number, height: number) => void;
  rejectRender: (error: RenderError) => void;
  clearRender: () => void;

  reset: (source?: string) => void;
  /** Start an empty diagram: no code, no preview. */
  newDiagram: () => void;
  hydrate: (payload: { source?: string; settings?: DiagramSettings }) => void;
}

export const useDiagramStore = create<DiagramStore>((set) => ({
  source: DEFAULT_SOURCE,
  fileName: "mermaid-diagram",
  settings: DEFAULT_SETTINGS,

  svg: null,
  svgWidth: 0,
  svgHeight: 0,
  diagramType: "unknown",

  status: "idle",
  error: null,

  setSource: (source) => set({ source }),
  setFileName: (fileName) => set({ fileName }),

  updateSettings: (patch) =>
    set((state) => ({ settings: { ...state.settings, ...patch } })),

  applyPreset: (presetId) =>
    set((state) => {
      const preset = getPreset(presetId);
      if (!preset) return state;
      return {
        settings: {
          ...state.settings,
          presetId,
          theme: preset.theme,
          themeVariables: {
            ...state.settings.themeVariables,
            ...preset.themeVariables,
          },
        },
      };
    }),

  updateThemeVariables: (patch) =>
    set((state) => ({
      settings: {
        ...state.settings,
        themeVariables: { ...state.settings.themeVariables, ...patch },
      },
    })),

  beginRender: () => set({ status: "rendering", error: null }),

  resolveRender: (svg, type, width, height) =>
    set({
      svg,
      diagramType: type,
      svgWidth: width,
      svgHeight: height,
      status: "success",
      error: null,
    }),

  rejectRender: (error) =>
    set({ status: "error", error, svg: null, svgWidth: 0, svgHeight: 0 }),

  clearRender: () =>
    set({ status: "idle", error: null, svg: null, svgWidth: 0, svgHeight: 0 }),

  /**
   * Reset the editor back to a known sample.
   *
   * The rendered output is deliberately left alone. The render pipeline only
   * re-runs when the source or the settings actually change, so clearing the
   * SVG here would strand the canvas blank whenever they did not, which is
   * exactly what happened when the editor already held the sample.
   */
  reset: (source = DEFAULT_SOURCE) =>
    set((state) => ({
      source,
      fileName: "mermaid-diagram",
      settings: DEFAULT_SETTINGS,
      error: null,
      status: state.svg ? "success" : "idle",
    })),

  /**
   * Start a brand new diagram. The source becomes empty, which the render
   * pipeline picks up and turns into the canvas empty state, so it is safe to
   * clear the preview here.
   */
  newDiagram: () =>
    set({
      source: "",
      fileName: "mermaid-diagram",
      settings: DEFAULT_SETTINGS,
      svg: null,
      svgWidth: 0,
      svgHeight: 0,
      diagramType: "unknown",
      status: "idle",
      error: null,
    }),

  hydrate: ({ source, settings }) =>
    set((state) => ({
      source: source ?? state.source,
      settings: settings ? { ...state.settings, ...settings } : state.settings,
    })),
}));
