"use client";
// Force Turbopack rebuild to clear stale SSR cache


import { AsciiText } from "@/components/ui/ascii-text";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ExperimentStage } from "@/components/swirl/experiment-stage";
import { DEFAULT_TEXT } from "@/components/swirl/default-text";
import { DEFAULT_STAGE } from "@/components/swirl/use-swirl-stage";

export function CardSwirlBackground({ 
  className = "absolute inset-0", 
  word = "TECH" 
}: { 
  className?: string, 
  word?: string 
} = {}) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  const config = {
    ...DEFAULT_STAGE,
    word: word,
    style: "slant" as const,
    inkStops: isDark ? ["#6495ED", "#4A70B2", "#2B4168"] : ["#000000", "#555555", "#999999"],
    logoColor: isDark ? "#6495ED" : "#000000",
    gradient: true,
    gradientAngle: Math.PI / 4,
    gradientFlow: 0.2,
    bg: isDark ? "#000000" : "#ffffff", 
    text: DEFAULT_TEXT,
    zoom: 0.5,
    trail: true,
    trailStrength: 1.0,
    shock: false,
    turbulence: 0.2,
    wavePattern: "wavefront" as const,
    aberration: 0.2,
    scanlines: 0.1,
    curvature: 0.1,
  };

  return (
    <div 
      className={`opacity-[0.15] z-0 mix-blend-screen dark:mix-blend-lighten pointer-events-none transition-opacity duration-1000 ${className}`}
      style={{
        maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)'
      }}
    >
      <ExperimentStage 
        config={config} 
        trackPointer={true} 
        burstOnClick={false}
        seamless={true}
      />
    </div>
  );
}

export function TechStackCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-5 mb-6">
      {/* The Framework */}
      <div className="p-4 rounded-lg border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 min-h-[180px] flex flex-col relative overflow-hidden">
        <CardSwirlBackground />
        <div className="relative z-10 flex flex-col h-full pointer-events-none">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            <AsciiText text="The Framework" delay={0} />
          </h4>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong><AsciiText text="Next.js 16 (App Router, React 19)." delay={100} duration={1200} /></strong>{" "}
            <AsciiText text="I pushed myself to learn the bleeding-edge Next.js App Router. By utilizing" delay={100} duration={1200} />{" "}
            <strong><AsciiText text="Turbopack," delay={100} duration={1200} /></strong>{" "}
            <AsciiText text="I managed to bring my massive production build times down to just" delay={100} duration={1200} />{" "}
            <strong><AsciiText text="~4 seconds." delay={100} duration={1200} /></strong>
          </p>
        </div>
      </div>

      {/* The Styling Engine */}
      <div className="p-4 rounded-lg border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 min-h-[180px] flex flex-col relative overflow-hidden">
        <CardSwirlBackground />
        <div className="relative z-10 flex flex-col h-full pointer-events-none">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            <AsciiText text="The Styling Engine" delay={200} />
          </h4>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong><AsciiText text="Tailwind CSS 4.0." delay={300} duration={1200} /></strong>{" "}
            <AsciiText text="This allowed me to rapidly style the site while learning how to manage complex CSS variables for the dark mode theme." delay={300} duration={1200} />
          </p>
        </div>
      </div>

      {/* The Physics Engine */}
      <div className="p-4 rounded-lg border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 min-h-[180px] flex flex-col relative overflow-hidden">
        <CardSwirlBackground />
        <div className="relative z-10 flex flex-col h-full pointer-events-none">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            <AsciiText text="The Physics Engine" delay={400} />
          </h4>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong><AsciiText text="Framer Motion 12." delay={500} duration={1200} /></strong>{" "}
            <AsciiText text="I wanted the site to feel alive, dedicating hours to learning spring physics and layout animations instead of basic CSS transitions." delay={500} duration={1200} />
          </p>
        </div>
      </div>

      {/* The Scroll Mechanics */}
      <div className="p-4 rounded-lg border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 min-h-[180px] flex flex-col relative overflow-hidden">
        <CardSwirlBackground />
        <div className="relative z-10 flex flex-col h-full pointer-events-none">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            <AsciiText text="The Scroll Mechanics" delay={600} />
          </h4>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong><AsciiText text="Lenis Smooth Scrolling." delay={700} duration={1200} /></strong>{" "}
            <AsciiText text="To make the site feel like a premium native application, I integrated the Lenis engine for fluid smooth scrolling." delay={700} duration={1200} />
          </p>
        </div>
      </div>
    </div>
  );
}
