import { cn } from "@/lib/utils";

export const CornerMark = ({
  position,
  flush = false,
  className,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  flush?: boolean;
  className?: string;
}) => {
  const isTop = position.includes("top");
  const isLeft = position.includes("left");

  return (
    <div
      className={cn(
        "absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-20",
        isTop ? "top-0 -translate-y-1/2" : "bottom-0 translate-y-1/2",
        flush
          ? isLeft
            ? "left-0 -translate-x-1/2"
            : "right-0 translate-x-1/2"
          : isLeft
          ? "-left-3 sm:-left-4 -translate-x-1/2"
          : "-right-3 sm:-right-4 translate-x-1/2",
        className
      )}
    />
  );
};
