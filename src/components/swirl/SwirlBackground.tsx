"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ExperimentStage } from "./experiment-stage";
import { DEFAULT_TEXT } from "./default-text";
import { DEFAULT_STAGE } from "./use-swirl-stage";

export function SwirlBackground() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark" || resolvedTheme === "dark";

  const config = {
    ...DEFAULT_STAGE,
    word: " ", // Space to ensure no text is rendered
    style: "slant" as const,
    inkStops: isDark ? ["#96b8ff", "#6495ED", "#3b5c9e"] : ["#15284f", "#2b56a3", "#6495ED"],
    logoColor: isDark ? "#ffffff" : "#000000",
    gradient: true,
    gradientAngle: Math.PI / 4,
    gradientFlow: 0.2,
    bg: isDark ? "#000000" : "#ffffff", 
    text: DEFAULT_TEXT,
    zoom: 0.8,
    trail: true,
    trailStrength: 1.5,
    shock: true,
    turbulence: 0.2,
    wavePattern: "wavefront" as const,
    aberration: 0.5,
    scanlines: 0.2,
    curvature: 0.2,
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden rounded-[8px] opacity-80 dark:opacity-60 pointer-events-auto" style={{ maskImage: 'linear-gradient(to right, transparent 0%, transparent 30%, black 50%, black 65%, transparent 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 30%, black 50%, black 65%, transparent 85%, transparent 100%)' }}>
      <ExperimentStage 
        config={config} 
        trackPointer={true} 
        burstOnClick={true}
        seamless={true}
      />
    </div>
  );
}
