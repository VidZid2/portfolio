"use client";

import React from "react";
import { BondTypeCard } from "@/components/bond-type/BondTypeCard";
import { CurrentTime } from "@/components/CurrentTime";
import { DOT_MASK_VERTICAL } from "@/lib/blueprint";

export function TopBanner() {
  return (
    <div className="absolute left-3 right-3 sm:left-4 sm:right-4 md:left-[24.5%] md:right-[24.5%] top-0 h-[22vh] -z-0 pointer-events-auto overflow-hidden bg-white dark:bg-black">
      <BondTypeCard className="h-full w-full" />

      {/* Subtle Edge Fades on all 4 perimeters */}
      <div className="absolute inset-x-0 top-0 h-4 pointer-events-none z-[5] bg-gradient-to-b from-white to-transparent dark:from-black dark:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-4 pointer-events-none z-[5] bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none z-[5] bg-gradient-to-r from-white to-transparent dark:from-black dark:to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-4 pointer-events-none z-[5] bg-gradient-to-l from-white to-transparent dark:from-black dark:to-transparent" />

      {/* Vertical dotted margin lines on top of banner */}
      <div
        className="absolute top-0 bottom-0 left-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-30"
        style={DOT_MASK_VERTICAL}
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-30"
        style={DOT_MASK_VERTICAL}
      />

      <div className="absolute bottom-3 right-2 z-30 pointer-events-auto">
        <CurrentTime />
      </div>
    </div>
  );
}
