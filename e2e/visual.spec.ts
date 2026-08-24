import { expect, test } from "@playwright/test";
import { ROUTES, seedReturningVisitor } from "./fixtures";

// Golden-reference screenshots are only meaningful on the machine that
// captured them (font rasterization differs across OSes). CI runs smoke only.
//
// NOTE: run with reduced parallelism (--workers=3, set in the
// `test:e2e:visual` script). At full 20-worker parallelism, the SSR fetches
// for live data (GitHub contributions API, PR search) saturate the upstream
// services and pages render their fallback states mid-run, producing
// false-positive diffs. Routes with live data can still drift day-to-day:
//   npx playwright test e2e/visual.spec.ts -g "golden (light|dark) /$" --update-snapshots
test.skip(Boolean(process.env.CI), "visual baselines are captured/compared locally");

// Decorative canvases (WebGL shaders, particle fields, PDF tiles) re-render
// continuously and can never produce two identical frames — masked everywhere.
// The swirl wrapper also covers pointer-trail effects painted outside its canvas.
const GLOBAL_MASKS = ["canvas", ".swirl-mask-responsive"];

/** Routes whose async content (PDF tiles, PR fetches) needs extra settle time. */
const SETTLE_MS: Record<string, number> = {
  "/resume": 6000,
  "/pull-requests": 4000,
};

for (const theme of ["light", "dark"] as const) {
  for (const route of ROUTES) {
    test(`golden ${theme} ${route}`, async ({ page }) => {
      await seedReturningVisitor(page, theme);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(SETTLE_MS[route] ?? 2500);

      await expect(page).toHaveScreenshot(`${theme}${route === "/" ? "-home" : route.replace(/\//g, "_")}.png`, {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.03,
        timeout: 15_000,
        mask: GLOBAL_MASKS.map((sel) => page.locator(sel)),
      });
    });
  }
}
