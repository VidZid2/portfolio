"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { MotionContainer } from "@/components/motion-container";
import { DrawUnderlineLink } from "@/components/sora-ui/texts/draw-underline-link";
import { playHoverTick, playSoftClick } from "@/lib/synth-sounds";
import { cn } from "@/lib/utils";

const DOT_SIZE = 6;

// A compact, lightly underdamped spring gives the dot a quick landing without
// turning the sidebar into a playful toy. The sideways arc carries the bounce.
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

const ABOUT_BULLETS = [
  {
    id: "bio",
    content: (
      <>
        I&apos;m <strong className="font-semibold text-inherit">Josiah De Asis</strong> (call me Josiah) — a{" "}
        <strong className="font-semibold text-inherit">Full-Stack Front-End Engineer & UI Systems Architect</strong>{" "}
        specializing in React 19, Next.js 16, and crafting high-performance web applications with obsessive attention to detail.
      </>
    ),
  },
  {
    id: "passion",
    content: (
      <>
        Driven by an intense curiosity to master modern technologies, gain deep real-world engineering expertise through complex hands-on builds, and craft polished digital experiences with fluid micro-interactions.
      </>
    ),
  },
  {
    id: "creations",
    content: (
      <>
        Creator of{" "}
        <DrawUnderlineLink
          href="/projects/prima-digital-agency"
          label="PRIMA"
          underlineColor="#6495ED"
          duration={0.4}
          className="inline-flex align-baseline !text-[1em] text-inherit hover:text-[#6495ED] dark:hover:text-[#6495ED] font-semibold"
          underlineClassName="h-[0.35em] -mt-0.5"
        />{" "}
        (B2B digital platform with Gemini AI),{" "}
        <DrawUnderlineLink
          href="/projects/sti-elms"
          label="STI eLMS 2.0"
          underlineColor="#6495ED"
          duration={0.4}
          className="inline-flex align-baseline !text-[1em] text-inherit hover:text-[#6495ED] dark:hover:text-[#6495ED] font-semibold"
          underlineClassName="h-[0.35em] -mt-0.5"
        />{" "}
        (React 19 &amp; Supabase encrypted learning system), and{" "}
        <DrawUnderlineLink
          href="https://github.com/VidZid2/portfolio"
          target="_blank"
          rel="noreferrer"
          label="Project SYNC"
          underlineColor="#6495ED"
          duration={0.4}
          className="inline-flex align-baseline !text-[1em] text-inherit hover:text-[#6495ED] dark:hover:text-[#6495ED] font-semibold"
          underlineClassName="h-[0.35em] -mt-0.5"
        />{" "}
        (custom WebGL &amp; blueprint UI architecture).
      </>
    ),
  },
];

