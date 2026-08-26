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
    <div
      className={`min-h-screen w-full bg-white dark:bg-black relative overflow-x-hidden transition-colors duration-300 ${className}`}
    >
      {showRightNavbar && <RightNavbar />}

      {expandContentMargins ? (
        <>
          {/* Top section vertical guides — 24.5% header width, solid Ruixen style */}
          <div className="absolute top-0 h-[calc(22vh+112px)] left-3 sm:left-4 md:left-[24.5%] w-px bg-foreground/10 pointer-events-none hidden sm:block" />
          <div className="absolute top-0 h-[calc(22vh+112px)] right-3 sm:right-4 md:right-[24.5%] w-px bg-foreground/10 pointer-events-none hidden sm:block" />

          {/* Lower expanded vertical guides */}
          <div className="absolute top-[calc(22vh+112px)] bottom-0 left-3 sm:left-4 md:left-6 lg:left-8 w-px bg-foreground/10 pointer-events-none hidden sm:block" />
          <div className="absolute top-[calc(22vh+112px)] bottom-0 right-3 sm:right-4 md:right-6 lg:right-8 w-px bg-foreground/10 pointer-events-none hidden sm:block" />

          {/* Corner brackets at header intersections — borders align exactly with guides */}
          {/* Header top (22vh) */}
          <div className="absolute hidden sm:block h-1.5 w-1.5 border-l border-t border-foreground/30 pointer-events-none z-10 left-3 sm:left-4 md:left-[24.5%] top-[22vh]" />
          <div className="absolute hidden sm:block h-1.5 w-1.5 border-r border-t border-foreground/30 pointer-events-none z-10 right-3 sm:right-4 md:right-[24.5%] top-[22vh]" />
          {/* Header bottom (22vh+112px) — header box corners */}
          <div className="absolute hidden sm:block h-1.5 w-1.5 border-l border-b border-foreground/30 pointer-events-none z-10 left-3 sm:left-4 md:left-[24.5%] top-[calc(22vh+112px)]" />
          <div className="absolute hidden sm:block h-1.5 w-1.5 border-r border-b border-foreground/30 pointer-events-none z-10 right-3 sm:right-4 md:right-[24.5%] top-[calc(22vh+112px)]" />
          {/* Expanded lower corners at same Y but outer margin */}
          <div className="absolute hidden md:block h-1.5 w-1.5 border-l border-t border-foreground/30 pointer-events-none z-10 left-3 sm:left-4 md:left-6 lg:left-8 top-[calc(22vh+112px)]" />
          <div className="absolute hidden md:block h-1.5 w-1.5 border-r border-t border-foreground/30 pointer-events-none z-10 right-3 sm:right-4 md:right-6 lg:right-8 top-[calc(22vh+112px)]" />
        </>
      ) : (
        <>
          {/* Vertical side guides — solid, contained, Ruixen style */}
          <div className="absolute top-0 bottom-0 left-3 sm:left-4 md:left-[24.5%] w-px bg-foreground/10 pointer-events-none hidden sm:block" />
          <div className="absolute top-0 bottom-0 right-3 sm:right-4 md:right-[24.5%] w-px bg-foreground/10 pointer-events-none hidden sm:block" />

          {/* Corner ticks at header band intersections — borders align exactly with guides */}
          <div className="absolute hidden sm:block h-1.5 w-1.5 border-l border-t border-foreground/30 pointer-events-none z-10 left-3 sm:left-4 md:left-[24.5%] top-[22vh]" />
          <div className="absolute hidden sm:block h-1.5 w-1.5 border-r border-t border-foreground/30 pointer-events-none z-10 right-3 sm:right-4 md:right-[24.5%] top-[22vh]" />
          <div className="absolute hidden sm:block h-1.5 w-1.5 border-l border-b border-foreground/30 pointer-events-none z-10 left-3 sm:left-4 md:left-[24.5%] top-[calc(22vh+112px)]" />
          <div className="absolute hidden sm:block h-1.5 w-1.5 border-r border-b border-foreground/30 pointer-events-none z-10 right-3 sm:right-4 md:right-[24.5%] top-[calc(22vh+112px)]" />
        </>
      )}

      {/* Horizontal guides — contained within side margins (no -100vw bleed) */}
      <div className="absolute left-3 sm:left-4 md:left-[24.5%] right-3 sm:right-4 md:right-[24.5%] top-[22vh] h-px bg-foreground/10 pointer-events-none hidden sm:block" />
      <div className="absolute left-3 sm:left-4 md:left-[24.5%] right-3 sm:right-4 md:right-[24.5%] top-[calc(22vh+112px)] h-px bg-foreground/10 pointer-events-none hidden sm:block" />

      {/* Cell 1: Top Banner */}
      {bannerSlot ?? <TopBanner />}

      {/* Cell 2: Header Section */}
      {headerSlot}

      {/* Cell 3: Main Content Area */}
      {children}
    </div>
  );
}
