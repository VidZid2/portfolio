"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ProfileBadges } from "@/components/ProfileBadges";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";

const GLYPHS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン";

export function ProfilePictureScramble() {
  const phase = useArcReveal(); // "intro" | "reveal" | "done"
  const [internalPhase, setInternalPhase] = useState<"scramble" | "image" | "badges">("scramble");
  const [grid, setGrid] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateGrid = () => {
    // 10x10 grid = 100 characters to perfectly fill the dense box
    return Array.from({ length: 100 }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
  };

  // 1. Always start the scrambling loop on mount
  useEffect(() => {
    setGrid(generateGrid());
    intervalRef.current = setInterval(() => {
      setGrid(generateGrid());
    }, 120);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // 2. Resolve the scramble 1.5s after the curtain is done (or immediately if already skipped)
  useEffect(() => {
    if (phase !== "done") return;

    // Curtain is done (or skipped). Keep scrambling for 1.5 seconds, then reveal image.
    const timer1 = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setInternalPhase("image");
    }, 1500);

    // Badges pop in slightly after the image resolves
    const timer2 = setTimeout(() => {
      setInternalPhase("badges");
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [phase]);

  return (
    <div className="relative p-[3px] rounded-[6px] sm:rounded-[8px] border-[1.5px] border-black/30 dark:border-white/[0.15] shrink-0">
      
      {/* The inner image container */}
      <div className="relative w-12 h-12 min-[360px]:w-16 min-[360px]:h-16 sm:w-20 sm:h-20 rounded-[3px] sm:rounded-[5px] overflow-hidden bg-zinc-950 flex items-center justify-center">
        
        {/* Scramble Overlay */}
        <AnimatePresence>
          {internalPhase === "scramble" && (
            <motion.div
              initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950"
            >
              <div className="grid grid-cols-10 grid-rows-10 w-full h-full gap-0 overflow-hidden">
                {grid.map((char, i) => (
                  <motion.span 
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0.5, 1, 0.8], scale: 1 }}
                    transition={{ 
                      duration: 0.2, 
                      delay: i * 0.002, // Rapid stagger entrance
                      opacity: { repeat: Infinity, repeatType: "reverse", duration: 0.4 + Math.random() * 0.5 } // Random flickering
                    }}
                    className="flex items-center justify-center text-[7px] sm:text-[9px] font-mono font-black text-[#6495ED] leading-none select-none"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The actual image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: internalPhase !== "scramble" ? 0.9 : 0, scale: internalPhase !== "scramble" ? 1 : 0.9 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 z-10"
        >
          <Image
            src="https://github.com/VidZid2.png?v=1"
            alt="Profile"
            width={240}
            height={240}
            quality={90}
            fetchPriority="high"
            sizes="(min-width: 640px) 120px, 96px"
            className="h-full w-full origin-center object-cover grayscale contrast-100 mix-blend-multiply dark:mix-blend-normal"
          />
        </motion.div>
      </div>

      {/* Badges overlapping the image */}
      <AnimatePresence>
        {(internalPhase === "badges") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            {/* The actual badges are positioned absolute bottom-right inside ProfileBadges, so we just render them */}
            <div className="pointer-events-auto">
              <ProfileBadges />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
