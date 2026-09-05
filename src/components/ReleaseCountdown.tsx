"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Calculates target release timestamp for October 1st.
 * If October 1st of the current year has already passed, targets next year's October 1st.
 */
export function getOctoberFirstTarget(fromTime = Date.now()): number {
  const fromDate = new Date(fromTime);
  const year = fromDate.getFullYear();
  let target = new Date(year, 9, 1, 0, 0, 0).getTime();
  if (target <= fromTime) {
    target = new Date(year + 1, 9, 1, 0, 0, 0).getTime();
  }
  return target;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function calculateTimeRemaining(targetTime: number, now = Date.now()): TimeRemaining {
  const diff = Math.max(0, targetTime - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, total: diff };
}

/**
 * Individual digit with rolling spring tick animation
 */
function TickerDigit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-5 sm:h-5.5 w-[10px] sm:w-[11px] overflow-hidden leading-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: -14, opacity: 0, scale: 0.85 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 14, opacity: 0, scale: 0.85 }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 30,
            mass: 0.6,
          }}
          className="absolute inset-0 flex items-center justify-center font-mono font-bold tabular-nums leading-none"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface TimeUnitProps {
  value: number;
  suffix: string;
  isSeconds?: boolean;
}

function TimeUnit({ value, suffix, isSeconds }: TimeUnitProps) {
  const padded = String(value).padStart(2, "0");
  const digits = padded.split("");

  return (
    <div className="inline-flex items-baseline gap-0.5" suppressHydrationWarning>
      <motion.span
        animate={isSeconds ? { scale: [1, 1.08, 1] } : undefined}
        transition={isSeconds ? { duration: 0.25, ease: "easeOut" } : undefined}
        className="flex items-center text-[14px] sm:text-[15px] font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight leading-none"
        suppressHydrationWarning
      >
        {digits.map((d, i) => (
          <TickerDigit key={i} value={d} />
        ))}
      </motion.span>
      <span className="text-[10px] sm:text-[11px] font-mono font-medium text-zinc-400 dark:text-zinc-500 select-none">
        {suffix}
      </span>
    </div>
  );
}

export function ColonSeparator() {
  return (
    <span
      aria-hidden="true"
      className="text-zinc-300 dark:text-zinc-600 font-mono text-[11px] select-none animate-pulse px-0.5"
    >
      :
    </span>
  );
}

export function ReleaseCountdownSkeleton() {
  return (
    <div
      role="timer"
      aria-hidden="true"
      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-black/10 dark:border-white/10 shadow-xs select-none backdrop-blur-xs"
    >
      {["d", "h", "m", "s"].map((suffix, idx) => (
        <span key={suffix} className="inline-flex items-center gap-1.5 sm:gap-2">
          <span className="inline-flex items-baseline gap-0.5">
            <span className="text-[14px] sm:text-[15px] font-bold text-zinc-400 dark:text-zinc-600 font-mono tracking-tight leading-none">
              --
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono font-medium text-zinc-400 dark:text-zinc-500">
              {suffix}
            </span>
          </span>
          {idx < 3 && <ColonSeparator />}
        </span>
      ))}
    </div>
  );
}

export function ReleaseCountdown({ targetDate }: { targetDate?: number }) {
  const isMounted = useIsMounted();
  const target = useMemo(() => targetDate ?? getOctoberFirstTarget(), [targetDate]);
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  const display = isMounted ? timeLeft : calculateTimeRemaining(target);

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`Countdown to release: ${display.days} days, ${display.hours} hours, ${display.minutes} minutes, and ${display.seconds} seconds`}
      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-black/10 dark:border-white/10 shadow-xs select-none backdrop-blur-xs"
      suppressHydrationWarning
    >
      <TimeUnit value={display.days} suffix="d" />
      <ColonSeparator />
      <TimeUnit value={display.hours} suffix="h" />
      <ColonSeparator />
      <TimeUnit value={display.minutes} suffix="m" />
      <ColonSeparator />
      <TimeUnit value={display.seconds} suffix="s" isSeconds />
    </div>
  );
}

export default ReleaseCountdown;
