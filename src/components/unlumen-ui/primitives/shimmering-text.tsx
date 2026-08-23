"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ShimmeringTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  repeat?: number;
  spread?: number;
}

export function ShimmeringText({
  text,
  className,
  duration = 2.4,
  delay = 0.5,
  repeat = 0,
  // Accepted for API compatibility; the shimmer band width is CSS-fixed.
  spread: _spread = 2,
}: ShimmeringTextProps) {
  return (
    <motion.span
      initial={{ backgroundPosition: "120% center" }}
      animate={{ backgroundPosition: "-120% center" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
        repeat: repeat === 0 ? 0 : repeat,
      }}
      style={{
        backgroundSize: "220% 100%",
        backgroundImage:
          "linear-gradient(90deg, var(--shimmer-base) 0%, var(--shimmer-base) 35%, var(--shimmer-highlight) 50%, var(--shimmer-base) 65%, var(--shimmer-base) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      className={cn(
        "relative inline-block select-none whitespace-nowrap font-mono tracking-tight [--shimmer-base:#71717a] [--shimmer-highlight:#09090b] dark:[--shimmer-base:#a1a1aa] dark:[--shimmer-highlight:#ffffff]",
        className
      )}
    >
      {text}
    </motion.span>
  );
}

export default ShimmeringText;
