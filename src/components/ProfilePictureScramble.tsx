"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";
import { ProfileRevealCanvas } from "@/components/profile-reveal/ProfileRevealCanvas";
import type { LegoFrameState } from "@/components/profile-reveal/engine";

const GLYPHS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン";

type ScrambleCell = { char: string; flickerDur: number };

export function ProfilePictureScramble() {
  const phase = useArcReveal(); // "intro" | "reveal" | "done"
  const [internalPhase, setInternalPhase] = useState<"scramble" | "image">("scramble");
  const [grid, setGrid] = useState<ScrambleCell[]>([]);
  const [frameState, setFrameState] = useState<LegoFrameState | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateGrid = (): ScrambleCell[] => {
    // 10x10 grid = 100 characters to perfectly fill the dense box.
    // Runs only inside effects/intervals so Math.random never executes during render.
    return Array.from({ length: 100 }, () => ({
      char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      flickerDur: 0.4 + Math.random() * 0.5,
    }));
  };

  // 1. Always start the scrambling loop on mount
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setGrid(generateGrid());
    });
    intervalRef.current = setInterval(() => {
      setGrid(generateGrid());
    }, 120);

    return () => {
      cancelAnimationFrame(frameId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // 2. Resolve the scramble 1.5s after the curtain is done (or immediately if already skipped)
  useEffect(() => {
    if (phase !== "done") return;

    const timer = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setInternalPhase("image");
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [phase]);

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
      className="relative p-[2.5px] sm:p-[3px] rounded-full border-[1.5px] border-black/30 dark:border-white/[0.2] shrink-0 group select-none cursor-default"
    >
      {/* The inner image container */}
      <div className="relative w-16 h-16 min-[360px]:w-20 min-[360px]:h-20 sm:w-[92px] sm:h-[92px] rounded-full overflow-hidden bg-zinc-950 flex items-center justify-center cursor-default">
        
        {/* Scramble Overlay */}
        <AnimatePresence>
          {internalPhase === "scramble" && (
            <motion.div
              initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950 rounded-full overflow-hidden"
            >
              <div className="grid grid-cols-10 grid-rows-10 w-full h-full gap-0 overflow-hidden">
                {grid.map((cell, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0.5, 1, 0.8], scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: i * 0.002,
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

        {/* The fallback / static image (shown on mobile/tablet or before WebGL loads) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: internalPhase !== "scramble" ? 0.9 : 0, scale: internalPhase !== "scramble" ? 1 : 0.9 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 z-10 rounded-full overflow-hidden"
        >
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
        </motion.div>

        {/* WebGL Real-Face Cursor Trail Reveal Effect (Only active on desktop/devices with a fine cursor) */}
        {internalPhase !== "scramble" && (
          <ProfileRevealCanvas
            onFrameUpdate={setFrameState}
            className="z-20"
          />
        )}
      </div>
    </div>
  );
}
