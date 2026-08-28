"use client";

import React from "react";
import Markdown from "react-markdown";
import { motion } from "framer-motion";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { SubpageHeader } from "@/components/SubpageHeader";
import {
  TimescaleAge,
  TimescaleContent,
  TimescaleHeader,
  TimescaleIntroScroll,
  TimescaleItem,
  TimescaleRail,
  TimescaleRoot,
  TimescaleTick,
  TimescaleTrack,
  TimescaleViewport,
  TimescaleYear,
} from "@/components/timescale";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";

type Milestone = {
  version: string;
  date: string;
  content?: string;
};

const MILESTONES: Milestone[] = [
  {
    version: "0.1",
    date: "2025",
    content: `### 0.1 Start — Initial Portfolio Launch

The foundation of the portfolio was established.

- Built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **TypeScript**.
- Interactive career experience roadmap and education milestones.
- Work highlights with case studies and verified credentials.
- Theme engine with seamless dark and light mode persistence.`,
  },
  {
    version: "0.1.1",
    date: "Jan 2026",
    content: `### Responsive Architecture & Command Menu

- Mobile-first layout optimizations and fluid touch gestures.
- Custom command palette menu (⌘K / Ctrl+K).
- Sound engine prototypes with web audio synthesis.`,
  },
  {
    version: "0.1.2",
    date: "Mar 2026",
    content: `### Interactive Preview Sandbox

- Sandboxed live iframe previews for featured agency builds.
- Dynamic route metadata and open graph share cards.
- Performance optimization with sub-second page loads.`,
  },
  {
    version: "0.1.5",
    date: "May 2026",
    content: `### AI Terminal & Credential Viewer

- Interactive AI prompt box terminal with natural language assistant.
- Dual-mode certificate viewer with photo and vector PDF inspection.
- Enhanced animations with fluid spring physics.`,
  },
  {
    version: "0.1.8",
    date: "Jul 2026",
    content: `### Design System & Telemetry Foundation

- Custom UI primitives inspired by top open-source engineering standards.
- Micro-interactions and fluid hover states.
- Telemetry analytics collector groundwork.`,
  },
  {
    version: "0.2",
    date: "Jul 2026",
    content: `### 0.2 Start — Blueprint Overhaul

Major architectural redesign and interactive blueprint system.

- **Blueprint UI Grid**: Dotted margin guidelines, intersection crosshairs, and monospaced typography.
- **Motion Engine**: Integrated center-morph modals, action swap cascade text-roll animations, and spring physics.
- **Live Analytics**: Real-time telemetry tracking unique visitors, session metrics, and live charts.
- **Ruler Timescale**: Interactive horizontal drag-to-scroll changelog and milestone tracker.
- **Community Support**: Integrated sponsor drawers for PayPal, Ko-fi, and seamless curve transitions.
- **Creator Inspirations**: 3D convex cylinder carousel honoring open-source UI libraries.`,
  },
  {
    version: "0.2.1",
    date: "Aug 2026",
    content: `### 0.2.1 — Engineering Overhaul (Security · A11y · Testing)

A hardening pass across the whole codebase — no visual redesign, every change screenshot-verified.

- **Security**: Locked the GitHub API proxy to three hardcoded PR queries (was an open token proxy), model whitelist + payload caps on the chat route, Upstash-backed rate limiting for chat and insights, zod-validated telemetry with retention caps.
- **Code quality**: 256 lint errors and 62 warnings → zero, enforced in CI. Real types replaced \`any\` stubs (d3-shape curve factories, Radix, embedpdf). 16 orphaned dependencies removed.
- **Accessibility**: Project cards are real links now (keyboard users can open projects), command palette and video lightbox have proper dialog semantics, OS-level reduced-motion is respected, and axe-core WCAG 2.1 A/AA scans run on every route in CI.
- **Dedup**: Blueprint divider tokens, palette rows, section reveal gates and PDF toolbar controls each collapsed to a single source of truth (~400 lines of copy-paste removed).
- **Testing**: 40 golden screenshots (10 routes × light/dark × mobile/desktop) gate every refactor locally; 30 unit tests; smoke + a11y suites run on every push.`,
  },
];

export default function ChangelogPage() {
  return (
    <BlueprintGrid
      expandContentMargins
      headerSlot={
        <SubpageHeader
          title="Portfolio Changelog"
          subtitle="From 0.1 Start to 0.2.1 (Now) — Evolution & Milestones"
          backHref="/"
        />
      }
    >
      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)", y: 12 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="w-full pt-[calc(22vh+112px)] pb-16 px-3 sm:px-4 md:px-6 lg:px-8 flex flex-col z-10 relative overflow-hidden"
      >
        <div className="relative py-2 w-full">
          <TimescaleIntroScroll>
            <TimescaleRoot className="mt-2">
              <TimescaleHeader>
                <TimescaleAge>VER</TimescaleAge>
                <TimescaleYear>DATE</TimescaleYear>
              </TimescaleHeader>

              <TimescaleViewport>
                <TimescaleTrack>
                  <TimescaleRail />

                  {MILESTONES.map((milestone) => (
                    <TimescaleItem
                      key={milestone.version}
                      isActive={milestone.version === "0.2"}
                    >
                      <TimescaleTick />

                      <TimescaleAge>{milestone.version}</TimescaleAge>
                      <TimescaleYear>{milestone.date}</TimescaleYear>

                      {milestone.content && (
                        <TimescaleContent className="typeset typeset-timescale">
                          <Markdown>{milestone.content}</Markdown>
                        </TimescaleContent>
                      )}
                    </TimescaleItem>
                  ))}
                </TimescaleTrack>
              </TimescaleViewport>
            </TimescaleRoot>
          </TimescaleIntroScroll>
        </div>

        {/* Bottom Blueprint Separator */}
        <div className="relative mt-8">
          <div
            className="absolute bleed-x h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_HORIZONTAL}
          />
        </div>
      </motion.div>
    </BlueprintGrid>
  );
}
