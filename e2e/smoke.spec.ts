import { expect, test } from "@playwright/test";
import { ROUTES, seedReturningVisitor } from "./fixtures";

for (const route of ROUTES) {
  test(`route ${route} renders without client errors`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await seedReturningVisitor(page, "dark");
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `HTTP status for ${route}`).toBe(200);

    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).not.toContainText("Application error");
    expect(pageErrors, `uncaught exceptions on ${route}`).toEqual([]);
  });
}

test("command palette opens with Ctrl+K and closes with Escape", async ({ page }) => {
  await seedReturningVisitor(page, "dark");
  await page.goto("/", { waitUntil: "networkidle" });

  await page.keyboard.press("ControlOrMeta+k");
  const paletteInput = page.locator("[cmdk-input]");
  await expect(paletteInput).toBeVisible();
  // The palette is a proper modal dialog now.
  await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(paletteInput).toBeHidden();
});

test("project card is keyboard-accessible (Enter opens detail route)", async ({ page }) => {
  await seedReturningVisitor(page, "dark");
  await page.goto("/projects", { waitUntil: "networkidle" });

  const card = page.getByRole("link", { name: /View STI eLMS.*project details/i });
  await card.focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/projects/sti-elms**");
  await expect(page.locator("body")).toContainText(/eLMS/i);
});

test("project card click navigates to project detail", async ({ page }) => {
  await seedReturningVisitor(page, "dark");
  await page.goto("/projects", { waitUntil: "networkidle" });

  await page.getByRole("heading", { name: /STI eLMS/i }).click();
  await page.waitForURL("**/projects/sti-elms**");
  await expect(page.locator("body")).toContainText(/eLMS/i);
});
