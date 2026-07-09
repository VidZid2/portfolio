"use client";

import React, { useEffect, useRef } from "react";
import { AsciiWordmarkRenderer, AsciiWordmarkOptions } from "./renderer";

interface AsciiWordmarkProps extends AsciiWordmarkOptions {
  className?: string;
}

export function AsciiWordmark({ word, inkColor, className }: AsciiWordmarkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<AsciiWordmarkRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Only instantiate once per word change.
    const renderer = new AsciiWordmarkRenderer(containerRef.current, { word, inkColor });
    const success = renderer.mount();
    
    if (success) {
      renderer.start();
      rendererRef.current = renderer;
    }
    
    return () => {
      renderer.dispose();
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
