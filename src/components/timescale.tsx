"use client";

// Inspired by Evil Rabbit's Lifeline & Chánh Đại Timescale
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type TimescaleRootProps = React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
};

export function TimescaleRoot({
  className,
  orientation = "horizontal",
  ...props
}: TimescaleRootProps) {
  return (
    <div
      data-slot="timescale-root"
      data-orientation={orientation}
      className={cn(
        "group/timescale relative flex w-full [--timescale-rail:3.5rem]",
        "data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  );
}

export type TimescaleViewportProps = React.ComponentProps<"div">;

export function TimescaleViewport({
  className,
  ...props
}: TimescaleViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    isDown.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - viewportRef.current.offsetLeft;
    scrollLeft.current = viewportRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    hasMoved.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown.current || !viewportRef.current) return;
    const x = e.pageX - viewportRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(x - startX.current) > 3) {
      hasMoved.current = true;
    }
    viewportRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasMoved.current) {
      e.stopPropagation();
      e.preventDefault();
      hasMoved.current = false;
    }
  };

  return (
    <div
      ref={viewportRef}
      data-slot="timescale-viewport"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClickCapture={handleClickCapture}
      className={cn(
        "no-scrollbar w-full overflow-x-auto overscroll-x-contain cursor-grab active:cursor-grabbing select-none",
        "group-data-[orientation=horizontal]/timescale:flex group-data-[orientation=horizontal]/timescale:flex-1 group-data-[orientation=horizontal]/timescale:pl-20 sm:group-data-[orientation=horizontal]/timescale:pl-24",
        className
      )}
      {...props}
    />
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
        "group-data-[orientation=horizontal]/timescale:absolute group-data-[orientation=horizontal]/timescale:top-0 group-data-[orientation=horizontal]/timescale:left-0 group-data-[orientation=horizontal]/timescale:w-20 group-data-[orientation=horizontal]/timescale:shrink-0 group-data-[orientation=horizontal]/timescale:bg-gradient-to-r group-data-[orientation=horizontal]/timescale:from-background group-data-[orientation=horizontal]/timescale:from-75% group-data-[orientation=horizontal]/timescale:to-transparent group-data-[orientation=horizontal]/timescale:pr-4 group-data-[orientation=horizontal]/timescale:text-right",
        "group-data-[orientation=vertical]/timescale:grid group-data-[orientation=vertical]/timescale:w-full group-data-[orientation=vertical]/timescale:grid-cols-[var(--timescale-rail)_1fr] group-data-[orientation=vertical]/timescale:gap-x-4 group-data-[orientation=vertical]/timescale:bg-background",
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

export type TimescaleItemProps = React.ComponentProps<"div">;

export function TimescaleItem({ className, ...props }: TimescaleItemProps) {
  return (
    <div
      data-slot="timescale-item"
      className={cn(
        "relative",
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
        "absolute z-10 bg-black/40 dark:bg-white/40",
        "group-data-[orientation=horizontal]/timescale:top-[var(--timescale-rail)] group-data-[orientation=horizontal]/timescale:left-0 group-data-[orientation=horizontal]/timescale:h-3 group-data-[orientation=horizontal]/timescale:w-px group-data-[orientation=horizontal]/timescale:-translate-y-1/2",
        "group-data-[orientation=vertical]/timescale:top-2.5 group-data-[orientation=vertical]/timescale:left-[var(--timescale-rail)] group-data-[orientation=vertical]/timescale:h-px group-data-[orientation=vertical]/timescale:w-3 group-data-[orientation=vertical]/timescale:-translate-x-1/2",
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
        "text-xs leading-5 font-mono font-medium text-muted-foreground tabular-nums select-none",
        "in-[[data-slot=timescale-header]]:tracking-widest in-[[data-slot=timescale-header]]:uppercase",
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
        "text-xs leading-5 font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums select-none",
        "in-[[data-slot=timescale-header]]:tracking-widest in-[[data-slot=timescale-header]]:uppercase in-[[data-slot=timescale-header]]:text-muted-foreground",
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
        "w-full py-4 text-left font-sans text-xs sm:text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400 [&_a]:text-[#6495ED] [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_p]:mb-2 [&_p:last-child]:mb-0",
        "group-data-[orientation=horizontal]/timescale:mt-4",
        "group-data-[orientation=vertical]/timescale:col-start-2 group-data-[orientation=vertical]/timescale:row-start-2",
        className
      )}
      {...props}
    />
  );
}

const INTRO_SCROLL_START_HOLD = 200;

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

    const distance = viewport.scrollWidth - viewport.clientWidth;
    if (distance <= 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      viewport.scrollLeft = distance;
      return;
    }

    const timer = window.setTimeout(() => {
      viewport.scrollTo({ left: distance, behavior: "smooth" });
    }, INTRO_SCROLL_START_HOLD);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
