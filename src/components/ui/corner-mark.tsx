import { cn } from "@/lib/utils";

export const CornerMark = ({
  position,
  className,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) => {
  const isTop = position.includes("top");
  const isLeft = position.includes("left");

  return (
    <div
      className={cn(
        "absolute hidden h-1.5 w-1.5 bg-transparent sm:block pointer-events-none z-20",
        isTop ? "top-0" : "bottom-0",
        isLeft ? "-left-3 sm:-left-4" : "-right-3 sm:-right-4",
        isTop && isLeft && "border-l border-t border-foreground/30",
        isTop && !isLeft && "border-r border-t border-foreground/30",
        !isTop && isLeft && "border-l border-b border-foreground/30",
        !isTop && !isLeft && "border-r border-b border-foreground/30",
        className
      )}
    />
  );
};
