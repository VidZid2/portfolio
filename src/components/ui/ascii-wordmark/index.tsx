"use client";

import React, { useEffect, useRef } from "react";
import { AsciiWordmarkRenderer, AsciiWordmarkOptions } from "./renderer";

interface AsciiWordmarkProps extends AsciiWordmarkOptions {
  className?: string;
}

export function AsciiWordmark({ word, inkColor, className }: AsciiWordmarkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const renderer = new AsciiWordmarkRenderer(containerRef.current, { word, inkColor });
    const success = renderer.mount();
    
    if (success) {
      renderer.start();
    }
    
    return () => {
      renderer.dispose();
    };
  }, [word, inkColor]);

  return <div ref={containerRef} className={className} />;
}
