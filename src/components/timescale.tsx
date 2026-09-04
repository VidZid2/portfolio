"use client";

// Inspired by Evil Rabbit's Lifeline & Chánh Đại Timescale
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TimescaleItemContext = React.createContext<{
  delay: number;
  animated: boolean;
}>({
  delay: 0,
  animated: false,
});

const TimescaleContext = React.createContext<{
  canScrollLeft: boolean;
  canScrollRight: boolean;
  setCanScrollLeft: (v: boolean) => void;
  setCanScrollRight: (v: boolean) => void;
  dragOffsetY: number;
  setDragOffsetY: (v: number) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
}>({
  canScrollLeft: false,
  canScrollRight: true,
  setCanScrollLeft: () => {},
  setCanScrollRight: () => {},
  dragOffsetY: 0,
  setDragOffsetY: () => {},
  isDragging: false,
  setIsDragging: () => {},
});

export type TimescaleRootProps = React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
  showLeftFade?: boolean;
  showRightFade?: boolean;
};

export function TimescaleRoot({
  className,
  orientation = "horizontal",
  showLeftFade = false,
  showRightFade = true,
  children,
  ...props
}: TimescaleRootProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <TimescaleContext.Provider
      value={{
        canScrollLeft,
        canScrollRight,
        setCanScrollLeft,
        setCanScrollRight,
        dragOffsetY,
        setDragOffsetY,
        isDragging,
        setIsDragging,
      }}
    >
      <div
        data-slot="timescale-root"
        data-orientation={orientation}
        className={cn(
          "group/timescale relative flex w-full [--timescale-rail:3.5rem] overflow-hidden",
          "data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        {/* Left Fade Gradient - removed so left-to-right text is never obscured */}
        {showLeftFade && (
          <div
            className={cn(
              "pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-20 bg-gradient-to-r from-white dark:from-black via-white/80 dark:via-black/80 to-transparent transition-opacity duration-300",
              canScrollLeft ? "opacity-100" : "opacity-0"
            )}
          />
        )}
        {/* Right Fade Gradient & Dissolve Curtain */}
        {showRightFade && (
          <div
            className={cn(
              "pointer-events-none absolute right-0 top-0 bottom-0 z-20 transition-opacity duration-300",
              "w-28 sm:w-44 md:w-60 lg:w-72",
              "bg-gradient-to-l from-white via-white/95 via-white/40 to-transparent dark:from-black dark:via-black/95 dark:via-black/40 dark:to-transparent",
              canScrollRight ? "opacity-100" : "opacity-0"
            )}
          />
        )}
        {children}
      </div>
    </TimescaleContext.Provider>
  );
}

// High-precision cubic-bezier solver matching Framer Motion's [0.72, 0, 0.24, 1]
function solveCubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  function sampleCurveX(t: number) {
    return ((ax * t + bx) * t + cx) * t;
  }
  function sampleCurveY(t: number) {
    return ((ay * t + by) * t + cy) * t;
  }
  function sampleCurveDerivativeX(t: number) {
    return (3 * ax * t + 2 * bx) * t + cx;
  }

  return function (x: number) {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const currentX = sampleCurveX(t) - x;
      if (Math.abs(currentX) < 1e-4) break;
      const dX = sampleCurveDerivativeX(t);
      if (Math.abs(dX) < 1e-6) break;
      t -= currentX / dX;
    }
    return sampleCurveY(Math.max(0, Math.min(1, t)));
  };
}

const timelineEase = solveCubicBezier(0.72, 0, 0.24, 1);

export type TimescaleViewportProps = React.ComponentProps<"div"> & {
  autoFollow?: boolean;
  duration?: number;
};

