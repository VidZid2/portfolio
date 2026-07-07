"use client";

import { AsciiText } from "@/components/ui/ascii-text";

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* 4 Days Dev Sprint */}
      <div className="p-6 rounded-lg border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center min-h-[140px]">
        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          <AsciiText text="4 Days" delay={0} duration={800} />
        </div>
        <div className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
          <AsciiText text="DEV SPRINT" delay={200} />
        </div>
      </div>

      {/* 21,687 Lines */}
      <div className="p-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden group">
        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
          <AsciiText text="21,687" delay={400} duration={1200} />
        </div>
        <div className="text-xs uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400/70 font-medium">
          <AsciiText text="LINES OF CODE" delay={600} />
        </div>
      </div>

      {/* 100 Source Files */}
      <div className="p-6 rounded-lg border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center min-h-[140px]">
        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          <AsciiText text="100" delay={800} duration={800} />
        </div>
        <div className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
          <AsciiText text="SOURCE FILES" delay={1000} />
        </div>
      </div>
    </div>
  );
}
