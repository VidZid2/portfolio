"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { FadeMotion, pixelFontSpec } from "./engine";
import { onTransitionChange } from "@/lib/view-transition";
import { cn } from "@/lib/utils";

export interface SmearCardProps {
  word?: string;
  bare?: boolean;
  viewTransitionName?: string;
  className?: string;
}

export function SmearCard({
  word = "JD",
  bare = false,
  viewTransitionName,
  className,
}: SmearCardProps = {}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<FadeMotion | null>(null);
  const { resolvedTheme } = useTheme();

  // Synchronize theme changes
  useEffect(() => {
    if (engineRef.current && resolvedTheme) {
      engineRef.current.setTheme(resolvedTheme === "dark");
    }
  }, [resolvedTheme]);

  // Synchronize word changes
  useEffect(() => {
    if (engineRef.current && word) {
      engineRef.current.setWord(word);
    }
  }, [word]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDark = resolvedTheme ? resolvedTheme === "dark" : true;

    let engine: FadeMotion | null = null;
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
        engine = new FadeMotion(host, isDark, word);
        engineRef.current = engine;
        if (!engine.ok) return;

        if (!reduced) engine.enableHero(3);

        engine.onBg = (css) => {
          host.style.backgroundColor = css;
        };

        if (document.fonts?.load) {
          document.fonts
            .load(pixelFontSpec())
            .catch(() => {})
            .then(() => engine?.refreshFonts());
          document.fonts.ready.then(() => engine?.refreshFonts()).catch(() => {});
        }
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
      if (!engine || reduced) return;
      const r = host.getBoundingClientRect();
      engine.setPointer({
        x: (e.clientX - r.left) / Math.max(1, r.width),
        y: (e.clientY - r.top) / Math.max(1, r.height),
      });
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
  }, [word]); // eslint-disable-line react-hooks/exhaustive-deps

  const isIcon = bare || className?.includes("size-") || className?.includes("h-") || className?.includes("w-");

  return (
    <div
      ref={hostRef}
      data-canvas-card
      style={{ viewTransitionName }}
      aria-label="JD fade motion visual"
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
