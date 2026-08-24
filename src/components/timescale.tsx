"use client";

// Inspired by Evil Rabbit's Lifeline & Chánh Đại Timescale
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TimescaleContext = React.createContext<{
  canScrollLeft: boolean;
  canScrollRight: boolean;
  setCanScrollLeft: (v: boolean) => void;
  setCanScrollRight: (v: boolean) => void;
}>({
  canScrollLeft: false,
  canScrollRight: true,
  setCanScrollLeft: () => {},
  setCanScrollRight: () => {},
});

export type TimescaleRootProps = React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
};

export function TimescaleRoot({
  className,
  orientation = "horizontal",
  children,
  ...props
}: TimescaleRootProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  return (
    <TimescaleContext.Provider
      value={{ canScrollLeft, canScrollRight, setCanScrollLeft, setCanScrollRight }}
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
        {/* Left Fade Gradient - Pure white in light mode, pitch black in dark mode matching site background */}
        <div
          className={cn(
            "pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-20 bg-gradient-to-r from-white dark:from-black via-white/80 dark:via-black/80 to-transparent transition-opacity duration-300",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )}
        />
        {/* Right Fade Gradient - Pure white in light mode, pitch black in dark mode matching site background */}
        <div
          className={cn(
            "pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-20 bg-gradient-to-l from-white dark:from-black via-white/80 dark:via-black/80 to-transparent transition-opacity duration-300",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
        />
        {children}
      </div>
    </TimescaleContext.Provider>
  );
}

export type TimescaleViewportProps = React.ComponentProps<"div">;

export function TimescaleViewport({
  className,
  children,
  ...props
}: TimescaleViewportProps) {
  const { setCanScrollLeft, setCanScrollRight } = React.useContext(TimescaleContext);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const exactScroll = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const animFrameId = useRef<number | null>(null);
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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    if (e.button !== 0) return; // Only primary mouse button

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

    exactScroll.current = startScrollLeft.current - deltaX;
    viewportRef.current.scrollLeft = exactScroll.current;
    updateScrollBounds();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current || !viewportRef.current) return;
    isDown.current = false;
    setIsDraggingState(false);

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

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    updateScrollBounds();
    el.addEventListener("scroll", updateScrollBounds, { passive: true });
    window.addEventListener("resize", updateScrollBounds);
    return () => {
      stopMomentum();
      el.removeEventListener("scroll", updateScrollBounds);
      window.removeEventListener("resize", updateScrollBounds);
    };
  }, [updateScrollBounds]);

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
      className={cn(
        "no-scrollbar w-full overflow-x-auto overscroll-x-contain select-none touch-pan-y",
        isDraggingState ? "cursor-grabbing" : "cursor-default",
        "group-data-[orientation=horizontal]/timescale:flex group-data-[orientation=horizontal]/timescale:flex-1 group-data-[orientation=horizontal]/timescale:pl-20 sm:group-data-[orientation=horizontal]/timescale:pl-24 group-data-[orientation=horizontal]/timescale:pr-12 sm:group-data-[orientation=horizontal]/timescale:pr-16",
        className
      )}
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
        "z-10 select-none",
        "group-data-[orientation=horizontal]/timescale:absolute group-data-[orientation=horizontal]/timescale:top-0 group-data-[orientation=horizontal]/timescale:left-0 group-data-[orientation=horizontal]/timescale:w-16 group-data-[orientation=horizontal]/timescale:shrink-0 group-data-[orientation=horizontal]/timescale:pr-2 group-data-[orientation=horizontal]/timescale:text-right group-data-[orientation=horizontal]/timescale:bg-transparent",
        "group-data-[orientation=vertical]/timescale:grid group-data-[orientation=vertical]/timescale:w-full group-data-[orientation=vertical]/timescale:grid-cols-[var(--timescale-rail)_1fr] group-data-[orientation=vertical]/timescale:gap-x-4 group-data-[orientation=vertical]/timescale:bg-white dark:group-data-[orientation=vertical]/timescale:bg-black",
        className
      )}
      {...props}
    />
  );
}

export type TimescaleTrackProps = React.ComponentProps<"div">;

export function TimescaleTrack({ className, ...props }: TimescaleTrackProps) {
  return (
    <div
      data-slot="timescale-track"
      className={cn(
        "relative flex",
        "group-data-[orientation=horizontal]/timescale:w-max group-data-[orientation=horizontal]/timescale:items-start pb-8",
        "group-data-[orientation=vertical]/timescale:w-full group-data-[orientation=vertical]/timescale:flex-col group-data-[orientation=vertical]/timescale:pt-4",
        className
      )}
      {...props}
    />
  );
}

export type TimescaleRailProps = React.ComponentProps<"div">;

export function TimescaleRail({ className, ...props }: TimescaleRailProps) {
  return (
    <div
      data-slot="timescale-rail"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute border-dashed border-black/20 dark:border-white/20",
        "group-data-[orientation=horizontal]/timescale:inset-x-0 group-data-[orientation=horizontal]/timescale:top-[var(--timescale-rail)] group-data-[orientation=horizontal]/timescale:h-px group-data-[orientation=horizontal]/timescale:border-t",
        "group-data-[orientation=vertical]/timescale:inset-y-0 group-data-[orientation=vertical]/timescale:left-[var(--timescale-rail)] group-data-[orientation=vertical]/timescale:w-px group-data-[orientation=vertical]/timescale:border-l",
        className
      )}
      {...props}
    />
  );
}

export type TimescaleItemProps = React.ComponentProps<"div"> & {
  isActive?: boolean;
};

export function TimescaleItem({
  className,
  isActive = false,
  ...props
}: TimescaleItemProps) {
  return (
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
    />
  );
}

export type TimescaleTickProps = React.ComponentProps<"span">;

export function TimescaleTick({ className, ...props }: TimescaleTickProps) {
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

export type TimescaleAgeProps = React.ComponentProps<"p">;

export function TimescaleAge({ className, ...props }: TimescaleAgeProps) {
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

export type TimescaleYearProps = React.ComponentProps<"p">;

export function TimescaleYear({ className, ...props }: TimescaleYearProps) {
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

export type TimescaleContentProps = React.ComponentProps<"div">;

export function TimescaleContent({
  className,
  ...props
}: TimescaleContentProps) {
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
