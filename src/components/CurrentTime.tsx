"use client";

import { useEffect, useState } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";

function TwoDots() {
  return (
    <div className="mx-0.5 sm:mx-1 flex flex-col gap-1.5 -translate-y-[1px]">
      <div className="w-[2px] h-[2px] rounded-full bg-blue-600 dark:bg-[#6495ED]"></div>
      <div className="w-[2px] h-[2px] rounded-full bg-blue-600 dark:bg-[#6495ED]"></div>
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
      <div className="flex items-center opacity-0">
        <div 
          className="text-[18px] sm:text-[22px] tracking-[0.12em] text-blue-600 dark:text-[#6495ED]" 
          style={{ fontFamily: 'var(--font-doto), monospace', fontWeight: 700 }}
        >
          00:00:00
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
    <div className="flex items-center h-[26px] px-2 py-0.5 rounded-md bg-white/70 dark:bg-black/60 backdrop-blur-sm border border-black/5 dark:border-white/10 shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.4)]">
      <div 
        className="text-[18px] sm:text-[22px] tracking-[0.12em] flex items-center h-full text-blue-600 dark:text-[#6495ED] font-bold select-none" 
        style={{ fontFamily: 'var(--font-doto), monospace', fontWeight: 700 }}
      >
        <NumberTicker value={hours12} pad={2} fade={false} />
        <TwoDots />
        <NumberTicker value={minutes} pad={2} fade={false} />
        <TwoDots />
        <NumberTicker value={seconds} pad={2} fade={false} />
        <span className="ml-1.5 text-[11px] sm:text-[13px] tracking-normal font-semibold opacity-90">{ampm}</span>
      </div>
    </div>
  );
}
