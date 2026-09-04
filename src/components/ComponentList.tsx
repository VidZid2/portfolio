"use client";

import { motion } from "framer-motion";
import { componentsData } from "@/data/componentsData";
import { SprayBurstCard } from "@/components/spray-burst";
import { SyncLogo } from "@/components/ui/sync-logo";

export function ComponentList() {
  if (componentsData.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center justify-center min-h-[320px] sm:min-h-[400px] py-10 px-4 mt-6 rounded-xl border border-dashed border-black/10 dark:border-white/10 bg-zinc-50/50 dark:bg-[#09090b]/50 w-full overflow-hidden"
      >
        <div className="relative z-10 flex flex-col items-center w-full max-w-md">
          {/* SYNC UI Showcase Card */}
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[16/10] rounded-xl overflow-hidden border border-black/10 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] shadow-md shadow-black/5 dark:shadow-xl dark:shadow-black/40">
            <SprayBurstCard
              bare={true}
              gray={true}
              fixedScene={1}
              className="size-full"
            />
            {/* Center Emblem with SYNC SVG and SYNC UI typography */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/85 dark:bg-black/80 backdrop-blur-md border border-black/10 dark:border-white/15 shadow-md shadow-black/10 dark:shadow-black/50">
                <SyncLogo className="size-5 sm:size-6 text-[#6495ED] shrink-0 drop-shadow-sm" />
                <span className="font-mono text-[13px] sm:text-[14px] font-bold tracking-[0.16em] uppercase text-zinc-900 dark:text-zinc-100">
                  SYNC UI
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-5 flex flex-col items-center text-center">
            <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              More components coming soon
            </h3>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 text-center max-w-sm px-4">
              I&apos;m currently working on some new components. Check back later for open-source UI elements and front-end architecture deep dives.
            </p>
          </div>
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
