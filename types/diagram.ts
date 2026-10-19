/** The Mermaid render themes we expose in the UI. */
export type MermaidTheme = "default" | "base" | "dark" | "forest" | "neutral";

/** Background style for the canvas surface. */
export type CanvasBackground = "white" | "transparent" | "grid";

/** A subset of Mermaid theme variables we allow the user to tweak. */
export interface ThemeVariables {
  primaryColor?: string;
  primaryTextColor?: string;
  primaryBorderColor?: string;
  lineColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  fontSize?: string;
  fontFamily?: string;
}

/** A named appearance preset applied to the preview. */
export interface AppearancePreset {
  id: string;
  name: string;
  description: string;
  theme: MermaidTheme;
  themeVariables: ThemeVariables;
}

/** Mermaid runtime configuration surfaced to the UI. */
export interface MermaidConfig {
  theme: MermaidTheme;
  themeVariables: ThemeVariables;
  securityLevel: "strict" | "loose" | "antiscript" | "sandbox";
  startOnLoad: boolean;
  fontFamily?: string;
  fontSize?: number;
  flowchart?: { padding?: number; useMaxWidth?: boolean };
  sequence?: { useMaxWidth?: boolean };
  gantt?: { useMaxWidth?: boolean };
}

/** Result of a successful render. */
export interface RenderResult {
  svg: string;
  diagramType: string;
  width: number;
  height: number;
}

/** A structured, user-facing render error. */
export interface RenderError {
  message: string;
  line?: number;
  column?: number;
  hash?: string;
}

/** Render lifecycle state for the canvas. */
export type RenderStatus = "idle" | "rendering" | "success" | "error";

/** Full appearance settings applied to the preview + exports. */
export interface DiagramSettings {
  theme: MermaidTheme;
  presetId: string;
  themeVariables: ThemeVariables;
  fontFamily: string;
  fontSize: number;
  padding: number;
  canvasBackground: CanvasBackground;
  showGrid: boolean;
  exportBackground: "white" | "transparent" | "dark";
}
