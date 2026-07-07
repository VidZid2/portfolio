import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MetricBar({
  label,
  value,
  info,
  invert,
  animationKey,
}: {
  label: string;
  value: number; // 1 to 10
  info?: string;
  invert?: boolean;
  animationKey?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-[11px] font-medium leading-none text-zinc-500">
        <span>{label}</span>
        {info && <span>{info}</span>}
      </div>
      <div className="flex gap-[2px] w-full">
        {Array.from({ length: 10 }).map((_, i) => {
          const filled = invert ? 10 - value <= i : i < value;
          return (
            <motion.div
              key={`${animationKey}-${i}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "h-1.5 flex-1 rounded-[1px]",
                filled ? "bg-[#6495ED]" : "bg-zinc-200 dark:bg-zinc-800"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
