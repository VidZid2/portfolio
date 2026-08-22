"use client";

import { useState, useEffect } from "react";

/** Chromium-only hardware hints absent from the standard DOM types. */
interface ExtendedNavigator extends Navigator {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
  };
}

export function usePerformance() {
  const [isLowTier, setIsLowTier] = useState(false);

  useEffect(() => {
    try {
      // 1. Reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const nav = navigator as ExtendedNavigator;

      // 2. Low RAM (Less than 4GB)
      const deviceMemory = nav.deviceMemory;
      const hasLowMemory = deviceMemory !== undefined && deviceMemory < 4;

      // 3. Low CPU Cores (Less than 4 logical cores)
      const hardwareConcurrency = navigator.hardwareConcurrency;
      const hasLowCPU = hardwareConcurrency !== undefined && hardwareConcurrency < 4;

      // 4. Data Saver / Battery Saver modes
      const saveData = nav.connection?.saveData === true;

      // 5. Mobile detection (simple UA check)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // Aggressive tiering: if it asks for reduced motion, has low RAM/CPU,
      // or has data saver on, we consider it low tier and disable heavy initial animations.
      if (prefersReducedMotion || hasLowMemory || hasLowCPU || saveData || (isMobile && (hasLowMemory || hasLowCPU))) {
        const frame = requestAnimationFrame(() => setIsLowTier(true));
        return () => cancelAnimationFrame(frame);
      }
    } catch {
      // Gracefully handle any browser API errors
    }
  }, []);

  return { isLowTier };
}
