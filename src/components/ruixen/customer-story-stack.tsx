"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── types ───────────────────────────────────────────────────── */

export interface CustomerStoryAuthor {
  name: string;
  role: string;
  /** Image URL for the avatar. */
  avatarUrl?: string;
  /** Initials/letter fallback when `avatarUrl` is omitted. */
  avatarFallback?: string;
}

export interface CustomerStoryMetric {
  /** Single icon rendered above the metric label. */
  icon: React.ReactNode;
  /** Label rendered below the icon. */
  label: React.ReactNode;
}

export interface CustomerStoryCase {
  /** Unique id used as the React key when cycling cards. */
  id: string;
  /** Brand logo — typically an inline SVG or typography lockup. */
  logo: React.ReactNode;
  /** Pull-quote rendered with serif curly-quote pseudo-elements. */
  quote: React.ReactNode;
  author: CustomerStoryAuthor;
  /** Two metrics shown inside the same frame, below the testimonial. Omit to hide. */
  metrics?: [CustomerStoryMetric, CustomerStoryMetric];
}

export interface CustomerStoryStackProps {
  cases: CustomerStoryCase[];
  /** Optional "Read more customer stories" link rendered below the frame. */
  readMoreLink?: { label: string; href: string };
  /** Horizontal swipe threshold in pixels for touch-based prev/next. */
  swipeThreshold?: number;
  className?: string;
}

/* ── primitives ──────────────────────────────────────────────── */

function AuthorAvatar({ author }: { author: CustomerStoryAuthor }) {
  const frame =
    "aspect-square size-10 sm:size-11 overflow-hidden rounded-xl border border-black/10 dark:border-white/15 ring-1 ring-black/5 dark:ring-white/10 shadow-sm shrink-0";

  if (author.avatarUrl) {
    return (
      <div className={frame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={author.avatarUrl}
          alt={`Avatar of ${author.name}`}
          loading="lazy"
          width={96}
          height={96}
          className="size-full object-cover"
        />
      </div>
    );
  }

  const initials =
    author.avatarFallback ?? author.name.trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        frame,
        "flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 font-mono select-none",
      )}
    >
      {initials}
    </div>
  );
}

/* ── component ───────────────────────────────────────────────── */

export function CustomerStoryStack({
  cases,
  readMoreLink,
  swipeThreshold = 50,
  className,
}: CustomerStoryStackProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const total = cases.length;
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const touchStartX = React.useRef<number | null>(null);

  const goNext = React.useCallback(() => {
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = React.useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  React.useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const onStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0]?.clientX ?? null;
    };
    const onEnd = (e: TouchEvent) => {
      const start = touchStartX.current;
      touchStartX.current = null;
      if (start == null) return;
      const end = e.changedTouches[0]?.clientX ?? start;
      const dx = end - start;
      if (Math.abs(dx) <= swipeThreshold) return;
      if (dx > 0) goPrev();
      else goNext();
    };

    surface.addEventListener("touchstart", onStart, { passive: true });
    surface.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      surface.removeEventListener("touchstart", onStart);
      surface.removeEventListener("touchend", onEnd);
    };
  }, [goNext, goPrev, swipeThreshold]);

  if (total === 0) return null;
  const activeCase = cases[activeIndex];
  if (!activeCase) return null;

  return (
    <section
      className={cn("w-full relative select-none", className)}
      aria-label="Customer stories"
    >
      <div
        ref={surfaceRef}
        className="relative w-full"
        style={{ touchAction: "pan-y" }}
      >
        <div
          key={activeCase.id}
          className="relative bg-white dark:bg-black w-full overflow-hidden animate-in fade-in duration-300 px-6 sm:px-10 py-7 sm:py-9"
        >
          {/* Top Header Row: Brand Logo on Left, Author on Right */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-black/5 dark:border-white/10">
            <div aria-hidden className="text-zinc-900 dark:text-zinc-100 flex items-center shrink-0">
              {activeCase.logo}
            </div>

            <div className="flex items-center gap-3">
              <AuthorAvatar author={activeCase.author} />
              <div className="space-y-0.5 text-left">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {activeCase.author.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {activeCase.author.role}
                </p>
              </div>
            </div>
          </div>

          {/* Center Quote Section */}
          <div className="py-6 sm:py-7">
            <blockquote className="text-[15px] sm:text-[17px] font-normal leading-relaxed text-zinc-800 dark:text-zinc-200 before:mr-1 before:font-serif before:content-['“'] after:ml-1 after:font-serif after:content-['”']">
              {activeCase.quote}
            </blockquote>
          </div>

          {/* Bottom Metrics Highlights */}
          {activeCase.metrics && (
            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 pt-5 border-t border-black/5 dark:border-white/10">
              {activeCase.metrics.map((metric, i) => (
                <div key={i} className="flex items-center gap-2 text-xs sm:text-[13px]">
                  <span className="text-[#6495ED] [&_svg]:size-4 flex items-center shrink-0">
                    {metric.icon}
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium tracking-tight">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {readMoreLink && (
        <Link
          href={readMoreLink.href}
          className="mx-auto mt-4 flex h-8 w-fit items-center justify-center gap-1.5 rounded-md px-3 text-xs sm:text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          {readMoreLink.label}
          <ChevronRight className="size-3.5 opacity-70" />
        </Link>
      )}
    </section>
  );
}

export default CustomerStoryStack;
