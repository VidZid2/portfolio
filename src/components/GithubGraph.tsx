"use client";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";

import React, { useEffect, useState } from "react";
import ScrambleText from "@/components/ruixen/scramble-text";
import { GithubCalendar } from "@/components/ui/github-calendar";
import { StatusDot } from "@/components/ui/status-dot";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { usePerformance } from "@/hooks/usePerformance";

export function GithubGraph({ hasSeenScrollAnimations = false }: { hasSeenScrollAnimations?: boolean }) {
  const phase = useArcReveal();
  const { isLowTier } = usePerformance();
  const skip = hasSeenScrollAnimations || isLowTier;
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [cellSize, setCellSize] = useState(12);
  const [cellGap, setCellGap] = useState(3);
  const [monthsToShow, setMonthsToShow] = useState(9);
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [dataStatus, setDataStatus] = useState<"live" | "down" | "loading">("loading");

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    const checkSize = () => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        setCellSize(14);
        setCellGap(4);
        setMonthsToShow(4); 
        setDeviceType("mobile");
      } else if (window.matchMedia('(max-width: 1024px)').matches) {
        setCellSize(14);
        setCellGap(4);
        setMonthsToShow(7);
        setDeviceType("tablet");
      } else {
        setCellSize(10);
        setCellGap(2);
        setMonthsToShow(9); 
        setDeviceType("desktop");
      }
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);


  const dashedLineMask = {
    maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
    WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  };

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
      className="relative z-10 mt-0 flex flex-col scroll-mt-24"
      aria-labelledby="github-activity-title"
      aria-describedby="github-activity-summary"
      initial={skip ? "visible" : "hidden"}
      whileInView={skip ? undefined : (phase === "done" ? "visible" : "hidden")}
      animate={skip ? "visible" : undefined}
      viewport={{ once: true, amount: 0.1 }}
      transition={isLowTier ? { duration: 0 } : undefined}
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
        variants={{
          hidden: { opacity: 0, scale: 0.98, y: 10 },
          visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
        }}
        className="relative pt-3 pb-2 w-full overflow-visible"
      >
        <GithubCalendar 
          username="VidZid2" 
          theme={blueTheme} 
          showStats={true} 
          cellSize={cellSize}
          cellGap={cellGap}
          startDate={calculateStartDate()}
          deviceType={deviceType}
          onStatusChange={setDataStatus}
          className="!border-0 w-full flex-1 max-w-full" 
        />
      </motion.div>

      {/* Bottom full-width dashed line before AboutSection */}
      <div
        className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 pointer-events-none dark:border-white/[0.15]"
        style={dashedLineMask}
      />
      <div className="absolute bottom-0 -left-4 z-20 size-[2px] -translate-x-1/2 translate-y-1/2 bg-black/50 pointer-events-none dark:bg-white/[0.25]" />
      <div className="absolute bottom-0 -right-4 z-20 size-[2px] translate-x-1/2 translate-y-1/2 bg-black/50 pointer-events-none dark:bg-white/[0.25]" />
    </motion.section>
  );
}
