"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Text that writes itself, then inks in. No dependencies.
 *
 * Three things make this behave like handwriting rather than like a fade:
 *
 * 1. The font is parsed from its raw TTF and the glyphs converted to paths. A web font
 *    renders as filled shapes with no outline, so there is nothing to stroke and nothing
 *    to animate — the conversion is what makes a pen stroke possible at all.
 *
 * 2. Every contour is its own <path>. An SVG dash pattern RESTARTS at each subpath, so a
 *    single path holding the whole word cannot be drawn progressively: one long dash just
 *    makes each letter fully present or fully absent. Splitting them and staggering the
 *    delays is what produces a pen crossing the word left to right.
 *
 * 3. The weight comes from one filled copy of the entire word underneath, faded in as the
 *    stroke finishes. The fill must be a single path: a counter — the hole in an `e` or
 *    an `a` — is a separate contour, and it only reads as a hole when the fill rule sees
 *    it together with the outer contour. Fill the split paths individually and every
 *    letter becomes a blob.
 */

const LOCAL_OPENTYPE = "/scripts/opentype.min.js";
const OPENTYPE_CDN = "https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js";

const LOCAL_FONT_URL = "/fonts/patrick-hand.ttf";
const DEFAULT_FONT_URL = "/fonts/handwriting.ttf";

export interface HandwritingTextProps {
  /** A single phrase to write. Ignored when `words` is given. */
  text?: string;
  /** Cycle through these, rewriting on each change. */
  words?: string[];
  /** Milliseconds each word is held before the next one starts. */
  interval?: number;
  /** URL of a .ttf or .otf. Must be CORS-readable; self-host for production. */
  fontUrl?: string;
  /** Seconds for the pen to cross the whole word. */
  duration?: number;
  /** Seconds before the pen starts. */
  delay?: number;
  /** Stroke weight, in units of a 100px em. */
  strokeWidth?: number;
  /** Ink the letters in once drawn. Set false to leave them as outlines. */
  fill?: boolean;
  /** CSS height of the rendered word; width follows the glyphs. */
  height?: string;
  className?: string;
  /** Only start drawing when scrolled into the viewport */
  triggerOnView?: boolean;
}

type Geometry = {
  full: string;
  contours: string[];
  x: number;
  y: number;
  w: number;
  h: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

// The library, loaded once per page.
let libPromise: Promise<any> | null = null;

function loadOpentype(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  const existing = (window as any).opentype;
  if (existing) return Promise.resolve(existing);
  if (!libPromise) {
    libPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = LOCAL_OPENTYPE;
      script.async = true;
      script.onload = () => {
        const lib = (window as any).opentype;
        if (lib) resolve(lib);
        else reject(new Error("opentype.js loaded but exposed nothing"));
      };
      script.onerror = () => {
        // Fallback to CDN if local script fails
        const fallbackScript = document.createElement("script");
        fallbackScript.src = OPENTYPE_CDN;
        fallbackScript.async = true;
        fallbackScript.onload = () => {
          const lib = (window as any).opentype;
          if (lib) resolve(lib);
          else reject(new Error("opentype.js CDN loaded but exposed nothing"));
        };
        fallbackScript.onerror = () => reject(new Error("opentype.js failed to load"));
        document.head.appendChild(fallbackScript);
      };
      document.head.appendChild(script);
    });
  }
  return libPromise;
}

// One fetch and one parse per font URL, shared by every instance on the page.
const fontCache = new Map<string, Promise<any>>();

function loadFont(url: string): Promise<any> {
  let pending = fontCache.get(url);
  if (!pending) {
    pending = Promise.all([
      loadOpentype(),
      fetch(url)
        .catch(() => fetch(DEFAULT_FONT_URL))
        .then((res) => {
          if (!res.ok) throw new Error(`Font request failed: ${res.status}`);
          return res.arrayBuffer();
        }),
    ]).then(([lib, buffer]) => lib.parse(buffer));
    fontCache.set(url, pending);
  }
  return pending;
}

const EM = 100; // arbitrary: the viewBox normalises whatever we pick

