"use client";

import React from "react";
import { BondTypeCard } from "@/components/bond-type/BondTypeCard";
import { CurrentTime } from "@/components/CurrentTime";
import { DOT_MASK_VERTICAL } from "@/lib/blueprint";

export function TopBanner() {
  return (
    <div className="absolute left-3 right-3 sm:left-4 sm:right-4 md:left-[24.5%] md:right-[24.5%] top-0 h-[22vh] -z-0 pointer-events-auto overflow-hidden bg-[#f5333f] shadow-[0_4px_12px_rgba(2,6,23,0.04)] dark:shadow-[0_4px_12px_rgba(2,6,23,0.10)]">
      <BondTypeCard className="h-full w-full" />

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
