import { describe, expect, it } from "vitest";

import { nextRenderId, parseMermaidError, renderDiagram } from "@/lib/mermaid/render";

describe("parseMermaidError", () => {
  it("extracts a line number when Mermaid reports one", () => {
    const error = parseMermaidError(
      new Error("Parse error on line 4: ... Expecting 'SEMI', got 'EOF'")
    );
    expect(error.line).toBe(4);
    expect(error.message.length).toBeGreaterThan(0);
  });

  it("falls back to a readable message for unknown throws", () => {
    const error = parseMermaidError("boom");
    expect(error.message).toContain("boom");
    expect(error.line).toBeUndefined();
  });

  it("handles non-string, non-error values", () => {
    const error = parseMermaidError(undefined);
    expect(typeof error.message).toBe("string");
    expect(error.message.length).toBeGreaterThan(0);
  });
});

describe("nextRenderId", () => {
  it("produces unique ids so repeated renders never collide", () => {
    const ids = new Set(Array.from({ length: 500 }, () => nextRenderId()));
    expect(ids.size).toBe(500);
  });

  it("produces ids valid for use as an element id", () => {
    expect(nextRenderId()).toMatch(/^[A-Za-z][\w-]*$/);
  });
});

describe("renderDiagram", () => {
  it("rejects empty source without loading Mermaid", async () => {
    await expect(
      renderDiagram({ source: "   ", config: {} as never, id: "test" })
    ).rejects.toThrow(/nothing to render/i);
  });
});
