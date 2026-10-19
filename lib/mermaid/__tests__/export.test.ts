import { describe, expect, it } from "vitest";

import { EXPORT_FORMATS, getExportFormat, runExport } from "@/lib/mermaid/export";

describe("export format metadata", () => {
  it("advertises exactly the formats that are implemented", () => {
    expect(EXPORT_FORMATS.map((f) => f.id)).toEqual([
      "svg",
      "png",
      "webp",
      "jpeg",
      "pdf",
      "mmd",
    ]);
  });

  it("only marks scale as supported for raster formats", () => {
    expect(getExportFormat("png").supportsScale).toBe(true);
    expect(getExportFormat("webp").supportsScale).toBe(true);
    expect(getExportFormat("jpeg").supportsScale).toBe(true);
    expect(getExportFormat("svg").supportsScale).toBe(false);
    expect(getExportFormat("pdf").supportsScale).toBe(false);
  });

  it("uses the webp extension for WebP files", () => {
    expect(getExportFormat("webp").extension).toBe("webp");
    expect(getExportFormat("webp").supportsBackground).toBe(true);
  });

  it("only marks orientation as supported for PDF", () => {
    const withOrientation = EXPORT_FORMATS.filter((f) => f.supportsOrientation);
    expect(withOrientation.map((f) => f.id)).toEqual(["pdf"]);
  });

  it("uses the jpg extension for JPEG files", () => {
    expect(getExportFormat("jpeg").extension).toBe("jpg");
  });
});

describe("runExport", () => {
  it("downloads the Mermaid source as a .mmd file", async () => {
    const result = await runExport({
      svg: null,
      source: "flowchart TD\n  A --> B",
      options: {
        format: "mmd",
        fileName: "my-diagram",
        scale: 1,
        background: "white",
        orientation: "landscape",
      },
    });
    expect(result.ok).toBe(true);
    expect(result.filename).toBe("my-diagram.mmd");
  });

  it("refuses to export an image format without a rendered diagram", async () => {
    const result = await runExport({
      svg: null,
      source: "flowchart TD\n  A --> B",
      options: {
        format: "png",
        fileName: "diagram",
        scale: 2,
        background: "white",
        orientation: "landscape",
      },
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/render a valid diagram/i);
  });

  it("sanitises unsafe characters out of the file name", async () => {
    const result = await runExport({
      svg: null,
      source: "flowchart TD\n  A --> B",
      options: {
        format: "mmd",
        fileName: "../../etc/passwd",
        scale: 1,
        background: "white",
        orientation: "landscape",
      },
    });
    expect(result.ok).toBe(true);
    expect(result.filename).not.toContain("/");
    expect(result.filename?.endsWith(".mmd")).toBe(true);
  });
});
