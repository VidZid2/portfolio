"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FogTextRevealProps {
  text: string | string[];
  holdDuration?: number; // duration to hold text in ms (default 2000)
  loop?: boolean;
  startOnView?: boolean;
  maxBlur?: number; // blur intensity in px (default 12)
  transitionDuration?: number;
  className?: string;
}

export function FogTextReveal({
  text,
  holdDuration = 2000,
  loop = true,
  maxBlur = 12,
  transitionDuration = 0.55,
  className,
}: FogTextRevealProps) {
  const texts = Array.isArray(text) ? text : [text];
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!loop || texts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, holdDuration + transitionDuration * 1000 + 400);

    return () => clearInterval(interval);
  }, [holdDuration, loop, texts.length, transitionDuration]);

  if (texts.length === 0) return null;

  const currentText = texts[currentIndex];

  if (reduce) {
    return <span className={className}>{currentText}</span>;
  }

  // Split into words with spaces for natural typography
  const words = currentText.split(" ");

  return (
    <span className={cn("inline-flex items-center relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={`fog-${currentIndex}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.035,
                delayChildren: 0.02,
              },
            },
            exit: {
              opacity: 0,
              filter: `blur(${maxBlur}px)`,
              y: -4,
              transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              },
            },
          }}
          className="inline-flex flex-wrap items-center gap-[0.28em] whitespace-nowrap"
        >
          {words.map((word, wordIdx) => (
            <motion.span
              key={`${currentIndex}-${word}-${wordIdx}`}
              variants={{
                hidden: {
                  opacity: 0,
                  filter: `blur(${maxBlur}px)`,
                  y: 4,
                  scale: 0.97,
                },
                visible: {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: transitionDuration,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
