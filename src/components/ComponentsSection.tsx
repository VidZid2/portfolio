"use client";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";

import React from "react";
import { motion } from "framer-motion";
import ScrambleText from "@/components/ruixen/scramble-text";
import { ComponentList } from "@/components/ComponentList";
import { toastManager } from "@/components/ui/toast";

import { usePerformance } from "@/hooks/usePerformance";

export function ComponentsSection({ hasSeenScrollAnimations = false }: { hasSeenScrollAnimations?: boolean }) {
  const phase = useArcReveal();
  const { isLowTier } = usePerformance();
  const skip = hasSeenScrollAnimations || isLowTier;
  return (
    <motion.div 
      id="components" 
      className="mt-0 flex flex-col relative scroll-mt-24"
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
      {/* Top full-width line */}
      <div
        className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={{
          maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
          WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)'
        }}
      />
      {/* Top Line Intersections */}
      <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

      <motion.div 
        variants={{
          hidden: { opacity: 0, y: -10, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", bounce: 0.3 } }
        }}
        className="py-1 relative flex items-center min-h-[30px]"
      >
        <ScrambleText as="h2" className="text-[17px] sm:text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">Components</ScrambleText>

        {/* Horizontal line below Components heading */}
        <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
        {/* Intersections */}
        <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </motion.div>

      <div className="relative pt-6 pb-12 px-4">
        {/* Center Vertical Line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none -translate-x-1/2 hidden md:block" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />

        <ComponentList />

      </div>

      {/* View All Button */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 10, scale: 0.95 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.3, delay: 0.2 } }
        }}
        className="py-4 px-4 -mx-4 flex justify-center relative hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer rounded-b-lg mt-0"
      >
        {/* Top Horizontal Line (above View All) */}
        <div className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
        {/* Top Line Intersections */}
        <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute top-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        
        {/* Bottom Horizontal Line (below View All) */}
        <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
        {/* Bottom Line Intersections */}
        <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />

        <button
          type="button"
          onClick={() => {
            toastManager.promise(
              new Promise<string>((resolve, reject) => {
                const shouldSucceed = Math.random() > 0.15;
                setTimeout(() => {
                  if (shouldSucceed) {
                    resolve("Interactive UI components, design patterns, and animations are currently being crafted.");
                  } else {
                    reject(new Error("Unable to load upcoming components right now."));
                  }
                }, 1600);
              }),
              {
                loading: {
                  title: "Loading component library…",
                  description: "Fetching upcoming open-source UI elements and playground.",
                },
                success: (data: string) => ({
                  title: "Components in Development",
                  description: data,
                }),
                error: () => ({
                  title: "Something went wrong",
                  description: "Please check back soon for new UI component releases.",
                }),
              },
            );
          }}
          className="relative group block mt-0 cursor-pointer bg-transparent border-0 p-0 text-left"
        >
          <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
          <div className="relative flex items-center gap-1.5 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[6px] text-[13px] font-medium transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80">
            View All
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        </button>
      </motion.div>
    </motion.div>
  );
}
