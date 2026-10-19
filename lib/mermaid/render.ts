import type { MermaidConfig, RenderError, RenderResult } from "@/types/diagram";

import { getSvgSize } from "./sanitize";

type MermaidApi = typeof import("mermaid").default;

/**
 * Mermaid is large and browser-only. We import it lazily and memoise the
 * module promise so it is fetched at most once per session, keeping it out of
 * the initial bundle and out of any server render.
 */
let mermaidPromise: Promise<MermaidApi> | null = null;

export function loadMermaid(): Promise<MermaidApi> {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((mod) => mod.default);
  }
  return mermaidPromise;
}

let idCounter = 0;

/** A fresh, collision-free id for each render pass. */
export function nextRenderId(): string {
  idCounter += 1;
  return `mermaid-studio-${Date.now().toString(36)}-${idCounter}`;
}

/**
 * Remove any nodes Mermaid may have left behind in the document (it injects a
 * temporary measurement element during render). Without this, repeated
 * renders accumulate orphaned elements and duplicate ids.
 */
function cleanupStrayNodes(id: string) {
  if (typeof document === "undefined") return;
  for (const selector of [`#${id}`, `#d${id}`]) {
    try {
      document.querySelectorAll(selector).forEach((node) => node.remove());
    } catch {
      /* ignore invalid selector */
    }
  }
}

/** Turn an unknown thrown value into a structured, human-readable error. */
export function parseMermaidError(error: unknown): RenderError {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Failed to render the diagram.";

  const lineMatch = raw.match(/line\s+(\d+)/i);
  const columnMatch = raw.match(/column\s+(\d+)/i);

  const cleaned = raw
    .replace(/^Error:\s*/i, "")
    .replace(/^Parse error on line \d+:\s*/i, "Parse error: ")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^[\^~]+$/.test(l))
    .join(" ")
    .replace(/\s+/g, " ")
    .slice(0, 400);

  return {
    message: cleaned || "Failed to render the diagram.",
    line: lineMatch ? Number(lineMatch[1]) : undefined,
    column: columnMatch ? Number(columnMatch[1]) : undefined,
  };
}

export interface RenderDiagramParams {
  source: string;
  config: MermaidConfig;
  id: string;
}

/**
 * Render Mermaid source to an SVG string. Throws a normalised error on invalid
 * syntax; the caller decides how to surface it. The generated SVG is returned
 * as a string and never injected into the document by this function.
 */
export async function renderDiagram({
  source,
  config,
  id,
}: RenderDiagramParams): Promise<RenderResult> {
  if (!source.trim()) {
    throw new Error("Nothing to render yet — add some Mermaid code to begin.");
  }

  const mermaid = await loadMermaid();

  // Re-initialise on every pass so theme/config changes always take effect.
  mermaid.initialize({ ...config, startOnLoad: false });

  let diagramType = "unknown";
  try {
    const detect = (mermaid as unknown as { detectType?: (t: string) => string })
      .detectType;
    if (typeof detect === "function") {
      diagramType = detect.call(mermaid, source) || "unknown";
    }
  } catch {
    // detectType throws on invalid input; render() below reports the real error.
  }

  try {
    const { svg } = await mermaid.render(id, source);
    const { width, height } = getSvgSize(svg);
    return { svg, diagramType, width, height };
  } finally {
    cleanupStrayNodes(id);
  }
}

/** Validate Mermaid source without producing output. */
export async function validateDiagram(source: string): Promise<boolean> {
  if (!source.trim()) return false;
  const mermaid = await loadMermaid();
  try {
    await mermaid.parse(source, { suppressErrors: false });
    return true;
  } catch {
    return false;
  }
}
