"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { MotionContainer } from "@/components/motion-container";
import { playHoverTick, playSoftClick } from "@/lib/synth-sounds";
import { cn } from "@/lib/utils";

const DOT_SIZE = 6;

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
        I&apos;m <strong className="font-semibold text-inherit">Josiah De Asis</strong> (call me Josiah) — a <strong className="font-semibold text-inherit">Full-Stack Front-End Engineer & UI Systems Architect</strong>, known for pixel-perfect execution and an obsessive attention to detail.
      </>
    ),
  },
  {
    id: "passion",
    content: (
      <>
        Passionate about exploring new technologies and turning ideas into reality through polished, thoughtfully crafted projects with fluid micro-interactions and tactile sound design.
      </>
    ),
  },
  {
    id: "creations",
    content: (
      <>
        Creator of <span className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-4 font-medium text-inherit">Sync AI</span> (autonomous multi-model reasoning agent), <span className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-4 font-medium text-inherit">Enterprise ELMS</span>, and high-performance UI systems with mathematical accuracy.
      </>
    ),
  },
];

export function AboutSection({ hasSeenAboutMe = false }: { hasSeenAboutMe?: boolean }) {
  const [greeting, setGreeting] = useState("Good day");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const reduce = useReducedMotion();

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const previousIndexRef = useRef(activeIndex);
  const hasPositionRef = useRef(false);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
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
    const currentItem = ABOUT_BULLETS[activeIndex];
    if (!currentItem) return;
    const node = itemRefs.current.get(currentItem.id);
    if (!node) return;

    animationRef.current?.stop();
    x.set(0);
    y.set(node.offsetTop + 8);
    hasPositionRef.current = true;
  }, [activeIndex, x, y]);

  const positionIndicator = useCallback(
    (shouldAnimate: boolean) => {
      const currentItem = ABOUT_BULLETS[activeIndex];
      if (!currentItem) return;
      const node = itemRefs.current.get(currentItem.id);
      if (!node) return;

      const destinationY = node.offsetTop + 8;
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
      const longJumpProgress = Math.min(1, Math.max(0, (travel - 30) / 80));
      const controlX = -Math.min(18, Math.max(6, travel * 0.2));
      const midpointY = (startY + destinationY) / 2;
      const controlY =
        destinationY + (midpointY - destinationY) * longJumpProgress;

      animationRef.current = animate(0, 1, {
        ...BOUNCE_SPRING,
        stiffness: BOUNCE_SPRING.stiffness - 40 * longJumpProgress,
        damping: BOUNCE_SPRING.damping + longJumpProgress,
        mass: BOUNCE_SPRING.mass + 0.1 * longJumpProgress,
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
    [activeIndex, reduce, x, y],
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
    <div className="relative flex flex-col z-10 w-full">
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
          <h2 className="font-caveat italic text-[24px] sm:text-[28px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide select-none leading-none -mt-0.5">
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
        className="relative py-3.5 sm:py-4 px-1 sm:px-1.5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ul
          ref={listRef}
          className="relative flex flex-col gap-3.5 list-none pl-4 text-[14px] sm:text-[15px] leading-relaxed select-text"
        >
          {/* Bouncing Dot Indicator */}
          <li
            aria-hidden="true"
            role="presentation"
            className="pointer-events-none absolute inset-0 list-none"
          >
            <motion.span
              style={{ x, y }}
              className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-[#6495ED] shadow-[0_0_8px_rgba(100,149,237,0.7)] z-20"
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
                  "relative flex items-start gap-2.5 cursor-pointer transition-all duration-700 ease-out group",
                  isActive
                    ? "text-zinc-900 dark:text-zinc-100 opacity-100"
                    : "text-zinc-400 dark:text-zinc-500 opacity-40 hover:opacity-75"
                )}
              >
                {/* Static Background Dot Slot */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -left-4 top-2 h-1.5 w-1.5 rounded-full transition-colors duration-500 shrink-0 pointer-events-none",
                    isActive
                      ? "bg-[#6495ED]/30"
                      : "bg-zinc-300 dark:bg-zinc-700/60"
                  )}
                />
                <p className="flex-1 transition-colors duration-700">
                  {bullet.content}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

