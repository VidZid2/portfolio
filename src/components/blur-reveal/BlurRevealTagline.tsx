"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { RevealGL } from "./gl";
import { renderText } from "./text-texture";

const PHRASES = [
  "Creating with code. Small details matter.",
  "Full-Stack Front-End Engineer.",
  "UI Systems Architect & Design Engineer.",
  "Crafting fluid micro-interactions.",
  "Obsessed with mathematical precision.",
];

const HOLD_MS = 2000;
const OUT_HOLD_MS = 50;
const MAX_BLUR = 10;

const K_IN = 42;
const K_OUT = 60;
const DAMP = 1.0;

const REVEALED_AT = 0.992;
const GONE_AT = 0.02;

function springStep(
  pos: number,
  vel: number,
  target: number,
  k: number,
  damp: number,
  dt: number
): [number, number] {
  const c = 2 * Math.sqrt(k) * damp;
  const accel = -k * (pos - target) - c * vel;
  const v = vel + accel * dt;
  const x = pos + v * dt;
  return [x, v];
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function BlurRevealTagline({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    let disposed = false;
    let running = true;
    let index = 0;
    let W = host.clientWidth || 1;
    let H = host.clientHeight || 1;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isDark = themeRef.current === "dark";
    let fgColor = isDark ? "#a1a1aa" : "#52525b";
    let edge = hexToRgb(fgColor);
    const font = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

    const stage = document.createElement("div");
    Object.assign(stage.style, {
      position: "absolute",
      inset: "0",
      background: "transparent",
      overflow: "hidden",
    });
    host.appendChild(stage);

    const gl = new RevealGL();
    let useGL = gl.available;
    if (useGL) {
      gl.resize(W, H, dpr);
      stage.appendChild(gl.canvas);
    }

    let fallback: HTMLDivElement | null = null;
    const mountFallback = (line: string, fg: string) => {
      if (!fallback) {
        const el = document.createElement("div");
        Object.assign(el.style, {
          position: "absolute",
          inset: "0",
          display: "flex",
          alignItems: "center",
          fontFamily: font,
          fontSize: "12px",
          textAlign: "left",
          transition: "opacity 300ms ease, filter 300ms ease",
        });
        stage.appendChild(el);
        fallback = el;
      }
      fallback.textContent = line;
      fallback.style.color = fg;
    };

    const mountPhrase = (i: number) => {
      const line = PHRASES[i];
      const isCurrentDark = themeRef.current === "dark";
      fgColor = isCurrentDark ? "#a1a1aa" : "#52525b";
      edge = hexToRgb(fgColor);

      if (useGL) {
        const t = renderText({
          line,
          font,
          fill: fgColor,
          cardW: W,
          cardH: H,
          dpr,
          align: "left",
        });
        gl.setTexture(t.canvas);
      } else {
        mountFallback(line, fgColor);
      }
    };

    const onResize = () => {
      W = host.clientWidth || 1;
      H = host.clientHeight || 1;
      if (W < 2 || H < 2) return;
      if (useGL) gl.resize(W, H, dpr);
      mountPhrase(index);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    let phase: "in" | "hold" | "out" = "in";
    let phaseStart = performance.now();
    let last = phaseStart;
    let progress = 0;
    let vel = 0;
    let target = 1;
    let clock = 0;
    let seed = Math.random() * 100;
    let raf = 0;

    mountPhrase(index);

    const loop = () => {
      if (!running || disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      clock += dt;

      const k = target > 0.5 ? K_IN : K_OUT;
      [progress, vel] = springStep(progress, vel, target, k, DAMP, dt);

      if (phase === "in") {
        if (progress >= REVEALED_AT) {
          phase = "hold";
          phaseStart = now;
        }
      } else if (phase === "hold") {
        if (now - phaseStart >= HOLD_MS) {
          phase = "out";
          phaseStart = now;
          target = 0;
        }
      } else {
        if (progress <= GONE_AT && now - phaseStart >= OUT_HOLD_MS) {
          index = (index + 1) % PHRASES.length;
          seed = Math.random() * 100;
          mountPhrase(index);
          phase = "in";
          phaseStart = now;
          progress = 0;
          vel = 0;
          target = 1;
        }
      }

      const clampP = Math.max(0, Math.min(1, progress));
      if (useGL) {
        gl.draw(clampP, MAX_BLUR, edge, clock, W / Math.max(1, H), seed);
      } else if (fallback) {
        fallback.style.opacity = String(clampP);
        fallback.style.filter = `blur(${(1 - clampP) * 8}px)`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      running = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      if (useGL) gl.destroy();
      stage.remove();
    };
  }, [resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[30px] flex items-center select-none overflow-hidden ${className || ""}`}
    />
  );
}
