"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { playThemeSwoosh, playHoverTick } from "@/lib/synth-sounds";
import { SoundToggle } from "@/components/SoundToggle";

function subscribeToClient() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function useMounted() {
  return React.useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot,
  );
}

const SolarSwitch = ({ isDark }: { isDark: boolean }) => {
  return (
    <div className="relative flex items-center justify-center h-full w-full">
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, scale: 0.5, rotate: -40, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, rotate: 40, filter: "blur(4px)" }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 24,
              mass: 0.8,
            }}
            className="absolute inset-0 flex items-center justify-center text-zinc-300"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, scale: 0.5, rotate: 40, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, rotate: -40, filter: "blur(4px)" }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 24,
              mass: 0.8,
            }}
            className="absolute inset-0 flex items-center justify-center text-amber-500"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="19.12" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="flex items-center gap-2.5 sm:gap-3 mx-1 sm:mx-0 opacity-0 pointer-events-none" aria-hidden="true">
        <div className="h-[21px] w-[34px] rounded-[5px]" />
        <div className="h-[21px] w-[34px] rounded-[5px]" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    playThemeSwoosh(nextTheme === "dark", 0.12);

    if (typeof document === "undefined" || !("startViewTransition" in document)) {
      setTheme(nextTheme);
      return;
    }

    const root = document.documentElement;
    root.dataset.themeVt = "bottom-up";

    const transition = (
      document as Document & {
        startViewTransition(cb: () => void): { finished: Promise<void> };
      }
    ).startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    transition.finished.finally(() => {
      delete root.dataset.themeVt;
    });
  };

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 mx-1 sm:mx-0">
      <button
        type="button"
        onClick={toggleTheme}
        onMouseEnter={() => playHoverTick(0.06)}
        className={cn(
          "relative inline-flex items-center justify-center group cursor-pointer transition-all duration-300 active:scale-95 z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-[9px]",
          className
        )}
        aria-label="Toggle theme"
        aria-pressed={isDark}
      >
        {/* Outer border wrapper matching View All style */}
        <div className="absolute -inset-[4.5px] border border-black/5 dark:border-white/5 rounded-[9px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
        
        <div className="relative flex items-center justify-center h-[21px] px-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[5px] transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80 shrink-0">
          <div className="relative flex h-[14px] w-[14px] items-center justify-center">
            <SolarSwitch isDark={isDark} />
          </div>
        </div>
      </button>

      <SoundToggle className={className} />
    </div>
  );
}
