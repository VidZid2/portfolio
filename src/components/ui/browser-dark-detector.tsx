"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Moon } from "lucide-react";

export function BrowserDarkDetector() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check once per session if dismissed
    const isDismissed = sessionStorage.getItem("browser-forced-dark-dismissed");
    if (isDismissed) return;

    const isLightMode = resolvedTheme === "light" || theme === "light";
    if (!isLightMode) return;

    // Check if the device / browser has forced dark mode or mismatch
    const checkForcedDark = () => {
      // 1. Create off-screen canvas or element test
      const testEl = document.createElement("div");
      testEl.style.cssText = "position:absolute;top:-9999px;left:-9999px;width:10px;height:10px;background-color:#ffffff;color:#000000;pointer-events:none;opacity:0;";
      document.body.appendChild(testEl);

      const computedBg = window.getComputedStyle(testEl).backgroundColor;
      document.body.removeChild(testEl);

      // Check if pure white is algorithmically inverted by Edge/Chrome
      const isRgbInverted = computedBg.includes("rgb(0,") || computedBg.includes("rgb(24,") || computedBg.includes("rgb(32,");
      const prefersDarkOnLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

      // If browser forced dark is detected on mobile in light mode
      if ((isRgbInverted || (isMobile && prefersDarkOnLight)) && !checkedRef.current) {
        checkedRef.current = true;

        // Show a non-intrusive notification after a brief delay
        setTimeout(() => {
          toast("Browser Force Dark Active", {
            description: "Your browser's 'Dark theme for all web pages' is active and may invert light mode colors. Switch to Dark Mode for the optimal experience.",
            duration: 9000,
            icon: <Moon className="w-4 h-4 text-[#6495ED]" />,
            action: {
              label: "Switch to Dark",
              onClick: () => {
                setTheme("dark");
                sessionStorage.setItem("browser-forced-dark-dismissed", "true");
              },
            },
            onDismiss: () => {
              sessionStorage.setItem("browser-forced-dark-dismissed", "true");
            },
          });
        }, 1200);
      }
    };

    checkForcedDark();
  }, [theme, resolvedTheme, setTheme]);

  return null;
}
