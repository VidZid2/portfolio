"use client";

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useSoundPreferences } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { playHoverTick } from "@/lib/synth-sounds";

export function SoundToggle({ className }: { className?: string }) {
  const { soundEnabled, toggleSound } = useSoundPreferences();

  return (
    <button
      type="button"
      onClick={() => {
        toggleSound();
        if (!soundEnabled) {
          // If we are turning it ON, play a subtle tick as feedback
          // setTimeout ensures state updates first
          setTimeout(() => playHoverTick(0.2), 50);
        }
      }}
      onMouseEnter={() => playHoverTick(0.05)}
      className={cn(
        "relative group cursor-pointer transition-all duration-300 active:scale-95 z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-[9px]",
        className
      )}
      aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
      aria-pressed={soundEnabled}
    >
      {/* Outer border wrapper matching ThemeToggle style */}
      <div className="absolute -inset-[4.5px] border border-black/5 dark:border-white/5 rounded-[9px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
      
      <div className="relative flex items-center justify-center h-[21px] px-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[5px] transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80 shrink-0 overflow-hidden">
        <div className="relative flex h-[14px] w-[14px] items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {soundEnabled ? (
              <motion.div
                key="volume2"
                initial={{ opacity: 0, scale: 0.5, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Volume2 className="w-[14px] h-[14px]" strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="volumex"
                initial={{ opacity: 0, scale: 0.5, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <VolumeX className="w-[14px] h-[14px]" strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </button>
  );
}
