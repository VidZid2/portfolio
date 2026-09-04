"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { SprayBurst } from "./engine";
import { onTransitionChange } from "@/lib/view-transition";
import { cn } from "@/lib/utils";

interface SprayBurstCardProps {
  bare?: boolean;
  viewTransitionName?: string;
  className?: string;
  gray?: boolean;
}

export function SprayBurstCard({
  bare = false,
  viewTransitionName,
  className,
  gray = false,
}: SprayBurstCardProps = {}) {
  void bare;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<SprayBurst | null>(null);
  const { resolvedTheme } = useTheme();

  // Synchronize theme changes smoothly with the WebGL engine
  useEffect(() => {
    if (engineRef.current && resolvedTheme) {
      engineRef.current.setTheme(resolvedTheme === "dark");
    }
  }, [resolvedTheme]);

  // Synchronize gray mode changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setGray(Boolean(gray));
    }
  }, [gray]);

  // Synchronize bare (full bleed) mode changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setBare(Boolean(bare));
    }
  }, [bare]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDark = resolvedTheme ? resolvedTheme === "dark" : true;

    let engine: SprayBurst | null = null;
    let onScreen = false;
    let hidden = false;
    let inTransition = false;

    const sync = () => {
      if (!engine || reduced) return;
      if (onScreen && !hidden && !inTransition) engine.start();
      else engine.stop();
    };

    const raf = requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      engine = new SprayBurst(canvas, isDark, Boolean(gray), Boolean(bare));
      engineRef.current = engine;
      if (!engine.ok) return;
      if (reduced) engine.renderStill();
      else sync();
    });

    const io = new IntersectionObserver(
      (es) => {
        onScreen = es[0]?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0.2 },
    );
    io.observe(canvas);

    const onVis = () => {
      hidden = document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);
    const offTransition = onTransitionChange((active) => {
      inTransition = active;
      sync();
    });

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      engine?.setPointer(e.clientX - r.left, e.clientY - r.top);
    };
    const onLeave = () => engine?.setPointer(null, null);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        engine?.resize();
        if (engine && (reduced || !onScreen || hidden)) engine.renderStill();
      }, 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      offTransition();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rt);
      engine?.destroy();
      engineRef.current = null;
    };
  }, [resolvedTheme, gray, bare]);

  return (
    <div
      data-canvas-card
      role="img"
      aria-label="A screenprint boiling at 24fps in cornflower blue, white, and black that continuously reprints itself across six geometric drawings: broken rings, a pinwheel of wedges, a touring starburst, an undulating halftone field of dots, sliding bars, and fusing discs. Every edge is rendered as a sprayed dither with responsive cursor gesture dynamics."
      style={viewTransitionName ? { viewTransitionName } : undefined}
      className={cn(
        bare
          ? "relative size-full overflow-hidden"
          : "relative mx-auto aspect-[1344/820] w-full select-none overflow-hidden rounded-[12px] border border-black/10 dark:border-white/10 bg-white dark:bg-[#09090b] shadow-sm transition-colors duration-500",
        className,
      )}
    >
      <canvas ref={canvasRef} className="h-full w-full block" />
    </div>
  );
}
