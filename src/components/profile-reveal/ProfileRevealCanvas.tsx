"use client";

import React, { useEffect, useRef, useState } from "react";
import { LegoReveal, type LegoFrameState, ANIME_URL, REAL_URL } from "./engine";
import { playHoverTick } from "@/lib/synth-sounds";

interface ProfileRevealCanvasProps {
  className?: string;
  onFrameUpdate?: (state: LegoFrameState) => void;
}

export function ProfileRevealCanvas({ className, onFrameUpdate }: ProfileRevealCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<LegoReveal | null>(null);
  const [isTouchOnly, setIsTouchOnly] = useState<boolean>(false);

  // 1. Detect if the user is on a touch-only device with no mouse/pointer
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkPointer = () => {
      const hasFine = window.matchMedia("(pointer: fine)").matches;
      const hasHover = window.matchMedia("(hover: hover)").matches;
      const isTouch = window.matchMedia("(pointer: coarse)").matches && !hasFine;
      setIsTouchOnly(isTouch && !hasHover);
    };

    checkPointer();

    const mq = window.matchMedia("(pointer: fine)");
    const handler = () => checkPointer();

    try {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } catch {
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, []);

  // 2. Initialize WebGL Engine
  useEffect(() => {
    if (isTouchOnly || !containerRef.current) return;

    const engine = new LegoReveal(
      containerRef.current,
      ANIME_URL,
      REAL_URL,
      (state) => {
        onFrameUpdate?.(state);
      }
    );

    engineRef.current = engine;
    engine.setVisible(true);

    // Viewport observer to pause animation when scrolled offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        engine.setVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [isTouchOnly, onFrameUpdate]);

  if (isTouchOnly) return null;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        playHoverTick(0.04);
        engineRef.current?.onEnter();
      }}
      onMouseLeave={() => {
        engineRef.current?.onLeave();
      }}
      onMouseMove={(e) => {
        engineRef.current?.onMove(e.nativeEvent);
      }}
      onPointerMove={(e) => {
        engineRef.current?.onMove(e.nativeEvent);
      }}
      className={`absolute inset-0 z-20 rounded-full overflow-hidden cursor-crosshair ${className ?? ""}`}
    />
  );
}