export function TimescaleViewport({
  className,
  autoFollow = true,
  duration = 3.2,
  children,
  ...props
}: TimescaleViewportProps) {
  const { setCanScrollLeft, setCanScrollRight, canScrollRight, setDragOffsetY, setIsDragging } = React.useContext(TimescaleContext);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const exactScroll = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const animFrameId = useRef<number | null>(null);
  const cameraAnimId = useRef<number | null>(null);
  const userInterrupted = useRef(false);
  const hasMoved = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const updateScrollBounds = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, [setCanScrollLeft, setCanScrollRight]);

  const stopMomentum = () => {
    if (animFrameId.current !== null) {
      cancelAnimationFrame(animFrameId.current);
      animFrameId.current = null;
    }
  };

  const stopCameraFollow = useCallback(() => {
    if (cameraAnimId.current !== null) {
      cancelAnimationFrame(cameraAnimId.current);
      cameraAnimId.current = null;
    }
  }, []);

  const interruptCamera = () => {
    userInterrupted.current = true;
    stopCameraFollow();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    if (e.button !== 0) return; // Only primary mouse button

    interruptCamera();
    stopMomentum();
    isDown.current = true;
    hasMoved.current = false;
    startX.current = e.clientX;
    startScrollLeft.current = viewportRef.current.scrollLeft;
    exactScroll.current = viewportRef.current.scrollLeft;
    lastX.current = e.clientX;
    lastTime.current = performance.now();
    velocity.current = 0;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    setIsDraggingState(true);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current || !viewportRef.current) return;
    const currentX = e.clientX;
    const now = performance.now();
    const dt = now - lastTime.current;

    if (dt > 0) {
      const instantVel = (lastX.current - currentX) / dt;
      velocity.current = velocity.current * 0.6 + instantVel * 0.4;
      lastX.current = currentX;
      lastTime.current = now;
    }

    const deltaX = currentX - startX.current;
    if (Math.abs(deltaX) > 3) {
      hasMoved.current = true;
    }

    // Morph adaptive downward animation when dragging right to clear text headers
    if (deltaX > 0) {
      const adaptiveMorph = Math.min(14, Math.max(0, deltaX * 0.08));
      setDragOffsetY(adaptiveMorph);
    } else {
      setDragOffsetY(0);
    }

    exactScroll.current = startScrollLeft.current - deltaX;
    viewportRef.current.scrollLeft = exactScroll.current;
    updateScrollBounds();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current || !viewportRef.current) return;
    isDown.current = false;
    setIsDraggingState(false);
    setIsDragging(false);
    setDragOffsetY(0);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    if (Math.abs(velocity.current) > 0.03) {
      let vel = velocity.current * 16.6;
      const maxVel = 50;
      vel = Math.max(-maxVel, Math.min(maxVel, vel));
      let lastTick = performance.now();

      const glide = (time: number) => {
        if (!viewportRef.current) return;
        const deltaMs = Math.min(32, time - lastTick);
        lastTick = time;

        const decay = Math.pow(0.96, deltaMs / 16.6);
        vel *= decay;

        exactScroll.current += vel * (deltaMs / 16.6);
        viewportRef.current.scrollLeft = exactScroll.current;
        updateScrollBounds();

        if (Math.abs(vel) > 0.02) {
          animFrameId.current = requestAnimationFrame(glide);
        } else {
          animFrameId.current = null;
        }
      };

      animFrameId.current = requestAnimationFrame(glide);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasMoved.current) {
      e.stopPropagation();
      e.preventDefault();
      hasMoved.current = false;
    }
  };

  // Synchronized camera/viewport auto-follow as the line draws
  useEffect(() => {
    if (!autoFollow) return;
    const el = viewportRef.current;
    if (!el) return;

    userInterrupted.current = false;
    stopCameraFollow();
    el.scrollLeft = 0;
    exactScroll.current = 0;

    let startTimestamp: number | null = null;

    // Small raf delay to ensure layout measurements are settled
    const startFrame = requestAnimationFrame(() => {
      const step = (timestamp: number) => {
        if (userInterrupted.current || !viewportRef.current) return;
        if (startTimestamp === null) startTimestamp = timestamp;

        const elapsedSec = (timestamp - startTimestamp) / 1000;
        const u = Math.min(1, Math.max(0, elapsedSec / duration));
        const progress = timelineEase(u);

        const currentEl = viewportRef.current;
        const { scrollWidth, clientWidth } = currentEl;
        const maxScroll = Math.max(0, scrollWidth - clientWidth);

        if (maxScroll > 0) {
          const tipX = progress * scrollWidth;
          // Keep the drawing tip at ~55% of the visible viewport width
          const desiredScroll = tipX - clientWidth * 0.55;
          const clamped = Math.max(0, Math.min(maxScroll, desiredScroll));

          currentEl.scrollLeft = clamped;
          exactScroll.current = clamped;
          updateScrollBounds();
        }

        if (u < 1) {
          cameraAnimId.current = requestAnimationFrame(step);
        } else {
          cameraAnimId.current = null;
        }
      };

      cameraAnimId.current = requestAnimationFrame(step);
    });

    return () => {
      cancelAnimationFrame(startFrame);
      stopCameraFollow();
    };
  }, [autoFollow, duration, stopCameraFollow, updateScrollBounds]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    updateScrollBounds();
    el.addEventListener("scroll", updateScrollBounds, { passive: true });
    window.addEventListener("resize", updateScrollBounds);
    return () => {
      stopMomentum();
      stopCameraFollow();
      el.removeEventListener("scroll", updateScrollBounds);
      window.removeEventListener("resize", updateScrollBounds);
    };
  }, [updateScrollBounds, stopCameraFollow]);

  return (
    <div
      ref={viewportRef}
      data-slot="timescale-viewport"
      role="region"
      aria-label="Timeline — scrollable horizontally"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClickCapture={handleClickCapture}
      onWheel={interruptCamera}
      onTouchStart={interruptCamera}
      className={cn(
        "no-scrollbar w-full overflow-x-auto overscroll-x-contain select-none touch-pan-y",
        isDraggingState ? "cursor-grabbing" : "cursor-default",
        "group-data-[orientation=horizontal]/timescale:flex group-data-[orientation=horizontal]/timescale:flex-1 group-data-[orientation=horizontal]/timescale:pl-20 sm:group-data-[orientation=horizontal]/timescale:pl-24 group-data-[orientation=horizontal]/timescale:pr-12 sm:group-data-[orientation=horizontal]/timescale:pr-16",
        className
      )}
      style={{
        maskImage: canScrollRight
          ? "linear-gradient(to right, black 0%, black calc(100% - 160px), transparent 100%)"
          : "linear-gradient(to right, black 0%, black 100%)",
        WebkitMaskImage: canScrollRight
          ? "linear-gradient(to right, black 0%, black calc(100% - 160px), transparent 100%)"
          : "linear-gradient(to right, black 0%, black 100%)",
        transition: "mask-image 0.3s ease, -webkit-mask-image 0.3s ease",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export type TimescaleHeaderProps = React.ComponentProps<"div">;

export function TimescaleHeader({ className, ...props }: TimescaleHeaderProps) {
  return (
    <div
      data-slot="timescale-header"
      aria-hidden="true"
      className={cn(
        "z-20 select-none pointer-events-none",
        "group-data-[orientation=horizontal]/timescale:absolute group-data-[orientation=horizontal]/timescale:top-0 group-data-[orientation=horizontal]/timescale:left-0 group-data-[orientation=horizontal]/timescale:w-16 sm:group-data-[orientation=horizontal]/timescale:w-20 group-data-[orientation=horizontal]/timescale:shrink-0 group-data-[orientation=horizontal]/timescale:pr-2 group-data-[orientation=horizontal]/timescale:text-right",
        "group-data-[orientation=horizontal]/timescale:bg-gradient-to-r group-data-[orientation=horizontal]/timescale:from-white group-data-[orientation=horizontal]/timescale:via-white/95 group-data-[orientation=horizontal]/timescale:to-transparent dark:group-data-[orientation=horizontal]/timescale:from-black dark:group-data-[orientation=horizontal]/timescale:via-black/95 dark:group-data-[orientation=horizontal]/timescale:to-transparent group-data-[orientation=horizontal]/timescale:h-[var(--timescale-rail)]",
        "group-data-[orientation=vertical]/timescale:grid group-data-[orientation=vertical]/timescale:w-full group-data-[orientation=vertical]/timescale:grid-cols-[var(--timescale-rail)_1fr] group-data-[orientation=vertical]/timescale:gap-x-4 group-data-[orientation=vertical]/timescale:bg-white dark:group-data-[orientation=vertical]/timescale:bg-black",
        className
      )}
      {...props}
    />
  );
}

export type TimescaleTrackProps = React.ComponentProps<"div">;

export function TimescaleTrack({ className, style, ...props }: TimescaleTrackProps) {
  const { dragOffsetY, isDragging } = React.useContext(TimescaleContext);

  return (
    <div
      data-slot="timescale-track"
      className={cn(
        "relative flex will-change-transform",
        "group-data-[orientation=horizontal]/timescale:w-max group-data-[orientation=horizontal]/timescale:items-start pb-8",
        "group-data-[orientation=vertical]/timescale:w-full group-data-[orientation=vertical]/timescale:flex-col group-data-[orientation=vertical]/timescale:pt-4",
        className
      )}
      style={{
        transform: `translateY(${dragOffsetY}px)`,
        transition: isDragging ? "transform 0.08s ease-out" : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        ...style,
      }}
      {...props}
    />
  );
}

export type TimescaleRailProps = React.ComponentProps<"div"> & {
  animated?: boolean;
  duration?: number;
};

export function TimescaleRail({
  className,
  animated = true,
  duration = 3.2,
  ...props
}: TimescaleRailProps) {
  return (
    <div
      data-slot="timescale-rail"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute",
        "group-data-[orientation=horizontal]/timescale:inset-x-0 group-data-[orientation=horizontal]/timescale:top-[var(--timescale-rail)] group-data-[orientation=horizontal]/timescale:h-px",
        "group-data-[orientation=vertical]/timescale:inset-y-0 group-data-[orientation=vertical]/timescale:left-[var(--timescale-rail)] group-data-[orientation=vertical]/timescale:w-px group-data-[orientation=vertical]/timescale:border-l border-dashed border-black/20 dark:border-white/20",
        className
      )}
      {...props}
    >
      {/* Background ultra-faint guide track */}
      <div className="absolute inset-0 border-t border-dashed border-black/10 dark:border-white/10 group-data-[orientation=vertical]/timescale:hidden" />

      {/* Animated Drawing Line */}
      {animated ? (
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration,
            ease: [0.72, 0, 0.24, 1], // Smooth S-curve: very slow at first, accelerates through middle, decelerates smoothly as it nears the end
          }}
          className="absolute inset-0 border-t border-dashed border-black/40 dark:border-white/30 group-data-[orientation=vertical]/timescale:hidden overflow-visible"
        >
          {/* Luminous Leading Laser Head / Drawing Node */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0.85, 0],
              scale: [0.4, 1.4, 1.2, 1, 0],
            }}
            transition={{
              duration: duration + 0.15,
              times: [0, 0.05, 0.88, 0.97, 1],
              ease: [0.72, 0, 0.24, 1],
            }}
            className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-[#6495ED] shadow-[0_0_12px_#6495ED,0_0_4px_#ffffff] pointer-events-none"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 border-t border-dashed border-black/20 dark:border-white/20 group-data-[orientation=vertical]/timescale:hidden" />
      )}
    </div>
  );
}

