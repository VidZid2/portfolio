"use client";

import { cn } from "@/lib/utils";
import { MobiusLoopIcon } from "./mobius-loop-icon";

export interface MorphingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function MorphingSpinner({ size = "md", className }: MorphingSpinnerProps) {
  const sizeClasses = {
    xs: "w-3.5 h-3.5",
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  return (
    <MobiusLoopIcon className={cn(sizeClasses[size], className)} />
  );
}

export { MobiusLoopIcon };
