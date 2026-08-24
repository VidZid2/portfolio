"use client";

import React from "react";
import { TopBanner } from "@/components/TopBanner";
import { RightNavbar } from "@/components/RightNavbar";
import { DOT_MASK_HORIZONTAL, DOT_MASK_VERTICAL } from "@/lib/blueprint";

interface BlueprintGridProps {
  bannerSlot?: React.ReactNode;
  headerSlot?: React.ReactNode;
  children?: React.ReactNode;
  showRightNavbar?: boolean;
  className?: string;
  expandContentMargins?: boolean;
}

export function BlueprintGrid({
  bannerSlot,
  headerSlot,
  children,
  showRightNavbar = true,
  className = "",
  expandContentMargins = false,
}: BlueprintGridProps) {
  return (
    <div className={`min-h-screen w-full bg-white dark:bg-black relative overflow-x-hidden transition-colors duration-300 ${className}`}>
      {/* Right Side Blueprint Navigation */}
      {showRightNavbar && <RightNavbar />}

      {expandContentMargins ? (
        <>
          {/* Top Section Vertical Lines (0 to Header Bottom) - Standard 24.5% Header Margins */}
          <div
            className="absolute top-0 h-[calc(22vh+112px)] left-3 sm:left-4 md:left-[24.5%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_VERTICAL}
          />
          <div
            className="absolute top-0 h-[calc(22vh+112px)] right-3 sm:right-4 md:right-[24.5%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_VERTICAL}
          />

          {/* Lower Content Section Vertical Lines (Header Bottom to Page Bottom) - Expanded to Fit Timescale */}
          <div
            className="absolute top-[calc(22vh+112px)] bottom-0 left-3 sm:left-4 md:left-6 lg:left-8 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_VERTICAL}
          />
          <div
            className="absolute top-[calc(22vh+112px)] bottom-0 right-3 sm:right-4 md:right-6 lg:right-8 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_VERTICAL}
          />

          {/* Ultra-Tiny Solid Nodes */}
          <div className="absolute top-[22vh] left-3 sm:left-4 md:left-[24.5%] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <div className="absolute top-[22vh] right-3 sm:right-4 md:right-[24.5%] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <div className="absolute top-[calc(22vh+112px)] left-3 sm:left-4 md:left-[24.5%] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <div className="absolute top-[calc(22vh+112px)] right-3 sm:right-4 md:right-[24.5%] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <div className="absolute top-[calc(22vh+112px)] left-3 sm:left-4 md:left-6 lg:left-8 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <div className="absolute top-[calc(22vh+112px)] right-3 sm:right-4 md:right-6 lg:right-8 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
        </>
      ) : (
        <>
          {/* Vertical Lines - Ultra-fine Micro Dots (Standard 24.5% margins on desktop) */}
          <div
            className="absolute top-0 bottom-0 left-3 sm:left-4 md:left-[24.5%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_VERTICAL}
          />
          <div
            className="absolute top-0 bottom-0 right-3 sm:right-4 md:right-[24.5%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_VERTICAL}
          />

          {/* Ultra-Tiny Solid Nodes */}
          <div className="absolute top-[22vh] left-3 sm:left-4 md:left-[24.5%] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <div className="absolute top-[22vh] right-3 sm:right-4 md:right-[24.5%] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <div className="absolute top-[calc(22vh+112px)] left-3 sm:left-4 md:left-[24.5%] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <div className="absolute top-[calc(22vh+112px)] right-3 sm:right-4 md:right-[24.5%] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
        </>
      )}

      {/* Horizontal Lines - Ultra-fine Micro Dots */}
      <div
        className="absolute left-0 right-0 top-[22vh] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={DOT_MASK_HORIZONTAL}
      />
      <div
        className="absolute left-0 right-0 top-[calc(22vh+112px)] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={DOT_MASK_HORIZONTAL}
      />

      {/* Cell 1: Top Banner */}
      {bannerSlot ?? <TopBanner />}

      {/* Cell 2: Header Section */}
      {headerSlot}

      {/* Cell 3: Main Content Area */}
      {children}
    </div>
  );
}
