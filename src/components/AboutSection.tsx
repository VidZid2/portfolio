"use client";

import { MotionContainer } from "@/components/motion-container";

export function AboutSection({ hasSeenAboutMe }: { hasSeenAboutMe: boolean }) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <MotionContainer delay={0} skipAnimation={hasSeenAboutMe}>
        <p className="text-[14px] sm:text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
          I am a front-end engineer and BS Information Technology student at STI College Meycauayan specializing in component architecture, interactive systems, and high-performance web applications.
        </p>
      </MotionContainer>

      <MotionContainer delay={0.1} skipAnimation={hasSeenAboutMe}>
        <p className="text-[14px] sm:text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Driven by an obsession with micro-interactions, sound design, and fluid motion, I build production-ready digital products with React, Next.js, and TypeScript. I focus heavily on scalable software design patterns, strict performance budgets, and creating interfaces that feel alive and responsive.
        </p>
      </MotionContainer>
    </div>
  );
}
