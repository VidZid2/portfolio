"use client";

import { Layers, Layout } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ProfileBadges() {
  return (
    <div className="absolute bottom-0 right-0 translate-x-0.5 translate-y-0.5 flex items-center gap-1 z-10">
      <TooltipProvider delayDuration={150}>
        <Tooltip>
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

      <TooltipProvider delayDuration={150}>
        <Tooltip>
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
