import type { Page } from "@playwright/test";

export const ROUTES = [
  "/",
  "/projects",
  "/projects/prima-digital-agency",
  "/projects/sti-elms",
  "/experience",
  "/milestones",
  "/pull-requests",
  "/contact",
  "/resume",
];

/**
 * Seeds storage so every visit looks like a returning visitor:
 * - boot sequence skipped (localStorage "done")
 * - entrance animations skipped (sessionStorage flag)
 * - explicit theme (no system flicker)
 */
export async function seedReturningVisitor(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.addInitScript(
    ([t]) => {
      window.localStorage.setItem("portfolio-first-visit-v1", "done");
      window.localStorage.setItem("theme", t as string);
      window.sessionStorage.setItem("portfolio_animations_played_v3", "true");
    },
    [theme]
  );
}

