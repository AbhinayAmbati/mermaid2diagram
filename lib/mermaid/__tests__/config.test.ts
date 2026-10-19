import { describe, expect, it } from "vitest";

import { DEFAULT_SETTINGS, PRESETS, buildMermaidConfig } from "@/lib/mermaid/config";

describe("buildMermaidConfig", () => {
  it("keeps Mermaid's security level strict", () => {
    const config = buildMermaidConfig(DEFAULT_SETTINGS);
    expect(config.securityLevel).toBe("strict");
  });

  it("never lets Mermaid render its own error graphics into the page", () => {
    const config = buildMermaidConfig(DEFAULT_SETTINGS);
    expect(config.suppressErrorRendering).toBe(true);
  });

  it("disables html labels so raster export renders text reliably", () => {
    const config = buildMermaidConfig(DEFAULT_SETTINGS);
    expect(config.flowchart?.htmlLabels).toBe(false);
    expect(config.class?.htmlLabels).toBe(false);
  });

  it("lays flowcharts out with generous spacing between nodes and ranks", () => {
    const config = buildMermaidConfig(DEFAULT_SETTINGS);
    expect(config.flowchart?.nodeSpacing).toBeGreaterThanOrEqual(60);
    expect(config.flowchart?.rankSpacing).toBeGreaterThanOrEqual(70);
    expect(config.flowchart?.diagramPadding).toBeGreaterThanOrEqual(16);
  });

  it("routes flowchart edges as straight lines so they stay traceable", () => {
    // Mermaid's default `basis` spline bundles edges together on diagrams with
    // many cross-cluster links, which makes them impossible to follow.
    const config = buildMermaidConfig(DEFAULT_SETTINGS);
    expect(config.flowchart?.curve).toBe("linear");
  });

  it("uses the ELK layout engine by default so edges do not cross", () => {
    expect(buildMermaidConfig(DEFAULT_SETTINGS).flowchart?.defaultRenderer).toBe(
      "elk"
    );
    expect(
      buildMermaidConfig({ ...DEFAULT_SETTINGS, layoutEngine: "dagre" }).flowchart
        ?.defaultRenderer
    ).toBe("dagre-wrapper");
  });

  it("maps settings onto theme variables", () => {
    const config = buildMermaidConfig({
      ...DEFAULT_SETTINGS,
      fontSize: 18,
      fontFamily: "Inter, sans-serif",
      themeVariables: { primaryColor: "#123456" },
    });
    expect(config.themeVariables?.fontSize).toBe("18px");
    expect(config.themeVariables?.fontFamily).toBe("Inter, sans-serif");
    expect(config.themeVariables?.primaryColor).toBe("#123456");
  });

  it("ships four appearance presets with distinct ids", () => {
    const ids = PRESETS.map((p) => p.id);
    expect(ids).toEqual(["classic", "monochrome", "lime-signal", "soft-minimal"]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
