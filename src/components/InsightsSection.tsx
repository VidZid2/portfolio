"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";
import ScrambleText, { type ScrambleTextRef } from "@/components/ruixen/scramble-text";
import { usePerformance } from "@/hooks/usePerformance";
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

const DOT_MASK_HORIZONTAL = {
  maskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
};

const DOT_MASK_VERTICAL = {
  maskImage:
    "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
};

export function InsightsSection({
  hasSeenScrollAnimations = false,
}: {
  hasSeenScrollAnimations?: boolean;
}) {
  const phase = useArcReveal();
  const { isLowTier } = usePerformance();
  const skip = hasSeenScrollAnimations || isLowTier;
  const scrambleRef = useRef<ScrambleTextRef>(null);
  const { insights } = useVisitorAnalytics();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";
  const visitorsColor = isDark ? "#ffffff" : "#000000";
  const sessionsColor = isDark ? "#71717a" : "#52525b";
  const crosshairColor = isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.25)";

  return (
    <motion.div
      id="insights"
      className="mt-0 flex flex-col relative z-10 scroll-mt-24"
      initial={skip ? "visible" : "hidden"}
      whileInView={skip ? undefined : phase === "done" ? "visible" : "hidden"}
      animate={skip ? "visible" : undefined}
      viewport={{ once: true, amount: 0.1 }}
      transition={isLowTier ? { duration: 0 } : undefined}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      {/* Top full-width line */}
      <div
        className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={DOT_MASK_HORIZONTAL}
      />
      {/* Top Line Intersections */}
      <div className="absolute top-0 -left-3 sm:-left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute top-0 -right-3 sm:-right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

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

        {/* Header Bottom Line */}
        <div
          className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />
        {/* Bottom Line Intersections */}
        <div className="absolute bottom-0 -left-3 sm:-left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 -right-3 sm:-right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        }}
        className="relative"
      >
        <dl className="grid grid-cols-2 md:grid-cols-4 relative">
          {/* Mobile middle horizontal divider */}
          <div
            className="md:hidden absolute top-1/2 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
            style={DOT_MASK_HORIZONTAL}
          />
          <div className="md:hidden absolute top-1/2 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
          <div className="md:hidden absolute top-1/2 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

          {/* Metric 1: Visitors */}
          <Metric className="p-3 sm:p-4 relative">
            <MetricLabel>
              <span>Visitors</span>
              <MetricChange value={insights.changes.uniqueVisitors} />
            </MetricLabel>
            <MetricValue className="text-xl sm:text-2xl font-bold mt-1">
              {insights.summary.uniqueVisitors.toLocaleString("en-US")}
            </MetricValue>
            {/* Right vertical dotted divider */}
            <div
              className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
              style={DOT_MASK_VERTICAL}
            />
            <div className="absolute top-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          </Metric>

          {/* Metric 2: Total Sessions */}
          <Metric className="p-3 sm:p-4 relative">
            <MetricLabel>
              <span>Total Sessions</span>
              <MetricChange value={insights.changes.totalSessions} />
            </MetricLabel>
            <MetricValue className="text-xl sm:text-2xl font-bold mt-1">
              {insights.summary.totalSessions.toLocaleString("en-US")}
            </MetricValue>
            {/* Right vertical dotted divider (Desktop only) */}
            <div
              className="hidden md:block absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
              style={DOT_MASK_VERTICAL}
            />
            <div className="hidden md:block absolute top-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
            <div className="hidden md:block absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          </Metric>

          {/* Metric 3: Screen Views */}
          <Metric className="p-3 sm:p-4 relative">
            <MetricLabel>
              <span>Screen Views</span>
              <MetricChange value={insights.changes.totalScreenViews} />
            </MetricLabel>
            <MetricValue className="text-xl sm:text-2xl font-bold mt-1">
              {insights.summary.totalScreenViews.toLocaleString("en-US")}
            </MetricValue>
            {/* Right vertical dotted divider */}
            <div
              className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
              style={DOT_MASK_VERTICAL}
            />
            <div className="absolute top-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
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
      </motion.div>

      {/* Divider above chart */}
      <div className="relative h-0">
        <div
          className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />
        {/* Intersections */}
        <div className="absolute top-0 -left-3 sm:-left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute top-0 -right-3 sm:-right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
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
        {/* Top Horizontal Line (above caption) */}
        <div
          className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />
        {/* Top Line Intersections */}
        <div className="absolute top-0 -left-3 sm:-left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute top-0 -right-3 sm:-right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

        <p className="text-[11px] sm:text-[12px] text-zinc-500 dark:text-zinc-400 font-sans tracking-tight">
          <span className="text-zinc-800 dark:text-zinc-200 font-medium">Daily visitor traffic and engagement metrics.</span>
        </p>
      </motion.div>

      {/* Bottom full-width line for the entire section */}
      <div
        className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={DOT_MASK_HORIZONTAL}
      />
      {/* Bottom Line Intersections */}
      <div className="absolute bottom-0 -left-3 sm:-left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute bottom-0 -right-3 sm:-right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
    </motion.div>
  );
}