export type TimescaleItemProps = React.ComponentProps<"div"> & {
  isActive?: boolean;
  delay?: number;
  animated?: boolean;
};

export function TimescaleItem({
  className,
  isActive = false,
  delay = 0,
  animated = true,
  children,
  ...props
}: TimescaleItemProps) {
  return (
    <TimescaleItemContext.Provider value={{ delay, animated }}>
      <div
        data-slot="timescale-item"
        data-active={isActive ? "true" : undefined}
        className={cn(
          "group/item relative transition-opacity duration-200",
          "opacity-60 hover:opacity-100 data-[active=true]:opacity-100",
          "group-data-[orientation=horizontal]/timescale:w-20 group-data-[orientation=horizontal]/timescale:shrink-0 group-data-[orientation=horizontal]/timescale:not-last:pr-4 group-data-[orientation=horizontal]/timescale:has-[[data-slot=timescale-content]]:w-80",
          "group-data-[orientation=vertical]/timescale:grid group-data-[orientation=vertical]/timescale:w-full group-data-[orientation=vertical]/timescale:grid-cols-[var(--timescale-rail)_1fr] group-data-[orientation=vertical]/timescale:gap-x-4 group-data-[orientation=vertical]/timescale:not-last:pb-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TimescaleItemContext.Provider>
  );
}

export type TimescaleTickProps = React.ComponentProps<"span">;

export function TimescaleTick({ className, ...props }: TimescaleTickProps) {
  const { delay, animated } = React.useContext(TimescaleItemContext);

  if (!animated) {
    return (
      <span
        data-slot="timescale-tick"
        aria-hidden="true"
        className={cn(
          "absolute z-10 transition-colors duration-200",
          "bg-black/30 dark:bg-white/30 group-hover/item:bg-[#6495ED] dark:group-hover/item:bg-white group-data-[active=true]/item:bg-[#6495ED] dark:group-data-[active=true]/item:bg-white",
          "group-data-[orientation=horizontal]/timescale:top-[var(--timescale-rail)] group-data-[orientation=horizontal]/timescale:left-0 group-data-[orientation=horizontal]/timescale:h-3 group-hover/item:group-data-[orientation=horizontal]/timescale:h-4.5 group-data-[active=true]/item:group-data-[orientation=horizontal]/timescale:h-4.5 group-data-[orientation=horizontal]/timescale:w-[1.5px] group-data-[orientation=horizontal]/timescale:-translate-y-1/2",
          "group-data-[orientation=vertical]/timescale:top-2.5 group-data-[orientation=vertical]/timescale:left-[var(--timescale-rail)] group-data-[orientation=vertical]/timescale:h-[1.5px] group-data-[orientation=vertical]/timescale:w-3 group-hover/item:group-data-[orientation=vertical]/timescale:w-4.5 group-data-[active=true]/item:group-data-[orientation=vertical]/timescale:w-4.5 group-data-[orientation=vertical]/timescale:-translate-x-1/2",
          className
        )}
        {...props}
      />
    );
  }

  return (
    <motion.span
      data-slot="timescale-tick"
      aria-hidden="true"
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{
        delay,
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1], // morph elastic spring pop
      }}
      className={cn(
        "absolute z-10 transition-colors duration-200 origin-center",
        "bg-black/30 dark:bg-white/30 group-hover/item:bg-[#6495ED] dark:group-hover/item:bg-white group-data-[active=true]/item:bg-[#6495ED] dark:group-data-[active=true]/item:bg-white",
        "group-data-[orientation=horizontal]/timescale:top-[var(--timescale-rail)] group-data-[orientation=horizontal]/timescale:left-0 group-data-[orientation=horizontal]/timescale:h-3 group-hover/item:group-data-[orientation=horizontal]/timescale:h-4.5 group-data-[active=true]/item:group-data-[orientation=horizontal]/timescale:h-4.5 group-data-[orientation=horizontal]/timescale:w-[1.5px] group-data-[orientation=horizontal]/timescale:-translate-y-1/2",
        "group-data-[orientation=vertical]/timescale:top-2.5 group-data-[orientation=vertical]/timescale:left-[var(--timescale-rail)] group-data-[orientation=vertical]/timescale:h-[1.5px] group-data-[orientation=vertical]/timescale:w-3 group-hover/item:group-data-[orientation=vertical]/timescale:w-4.5 group-data-[active=true]/item:group-data-[orientation=vertical]/timescale:w-4.5 group-data-[orientation=vertical]/timescale:-translate-x-1/2",
        className
      )}
      {...props}
    />
  );
}

