"use client";

import React from "react";
import { useTheme } from "next-themes";
import LightBloom from "@/components/ui/light-bloom";
import { BannerParticles } from "@/components/BannerParticles";
import { CurrentTime } from "@/components/CurrentTime";

export function TopBanner() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="absolute left-0 right-0 md:left-[26%] md:right-[26%] top-0 h-[22vh] -z-0 pointer-events-auto overflow-hidden bg-white dark:bg-black shadow-[0_4px_12px_rgba(2,6,23,0.04)] dark:shadow-[0_4px_12px_rgba(2,6,23,0.10)]">
      {/* Volumetric WebGL Light Bloom Shader */}
      <LightBloom
        variant="shafts"
        direction="bottom"
        background={isDark ? "#000000" : "#FFFFFF"}
        baseColor={isDark ? "#60A5FA" : "#93C5FD"}
        accentColor={isDark ? "#E0E7FF" : "#2563EB"}
        speed={70}
        hover={114}
        light={{ rise: 78, spread: 75 }}
        shafts={{ count: 18, amount: 65, drift: 75 }}
        finish={{ grain: 12, vignette: 28 }}
        className="w-full h-full"
      />

      {/* Floating subtle ambient particles */}
      <BannerParticles />

      {/* Seamless 4-Directional Edge Gradients for Smooth Boundary Blending */}
      <div className="absolute inset-x-0 top-0 h-14 pointer-events-none z-[6] bg-gradient-to-b from-white via-white/40 to-transparent dark:from-black dark:via-black/40 dark:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none z-[6] bg-gradient-to-t from-white via-white/50 to-transparent dark:from-black dark:via-black/50 dark:to-transparent" />
      <div className="absolute inset-y-0 left-0 w-16 pointer-events-none z-[6] bg-gradient-to-r from-white via-white/40 to-transparent dark:from-black dark:via-black/40 dark:to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 pointer-events-none z-[6] bg-gradient-to-l from-white via-white/40 to-transparent dark:from-black dark:via-black/40 dark:to-transparent" />

      {/* Clock Protection Fade (Bottom-Right corner soft vignette) */}
      <div className="absolute bottom-0 right-0 w-48 h-20 pointer-events-none z-[7] bg-gradient-to-tl from-white/80 via-white/40 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent" />

      {/* Live Digital Clock */}
      <div className="absolute bottom-3 right-3 z-30 pointer-events-auto">
        <CurrentTime />
      </div>
    </div>
  );
}
