"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressRadialProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
  startAngle?: number;
  endAngle?: number;
  indicatorClassName?: string;
}

export function ProgressRadial({
  value,
  size = 80,
  strokeWidth = 5,
  startAngle = -90,
  endAngle = 270, // Standard 360 circle
  indicatorClassName,
  className,
  children,
  ...props
}: ProgressRadialProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        className="absolute inset-0 transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="text-zinc-200 dark:text-zinc-800 transition-colors"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={cn(
            "transition-all duration-300 ease-out",
            indicatorClassName
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
