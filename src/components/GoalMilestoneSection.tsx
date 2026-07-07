"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import ScrambleText, { type ScrambleTextRef } from "@/components/ruixen/scramble-text";
import { GoalMilestoneList } from "@/components/GoalMilestoneList";
import { usePerformance } from "@/hooks/usePerformance";

export function GoalMilestoneSection({ hasSeenScrollAnimations = false }: { hasSeenScrollAnimations?: boolean }) {
  const { isLowTier } = usePerformance();
  const skip = hasSeenScrollAnimations || isLowTier;
  const scrambleRef = useRef<ScrambleTextRef>(null);

  return (
    <motion.div 
      id="goals" 
      className="mt-6 flex flex-col relative z-10 scroll-mt-24"
      initial={skip ? "visible" : "hidden"}
      whileInView={skip ? undefined : "visible"}
      animate={skip ? "visible" : undefined}
      transition={isLowTier ? { duration: 0 } : undefined}
      viewport={{ once: true, amount: 0.1 }}
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
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
        }}
        className="py-2 relative flex items-center justify-between"
      >
        <ScrambleText ref={scrambleRef} as="h2" className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Goal Milestones
        </ScrambleText>
        
        {/* Bottom full-width line */}
        <div
          className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={{
            maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
            WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)'
          }}
        />
        {/* Bottom Line Intersections */}
        <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </motion.div>

      <div className="block relative">
        <GoalMilestoneList />
      </div>

      {/* Bottom full-width line for the entire section */}
      <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
      {/* Bottom Line Intersections */}
      <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
    </motion.div>
  );
}
