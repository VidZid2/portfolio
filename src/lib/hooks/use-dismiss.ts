import { useEffect, type RefObject } from "react";

export function useDismiss(
  open: boolean,
  onDismiss: () => void,
  ref: RefObject<HTMLElement | null>,
  options?: { ignore?: (target: Element) => boolean }
) {
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const path = typeof event.composedPath === "function" ? event.composedPath() : [];
      const target = (path[0] || event.target) as Element;
      if (!target) return;
      if (ref.current && (ref.current.contains(target) || path.includes(ref.current))) return;
      for (const el of path) {
        if (el instanceof Element && options?.ignore?.(el)) return;
      }
      if (target instanceof Element && options?.ignore?.(target)) return;
      onDismiss();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onDismiss, ref, options]);
}
