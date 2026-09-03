"use client";

import React, { useState, useEffect } from "react";
import { ArcRevealHero } from "@/components/ruixen/arc-reveal-hero";
import LogoTraceLoader, { SyncAsciiText } from "@/components/ui/logo-trace-loader";

function AutoReveal({ trigger, onReveal }: { trigger: boolean; onReveal: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onReveal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReveal]);

  useEffect(() => {
    if (trigger) {
      // JOSIAH is displayed for 3 seconds before morphing to SYNC.
      // SYNC takes ~1 second to ripple-reveal.
      // We wait 4.5 seconds total before the curtain sweeps up automatically.
      const timer = setTimeout(() => {
        onReveal();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [trigger, onReveal]);
  return null;
}

export function GlobalBootSequence({ children, skipIntro }: { children: React.ReactNode; skipIntro?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [logoFinished, setLogoFinished] = useState(false);

  // Set loading to false near the end of the text cycle (around 3000ms)
  // The logo will smoothly fill and call onDone to expand the panel.
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ArcRevealHero
      storageKey="portfolio-first-visit-v1"
      skipIntro={skipIntro}
      greetings={[]}
      greetingHold={800}
      topContent={
        <div 
          className={`flex flex-row items-center justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
            logoFinished ? "scale-90" : "scale-100"
          }`}
        >
          <LogoTraceLoader
            loading={loading}
            size={84}
            strokeWidth={180}
            className={`shrink-0 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] text-[#6495ED] ${
              logoFinished ? "w-16 h-16" : "w-20 h-20"
            }`}
            onDone={() => setLogoFinished(true)}
          />

          <div 
            className={`flex items-center overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              logoFinished ? "max-w-[200px] opacity-100 ml-4" : "max-w-0 opacity-0 ml-0"
            }`}
          >
            <SyncAsciiText visible={logoFinished} />
          </div>
        </div>
      }
      className="w-full min-h-screen rounded-none"
      introClassName="text-[#FDFDFD] dark:text-[#0a0a0a]"
      revealClassName="h-full w-full"
      continueNode={(revealCb) => (
        <>
          <AutoReveal trigger={logoFinished} onReveal={revealCb} />
          <button
            type="button"
            onClick={revealCb}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors uppercase cursor-pointer border border-white/10 hover:border-white/20 bg-black/40 backdrop-blur-sm shadow-sm select-none"
            aria-label="Skip introduction animation"
          >
            <span>Skip [Esc]</span>
          </button>
        </>
      )}
    >
      {children}
    </ArcRevealHero>
  );
}
