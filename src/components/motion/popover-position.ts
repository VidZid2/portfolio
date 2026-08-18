import { useState, useLayoutEffect, useEffect, type RefObject } from "react";

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

interface Dimensions {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface PopoverPortalPosition {
  trigger: Dimensions;
  content: Dimensions;
}

export function usePopoverPortalPosition(
  triggerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  open?: boolean
): PopoverPortalPosition | null {
  const [position, setPosition] = useState<PopoverPortalPosition | null>(null);

  useIsoLayoutEffect(() => {
    if (!enabled) return;

    let rafId: number | null = null;
    let isRunning = true;

    const update = () => {
      const trigger = triggerRef.current;
      const content = contentRef.current;
      if (!trigger) return false;

      const tRect = trigger.getBoundingClientRect();
      const cRect = content?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };

      setPosition((prev) => {
        if (
          prev &&
          Math.abs(prev.trigger.left - tRect.left) < 0.5 &&
          Math.abs(prev.trigger.top - tRect.top) < 0.5 &&
          Math.abs(prev.trigger.width - tRect.width) < 0.5 &&
          Math.abs(prev.trigger.height - tRect.height) < 0.5 &&
          Math.abs(prev.content.width - cRect.width) < 0.5 &&
          Math.abs(prev.content.height - cRect.height) < 0.5
        ) {
          return prev;
        }

        return {
          trigger: {
            width: tRect.width,
            height: tRect.height,
            left: tRect.left,
            top: tRect.top,
          },
          content: {
            width: cRect.width,
            height: cRect.height,
            left: cRect.left,
            top: cRect.top,
          },
        };
      });

      return true;
    };

    // Immediate initial sync
    update();

    // Loop during active open state to follow animations/scrolls smoothly
    const loop = () => {
      if (!isRunning) return;
      update();
      if (open) {
        rafId = requestAnimationFrame(loop);
      }
    };

    if (open) {
      rafId = requestAnimationFrame(loop);
    }

    const handleEvent = () => {
      update();
    };

    window.addEventListener("resize", handleEvent, { passive: true });
    window.addEventListener("scroll", handleEvent, { passive: true, capture: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        update();
      });
      if (triggerRef.current) resizeObserver.observe(triggerRef.current);
      if (contentRef.current) resizeObserver.observe(contentRef.current);
      if (document.body) resizeObserver.observe(document.body);
    }

    return () => {
      isRunning = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleEvent);
      window.removeEventListener("scroll", handleEvent, true);
      resizeObserver?.disconnect();
    };
  }, [triggerRef, contentRef, enabled, open]);

  return position;
}
