/** Every export format the app genuinely supports. */
export type ExportFormat = "svg" | "png" | "jpeg" | "pdf" | "mmd";

/** Background handling for raster / PDF exports. */
export type ExportBackground = "white" | "transparent" | "dark";

/** PDF page orientation. */
export type PdfOrientation = "portrait" | "landscape";

/** User-selectable export options surfaced in the dialog. */
export interface ExportOptions {
  format: ExportFormat;
  fileName: string;
  /** Raster scale multiplier (PNG). */
  scale: 1 | 2 | 3;
  background: ExportBackground;
  orientation: PdfOrientation;
}

/** Metadata describing each format for the export UI. */
export interface ExportFormatMeta {
  id: ExportFormat;
  label: string;
  extension: string;
  description: string;
  supportsScale: boolean;
  supportsBackground: boolean;
  supportsOrientation: boolean;
}

/** Result of running an export. */
export interface ExportResult {
  ok: boolean;
  filename?: string;
  bytes?: number;
  error?: string;
}
