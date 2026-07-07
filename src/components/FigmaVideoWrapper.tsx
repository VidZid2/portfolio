"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";
import { FigmaFrame, type FrameStyle } from "@/components/vector-editor/FigmaFrame";

const LIGHT_FRAME: FrameStyle = {
  accent: "#6495ed", // Standard Cornflower Blue
  handleSize: 8,
  handleFill: "#ffffff",
  borderWidth: 1,
  showHandles: true,
  showBadge: false,
  badgeBg: "#6495ed",
  badgeText: "#ffffff",
};

const DARK_FRAME: FrameStyle = {
  accent: "#547ec9", // Darker/muted Cornflower Blue
  handleSize: 8,
  handleFill: "#18181b", // Matches zinc-900 background
  borderWidth: 1,
  showHandles: true,
  showBadge: false,
  badgeBg: "#547ec9",
  badgeText: "#ffffff",
};

export function FigmaVideoWrapper({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const frame = mounted && resolvedTheme === "light" ? LIGHT_FRAME : DARK_FRAME;

  return (
    <FigmaFrame style={frame} className="w-full">
      {children}
    </FigmaFrame>
  );
}
