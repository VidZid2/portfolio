"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type HTMLMotionProps,
} from "motion/react";
import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { playHoverTick, playPowerUpSound } from "@/lib/synth-sounds";

export interface ExpandingArrowButtonProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  children: ReactNode;
  accentClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  onSlideComplete?: () => void;
}

const ARROW_OPACITY = [1, 0.78, 0.54, 0.32, 0.16] as const;

function DottedChevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="4" cy="4" r="2.2" fill="currentColor" />
      <circle cx="10" cy="9" r="2.2" fill="currentColor" />
      <circle cx="16" cy="14" r="2.2" fill="currentColor" />
      <circle cx="10" cy="19" r="2.2" fill="currentColor" />
      <circle cx="4" cy="24" r="2.2" fill="currentColor" />
    </svg>
  );
}

export const ExpandingArrowButton = forwardRef<
  HTMLDivElement,
  ExpandingArrowButtonProps
>(function ExpandingArrowButton(
  {
    children,
    className,
    accentClassName,
    labelClassName,
    disabled = false,
    onSlideComplete,
    onMouseEnter,
    onMouseLeave,
    ...rest
  },
  ref,
) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [maxDrag, setMaxDrag] = useState(140);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const initialThumbWidth = 34; // Compact resting thumb width
  const x = useMotionValue(0);

  // Measure track width to dynamically calculate drag constraint
  useEffect(() => {
    const updateMaxDrag = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.clientWidth;
        setMaxDrag(Math.max(50, trackWidth - initialThumbWidth - 6));
      }
    };

    updateMaxDrag();
    window.addEventListener("resize", updateMaxDrag);
    return () => window.removeEventListener("resize", updateMaxDrag);
  }, []);

  // Dynamically calculate the enveloping accent pill width from drag x
  const envelopeWidth = useTransform(x, (val) => `${initialThumbWidth + val}px`);

  // Single center chevron fades out as multiple chevrons fade in
  const singleChevronOpacity = useTransform(x, [0, 20], [1, 0]);
  const multiChevronOpacity = useTransform(x, [10, 45], [0, 1]);

  // Label fades out and translates as envelope expands over it
  const textOpacity = useTransform(x, [0, maxDrag * 0.5], [1, 0]);
  const textTranslate = useTransform(x, [0, maxDrag], [0, 10]);

  const handleDragStart = () => {
    if (disabled) return;
    setIsDragging(true);
    playHoverTick(0.04);
  };

  const handleDragEnd = () => {
    if (disabled) return;
    setIsDragging(false);
    const currentX = x.get();

    if (currentX >= maxDrag * 0.65) {
      // Completed slide past threshold
      setIsCompleted(true);
      playPowerUpSound(0.08);

      animate(x, maxDrag, {
        type: "spring",
        stiffness: 450,
        damping: 32,
        onComplete: () => {
          onSlideComplete?.();
          // Reset smoothly after trigger
          setTimeout(() => {
            animate(x, 0, {
              type: "spring",
              stiffness: 320,
              damping: 26,
            });
            setIsCompleted(false);
          }, 650);
        },
      });
    } else {
      // Snap envelope back to original compact pill
      animate(x, 0, {
        type: "spring",
        stiffness: 420,
        damping: 28,
      });
    }
  };

  return (
    <motion.div
      ref={(node) => {
        trackRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative inline-flex h-9 sm:h-10 w-48 sm:w-52 items-center overflow-hidden rounded-[15px] bg-white dark:bg-black p-0.5 sm:p-1 text-zinc-900 dark:text-zinc-100 select-none border border-black/10 dark:border-white/15 shadow-xs cursor-default",
        "focus-within:ring-2 focus-within:ring-[#6495ED] focus-within:ring-offset-2",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      {...rest}
    >
      {/* Expanding / Enveloping Cornflower Blue Container */}
      <motion.div
        style={{
          width: envelopeWidth,
        }}
        className={cn(
          "absolute left-0.5 sm:left-1 top-0.5 sm:top-1 bottom-0.5 sm:bottom-1 z-20 flex items-center overflow-hidden rounded-[12px] bg-[#6495ED] text-white shadow-xs select-none pointer-events-none",
          accentClassName,
        )}
      >
        {/* State 1: Single Center Chevron (Visible at rest) */}
        <motion.div
          style={{ opacity: singleChevronOpacity }}
          className="absolute inset-0 grid place-items-center w-8.5 sm:w-9 h-full pointer-events-none text-white"
        >
          <DottedChevron className="h-4 w-3.5" />
        </motion.div>

        {/* State 2: Enveloping Row of 5 Dotted Chevrons (Revealed when sliding/expanded across the track) */}
        <motion.div
          style={{ opacity: multiChevronOpacity }}
          className="absolute inset-0 flex items-center justify-around px-2.5 w-full h-full pointer-events-none"
        >
          {ARROW_OPACITY.map((opacity, index) => (
            <motion.span
              key={index}
              style={{ color: `rgb(255 255 255 / ${opacity})` }}
              className="inline-grid place-items-center shrink-0"
            >
              <DottedChevron className="h-4 w-3.5" />
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Draggable Handle Thumb driving x */}
      <motion.div
        drag={disabled ? false : "x"}
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="absolute left-0.5 sm:left-1 top-0.5 sm:top-1 bottom-0.5 sm:bottom-1 w-8.5 sm:w-9 h-full z-30 cursor-grab active:cursor-grabbing opacity-0 touch-none"
      />

      {/* Button Label Text */}
      <motion.div
        style={{
          opacity: textOpacity,
          x: textTranslate,
        }}
        className={cn(
          "relative z-10 w-full pl-10 pr-3 text-center text-[11px] sm:text-xs font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight whitespace-nowrap pointer-events-none font-sans",
          labelClassName,
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
});
