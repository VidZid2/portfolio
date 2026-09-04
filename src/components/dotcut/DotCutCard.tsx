"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { DotCut } from "./engine";
import { onTransitionChange } from "@/lib/view-transition";
import { cn } from "@/lib/utils";

export interface DotCutCardProps {
  symbol?: string;
  bare?: boolean;
  cols?: number;
  viewTransitionName?: string;
  className?: string;
}

export function DotCutCard({
  symbol = "JD",
  bare = false,
  cols,
  viewTransitionName,
  className,
}: DotCutCardProps = {}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<DotCut | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (engineRef.current && resolvedTheme) {
      engineRef.current.setTheme(resolvedTheme === "dark");
    }
  }, [resolvedTheme]);

  useEffect(() => {
    if (engineRef.current && symbol) {
      engineRef.current.setSymbol(symbol);
    }
  }, [symbol]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDark = resolvedTheme ? resolvedTheme === "dark" : true;

    let engine: DotCut | null = null;
    let raf = 0;
    let created = false;
    let onScreen = false;
    let hidden = false;
    let inTransition = false;

    const running = () => onScreen && !hidden && !inTransition;
    const sync = () => {
      if (!engine || reduced) return;
      if (running()) engine.start();
      else engine.stop();
    };

    const create = () => {
      if (created) return;
      created = true;
      raf = requestAnimationFrame(() => {
        if (!hostRef.current) return;
        engine = new DotCut(host, isDark, symbol, cols);
        engineRef.current = engine;
        if (!engine.ok) return;

        if (reduced) engine.renderStill();
        else sync();
      });
    };

    const io = new IntersectionObserver(
      (es) => {
        onScreen = es.some((e) => e.isIntersecting);
        if (onScreen && !created) create();
        if (created) sync();
      },
      { rootMargin: "100px" },
    );
    io.observe(host);

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
      if (!engine) return;
      const r = host.getBoundingClientRect();
      const pt = engine.toCell(e.clientX - r.left, e.clientY - r.top);
      engine.setPointer(pt);
    };
    const onLeave = () => engine?.setPointer(null);

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointercancel", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      offTransition();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
      engine?.destroy();
      engineRef.current = null;
    };
  }, [symbol, cols]); // eslint-disable-line react-hooks/exhaustive-deps

  const isIcon = bare || className?.includes("size-") || className?.includes("h-") || className?.includes("w-");

  return (
    <div
      ref={hostRef}
      data-canvas-card
      style={{ viewTransitionName }}
      aria-label="Dot cut negative space animation"
      className={cn(
        "relative select-none overflow-hidden",
        isIcon
          ? "size-full"
          : "aspect-[1344/620] w-full rounded-[12px] border border-[var(--border-line)] bg-[var(--bg-hover)]",
        className,
      )}
    />
  );
}
