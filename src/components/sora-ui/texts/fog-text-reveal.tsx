"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FogTextRevealProps {
  text: string | string[];
  holdDuration?: number; // shimmer duration in ms (default 3200)
  transitionDuration?: number; // in-animation duration in seconds (default 0.5)
  maxBlur?: number; // max blur in px (default 12)
  loop?: boolean;
  startOnView?: boolean;
  className?: string;
  splitBy?: "word" | "character";
  enableShimmer?: boolean;
}

export function FogTextReveal({
  text,
  holdDuration = 5200,
  transitionDuration = 0.55,
  maxBlur = 12,
  loop = true,
  startOnView = true,
  className,
  splitBy = "word",
  enableShimmer = true,
}: FogTextRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: !loop });
  const texts = Array.isArray(text) ? text : [text];
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!loop || texts.length <= 1) return;
    if (startOnView && !isInView) return;

    const totalCycle = holdDuration + transitionDuration * 1000 + 450;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, totalCycle);

    return () => clearInterval(timer);
  }, [holdDuration, loop, texts.length, transitionDuration, startOnView, isInView]);

  if (texts.length === 0) return null;

  const currentText = texts[currentIndex];

  if (reduce) {
    return <span className={cn("font-mono", className)}>{currentText}</span>;
  }

  const units = splitBy === "character" ? currentText.split("") : currentText.split(" ");
  const shimmerSeconds = holdDuration / 1000;

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
                staggerChildren: splitBy === "character" ? 0.02 : 0.035,
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
          {enableShimmer ? (
            <motion.span
              initial={{ backgroundPosition: "120% center" }}
              animate={{ backgroundPosition: "-20% center" }}
              transition={{
                duration: shimmerSeconds,
                delay: transitionDuration + 0.1,
                ease: [0.25, 0.1, 0.25, 1],
                repeat: 0,
              }}
              style={{
                backgroundSize: "300% 100%",
                backgroundImage:
                  "linear-gradient(90deg, var(--shimmer-base) 0%, var(--shimmer-base) 38%, var(--shimmer-highlight) 50%, var(--shimmer-base) 62%, var(--shimmer-base) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="inline-flex flex-wrap items-center gap-[0.28em] [--shimmer-base:#71717a] [--shimmer-highlight:#09090b] dark:[--shimmer-base:#a1a1aa] dark:[--shimmer-highlight:#ffffff]"
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
          ) : (
            units.map((unit, unitIdx) => (
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
            ))
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default FogTextReveal;
