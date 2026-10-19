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
    expect(ids).toEqual(["classic", "monochrome", "electric-blue", "soft-minimal"]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
