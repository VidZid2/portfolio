"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { componentsData } from "@/data/componentsData";
import { useTheme } from "next-themes";
import { AsciiWordmark } from "@/components/ui/ascii-wordmark";

export function ComponentList() {
  const { resolvedTheme } = useTheme();
  const [glyphColor, setGlyphColor] = useState("#6B7280");

  useEffect(() => {
    if (!resolvedTheme) return;
    setGlyphColor(resolvedTheme === "dark" ? "#3f3f46" : "#e4e4e7");
  }, [resolvedTheme]);

  if (componentsData.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center justify-center sm:justify-end min-h-[200px] sm:min-h-[380px] pb-8 pt-8 sm:pt-24 mt-6 rounded-xl border border-dashed border-black/10 dark:border-white/10 bg-zinc-50/50 dark:bg-[#09090b]/50 w-full overflow-hidden"
      >
        <div className="hidden sm:block absolute inset-0 z-0 opacity-40 dark:opacity-80 scale-[1.8] sm:scale-100 transition-transform duration-500">
          <AsciiWordmark
            word="SYNC"
            inkColor={glyphColor}
            className="w-full h-full"
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center pointer-events-none drop-shadow-md">
          <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 mb-1">More components coming soon</h3>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 text-center max-w-sm px-4">
            I'm currently working on some new components. Check back later for open-source UI elements and front-end architecture deep dives.
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
