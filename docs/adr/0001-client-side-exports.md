# ADR 0001 — Client-side exports instead of a server render service

- **Status:** Accepted
- **Date:** 2025-01

## Context

The product must let users export diagrams as SVG, PNG, PDF and JPEG. The
obvious alternative is a server endpoint that renders Mermaid to an image.

## Decision

Perform every conversion in the browser.

- SVG is produced directly from the rendered markup.
- PNG/JPEG are produced by drawing the SVG onto a `<canvas>`.
- PDF embeds a high-resolution raster of the diagram into a jsPDF A4 page.

## Rationale

- **Privacy.** Diagram content never leaves the user's device, which removes an
  entire class of data-handling concerns and satisfies the "no upload without
  consent" requirement by construction.
- **Cost & operations.** No render workers, no queue, no cold starts, no
  per-export infrastructure.
- **Latency.** No network round-trip; exports feel instant.
- **Scope.** The product genuinely does not need a backend, and the brief asks
  explicitly not to add one unless a core feature requires it.

## Consequences

- Export fidelity depends on the browser's canvas implementation. We mitigate
  this by disabling Mermaid's `<foreignObject>` labels (which rasterise
  unreliably) and by clamping raster dimensions to a safe ceiling.
- Very large diagrams are bounded by canvas size limits; the scale is reduced
  automatically when needed.
- Vector PDF is not offered; the raster path was chosen because Mermaid relies on
  CSS classes inside an inline `<style>` block, which pure-vector SVG→PDF
  converters do not resolve reliably.
