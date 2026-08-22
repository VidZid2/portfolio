"use client";

import React from "react";
import { TopBanner } from "@/components/TopBanner";
import { RightNavbar } from "@/components/RightNavbar";

interface BlueprintGridProps {
  bannerSlot?: React.ReactNode;
  headerSlot?: React.ReactNode;
  children?: React.ReactNode;
  showRightNavbar?: boolean;
  className?: string;
}

const DOT_MASK_VERTICAL = {
  maskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
};

const DOT_MASK_HORIZONTAL = {
  maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
};

export function BlueprintGrid({
  bannerSlot,
  headerSlot,
  children,
  showRightNavbar = true,
  className = "",
}: BlueprintGridProps) {
  return (
    <div className={`min-h-screen w-full bg-white dark:bg-black relative overflow-x-hidden transition-colors duration-300 ${className}`}>
      {/* Right Side Blueprint Navigation */}
      {showRightNavbar && <RightNavbar />}

      {/* Vertical Lines - Ultra-fine Micro Dots (Standard 24.5% margins on desktop) */}
      <div
        className="absolute top-0 bottom-0 left-3 sm:left-4 md:left-[24.5%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={DOT_MASK_VERTICAL}
      />
      <div
        className="absolute top-0 bottom-0 right-3 sm:right-4 md:right-[24.5%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={DOT_MASK_VERTICAL}
      />

      {/* Horizontal Lines - Ultra-fine Micro Dots */}
      <div
        className="absolute left-0 right-0 top-[22vh] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={DOT_MASK_HORIZONTAL}
      />
      <div
        className="absolute left-0 right-0 top-[calc(22vh+112px)] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={DOT_MASK_HORIZONTAL}
      />

      {/* Ultra-Tiny Solid Nodes */}
      <div className="absolute top-[22vh] left-3 sm:left-4 md:left-[24.5%] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
      <div className="absolute top-[22vh] right-3 sm:right-4 md:right-[24.5%] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
      <div className="absolute top-[calc(22vh+112px)] left-3 sm:left-4 md:left-[24.5%] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
      <div className="absolute top-[calc(22vh+112px)] right-3 sm:right-4 md:right-[24.5%] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />

      {/* Cell 1: Top Banner */}
      {bannerSlot ?? <TopBanner />}

      {/* Cell 2: Header Section */}
      {headerSlot}

      {/* Cell 3: Main Content Area */}
      {children}
    </div>
  );
}
