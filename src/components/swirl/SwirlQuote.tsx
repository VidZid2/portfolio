"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ExperimentStage } from "./experiment-stage";
import { DEFAULT_TEXT } from "./default-text";
import { DEFAULT_STAGE } from "./use-swirl-stage";

export function SwirlQuote() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark" || resolvedTheme === "dark";

  const config = {
    ...DEFAULT_STAGE,
    word: "WORK",
    style: "slant" as const,
    inkStops: isDark ? ["#6495ED", "#4A70B2", "#2B4168"] : ["#000000", "#555555", "#999999"],
    logoColor: isDark ? "#6495ED" : "#000000",
    gradient: true,
    gradientAngle: Math.PI / 4,
    gradientFlow: 0.2,
    bg: isDark ? "#000000" : "#ffffff", // Use pure black/white or match your site bg exactly
    text: DEFAULT_TEXT + "\ndo so much work that it would be unreasonable for you to not be successful",
    zoom: 0.8,
    trail: true,
    trailStrength: 1.5,
    shock: true,
    turbulence: 0.2,
    wavePattern: "wavefront" as const,
    aberration: 0.5, // Subtle CRT aberration
    scanlines: 0.2,
    curvature: 0.2,
  };

  return (
    <div className="w-[calc(100%+32px)] -mx-4 h-[50vh] min-h-[400px] relative">
        <ExperimentStage 
          config={config} 
          trackPointer={true} 
          burstOnClick={true}
          seamless={true}
        />
        
        {/* Gradient overlays to fade out the edges */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent dark:from-black dark:to-black/0 pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-black/0 pointer-events-none z-10" />
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white to-transparent dark:from-black dark:to-black/0 pointer-events-none z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white to-transparent dark:from-black dark:to-black/0 pointer-events-none z-10" />
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 text-[10px] font-medium tracking-[0.2em] text-zinc-400 dark:text-zinc-600 uppercase z-20">
          <div className="w-4 h-[1px] bg-zinc-200 dark:bg-zinc-800" />
          ALEX HORMOZI
          <div className="w-4 h-[1px] bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
  );
}
