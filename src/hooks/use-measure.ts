"use client";
import { useState, useLayoutEffect } from "react";

export function useMeasure() {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [bounds, setBounds] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref) return;
    const observer = new ResizeObserver(([entry]) => {
      const el = entry.target as HTMLElement;
      const rect = el.getBoundingClientRect();
      const height = Math.ceil(el.offsetHeight || el.scrollHeight || entry.contentRect.height || rect.height);
      const width = Math.ceil(el.offsetWidth || el.scrollWidth || entry.contentRect.width || rect.width);
      setBounds({ left: rect.left, top: rect.top, width, height });
    });
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return [setRef, bounds] as const;
}
