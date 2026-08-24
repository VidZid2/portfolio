"use client";

import React, { useEffect, useRef } from "react";
import type { AsciiWordmarkOptions } from "./renderer";

type AsciiWordmarkRendererType = import("./renderer").AsciiWordmarkRenderer;

interface AsciiWordmarkProps extends AsciiWordmarkOptions {
  className?: string;
}

export function AsciiWordmark({ word, inkColor, className }: AsciiWordmarkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<AsciiWordmarkRendererType | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let renderer: AsciiWordmarkRendererType | null = null;

    // three.js is ~1.4 MB — load the WebGL renderer only after mount so it
    // never lands in the route's initial bundle.
    void import("./renderer").then(({ AsciiWordmarkRenderer }) => {
      if (cancelled || !containerRef.current) return;

      // Only instantiate once per word change.
      renderer = new AsciiWordmarkRenderer(containerRef.current, { word, inkColor });
      const success = renderer.mount();

      if (success) {
        renderer.start();
        rendererRef.current = renderer;
      }
    });

    return () => {
      cancelled = true;
      renderer?.dispose();
      rendererRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]); // Remove inkColor from dependency array so it doesn't trigger a remount

  useEffect(() => {
    if (rendererRef.current && inkColor) {
      rendererRef.current.updateInkColor(inkColor);
    }
  }, [inkColor]);

  return <div ref={containerRef} className={className} />;
}
