"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MotionContainerProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "li";
  skipAnimation?: boolean;
}

const EASE_OUT = [0.0, 0.0, 0.2, 1] as const;

export function MotionContainer({ children, delay = 0, duration = 1.5, className, as = "div", skipAnimation = false }: MotionContainerProps) {
  const Comp = as === "li" ? motion.li : motion.div;
  
  if (skipAnimation) {
    return (
      <Comp
        initial={{ height: "auto", opacity: 1 }}
        className={cn("overflow-hidden", className)}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      initial={{ height: 0, opacity: 0 }}
      whileInView={{ height: "auto", opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration, delay, ease: EASE_OUT }}
      className={cn("overflow-hidden", className)}
    >
      {children}
    </Comp>
  );
}
