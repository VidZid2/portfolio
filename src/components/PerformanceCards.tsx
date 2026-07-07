"use client";

import { Trash2, Zap, Scissors } from "lucide-react";

export function PerformanceCards() {
  return (
    <div className="flex flex-col gap-4 my-8">
      {/* Rose — blur removal */}
      <div className="w-full">
        <div className="flex items-start gap-4 p-4 rounded-lg bg-rose-500/5 border border-rose-500/10 transition-colors hover:bg-rose-500/10">
          <div className="mt-0.5 shrink-0 p-2 bg-rose-500/10 dark:bg-rose-500/20 rounded-md text-rose-600 dark:text-rose-400">
            <Trash2 className="w-4 h-4" />
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            I frantically stripped out the computationally expensive <code className="text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded text-[13px] font-mono">blur-[80px]</code> ambient glows across the site.
          </p>
        </div>
      </div>

      {/* Emerald — mask-image replacement */}
      <div className="w-full">
        <div className="flex items-start gap-4 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 transition-colors hover:bg-emerald-500/10">
          <div className="mt-0.5 shrink-0 p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-md text-emerald-600 dark:text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            I replaced them with hardware-accelerated <code className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[13px] font-mono">mask-image: linear-gradient</code> fading and GPU-friendly radial gradients.
          </p>
        </div>
      </div>

      {/* Amber — conveyor belt */}
      <div className="w-full">
        <div className="flex items-start gap-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 transition-colors hover:bg-amber-500/10">
          <div className="mt-0.5 shrink-0 p-2 bg-amber-500/10 dark:bg-amber-500/20 rounded-md text-amber-600 dark:text-amber-400">
            <Scissors className="w-4 h-4" />
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            For the infinite logo conveyor belt, I completely removed opacity gradients and utilized a pure CSS <code className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded text-[13px] font-mono">mask-image</code> cookie-cutter approach.
          </p>
        </div>
      </div>
    </div>
  );
}