export type TimescaleAgeProps = React.ComponentProps<"p">;

export function TimescaleAge({ className, ...props }: TimescaleAgeProps) {
  const { delay, animated } = React.useContext(TimescaleItemContext);

  if (!animated) {
    return (
      <p
        data-slot="timescale-age"
        className={cn(
          "text-xs sm:text-[13px] leading-5 font-sans font-medium transition-colors duration-200 tabular-nums select-none",
          "text-muted-foreground group-hover/item:text-zinc-800 dark:group-hover/item:text-zinc-200 group-data-[active=true]/item:text-zinc-800 dark:group-data-[active=true]/item:text-zinc-200",
          "in-[[data-slot=timescale-header]]:tracking-wider in-[[data-slot=timescale-header]]:uppercase",
          "group-data-[orientation=vertical]/timescale:col-start-1 group-data-[orientation=vertical]/timescale:row-start-1 group-data-[orientation=vertical]/timescale:pr-4 group-data-[orientation=vertical]/timescale:text-right",
          className
        )}
        {...props}
      />
    );
  }

  return (
    <motion.p
      data-slot="timescale-age"
      initial={{ opacity: 0, y: -8, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        delay: delay + 0.04,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "text-xs sm:text-[13px] leading-5 font-sans font-medium transition-colors duration-200 tabular-nums select-none",
        "text-muted-foreground group-hover/item:text-zinc-800 dark:group-hover/item:text-zinc-200 group-data-[active=true]/item:text-zinc-800 dark:group-data-[active=true]/item:text-zinc-200",
        "in-[[data-slot=timescale-header]]:tracking-wider in-[[data-slot=timescale-header]]:uppercase",
        "group-data-[orientation=vertical]/timescale:col-start-1 group-data-[orientation=vertical]/timescale:row-start-1 group-data-[orientation=vertical]/timescale:pr-4 group-data-[orientation=vertical]/timescale:text-right",
        className
      )}
      {...props}
    />
  );
}

