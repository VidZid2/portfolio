"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { MotionConfig } from "framer-motion";

type HardwareContextType = {
  isLowEndDevice: boolean;
};

const HardwareContext = createContext<HardwareContextType>({ isLowEndDevice: false });

/** Chromium-only hardware hints absent from the standard DOM types. */
interface ExtendedNavigator extends Navigator {
  deviceMemory?: number;
  getBattery?: () => Promise<{ charging: boolean; level: number }>;
}

export function useHardware() {
  return useContext(HardwareContext);
}

export function HardwareProvider({ children }: { children: ReactNode }) {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    let lowEnd = false;
    const nav = navigator as ExtendedNavigator;

    // 1. Check Device Memory (RAM) -> primarily Chromium browsers
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) {
      lowEnd = true;
    }

    // 2. Check CPU Cores
    if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency < 4) {
      lowEnd = true;
    }

    // 3. Check Battery API (Chromium mostly) to guess power-saving mode
    if (typeof nav.getBattery === "function") {
      // If unplugged and battery is very low, browsers often throttle CPU
      nav
        .getBattery()
        .then((battery) => {
          if (!battery.charging && battery.level <= 0.2) {
            setIsLowEndDevice(true);
          }
        })
        .catch(() => {});
    }

    // To test the fallback state manually, uncomment this line:
    // lowEnd = true;

    const frame = requestAnimationFrame(() => setIsLowEndDevice(lowEnd));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Before hydration finishes, we don't know the hardware, 
  // but rendering normal motion config is safer for hydration matching.
  return (
    <HardwareContext.Provider value={{ isLowEndDevice }}>
      <MotionConfig reducedMotion={isLowEndDevice ? "always" : "user"}>
        {children}
      </MotionConfig>
    </HardwareContext.Provider>
  );
}
