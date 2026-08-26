"use client";

import React, { useSyncExternalStore, useRef } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import ScrambleText, { type ScrambleTextRef } from "@/components/ruixen/scramble-text";
import { useVisitorAnalytics } from "@/hooks/useVisitorAnalytics";
import Grid from "@/components/charts/grid";
import LineChart, { Line } from "@/components/charts/line-chart";
import { ChartTooltip } from "@/components/charts/tooltip";
import {
  Metric,
  MetricChange,
  MetricLabel,
  MetricValue,
} from "@/components/metric";
import { formatDuration } from "@/components/metrics-01";
import { CornerMark } from "@/components/ui/corner-mark";
import { useSectionReveal } from "@/hooks/use-section-reveal";

export function InsightsSection({
  hasSeenScrollAnimations = false,
}: {
  hasSeenScrollAnimations?: boolean;
}) {
  const { phase, isLowTier, skip } = useSectionReveal(hasSeenScrollAnimations);
  const scrambleRef = useRef<ScrambleTextRef>(null);
  const { insights } = useVisitorAnalytics();
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isDark = mounted && resolvedTheme === "dark";

  // Single dynamic color theme matching Ruixen / shadcn token system
  const sessionsColor = isDark ? "#60a5fa" : "#2563eb"; // Blue-400 : Blue-600
  const visitorsColor = isDark ? "#a78bfa" : "#7c3aed"; // Violet-400 : Violet-600
  const crosshairColor = isDark ? "#71717a" : "#a1a1aa"; // Zinc-500 : Zinc-400

  return (
    <motion.div
      id="insights"
      className="mt-0 flex flex-col relative scroll-mt-24 w-full"
      initial={skip ? "visible" : "hidden"}
      whileInView={skip ? undefined : (phase === "done" ? "visible" : "hidden")}
      animate={skip ? "visible" : undefined}
      viewport={{ once: true, amount: 0.1 }}
      transition={isLowTier ? { duration: 0 } : undefined}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      <CornerMark position="top-left" />
      <CornerMark position="top-right" />
      <CornerMark position="bottom-left" />
      <CornerMark position="bottom-right" />

      {/* Top line — spans between margin guides */}
      <div className="absolute top-0 bleed-x h-0 border-t border-foreground/10 pointer-events-none" />

      {/* Header */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -10 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", bounce: 0.3 },
          },
        }}
        className="py-1 relative flex items-center justify-between min-h-[30px]"
      >
        <div className="flex items-center gap-2">
          <ScrambleText
            ref={scrambleRef}
            as="h2"
            className="text-[17px] sm:text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none"
          >
            Insights
          </ScrambleText>
        </div>

        {/* Header Bottom Line — spans between margin guides */}
        <div className="absolute bottom-0 bleed-x h-0 border-b border-foreground/10 pointer-events-none" />
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        }}
        className="relative"
      >
        <div className="relative">
          {/* Decorative divider layer */}
          <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-2 md:grid-cols-4">
            {/* Mobile middle horizontal divider */}
            <div className="md:hidden absolute top-1/2 left-0 right-0 h-0 border-b border-foreground/10" />

            {/* Metric 1 right divider */}
            <div className="relative">
              <div className="absolute top-0 bottom-0 right-0 w-0 border-r border-foreground/10" />
            </div>

            {/* Metric 2 right divider (Desktop only) */}
            <div className="relative">
              <div className="hidden md:block absolute top-0 bottom-0 right-0 w-0 border-r border-foreground/10" />
            </div>

            {/* Metric 3 right divider */}
            <div className="relative">
              <div className="absolute top-0 bottom-0 right-0 w-0 border-r border-foreground/10" />
            </div>

            {/* Metric 4 (Last column - no right divider) */}
            <div className="relative" />
          </div>

          <dl className="grid grid-cols-2 md:grid-cols-4">
            {/* Metric 1: Total Sessions */}
            <Metric className="p-3 sm:p-4 relative">
              <MetricLabel>
                <span>Total Sessions</span>
                <MetricChange value={insights.changes.totalSessions} />
              </MetricLabel>
              <MetricValue className="text-xl sm:text-2xl font-bold mt-1">
                {insights.summary.totalSessions.toLocaleString()}
              </MetricValue>
            </Metric>

            {/* Metric 2: Unique Visitors */}
            <Metric className="p-3 sm:p-4 relative">
              <MetricLabel>
                <span>Unique Visitors</span>
                <MetricChange value={insights.changes.uniqueVisitors} />
              </MetricLabel>
              <MetricValue className="text-xl sm:text-2xl font-bold mt-1">
                {insights.summary.uniqueVisitors.toLocaleString()}
              </MetricValue>
            </Metric>

            {/* Metric 3: Page Views */}
            <Metric className="p-3 sm:p-4 relative">
              <MetricLabel>
                <span>Page Views</span>
                <MetricChange value={insights.changes.totalScreenViews} />
              </MetricLabel>
              <MetricValue className="text-xl sm:text-2xl font-bold mt-1">
                {insights.summary.totalScreenViews.toLocaleString()}
              </MetricValue>
            </Metric>

            {/* Metric 4: Avg Duration */}
            <Metric className="p-3 sm:p-4 relative">
              <MetricLabel>
                <span>Avg Duration</span>
                <MetricChange value={insights.changes.avgSessionDuration} />
              </MetricLabel>
              <MetricValue className="text-xl sm:text-2xl font-bold mt-1">
                {formatDuration(insights.summary.avgSessionDuration)}
              </MetricValue>
            </Metric>
          </dl>
        </div>
      </motion.div>

      {/* Divider above chart */}
      <div className="relative h-0">
        <div className="absolute top-0 bleed-x h-0 border-b border-foreground/10 pointer-events-none" />
      </div>

      {/* Line Chart */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.98 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
        }}
        className="py-4 px-1 sm:px-2 relative w-full overflow-hidden"
      >
        {insights.series.length > 0 ? (
          <LineChart
            className="w-full aspect-[2/1] sm:aspect-[2.5/1] md:aspect-[3/1] min-h-[220px]"
            data={insights.series}
            margin={{ top: 20, right: 24, bottom: 48, left: 24 }}
          >
            <Grid horizontal />
            <Line
              dataKey="totalSessions"
              stroke={sessionsColor}
              strokeWidth={2}
            />
            <Line
              dataKey="uniqueVisitors"
              stroke={visitorsColor}
              strokeWidth={2}
            />
            <ChartTooltip
              indicatorColor={crosshairColor}
              rows={(point) => [
                {
                  label: "Total Sessions",
                  value: (point.totalSessions as number) ?? 0,
                  color: sessionsColor,
                },
                {
                  label: "Visitors",
                  value: (point.uniqueVisitors as number) ?? 0,
                  color: visitorsColor,
                },
              ]}
            />
          </LineChart>
        ) : (
          <div className="grid aspect-2/1 w-full place-content-center md:aspect-3/1">
            <p className="text-muted-foreground text-sm">No insights available.</p>
          </div>
        )}
      </motion.div>

      {/* Figure Caption / Attribution Row */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 5 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        }}
        className="relative py-2 px-3 flex items-center justify-center text-center select-none"
      >
        {/* Top Horizontal Line (above caption) — spans between margin guides */}
        <div className="absolute top-0 bleed-x h-0 border-t border-foreground/10 pointer-events-none" />

        <p className="text-[11px] sm:text-[12px] text-zinc-500 dark:text-zinc-400 font-sans tracking-tight">
          <span className="text-zinc-800 dark:text-zinc-200 font-medium">Daily visitor traffic and engagement metrics.</span>
        </p>
      </motion.div>

      {/* Bottom line for the entire section — spans between margin guides */}
      <div className="absolute bottom-0 bleed-x h-0 border-b border-foreground/10 pointer-events-none" />
    </motion.div>
  );
}