export function HandwritingText({
  text,
  words,
  interval = 3200,
  fontUrl = LOCAL_FONT_URL,
  duration = 1.5,
  delay = 0.05,
  strokeWidth = 1.6,
  fill = true,
  height = "1.15em",
  className,
  triggerOnView = true,
}: HandwritingTextProps) {
  const cycle = Boolean(words && words.length > 0);
  const [index, setIndex] = useState(0);
  const current = cycle ? words![index % words!.length] : text ?? "";
  const [font, setFont] = useState<any>(null);
  const [drawn, setDrawn] = useState(false);
  const [lengths, setLengths] = useState<number[]>([]);
  const [fontFailed, setFontFailed] = useState(false);

  // Outer container ref observed by Framer Motion's useInView
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  // Framer Motion viewport detection
  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.1,
  });

  const shouldAnimate = !triggerOnView || isInView;

  useEffect(() => {
    if (!cycle) return undefined;
    const id = setInterval(() => setIndex((i) => i + 1), interval);
    return () => clearInterval(id);
  }, [cycle, interval]);

  useEffect(() => {
    let cancelled = false;
    loadFont(fontUrl)
      .then((f) => {
        if (!cancelled) setFont(f);
      })
      .catch(() => {
        // Fallback to default remote font if local fails
        loadFont(DEFAULT_FONT_URL)
          .then((f) => {
            if (!cancelled) setFont(f);
          })
          .catch(() => {
            if (!cancelled) setFontFailed(true);
          });
      });
    return () => {
      cancelled = true;
    };
  }, [fontUrl]);

  // Pure memoized geometry calculation derived from font and current word
  const geom = useMemo<Geometry | null>(() => {
    if (!font || !current) return null;
    try {
      const path = font.getPath(current, 0, EM, EM);
      const box = path.getBoundingBox();
      const full = path.toPathData(2);

      // Standardize vertical metrics to the font's EM baseline & line-height.
      // This guarantees that every letter across all annotations renders at the EXACT same scale,
      // preventing phrases without descenders from blowing up larger than phrases with descenders.
      const scale = font.unitsPerEm ? EM / font.unitsPerEm : 1;
      const ascent = (font.ascender || 1000) * scale;
      const descent = Math.abs(font.descender || 300) * scale;
      const padY = EM * 0.14;
      const padX = EM * 0.12;

      const y = EM - ascent - padY;
      const h = ascent + descent + padY * 2;
      const x = box.x1 - padX;
      const w = (box.x2 - box.x1) + padX * 2;

      return {
        full,
        // Split on the moveto that opens each contour, keeping the M with its segment.
        contours: full.split(/(?=M)/).filter((d: string) => d.trim().length > 1),
        x,
        y,
        w,
        h,
      };
    } catch {
      return null;
    }
  }, [font, current]);

  useEffect(() => {
    if (!geom || !shouldAnimate) return undefined;

    let cancel = false;
    let id2 = 0;

    const id1 = requestAnimationFrame(() => {
      if (cancel) return;

      setDrawn(false);
      const measured = pathRefs.current
        .slice(0, geom.contours.length)
        .map((el) => (el ? el.getTotalLength() : 0));

      setLengths(measured);

      id2 = requestAnimationFrame(() => {
        if (!cancel) setDrawn(true);
      });
    });

    return () => {
      cancel = true;
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [geom, shouldAnimate, current]);

  if (fontFailed) {
    return (
      <span ref={containerRef} className={cn("inline-block font-caveat italic", className)}>
        {current}
      </span>
    );
  }

  const count = Math.max(1, geom?.contours.length ?? 1);

  return (
    <span
      ref={containerRef}
      className={cn("inline-flex items-center leading-none select-none relative", className)}
      style={{ verticalAlign: "middle" }}
    >
      <span className="sr-only">{current}</span>
      {!geom ? (
        <span className="opacity-0 pointer-events-none select-none font-caveat italic" style={{ fontSize: height }}>
          {current}
        </span>
      ) : (
        <svg
          key={current}
          viewBox={`${geom.x} ${geom.y} ${geom.w} ${geom.h}`}
          role="img"
          aria-label={current}
          className="inline-block"
          style={{
            height,
            width: `calc(${height} * ${(geom.w / geom.h).toFixed(4)})`,
            overflow: "visible",
            opacity: shouldAnimate && lengths.length > 0 ? 1 : 0,
            transition: "opacity 0.25s ease-out",
          }}
        >
          <title>{current}</title>
          {fill && (
            <path
              d={geom.full}
              fill="currentColor"
              stroke="none"
              style={{
                opacity: drawn ? 1 : 0,
                transition: drawn
                  ? `opacity 0.45s ease-out ${(delay + duration * 0.72).toFixed(3)}s`
                  : "none",
              }}
            />
          )}
          {geom.contours.map((d, i) => {
            const length = lengths[i] || 0;
            // Contours overlap slightly so the stroke reads as one continuous movement
            // rather than as letters switching on in turn.
            const each = (duration / count) * 2.4;
            const start = delay + (i / count) * duration;
            return (
              <path
                key={i}
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: length || 1,
                  strokeDashoffset: drawn ? 0 : length || 1,
                  transition: drawn
                    ? `stroke-dashoffset ${each.toFixed(3)}s ease-out ${start.toFixed(3)}s`
                    : "none",
                }}
              />
            );
          })}
        </svg>
      )}
    </span>
  );
}

export default HandwritingText;
