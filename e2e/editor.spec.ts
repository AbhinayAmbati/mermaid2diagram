import { expect, test } from "@playwright/test";

test.describe("Mermaid Studio editor", () => {
  test("renders the default diagram on load", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.locator(".mermaid-canvas svg").first()).toBeVisible();
    await expect(page.getByText("Mermaid Code")).toBeVisible();
  });

  test("updates the preview when the source changes", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.locator(".mermaid-canvas svg").first()).toBeVisible();

    const editor = page.locator(".cm-content").first();
    await editor.click();
    // Select everything and replace it with a new, valid diagram.
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type("flowchart LR\n  X[Alpha] --> Y[Beta]");

    await expect(page.locator(".mermaid-canvas svg").first()).toContainText(
      "Alpha"
    );
  });

  test("shows a helpful error for invalid syntax", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.locator(".mermaid-canvas svg").first()).toBeVisible();

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
    await expect(page.locator(".mermaid-canvas svg").first()).toBeVisible();

    await page.getByRole("button", { name: "Export" }).first().click();
    await expect(page.getByText("Export diagram")).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.svg$/);
  });

  test("loads an example template from the landing page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Basic Flowchart/ }).click();
    await expect(page).toHaveURL(/example=basic-flowchart/);
    await expect(page.locator(".mermaid-canvas svg").first()).toBeVisible();
  });
});
