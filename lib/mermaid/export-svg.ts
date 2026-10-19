import type { ExportBackground } from "@/types/export";

import { getSvgSize, makeStandaloneSvg, sanitizeSvg } from "./sanitize";

const SVG_NS = "http://www.w3.org/2000/svg";

function backgroundFill(background: ExportBackground): string | null {
  if (background === "transparent") return null;
  if (background === "dark") return "#0a0b0d";
  return "#ffffff";
}

/**
 * Insert a full-size background rectangle as the first child of the SVG so the
 * exported file is not transparent. No-op for transparent exports.
 */
export function withBackground(
  svg: string,
  background: ExportBackground,
  size?: { width: number; height: number }
): string {
  const fill = backgroundFill(background);
  if (!fill || typeof window === "undefined") return svg;

  const dims = size ?? getSvgSize(svg);
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  const root = doc.documentElement;
  if (!root || root.nodeName !== "svg") return svg;

  const rect = doc.createElementNS(SVG_NS, "rect");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", String(Math.round(dims.width)));
  rect.setAttribute("height", String(Math.round(dims.height)));
  rect.setAttribute("fill", fill);
  root.insertBefore(rect, root.firstChild);

  return new XMLSerializer().serializeToString(root);
}

/** Build the final, standalone SVG document for download. */
export function buildSvgDocument(
  svg: string,
  background: ExportBackground = "transparent"
): string {
  const size = getSvgSize(svg);
  const standalone = makeStandaloneSvg(svg, size);
  const withBg = withBackground(standalone, background, size);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${sanitizeSvg(withBg)}`;
}
