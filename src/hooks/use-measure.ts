"use client";
import { useState, useLayoutEffect } from "react";

export function useMeasure() {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [bounds, setBounds] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref) return;
    const observer = new ResizeObserver(([entry]) => {
      setBounds(entry.target.getBoundingClientRect());
    });
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return [setRef, bounds] as const;
}
