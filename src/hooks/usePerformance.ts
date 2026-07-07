"use client";

import { useState, useEffect } from "react";

export function usePerformance() {
  const [isLowTier, setIsLowTier] = useState(false);

  useEffect(() => {
    try {
      // 1. Reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // 2. Low RAM (Less than 4GB)
      const deviceMemory = (navigator as any).deviceMemory;
      const hasLowMemory = deviceMemory && deviceMemory < 4;
      
      // 3. Low CPU Cores (Less than 4 logical cores)
      const hardwareConcurrency = navigator.hardwareConcurrency;
      const hasLowCPU = hardwareConcurrency && hardwareConcurrency < 4;
      
      // 4. Data Saver / Battery Saver modes
      const connection = (navigator as any).connection;
      const saveData = connection && connection.saveData;

      // 5. Mobile detection (simple UA check)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // Aggressive tiering: if it asks for reduced motion, has low RAM/CPU, 
      // or has data saver on, we consider it low tier and disable heavy initial animations.
      if (prefersReducedMotion || hasLowMemory || hasLowCPU || saveData || (isMobile && (hasLowMemory || hasLowCPU))) {
        setIsLowTier(true);
        // Set cookie so future page loads/refreshes instantly skip animations without hydration flicker
        document.cookie = "hasSeenScrollAnimations=true; path=/";
      }
    } catch (e) {
      // Gracefully handle any browser API errors
    }
  }, []);

  return { isLowTier };
}
