"use client";

import { useEffect, useState } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";

function TwoDots() {
  return (
    <div className="mx-0.5 sm:mx-1 flex flex-col gap-1.5 -translate-x-[1px]">
      <div className="w-[2.5px] h-[2.5px] rounded-full bg-blue-600 dark:bg-[#6495ED] shadow-[0_0_4px_rgba(100,149,237,0.6)]"></div>
      <div className="w-[2.5px] h-[2.5px] rounded-full bg-blue-600 dark:bg-[#6495ED] shadow-[0_0_4px_rgba(100,149,237,0.6)]"></div>
    </div>
  );
}

export function CurrentTime() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setTime(new Date()), 0);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      window.clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);

  if (!time) {
    return (
      <div className="inline-flex items-center opacity-0 h-[28px]">
        <div 
          className="text-[16px] sm:text-[18px] tracking-[0.15em] text-blue-600 dark:text-[#6495ED]" 
          style={{ fontFamily: 'var(--font-doto), monospace', fontWeight: 700 }}
        >
          00.00.00
        </div>
      </div>
    );
  }

  const hoursRaw = time.getHours();
  const ampm = hoursRaw >= 12 ? 'PM' : 'AM';
  const hours12 = hoursRaw % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-black/10 dark:border-white/15 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] select-none transition-colors duration-200">
      {/* Subtle Live Status Indicator */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6495ED] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-[#6495ED]"></span>
      </span>

      <div 
        className="text-[15px] sm:text-[17px] tracking-[0.14em] flex items-center leading-none text-blue-600 dark:text-[#6495ED] font-bold" 
        style={{ 
          fontFamily: 'var(--font-doto), monospace', 
          textShadow: '0 0 8px rgba(100, 149, 237, 0.35)' 
        }}
      >
        <NumberTicker value={hours12} pad={2} />
        <TwoDots />
        <NumberTicker value={minutes} pad={2} />
        <TwoDots />
        <NumberTicker value={seconds} pad={2} />
        <span className="ml-1.5 text-[11px] sm:text-[12px] font-sans font-semibold tracking-wider text-zinc-500 dark:text-zinc-400">
          {ampm}
        </span>
      </div>
    </div>
  );
}
