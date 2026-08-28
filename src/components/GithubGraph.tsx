"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { GithubCalendar } from "@/components/ui/github-calendar";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";

export function GithubGraph({ hasSeenScrollAnimations = false }: { hasSeenScrollAnimations?: boolean }) {
  const { phase, skip } = useSectionReveal(hasSeenScrollAnimations);
  const { resolvedTheme } = useTheme();
  // Guarded so the hydration render agrees with SSR (light fills) —
  // next-themes resolves the real theme just after hydration, and the
  // calendar re-renders with dark fills then. Without this the `fill`
  // attributes mismatch and React logs a hydration error.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isDark = mounted && resolvedTheme === "dark";
  const [cellSize, setCellSize] = useState(14.5);
  const [cellGap, setCellGap] = useState(3.5);
  const [monthsToShow, setMonthsToShow] = useState(12);
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const checkSize = () => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        setCellSize(12.5);
        setCellGap(3);
        setMonthsToShow(5); // 5 months on mobile for compact fit
        setDeviceType("mobile");
      } else if (window.matchMedia('(max-width: 1024px)').matches) {
        setCellSize(13.5);
        setCellGap(3.5);
        setMonthsToShow(6); // 6 months on tablet
        setDeviceType("tablet");
      } else {
        setCellSize(14.5);
        setCellGap(3.5);
        setMonthsToShow(12); // Full 12-month year on desktop
        setDeviceType("desktop");
      }
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const blueTheme = {
    level0: isDark ? "rgba(39, 39, 42, 0.4)" : "#f4f4f5",
    level1: isDark ? "rgba(100, 149, 237, 0.4)" : "rgba(100, 149, 237, 0.3)",
    level2: "rgba(100, 149, 237, 0.6)",
    level3: "rgba(100, 149, 237, 0.8)",
    level4: "rgba(100, 149, 237, 1)",
  };

  const calculateStartDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsToShow);
    d.setDate(1); // Start near the beginning of that month
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  return (
    <motion.section
      layout
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className="relative z-10 mt-0 flex flex-col scroll-mt-24"
      aria-labelledby="github-activity-title"
      aria-describedby="github-activity-summary"
      initial={skip ? "visible" : "hidden"}
      whileInView={skip ? undefined : (phase === "done" ? "visible" : "hidden")}
      animate={skip ? "visible" : undefined}
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } }
      }}
    >
      <p id="github-activity-summary" className="sr-only">
        Calendar heatmap showing daily GitHub contribution counts for Josiah De Asis over the last year. Scroll horizontally to inspect all weeks.
      </p>

      {/* Graph content — sits directly below Socials separator (Matching Reference Picture 1) */}
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 240, damping: 28 }}
        variants={{
          hidden: { opacity: 0, scale: 0.98, y: 10 },
          visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
        }}
        className="relative pt-3.5 pb-4 sm:pb-5 w-full px-2.5 sm:px-3 overflow-visible"
      >
        <GithubCalendar 
          username="VidZid2" 
          theme={blueTheme} 
          showStats={true} 
          cellSize={cellSize}
          cellGap={cellGap}
          startDate={calculateStartDate()}
          deviceType={deviceType}
          className="!border-0 w-full flex-1 max-w-full" 
        />
      </motion.div>

      {/* Bottom solid line before AboutSection — spans between margin guides */}
      <div
        className="absolute bottom-0 bleed-x h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={DOT_MASK_HORIZONTAL}
      />
    </motion.section>
  );
}
