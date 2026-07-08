"use client";

import { useEffect, useState } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";

function TwoDots() {
  return (
    <div className="mx-0.5 sm:mx-1 flex flex-col gap-2 -translate-x-[2px] sm:-translate-x-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
      <div className="w-[2px] h-[2px]" style={{ backgroundColor: '#6495ED' }}></div>
      <div className="w-[2px] h-[2px]" style={{ backgroundColor: '#6495ED' }}></div>
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
          className="text-[20px] sm:text-[24px] tracking-[0.15em]" 
          style={{ fontFamily: '"Doto", monospace', fontWeight: 700, color: '#6495ED' }}
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
    <div className="flex items-center h-[24px]">
      <div 
        className="text-[20px] sm:text-[24px] tracking-[0.15em] flex items-center h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" 
        style={{ fontFamily: '"Doto", monospace', fontWeight: 700, color: '#6495ED' }}
      >
        <NumberTicker value={hours12} pad={2} />
        <TwoDots />
        <NumberTicker value={minutes} pad={2} />
        <TwoDots />
        <NumberTicker value={seconds} pad={2} />
        <span className="ml-1.5 text-[12px] sm:text-[14px] tracking-normal opacity-80">{ampm}</span>
      </div>
    </div>
  );
}
