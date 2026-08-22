"use client";

import React from "react";
import Markdown from "react-markdown";
import { motion } from "framer-motion";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { SubpageHeader } from "@/components/SubpageHeader";
import {
  TimescaleAge,
  TimescaleBadge,
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

type Milestone = {
  version: string;
  date: string;
  badge?: string;
  badgeClass?: string;
  content?: string;
};

const MILESTONES: Milestone[] = [
  {
    version: "0.1",
    date: "2025",
    badge: "0.1",
    content: `### 0.1 Start — Initial Portfolio Launch

The foundation of the portfolio was established.

- Built with **Next.js**, **React**, **Tailwind CSS**, and **TypeScript**.
- Interactive career experience roadmap and education milestones.
- Work highlights with case studies and verified credentials.
- Theme engine with seamless dark and light mode persistence.`,
  },
  {
    version: "0.1.1",
    date: "Jan 2026",
    badge: "⌘",
    content: `### Responsive Architecture

- Mobile-first layout optimizations and touch gestures.
- Custom command palette menu (⌘K / Ctrl+K).
- Sound engine prototypes with web audio synthesis.`,
  },
  {
    version: "0.1.2",
    date: "Mar 2026",
    badge: "◫",
    content: `### Interactive Preview Engine

- Sandboxed live iframe previews for featured agency and client builds.
- Dynamic route metadata and social share cards.
- Performance tuning with sub-second page loads.`,
  },
  {
    version: "0.1.5",
    date: "May 2026",
    badge: "✦",
    content: `### AI Terminal & Credential Viewer

- Interactive AI prompt box terminal with natural language assistant.
- Dual-mode certificate viewer with photo and vector PDF inspection.
- Enhanced animations with spring physics.`,
  },
  {
    version: "0.1.8",
    date: "Jul 2026",
    badge: "⚡",
    content: `### Design System Evolution

- Custom UI primitives inspired by top open-source engineering standards.
- Micro-interactions and fluid hover states.
- Telemetry analytics collector groundwork.`,
  },
  {
    version: "0.2",
    date: "Now",
    badge: "0.2",
    badgeClass: "bg-[#6495ED]/15 text-[#6495ED] border-[#6495ED]/40 dark:bg-[#6495ED]/20 dark:text-[#38bdf8] dark:border-[#6495ED]/50",
    content: `### 0.2 Start — Blueprint Overhaul (Current)

Major architectural redesign and interactive blueprint system.

- **Blueprint UI Grid**: Dotted margin guidelines, intersection crosshairs, and monospaced typography.
- **Motion Engine**: Integrated center-morph modals, action swap cascade text-roll animations, and spring physics.
- **Live Analytics**: Real-time telemetry tracking unique visitors, session metrics, and live charts.
- **Ruler Timescale**: Interactive horizontal drag-to-scroll changelog and milestone tracker.
- **Community Support**: Integrated sponsor drawers for PayPal, Ko-fi, and seamless curve transitions.
- **Creator Inspirations**: 3D convex cylinder carousel honoring open-source UI libraries.`,
  },
];

export default function ChangelogPage() {
  return (
    <BlueprintGrid
      wideContent
      headerSlot={
        <SubpageHeader
          title="Portfolio Changelog"
          subtitle="From 0.1 Start to 0.2 Start (Now) — Evolution & Milestones"
          backHref="/"
        />
      }
    >
      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)", y: 12 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="w-full pt-[calc(22vh+112px)] pb-16 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col z-10 relative overflow-hidden"
      >
        {/* Drag Hint Banner */}
        <div className="flex items-center justify-between text-[11.5px] sm:text-[12px] font-mono text-zinc-500 dark:text-zinc-400 pt-3 sm:pt-4 pb-3 px-2 sm:px-3 mb-2 select-none">
          <span className="flex items-center gap-2">
            <svg
              className="size-3.5 text-zinc-400 dark:text-zinc-500 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18-6-6 6-6" />
              <path d="m15 6 6 6-6 6" />
            </svg>
            Drag horizontally to explore timeline
          </span>
          <span className="hidden sm:inline text-zinc-400 dark:text-zinc-500">0.1 Start ➔ 0.2 Start (Now)</span>
        </div>

        <div className="relative py-2 w-full">
          <TimescaleIntroScroll>
            <TimescaleRoot className="mt-2">
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
                          {milestone.badge && (
                            <TimescaleBadge className={milestone.badgeClass}>
                              {milestone.badge}
                            </TimescaleBadge>
                          )}
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
            className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />
          <div className="absolute -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>
      </motion.div>
    </BlueprintGrid>
  );
}
