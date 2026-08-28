"use client";

import React from "react";
import { motion } from "framer-motion";
import ScrambleText from "@/components/ruixen/scramble-text";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { TransitionLink } from "@/components/TransitionLink";
import { CornerMark } from "@/components/ui/corner-mark";
import { DOT_MASK_HORIZONTAL, DOT_MASK_VERTICAL } from "@/lib/blueprint";
import { useSectionReveal } from "@/hooks/use-section-reveal";

export function ProjectsSection({ hasSeenScrollAnimations = false }: { hasSeenScrollAnimations?: boolean }) {
  const { phase, isLowTier, skip } = useSectionReveal(hasSeenScrollAnimations);
  return (
    <motion.div 
      id="projects" 
      className="mt-0 flex flex-col relative z-10 scroll-mt-24 w-full"
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
      {/* Top line — spans between margin guides */}
      <div
        className="absolute top-0 bleed-x h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={DOT_MASK_HORIZONTAL}
      />
      <CornerMark position="top-left" />
      <CornerMark position="top-right" />

      <motion.div 
        variants={{
          hidden: { opacity: 0, y: -10, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", bounce: 0.3 } }
        }}
        className="py-1 relative flex items-center min-h-[30px]"
      >
        <ScrambleText as="h2" className="text-[17px] sm:text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">Projects</ScrambleText>

        {/* Horizontal line below Projects heading — spans between margin guides */}
        <div
          className="absolute bottom-0 bleed-x h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />
        <CornerMark position="bottom-left" />
        <CornerMark position="bottom-right" />
      </motion.div>

      {/* Grid Container */}
      <div className="relative pt-6 pb-8 px-4">
        {/* Center Vertical Line */}
        <div
          className="absolute top-0 bottom-0 left-1/2 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none -translate-x-1/2 hidden md:block"
          style={DOT_MASK_VERTICAL}
        />

        <ProjectsGrid />

        {/* Bottom Horizontal Line */}
        <div
          className="absolute bottom-0 bleed-x h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />
        <CornerMark position="bottom-left" />
        <CornerMark position="bottom-right" />
      </div>

      {/* View All Button */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 10, scale: 0.95 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.3, delay: 0.2 } }
        }}
        className="py-4 px-4 -mx-3 sm:-mx-4 flex justify-center relative hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer rounded-b-lg mt-0 z-20"
      >
        <TransitionLink href="/projects" className="relative group block mt-0">
          <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
          <div className="relative flex items-center gap-1.5 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[6px] text-[13px] font-medium transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80">
            View All
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        </TransitionLink>
      </motion.div>
    </motion.div>
  );
}
