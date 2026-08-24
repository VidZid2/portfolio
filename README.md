# Josiah De Asis — Developer Portfolio

A fast, interactive developer portfolio built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

It showcases my front-end engineering work, experience, projects, and skills — with an **Ask AI** helper (⌘K command palette), live GitHub stats, a real-time visitor analytics dashboard, a blueprint-style design system, and a fully keyboard-accessible interface.

## Tech Stack

- **Framework:** Next.js 16 (App Router) · React 19
- **Styling:** Tailwind CSS v4 + CSS-variable design tokens
- **Motion:** Motion (Framer Motion) · OGL for WebGL scenes
- **UI primitives:** Radix UI, cmdk (command palette), embla-carousel
- **AI chat:** Vercel AI SDK (`useChat`) on the client; the API route streams from an OpenAI-compatible endpoint via `fetch`
- **PDF viewing:** @embedpdf (tiled rendering, zoom, search)
- **No database.** Content lives in typed TypeScript data files (`src/data/`). "Live" data comes from the GitHub API and a self-hosted insights collector backed by Upstash Redis.

## Environment Variables

| Variable | Required | Used by | Purpose |
|---|---|---|---|
| `GITHUB_TOKEN` | for `/pull-requests` | `POST /api/github` | Server-only GitHub GraphQL token for the locked PR-search proxy. The route accepts one of three hardcoded queries — it is not an open proxy. |
| `OPENZEN_API_KEY` | for Ask AI | `POST /api/chat` | Bearer key for the OpenAI-compatible chat completions endpoint. Without it the route serves a local fallback response. |
| `OPENZEN_BASE_URL` | no | `POST /api/chat` | Override the chat endpoint (default: `https://opencode.ai/zen/v1`). |
| `UPSTASH_REDIS_REST_URL` | production | rate limiting | Persistent, cross-instance rate limits for `/api/chat` (40/day per IP) and `/api/insights` (120/hour). Falls back to per-instance in-memory buckets when unset (local dev only). |
| `UPSTASH_REDIS_REST_TOKEN` | production | rate limiting | Auth token for the Upstash REST API. |

Server-only secrets are read exclusively inside API route handlers and are never shipped to the browser.

## Scripts

```bash
npm run dev             # Next dev server
npm run build           # production build
npm run start           # serve the production build
npm run lint            # eslint (0 errors / 0 warnings baseline)
npm run test            # vitest unit tests
npm run test:e2e        # Playwright: smoke + axe-core a11y scans (runs in CI)
npm run test:e2e:visual # Playwright: local-only golden screenshots (reduced parallelism — see e2e/visual.spec.ts)
```

CI (GitHub Actions) runs lint → typecheck → unit → build → smoke + a11y on every push.

## Architecture Notes

- **Blueprint design system** — dotted divider masks, hatch fills and intersection crosshairs are shared tokens in `src/lib/blueprint.ts`; page framing lives in `components/BlueprintGrid.tsx`.
- **Section reveal gate** — home sections share `hooks/use-section-reveal.ts` (first-visit entrance animations; skipped for returning visitors and low-tier devices).
- **Command palette** — `components/command-menu.tsx` renders rows from a config array; the dialog shell (`ui/command.tsx`) is a custom portal with `role="dialog"`, focus trapping and Escape handling.
- **API surface** is three routes: `/api/chat` (model-whitelisted, payload-capped, rate-limited), `/api/github` (three hardcoded PR queries), `/api/insights` (zod-validated telemetry with retention caps).
- **Testing gates** — 40 golden screenshots (10 routes × light/dark × mobile/desktop) verified locally before any refactor; axe-core WCAG 2.1 A/AA scans on every route in CI.

## Changelog

See `/changelog` on the site (source: `src/app/changelog/page.tsx`).
