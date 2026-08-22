"use client";

import {
  AnimatePresence,
  motion,
  type PanInfo,
  useDragControls,
  useReducedMotion,
} from "framer-motion";
import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const EASE_DRAWER = [0.16, 1, 0.3, 1] as const;
const DRAWER = { duration: 0.5, ease: [...EASE_DRAWER] as [number, number, number, number] };

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snapPoints?: (number | "auto")[];
  defaultSnap?: number;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  dismissThreshold?: number;
}

export function BottomSheet({
  open,
  onOpenChange,
  snapPoints = [0.5, 0.92],
  defaultSnap = 0,
  title,
  description,
  children,
  className,
  dismissThreshold = 120,
}: BottomSheetProps) {
  const [snap, setSnap] = useState(defaultSnap);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const heightRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setSnap(defaultSnap));
    return () => cancelAnimationFrame(frame);
  }, [open, defaultSnap]);

  useEffect(() => {
    if (!open) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [open, onOpenChange]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (velocity > 600 || offset > dismissThreshold) {
      const smaller = snapPoints.map((_, i) => i).filter((i) => i < snap);
      if (smaller.length && velocity < 800 && offset < dismissThreshold * 1.6) {
        setSnap(smaller[smaller.length - 1]);
      } else {
        onOpenChange(false);
      }
      return;
    }

    if (velocity < -500) {
      setSnap(Math.min(snapPoints.length - 1, snap + 1));
      return;
    }

    if (offset > 80 && snap > 0) setSnap(snap - 1);
    else if (offset < -80 && snap < snapPoints.length - 1) setSnap(snap + 1);
  };

  const snapValue = snapPoints[snap];
  const heightStyle =
    snapValue === "auto"
      ? { maxHeight: "92vh" }
      : { height: `${(snapValue as number) * 100}vh` };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="pointer-events-none fixed inset-0 z-[9999]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={DRAWER}
            onClick={() => onOpenChange(false)}
            className="pointer-events-auto absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            ref={sheetRef}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.02, bottom: 0.4 }}
            dragMomentum={false}
            onDragEnd={onDragEnd}
            initial={reduce ? { y: 0, opacity: 0 } : { y: "100%" }}
            animate={reduce ? { y: 0, opacity: 1 } : { y: 0 }}
            exit={reduce ? { y: 0, opacity: 0 } : { y: "100%" }}
            transition={reduce ? { duration: 0.18, ease: EASE_DRAWER } : DRAWER}
            onAnimationComplete={() => {
              if (sheetRef.current)
                heightRef.current = sheetRef.current.offsetHeight;
            }}
            style={heightStyle}
            className={cn(
              "pointer-events-auto absolute bottom-0 left-0 right-0 mx-auto flex w-full flex-col overflow-hidden rounded-t-[32px] will-change-transform",
              "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] shadow-xl",
              className,
            )}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="flex cursor-grab touch-none flex-col items-center px-4 pb-2 pt-3 active:cursor-grabbing"
            >
              <div className="h-1.5 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              {title || description ? (
                <div className="mt-3 w-full">
                  {title ? (
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      {title}
                    </h2>
                  ) : null}
                  {description ? (
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                      {description}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain pb-6">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
