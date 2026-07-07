"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useInView } from "framer-motion";

const DEFAULT_SIGNATURE_PATH =
  "M762.44,218.95c-5.19,20.16 -10.17,40.37 -14.96,60.62c-13.39,56.61 -25.4,113.35 -48.2,167.12c-8.57,20.2 -17.06,40.77 -27.87,59.9c-1.66,2.94 -8.22,17.39 -13.61,14.96c-4.8,-2.17 -8.11,-11.61 -9.94,-15.93c-7.95,-18.72 -8.66,-38.96 1.28,-57.18c8.91,-16.33 23.79,-28.59 39.11,-38.64c28.63,-18.8 60.94,-31.7 93.58,-41.67c13.72,-4.19 27.62,-7.76 41.61,-10.94c0.76,-0.17 10.92,-4.7 11.95,-1.65c0.53,1.56 -1.34,1.69 -2.34,1.81c-4.44,0.53 -8.85,1.31 -13.26,2.03c-14.35,2.34 -28.71,4.63 -43.08,6.82c-52.96,8.1 -105.99,17.01 -159.33,22.32c-14.92,1.49 -30,2.94 -45.01,3.14c-1.65,0.02 -10.94,0.8 -9.54,-3.59c1.05,-3.32 5.88,-6.08 8.44,-7.88c10.38,-7.29 21.41,-13.74 32.45,-19.96c48.13,-27.13 98.42,-50.1 147.32,-75.76c15.24,-7.99 30.47,-16.1 45.04,-25.26c1.18,-0.74 12.42,-6.5 9.18,-8.93c-1.88,-1.4 -6.04,-1.65 -8.13,-1.86c-8.33,-0.86 -16.81,-0.13 -25.02,1.4c-32.97,6.12 -61.92,25.71 -87.36,46.64c-53.98,44.4 -101.43,103.66 -112.65,174.46c-5.85,36.9 -0.38,77.24 26.43,105.11c22.54,23.44 56.48,34.77 88.57,29.48c21.18,-3.49 45.72,-16.91 44.49,-41.49c-0.34,-6.88 -1.83,-11.74 -4.56,-18.16c-3.59,-8.45 -7.42,-14.54 -12.9,-22.03c-27.64,-37.74 -69.16,-65.13 -111.41,-83.94c-14.56,-6.48 -29.58,-11.9 -44.84,-16.44c-1.78,-0.53 -12.81,-1.63 -13.77,-4.87c-0.55,-1.86 3.05,-1.09 2.2,-1.25c-0.47,-0.09 2.91,-0.98 4.43,-0.96c5.86,0.09 22.22,1.03 26.52,1.26c36.88,2.04 73.74,4.27 110.64,5.94c106.97,4.84 214.03,7.59 321.08,9.52c48,0.87 96,1.52 144,2.29c1.02,0.02 1.63,1.2 1.05,2.04c-27.51,39.79 -96.74,-0.85 -145.1,-1.73c-107.08,-1.94 -214.16,-4.68 -321.15,-9.53c-36.91,-1.67 -73.76,-3.9 -110.65,-5.94c-6.99,-0.39 -18.69,-1.06 -26.31,-1.26c-0.34,-0.01 -7.58,1.58 -6.68,-1.16c0.58,-1.78 2.86,-0.28 3.75,0.02c2.35,0.79 9.05,2.63 10.77,3.14c15.38,4.58 30.52,10.04 45.18,16.58c46.09,20.54 94.33,52.15 120.34,96.73c3.42,5.86 7.17,14.26 8.82,20.95c6.25,25.43 -12.47,43.73 -35.34,50.57c-44.15,13.21 -94.82,-9.08 -116.55,-49.19c-11.55,-21.33 -15.02,-46.1 -13.42,-70.08c5.52,-82.9 64.43,-154.08 128.23,-202.21c24.61,-18.56 52.78,-34.74 83.91,-38.28c7.7,-0.88 20.02,-2.25 27.1,2.25c6.93,4.4 -6.95,11.57 -9.45,13.15c-14.63,9.2 -29.92,17.33 -45.21,25.35c-40.34,21.17 -81.6,40.52 -121.84,61.89c-15.15,8.05 -30.23,16.26 -44.83,25.28c-6.24,3.86 -14.1,7.91 -19.19,13.39c-1.81,1.95 -0.07,1.59 1.83,1.69c5.64,0.3 11.41,-0.19 17.04,-0.54c15.15,-0.94 30.28,-2.28 45.36,-4c53.13,-6.06 106.03,-14.68 158.86,-22.89c12.01,-1.87 24,-3.89 36.01,-5.79c0.96,-0.15 8.64,-2.9 9.86,-0.46c1.37,2.75 -6.49,3.26 -6.62,3.29c-6.03,1.37 -12.07,2.72 -18.07,4.22c-24.58,6.14 -48.85,13.71 -72.21,23.57c-7.65,3.23 -13.8,6.04 -21.19,9.76c-29.9,15.02 -68.13,37.67 -72.69,74.49c-1.58,12.79 1.68,25.6 7.14,37.12c1.13,2.39 4.28,10.6 7.3,11.52c0.63,0.19 2.43,-2.22 2.67,-2.52c2.11,-2.61 3.92,-5.46 5.63,-8.34c8.03,-13.46 14.39,-27.98 20.71,-42.29c10.19,-23.08 19.92,-46.35 27.49,-70.45c13.79,-43.93 22.73,-89.26 33.58,-133.96c4.39,-18.07 8.83,-36.13 13.6,-54.1c1.54,-5.79 3.3,-11.56 4.64,-17.4c0.41,-1.77 -2.42,19.08 -4.89,28.66z";
const DEFAULT_SIGNATURE_EASING = "cubic-bezier(0.2, 0.2, 0.8, 0.9)";

type SignatureProps = {
  path?: string;
  viewBox?: string;
  size?: number | string;
  strokeWidth?: number;
  duration?: number | string;
  delay?: number | string;
  easing?: string;
  className?: string;
  ariaLabel?: string;
};

function toCssTime(value: number | string) {
  return typeof value === "number" ? `${value}s` : value;
}

export function Signature({
  path = DEFAULT_SIGNATURE_PATH,
  viewBox = "500 150 700 500",
  size = "100%",
  strokeWidth = 10,
  duration = 2.8,
  delay = 0,
  easing = DEFAULT_SIGNATURE_EASING,
  className,
  ariaLabel = "Animated signature",
}: SignatureProps) {
  const width = typeof size === "number" ? `${size}px` : size;
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });

  return (
    <svg
      ref={ref}
      aria-label={ariaLabel}
      className={cn("block overflow-visible", className)}
      role="img"
      style={{ width, height: "auto" }}
      viewBox={viewBox}
    >
      <path
        className={cn("dqnamo-signature-stroke", inView && "animate-signature")}
        d={path}
        pathLength={1}
        style={{
          animationDelay: toCssTime(delay),
          animationDuration: toCssTime(duration),
          animationTimingFunction: easing,
          strokeWidth,
        }}
      />

      <style>{`
        .dqnamo-signature-stroke {
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
        }

        .animate-signature {
          animation-name: dqnamo-draw-signature;
          animation-fill-mode: forwards;
        }

        @keyframes dqnamo-draw-signature {
          to {
            stroke-dashoffset: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-signature {
            animation-duration: 1ms !important;
            animation-delay: 0s !important;
          }
        }
      `}</style>
    </svg>
  );
}

export default Signature;
