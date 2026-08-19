import { cn } from "@/lib/utils";

interface Props {
  max?: number;
  value?: number;
  min?: number;
  gaugePrimaryColor: string;
  gaugeSecondaryColor: string;
  className?: string;
  showPercentText?: boolean;
}

export function AnimatedCircularProgressBar({
  max = 100,
  min = 0,
  value = 0,
  gaugePrimaryColor,
  gaugeSecondaryColor,
  className,
  showPercentText = false,
}: Props) {
  const circumference = 2 * Math.PI * 45;
  const percentPx = circumference / 100;
  const currentPercent = Math.round(((value - min) / (max - min)) * 100);

  return (
    <div
      className={cn("relative size-40 text-2xl font-semibold", className)}
      style={
        {
          "--circle-size": "100px",
          "--circumference": `${circumference}`,
          "--percent-to-px": `${percentPx}px`,
          "--gap-percent": "5",
          "--offset-factor": "0",
          "--transition-length": "0.6s",
          "--transition-step": "200ms",
          "--delay": "0s",
          "--percent-to-deg": "3.6deg",
          transform: "translateZ(0)",
        } as React.CSSProperties
      }
    >
      <svg
        fill="none"
        className="size-full"
        strokeWidth="2"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          strokeWidth="10"
          strokeDashoffset="0"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-100"
          style={
            {
              stroke: gaugeSecondaryColor,
              strokeDasharray: `${circumference} ${circumference}`,
            } as React.CSSProperties
          }
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          strokeWidth="10"
          strokeDashoffset="0"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-100 transition-[stroke-dasharray,stroke] duration-500 ease-out"
          style={
            {
              stroke: gaugePrimaryColor,
              "--stroke-percent": currentPercent,
              strokeDasharray:
                "calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)",
              transform: "rotate(-90deg)",
              transformOrigin: "50px 50px",
            } as React.CSSProperties
          }
        />
      </svg>
      {showPercentText && (
        <span
          data-current-value={currentPercent}
          className="absolute inset-0 m-auto size-fit font-semibold"
        >
          {currentPercent}%
        </span>
      )}
    </div>
  );
}

export default AnimatedCircularProgressBar;
