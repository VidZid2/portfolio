"use client";

import React from "react";
import Image from "next/image";
import { SakuraPetals } from "@/components/SakuraPetals";
import { CurrentTime } from "@/components/CurrentTime";
import { DOT_MASK_VERTICAL } from "@/lib/blueprint";

export function TopBanner() {
  return (
    <div
      className="absolute left-3 right-3 sm:left-4 sm:right-4 md:left-[24.5%] md:right-[24.5%] top-0 h-[22vh] -z-0 pointer-events-auto overflow-hidden bg-white dark:bg-black select-none"
    >
      {/* 1. Base Wallpaper Layer (Light & Dark Torii Shrine) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/light-mode.png"
          alt="Torii Shrine Light Mode"
          fill
          priority
          unoptimized
          className="object-cover object-center dark:hidden pointer-events-none"
        />
        <Image
          src="/dark-mode.png"
          alt="Torii Shrine Dark Mode"
          fill
          priority
          unoptimized
          className="hidden object-cover object-center dark:block pointer-events-none"
        />
      </div>

      {/* 2. Cinematic Sakura Petals (Softly drifts ambiently over shrine wallpaper) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <SakuraPetals active={true} />
      </div>

      {/* 3. Atmospheric Perimeter Edge & Corner Fades (matching Picture 2) */}
      <div className="absolute inset-x-0 top-0 h-10 sm:h-12 pointer-events-none z-[20] bg-gradient-to-b from-white via-white/50 to-transparent dark:from-black dark:via-black/70 dark:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-14 sm:h-16 pointer-events-none z-[20] bg-gradient-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 pointer-events-none z-[20] bg-gradient-to-r from-white via-white/50 to-transparent dark:from-black dark:via-black/75 dark:to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 pointer-events-none z-[20] bg-gradient-to-l from-white via-white/50 to-transparent dark:from-black dark:via-black/75 dark:to-transparent" />

      {/* 4. Vertical dotted margin lines on top of banner */}
      <div
        className="absolute top-0 bottom-0 left-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-30"
        style={DOT_MASK_VERTICAL}
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-30"
        style={DOT_MASK_VERTICAL}
      />

      {/* 5. Live Digital Clock Widget */}
      <div className="absolute bottom-3 right-2 z-30 pointer-events-auto">
        <CurrentTime />
      </div>
    </div>
  );
}
