import { expect, test } from "@playwright/test";

test.describe("mermaid2diagram editor", () => {
  test("renders the default diagram on load", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.locator('[data-testid="diagram-canvas"] svg').first()).toBeVisible();
    await expect(page.getByText("Mermaid Code")).toBeVisible();
  });

  test("updates the preview when the source changes", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.locator('[data-testid="diagram-canvas"] svg').first()).toBeVisible();

    const editor = page.locator(".cm-content").first();
    await editor.click();
    // Select everything and replace it with a new, valid diagram.
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type("flowchart LR\n  X[Alpha] --> Y[Omega]");

    await expect(page.locator('[data-testid="diagram-canvas"] svg').first()).toContainText(
      "Alpha"
    );
  });

  test("shows a helpful error for invalid syntax", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.locator('[data-testid="diagram-canvas"] svg').first()).toBeVisible();

    const editor = page.locator(".cm-content").first();
    await editor.click();
    await page.keyboard.press("ControlOrMeta+A");
    // Unambiguously invalid: Mermaid cannot detect a diagram type at all.
    await page.keyboard.type("this is definitely not valid mermaid");

    await expect(
      page.getByRole("heading", { name: /syntax error/i })
    ).toBeVisible();
  });

  test("downloads a genuine SVG file", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.locator('[data-testid="diagram-canvas"] svg').first()).toBeVisible();

    await page.getByRole("button", { name: "Export" }).first().click();
    await expect(
      page.getByRole("heading", { name: /download your diagram/i })
    ).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.svg$/);
  });

  test("scrolls the code window when the source outgrows the panel", async ({
    page,
  }) => {
    await page.goto("/editor");
    await expect(
      page.locator('[data-testid="diagram-canvas"] svg').first()
    ).toBeVisible();

    const editor = page.locator(".cm-content").first();
    await editor.click();
    await page.keyboard.press("ControlOrMeta+A");

    const filler = Array.from(
      { length: 120 },
      (_, i) => `  %% filler line ${i + 1}`
    ).join("\n");
    await page.keyboard.insertText(
      `flowchart TD\n  A[Start] --> B[End]\n${filler}`
    );

    const scroller = page.locator(".cm-scroller").first();

    // The window is a scroll container rather than a box that grows.
    const overflowY = await scroller.evaluate(
      (el: HTMLElement) => getComputedStyle(el).overflowY
    );
    expect(["auto", "scroll"]).toContain(overflowY);

    // The content genuinely exceeds the window...
    expect(
      await scroller.evaluate((el: HTMLElement) => el.scrollHeight > el.clientHeight)
    ).toBe(true);

    // ...and the window actually moves.
    await scroller.evaluate((el: HTMLElement) => {
      el.scrollTop = 240;
    });
    expect(
      await scroller.evaluate((el: HTMLElement) => el.scrollTop)
    ).toBeGreaterThan(0);
  });

  test("loads an example template from the landing page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Basic Flowchart/ }).click();
    await expect(page).toHaveURL(/example=basic-flowchart/);
    await expect(page.locator('[data-testid="diagram-canvas"] svg').first()).toBeVisible();
  });
});