export type TimescaleYearProps = React.ComponentProps<"p">;

export function TimescaleYear({ className, ...props }: TimescaleYearProps) {
  const { delay, animated } = React.useContext(TimescaleItemContext);

  if (!animated) {
    return (
      <p
        data-slot="timescale-year"
        className={cn(
          "text-xs sm:text-[13px] leading-5 font-sans font-semibold transition-all duration-200 tabular-nums select-none",
          "text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-950 dark:group-hover/item:text-white group-data-[active=true]/item:text-zinc-950 dark:group-data-[active=true]/item:text-white group-hover/item:font-bold group-data-[active=true]/item:font-bold",
          "in-[[data-slot=timescale-header]]:tracking-wider in-[[data-slot=timescale-header]]:uppercase in-[[data-slot=timescale-header]]:text-muted-foreground",
          "group-data-[orientation=vertical]/timescale:col-start-2 group-data-[orientation=vertical]/timescale:row-start-1",
          className
        )}
        {...props}
      />
    );
  }

  return (
    <motion.p
      data-slot="timescale-year"
      initial={{ opacity: 0, y: -8, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        delay: delay + 0.07,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "text-xs sm:text-[13px] leading-5 font-sans font-semibold transition-all duration-200 tabular-nums select-none",
        "text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-950 dark:group-hover/item:text-white group-data-[active=true]/item:text-zinc-950 dark:group-data-[active=true]/item:text-white group-hover/item:font-bold group-data-[active=true]/item:font-bold",
        "in-[[data-slot=timescale-header]]:tracking-wider in-[[data-slot=timescale-header]]:uppercase in-[[data-slot=timescale-header]]:text-muted-foreground",
        "group-data-[orientation=vertical]/timescale:col-start-2 group-data-[orientation=vertical]/timescale:row-start-1",
        className
      )}
      {...props}
    />
  );
}

