import { beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_SOURCE } from "@/lib/examples/templates";
import { useDiagramStore } from "@/lib/store/use-diagram-store";

const store = () => useDiagramStore.getState();

describe("diagram store", () => {
  beforeEach(() => {
    // newDiagram clears both the source and the rendered output.
    store().newDiagram();
  });

  it("newDiagram clears the code and the preview together", () => {
    store().setSource("flowchart TD\n  A --> B");
    store().resolveRender("<svg />", "flowchart", 10, 10);

    store().newDiagram();

    expect(store().source).toBe("");
    expect(store().svg).toBeNull();
    expect(store().svgWidth).toBe(0);
    expect(store().status).toBe("idle");
  });

  it("reset swaps the source back to the sample", () => {
    store().setSource("flowchart TD\n  A --> B");
    store().reset();
    expect(store().source).toBe(DEFAULT_SOURCE);
  });

  it("reset keeps the rendered output so the canvas is never stranded blank", () => {
    // Regression: reset used to null the SVG while leaving the source alone if
    // it already matched the sample. The render pipeline only re-runs when the
    // source or settings change, so nothing refilled the canvas and the
    // diagram vanished for good.
    store().resolveRender("<svg />", "flowchart", 10, 10);

    store().reset();

    expect(store().source).toBe(DEFAULT_SOURCE);
    expect(store().svg).toBe("<svg />");
    expect(store().status).toBe("success");
  });

  it("reset with an unchanged source still leaves the diagram in place", () => {
    store().setSource(DEFAULT_SOURCE);
    store().resolveRender("<svg />", "flowchart", 10, 10);

    store().reset();

    expect(store().svg).toBe("<svg />");
    expect(store().status).toBe("success");
  });
});
