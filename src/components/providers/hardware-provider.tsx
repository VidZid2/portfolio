"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { MotionConfig } from "framer-motion";

type HardwareContextType = {
  isLowEndDevice: boolean;
};

const HardwareContext = createContext<HardwareContextType>({ isLowEndDevice: false });

export function useHardware() {
  return useContext(HardwareContext);
}

export function HardwareProvider({ children }: { children: ReactNode }) {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let lowEnd = false;

    // 1. Check Device Memory (RAM) -> primarily Chromium browsers
    if (
      "deviceMemory" in navigator &&
      typeof (navigator as any).deviceMemory === "number"
    ) {
      if ((navigator as any).deviceMemory < 4) {
        lowEnd = true;
      }
    }

    // 2. Check CPU Cores
    if (
      "hardwareConcurrency" in navigator &&
      typeof navigator.hardwareConcurrency === "number"
    ) {
      if (navigator.hardwareConcurrency < 4) {
        lowEnd = true;
      }
    }

    // 3. Check Battery API (Chromium mostly) to guess power-saving mode
    if ("getBattery" in navigator && typeof (navigator as any).getBattery === "function") {
      (navigator as any).getBattery().then((battery: any) => {
        // If unplugged and battery is very low, browsers often throttle CPU
        if (!battery.charging && battery.level <= 0.2) {
          setIsLowEndDevice(true);
        }
      }).catch(() => {});
    }

    // To test the fallback state manually, uncomment this line:
    // lowEnd = true;

    setIsLowEndDevice(lowEnd);
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
