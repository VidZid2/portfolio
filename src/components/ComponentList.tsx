"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { componentsData } from "@/data/componentsData";
import { SprayBurstCard } from "@/components/spray-burst";
import { ReleaseCountdownSkeleton } from "@/components/ReleaseCountdown";

const ReleaseCountdown = dynamic(
  () => import("@/components/ReleaseCountdown").then((mod) => mod.ReleaseCountdown),
  {
    ssr: false,
    loading: () => <ReleaseCountdownSkeleton />,
  }
);

export function ComponentList() {
  if (componentsData.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center w-full mt-6 rounded-xl border border-dashed border-black/10 dark:border-white/10 bg-zinc-50/50 dark:bg-[#09090b]/50 overflow-hidden"
      >
        {/* Upper Screenprint Section: Fully envelops the very top with bottom fade */}
        <div className="relative w-full h-[260px] sm:h-[320px] overflow-hidden select-none">
          {/* Boiling screenprint engine locked to single drawing */}
          <div 
            className="absolute inset-0 size-full pointer-events-auto"
            style={{
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
            }}
          >
            <SprayBurstCard
              bare={true}
              gray={false}
              fixedScene={10}
              className="size-full"
            />
          </div>
        </div>
        
        {/* Bottom Release Date & Countdown Area: Clean, prominent, and visible below the fade */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-md px-4 pb-8 pt-1 sm:pt-3 pointer-events-auto">
          {/* Release Date Badge with animated live pulse */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2.5 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span>RELEASING OCTOBER 1ST</span>
          </div>

          {/* Heading */}
          <h3 className="text-[17px] sm:text-[20px] font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 tracking-tight">
            SYNC UI Component System
          </h3>

          {/* Description */}
          <p className="text-[13px] sm:text-[14px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm sm:max-w-md mb-5">
            The official SYNC UI component library drops on October 1st. Featuring physics-based micro-interactions, accessible primitives, and production-ready React animations.
          </p>

          {/* Live Countdown Ticker with Tick Animation */}
          <ReleaseCountdown />
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Component rendering will go here */}
    </div>
  );
}
