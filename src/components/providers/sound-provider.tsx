"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";

interface SoundContextType {
  muted: boolean;
  toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType>({
  muted: false,
  toggleMute: () => {},
});

export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastHoveredRef = useRef<Element | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-muted");
    if (saved) {
      setMuted(saved === "true");
    }

    // Initialize the Web Audio API context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtxRef.current = new AudioContextClass();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio-muted", muted.toString());
  }, [muted]);

  useEffect(() => {
    const playTick = () => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      
      // Browsers require interaction before AudioContext can play. 
      // If the user hasn't clicked anywhere yet, it might be suspended.
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      // Create a synthesizer graph
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Sound Design: A very soft, modern UI "tick"
      // We use a sine wave that rapidly drops in frequency for a tactile feel
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.02);

      // Volume envelope: extremely quiet (max gain 0.03) and short
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.002); // attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03); // decay

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.03);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (muted) return;

      const target = e.target as HTMLElement;
      // Trigger sound on standard interactive elements
      const interactiveEl = target.closest("a, button, [role='button']");

      if (interactiveEl) {
        // Only play if we just entered a NEW interactive element.
        // This prevents the event from firing repeatedly as the mouse moves across children.
        if (interactiveEl !== lastHoveredRef.current) {
          lastHoveredRef.current = interactiveEl;
          playTick();
        }
      } else {
        // We moved off an interactive element, clear the ref
        lastHoveredRef.current = null;
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [muted]);

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return (
    <SoundContext.Provider value={{ muted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}
