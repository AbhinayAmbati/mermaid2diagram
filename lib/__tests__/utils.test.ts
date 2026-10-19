import { describe, expect, it } from "vitest";

import { clamp, formatBytes, toSafeFileName } from "@/lib/utils";

describe("toSafeFileName", () => {
  it("strips path separators and unsafe characters", () => {
    expect(toSafeFileName("../../etc/passwd")).not.toContain("/");
    expect(toSafeFileName("my diagram")).toBe("my-diagram");
  });

  it("falls back when the result would be empty", () => {
    expect(toSafeFileName("///")).toBe("diagram");
    expect(toSafeFileName("", "fallback")).toBe("fallback");
  });

  it("truncates very long names", () => {
    expect(toSafeFileName("a".repeat(200)).length).toBeLessThanOrEqual(80);
  });
});

describe("formatBytes", () => {
  it("formats byte sizes readably", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });
});

describe("clamp", () => {
  it("bounds values to the given range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});
