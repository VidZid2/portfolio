"use client";

import { type MotionValue, motion } from "motion/react";
import { type RefObject, useId, useLayoutEffect, useState } from "react";

// Hover-highlight overlay: re-strokes the base path `d`, clipped to a vertical
// band whose x/width spring to track the hovered point, so only the segment
// around the dot shows brighter. The band comes from `useHighlightSegment`;
// because the bright stroke reuses the base `d`, it follows whatever curve is
// drawn (see `highlight-segment-bounds.ts` for the band-extent caveat).

export interface HighlightSegmentProps {
  /** Ref to the rendered base stroke `<path>` — its `d` is re-used verbatim. */
  pathRef: RefObject<SVGPathElement | null>;
  /** Whether to render (caller gates on showHighlight + active + loaded). */
  visible: boolean;
  stroke: string;
  strokeWidth: number;
  /** Plot height — the clip band spans it fully. */
  height: number;
  /** Spring-eased left edge of the clip band (px). */
  x: MotionValue<number>;
  /** Spring-eased width of the clip band (px). */
  width: MotionValue<number>;
}

export function HighlightSegment({
  pathRef,
  visible,
  stroke,
  strokeWidth,
  height,
  x,
  width,
}: HighlightSegmentProps) {
  const clipId = useId();
  // Mirror the source path's `d` through state so render never touches refs.
  // The base path's `d` keeps changing after mount (reveal animation, y-domain
  // settle, resizes) AND the Line swaps between two different <path> elements
  // when the chart phase flips to "ready" — a mount-time snapshot of either
  // draws the highlight band at the wrong y, visibly detached from the line.
  // Observe the path's parent subtree: attribute mutations re-read the current
  // `d`, and childList swaps re-bind to whatever element `pathRef` holds now.
  const [d, setD] = useState<string | null>(null);
  useLayoutEffect(() => {
    const OBSERVE_OPTIONS = {
      attributeFilter: ["d"],
      attributes: true,
      childList: true,
      subtree: true,
    };
    let observed: Element | null = pathRef.current?.parentElement ?? null;
    const update = () => {
      const next = pathRef.current?.getAttribute("d") ?? null;
      setD((previous) => (previous === next ? previous : next));
    };
    const observer = new MutationObserver(() => {
      const current = pathRef.current;
      if (current && current.parentElement && current.parentElement !== observed) {
        observer.disconnect();
        observed = current.parentElement;
        observer.observe(observed, OBSERVE_OPTIONS);
      }
      update();
    });
    update();
    if (observed) {
      observer.observe(observed, OBSERVE_OPTIONS);
    }
    return () => observer.disconnect();
  }, [pathRef]);
  if (!(visible && d)) {
    return null;
  }
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <motion.rect height={height} width={width} x={x} y={0} />
        </clipPath>
      </defs>
      <motion.path
        animate={{ opacity: 1 }}
        clipPath={`url(#${clipId})`}
        d={d}
        exit={{ opacity: 0 }}
        fill="none"
        initial={{ opacity: 0 }}
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </>
  );
}

HighlightSegment.displayName = "HighlightSegment";

export default HighlightSegment;
