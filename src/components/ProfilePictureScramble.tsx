"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";
import { ProfileRevealCanvas } from "@/components/profile-reveal/ProfileRevealCanvas";
import type { LegoFrameState } from "@/components/profile-reveal/engine";

const GLYPHS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン";

type ScrambleCell = { char: string; flickerDur: number };

export function ProfilePictureScramble() {
  const phase = useArcReveal(); // "intro" | "reveal" | "done"
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [initialResolved, setInitialResolved] = useState<boolean>(false);
  const [grid, setGrid] = useState<ScrambleCell[]>([]);
  const [frameState, setFrameState] = useState<LegoFrameState | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);

  const generateGrid = useCallback((): ScrambleCell[] => {
    return Array.from({ length: 100 }, () => ({
      char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      flickerDur: 0.35 + Math.random() * 0.45,
    }));
  }, []);

  const startScrambling = useCallback(() => {
    if (intervalRef.current) return;
    setGrid(generateGrid());
    intervalRef.current = setInterval(() => {
      setGrid(generateGrid());
    }, 100);
  }, [generateGrid]);

  const stopScramblingDelayed = useCallback(() => {
    // Keep scrambling active during the 700ms fade-out so characters don't freeze abruptly
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 750);
  }, []);

  // 1. Start scrambling on mount
  useEffect(() => {
    startScrambling();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [startScrambling]);

  // 2. Initial resolution: wait for curtain to complete, hold for 2.2s, then gracefully resolve
  useEffect(() => {
    if (phase !== "done") return;

    const timer = setTimeout(() => {
      setInitialResolved(true);
      stopScramblingDelayed();
    }, 2200);

    return () => {
      clearTimeout(timer);
    };
  }, [phase, stopScramblingDelayed]);

  // Determine if scramble overlay is visible
  // It is visible before initial resolve, OR whenever user hovers over the avatar!
  const showScramble = !initialResolved || isHovered;

  // Manage scrambling lifecycle based on visibility
  useEffect(() => {
    if (showScramble) {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      startScrambling();
    } else {
      stopScramblingDelayed();
    }
  }, [showScramble, startScrambling, stopScramblingDelayed]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform:
          frameState && isHovered
            ? `perspective(600px) rotateX(${frameState.tiltX.toFixed(2)}deg) rotateY(${frameState.tiltY.toFixed(2)}deg)`
            : undefined,
        transition: "transform 0.1s ease-out",
      }}
      className="relative p-[2.5px] sm:p-[3px] rounded-full border-[1.5px] border-black/30 dark:border-white/[0.2] shrink-0 group select-none cursor-pointer"
      title="Hover to scramble avatar"
    >
      {/* The inner image container */}
      <div className="relative w-16 h-16 min-[360px]:w-20 min-[360px]:h-20 sm:w-[92px] sm:h-[92px] rounded-full overflow-hidden bg-zinc-950 flex items-center justify-center">
        
        {/* Base Static Image (Always rendered underneath for seamless instant reveal) */}
        <div className="absolute inset-0 z-10 rounded-full overflow-hidden">
          <Image
            src="https://github.com/VidZid2.png?v=1"
            alt="Profile"
            width={240}
            height={240}
            quality={90}
            fetchPriority="high"
            sizes="(min-width: 640px) 120px, 96px"
            className="h-full w-full origin-center object-cover grayscale contrast-100 rounded-full mix-blend-multiply dark:mix-blend-normal"
          />
        </div>

        {/* WebGL Real-Face Cursor Trail Reveal Canvas */}
        <ProfileRevealCanvas
          onFrameUpdate={setFrameState}
          className="z-20"
        />

        {/* Smooth ASCII Scramble Overlay at higher z-index (z-30) */}
        <AnimatePresence>
          {showScramble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, filter: "blur(3px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.08, filter: "blur(6px)" }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950/95 rounded-full overflow-hidden pointer-events-none"
            >
              <div className="grid grid-cols-10 grid-rows-10 w-full h-full gap-0 overflow-hidden">
                {grid.map((cell, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0.55, 1, 0.75], scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: i * 0.0015,
                      opacity: { repeat: Infinity, repeatType: "reverse", duration: cell.flickerDur },
                    }}
                    className="flex items-center justify-center text-[7px] sm:text-[9px] font-mono font-black text-[#6495ED] leading-none select-none"
                  >
                    {cell.char}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
