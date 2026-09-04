"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CurvedMenuProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  onAnimationComplete?: () => void;
}

export function CurvedMenu({ isOpen, onClose, children, className, onAnimationComplete }: CurvedMenuProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // We use animating border-radius to achieve the flawless Awwwards curved menu look.
  // It starts with a heavy elliptical curve at the bottom and straightens out as it reaches the top.
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-zinc-950/60 backdrop-blur-md"
          />

          {/* Curved Sheet */}
          <motion.div
            initial={{ 
              y: "100%", 
              borderTopLeftRadius: "50% 100px", 
              borderTopRightRadius: "50% 100px" 
            }}
            animate={{ 
              y: "0%", 
              borderTopLeftRadius: "0px", 
              borderTopRightRadius: "0px" 
            }}
            exit={{ 
              y: "100%", 
              borderTopLeftRadius: "50% 100px", 
              borderTopRightRadius: "50% 100px" 
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.76, 0, 0.24, 1] // Classic Awwwards elastic curve
            }}
            onAnimationComplete={() => {
              if (onAnimationComplete) onAnimationComplete();
            }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-[10000] h-[100dvh] w-full bg-white dark:bg-black shadow-2xl flex flex-col overflow-hidden",
              className
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
