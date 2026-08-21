"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useSoundPreferences } from "@/hooks/use-sound";
import { playHoverTick, playSoftClick } from "@/lib/synth-sounds";

interface SoundContextType {
  soundEnabled: boolean;
  muted: boolean;
  toggleSound: () => void;
  toggleMute: () => void;
  setSoundEnabled: (val: boolean) => void;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: true,
  muted: false,
  toggleSound: () => {},
  toggleMute: () => {},
  setSoundEnabled: () => {},
});

export const useSound = () => useContext(SoundContext);

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], [role='tab'], [role='menuitem'], [role='switch'], [role='checkbox'], [role='radio'], [role='option'], [role='link'], input[type='button'], input[type='submit'], input[type='reset'], input[type='checkbox'], input[type='radio'], select, summary, [data-hover-sound], [tabindex]:not([tabindex='-1'])";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const { soundEnabled, muted, toggleSound, toggleMute, setSoundEnabled } = useSoundPreferences();
  const lastHoveredRef = useRef<Element | null>(null);
  const lastClickTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      if (!soundEnabled) return;

      const target = e.target as HTMLElement;
      const interactiveEl = target?.closest?.(INTERACTIVE_SELECTOR);

      if (interactiveEl) {
        if (interactiveEl !== lastHoveredRef.current) {
          lastHoveredRef.current = interactiveEl;
          playHoverTick(0.06);
        }
      } else {
        lastHoveredRef.current = null;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!soundEnabled) return;

      const target = e.target as HTMLElement;
      const interactiveEl = target?.closest?.(INTERACTIVE_SELECTOR);

      if (interactiveEl) {
        const now = Date.now();
        if (now - lastClickTimeRef.current > 40) {
          lastClickTimeRef.current = now;
          playSoftClick(0.1);
        }
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mousedown", handleMouseDown, { passive: true });
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [soundEnabled]);

  return (
    <SoundContext.Provider value={{ soundEnabled, muted, toggleSound, toggleMute, setSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}

