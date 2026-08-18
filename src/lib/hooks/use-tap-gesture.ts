import { useRef, useCallback } from "react";

export function useTapGesture<T>() {
  const gestureRef = useRef<{
    pointerType: string;
    state: T;
  } | null>(null);

  const start = useCallback((event: React.PointerEvent, state: T) => {
    gestureRef.current = {
      pointerType: event.pointerType,
      state,
    };
  }, []);

  const take = useCallback(() => {
    const gesture = gestureRef.current;
    gestureRef.current = null;
    return gesture;
  }, []);

  const drop = useCallback(() => {
    gestureRef.current = null;
  }, []);

  return { start, take, drop };
}