export function AboutSection({ hasSeenAboutMe = false }: { hasSeenAboutMe?: boolean }) {
  const [greeting, setGreeting] = useState("Good evening");
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening">("evening");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const reduce = useReducedMotion();

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const selectedValue = ABOUT_BULLETS[activeIndex]?.id ?? ABOUT_BULLETS[0].id;
  const selectedValueRef = useRef(selectedValue);
  const previousIndexRef = useRef(activeIndex);
  const hasPositionRef = useRef(false);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  selectedValueRef.current = selectedValue;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
      setTimeOfDay("morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
      setTimeOfDay("afternoon");
    } else {
      setGreeting("Good evening");
      setTimeOfDay("evening");
    }
  }, []);

  // 5-Second Auto-Cycling Timer
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ABOUT_BULLETS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const snapIndicator = useCallback(() => {
    const selectedItem = itemRefs.current.get(selectedValueRef.current);
    if (!selectedItem) return;

    animationRef.current?.stop();
    x.set(0);
    y.set(selectedItem.offsetTop + 9);
    hasPositionRef.current = true;
  }, [x, y]);

  const positionIndicator = useCallback(
    (shouldAnimate: boolean) => {
      const selectedItem = itemRefs.current.get(selectedValue);
      if (!selectedItem) return;

      const destinationY = selectedItem.offsetTop + 9;
      animationRef.current?.stop();

      if (!hasPositionRef.current || reduce || !shouldAnimate) {
        x.set(0);
        y.set(destinationY);
        hasPositionRef.current = true;
        previousIndexRef.current = activeIndex;
        return;
      }

      const startY = y.get();
      const distance = destinationY - startY;
      const travel = Math.abs(distance);
      const longJumpProgress = Math.min(1, Math.max(0, (travel - 48) / 120));
      const controlX = -Math.min(36, Math.max(12, travel * 0.3));
      const midpointY = (startY + destinationY) / 2;
      const controlY =
        destinationY + (midpointY - destinationY) * longJumpProgress;

      animationRef.current = animate(0, 1, {
        ...BOUNCE_SPRING,
        stiffness: BOUNCE_SPRING.stiffness - 60 * longJumpProgress,
        damping: BOUNCE_SPRING.damping + longJumpProgress,
        mass: BOUNCE_SPRING.mass + 0.15 * longJumpProgress,
        onUpdate: (progress) => {
          x.set(quadraticBezier(0, controlX, 0, progress));
          y.set(quadraticBezier(startY, controlY, destinationY, progress));
        },
        onComplete: () => {
          x.set(0);
          y.set(destinationY);
        },
      });

      previousIndexRef.current = activeIndex;
    },
    [activeIndex, reduce, selectedValue, x, y],
  );

  useLayoutEffect(() => {
    const shouldAnimate =
      hasPositionRef.current && previousIndexRef.current !== activeIndex;
    positionIndicator(shouldAnimate);
  }, [positionIndicator, activeIndex]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(snapIndicator);
    observer.observe(list);
    return () => observer.disconnect();
  }, [snapIndicator]);

  useLayoutEffect(
    () => () => {
      animationRef.current?.stop();
    },
    [],
  );

  const dashedMask = {
    maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
    WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  };

  return (
    <motion.div 
      layout
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className="relative flex flex-col z-10 w-full"
    >
      {/* Top dashed boundary line */}
      <div
        className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={dashedMask}
      />
      <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

      {/* Greeting Sub-Row (Framed by top & bottom dotted lines) */}
      <div className="relative h-[38px] sm:h-[42px] flex items-center px-1 sm:px-1.5">
        <MotionContainer delay={0} skipAnimation={hasSeenAboutMe}>
          <h2
            className={cn(
              "font-caveat italic text-[24px] sm:text-[28px] font-semibold tracking-wide select-none leading-none -mt-0.5 transition-colors duration-500",
              timeOfDay === "morning" && "text-amber-600 dark:text-amber-300",
              timeOfDay === "afternoon" && "text-sky-600 dark:text-sky-400",
              timeOfDay === "evening" && "text-violet-600 dark:text-violet-300"
            )}
          >
            {greeting}
          </h2>
        </MotionContainer>

        {/* Horizontal Dotted Divider under Greeting */}
        <div
          className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMask}
        />
        <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </div>

      {/* High-Precision Bouncing Highlight Bulleted List */}
      <div
        className="relative py-3.5 sm:py-4 px-1 sm:px-1.5 overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ul
          ref={listRef}
          className="relative flex flex-col gap-3.5 list-none pl-5 overflow-visible text-[14px] sm:text-[15px] leading-relaxed select-text"
        >
          {/* Bouncing Solid Dot Indicator (No glow, solid Black / White) */}
          <li
            aria-hidden="true"
            role="presentation"
            className="pointer-events-none absolute inset-0 list-none overflow-visible"
          >
            <motion.span
              style={{ x, y }}
              className="absolute top-0 left-[3px] h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 z-20 shadow-none"
            />
          </li>

          {ABOUT_BULLETS.map((bullet, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li
                key={bullet.id}
                ref={(node) => {
                  if (node) itemRefs.current.set(bullet.id, node);
                  else itemRefs.current.delete(bullet.id);
                }}
                onClick={() => {
                  playSoftClick(0.04);
                  setActiveIndex(idx);
                }}
                onMouseEnter={() => {
                  if (idx !== activeIndex) playHoverTick(0.015);
                }}
                className={cn(
                  "relative flex items-start cursor-pointer transition-colors duration-500 group",
                  isActive
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"
                )}
              >
                {/* Static Background Track Dot (Gray initially, no glow) */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -left-4 top-[9px] h-1.5 w-1.5 rounded-full transition-colors duration-500 shrink-0 pointer-events-none",
                    isActive
                      ? "bg-zinc-400/40 dark:bg-zinc-600/40"
                      : "bg-zinc-300 dark:bg-zinc-700"
                  )}
                />
                <p className="flex-1 transition-colors duration-500">
                  {bullet.content}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}

