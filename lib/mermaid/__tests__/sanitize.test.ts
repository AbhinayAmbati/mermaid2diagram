import { describe, expect, it } from "vitest";

import { diagramTypeLabel, diagramTypeSlug } from "@/lib/mermaid/diagram-type";
import { getSvgSize } from "@/lib/mermaid/sanitize";

const SVG_WITH_VIEWBOX =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect width="10" height="10"/></svg>';

const SVG_WITH_DIMENSIONS =
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"></svg>';

describe("getSvgSize", () => {
  it("reads explicit width/height attributes", () => {
    expect(getSvgSize(SVG_WITH_DIMENSIONS)).toEqual({ width: 640, height: 360 });
  });

  it("falls back to the viewBox when dimensions are absent", () => {
    expect(getSvgSize(SVG_WITH_VIEWBOX)).toEqual({ width: 320, height: 180 });
  });

  it("returns a safe default for unparseable markup", () => {
    const size = getSvgSize("<not-an-svg />");
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThan(0);
  });
});

describe("diagram type labels", () => {
  it("maps Mermaid's internal ids to friendly labels", () => {
    expect(diagramTypeLabel("flowchart-v2")).toBe("Flowchart");
    expect(diagramTypeLabel("sequenceDiagram")).toBe("Sequence Diagram");
    expect(diagramTypeLabel("gitGraph")).toBe("Git Graph");
  });

  it("degrades gracefully for unknown types", () => {
    expect(diagramTypeLabel(undefined)).toBe("Unknown");
    expect(diagramTypeLabel("myNewDiagram")).toBe("MyNewDiagram");
  });

  it("produces file-name-safe slugs", () => {
    expect(diagramTypeSlug("flowchart-v2")).toBe("flowchart");
    expect(diagramTypeSlug("sequenceDiagram")).toBe("sequence");
    expect(diagramTypeSlug(undefined)).toBe("diagram");
  });
});
