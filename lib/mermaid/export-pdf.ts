import type { ExportBackground, PdfOrientation } from "@/types/export";

import { renderSvgToCanvas } from "./export-raster";
import { getSvgSize } from "./sanitize";

export interface PdfOptions {
  background: ExportBackground;
  orientation: PdfOrientation;
  /** Raster scale used for the embedded image; higher = sharper, larger file. */
  scale?: number;
}

const A4 = {
  portrait: { width: 595.28, height: 841.89 },
  landscape: { width: 841.89, height: 595.28 },
};

const MARGIN = 36; // points

/**
 * Build a PDF containing the diagram fitted to an A4 page.
 *
 * Mermaid relies heavily on CSS classes inside a `<style>` block, which the
 * pure-vector SVG→PDF path does not resolve reliably across viewers. We
 * therefore embed a high-resolution raster of the diagram (3× by default),
 * which reproduces the on-screen appearance faithfully and works everywhere.
 */
export async function svgToPdfBlob(
  svg: string,
  options: PdfOptions
): Promise<Blob> {
  const { background, orientation } = options;
  const scale = options.scale ?? 3;

  // jsPDF is heavy; load it only when a PDF export is actually requested.
  const { jsPDF } = await import("jspdf");

  const canvas = await renderSvgToCanvas(svg, { scale, background });
  const dataUrl = canvas.toDataURL("image/png", 1);

  const size = getSvgSize(svg);
  const page = A4[orientation];

  const doc = new jsPDF({
    orientation,
    unit: "pt",
    format: [page.width, page.height],
    compress: true,
  });

  if (background !== "transparent") {
    const rgb = background === "dark" ? [10, 11, 13] : [255, 255, 255];
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.rect(0, 0, page.width, page.height, "F");
  }

  const maxWidth = page.width - MARGIN * 2;
  const maxHeight = page.height - MARGIN * 2;
  const ratio = Math.min(maxWidth / size.width, maxHeight / size.height);
  const drawWidth = size.width * ratio;
  const drawHeight = size.height * ratio;
  const x = (page.width - drawWidth) / 2;
  const y = (page.height - drawHeight) / 2;

  doc.addImage(dataUrl, "PNG", x, y, drawWidth, drawHeight, undefined, "FAST");

  return doc.output("blob");
}

/** Pick a sensible default orientation from the diagram's aspect ratio. */
export function suggestOrientation(width: number, height: number): PdfOrientation {
  return width >= height ? "landscape" : "portrait";
}
