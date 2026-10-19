import { describe, expect, it } from "vitest";

import { DEFAULT_SOURCE, TEMPLATES, getTemplate } from "@/lib/examples/templates";

const VALID_HEADERS = [
  "flowchart",
  "graph",
  "sequenceDiagram",
  "classDiagram",
  "stateDiagram",
  "stateDiagram-v2",
  "erDiagram",
  "journey",
  "gantt",
  "pie",
  "gitGraph",
  "mindmap",
  "timeline",
  "requirementDiagram",
];

describe("example templates", () => {
  it("includes at least the ten required examples", () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(10);
  });

  it("gives every template a unique id and complete metadata", () => {
    const ids = new Set<string>();
    for (const template of TEMPLATES) {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(template.code.trim().length).toBeGreaterThan(0);
      ids.add(template.id);
    }
    expect(ids.size).toBe(TEMPLATES.length);
  });

  it("starts every template with a recognised Mermaid diagram header", () => {
    for (const template of TEMPLATES) {
      const firstLine = template.code.trim().split("\n")[0].trim();
      const header = firstLine.split(/\s+/)[0];
      expect(
        VALID_HEADERS.includes(header),
        `"${template.id}" starts with "${header}"`
      ).toBe(true);
    }
  });

  it("exposes the default sample and a lookup helper", () => {
    expect(DEFAULT_SOURCE).toContain("flowchart TD");
    expect(getTemplate("basic-flowchart")?.code).toBe(DEFAULT_SOURCE);
    expect(getTemplate("does-not-exist")).toBeUndefined();
  });
});
