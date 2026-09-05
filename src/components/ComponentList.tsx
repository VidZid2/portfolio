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
        
        {/* Bottom Release Date & Countdown Area: Minimalistic Horizontal Layout */}
        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-3.5 lg:gap-6 px-5 sm:px-8 pb-6 pt-2 pointer-events-auto">
          {/* Info (Left) */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left min-w-0">
            <h3 className="text-[16px] sm:text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              SYNC UI Component System
            </h3>
            <p className="text-[12px] sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              The official SYNC UI component library drops on October 1st.
            </p>
          </div>

          {/* Live Horizontal Countdown Ticker (Right) */}
          <div className="shrink-0">
            <ReleaseCountdown />
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
