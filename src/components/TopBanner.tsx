"use client";

import React from "react";
import { IsometricBlueprint } from "@/components/IsometricBlueprint";
import { CurrentTime } from "@/components/CurrentTime";

export function TopBanner() {
  return (
    <div className="absolute left-0 right-0 md:left-[26%] md:right-[26%] top-0 h-[22vh] -z-0 pointer-events-auto overflow-hidden bg-white dark:bg-black shadow-[0_4px_12px_rgba(2,6,23,0.04)] dark:shadow-[0_4px_12px_rgba(2,6,23,0.10)]">
      {/* 3D Isometric Architectural Blueprint Wireframe */}
      <IsometricBlueprint className="w-full h-full" />

      {/* Subtle edge fades for seamless blueprint boundary blending */}
      <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none z-10 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-black dark:via-black/40 dark:to-transparent" />
      <div className="absolute inset-x-0 top-0 h-10 pointer-events-none z-10 bg-gradient-to-b from-white via-white/40 to-transparent dark:from-black dark:via-black/40 dark:to-transparent" />

      {/* Live Digital Clock */}
      <div className="absolute bottom-3 right-3 z-30 pointer-events-auto">
        <CurrentTime />
      </div>
    </div>
  );
}
