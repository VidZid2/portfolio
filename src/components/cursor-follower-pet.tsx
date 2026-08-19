"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { playCursorFollowSound, playHoverTick } from "@/lib/synth-sounds";

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  angle: number;
}

export function CursorFollowerPet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  // Spring physics for cursor following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 160, mass: 0.6 };
  const petX = useSpring(mouseX, springConfig);
  const petY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - (rect.left + rect.width / 2);
      const relativeY = e.clientY - (rect.top + rect.height / 2);

      // Clamp movement within a playful bounding area
      const clampedX = Math.max(-120, Math.min(120, relativeX * 0.35));
      const clampedY = Math.max(-40, Math.min(40, relativeY * 0.35));

      mouseX.set(clampedX);
      mouseY.set(clampedY);

      // Calculate eye pupil look angle
      const angle = Math.atan2(relativeY, relativeX);
      const dist = Math.min(4, Math.hypot(relativeX, relativeY) * 0.05);
      setEyeOffset({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCursorFollowSound(0.06);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);

    // Spawn playful particles
    const emojis = ["✨", "🎵", "⭐", "🎉", "💖", "⚡"];
    const newParticles: Particle[] = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: 0,
      y: 0,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      angle: (i * (360 / 4) + (Math.random() * 30 - 15)) * (Math.PI / 180),
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 800);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center select-none py-2"
    >
      {/* Interactive Mascot that follows cursor */}
      <motion.div
        style={{ x: petX, y: petY }}
        className="relative cursor-pointer z-10"
        onMouseEnter={() => {
          setIsHovered(true);
          playHoverTick(0.02);
        }}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        animate={
          isClicked
            ? { scale: [1, 1.25, 0.9, 1.05, 1], rotate: [0, -8, 8, -4, 0] }
            : { y: [0, -4, 0] }
        }
        transition={
          isClicked
            ? { duration: 0.35, ease: "easeOut" }
            : { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
        }
      >
        {/* Mascot Body */}
        <div className="relative w-11 h-9 sm:w-12 sm:h-10 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-950 dark:from-zinc-100 dark:to-zinc-300 border border-zinc-700/60 dark:border-white shadow-lg shadow-black/20 dark:shadow-white/10 flex items-center justify-center transition-shadow duration-300">
          {/* Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-400/20 to-indigo-500/20 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* Interactive Eyes */}
          <div className="relative flex items-center gap-2 z-10">
            {/* Left Eye */}
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white"
                animate={{ x: eyeOffset.x, y: eyeOffset.y }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </div>
            {/* Right Eye */}
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white"
                animate={{ x: eyeOffset.x, y: eyeOffset.y }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </div>
          </div>

          {/* Blush dots on hover */}
          <AnimatePresence>
            {isHovered && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute bottom-1.5 left-1.5 w-1.5 h-1 rounded-full bg-rose-400/80"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute bottom-1.5 right-1.5 w-1.5 h-1 rounded-full bg-rose-400/80"
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Burst Particles on click */}
        <AnimatePresence>
          {particles.map((p) => {
            const distance = 35 + Math.random() * 20;
            const targetX = Math.cos(p.angle) * distance;
            const targetY = Math.sin(p.angle) * distance;
            return (
              <motion.span
                key={p.id}
                initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1.2,
                  x: targetX,
                  y: targetY,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs pointer-events-none z-30"
              >
                {p.emoji}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Handwritten Annotation with Curved Arrow (Matching Reference Picture 1) */}
      <motion.div
        onClick={handleClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="cursor-pointer ml-3 sm:ml-4 flex items-start gap-1.5 group select-none"
      >
        {/* Hand-drawn SVG Curved Arrow */}
        <svg
          viewBox="0 0 42 42"
          fill="none"
          stroke="currentColor"
          className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 dark:text-zinc-400 shrink-0 mt-0.5 transform -rotate-12 group-hover:-rotate-6 transition-transform duration-200"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Curved sketch arrow shaft */}
          <path d="M34 34 C24 30, 14 20, 10 8" />
          {/* Arrowhead */}
          <path d="M6 14 L10 8 L18 10" />
        </svg>

        {/* Dual-Tone Chromatic Handwritten Script */}
        <div className="flex flex-col text-left font-caveat italic text-[17px] sm:text-[19px] leading-[1.1] font-semibold text-[#38bdf8] [text-shadow:1.5px_1.5px_0_#f97316] dark:text-[#38bdf8] dark:[text-shadow:1.5px_1.5px_0_#ea580c] tracking-wide">
          <span>follows your cursor</span>
          <span>click for a sound</span>
        </div>
      </motion.div>
    </div>
  );
}

export default CursorFollowerPet;
