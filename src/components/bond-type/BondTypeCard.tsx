"use client";

import { useEffect, useRef } from "react";
import { BondType } from "./engine";
import { onTransitionChange } from "@/lib/view-transition";
import { FONT_VAR, FONT_WEIGHT } from "./params";

export function BondTypeCard({
  _bare = false,
  viewTransitionName,
  className = "",
  onCycleComplete,
  active = true,
}: {
  _bare?: boolean;
  viewTransitionName?: string;
  className?: string;
  onCycleComplete?: () => void;
  active?: boolean;
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cycleCbRef = useRef(onCycleComplete);
  const activeRef = useRef(active);
  const syncRef = useRef<() => void>(() => {});

  useEffect(() => {
    cycleCbRef.current = onCycleComplete;
    activeRef.current = active;
    syncRef.current();
  }, [onCycleComplete, active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let engine: BondType | null = null;
    let onScreen = false;
    let hidden = false;
    let inTransition = false;

    const sync = () => {
      if (!engine || reduced) return;
      if (onScreen && !hidden && !inTransition && activeRef.current) engine.start();
      else engine.stop();
    };
    syncRef.current = sync;

    const raf = requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      engine = new BondType(canvas);
      if (!engine.ok) return;
      engine.onCycleComplete = () => {
        cycleCbRef.current?.();
      };
      if (reduced) engine.renderStill();
      else sync();

      if (document.fonts?.load) {
        const probe = document.createElement("span");
        probe.style.cssText = "position:absolute;visibility:hidden";
        probe.style.fontFamily = `var(${FONT_VAR}), var(--font-geist-mono), monospace`;
        probe.textContent = "Ag";
        document.body.appendChild(probe);
        const fam = getComputedStyle(probe)
          .fontFamily.split(",")[0]
          .replace(/["']/g, "")
          .trim();
        probe.remove();
        if (fam) {
          document.fonts
            .load(`${FONT_WEIGHT} 1em "${fam}"`)
            .then(() => engine?.setFont(`"${fam}", monospace`), () => {});
        }
      }
    });

    const io = new IntersectionObserver(
      (es) => {
        onScreen = es[0]?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0.1 },
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

    const themeObserver = new MutationObserver(() => {
      if (engine && !engine.ok) return;
      if (reduced) engine?.renderStill();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => engine?.resize(), 120);
    };
    window.addEventListener("resize", onResize);

    const onPointerMove = (e: PointerEvent) => {
      engine?.setMouse(e.clientX, e.clientY);
    };

    const onPointerLeave = () => {
      engine?.clearMouse();
    };

    const onPointerDown = (e: PointerEvent) => {
      engine?.triggerImpulse(e.clientX, e.clientY);
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      offTransition();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.clearTimeout(rt);
      engine?.destroy();
    };
  }, []);

  return (
    <div
      data-canvas-card
      role="img"
      aria-label="The name Josiah De Asis in a cornflower blue pixel typeface on white/black. The letters drift apart into a molecule diagram, fine stair-stepped runs of square pixels bonding each letter to the next within its word. The chain re-scatters through a few different shapes, then the letters glide back into the plain typeset name and it starts again with a new sequence."
      style={viewTransitionName ? { viewTransitionName } : undefined}
      className={`relative select-none overflow-hidden bg-white dark:bg-black cursor-pointer ${className || "h-full w-full"}`}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
