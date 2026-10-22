import { expect, test } from "@playwright/test";

test.describe("responsive navigation", () => {
  test("collapses the landing links behind a menu on a phone", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // The inline links step aside for the menu button.
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeHidden();
    const menuButton = page.getByRole("button", { name: "Open menu" });
    await expect(menuButton).toBeVisible();

    await menuButton.click();

    // And every destination is still reachable.
    const mobileNav = page.locator('[data-testid="mobile-nav"]');
    await expect(mobileNav).toBeVisible();
    for (const label of ["Engine", "Features", "Exports", "Examples"]) {
      await expect(mobileNav.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("shows the landing links inline on a desktop viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Open menu" })
    ).toBeHidden();
  });

  test("reaches the editor from the mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    const sheet = page.locator('[role="dialog"]');
    await expect(sheet).toBeVisible();
    await sheet.getByRole("link", { name: "Open editor" }).click();

    await expect(page).toHaveURL(/\/editor/);
  });

  test("keeps both bars inside a narrow viewport with no sideways scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });

    // The landing header.
    await page.goto("/");
    await expect(page.locator("header").first()).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      ),
      "the landing page should not scroll sideways at 360px"
    ).toBeLessThanOrEqual(1);

    // The editor bar, measured once the diagram has settled.
    await page.goto("/editor");
    await expect(
      page.locator('[data-testid="diagram-canvas"] svg').first()
    ).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      ),
      "the editor should not scroll sideways at 360px"
    ).toBeLessThanOrEqual(1);
  });
});
