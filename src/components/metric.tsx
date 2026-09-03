"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";

export function Metric({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="metric"
      className={cn(
        // `justify-between` keeps values aligned across a row when a label
        // wraps to two lines in a narrow column.
        "flex flex-col justify-between gap-2 p-4",
        className
      )}
      {...props}
    />
  );
}

export function MetricLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <dt
      data-slot="metric-label"
      className={cn(
        "flex items-center justify-between gap-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal leading-none",
        className
      )}
      {...props}
    />
  );
}

export type MetricChangeProps = {
  /**
   * Percentage change against the previous period, e.g. `12.4` for `+12.4%`.
   * `null` when there is no previous period to compare against.
   */
  value: number | null | undefined;
  fallbackValue?: number;
};

/**
 * Renders increase (green ↗) or decrease (red ↘) percentage badge matching analytics standard with NumberFlow ticker animation.
 */
export function MetricChange({ value, fallbackValue }: MetricChangeProps) {
  const targetVal = value ?? fallbackValue;
  const [animatedVal, setAnimatedVal] = useState<number>(0);

  const percent = targetVal !== null && targetVal !== undefined ? Math.round(targetVal * 10) / 10 : null;
  const isPositive = percent !== null && percent > 0;
  const isNegative = percent !== null && percent < 0;

  useEffect(() => {
    if (percent === null) return;
    // Animate from 0 to target percentage to play the signature NumberFlow tick roll
    const timer = setTimeout(() => {
      setAnimatedVal(Math.abs(percent) / 100);
    }, 60);

    return () => clearTimeout(timer);
  }, [percent]);

  if (targetVal === null || targetVal === undefined || percent === null) {
    return null;
  }

  return (
    <span
      data-slot="metric-change"
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 text-[11px] sm:text-xs font-semibold tabular-nums leading-none tracking-tight transition-colors duration-300",
        isPositive && "text-emerald-600 dark:text-emerald-400",
        isNegative && "text-rose-600 dark:text-rose-400",
        !isPositive && !isNegative && "text-zinc-500 dark:text-zinc-400"
      )}
    >
      {isPositive && <ArrowUpRight className="size-3.5 stroke-[2.2]" aria-hidden="true" />}
      {isNegative && <ArrowDownRight className="size-3.5 stroke-[2.2]" aria-hidden="true" />}
      <NumberFlow
        value={animatedVal}
        format={{
          style: "percent",
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }}
        spinTiming={{
          duration: 700,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        transformTiming={{
          duration: 700,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      <span className="sr-only">
        {isPositive ? "Up by " : isNegative ? "Down by " : "No change "}
        {Math.abs(percent)}% compared to the previous period
      </span>
    </span>
  );
}

export function MetricValue({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <dd
      data-slot="metric-value"
      className={cn(
        "text-lg leading-none font-semibold tabular-nums",
        className
      )}
      {...props}
    />
  );
}
