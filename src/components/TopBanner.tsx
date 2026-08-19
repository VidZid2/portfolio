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
      {/* Volumetric WebGL Light Bloom Background */}
      <LightBloom
        variant="shafts"
        direction="bottom"
        background={isDark ? "#000000" : "#FFFFFF"}
        baseColor={isDark ? "#6B2BF5" : "#DDD6FE"}
        accentColor={isDark ? "#EFE6FF" : "#6B2BF5"}
        speed={100}
        hover={114}
        light={{ rise: 79, spread: 72 }}
        shafts={{ count: 17, amount: 70, drift: 79 }}
        finish={{
          grain: isDark ? 12 : 0,
          vignette: isDark ? 25 : 0,
        }}
        className="w-full h-full"
      />

      {/* Subtle bottom blend for seamless blueprint grid transition */}
      <div className="absolute inset-x-0 bottom-0 h-6 pointer-events-none z-[6] bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent" />

      {/* Live Digital Clock */}
      <div className="absolute bottom-3 right-3 z-30 pointer-events-auto">
        <CurrentTime />
      </div>
    </div>
  );
}
