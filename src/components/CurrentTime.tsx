"use client";

import { useEffect, useState } from "react";

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

  const hStr = String(hours12).padStart(2, "0");
  const mStr = String(minutes).padStart(2, "0");
  const sStr = String(seconds).padStart(2, "0");

  return (
    <div className="flex items-center h-[26px] px-2 py-0.5 rounded-md bg-white/95 dark:bg-[#0a0a0a]/90 border border-black/10 dark:border-white/15 shadow-sm select-none">
      <div 
        className="text-[18px] sm:text-[22px] tracking-[0.12em] flex items-center h-full text-blue-600 dark:text-[#6495ED] font-bold tabular-nums" 
        style={{ fontFamily: 'var(--font-doto), monospace', fontWeight: 700 }}
      >
        <span>{hStr}</span>
        <TwoDots />
        <span>{mStr}</span>
        <TwoDots />
        <span>{sStr}</span>
        <span className="ml-1.5 text-[11px] sm:text-[13px] tracking-normal font-semibold opacity-90">{ampm}</span>
      </div>
    </div>
  );
}
