"use client";

import * as React from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/* ── types ───────────────────────────────────────────────────── */

export const ArcRevealContext = React.createContext<"intro" | "reveal" | "done">("done");

export function useArcReveal() {
  return React.useContext(ArcRevealContext);
}

export type ArcRevealGreeting = {
  /** Greeting text in the target script */
  text: string;
  /** Optional `lang` attribute applied to the span (helps screen readers / font rendering) */
  lang?: string;
};

export interface ArcRevealHeroProps {
  /** Greetings cycled before the arc reveal. */
  greetings?: ArcRevealGreeting[];
  /** How long each greeting is held on screen (ms). */
  greetingHold?: number;
  /** Duration of the curved curtain reveal (ms). */
  revealDuration?: number;
  /** Outer `<section>` class. Receives the *post-reveal* surface. */
  className?: string;
  /** Class for the intro (pre-reveal) overlay surface. */
  introClassName?: string;
  /** Class for the cycled greeting `<span>`. */
  greetingClassName?: string;
  /** Class for the wrapper around `children` (the revealed content). */
  revealClassName?: string;
  /**
   * Optional cookie key. When set, a cookie is created when the animation finishes.
   */
  storageKey?: string;
  /** Skip the intro immediately (e.g. if cookie exists on the server). */
  skipIntro?: boolean;
  /**
   * When true, the overlay uses `absolute` positioning (contained within its parent)
   * instead of `fixed` (covering the full viewport). Use `true` for modals/dialogs.
   */
  contained?: boolean;
  /** Optional content to render above the greeting text (e.g. a loader). */
  topContent?: React.ReactNode;
  /** Content shown after the curtain reveal (the "landing"). */
  children?: React.ReactNode;
  /** Optional function to render a continue node after greetings */
  continueNode?: (onClick: () => void) => React.ReactNode;
}

/* ── defaults ────────────────────────────────────────────────── */

const DEFAULT_GREETINGS: ArcRevealGreeting[] = [
  { text: "Quiet." },
  { text: "Sharp." },
  { text: "Calm." },
  { text: "Crafted." },
  { text: "Considered." },
  { text: "Composed." },
  { text: "Honest." },
  { text: "Ready." },
];

type Phase = "intro" | "reveal" | "done";

/* ── component ───────────────────────────────────────────────── */

export function ArcRevealHero({
  greetings = DEFAULT_GREETINGS,
  greetingHold = 620,
  revealDuration = 1500,
  className,
  introClassName,
  greetingClassName,
  revealClassName,
  storageKey,
  skipIntro: skipIntroProp = false,
  contained = false,
  topContent,
  continueNode,
  children,
}: ArcRevealHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  // Client-side cookie check as fallback (for modals that can't pass skipIntro from the server).
  const skipIntro = React.useMemo(() => {
    if (skipIntroProp) return true;
    if (storageKey && typeof document !== "undefined") {
      return document.cookie.includes(`${storageKey}=done`);
    }
    return false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shouldSkip = skipIntro || !!prefersReducedMotion;

  const [isSkipped] = React.useState(shouldSkip);
  const [showContinue, setShowContinue] = React.useState(false);
  const [phase, setPhase] = React.useState<Phase>(shouldSkip ? "done" : "intro");
  const [index, setIndex] = React.useState(0);

  // Drive the arc shape from a single 0→1 progress.
  const progress = useMotionValue(shouldSkip ? 1 : 0);
  const arcPath = useTransform(progress, (p: number) => {
    // p goes from 0 to 1
    // edge goes from 110 (bottom of screen) to -50 (above screen)
    const edge = 110 - p * 160;
    // control point: when p=0, curve is flat. As p increases, middle drags behind (lower Y).
    const control = edge + p * 80;
    return `M 0 0 L 100 0 L 100 ${edge} Q 50 ${control} 0 ${edge} Z`;
  });

  // Greeting cycle.
  React.useEffect(() => {
    if (phase !== "intro" || showContinue) return;
    const isLast = index >= greetings.length - 1;
    if (isLast) {
      if (continueNode) {
        const t = window.setTimeout(() => setShowContinue(true), greetingHold + 220);
        return () => window.clearTimeout(t);
      } else {
        const t = window.setTimeout(() => setPhase("reveal"), greetingHold + 220);
        return () => window.clearTimeout(t);
      }
    }
    const t = window.setTimeout(() => setIndex((i) => i + 1), greetingHold);
    return () => window.clearTimeout(t);
  }, [phase, index, greetingHold, greetings.length, continueNode, showContinue]);

  // Drive the curtain reveal.
  React.useEffect(() => {
    if (phase !== "reveal") return;
    const controls = animate(progress, 1, {
      duration: revealDuration / 1000,
      ease: [0.85, 0, 0.15, 1],
      onComplete: () => {
        if (storageKey && typeof window !== "undefined") {
          document.cookie = `${storageKey}=done; path=/; max-age=31536000`;
        }
        setPhase("done");
      },
    });
    return () => controls.stop();
  }, [phase, progress, revealDuration, storageKey]);

  const showOverlay = phase !== "done";
  const current = greetings[Math.min(index, greetings.length - 1)];

  return (
    <section
      aria-label="Hero"
      className={cn(
        "relative isolate h-full w-full overflow-hidden rounded-xl",
        className,
      )}
    >
      <ArcRevealContext.Provider value={phase}>
        <div className={cn("relative z-0 h-full", revealClassName)}>{children}</div>
      </ArcRevealContext.Provider>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="arc-reveal-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isSkipped ? 0 : 0.18, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              contained
                ? "absolute inset-0 z-[100] overflow-hidden rounded-[inherit]"
                : "fixed inset-0 z-[100] w-screen h-screen overflow-hidden",
              isSkipped && "hidden",
            )}
          >
            {/* Cycled greeting */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {phase === "intro" && topContent && (
                  <motion.div
                    key="topContent"
                    initial={{ opacity: 0, y: 8, scale: 0.95, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -40, scale: 0.85, filter: "blur(12px)" }}
                    transition={{ duration: isSkipped ? 0 : 0.6, ease: [0.32, 0.72, 0, 1] }}
                    className="z-10"
                  >
                    {topContent}
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait">
                {phase === "intro" && current && current.text !== "" && (
                  <motion.span
                    key={`${index}-${current.text}`}
                    lang={current.lang}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: isSkipped ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none px-6 text-center text-2xl sm:text-3xl md:text-4xl font-['Doto'] font-bold tracking-tight text-blue-600 dark:text-blue-400 leading-tight w-full",
                      greetingClassName,
                    )}
                  >
                    {current.text}
                  </motion.span>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {phase === "intro" && continueNode && (
                  <motion.div
                    exit={{ opacity: 0, y: -8 }}
                    className="z-20"
                  >
                    {continueNode(() => setPhase("reveal"))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rising curved curtain */}
            <svg
              className={cn("pointer-events-none absolute inset-0 h-full w-full z-0", introClassName)}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <motion.path d={arcPath} style={{ fill: "currentColor" }} />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ArcRevealHero;
