"use client";

import React, { useEffect, useRef } from "react";

interface SakuraPetalsProps {
  className?: string;
  burst?: boolean;
  active?: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  vx: number;
  vy: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  spinX: number;
  spinY: number;
  spinZ: number;
  swaySpeed: number;
  swayAmp: number;
  seed: number;
}

const LIGHT_SAKURA_COLORS = [
  "rgba(100, 149, 237, 0.92)", // Signature Cornflower Blue (#6495ED)
  "rgba(147, 197, 253, 0.9)",  // Soft Sky Cornflower Blue (#93c5fd)
  "rgba(191, 219, 254, 0.95)", // Pale Ice Blue Petal (#bfdbfe)
  "rgba(96, 165, 250, 0.88)",  // Vibrant Cosmos Blue (#60a5fa)
  "rgba(219, 234, 254, 0.92)", // Pure Whisper Blue Tip (#dbeafe)
];

const DARK_SAKURA_COLORS = [
  "rgba(100, 149, 237, 0.95)", // Luminous Cornflower Blue (#6495ED)
  "rgba(129, 140, 248, 0.92)", // Mystic Indigo Blossom (#818cf8)
  "rgba(165, 180, 252, 0.9)",  // Moonlight Starlight Blue (#a5b4fc)
  "rgba(96, 165, 250, 0.92)",  // Azure Glow (#60a5fa)
  "rgba(199, 210, 254, 0.88)", // Celestial Blue Petal (#c7d2fe)
];

// Pre-compiled Path2D normalized petal shape for GPU-accelerated drawing
let cachedPetalPath: Path2D | null = null;
function getPetalPath(): Path2D {
  if (!cachedPetalPath && typeof Path2D !== "undefined") {
    const p = new Path2D();
    p.moveTo(0, 0.55);
    p.bezierCurveTo(-0.5, 0.25, -0.45, -0.35, -0.16, -0.52);
    p.lineTo(0, -0.38);
    p.lineTo(0.16, -0.52);
    p.bezierCurveTo(0.45, -0.35, 0.5, 0.25, 0, 0.55);
    p.closePath();
    cachedPetalPath = p;
  }
  return cachedPetalPath!;
}

export function SakuraPetals({ className = "", burst = false, active = true }: SakuraPetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstRef = useRef(burst);
  const activeRef = useRef(active);
  const syncLoopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    burstRef.current = burst;
  }, [burst]);

  useEffect(() => {
    activeRef.current = active;
    syncLoopRef.current?.();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let isHidden = typeof document !== "undefined" ? document.hidden : false;
    let running = false;
    let lastTime = performance.now();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.round(rect.width * dpr);
      height = Math.round(rect.height * dpr);
      canvas.width = width;
      canvas.height = height;
    };
    resize();

    const isDark = () => document.documentElement.classList.contains("dark");
    const getColors = () => (isDark() ? DARK_SAKURA_COLORS : LIGHT_SAKURA_COLORS);

    const petalPath = getPetalPath();
    const count = 26;
    const petals: Petal[] = [];

    const createPetal = (spawnFromLeft = false): Petal => {
      const colors = getColors();
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = (9 + Math.random() * 11) * dpr;
      const isBurst = burstRef.current;

      return {
        x: spawnFromLeft
          ? -size * 2 - Math.random() * width * 0.25
          : Math.random() * (width + size * 2) - size,
        y: Math.random() * (height + size * 2) - size,
        size,
        color,
        opacity: 0.7 + Math.random() * 0.3,
        vx: (isBurst ? 3.2 + Math.random() * 4.2 : 0.75 + Math.random() * 1.5) * dpr,
        vy: (isBurst ? 0.3 + Math.random() * 1.2 : 0.25 + Math.random() * 0.7) * dpr,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        spinX: (Math.random() - 0.5) * 0.035,
        spinY: (Math.random() - 0.5) * 0.045,
        spinZ: (Math.random() - 0.5) * 0.025,
        swaySpeed: 1.4 + Math.random() * 1.8,
        swayAmp: (10 + Math.random() * 16) * dpr,
        seed: Math.random() * 100,
      };
    };

    for (let i = 0; i < count; i++) {
      petals.push(createPetal(false));
    }

    let clock = 0;

    const render = (now: number) => {
      if (!running || !activeRef.current || !isVisible || isHidden) {
        running = false;
        rafId = 0;
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      clock += dt;

      ctx.clearRect(0, 0, width, height);

      const isBurst = burstRef.current;
      const speedMultiplier = isBurst ? 2.5 : 1.0;
      const timeScale = dt * 60;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Motion physics with natural harmonic air current sway
        const sway = Math.sin(clock * p.swaySpeed + p.seed) * (0.35 * dpr);
        p.x += (p.vx * speedMultiplier + sway) * timeScale;
        p.y += (p.vy * speedMultiplier) * timeScale;

        p.rotX += p.spinX * speedMultiplier * timeScale;
        p.rotY += p.spinY * speedMultiplier * timeScale;
        p.rotZ += p.spinZ * speedMultiplier * timeScale;

        // Respawn smoothly when drifted offscreen
        if (p.x > width + p.size * 2 || p.y > height + p.size * 2) {
          petals[i] = createPetal(true);
        }

        // Draw with Path2D for peak GPU throughput
        ctx.save();
        ctx.translate(p.x, p.y);

        const cosX = Math.cos(p.rotX);
        const cosY = Math.cos(p.rotY);
        ctx.rotate(p.rotZ);
        ctx.scale(cosY * p.size, cosX * p.size);
        ctx.globalAlpha = p.opacity;

        ctx.fillStyle = p.color;
        if (petalPath) {
          ctx.fill(petalPath);
        } else {
          // Fallback if Path2D is unavailable
          ctx.beginPath();
          ctx.moveTo(0, 0.55);
          ctx.bezierCurveTo(-0.5, 0.25, -0.45, -0.35, -0.16, -0.52);
          ctx.lineTo(0, -0.38);
          ctx.lineTo(0.16, -0.52);
          ctx.bezierCurveTo(0.45, -0.35, 0.5, 0.25, 0, 0.55);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      running = false;
      ctx.clearRect(0, 0, width, height);
    };

    const startLoop = () => {
      if (running || !activeRef.current || !isVisible || isHidden) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(render);
    };

    const syncLoop = () => {
      if (activeRef.current && isVisible && !isHidden) {
        startLoop();
      } else {
        stopLoop();
      }
    };
    syncLoopRef.current = syncLoop;

    syncLoop();

    const onResize = () => {
      resize();
    };
    window.addEventListener("resize", onResize, { passive: true });

    const onVisibilityChange = () => {
      isHidden = document.hidden;
      syncLoop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
        syncLoop();
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    return () => {
      stopLoop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
