"use client";

import React, { useCallback, useEffect, useImperativeHandle } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

export type PlusIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

export type PlusIconProps = React.ComponentPropsWithRef<"div"> & {
  ref?: React.Ref<PlusIconHandle>;
  size?: number;
  isHovered?: boolean;
};

export function PlusIcon({
  ref,
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  isHovered,
  ...props
}: PlusIconProps) {
  const controls = useAnimation();

  useImperativeHandle(ref, () => ({
    startAnimation: () => controls.start("animate"),
    stopAnimation: () => controls.start("normal"),
  }));

  useEffect(() => {
    if (isHovered !== undefined) {
      if (isHovered) {
        controls.start("animate");
      } else {
        controls.start("normal");
      }
    }
  }, [isHovered, controls]);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      controls.start("animate");
      onMouseEnter?.(e);
    },
    [controls, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isHovered === undefined) {
        controls.start("normal");
      }
      onMouseLeave?.(e);
    },
    [controls, isHovered, onMouseLeave]
  );

  return (
    <div
      className={cn("flex items-center justify-center cursor-pointer select-none", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.svg
        animate={controls}
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        variants={{
          normal: {
            rotate: 0,
            scale: 1,
          },
          animate: {
            rotate: 90,
            scale: 1.18,
          },
        }}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </motion.svg>
    </div>
  );
}
