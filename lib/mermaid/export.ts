import { downloadBlob, toSafeFileName } from "@/lib/utils";
import type {
  ExportFormat,
  ExportFormatMeta,
  ExportOptions,
  ExportResult,
} from "@/types/export";

import { svgToPdfBlob } from "./export-pdf";
import { svgToJpegBlob, svgToPngBlob } from "./export-raster";
import { buildSvgDocument } from "./export-svg";

/** Metadata that drives the export dialog. Only genuinely supported formats. */
export const EXPORT_FORMATS: ExportFormatMeta[] = [
  {
    id: "svg",
    label: "SVG",
    extension: "svg",
    description: "Vector — infinitely scalable, best for print.",
    supportsScale: false,
    supportsBackground: true,
    supportsOrientation: false,
  },
  {
    id: "png",
    label: "PNG",
    extension: "png",
    description: "Lossless raster with optional transparency.",
    supportsScale: true,
    supportsBackground: true,
    supportsOrientation: false,
  },
  {
    id: "jpeg",
    label: "JPEG",
    extension: "jpg",
    description: "Compact raster with a solid background.",
    supportsScale: true,
    supportsBackground: true,
    supportsOrientation: false,
  },
  {
    id: "pdf",
    label: "PDF",
    extension: "pdf",
    description: "Document fitted to an A4 page.",
    supportsScale: false,
    supportsBackground: true,
    supportsOrientation: true,
  },
  {
    id: "mmd",
    label: "Mermaid source",
    extension: "mmd",
    description: "The editable .mmd source code.",
    supportsScale: false,
    supportsBackground: false,
    supportsOrientation: false,
  },
];

export function getExportFormat(id: ExportFormat): ExportFormatMeta {
  return EXPORT_FORMATS.find((f) => f.id === id) ?? EXPORT_FORMATS[0];
}

export interface RunExportParams {
  /** The currently rendered SVG markup, or null when there is nothing to export. */
  svg: string | null;
  /** The raw Mermaid source. */
  source: string;
  options: ExportOptions;
}

/**
 * Produce and download a real file in the requested format. Every branch
 * yields a genuine file of the correct type — nothing is renamed or faked.
 */
export async function runExport({
  svg,
  source,
  options,
}: RunExportParams): Promise<ExportResult> {
  const meta = getExportFormat(options.format);
  const base = toSafeFileName(options.fileName, "diagram");
  const filename = `${base}.${meta.extension}`;

  try {
    if (options.format === "mmd") {
      if (!source.trim()) throw new Error("There is no Mermaid source to download.");
      const blob = new Blob([source], { type: "text/plain;charset=utf-8" });
      downloadBlob(blob, filename);
      return { ok: true, filename, bytes: blob.size };
    }

    if (!svg) {
      throw new Error("Render a valid diagram before exporting.");
    }

    switch (options.format) {
      case "svg": {
        const doc = buildSvgDocument(svg, options.background);
        const blob = new Blob([doc], { type: "image/svg+xml;charset=utf-8" });
        downloadBlob(blob, filename);
        return { ok: true, filename, bytes: blob.size };
      }
      case "png": {
        const blob = await svgToPngBlob(svg, {
          scale: options.scale,
          background: options.background,
        });
        downloadBlob(blob, filename);
        return { ok: true, filename, bytes: blob.size };
      }
      case "jpeg": {
        const blob = await svgToJpegBlob(svg, {
          scale: options.scale,
          background: options.background,
        });
        downloadBlob(blob, filename);
        return { ok: true, filename, bytes: blob.size };
      }
      case "pdf": {
        const blob = await svgToPdfBlob(svg, {
          background: options.background,
          orientation: options.orientation,
          scale: 3,
        });
        downloadBlob(blob, filename);
        return { ok: true, filename, bytes: blob.size };
      }
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "The export failed for an unknown reason.",
    };
  }
}
