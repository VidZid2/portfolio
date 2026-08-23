"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ExperimentStage } from "./experiment-stage";
import { DEFAULT_TEXT } from "./default-text";
import { DEFAULT_STAGE } from "./use-swirl-stage";

const dashedMaskVertical = {
  maskImage:
    "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
};

const dashedMaskHorizontal = {
  maskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
};

const SWIRL_WORDS = ["SYNC", "WORK", "BUILD", "CREATE"];

export function SwirlQuote() {
  const { theme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % SWIRL_WORDS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark" || resolvedTheme === "dark";
  const currentWord = SWIRL_WORDS[wordIndex];

  const config = {
    ...DEFAULT_STAGE,
    word: currentWord,
    style: "slant" as const,
    inkStops: isDark ? ["#6495ED", "#4A70B2", "#2B4168"] : ["#000000", "#555555", "#999999"],
    logoColor: isDark ? "#6495ED" : "#000000",
    gradient: true,
    gradientAngle: Math.PI / 4,
    gradientFlow: 0.2,
    bg: isDark ? "#000000" : "#ffffff", // Use pure black/white or match your site bg exactly
    text: DEFAULT_TEXT + "\ncrafting high performance web applications with obsessive attention to detail\nmastering modern technologies through complex builds\nprecision in engineering and design",
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
    <div className="w-[calc(100%+24px)] -mx-3 sm:w-[calc(100%+32px)] sm:-mx-4 h-[50vh] min-h-[400px] relative overflow-hidden">
      {/* Left and Right continuous vertical dotted boundary lines */}
      <div
        className="absolute top-0 bottom-0 left-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-20"
        style={dashedMaskVertical}
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-20"
        style={dashedMaskVertical}
      />

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

      {/* Bottom full-width divider line */}
      <div
        className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none z-20"
        style={dashedMaskHorizontal}
      />
      <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-30" />
      <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-30" />
    </div>
  );
}
