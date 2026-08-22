"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";

import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface MotionContainerProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "li";
  skipAnimation?: boolean;
}

const EASE_OUT = [0.0, 0.0, 0.2, 1] as const;

export function MotionContainer({ children, delay = 0, duration = 0.8, className, as = "div", skipAnimation = false }: MotionContainerProps) {
  const Comp = as === "li" ? motion.li : motion.div;
  const [hasPlayed, setHasPlayed] = useState(false);
  const phase = useArcReveal();

  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const played = sessionStorage.getItem('portfolio_animations_played_v3');
      if (played) {
        setHasPlayed(true);
      }
    }
  }, []);

  if (skipAnimation || hasPlayed) {
    return (
      <Comp
        initial={{ opacity: 1, y: 0 }}
        className={className}
      >
        {children}
      </Comp>
    );
  }

  const isDone = phase === "done";

  return (
    <Comp
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: isDone ? 1 : 0, y: isDone ? 0 : 15 }}
      transition={{ duration, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </Comp>
  );
}
