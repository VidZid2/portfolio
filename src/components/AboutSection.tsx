"use client";

import React, { useEffect, useState } from "react";
import { MotionContainer } from "@/components/motion-container";

export function AboutSection({ hasSeenAboutMe = false }: { hasSeenAboutMe?: boolean }) {
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const dashedMask = {
    maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
    WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  };

  return (
    <div className="relative flex flex-col z-10 w-full">
      {/* Top dashed boundary line */}
      <div
        className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={dashedMask}
      />
      <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

      {/* Greeting Sub-Row (Framed by top & bottom dotted lines) */}
      <div className="relative h-[40px] sm:h-[44px] flex items-center px-3 sm:px-4">
        <MotionContainer delay={0} skipAnimation={hasSeenAboutMe}>
          <h2 className="font-caveat italic text-[24px] sm:text-[28px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide select-none leading-none -mt-0.5">
            {greeting}
          </h2>
        </MotionContainer>

        {/* Horizontal Dotted Divider under Greeting */}
        <div
          className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMask}
        />
        <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </div>

      {/* High-Precision Bulleted List */}
      <div className="flex flex-col gap-3 py-3.5 sm:py-4 px-3 sm:px-4 text-[14px] sm:text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
        <MotionContainer delay={0.08} skipAnimation={hasSeenAboutMe}>
          <div className="flex items-start gap-2.5">
            <span className="text-zinc-400 dark:text-zinc-500 font-bold select-none text-base leading-snug shrink-0">
              •
            </span>
            <p>
              I&apos;m <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">Josiah De Asis</strong> (call me Josiah) — a <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">Full-Stack Front-End Engineer & UI Systems Architect</strong>, known for pixel-perfect execution and an obsessive attention to detail.
            </p>
          </div>
        </MotionContainer>

        <MotionContainer delay={0.16} skipAnimation={hasSeenAboutMe}>
          <div className="flex items-start gap-2.5">
            <span className="text-zinc-400 dark:text-zinc-500 font-bold select-none text-base leading-snug shrink-0">
              •
            </span>
            <p>
              Passionate about exploring new technologies and turning ideas into reality through polished, thoughtfully crafted projects with fluid micro-interactions and tactile sound design.
            </p>
          </div>
        </MotionContainer>

        <MotionContainer delay={0.24} skipAnimation={hasSeenAboutMe}>
          <div className="flex items-start gap-2.5">
            <span className="text-zinc-400 dark:text-zinc-500 font-bold select-none text-base leading-snug shrink-0">
              •
            </span>
            <p>
              Creator of <span className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-4 font-medium text-zinc-900 dark:text-zinc-100">Sync AI</span> (autonomous multi-model reasoning agent), <span className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-4 font-medium text-zinc-900 dark:text-zinc-100">Enterprise ELMS</span>, and high-performance UI systems with mathematical accuracy.
            </p>
          </div>
        </MotionContainer>
      </div>
    </div>
  );
}

