"use client";

import React, { useEffect, useRef } from "react";

interface SakuraPetalsProps {
  className?: string;
  burst?: boolean;
}

interface Petal {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  opacity: number;
  vx: number;
  vy: number;
  vz: number;
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
  "rgba(255, 183, 197, 0.9)", // Soft sakura pink
  "rgba(251, 207, 232, 0.95)", // Pale rose
  "rgba(244, 114, 182, 0.85)", // Vibrant petal
  "rgba(249, 168, 212, 0.9)", // Blossom pink
  "rgba(254, 226, 226, 0.9)", // White-pink tip
];

const DARK_SAKURA_COLORS = [
  "rgba(244, 114, 182, 0.95)", // Luminous neon pink
  "rgba(232, 121, 249, 0.9)", // Ethereal magenta
  "rgba(192, 132, 252, 0.85)", // Mystic violet
  "rgba(251, 207, 232, 0.95)", // Glowing sakura
  "rgba(129, 140, 248, 0.85)", // Night blue-tinted petal
];

export function SakuraPetals({ className = "", burst = false }: SakuraPetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstRef = useRef(burst);
  burstRef.current = burst;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;

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

    const petals: Petal[] = [];
    const count = 38;

    const createPetal = (spawnFromLeft = false): Petal => {
      const colors = getColors();
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = (8 + Math.random() * 12) * dpr;
      const isBurst = burstRef.current;

      return {
        x: spawnFromLeft
          ? -size * 2 - Math.random() * width * 0.3
          : Math.random() * (width + size * 2) - size,
        y: Math.random() * (height + size * 2) - size,
        z: Math.random() * 100,
        size,
        color,
        opacity: 0.65 + Math.random() * 0.35,
        vx: (isBurst ? 3.5 + Math.random() * 5.0 : 0.8 + Math.random() * 1.8) * dpr,
        vy: (isBurst ? 0.4 + Math.random() * 1.6 : 0.3 + Math.random() * 0.9) * dpr,
        vz: (Math.random() - 0.5) * 0.5,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        spinX: (Math.random() - 0.5) * 0.04,
        spinY: (Math.random() - 0.5) * 0.05,
        spinZ: (Math.random() - 0.5) * 0.03,
        swaySpeed: 1.2 + Math.random() * 2.0,
        swayAmp: (12 + Math.random() * 20) * dpr,
        seed: Math.random() * 100,
      };
    };

    for (let i = 0; i < count; i++) {
      petals.push(createPetal(false));
    }

    let clock = 0;

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);

      // 3D pseudo-rotation transforms
      const cosX = Math.cos(p.rotX);
      const cosY = Math.cos(p.rotY);
      const scaleX = cosY;
      const scaleY = cosX;

      ctx.rotate(p.rotZ);
      ctx.scale(scaleX, scaleY);
      ctx.globalAlpha = p.opacity;

      const s = p.size;

      // Authentic Japanese Cherry Blossom (Sakura) Petal with notched cleft tip
      ctx.beginPath();
      ctx.moveTo(0, s * 0.55);
      ctx.bezierCurveTo(-s * 0.5, s * 0.25, -s * 0.45, -s * 0.35, -s * 0.16, -s * 0.52);
      // Notched tip cleft:
      ctx.lineTo(0, -s * 0.38);
      ctx.lineTo(s * 0.16, -s * 0.52);
      ctx.bezierCurveTo(s * 0.45, -s * 0.35, s * 0.5, s * 0.25, 0, s * 0.55);
      ctx.closePath();

      ctx.fillStyle = p.color;
      ctx.fill();

      // Subtle translucent vein highlight for crisp organic texture
      ctx.strokeStyle = isDark()
        ? "rgba(255, 255, 255, 0.35)"
        : "rgba(255, 240, 245, 0.45)";
      ctx.lineWidth = Math.max(0.6, 0.8 * dpr);
      ctx.beginPath();
      ctx.moveTo(0, s * 0.45);
      ctx.quadraticCurveTo(0, 0, 0, -s * 0.32);
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      if (!isVisible) {
        rafId = requestAnimationFrame(render);
        return;
      }

      clock += 0.016;
      ctx.clearRect(0, 0, width, height);

      const isBurst = burstRef.current;
      const speedMultiplier = isBurst ? 2.8 : 1.0;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Motion physics with natural wind gusts and harmonic sway
        const sway = Math.sin(clock * p.swaySpeed + p.seed) * (0.4 * dpr);
        p.x += (p.vx * speedMultiplier) + sway;
        p.y += p.vy * speedMultiplier;

        p.rotX += p.spinX * (isBurst ? 2.5 : 1.0);
        p.rotY += p.spinY * (isBurst ? 2.5 : 1.0);
        p.rotZ += p.spinZ * (isBurst ? 2.5 : 1.0);

        // Respawn when offscreen
        if (p.x > width + p.size * 2 || p.y > height + p.size * 2) {
          petals[i] = createPetal(true);
        }

        drawPetal(p);
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    const onResize = () => {
      resize();
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.1 },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
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
