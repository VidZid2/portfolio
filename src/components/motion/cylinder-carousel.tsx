"use client";
// beui.dev/components/motion/cylinder-carousel

import {
  AnimatePresence,
  animate,
  type AnimationPlaybackControls,
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  Children,
  isValidElement,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  type WheelEvent as ReactWheelEvent,
} from "react";
import {
  capturePointer,
  releasePointer,
  TOUCH_GESTURE_CLASS,
} from "@/lib/touch";
import { cn } from "@/lib/utils";

// Carousel-specific: a soft spring that receives the release velocity, so a
// flick keeps rolling freely, drifts past the snap point and eases back.
const GLIDE_SPRING = { stiffness: 40, damping: 20, mass: 3 };

// How far a flick keeps rolling: projected items = release velocity * momentum.
const FLICK_MOMENTUM = 0.45;
const MAX_FLICK_ITEMS = 6;

export interface CylinderCarouselProps {
  children: ReactNode;
  /** Max item box size in px (square) at full size, i.e. at the container
   * edge. Balls shrink below this automatically so the row keeps breathing
   * room in narrow containers. */
  itemSize?: number;
  /** How many item slots span the container width. */
  visibleItems?: number;
  /** "concave" (default): inside of the cylinder — center ball smallest and
   * dipped, growing toward the edges. "convex": outside of the cylinder —
   * center ball biggest and raised, shrinking toward the edges. */
  variant?: "concave" | "convex";
  /** Scale of the smallest ball (center for concave, edges for convex);
   * the biggest reaches 1. */
  minScale?: number;
  /** Items rolled per item-width dragged — above 1 the wall outruns the
   * pointer, which reads as a lighter, freer roll. */
  dragSpeed?: number;
  /** Curve depth in px: for concave, how far the edge balls ride above the
   * center one (valley); for convex, how far below (arch). 0 = flat line.
   * Defaults to 35% of the item size. */
  arc?: number;
  /** Snap to the nearest item when the roll settles. */
  snap?: boolean;
  /** Roll on its own until interacted with. */
  autoRotate?: boolean;
  /** Auto-roll speed in items per second. */
  autoRotateSpeed?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  selectedIndex?: number | null;
  selectedOffset?: number;
  /** Stage height in px. Defaults to `itemSize`. */
  height?: number;
  className?: string;
}

// The frame edge sits at this wall angle; how far the wall curves in frame.
const THETA_EDGE = (72 * Math.PI) / 180;
// Wall angle past which a ball is parked far off-stage (always hidden there).
const THETA_CLAMP = (95 * Math.PI) / 180;

/**
 * One ball on the inside wall of the cylinder, rendered through a single
 * perspective projection: the ball sits at wall angle θ, the camera slightly
 * above the ball line, so horizontal position, size and height all share one
 * 1/(cosθ + k) depth term. Center = far wall: smallest, highest, moving
 * slowest; edges = nearest: full size, level, moving fastest, sliding off to
 * be clipped. Nothing overlaps, fades or reorders — the edge is the exit.
 */
