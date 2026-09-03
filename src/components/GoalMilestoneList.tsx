"use client";

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { goalMilestones } from "@/data/goalMilestonesData";
import { useMediaQuery } from "@/hooks/use-media-query";
import { playHoverTick, playSoftClick } from "@/lib/synth-sounds";

import { AsciiText } from "@/components/ui/ascii-text";
import { AsciiGlitchBlock } from "@/components/ui/ascii-glitch-block";
import { GlyphMatrix } from "@/components/ui/glyph-matrix";
import { JapaneseAsciiText } from "@/components/ui/japanese-ascii-text";
import { cn } from "@/lib/utils";
import { DOT_MASK_HORIZONTAL, DOT_MASK_VERTICAL } from "@/lib/blueprint";

const BOUNCE_SPRING = {
  type: "spring",
  stiffness: 280,
  damping: 18,
  mass: 0.3,
} as const;

function quadraticBezier(start: number, control: number, end: number, progress: number) {
  const remaining = 1 - progress;
  return (
    remaining * remaining * start +
    2 * remaining * progress * control +
    progress * progress * end
  );
}

function BouncingGoalMilestoneBulletList({
  description,
  isOpen,
}: {
  description: string;
  isOpen: boolean;
}) {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const items = useMemo(() => {
    return description
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text, id) => ({ id, text }));
  }, [description]);

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<number, HTMLLIElement>>(new Map());
  const selectedIndexRef = useRef(activeIndex);
  const previousIndexRef = useRef(activeIndex);
  const hasPositionRef = useRef(false);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    selectedIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Auto-cycling when open and not hovered
  useEffect(() => {
    if (!isOpen || isHovered || items.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, isHovered, items.length]);

  const snapIndicator = useCallback(() => {
    const selectedItem = itemRefs.current.get(selectedIndexRef.current);
    if (!selectedItem) return;

    animationRef.current?.stop();
    const destX = 0;
    const destY = selectedItem.offsetTop + 8;
    x.set(destX);
    y.set(destY);
    hasPositionRef.current = true;
  }, [x, y]);

  const positionIndicator = useCallback(
    (shouldAnimate: boolean) => {
      const selectedItem = itemRefs.current.get(activeIndex);
      if (!selectedItem) return;

      const destinationX = 0;
      const destinationY = selectedItem.offsetTop + 8;
      animationRef.current?.stop();

      if (!hasPositionRef.current || reduce || !shouldAnimate) {
        x.set(destinationX);
        y.set(destinationY);
        hasPositionRef.current = true;
        previousIndexRef.current = activeIndex;
        return;
      }

      const startX = x.get();
      const startY = y.get();
      const distanceY = destinationY - startY;
      const travel = Math.abs(distanceY);

      if (travel === 0 && Math.abs(destinationX - startX) < 1) return;

      const longJumpProgress = Math.min(1, Math.max(0, (travel - 48) / 120));
      const minX = Math.min(startX, destinationX);
      const controlX = minX - Math.min(36, Math.max(10, travel * 0.3));
      const midpointY = (startY + destinationY) / 2;
      const controlY = destinationY + (midpointY - destinationY) * longJumpProgress;

      animationRef.current = animate(0, 1, {
        ...BOUNCE_SPRING,
        stiffness: BOUNCE_SPRING.stiffness - 60 * longJumpProgress,
        damping: BOUNCE_SPRING.damping + longJumpProgress,
        mass: BOUNCE_SPRING.mass + 0.15 * longJumpProgress,
        onUpdate: (progress) => {
          x.set(quadraticBezier(startX, controlX, destinationX, progress));
          y.set(quadraticBezier(startY, controlY, destinationY, progress));
        },
        onComplete: () => {
          x.set(destinationX);
          y.set(destinationY);
        },
      });

      previousIndexRef.current = activeIndex;
    },
    [activeIndex, reduce, x, y],
  );

  // Trigger bounce animation when activeIndex changes
  useLayoutEffect(() => {
    if (!isOpen) return;
    const shouldAnimate =
      hasPositionRef.current && previousIndexRef.current !== activeIndex;
    positionIndicator(shouldAnimate);
  }, [positionIndicator, activeIndex, isOpen]);

  // Snap indicator when accordion opens
  useEffect(() => {
    if (!isOpen) {
      hasPositionRef.current = false;
      return;
    }
    const t0 = setTimeout(snapIndicator, 50);
    const t1 = setTimeout(snapIndicator, 150);
    const t2 = setTimeout(snapIndicator, 300);
    const t3 = setTimeout(snapIndicator, 520);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, snapIndicator]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || !isOpen || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(snapIndicator);
    observer.observe(list);
    return () => observer.disconnect();
  }, [snapIndicator, isOpen]);

  useLayoutEffect(
    () => () => {
      animationRef.current?.stop();
    },
    [],
  );

  return (
    <div
      className="relative overflow-visible mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ul
        ref={listRef}
        className="relative flex flex-col gap-3 list-none pl-6 overflow-visible leading-relaxed select-text"
      >
        {/* Bouncing Solid Dot Indicator (2D Spring Curved Flight Physics) */}
        <li
          aria-hidden="true"
          role="presentation"
          className="pointer-events-none absolute inset-0 list-none overflow-visible"
        >
          <motion.span
            style={{ x, y }}
            className="absolute top-0 left-2 h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 z-20 shadow-none"
          />
        </li>

        {items.map((item) => {
          const isActive = item.id === activeIndex;

          return (
            <li
              key={item.id}
              ref={(node) => {
                if (node) itemRefs.current.set(item.id, node);
                else itemRefs.current.delete(item.id);
              }}
              onClick={() => {
                playSoftClick(0.1);
                setActiveIndex(item.id);
              }}
              onMouseEnter={() => {
                if (item.id !== activeIndex) {
                  playHoverTick(0.055);
                  setActiveIndex(item.id);
                }
              }}
              className={cn(
                "relative flex flex-col cursor-pointer transition-colors duration-300 group outline-none text-[13px] sm:text-[14px]",
                isActive
                  ? "text-zinc-900 dark:text-zinc-100 font-medium"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              )}
            >
              {/* Static Background Track Dot */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -left-4 top-[8px] h-1.5 w-1.5 rounded-full transition-colors duration-300 shrink-0 pointer-events-none",
                  isActive
                    ? "bg-zinc-400/40 dark:bg-zinc-600/40"
                    : "bg-zinc-300 dark:bg-zinc-700"
                )}
              />

              {/* Text content with bold parsing */}
              <span>
                {item.text.split(/(\*\*.*?\*\*)/).map((part, partIndex) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                      <strong
                        key={partIndex}
                        className={cn(
                          "transition-colors duration-300",
                          isActive
                            ? "font-semibold text-zinc-900 dark:text-zinc-100"
                            : "font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
                        )}
                      >
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return part;
                })}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ProjectSyncBackground({ isHovered, isOpen }: { isHovered: boolean; isOpen: boolean }) {
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isMobile = useMediaQuery("(hover: none)");

  if (!hasMounted) return null;

  const shouldShow = isMobile ? true : (isHovered || isOpen);

  return (
    <div 
      className={cn(
        "absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000",
        shouldShow ? "opacity-100" : "opacity-0"
      )}
    >
      {shouldShow && (
        <GlyphMatrix
          glyphs="01·•+*/\<>="
          cellSize={14}
          mutationRate={0.04}
          interval={90}
          fadeBottom={0}
          color="#6495ED"
        />
      )}
      <div className="absolute inset-0 bg-white/70 dark:bg-[#111111]/70" />
    </div>
  );
}

type PlaceholderImageOptions = {
  title: string
  startColor: string
  endColor: string
  accentColor: string
}

const createPlaceholderImage = ({ title, startColor, endColor, accentColor }: PlaceholderImageOptions) => {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="720" gradientUnits="userSpaceOnUse">
      <stop stop-color="${startColor}" />
      <stop offset="1" stop-color="${endColor}" />
    </linearGradient>
  </defs>
  <rect width="1200" height="720" rx="40" fill="url(#bg)" />
  <rect x="96" y="96" width="1008" height="528" rx="30" fill="${accentColor}" fill-opacity="0.18" />
  <circle cx="270" cy="220" r="54" fill="${accentColor}" fill-opacity="0.7" />
  <rect x="352" y="184" width="552" height="72" rx="20" fill="${accentColor}" fill-opacity="0.68" />
  <rect x="196" y="350" width="404" height="36" rx="18" fill="${accentColor}" fill-opacity="0.62" />
  <rect x="196" y="410" width="620" height="30" rx="15" fill="${accentColor}" fill-opacity="0.56" />
  <rect x="196" y="456" width="720" height="30" rx="15" fill="${accentColor}" fill-opacity="0.46" />
  <text x="196" y="565" fill="${accentColor}" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="700">${title}</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function StatusBadge({ dates }: { dates: string }) {
  const percentText = dates.split(" ")[0]; // "100%", "89%", "58%", "0%"
  
  let statusText = "PLANNED";
  if (percentText === "100%") statusText = "COMPLETE";
  else if (percentText === "89%") statusText = "ALMOST";
  else if (percentText === "58%") statusText = "MIDWAY";
  else if (percentText === "0%") statusText = "NOT STARTED YET";

  const isCompleted = percentText === "100%";

  return (
    <div className="relative group/badge whitespace-nowrap shrink-0 pointer-events-none select-none">
      {/* Outer border wrapper matching View All / Ask AI style */}
      <div 
        className={cn(
          "absolute -inset-[4px] border rounded-[8px] pointer-events-none transition-colors duration-300",
          isCompleted 
            ? "border-black dark:border-white group-hover/badge:border-black dark:group-hover/badge:border-white"
            : "border-black/5 dark:border-white/5 group-hover/badge:border-black/10 dark:group-hover/badge:border-white/10"
        )} 
      />
      
      <div 
        className={cn(
          "relative flex items-center justify-center min-w-[72px] h-[26px] px-2 rounded-[4px] text-[10px] sm:text-[11px] font-medium transition-all duration-300 border shadow-sm font-mono",
          isCompleted 
            ? "bg-black dark:bg-white border-black dark:border-white shadow-black/50 dark:shadow-white/50" 
            : "bg-zinc-50 dark:bg-[#09090b] group-hover/badge:bg-zinc-100 dark:group-hover/badge:bg-[#121214] border-black/5 dark:border-white/5 shadow-black/20 dark:shadow-lg dark:shadow-black/80"
        )}
      >
        <span
          className="flex items-center justify-center text-[#6495ED]"
        >
          <AsciiText text={statusText} duration={500} className="font-mono" />
        </span>
      </div>
    </div>
  );
}

export function GoalMilestoneList({ showAll = false }: { showAll?: boolean }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [overrideDisabled, setOverrideDisabled] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent running this on mobile natively, though key events without inputs are rare on mobile
      if (e.key === '*') {
        setOverrideDisabled(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!mounted) return <div className="h-[600px]" />;

  const isDark = resolvedTheme === "dark";
  const startColor = isDark ? "#09090b" : "#ffffff";
  const endColor = isDark ? "#18181b" : "#f4f4f5";
  const accentColor = "#6495ED";

  const handleItemClick = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  const filteredMilestones = showAll 
    ? goalMilestones 
    : goalMilestones.filter(item => item.title !== "System Admin Dashboards");

  return (
    <div className="block w-full">
      {/* Accordion List */}
      <div className="block">
        {filteredMilestones.map((item, idx) => {
          const isOpen = openIdx === idx;
          const isEffectivelyDisabled = item.isDisabled && !overrideDisabled;
          const itemImage = createPlaceholderImage({ 
            title: `0${idx + 1} / ${item.title}`, 
            startColor, 
            endColor, 
            accentColor 
          });

          return (
            <motion.div 
              key={idx} 
              className="group relative"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              variants={{
                hidden: { opacity: 0, scale: 0.95, y: 15 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
              }}
            >
              {/* Dashed bottom border for all items */}
              <div
                className="absolute bottom-0 bleed-x h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
                style={DOT_MASK_HORIZONTAL}
              />
              {/* Corner Intersection Node Dots on vertical guides */}
              <div className="absolute h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-20 -left-3 sm:-left-4 bottom-0 -translate-x-1/2 translate-y-1/2" />
              <div className="absolute h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-20 -right-3 sm:-right-4 translate-x-1/2 translate-y-1/2" />

              <div
                className={cn(
                  "group/item flex flex-row items-center justify-between gap-2 sm:gap-4 py-3.5 px-4 -mx-4 transition-colors relative z-20 rounded-lg sm:py-4 overflow-hidden",
                  isEffectivelyDisabled 
                    ? "opacity-40 grayscale pointer-events-none" 
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900/20 cursor-pointer"
                )}
                onClick={() => !isEffectivelyDisabled && handleItemClick(idx)}
              >
                {/* GlyphMatrix Background (Only for Project SYNC) */}
                {item.title === "Project SYNC" && <ProjectSyncBackground isHovered={hoveredIdx === idx} isOpen={isOpen} />}

                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 relative z-10">
                  {/* Logo Container styled like Experience Section */}
                  {item.title === "Project SYNC" ? (
                    <div className="size-10 shrink-0 rounded-[10px] border border-black/10 bg-zinc-50 shadow-sm shadow-black/15 dark:border-zinc-800 dark:bg-[#111111] dark:shadow-md dark:shadow-black/50 overflow-hidden relative flex items-center justify-center">
                      <AsciiGlitchBlock className="text-[#6495ED]" />
                    </div>
                  ) : item.title === "System Admin Dashboards" ? (
                    <div className="size-10 shrink-0 rounded-[10px] border border-black/10 bg-zinc-50 shadow-sm shadow-black/15 dark:border-zinc-800 dark:bg-[#111111] dark:shadow-md dark:shadow-black/50 overflow-hidden relative flex flex-col items-center justify-center gap-0.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-zinc-400 dark:text-zinc-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span className="text-[7px] font-bold tracking-[0.15em] text-zinc-400 dark:text-zinc-500 uppercase">Soon</span>
                    </div>
                  ) : item.src.includes("github.com") || item.src.includes("Avatar") ? (
                    <div className="size-10 shrink-0 rounded-[10px] border border-black/10 bg-zinc-50 shadow-sm shadow-black/15 dark:border-zinc-800 dark:bg-[#111111] dark:shadow-md dark:shadow-black/50 overflow-hidden relative">
                      <Image
                        src={item.src}
                        alt={item.title}
                        width={40}
                        height={40}
                        sizes="40px"
                        quality={60}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="size-10 shrink-0 rounded-[10px] border border-black/10 bg-zinc-50 p-[2px] shadow-sm shadow-black/15 dark:border-zinc-800 dark:bg-[#111111] dark:shadow-md dark:shadow-black/50">
                      <div className="w-full h-full rounded-[7px] border border-black/5 dark:border-black/20 bg-white dark:bg-[#111111] flex items-center justify-center overflow-hidden relative">
                        <Image
                          src={item.src}
                          alt={item.title}
                          width={40}
                          height={40}
                          sizes="40px"
                          quality={60}
                          style={item.imageZoom ? { transform: `scale(${item.imageZoom})` } : undefined}
                          className={`${item.imageFit === "contain" ? "object-contain" : "object-cover"} w-full h-full`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-0.5 min-w-0 pr-2 sm:pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[14px] font-bold leading-tight sm:text-[17px] ${isOpen ? "text-[#6495ED]" : "text-zinc-900 dark:text-zinc-100"} truncate`}>
                        {item.title === "Project SYNC" ? (
                          <>
                            <span className="sm:hidden inline-block">
                              <JapaneseAsciiText text="Project SYNC x Portfolio" duration={3000} idleScramble={true} />
                            </span>
                            <span className="hidden flex-nowrap items-center gap-x-2 align-middle sm:inline-flex">
                              <span className="inline-flex h-10 items-center">
                                <JapaneseAsciiText text="Project SYNC" duration={3000} idleScramble={true} />
                              </span>
                              <span className="inline-flex h-10 items-center text-[13px] font-semibold leading-none text-zinc-500 dark:text-zinc-500">
                                x
                              </span>
                              <span className="inline-flex h-10 items-center gap-2 leading-none">
                                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-black/10 bg-zinc-50 p-[2px] shadow-sm shadow-black/15 dark:border-zinc-800 dark:bg-[#111111] dark:shadow-md dark:shadow-black/50">
                                  <span className="inline-flex size-full items-center justify-center overflow-hidden rounded-[7px] border border-black/5 bg-white dark:bg-black dark:border-black/20">
                                    <Image
                                      src="https://github.com/VidZid2.png?v=1"
                                      alt="Portfolio"
                                      width={40}
                                      height={40}
                                      sizes="40px"
                                      quality={60}
                                      className="w-full h-full object-cover"
                                    />
                                  </span>
                                </span>
                                <span className="inline-flex h-10 items-center">
                                  <JapaneseAsciiText text="Portfolio" duration={3000} idleScramble={true} />
                                </span>
                              </span>
                            </span>
                          </>
                        ) : (
                          item.title
                        )}
                      </span>
                    </div>
                    <span className="text-[13px] sm:text-[15px] text-zinc-600 dark:text-zinc-400 truncate">
                      {item.title === "Project SYNC" ? (
                        <JapaneseAsciiText text={item.role} delay={1000} duration={3000} idleScramble={true} />
                      ) : (
                        item.role
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 sm:gap-6 shrink-0 relative z-10">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[13px] sm:text-[14px] text-zinc-500 dark:text-zinc-400">
                      {item.location}
                    </span>
                    {item.timeframe && (
                      <span className="text-[11px] sm:text-[12px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-mono">
                        {item.timeframe}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <StatusBadge dates={item.dates} />
                    <div className="w-4 h-4 flex items-center justify-center relative">
                      <svg
                        viewBox="0 0 24 24"
                        className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#6495ED]" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Details Section */}
              <div
                className={`-mx-4 grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`pb-4 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] pl-4 pr-4 sm:pl-6 sm:pr-8 text-[14px] text-zinc-600 dark:text-zinc-400 ${
                      isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                    }`}
                  >
                    {item.metrics && (
                      <div className="relative -ml-4 -mr-4 sm:-ml-6 sm:-mr-8 mb-6 mt-0">
                        {item.title === "Project SYNC" && (
                          <div className="mb-0 pt-6 pb-6 px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-2 relative">
                            <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2.5 w-full">
                              <JapaneseAsciiText text="TECHNICAL ARCHITECTURE" duration={3000} idleScramble={true} />
                            </h3>
                            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
                              Comprehensive breakdown of the core technologies and systems powering this portfolio.
                            </p>
                            {/* Bottom Dashed Line */}
                            <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15]" style={{ maskImage: DOT_MASK_HORIZONTAL.WebkitMaskImage, WebkitMaskImage: DOT_MASK_HORIZONTAL.WebkitMaskImage }} />
                          </div>
                        )}
                        {(item.title === "PRIMA" || item.title === "eLMS 2.0 Overhaul") && (
                          <div className="mb-0 pt-6 pb-6 px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-2 relative">
                            <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2.5 w-full">
                              <JapaneseAsciiText text="TECHNICAL ARCHITECTURE" duration={3000} idleScramble={true} />
                            </h3>
                            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
                              Comprehensive breakdown of the core technologies and systems powering this platform.
                            </p>
                            {/* Bottom Dashed Line */}
                            <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15]" style={{ maskImage: DOT_MASK_HORIZONTAL.WebkitMaskImage, WebkitMaskImage: DOT_MASK_HORIZONTAL.WebkitMaskImage }} />
                          </div>
                        )}
                        {/* Outer Borders */}
                        <span className="pointer-events-none absolute top-0 left-0 right-0 h-0 border-t border-black/30 dark:border-white/[0.15]" style={{ maskImage: DOT_MASK_HORIZONTAL.WebkitMaskImage, WebkitMaskImage: DOT_MASK_HORIZONTAL.WebkitMaskImage }} />
                        <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15]" style={{ maskImage: DOT_MASK_HORIZONTAL.WebkitMaskImage, WebkitMaskImage: DOT_MASK_HORIZONTAL.WebkitMaskImage }} />
                        <span className="pointer-events-none absolute top-0 bottom-0 left-0 w-0 border-l border-black/30 dark:border-white/[0.15]" style={{ maskImage: DOT_MASK_VERTICAL.WebkitMaskImage, WebkitMaskImage: DOT_MASK_VERTICAL.WebkitMaskImage }} />
                        <span className="pointer-events-none absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15]" style={{ maskImage: DOT_MASK_VERTICAL.WebkitMaskImage, WebkitMaskImage: DOT_MASK_VERTICAL.WebkitMaskImage }} />

                        <div className="grid max-w-full grid-cols-2 md:grid-cols-3">
                          {item.metrics.map((metric, i, arr) => {
                            const isMobileLeftEdge = i % 2 === 0;
                            const isMobileRightEdge = (i + 1) % 2 === 0;
                            const isDesktopLeftEdge = i % 3 === 0;
                            const isDesktopRightEdge = (i + 1) % 3 === 0;
                            const isMobileBottom = i >= Math.floor((arr.length - 1) / 2) * 2;
                            const isDesktopBottom = i >= Math.floor((arr.length - 1) / 3) * 3;

                            const rightClass = 
                              isMobileRightEdge && isDesktopRightEdge ? "hidden" :
                              isMobileRightEdge && !isDesktopRightEdge ? "hidden md:block" :
                              !isMobileRightEdge && isDesktopRightEdge ? "block md:hidden" :
                              "block";

                            const bottomClass = 
                              isMobileBottom && isDesktopBottom ? "hidden" :
                              isMobileBottom && !isDesktopBottom ? "hidden md:block" :
                              !isMobileBottom && isDesktopBottom ? "block md:hidden" :
                              "block";

                            const mobilePad = isMobileLeftEdge ? "pl-4 sm:pl-6 pr-3" : "pr-4 sm:pr-8 pl-3";
                            const desktopPad = isDesktopLeftEdge ? "md:pl-6 md:pr-4" : isDesktopRightEdge ? "md:pr-8 md:pl-4" : "md:px-4";

                            return (
                              <div
                                key={metric.label}
                                className={`relative min-w-0 py-2 ${mobilePad} ${desktopPad}`}
                              >
                                {/* Inner Right Border */}
                                <span 
                                  className={`pointer-events-none absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] ${rightClass}`}
                                  style={{ maskImage: DOT_MASK_VERTICAL.WebkitMaskImage, WebkitMaskImage: DOT_MASK_VERTICAL.WebkitMaskImage }} 
                                />
                                {/* Inner Bottom Border */}
                                <span 
                                  className={`pointer-events-none absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] ${bottomClass}`}
                                  style={{ maskImage: DOT_MASK_HORIZONTAL.WebkitMaskImage, WebkitMaskImage: DOT_MASK_HORIZONTAL.WebkitMaskImage }} 
                                />

                                <p className="text-[14px] sm:text-[15px] font-bold leading-tight text-zinc-900 dark:text-zinc-100 break-words">
                                  {metric.value}
                                </p>
                                <p className="mt-1.5 text-[10px] font-medium uppercase text-zinc-400 dark:text-zinc-600">
                                  {metric.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {!item.hidePlaceholder && (
                      <div className="relative mb-4 overflow-hidden rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-black/5 dark:bg-white/5 w-full aspect-video">
                        {item.placeholderVideo ? (
                          <video
                            src={item.placeholderVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover scale-[1.01]"
                          />
                        ) : item.placeholderImage ? (
                          <Image
                            src={item.placeholderImage}
                            alt={`${item.title} image`}
                            fill
                            sizes="(min-width: 768px) 40vw, calc(100vw - 3rem)"
                            quality={85}
                            className="h-auto w-full object-cover"
                          />
                        ) : (
                          <Image
                            src={itemImage}
                            alt={`${item.title} image`}
                            fill
                            sizes="(min-width: 768px) 40vw, calc(100vw - 3rem)"
                            quality={70}
                            className="h-auto w-full object-cover"
                          />
                        )}
                      </div>
                    )}

                    <BouncingGoalMilestoneBulletList
                      description={item.description}
                      isOpen={isOpen}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
