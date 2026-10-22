import { describe, expect, it } from "vitest";

import { absoluteUrl, site, siteUrl } from "@/lib/seo/site";

describe("seo site config", () => {
  it("resolves to an absolute origin without a trailing slash", () => {
    expect(siteUrl).toMatch(/^https?:\/\/[^/]+$/);
  });

  it("builds absolute urls from either form", () => {
    expect(absoluteUrl("/editor")).toBe(`${siteUrl}/editor`);
    expect(absoluteUrl("editor")).toBe(`${siteUrl}/editor`);
    expect(absoluteUrl()).toBe(`${siteUrl}/`);
  });

  it("keeps the meta description within the length search engines render", () => {
    // Roughly 155 characters is the sweet spot; beyond about 170 it is
    // truncated in results.
    expect(site.description.length).toBeGreaterThan(70);
    expect(site.description.length).toBeLessThanOrEqual(170);
  });

  it("carries a usable keyword set", () => {
    expect(site.keywords.length).toBeGreaterThan(5);
    expect(new Set(site.keywords).size).toBe(site.keywords.length);
  });

  it("has an author and a repository to attribute the work to", () => {
    expect(site.author.length).toBeGreaterThan(0);
    expect(site.repoUrl).toMatch(/^https:\/\/github\.com\//);
  });
});