export type TimescaleContentProps = React.ComponentProps<"div">;

export function TimescaleContent({
  className,
  ...props
}: TimescaleContentProps) {
  const { delay, animated } = React.useContext(TimescaleItemContext);

  if (!animated) {
    return (
      <div
        data-slot="timescale-content"
        className={cn(
          "w-full py-4 text-left font-sans text-xs sm:text-[13px] leading-relaxed transition-colors duration-200 text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-800 dark:group-hover/item:text-zinc-200 group-data-[active=true]/item:text-zinc-800 dark:group-data-[active=true]/item:text-zinc-200 [&_a]:text-[#6495ED] [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1.5 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:text-zinc-900 dark:[&_strong]:text-zinc-50 [&_h3]:font-bold [&_h3]:text-sm sm:[&_h3]:text-[14px] [&_h3]:text-zinc-900 dark:[&_h3]:text-zinc-50 [&_h3]:mb-1.5",
          "group-data-[orientation=horizontal]/timescale:mt-4",
          "group-data-[orientation=vertical]/timescale:col-start-2 group-data-[orientation=vertical]/timescale:row-start-2",
          className
        )}
        {...props}
      />
    );
  }

  return (
    <motion.div
      data-slot="timescale-content"
      initial={{ opacity: 0, y: 22, scale: 0.95, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{
        delay: delay + 0.1,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1], // fluid morph entrance
      }}
      className={cn(
        "w-full py-4 text-left font-sans text-xs sm:text-[13px] leading-relaxed transition-colors duration-200 text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-800 dark:group-hover/item:text-zinc-200 group-data-[active=true]/item:text-zinc-800 dark:group-data-[active=true]/item:text-zinc-200 [&_a]:text-[#6495ED] [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1.5 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:text-zinc-900 dark:[&_strong]:text-zinc-50 [&_h3]:font-bold [&_h3]:text-sm sm:[&_h3]:text-[14px] [&_h3]:text-zinc-900 dark:[&_h3]:text-zinc-50 [&_h3]:mb-1.5",
        "group-data-[orientation=horizontal]/timescale:mt-4",
        "group-data-[orientation=vertical]/timescale:col-start-2 group-data-[orientation=vertical]/timescale:row-start-2",
        className
      )}
      {...props}
    />
  );
}

export function TimescaleIntroScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = ref.current?.querySelector<HTMLElement>(
      '[data-slot="timescale-viewport"]'
    );
    if (!viewport) return;
    viewport.scrollLeft = 0;
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
