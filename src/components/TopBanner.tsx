"use client";

import React from "react";
import { useTheme } from "next-themes";
import LightBloom from "@/components/ui/light-bloom";
import { CurrentTime } from "@/components/CurrentTime";

export function TopBanner() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="absolute left-0 right-0 md:left-[26%] md:right-[26%] top-0 h-[22vh] -z-0 pointer-events-auto overflow-hidden bg-white dark:bg-black shadow-[0_4px_12px_rgba(2,6,23,0.04)] dark:shadow-[0_4px_12px_rgba(2,6,23,0.10)]">
      {/* Volumetric WebGL Light Bloom Background (Aura Cascading from Above) */}
      <LightBloom
        variant="shafts"
        direction="top"
        background={isDark ? "#000000" : "#FFFFFF"}
        baseColor={isDark ? "#6B2BF5" : "#DDD6FE"}
        accentColor={isDark ? "#EFE6FF" : "#6B2BF5"}
        speed={100}
        hover={114}
        light={{ rise: 82, spread: 75 }}
        shafts={{ count: 17, amount: 70, drift: 79 }}
        finish={{
          grain: isDark ? 12 : 0,
          vignette: isDark ? 25 : 0,
        }}
        className="w-full h-full"
      />

      {/* Edge blending for seamless blueprint grid framing */}
      <div className="absolute inset-x-0 top-0 h-4 pointer-events-none z-[6] bg-gradient-to-b from-white/20 to-transparent dark:from-black/20 dark:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none z-[6] bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent" />

      {/* Live Digital Clock with proper margins */}
      <div className="absolute bottom-3.5 right-4 sm:bottom-4 sm:right-5 z-30 pointer-events-auto">
        <CurrentTime />
      </div>
    </div>
  );
}
