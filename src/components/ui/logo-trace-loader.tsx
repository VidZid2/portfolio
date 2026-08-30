import React, { useState, useEffect, useRef } from "react";
import "./typer.css";
import { Typer } from "./typer";

// The viewBox dimensions matching your JD logo SVG
const LOGO_VIEW_BOX = "250 250 1548 1548";

// The full compound paths for the JD monogram
const FILL_PATHS = [
  "M5930 14285 l1045 -1045 2385 0 c2535 0 2473 1 2715 -46 1138 -220 2073 -1102 2357 -2224 96 -381 119 -722 73 -1077 -64 -485 -213 -890 -470 -1279 -426 -643 -1081 -1110 -1809 -1289 -311 -76 -421 -87 -996 -94 l-485 -6 -21 -55 c-12 -30 -39 -100 -60 -155 -51 -132 -184 -400 -274 -550 -285 -477 -714 -931 -1157 -1223 -72 -48 -132 -90 -132 -95 -1 -10 2530 -7 2699 4 924 57 1784 341 2525 834 813 540 1474 1325 1854 2201 239 553 382 1132 422 1707 16 247 7 679 -20 907 -88 737 -305 1398 -661 2010 -542 931 -1397 1690 -2377 2109 -470 201 -887 312 -1438 383 l-170 22 -3525 3 -3525 3 1045 -1045z",
  "M8160 10468 c0 -1757 -2 -2098 -14 -2178 -83 -550 -588 -960 -1141 -927 -540 33 -983 465 -1032 1007 l-8 84 -210 131 c-830 518 -1875 1165 -1880 1165 -9 0 -5 -1332 5 -1500 24 -379 97 -685 247 -1035 81 -191 164 -344 278 -515 135 -202 230 -317 424 -510 507 -505 1099 -804 1801 -911 137 -21 189 -24 445 -23 248 0 311 3 435 22 735 113 1370 450 1882 998 225 241 390 479 532 768 164 331 252 621 313 1026 16 106 17 293 20 2298 l4 2182 -1051 0 -1050 0 0 -2082z"
] as const;

export type LogoTraceLoaderProps = {
  loading?: boolean;
  isComplete?: boolean;
  size?: number;
  strokeWidth?: number;
  loopDurationSeconds?: number;
  fillFadeSeconds?: number;
  className?: string;
  ariaLabel?: string;
  onDone?: () => void;
};

type LoaderPhase = "ascii" | "loop" | "closingOutline" | "fadingFill" | "done";