function CarouselBall({
  scroll,
  index,
  count,
  alpha,
  k,
  projection,
  gap,
  edgeOffset,
  minScale,
  convex,
  arc,
  halfWidth,
  itemSize,
  selectedIndex,
  returningIndex,
  selectedOffset = -140,
  children,
}: {
  scroll: MotionValue<number>;
  index: number;
  count: number;
  /** Wall angle per item step, in radians. */
  alpha: number;
  /** Camera distance term for the horizontal projection. */
  k: number;
  /** Projection strength: maps sinθ/(cosθ+k) to px so θE lands on the edge. */
  projection: number;
  /** Uniform slot width in px — convex spacing. */
  gap: number;
  /** Offset at which a ball's center sits on the container edge. */
  edgeOffset: number;
  minScale: number;
  convex: boolean;
  /** Curve depth in px between the center ball and the edge balls. */
  arc: number;
  halfWidth: number;
  itemSize: number;
  selectedIndex?: number | null;
  returningIndex?: number | null;
  selectedOffset?: number;
  children: ReactNode;
}) {
  // Nearest wrapped offset so items loop around continuously.
  const offset = useTransform(scroll, (s) => {
    let o = index - s;
    o -= Math.round(o / count) * count;
    return o;
  });
  // Concave spacing follows the interior perspective (slow, tight center);
  // convex pairs its big center balls with uniform spacing — the interior
  // projection would collapse them into each other.
  const x = useTransform(offset, (o) => {
    if (convex) return o * gap;
    const th = Math.max(-THETA_CLAMP, Math.min(THETA_CLAMP, o * alpha));
    return (projection * Math.sin(th)) / (Math.cos(th) + k);
  });
  // Linear in wall angle, not in depth (the depth curve is near-flat around
  // the center, which made the middle three read as equal): every step is
  // visibly bigger than the last — growing outward (concave) or inward
  // (convex).
  const scale = useTransform(offset, (o) => {
    const t = Math.min(Math.abs(o) / edgeOffset, THETA_CLAMP / THETA_EDGE);
    return convex
      ? 1 - (1 - minScale) * t
      : minScale + (1 - minScale) * t;
  });
  // Parabola centered on the stage — valley for concave (center ball dips
  // arc/2 below the midline, edges rise arc/2 above), arch for convex — and
  // deliberately unclamped: a ball keeps following the same curve as it
  // crosses the edge, so entries never pop.
  const y = useTransform(x, (px) => {
    const t = px / halfWidth;
    const valley = arc * (0.5 - t * t);
    return convex ? -valley : valley;
  });
  // Fully off-stage balls stop painting (matters for canvas/shader children).
  const visibility = useTransform(x, (px) =>
    Math.abs(px) > halfWidth + itemSize ? "hidden" : "visible",
  );
  // Ensure the larger (front/center) balls are always stacked on top for clicking
  const zIndex = useTransform(scale, (s) => Math.round(s * 100));

  const isSelected =
    selectedIndex !== null &&
    selectedIndex !== undefined &&
    selectedIndex === index;
  const isReturning =
    returningIndex !== null &&
    returningIndex !== undefined &&
    returningIndex === index;
  const isAnyActive =
    (selectedIndex !== null && selectedIndex !== undefined) ||
    (returningIndex !== null && returningIndex !== undefined);
  const isOther = isAnyActive && !isSelected && !isReturning;

  // Natural edge fade so items dissolve seamlessly as they roll towards both ends
  const edgeOpacity = useTransform(x, (px) => {
    const dist = Math.abs(px);
    const fadeStart = halfWidth - itemSize * 0.75;
    const fadeEnd = halfWidth + itemSize * 0.2;
    if (dist <= fadeStart) return 1;
    if (dist >= fadeEnd) return 0;
    return Math.max(0, 1 - (dist - fadeStart) / (fadeEnd - fadeStart));
  });

  // When selected or returning, the active ball stays 100% visible while others wait to blur-in
  const finalOpacity = isOther ? 0 : isSelected || isReturning ? 1 : edgeOpacity;

  return (
    <motion.div
      className={cn(
        "absolute top-1/2 left-1/2",
        isAnyActive
          ? "transition-[opacity,filter] duration-300 ease-out"
          : "transition-[opacity,filter] duration-500 ease-out",
      )}
      style={{
        x,
        y,
        scale: isSelected ? 1 : scale,
        zIndex: isSelected || isReturning ? 80 : zIndex,
        visibility,
        width: itemSize,
        height: itemSize,
        marginLeft: -itemSize / 2,
        marginTop: -itemSize / 2,
        opacity: finalOpacity,
        filter: isOther ? "blur(8px)" : "blur(0px)",
        pointerEvents: isOther ? "none" : "auto",
      }}
    >
      <motion.div
        className="w-full h-full"
        animate={{
          x: isSelected ? (selectedOffset ?? -180) : 0,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function CylinderCarousel({
  children,
  itemSize = 260,
  visibleItems = 5,
  variant = "concave",
  minScale = 0.6,
  dragSpeed = 1.5,
  arc: arcProp,
  snap = true,
  autoRotate = false,
  autoRotateSpeed = 0.4,
  defaultIndex = 0,
  onIndexChange,
  selectedIndex,
  selectedOffset = -140,
  height,
  className,
}: CylinderCarouselProps) {
  const reduce = useReducedMotion() ?? false;
  const items = Children.toArray(children);
  const count = items.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Sized so `visibleItems` balls sit fully in frame and the next one out on
  // each side straddles the container edge, half visible.
  const stageWidth = width || 800;
  const halfWidth = stageWidth / 2;
  const edgeOffset = (visibleItems + 1) / 2;

  // Fit: the resting row's diameters may take at most ~66% of the stage — the
  // rest is air between balls plus the half-visible ball on each edge.
  // `itemSize` only caps the result.
  const convex = variant === "convex";
  let scaleSum = 0;
  for (let i = 0; i < visibleItems; i++) {
    const t = Math.abs(i - (visibleItems - 1) / 2) / edgeOffset;
    scaleSum += convex
      ? 1 - (1 - minScale) * t
      : minScale + (1 - minScale) * t;
  }
  const size = Math.min(itemSize, (stageWidth * 0.7) / scaleSum);

  const gap = stageWidth / (visibleItems + 1);
  const arc = arcProp ?? size * 0.25;

  // Perspective constants. The ball one slot past the frame edge sits at wall
  // angle THETA_EDGE with its center right on the container edge — scale 1,
  // half of it in view; k falls out of the requested minScale (clamped so the
  // projection stays monotonic up to THETA_CLAMP).
  const alpha = THETA_EDGE / edgeOffset;
  const k = Math.max(0.2, (minScale - Math.cos(THETA_EDGE)) / (1 - minScale));
  const projection =
    (halfWidth * (Math.cos(THETA_EDGE) + k)) / Math.sin(THETA_EDGE);

  // scroll is in item units (continuous); item i sits at x = (i - scroll) * gap.
  // Drags write it 1:1 so the wall sticks to the pointer; releases hand the
  // pointer velocity to a soft spring so the roll glides on and settles free.
  const scroll = useMotionValue(defaultIndex);
  const indexRef = useRef(defaultIndex);
  const [, setActiveIndex] = useState(defaultIndex);
  const glideRef = useRef<AnimationPlaybackControls | null>(null);
  const draggingRef = useRef(false);
  const hoverRef = useRef(false);

  useEffect(() => {
    if (count === 0) return;
    const unsub = scroll.on("change", (v) => {
      const idx = ((Math.round(v) % count) + count) % count;
      if (idx !== indexRef.current) {
        indexRef.current = idx;
        setActiveIndex(idx);
        onIndexChange?.(idx);
      }
    });
    return unsub;
  }, [scroll, count, onIndexChange]);

  const stopGlide = useCallback(() => {
    glideRef.current?.stop();
    glideRef.current = null;
  }, []);

  // Spring toward `to`, carrying `velocity` (items/s) through so motion never
  // steps — the roll leaves the finger at finger speed.
  const glideTo = useCallback(
    (to: number, velocity: number) => {
      stopGlide();
      if (reduce) {
        scroll.set(to);
        return;
      }
      glideRef.current = animate(scroll, to, {
        type: "spring",
        ...GLIDE_SPRING,
        velocity,
        restDelta: 0.001,
        restSpeed: 0.005,
      });
    },
    [scroll, stopGlide, reduce],
  );

  const settle = useCallback(
    (velocity: number) => {
      const projected =
        scroll.get() +
        Math.max(
          -MAX_FLICK_ITEMS,
          Math.min(MAX_FLICK_ITEMS, velocity * FLICK_MOMENTUM),
        );
      glideTo(snap ? Math.round(projected) : projected, velocity);
    },
    [scroll, snap, glideTo],
  );

  const [prevSelected, setPrevSelected] = useState<number | null | undefined>(
    selectedIndex,
  );
  const [returningIndex, setReturningIndex] = useState<number | null>(null);

  // Synchronous render-phase state adjustment: eliminates 1-frame flash before paint
  if (selectedIndex !== prevSelected) {
    setPrevSelected(selectedIndex);
    if (
      prevSelected !== null &&
      prevSelected !== undefined &&
      (selectedIndex === null || selectedIndex === undefined)
    ) {
      setReturningIndex(prevSelected);
    }
  }

  useEffect(() => {
    if (returningIndex !== null) {
      const timer = setTimeout(() => {
        setReturningIndex(null);
      }, 420);
      return () => clearTimeout(timer);
    }
  }, [returningIndex]);

  const [activeSelectedIndex, setActiveSelectedIndex] = useState<number | null>(
    selectedIndex ?? null,
  );

  useEffect(() => {
    if (selectedIndex === null || selectedIndex === undefined || count === 0) {
      setActiveSelectedIndex(null);
      return;
    }

    stopGlide();
    const current = scroll.get();
    let diff = ((selectedIndex - current) % count + count) % count;
    if (diff > count / 2) diff -= count;

    if (Math.abs(diff) < 0.15) {
      // Already centered: instantly align and trigger the slide
      scroll.set(current + diff);
      setActiveSelectedIndex(selectedIndex);
    } else {
      // Far away: smoothly roll the carousel so the item lands front-and-center, then trigger the left slide
      setActiveSelectedIndex(null);
      const anim = animate(scroll, current + diff, {
        type: "spring",
        stiffness: 380,
        damping: 30,
        onComplete: () => {
          setActiveSelectedIndex(selectedIndex);
        },
      });
      const timer = setTimeout(() => {
        setActiveSelectedIndex(selectedIndex);
      }, 260);
      return () => {
        anim.stop();
        clearTimeout(timer);
      };
    }
  }, [selectedIndex, count, scroll, stopGlide]);

  const prevCountRef = useRef(count);
  useEffect(() => {
    if (prevCountRef.current !== count) {
      prevCountRef.current = count;
      stopGlide();
      scroll.set(0);
    }
  }, [count, scroll, stopGlide]);

  const drag = useRef({
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastT: 0,
    prevX: 0,
    prevT: 0,
  });

  const hasMovedRef = useRef(false);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (selectedIndex !== null && selectedIndex !== undefined) return;
      stopGlide();
      draggingRef.current = true;
      hasMovedRef.current = false;
      const now = performance.now();
      drag.current = {
        startX: e.clientX,
        startScroll: scroll.get(),
        lastX: e.clientX,
        lastT: now,
        prevX: e.clientX,
        prevT: now,
      };
    },
    [scroll, stopGlide, selectedIndex],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (selectedIndex !== null && selectedIndex !== undefined) return;
      if (!draggingRef.current) return;
      const d = drag.current;
      const dist = Math.abs(e.clientX - d.startX);
      if (dist > 4) {
        if (!hasMovedRef.current) {
          hasMovedRef.current = true;
          capturePointer(e.currentTarget, e.pointerId);
        }
        scroll.set(d.startScroll - ((e.clientX - d.startX) * dragSpeed) / gap);
        d.prevX = d.lastX;
        d.prevT = d.lastT;
        d.lastX = e.clientX;
        d.lastT = performance.now();
      }
    },
    [scroll, gap, dragSpeed],
  );

  const onPointerUp = useCallback(
    (e: ReactPointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      if (hasMovedRef.current) {
        releasePointer(e.currentTarget, e.pointerId);
        const d = drag.current;
        const dt = d.lastT - d.prevT;
        const vpx = dt > 0 ? (d.lastX - d.prevX) / dt : 0; // px per ms
        settle((-vpx * dragSpeed * 1000) / gap); // items per second
      }
    },
    [settle, gap, dragSpeed],
  );

  const rollBy = useCallback(
    (dir: number) => {
      glideTo(Math.round(scroll.get()) + dir, scroll.getVelocity());
    },
    [scroll, glideTo],
  );

  const wheelTargetRef = useRef(0);
  const wheelAnimRef = useRef<AnimationPlaybackControls | null>(null);
  const wheelSettleRef = useRef<number | undefined>(undefined);

  const onWheel = useCallback(
    (e: ReactWheelEvent) => {
      if (selectedIndex !== null && selectedIndex !== undefined) return;
      stopGlide();
      if (wheelAnimRef.current) {
        wheelAnimRef.current.stop();
      }

      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const multiplier = e.deltaMode === 1 ? 24 : e.deltaMode === 2 ? 180 : 1;
      const normalizedDelta = (delta * multiplier) / (gap * 2.2);

      const current = scroll.get();
      if (Math.abs(wheelTargetRef.current - current) > 4) {
        wheelTargetRef.current = current;
      }
      wheelTargetRef.current += normalizedDelta;

      wheelAnimRef.current = animate(scroll, wheelTargetRef.current, {
        type: "spring",
        stiffness: 280,
        damping: 28,
        mass: 0.35,
        velocity: scroll.getVelocity(),
      });

      if (wheelSettleRef.current) window.clearTimeout(wheelSettleRef.current);
      wheelSettleRef.current = window.setTimeout(() => {
        if (snap) {
          glideTo(Math.round(scroll.get()), scroll.getVelocity());
        }
      }, 160);
    },
    [scroll, gap, snap, glideTo, stopGlide, selectedIndex],
  );

  useEffect(() => {
    if (!autoRotate || reduce || count === 0 || returningIndex !== null) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!draggingRef.current && !hoverRef.current && !glideRef.current) {
        scroll.set(scroll.get() + autoRotateSpeed * dt);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotate, autoRotateSpeed, reduce, count, scroll, returningIndex]);

  const stageHeight = height ?? Math.max(size * 1.3, 340);

  return (
    <div
      ref={stageRef}
      role="application"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          rollBy(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          rollBy(-1);
        }
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
      className={cn(
        "relative w-full touch-none outline-none",
        TOUCH_GESTURE_CLASS,
        selectedIndex !== null && selectedIndex !== undefined
          ? "cursor-default pointer-events-none"
          : "cursor-grab active:cursor-grabbing",
        className,
      )}
      style={{ height: stageHeight }}
    >
      {items.map((item, i) => (
        <CarouselBall
          key={i}
          scroll={scroll}
          index={i}
          count={count}
          alpha={alpha}
          k={k}
          projection={projection}
          gap={gap}
          edgeOffset={edgeOffset}
          minScale={minScale}
          convex={convex}
          arc={arc}
          halfWidth={halfWidth}
          itemSize={size}
          selectedIndex={activeSelectedIndex}
          returningIndex={returningIndex}
          selectedOffset={selectedOffset}
        >
          {item}
        </CarouselBall>
      ))}
    </div>
  );
}
