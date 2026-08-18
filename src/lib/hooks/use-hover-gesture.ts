import { useRef, useCallback } from "react";

export interface HoverGesture {
  enter: (event: React.PointerEvent) => boolean;
  leave: (event: React.PointerEvent) => boolean;
}

export function useHoverGesture(): HoverGesture {
  const isHoveredRef = useRef(false);

  const enter = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === "touch") return false;
    isHoveredRef.current = true;
    return true;
  }, []);

  const leave = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === "touch") return false;
    isHoveredRef.current = false;
    return true;
  }, []);

  return { enter, leave };
}
