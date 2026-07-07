"use client";

import { useEffect, useState } from "react";
import { Layers, Layout } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";

export function ProfileBadges() {
  const [openTooltip, setOpenTooltip] = useState<"full-stack" | "front-end" | null>(null);
  const [isAutoPhase, setIsAutoPhase] = useState(true);
  const phase = useArcReveal();

  useEffect(() => {
    if (phase !== "done") return;
    // Show first tooltip after the Ask AI tooltip finishes (at 5.5s)
    const timer1 = setTimeout(() => {
      setOpenTooltip("full-stack");
    }, 5500);
    // Hide first tooltip after 5 seconds (at 10.5s)
    const timer2 = setTimeout(() => {
      setOpenTooltip(null);
    }, 10500);
    // Show second tooltip after 11 seconds
    const timer3 = setTimeout(() => {
      setOpenTooltip("front-end");
    }, 11000);
    // Hide second tooltip after 5 seconds (at 16s)
    const timer4 = setTimeout(() => {
      setOpenTooltip(null);
      setIsAutoPhase(false);
    }, 16000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [phase]);

  return (
    <div className="absolute -bottom-2 -right-2 flex items-center gap-1 z-10">
      <TooltipProvider delayDuration={100}>
        <Tooltip 
          open={openTooltip === "full-stack"} 
          onOpenChange={(open) => {
            if (!open && isAutoPhase) return;
            setOpenTooltip(open ? "full-stack" : null);
          }}
        >
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center w-[22px] h-[22px] rounded-full bg-zinc-50 dark:bg-zinc-900 ring-1 ring-inset ring-black/10 dark:ring-white/10 shadow-sm text-[#6495ED] transition-transform hover:scale-110 cursor-help">
              <Layers className="w-3 h-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={4} hideArrow className="px-2 py-1 text-[11px] font-medium rounded-[6px] dark:bg-white dark:text-black animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
            Full-Stack Developer
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={100}>
        <Tooltip 
          open={openTooltip === "front-end"} 
          onOpenChange={(open) => {
            if (!open && isAutoPhase) return;
            setOpenTooltip(open ? "front-end" : null);
          }}
        >
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center w-[22px] h-[22px] rounded-full bg-zinc-50 dark:bg-zinc-900 ring-1 ring-inset ring-black/10 dark:ring-white/10 shadow-sm text-[#6495ED] transition-transform hover:scale-110 cursor-help">
              <Layout className="w-3 h-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={4} hideArrow className="px-2 py-1 text-[11px] font-medium rounded-[6px] dark:bg-white dark:text-black animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
            Front-End Developer
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
