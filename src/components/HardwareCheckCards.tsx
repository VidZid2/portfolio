"use client";

import { Database, Cpu, Battery } from "lucide-react";

export function HardwareCheckCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4 my-6">
      {/* Memory Check */}
      <div className="w-full">
        <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 flex flex-col items-center text-center relative overflow-hidden group">
          <Database className="w-5 h-5 text-red-500/70 mb-2" />
          <span className="text-[11px] uppercase tracking-wider font-bold text-red-500/70 mb-1">Memory Check</span>
          <span className="text-sm font-medium text-red-700 dark:text-red-300">&lt; 4GB RAM</span>
        </div>
      </div>

      {/* Processor Check */}
      <div className="w-full">
        <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 flex flex-col items-center text-center relative overflow-hidden group">
          <Cpu className="w-5 h-5 text-red-500/70 mb-2" />
          <span className="text-[11px] uppercase tracking-wider font-bold text-red-500/70 mb-1">Processor Check</span>
          <span className="text-sm font-medium text-red-700 dark:text-red-300">&lt; 4 Cores</span>
        </div>
      </div>

      {/* Power State */}
      <div className="w-full">
        <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 flex flex-col items-center text-center relative overflow-hidden group">
          <Battery className="w-5 h-5 text-red-500/70 mb-2" />
          <span className="text-[11px] uppercase tracking-wider font-bold text-red-500/70 mb-1">Power State</span>
          <span className="text-sm font-medium text-red-700 dark:text-red-300">Battery Saver ON</span>
        </div>
      </div>
    </div>
  );
}
