"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FogTextRevealProps {
  text: string | string[];
  holdDuration?: number; // duration to hold before switching (in ms, default 2000)
  transitionDuration?: number; // fade in/out duration in seconds
  maxBlur?: number; // max blur in px (default 12)
  loop?: boolean;
  startOnView?: boolean;
  className?: string;
}

export function FogTextReveal({
  text,
  holdDuration = 2000,
  transitionDuration = 0.6,
  maxBlur = 12,
  loop = true,
  className,
}: FogTextRevealProps) {
  const texts = Array.isArray(text) ? text : [text];
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!loop || texts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, holdDuration + transitionDuration * 1000);

    return () => clearInterval(timer);
  }, [holdDuration, loop, texts.length, transitionDuration]);

  if (texts.length === 0) return null;

  const currentText = texts[currentIndex];

  if (reduce) {
    return <span className={className}>{currentText}</span>;
  }

  // Split into words for fine-grained stagger fog reveal
  const words = currentText.split(" ");

  return (
    <span className={cn("inline-flex items-center relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.03,
                delayChildren: 0.04,
              },
            },
            exit: {
              opacity: 0,
              filter: `blur(${maxBlur}px)`,
              y: -3,
              transition: {
                duration: 0.45,
                ease: [0.4, 0, 0.2, 1],
              },
            },
          }}
          className="inline-flex flex-wrap items-center gap-[0.25em]"
        >
          {words.map((word, wordIdx) => (
            <motion.span
              key={`${word}-${wordIdx}`}
              variants={{
                hidden: {
                  opacity: 0,
                  filter: `blur(${maxBlur}px)`,
                  y: 3,
                  scale: 0.98,
                },
                visible: {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: transitionDuration,
                    ease: [0.2, 0.8, 0.2, 1],
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
