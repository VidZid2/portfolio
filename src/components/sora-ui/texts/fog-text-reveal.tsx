"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FogTextRevealProps {
  text: string | string[];
  holdDuration?: number; // duration to hold before switching (in ms, default 2000)
  transitionDuration?: number; // fade in/out duration in seconds
  maxBlur?: number; // max blur in px (default 12)
  loop?: boolean;
  startOnView?: boolean;
  className?: string;
  splitBy?: "word" | "character";
}

export function FogTextReveal({
  text,
  holdDuration = 2000,
  transitionDuration = 0.7,
  maxBlur = 12,
  loop = true,
  startOnView = true,
  className,
  splitBy = "word",
}: FogTextRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: !loop });
  const texts = Array.isArray(text) ? text : [text];
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!loop || texts.length <= 1) return;
    if (startOnView && !isInView) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, holdDuration + transitionDuration * 1000);

    return () => clearInterval(timer);
  }, [holdDuration, loop, texts.length, transitionDuration, startOnView, isInView]);

  if (texts.length === 0) return null;

  const currentText = texts[currentIndex];

  if (reduce) {
    return <span className={cn("font-mono", className)}>{currentText}</span>;
  }

  const units = splitBy === "character" ? currentText.split("") : currentText.split(" ");

  return (
    <span
      ref={containerRef}
      className={cn(
        "inline-flex items-center relative overflow-hidden font-mono tracking-tight select-none",
        className
      )}
    >
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
                staggerChildren: splitBy === "character" ? 0.02 : 0.04,
                delayChildren: 0.02,
              },
            },
            exit: {
              opacity: 0,
              filter: `blur(${maxBlur}px)`,
              y: -3,
              scale: 0.98,
              transition: {
                duration: 0.45,
                ease: [0.4, 0, 0.2, 1],
              },
            },
          }}
          className="inline-flex flex-wrap items-center gap-[0.28em] whitespace-nowrap"
        >
          {units.map((unit, unitIdx) => (
            <motion.span
              key={`${unit}-${unitIdx}`}
              variants={{
                hidden: {
                  opacity: 0,
                  filter: `blur(${maxBlur}px)`,
                  y: 4,
                  scale: 0.96,
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
              {unit === " " ? "\u00A0" : unit}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default FogTextReveal;
