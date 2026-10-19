import type { ExportBackground } from "@/types/export";

import { withBackground } from "./export-svg";
import { getSvgSize, makeStandaloneSvg, sanitizeSvg } from "./sanitize";

/** Hard ceiling on raster dimensions to avoid exceeding browser canvas limits. */
const MAX_DIMENSION = 8192;

function backgroundFill(background: ExportBackground): string | null {
  if (background === "transparent") return null;
  if (background === "dark") return "#0a0b0d";
  return "#ffffff";
}

export interface RasterOptions {
  scale: number;
  background: ExportBackground;
}

/**
 * Rasterise an SVG string onto an HTMLCanvasElement. Shared by the PNG, JPEG
 * and PDF exporters so the (tricky) SVG → canvas step lives in exactly one
 * place and is independently testable.
 */
export async function renderSvgToCanvas(
  svg: string,
  { scale, background }: RasterOptions
): Promise<HTMLCanvasElement> {
  if (typeof window === "undefined") {
    throw new Error("Rasterisation is only available in the browser.");
  }

  const size = getSvgSize(svg);
  const standalone = makeStandaloneSvg(svg, size);
  const withBg = withBackground(standalone, background, size);

  // Clamp the scale so neither dimension exceeds the canvas ceiling.
  let effectiveScale = Math.max(1, scale);
  const longest = Math.max(size.width, size.height);
  if (longest * effectiveScale > MAX_DIMENSION) {
    effectiveScale = Math.max(1, MAX_DIMENSION / longest);
  }

  const pixelWidth = Math.max(1, Math.round(size.width * effectiveScale));
  const pixelHeight = Math.max(1, Math.round(size.height * effectiveScale));

  const dataUrl =
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(withBg);

  const image = await loadImage(dataUrl);

  const canvas = document.createElement("canvas");
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create a 2D canvas context.");

  const fill = backgroundFill(background);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, pixelWidth, pixelHeight);
  }

  ctx.setTransform(effectiveScale, 0, 0, effectiveScale, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, size.width, size.height);

  return canvas;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "sync";
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("The diagram could not be converted to an image."));
    img.src = src;
  });
}

/** Convert a canvas to a Blob, with a toDataURL fallback for old browsers. */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          // Fallback: derive a blob from the data URL.
          try {
            const dataUrl = canvas.toDataURL(mime, quality);
            resolve(dataUrlToBlob(dataUrl));
          } catch (err) {
            reject(err instanceof Error ? err : new Error("Canvas export failed."));
          }
        }
      },
      mime,
      quality
    );
  });
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Rasterise an SVG to a PNG blob. */
export async function svgToPngBlob(
  svg: string,
  options: RasterOptions
): Promise<Blob> {
  const canvas = await renderSvgToCanvas(svg, options);
  return canvasToBlob(canvas, "image/png");
}

/**
 * Rasterise an SVG to a WebP blob. WebP keeps an alpha channel, so a
 * transparent request stays transparent.
 *
 * Some browsers silently fall back to PNG when WebP encoding is unavailable,
 * which would hand back a mislabelled file. We refuse instead of pretending.
 */
export async function svgToWebpBlob(
  svg: string,
  options: RasterOptions
): Promise<Blob> {
  const canvas = await renderSvgToCanvas(svg, options);
  const blob = await canvasToBlob(canvas, "image/webp", 0.92);
  if (blob.type !== "image/webp") {
    throw new Error(
      "This browser cannot encode WebP images. Try PNG or JPEG instead."
    );
  }
  return blob;
}

/**
 * Rasterise an SVG to a JPEG blob. JPEG has no alpha channel, so a transparent
 * request is coerced to a solid white background.
 */
export async function svgToJpegBlob(
  svg: string,
  options: RasterOptions
): Promise<Blob> {
  const background: ExportBackground =
    options.background === "transparent" ? "white" : options.background;
  const canvas = await renderSvgToCanvas(svg, { ...options, background });
  return canvasToBlob(canvas, "image/jpeg", 0.95);
}

export { sanitizeSvg };
