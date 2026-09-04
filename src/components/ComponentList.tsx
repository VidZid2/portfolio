"use client";

import { motion } from "framer-motion";
import { componentsData } from "@/data/componentsData";
import { SprayBurstCard } from "@/components/spray-burst";

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
        
        {/* Bottom Description Area: Clean and visible below the fade */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm px-4 pb-8 pt-2 sm:pt-4 pointer-events-none">
          <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            More components coming soon
          </h3>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            I&apos;m currently working on some new components. Check back later for open-source UI elements and front-end architecture deep dives.
          </p>
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
