import DOMPurify from "dompurify";

/**
 * Sanitise an SVG string before it is written to a file or handed to the
 * clipboard. Mermaid already renders with `securityLevel: "strict"`, but the
 * diagram source is untrusted input, so we run the serialised output through
 * DOMPurify's SVG profile as defence in depth.
 */
export function sanitizeSvg(svg: string): string {
  if (typeof window === "undefined") return svg;
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    // Mermaid emits an inline <style> block plus SVG primitives; these must
    // survive sanitisation or the exported file would render unstyled.
    ADD_TAGS: [
      "style",
      "foreignObject",
      "font",
      "tspan",
      "textPath",
      "marker",
      "pattern",
      "clipPath",
      "mask",
      "use",
      "symbol",
      "defs",
      "filter",
      "feDropShadow",
    ],
    ADD_ATTR: [
      "style",
      "class",
      "xmlns",
      "xmlns:xlink",
      "xlink:href",
      "dominant-baseline",
      "text-anchor",
      "marker-end",
      "marker-start",
      "marker-mid",
      "paint-order",
      "vector-effect",
      "transform-origin",
    ],
  });
}

/**
 * Make a Mermaid-rendered SVG standalone: guarantee the XML namespace is
 * present and that explicit pixel dimensions exist so viewers and rasterisers
 * know how large the image is.
 */
export function makeStandaloneSvg(
  svg: string,
  opts: { width?: number; height?: number } = {}
): string {
  const clean = sanitizeSvg(svg);
  if (typeof window === "undefined") return clean;

  const doc = new DOMParser().parseFromString(clean, "image/svg+xml");
  const el = doc.documentElement;
  if (!el || el.nodeName !== "svg") return clean;

  if (!el.getAttribute("xmlns")) {
    el.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }
  if (!el.getAttribute("xmlns:xlink")) {
    el.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  }

  const vb = el.getAttribute("viewBox");
  let width = opts.width ?? parseFloat(el.getAttribute("width") || "0");
  let height = opts.height ?? parseFloat(el.getAttribute("height") || "0");

  if ((!width || !height) && vb) {
    const parts = vb.split(/[\s,]+/).map(Number);
    if (parts.length === 4) {
      width = width || parts[2];
      height = height || parts[3];
    }
  }

  if (width) el.setAttribute("width", String(Math.round(width)));
  if (height) el.setAttribute("height", String(Math.round(height)));

  return new XMLSerializer().serializeToString(el);
}

/** Read the intrinsic pixel size of an SVG string. */
export function getSvgSize(svg: string): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 800, height: 600 };
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  const el = doc.documentElement;
  const vb = el.getAttribute("viewBox");
  const toNum = (v: string | null) => {
    if (!v) return 0;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  let width = toNum(el.getAttribute("width"));
  let height = toNum(el.getAttribute("height"));
  if ((!width || !height) && vb) {
    const parts = vb.split(/[\s,]+/).map(Number);
    if (parts.length === 4) {
      width = width || parts[2];
      height = height || parts[3];
    }
  }
  return {
    width: width || 800,
    height: height || 600,
  };
}
