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
  if (targetVal === null || targetVal === undefined) {
    return null;
  }

  const percent = Math.round(targetVal * 10) / 10;
  const isPositive = percent > 0;
  const isNegative = percent < 0;

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
        value={Math.abs(percent) / 100}
        format={{
          style: "percent",
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
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
