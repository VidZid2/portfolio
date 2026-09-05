"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useSoundPreferences } from "@/hooks/use-sound";
import {
  playHoverTick,
  playSoftClick,
  playTabSelect,
  playAccordionToggle,
} from "@/lib/synth-sounds";
import { unlockAudioContextOnInteraction } from "@/lib/sound-engine";

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

/**
 * Comprehensive selector matching every interactive element across the entire portfolio:
 * links, buttons, tab triggers, modal buttons, cards, list items, custom interactive widgets.
 */
const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "[role='tab']",
  "[role='menuitem']",
  "[role='switch']",
  "[role='checkbox']",
  "[role='radio']",
  "[role='option']",
  "[role='link']",
  "[role='combobox']",
  "[data-slot='button']",
  "[data-slot='tabs-trigger']",
  "[data-slot='dropdown-menu-item']",
  "[data-slot='select-trigger']",
  "[data-slot='dialog-close']",
  "[data-slot='dialog-trigger']",
  "[data-slot='accordion-trigger']",
  "input[type='button']",
  "input[type='submit']",
  "input[type='reset']",
  "input[type='checkbox']",
  "input[type='radio']",
  "select",
  "summary",
  "[data-hover-sound]",
  "[data-click-sound]",
  "[data-interactive]",
  ".cursor-pointer",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const { soundEnabled, muted, toggleSound, toggleMute, setSoundEnabled } = useSoundPreferences();
  const lastHoveredRef = useRef<Element | null>(null);
  const lastHoverTimeRef = useRef<number>(0);
  const lastClickTimeRef = useRef<number>(0);

  // Auto-unlock Web Audio on first user gesture
  useEffect(() => {
    unlockAudioContextOnInteraction();
  }, []);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      if (!soundEnabled) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest?.(INTERACTIVE_SELECTOR);

      if (interactiveEl) {
        // Skip disabled elements
        if (
          interactiveEl.hasAttribute("disabled") ||
          interactiveEl.getAttribute("aria-disabled") === "true" ||
          interactiveEl.classList.contains("disabled") ||
          interactiveEl.classList.contains("pointer-events-none")
        ) {
          return;
        }

        // Allow explicit opt-out
        if (
          interactiveEl.getAttribute("data-sound-hover") === "none" ||
          interactiveEl.getAttribute("data-sound-custom") === "true"
        ) {
          return;
        }

        if (interactiveEl !== lastHoveredRef.current) {
          // If mouse is moving back from an inner child to its parent container,
          // don't re-trigger the container sound to keep scrubbing silky smooth
          if (lastHoveredRef.current && interactiveEl.contains(lastHoveredRef.current)) {
            lastHoveredRef.current = interactiveEl;
            return;
          }

          lastHoveredRef.current = interactiveEl;
          lastHoverTimeRef.current = Date.now();
          playHoverTick(0.055);
        }
      } else {
        lastHoveredRef.current = null;
      }
    };

    // Keyboard navigation focus audio feedback
    const handleFocusIn = (e: FocusEvent) => {
      if (!soundEnabled) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest?.(INTERACTIVE_SELECTOR);
      if (interactiveEl && interactiveEl !== lastHoveredRef.current) {
        if (
          interactiveEl.hasAttribute("disabled") ||
          interactiveEl.getAttribute("aria-disabled") === "true" ||
          interactiveEl.classList.contains("disabled") ||
          interactiveEl.classList.contains("pointer-events-none") ||
          interactiveEl.getAttribute("data-sound-hover") === "none" ||
          interactiveEl.getAttribute("data-sound-custom") === "true"
        ) {
          return;
        }

        lastHoveredRef.current = interactiveEl;
        lastHoverTimeRef.current = Date.now();
        playHoverTick(0.045);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!soundEnabled) return;
      if (e.button !== 0) return; // Only process primary click

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest?.(INTERACTIVE_SELECTOR);

      if (interactiveEl) {
        // Skip disabled elements
        if (
          interactiveEl.hasAttribute("disabled") ||
          interactiveEl.getAttribute("aria-disabled") === "true" ||
          interactiveEl.classList.contains("disabled") ||
          interactiveEl.classList.contains("pointer-events-none")
        ) {
          return;
        }

        // Allow custom sound opt-out for widgets that play their own dedicated SFX (e.g. ThemeToggle)
        if (
          interactiveEl.getAttribute("data-sound-custom") === "true" ||
          interactiveEl.getAttribute("data-sound-click") === "none"
        ) {
          return;
        }

        const now = Date.now();
        if (now - lastClickTimeRef.current < 60) return;
        lastClickTimeRef.current = now;

        // Contextual sound dispatching
        if (interactiveEl.hasAttribute("aria-expanded")) {
          const willOpen = interactiveEl.getAttribute("aria-expanded") !== "true";
          playAccordionToggle(willOpen, 0.065);
        } else if (
          interactiveEl.getAttribute("role") === "tab" ||
          interactiveEl.getAttribute("data-slot") === "tabs-trigger" ||
          interactiveEl.getAttribute("data-sound-click") === "tab"
        ) {
          playTabSelect(0.08);
        } else if (interactiveEl.getAttribute("data-sound-click") === "pop") {
          playSoftClick(0.08);
        } else {
          playSoftClick(0.1);
        }
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("focusin", handleFocusIn, { passive: true });
    document.addEventListener("click", handleClick, { capture: true, passive: true });

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [soundEnabled]);

  return (
    <SoundContext.Provider value={{ soundEnabled, muted, toggleSound, toggleMute, setSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}
