"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  /** Class for the panel surface. */
  className?: string;
  /** Class for the backdrop. */
  backdropClassName?: string;
  ariaLabel?: string;
  /** Close when the backdrop is clicked. Default true. */
  dismissable?: boolean;
}

export function Modal({
  open,
  onOpenChange,
  children,
  className,
  backdropClassName,
  ariaLabel,
  dismissable = true,
}: ModalProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close modal"
            tabIndex={dismissable ? 0 : -1}
            onClick={() => dismissable && onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className={cn(
              "absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-md",
              backdropClassName,
            )}
          />

          {/* Centered Modal Surface */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 12 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 12 }}
            transition={reduce ? { duration: 0.2, ease: EASE_OUT } : SPRING_PANEL}
            className={cn(
              "relative z-10 w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden",
              className,
            )}
          >
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
