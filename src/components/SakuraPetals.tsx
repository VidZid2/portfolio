"use client";

import React, { useEffect, useRef } from "react";

interface SakuraPetalsProps {
  className?: string;
  burst?: boolean;
  active?: boolean;
}

interface Petal {
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmp: number;
  pitch: number;
  pitchSpeed: number;
  roll: number;
  rollSpeed: number;
  yaw: number;
  yawSpeed: number;
  spriteIndex: number;
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

/**
 * Pre-renders an offscreen sprite for a single petal color.
 * Using pre-rendered GPU textures eliminates CPU Path2D tessellation on every frame.
 */
function createPetalSprite(color: string, size = 64): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.save();
  ctx.translate(size / 2, size / 2);
  const scale = (size * 0.46) / 0.55;
  ctx.scale(scale, scale);

  ctx.beginPath();
  ctx.moveTo(0, 0.55);
  ctx.bezierCurveTo(-0.5, 0.25, -0.45, -0.35, -0.16, -0.52);
  ctx.lineTo(0, -0.38);
  ctx.lineTo(0.16, -0.52);
  ctx.bezierCurveTo(0.45, -0.35, 0.5, 0.25, 0, 0.55);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  // Delicate petal vein highlight
  ctx.beginPath();
  ctx.moveTo(0, 0.45);
  ctx.quadraticCurveTo(0.04, 0.05, 0, -0.32);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
  ctx.lineWidth = 0.04;
  ctx.stroke();

  ctx.restore();
  return canvas;
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
    let smoothDt = 1 / 60;

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
    
    // Generate offscreen sprite textures for active theme
    let lightSprites: HTMLCanvasElement[] = [];
    let darkSprites: HTMLCanvasElement[] = [];
    
    try {
      lightSprites = LIGHT_SAKURA_COLORS.map((c) => createPetalSprite(c, 64));
      darkSprites = DARK_SAKURA_COLORS.map((c) => createPetalSprite(c, 64));
    } catch {
      // Fallback
    }

    const getSprites = () => (isDark() ? darkSprites : lightSprites);

    const count = 24;
    const petals: Petal[] = [];

    const initPetal = (p: Petal, fromLeft = true) => {
      const isBurst = burstRef.current;
      p.size = (10 + Math.random() * 11) * dpr;
      
      if (fromLeft) {
        p.baseX = -p.size * 2 - Math.random() * (width * 0.3);
        p.baseY = Math.random() * height;
      } else {
        p.baseX = Math.random() * width;
        p.baseY = -p.size * 2 - Math.random() * (height * 0.3);
      }

      p.vx = (isBurst ? 2.6 + Math.random() * 2.8 : 0.85 + Math.random() * 0.95) * dpr;
      p.vy = (isBurst ? 0.4 + Math.random() * 0.9 : 0.3 + Math.random() * 0.55) * dpr;
      
      p.swayPhase = Math.random() * Math.PI * 2;
      p.swaySpeed = 1.4 + Math.random() * 1.6;
      p.swayAmp = (8 + Math.random() * 14) * dpr;

      p.pitch = Math.random() * Math.PI * 2;
      p.pitchSpeed = (0.8 + Math.random() * 1.2) * (Math.random() < 0.5 ? 1 : -1);

      p.roll = Math.random() * Math.PI * 2;
      p.rollSpeed = (1.0 + Math.random() * 1.4) * (Math.random() < 0.5 ? 1 : -1);

      p.yaw = Math.random() * Math.PI * 2;
      p.yawSpeed = (0.4 + Math.random() * 0.8) * (Math.random() < 0.5 ? 1 : -1);

      p.opacity = 0.72 + Math.random() * 0.28;
      p.spriteIndex = Math.floor(Math.random() * 5);
    };

    for (let i = 0; i < count; i++) {
      const p = {} as Petal;
      initPetal(p, false);
      // Stagger initial distribution evenly across the canvas
      p.baseX = Math.random() * (width + p.size * 2) - p.size;
      p.baseY = Math.random() * (height + p.size * 2) - p.size;
      petals.push(p);
    }

    const render = (now: number) => {
      if (!running || !activeRef.current || !isVisible || isHidden) {
        running = false;
        rafId = 0;
        return;
      }

      // Exponential moving average for dt to iron out timer scheduler jitter
      const rawDt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;
      smoothDt = smoothDt * 0.82 + rawDt * 0.18;
      const dt = smoothDt;

      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const sprites = getSprites();
      const isBurst = burstRef.current;
      const speedMultiplier = isBurst ? 2.2 : 1.0;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // 1. Smooth steady base advancement (no velocity staggering)
        p.baseX += p.vx * speedMultiplier * (dt * 60);
        p.baseY += p.vy * speedMultiplier * (dt * 60);

        // 2. Harmonic Lissajous sway offset (smooth wave curve, zero jerks)
        p.swayPhase += p.swaySpeed * dt;
        const swayOffsetX = Math.sin(p.swayPhase) * p.swayAmp;
        const swayOffsetY = Math.cos(p.swayPhase * 0.75) * (p.swayAmp * 0.2);

        const renderX = p.baseX + swayOffsetX;
        const renderY = p.baseY + swayOffsetY;

        // 3. Continuous 3D rotation angles
        p.pitch += p.pitchSpeed * dt;
        p.roll += p.rollSpeed * dt;
        p.yaw += p.yawSpeed * dt;

        // Respawn gracefully when drifted fully beyond edges
        if (renderX > width + p.size * 2 || renderY > height + p.size * 2) {
          initPetal(p, true);
          continue;
        }

        // 4. Non-inverting 3D foreshortening projection
        // By taking the absolute cosine with a minimum base thickness,
        // we prevent negative scale flips and 0-width singularities that cause jitter!
        const scaleX = Math.abs(Math.cos(p.pitch)) * 0.75 + 0.25;
        const scaleY = Math.abs(Math.cos(p.roll)) * 0.75 + 0.25;
        const halfSize = (p.size * 0.5);

        // 5. Blazing-fast GPU drawImage
        const sprite = sprites[p.spriteIndex % sprites.length] || sprites[0];
        if (sprite) {
          ctx.save();
          ctx.translate(renderX, renderY);
          ctx.rotate(p.yaw);
          ctx.scale(scaleX, scaleY);
          ctx.globalAlpha = p.opacity;
          ctx.drawImage(sprite, -halfSize, -halfSize, p.size, p.size);
          ctx.restore();
        }
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
      smoothDt = 1 / 60;
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
