import React, { useState, useEffect, useRef } from "react";
import "./typer.css";
import { Typer } from "./typer";

// The viewBox dimensions matching your provided SVG, padded to prevent stroke clipping
const LOGO_VIEW_BOX = "-24 -24 556 475";

// The clean outer path without the inner cutout. This creates a perfect single-line trace.
const TRACE_PATH = "M231.634 5.50684C245.487 -1.1694 261.628 -1.16925 275.481 5.50684C281.928 8.61337 287.718 14.1873 294.442 22.915C301.167 31.6428 308.865 43.5789 319.106 59.458L346.206 101.475C358.061 119.854 366.969 133.666 372.88 144.78C378.788 155.89 381.74 164.374 381.611 172.094C381.402 184.669 376.519 196.558 368.152 205.583C378.957 203.308 390.333 204.616 400.481 209.507C406.928 212.613 412.718 218.187 419.442 226.915C426.167 235.643 433.865 247.579 444.106 263.458L471.206 305.475C483.061 323.854 491.969 337.666 497.88 348.78C503.788 359.89 506.74 368.374 506.611 376.094C506.335 392.652 497.96 408.023 484.194 417.229C477.777 421.522 469.046 423.64 456.508 424.696C443.965 425.753 427.529 425.753 405.658 425.753H351.458C329.587 425.753 313.152 425.753 300.608 424.696C288.07 423.64 279.339 421.522 272.922 417.229C263.895 411.192 257.185 402.503 253.558 392.566C249.93 402.502 243.222 411.192 234.194 417.229C227.777 421.522 219.047 423.64 206.508 424.696C193.965 425.753 177.529 425.753 155.658 425.753H101.458C79.587 425.753 63.1517 425.753 50.6084 424.696C38.0697 423.64 29.3395 421.522 22.9219 417.229C9.15662 408.023 0.779788 392.652 0.503906 376.094C0.375335 368.374 3.32808 359.89 9.23633 348.78C15.1467 337.666 24.0546 323.854 35.9092 305.475L63.0098 263.458C73.2515 247.579 80.9496 235.643 87.6738 226.915C94.3981 218.187 100.188 212.613 106.634 209.507C116.782 204.616 128.157 203.309 138.962 205.583C130.596 196.558 125.713 184.669 125.504 172.094C125.375 164.374 128.328 155.89 134.236 144.78C140.147 133.666 149.055 119.854 160.909 101.475L188.01 59.458C198.252 43.5789 205.95 31.6428 212.674 22.915C219.398 14.1873 225.188 8.61337 231.634 5.50684Z";

// The full compound path including the inner knockout
const FILL_PATHS = [
  "M231.634 5.50684C245.487 -1.1694 261.628 -1.16925 275.481 5.50684C281.928 8.61337 287.718 14.1873 294.442 22.915C301.167 31.6428 308.865 43.5789 319.106 59.458L346.206 101.475C358.061 119.854 366.969 133.666 372.88 144.78C378.788 155.89 381.74 164.374 381.611 172.094C381.402 184.669 376.519 196.558 368.152 205.583C378.957 203.308 390.333 204.616 400.481 209.507C406.928 212.613 412.718 218.187 419.442 226.915C426.167 235.643 433.865 247.579 444.106 263.458L471.206 305.475C483.061 323.854 491.969 337.666 497.88 348.78C503.788 359.89 506.74 368.374 506.611 376.094C506.335 392.652 497.96 408.023 484.194 417.229C477.777 421.522 469.046 423.64 456.508 424.696C443.965 425.753 427.529 425.753 405.658 425.753H351.458C329.587 425.753 313.152 425.753 300.608 424.696C288.07 423.64 279.339 421.522 272.922 417.229C263.895 411.192 257.185 402.503 253.558 392.566C249.93 402.502 243.222 411.192 234.194 417.229C227.777 421.522 219.047 423.64 206.508 424.696C193.965 425.753 177.529 425.753 155.658 425.753H101.458C79.587 425.753 63.1517 425.753 50.6084 424.696C38.0697 423.64 29.3395 421.522 22.9219 417.229C9.15662 408.023 0.779788 392.652 0.503906 376.094C0.375335 368.374 3.32808 359.89 9.23633 348.78C15.1467 337.666 24.0546 323.854 35.9092 305.475L63.0098 263.458C73.2515 247.579 80.9496 235.643 87.6738 226.915C94.3981 218.187 100.188 212.613 106.634 209.507C116.782 204.616 128.157 203.309 138.962 205.583C130.596 196.558 125.713 184.669 125.504 172.094C125.375 164.374 128.328 155.89 134.236 144.78C140.147 133.666 149.055 119.854 160.909 101.475L188.01 59.458C198.252 43.5789 205.95 31.6428 212.674 22.915C219.398 14.1873 225.188 8.61337 231.634 5.50684ZM344.41 218.933C340.619 219.721 336.347 220.288 331.508 220.696C318.965 221.753 302.529 221.753 280.658 221.753H226.458C204.587 221.753 188.152 221.753 175.608 220.696C170.768 220.288 166.496 219.721 162.705 218.933C164.882 221.232 167.106 223.883 169.442 226.915C176.167 235.643 183.865 247.579 194.106 263.458L221.206 305.475C233.061 323.854 241.969 337.666 247.88 348.78C250.252 353.24 252.147 357.278 253.558 361.012C254.969 357.277 256.864 353.241 259.236 348.78C265.147 337.666 274.055 323.854 285.909 305.475L313.01 263.458C323.252 247.579 330.95 235.643 337.674 226.915C340.01 223.883 342.233 221.232 344.41 218.933Z"
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
  strokeWidth = 24,
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
    setPhase("closingOutline");
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
          <path d={FILL_PATHS[0]} />
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
            y={`${(i + 1) * 22}`} // roughly scales across height
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="18"
            letterSpacing="4"
            fill="currentColor"
            opacity={0.8}
          >
            {line}
          </text>
        ))}
      </g>

      {/* Dimmed static background outline */}
      <g 
        style={{
          transition: `opacity ${fillFadeSeconds}s ease-out`,
          opacity: phase === "ascii" || phase === "fadingFill" || phase === "done" ? 0 : 0.12,
        }}
      >
        <path
          d={TRACE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={Math.max(1, strokeWidth / 2)}
          strokeLinejoin="round"
        />
      </g>

      {/* Animated tracing path */}
      <path
        d={TRACE_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={
          phase === "ascii" || phase === "loop" ? "0.16 0.84" : "1 0"
        }
        style={{
          animation: `logo-trace-loader-loop ${loopDurationSeconds}s linear infinite`,
          // We completely pause the rotation when loading completes so it expands right where it sits!
          animationPlayState: phase === "ascii" || phase === "loop" ? "running" : "paused",
          // The cubic-bezier eases the stroke smoothly into its final fully-closed shape.
          // The opacity transition elegantly blends it out simultaneously with the solid fill fading in.
          transition: `stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity ${fillFadeSeconds}s ease-out`,
          opacity: phase === "ascii" || phase === "fadingFill" || phase === "done" ? 0 : 1,
        }}
      />

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
