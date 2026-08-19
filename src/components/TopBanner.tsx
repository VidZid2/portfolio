"use client";

import React from "react";
import Image from "next/image";
import { BannerParticles } from "@/components/BannerParticles";
import { CurrentTime } from "@/components/CurrentTime";

export function TopBanner() {
  return (
    <div className="absolute left-0 right-0 md:left-[26%] md:right-[26%] top-0 h-[22vh] -z-0 pointer-events-auto overflow-hidden bg-white dark:bg-black shadow-[0_4px_12px_rgba(2,6,23,0.04)] dark:shadow-[0_4px_12px_rgba(2,6,23,0.10)]">
      <Image
        src="/light-mode.png"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 70vw, 520px"
        quality={60}
        className="object-cover object-center dark:hidden"
      />
      <Image
        src="/dark-mode.png"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 70vw, 520px"
        quality={60}
        className="hidden object-cover object-center dark:block"
      />
      <BannerParticles />
      <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none z-[5] bg-gradient-to-t from-white to-transparent dark:from-black dark:to-black/0" />
      <div className="absolute inset-x-0 top-0 h-16 pointer-events-none z-[5] bg-gradient-to-b from-white to-transparent dark:from-black dark:to-black/0" />
      <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-20 bg-gradient-to-r from-white to-transparent dark:from-black dark:to-black/0" />
      <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-20 bg-gradient-to-l from-white to-transparent dark:from-black dark:to-black/0" />
      <div className="absolute bottom-3 right-2 z-30 pointer-events-auto">
         <CurrentTime />
      </div>
    </div>
  );
}
