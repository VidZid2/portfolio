"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { BondTypeCard } from "@/components/bond-type/BondTypeCard";
import { SakuraPetals } from "@/components/SakuraPetals";
import { CurrentTime } from "@/components/CurrentTime";
import { DOT_MASK_VERTICAL } from "@/lib/blueprint";

export function TopBanner() {
  const [view, setView] = useState<"molecule" | "shrine">("molecule");
  const [isBursting, setIsBursting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const transitionTo = useCallback((targetView: "molecule" | "shrine") => {
    setIsBursting(true);

    // Crossfade at the peak of the sakura gust
    setTimeout(() => {
      setView(targetView);
    }, 450);

    // End wind gust
    setTimeout(() => {
      setIsBursting(false);
    }, 1900);
  }, []);

  // When pixel molecule completes its animation cycle, transition to shrine
  const handleMoleculeCycleComplete = useCallback(() => {
    if (view === "molecule") {
      transitionTo("shrine");
    }
  }, [view, transitionTo]);

  // When on shrine, automatically cycle back to molecule after holding for 14 seconds
  useEffect(() => {
    if (view === "shrine") {
      timerRef.current = setTimeout(() => {
        transitionTo("molecule");
      }, 14000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [view, transitionTo]);

  // Allow clicking anywhere on the banner to toggle between molecule and shrine
  const handleBannerClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    transitionTo(view === "molecule" ? "shrine" : "molecule");
  };

  return (
    <div
      onClick={handleBannerClick}
      className="absolute left-3 right-3 sm:left-4 sm:right-4 md:left-[24.5%] md:right-[24.5%] top-0 h-[22vh] -z-0 pointer-events-auto overflow-hidden bg-white dark:bg-black cursor-pointer group select-none"
      title="Click to toggle banner view"
    >
      {/* 1. Base Wallpaper Layer (Light & Dark Torii Shrine) */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out will-change-opacity transform-gpu ${
          view === "shrine" ? "opacity-100" : "opacity-0"
        }`}
      >
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

      {/* 2. Pixel Molecule Layer */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out will-change-opacity transform-gpu ${
          view === "molecule" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <BondTypeCard
          className="h-full w-full"
          active={view === "molecule"}
          onCycleComplete={handleMoleculeCycleComplete}
        />
      </div>

      {/* 3. Cinematic Sakura Petals (Drifts ambiently over shrine and bursts on transition) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <SakuraPetals burst={isBursting} />
      </div>

      {/* 4. Atmospheric Perimeter Edge & Corner Fades (matching Picture 2) */}
      <div className="absolute inset-x-0 top-0 h-10 sm:h-12 pointer-events-none z-[25] bg-gradient-to-b from-white via-white/50 to-transparent dark:from-black dark:via-black/70 dark:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-14 sm:h-16 pointer-events-none z-[25] bg-gradient-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 pointer-events-none z-[25] bg-gradient-to-r from-white via-white/50 to-transparent dark:from-black dark:via-black/75 dark:to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 pointer-events-none z-[25] bg-gradient-to-l from-white via-white/50 to-transparent dark:from-black dark:via-black/75 dark:to-transparent" />

      {/* 5. Vertical dotted margin lines on top of banner */}
      <div
        className="absolute top-0 bottom-0 left-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-30"
        style={DOT_MASK_VERTICAL}
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-30"
        style={DOT_MASK_VERTICAL}
      />

      {/* 6. Live Digital Clock Widget */}
      <div className="absolute bottom-3 right-2 z-30 pointer-events-auto">
        <CurrentTime />
      </div>
    </div>
  );
}
