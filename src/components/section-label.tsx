import React from "react";
import ScrambleText from "@/components/ruixen/scramble-text";

interface SectionLabelProps {
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function SectionLabel({ children, action }: SectionLabelProps) {
  return (
    <div className="flex items-center justify-between py-1 relative">
      {typeof children === "string" ? (
        <ScrambleText
          as="h3"
          className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight"
        >
          {children}
        </ScrambleText>
      ) : (
        <div className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {children}
        </div>
      )}
      
      {action && <div className="flex items-center">{action}</div>}
    </div>
  );
}
