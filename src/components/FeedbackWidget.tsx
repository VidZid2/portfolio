"use client";

import {
  Bug,
  Lightbulb,
  MessageSquare,
  MessageCircle,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ComponentType, useEffect, useId, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

type MenuItem = { label: string; icon: ComponentType<{ className?: string }> };

const ITEMS: MenuItem[] = [
  { label: "Bug Report", icon: Bug },
  { label: "Feature Idea", icon: Lightbulb },
  { label: "General", icon: MessageSquare },
];

// Folder-open feel: a touch of overshoot as the panel expands, kept subtle.
const SPRING_FOLDER = {
  type: "spring",
  stiffness: 300,
  damping: 32,
  mass: 0.9,
} as const;

export interface FeedbackWidgetProps {
  className?: string;
}

export function FeedbackWidget({
  className,
}: FeedbackWidgetProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const layoutId = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const morph = reduce ? { duration: 0.15 } : SPRING_FOLDER;

  const handleSelect = (label: string) => {
    window.location.href = `mailto:josiahdeasis009@gmail.com?subject=[Portfolio Feedback] ${label}`;
    setOpen(false);
  };

  return (
    <div ref={ref} className={cn("fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50", className)}>
      <div className="relative inline-flex">
        {/* spacer fixes the anchor to the trigger size */}
        <div className="h-11 w-32 sm:w-36" aria-hidden />

        {/* Instead of center alignment, align it to bottom-right so the panel doesn't overflow the screen */}
        <div className="pointer-events-none absolute right-0 bottom-0 z-30 flex flex-col items-end justify-end min-h-[300px] w-[min(90vw,420px)] [&>*]:pointer-events-auto">
          {/* popLayout pulls the exiting trigger out of flow at once */}
          <AnimatePresence initial={false} mode="popLayout">
            {open ? (
              <motion.div
                key="panel"
                layoutId={layoutId}
                transition={morph}
                style={{ borderRadius: 16 }}
                className="w-[min(90vw,360px)] sm:w-[min(86vw,420px)] overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#111111] shadow-2xl"
              >
                <motion.div
                  // layout lets framer undo the box's morph scaling
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduce ? 0 : 0.12, duration: 0.2 }}
                >
                  {/* header */}
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Send Feedback
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close menu"
                      className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* grid */}
                  <motion.div
                    initial={
                      reduce ? false : { clipPath: "inset(45% 34% 45% 34%)" }
                    }
                    animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    transition={{
                      delay: reduce ? 0 : 0.08,
                      duration: 0.45,
                      ease: EASE_OUT,
                    }}
                    className="grid grid-cols-3"
                  >
                    {ITEMS.map((item, i) => {
                      const cols = 3;
                      const rows = Math.ceil(ITEMS.length / cols);
                      const col = i % cols;
                      const row = Math.floor(i / cols);
                      const dist = Math.hypot(
                        col - (cols - 1) / 2,
                        row - (rows - 1) / 2,
                      );
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => handleSelect(item.label)}
                          className={cn(
                            "flex items-center justify-center px-2 py-6 sm:px-3 sm:py-6 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
                            i % 3 !== 2 && "border-r border-black/5 dark:border-white/5",
                            i < 3 && "border-b border-black/5 dark:border-white/5",
                          )}
                        >
                          <motion.span
                            initial={
                              reduce
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.85, filter: "blur(6px)" }
                            }
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            transition={{
                              delay: reduce ? 0 : 0.1 + dist * 0.07,
                              type: "spring",
                              stiffness: 440,
                              damping: 34,
                            }}
                            className="flex flex-col items-center gap-2 text-center"
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="text-[12px] sm:text-sm font-medium leading-tight">{item.label}</span>
                          </motion.span>
                        </button>
                      );
                    })}
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.button
                key="trigger"
                type="button"
                layoutId={layoutId}
                transition={morph}
                style={{ borderRadius: 16 }}
                onClick={() => setOpen(true)}
                aria-haspopup="menu"
                aria-expanded={open}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                className="inline-flex h-11 w-32 sm:w-36 items-center justify-center border border-black/10 dark:border-white/10 bg-white dark:bg-[#111111] shadow-lg shadow-black/5 dark:shadow-black/20 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <motion.span
                  layout
                  className="inline-flex items-center gap-2 whitespace-nowrap"
                >
                  Feedback
                  <MessageCircle className="h-4 w-4" />
                </motion.span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
