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
    <span className="relative inline-block h-6 sm:h-7 w-[12px] sm:w-[15px] overflow-hidden leading-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: -18, opacity: 0, scale: 0.85 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 18, opacity: 0, scale: 0.85 }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 30,
            mass: 0.6,
          }}
          className="absolute inset-0 flex items-center justify-center font-mono font-bold tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface TimeUnitBoxProps {
  value: number;
  label: string;
  isSeconds?: boolean;
}

function TimeUnitBox({ value, label, isSeconds }: TimeUnitBoxProps) {
  const padded = String(value).padStart(2, "0");
  const digits = padded.split("");

  return (
    <div className="flex flex-col items-center" suppressHydrationWarning>
      <motion.div
        animate={isSeconds ? { scale: [1, 1.04, 1] } : undefined}
        transition={isSeconds ? { duration: 0.25, ease: "easeOut" } : undefined}
        className="flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 border border-black/10 dark:border-white/10 rounded-lg shadow-xs px-2 sm:px-3 py-1 sm:py-1.5 min-w-[50px] sm:min-w-[62px] backdrop-blur-xs"
        suppressHydrationWarning
      >
        <span
          className="flex items-center text-[16px] sm:text-[20px] font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight"
          suppressHydrationWarning
        >
          {digits.map((d, i) => (
            <TickerDigit key={i} value={d} />
          ))}
        </span>
      </motion.div>
      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1">
        {label}
      </span>
    </div>
  );
}

export function ColonSeparator() {
  return (
    <span
      aria-hidden="true"
      className="text-zinc-400 dark:text-zinc-600 font-mono font-bold text-sm sm:text-base select-none animate-pulse pb-4 sm:pb-5 px-0.5 sm:px-1"
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
      className="flex items-center justify-center gap-1 sm:gap-2 select-none"
    >
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 border border-black/10 dark:border-white/10 rounded-lg shadow-xs px-2 sm:px-3 py-1 sm:py-1.5 min-w-[50px] sm:min-w-[62px] backdrop-blur-xs">
          <span className="flex items-center text-[16px] sm:text-[20px] font-bold text-zinc-400 dark:text-zinc-600 font-mono tracking-tight h-6 sm:h-7 leading-none">
            --
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1">
          Days
        </span>
      </div>
      <ColonSeparator />
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 border border-black/10 dark:border-white/10 rounded-lg shadow-xs px-2 sm:px-3 py-1 sm:py-1.5 min-w-[50px] sm:min-w-[62px] backdrop-blur-xs">
          <span className="flex items-center text-[16px] sm:text-[20px] font-bold text-zinc-400 dark:text-zinc-600 font-mono tracking-tight h-6 sm:h-7 leading-none">
            --
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1">
          Hours
        </span>
      </div>
      <ColonSeparator />
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 border border-black/10 dark:border-white/10 rounded-lg shadow-xs px-2 sm:px-3 py-1 sm:py-1.5 min-w-[50px] sm:min-w-[62px] backdrop-blur-xs">
          <span className="flex items-center text-[16px] sm:text-[20px] font-bold text-zinc-400 dark:text-zinc-600 font-mono tracking-tight h-6 sm:h-7 leading-none">
            --
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1">
          Mins
        </span>
      </div>
      <ColonSeparator />
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 border border-black/10 dark:border-white/10 rounded-lg shadow-xs px-2 sm:px-3 py-1 sm:py-1.5 min-w-[50px] sm:min-w-[62px] backdrop-blur-xs">
          <span className="flex items-center text-[16px] sm:text-[20px] font-bold text-zinc-400 dark:text-zinc-600 font-mono tracking-tight h-6 sm:h-7 leading-none">
            --
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1">
          Secs
        </span>
      </div>
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
      className="flex items-center justify-center gap-1 sm:gap-2 select-none"
      suppressHydrationWarning
    >
      <TimeUnitBox value={display.days} label="Days" />
      <ColonSeparator />
      <TimeUnitBox value={display.hours} label="Hours" />
      <ColonSeparator />
      <TimeUnitBox value={display.minutes} label="Mins" />
      <ColonSeparator />
      <TimeUnitBox value={display.seconds} label="Secs" isSeconds />
    </div>
  );
}

export default ReleaseCountdown;
