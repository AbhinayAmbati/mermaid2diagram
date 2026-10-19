import type {
  AppearancePreset,
  DiagramSettings,
  MermaidConfig,
  MermaidTheme,
  ThemeVariables,
} from "@/types/diagram";

/** Themes Mermaid natively supports and we expose in the UI. */
export const MERMAID_THEMES: { id: MermaidTheme; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "base", label: "Base" },
  { id: "neutral", label: "Neutral" },
  { id: "forest", label: "Forest" },
  { id: "dark", label: "Dark" },
];

/**
 * A neutral, widely available font stack. We deliberately avoid exotic webfonts
 * here: Mermaid SVGs are rasterised for PNG/PDF export, and a font that is not
 * installed locally would fall back unpredictably during that conversion.
 */
export const DIAGRAM_FONT_STACK =
  '"Inter", "Helvetica Neue", Helvetica, Arial, "Segoe UI", sans-serif';

/** Default diagram colours, matching the lime-signal preset. */
export const DEFAULT_THEME_VARIABLES: ThemeVariables = {
  primaryColor: "#f2fbe0",
  primaryTextColor: "#16220a",
  primaryBorderColor: "#7fa81a",
  lineColor: "#4b5a33",
  secondaryColor: "#ffffff",
  tertiaryColor: "#f5f6f3",
  fontSize: "14px",
  fontFamily: DIAGRAM_FONT_STACK,
};

/** Tasteful appearance presets. */
export const PRESETS: AppearancePreset[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Mermaid's balanced default palette.",
    theme: "default",
    themeVariables: {},
  },
  {
    id: "monochrome",
    name: "Monochrome",
    description: "Pure black on white, print friendly.",
    theme: "base",
    themeVariables: {
      primaryColor: "#ffffff",
      primaryTextColor: "#101613",
      primaryBorderColor: "#101613",
      lineColor: "#101613",
      secondaryColor: "#f5f6f3",
      tertiaryColor: "#ffffff",
    },
  },
  {
    id: "lime-signal",
    name: "Terminal Lime",
    description: "Monochrome base with the lime signal accent.",
    theme: "base",
    themeVariables: {
      primaryColor: "#f2fbe0",
      primaryTextColor: "#16220a",
      primaryBorderColor: "#7fa81a",
      lineColor: "#4b5a33",
      secondaryColor: "#ffffff",
      tertiaryColor: "#f5f6f3",
    },
  },
  {
    id: "soft-minimal",
    name: "Soft Minimal",
    description: "Quiet greys with soft borders.",
    theme: "base",
    themeVariables: {
      primaryColor: "#f5f6f3",
      primaryTextColor: "#3c4642",
      primaryBorderColor: "#dfe2db",
      lineColor: "#9aa5a0",
      secondaryColor: "#ffffff",
      tertiaryColor: "#eceee8",
    },
  },
];

export function getPreset(id: string): AppearancePreset | undefined {
  return PRESETS.find((p) => p.id === id);
}

export const DEFAULT_SETTINGS: DiagramSettings = {
  theme: "base",
  presetId: "lime-signal",
  themeVariables: {
    ...DEFAULT_THEME_VARIABLES,
    ...getPreset("lime-signal")!.themeVariables,
  },
  fontFamily: DIAGRAM_FONT_STACK,
  fontSize: 14,
  padding: 16,
  canvasBackground: "grid",
  showGrid: true,
  exportBackground: "white",
};

/**
 * Translate our UI settings into a Mermaid runtime configuration.
 *
 * Security: we keep `securityLevel: "strict"` (Mermaid sanitises labels) and
 * enable `suppressErrorRendering` so a bad diagram never injects an error
 * graphic into the host document. `htmlLabels` is disabled so labels are real
 * SVG `<text>` nodes rather than `<foreignObject>` - the latter does not
 * rasterise reliably when an SVG is drawn onto a canvas for PNG/PDF export.
 */
export function buildMermaidConfig(settings: DiagramSettings): MermaidConfig {
  const themeVariables: Record<string, string> = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
  };

  for (const [key, value] of Object.entries(settings.themeVariables)) {
    if (value !== undefined && value !== null && value !== "") {
      themeVariables[key] = String(value);
    }
  }

  const useMaxWidth = false;

  return {
    theme: settings.theme,
    themeVariables,
    securityLevel: "strict",
    startOnLoad: false,
    suppressErrorRendering: true,
    fontFamily: settings.fontFamily,
    fontSize: settings.fontSize,
    flowchart: {
      useMaxWidth,
      htmlLabels: false,
      padding: settings.padding,
      // A roomier layout: more space between sibling nodes and between ranks,
      // so nodes are not crowded and the edges running between them stay
      // legible rather than tangled.
      nodeSpacing: 64,
      rankSpacing: 72,
      diagramPadding: 16,
    },
    sequence: { useMaxWidth, wrap: true },
    gantt: { useMaxWidth },
    class: { useMaxWidth, htmlLabels: false },
    state: { useMaxWidth },
    er: { useMaxWidth },
    journey: { useMaxWidth },
    pie: { useMaxWidth },
    gitGraph: { useMaxWidth },
    requirement: { useMaxWidth },
    timeline: { useMaxWidth },
    mindmap: { useMaxWidth, padding: settings.padding },
  };
}