export default function LogoTraceLoader({
  loading,
  isComplete,
  size = 64,
  strokeWidth = 90,
  loopDurationSeconds = 2,
  fillFadeSeconds = 0.5,
  className = "",
  ariaLabel = "Loading...",
  onDone,
}: LogoTraceLoaderProps) {
  
  const [phase, setPhase] = useState<LoaderPhase>("ascii");
  const [asciiLines, setAsciiLines] = useState<string[]>([]);
  const hasCalledOnDone = useRef(false);

  useEffect(() => {
    // Respect user's motion preferences immediately
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mediaQuery.matches) return;
    const frame = requestAnimationFrame(() => setPhase("done"));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (phase !== "loop") return;

    // Switch to closing state when explicitly completed
    const isFinishedLoading = isComplete === true || loading === false;

    if (!isFinishedLoading) return;
    const frame = requestAnimationFrame(() => setPhase("closingOutline"));
    return () => cancelAnimationFrame(frame);
  }, [loading, isComplete, phase]);

  useEffect(() => {
    if (phase === "closingOutline") {
      // 1.2 seconds allows the stroke to gracefully wrap the entire shape
      const closingTimer = setTimeout(() => {
        setPhase("fadingFill");
      }, 1200); 
      return () => clearTimeout(closingTimer);
    }
    
    if (phase === "fadingFill") {
      // Allow the crossfade time to finish
      const fadingTimer = setTimeout(() => {
        setPhase("done");
      }, fillFadeSeconds * 1000);
      return () => clearTimeout(fadingTimer);
    }
  }, [phase, fillFadeSeconds]);

  useEffect(() => {
    if (phase === "ascii") {
      // Clean alphanumeric characters for a modern SaaS decoding effect
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; 
      
      const generateLine = () =>
        Array.from({ length: 45 })
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join("");
          
      const frame = requestAnimationFrame(() =>
        setAsciiLines(Array.from({ length: 20 }).map(generateLine))
      );

      // Rapidly scramble characters
      const interval = setInterval(() => {
        setAsciiLines(Array.from({ length: 20 }).map(generateLine));
      }, 60);

      // Transition out of the ASCII intro after 1.2s
      const timeout = setTimeout(() => {
        setPhase("loop");
      }, 1200);

      return () => {
        cancelAnimationFrame(frame);
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "done" && !hasCalledOnDone.current) {
      hasCalledOnDone.current = true;
      if (onDone) {
        onDone();
      }
    }
  }, [phase, onDone]);

  const customStyles = `
    @keyframes logo-trace-loader-loop {
      to {
        stroke-dashoffset: -1;
      }
    }
  `;

  return (
    <svg
      role="status"
      aria-label={ariaLabel}
      viewBox={LOGO_VIEW_BOX}
      width={size}
      height={size}
      className={className}
    >
      <style>{customStyles}</style>

      {/* Used to clip the text to only be visible within the logo boundaries */}
      <defs>
        <clipPath id="logo-ascii-mask">
          <g transform="translate(0,2048) scale(0.1,-0.1)">
            {FILL_PATHS.map((path, index) => (
              <path key={index} d={path} />
            ))}
          </g>
        </clipPath>
      </defs>

      {/* Matrix Glitch Text Layer */}
      <g
        clipPath="url(#logo-ascii-mask)"
        style={{
          transition: "opacity 0.4s ease-out",
          opacity: phase === "ascii" ? 1 : 0,
        }}
      >
        {asciiLines.map((line, i) => (
          <text
            key={i}
            x="50%"
            y={`${350 + (i + 1) * 70}`}
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="64"
            letterSpacing="12"
            fill="currentColor"
            opacity={0.8}
          >
            {line}
          </text>
        ))}
      </g>

      <g transform="translate(0,2048) scale(0.1,-0.1)">
        {/* Dimmed static background outline */}
        <g 
          style={{
            transition: `opacity ${fillFadeSeconds}s ease-out`,
            opacity: phase === "ascii" || phase === "fadingFill" || phase === "done" ? 0 : 0.15,
          }}
        >
          {FILL_PATHS.map((path, index) => (
            <path
              key={index}
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth={Math.max(20, strokeWidth / 2)}
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* Animated tracing path */}
        {FILL_PATHS.map((path, index) => (
          <path
            key={index}
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={
              phase === "ascii" || phase === "loop" ? "0.2 0.8" : "1 0"
            }
            style={{
              animation: `logo-trace-loader-loop ${loopDurationSeconds}s linear infinite`,
              animationPlayState: phase === "ascii" || phase === "loop" ? "running" : "paused",
              transition: `stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity ${fillFadeSeconds}s ease-out`,
              opacity: phase === "ascii" || phase === "fadingFill" || phase === "done" ? 0 : 1,
            }}
          />
        ))}

        {/* Solid filled logo fading in at the end */}
        <g
          style={{
            transition: `opacity ${fillFadeSeconds}s ease-in-out`,
            opacity: phase === "fadingFill" || phase === "done" ? 1 : 0,
          }}
        >
          {FILL_PATHS.map((path, index) => (
            <path key={index} d={path} fill="currentColor" />
          ))}
        </g>
      </g>
    </svg>
  );
}

// Custom Typer Text component using the advanced character reveal engine
export const SyncAsciiText = ({ visible }: { visible: boolean }) => {
  const typerRef = useRef<HTMLDivElement>(null);
  const typerInstance = useRef<Typer | null>(null);
  const [textLength, setTextLength] = useState(6); // JOSIAH is 6

  useEffect(() => {
    if (!visible) return;
    
    let timer: ReturnType<typeof setTimeout>;

    if (typerRef.current && !typerInstance.current) {
      // 1. Initialize Typer with 'JOSIAH'
      typerRef.current.innerHTML = "JOSIAH";
      typerInstance.current = new Typer(typerRef.current, { fps: 22, cycles: 4 });
      
      // Delay slightly before kicking off the first reveal
      setTimeout(() => {
        if (typerInstance.current) typerInstance.current.in();
      }, 100);

      // 2. After 3.0s, morph to SYNC (extended lifespan)
      timer = setTimeout(() => {
        if (typerInstance.current) {
          setTextLength(4); // SYNC is 4 characters
          typerInstance.current.reset("SYNC");
          typerInstance.current.in();
        }
      }, 3000); 
    }

    return () => {
      clearTimeout(timer);
      if (typerInstance.current) {
        typerInstance.current.destroy();
        typerInstance.current = null;
      }
    };
  }, [visible]);

  return (
    <div
      ref={typerRef}
      data-typer
      data-typer-type="initial"
      className="font-mono font-black text-2xl tracking-[0.4em] whitespace-pre overflow-hidden"
      style={{
        // Dynamically compute exact width so we can smoothly transition it when text length drops!
        width: textLength > 0 ? `calc(${textLength}ch + ${textLength * 0.4}em)` : "0px",
        // The Slide Morph trick: heavy vertical stretch that squashes to normal size as it slides up
        transform: visible ? "translateY(0) scaleY(1)" : "translateY(200%) scaleY(3.5)",
        // The clip-path acts as a sliding window revealing the text without any fading
        clipPath: visible ? "inset(-50% -50% -50% -50%)" : "inset(100% 0 0 0)",
        // Add width to the transition so the logo slides left smoothly as the text shortens!
        transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: 1, // Explicitly avoiding fades as requested
      }}
    >
      JOSIAH
    </div>
  );
};
