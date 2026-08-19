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
        baseColor={isDark ? "#6B2BF5" : "#818CF8"}
        accentColor="#EFE6FF"
        speed={100}
        hover={114}
        light={{ rise: 79, spread: 72 }}
        shafts={{ count: 17, amount: 70, drift: 79 }}
        finish={{ grain: 12, vignette: 25 }}
        className="w-full h-full"
      />

      {/* Live Digital Clock */}
      <div className="absolute bottom-3 right-3 z-30 pointer-events-auto">
        <CurrentTime />
      </div>
    </div>
  );
}
