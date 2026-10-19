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

export const DEFAULT_THEME_VARIABLES: ThemeVariables = {
  primaryColor: "#eef4ff",
  primaryTextColor: "#111318",
  primaryBorderColor: "#2563ff",
  lineColor: "#2563ff",
  secondaryColor: "#f7f8fa",
  tertiaryColor: "#ffffff",
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
    description: "Pure black on white — print friendly.",
    theme: "base",
    themeVariables: {
      primaryColor: "#ffffff",
      primaryTextColor: "#111318",
      primaryBorderColor: "#111318",
      lineColor: "#111318",
      secondaryColor: "#f7f8fa",
      tertiaryColor: "#ffffff",
    },
  },
  {
    id: "electric-blue",
    name: "Electric Blue",
    description: "Monochrome base with electric-blue highlights.",
    theme: "base",
    themeVariables: {
      primaryColor: "#eef4ff",
      primaryTextColor: "#0b1c4d",
      primaryBorderColor: "#2563ff",
      lineColor: "#2563ff",
      secondaryColor: "#ffffff",
      tertiaryColor: "#f7f8fa",
    },
  },
  {
    id: "soft-minimal",
    name: "Soft Minimal",
    description: "Quiet greys with soft borders.",
    theme: "base",
    themeVariables: {
      primaryColor: "#f7f8fa",
      primaryTextColor: "#374151",
      primaryBorderColor: "#e5e7eb",
      lineColor: "#9ca3af",
      secondaryColor: "#ffffff",
      tertiaryColor: "#f3f4f6",
    },
  },
];

export function getPreset(id: string): AppearancePreset | undefined {
  return PRESETS.find((p) => p.id === id);
}

export const DEFAULT_SETTINGS: DiagramSettings = {
  theme: "base",
  presetId: "electric-blue",
  themeVariables: { ...DEFAULT_THEME_VARIABLES, ...getPreset("electric-blue")!.themeVariables },
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
 * SVG `<text>` nodes rather than `<foreignObject>` — the latter does not
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
    flowchart: { useMaxWidth, htmlLabels: false, padding: settings.padding },
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
