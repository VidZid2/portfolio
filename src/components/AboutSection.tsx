"use client";

import { MotionContainer } from "@/components/motion-container";

export function AboutSection({ hasSeenAboutMe }: { hasSeenAboutMe: boolean }) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <MotionContainer delay={0} skipAnimation={hasSeenAboutMe}>
        <p className="text-[14px] sm:text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
          I am a first-year BS Information Technology student at STI College Meycauayan with an intense passion for front-end development. Early on, I realized that to truly stand out and help others, I needed to go beyond the standard classroom curriculum.
        </p>
      </MotionContainer>

      <MotionContainer delay={0.1} skipAnimation={hasSeenAboutMe}>
        <p className="text-[14px] sm:text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
          I've dedicated countless hours after classes to learning React, TypeScript, and modern frameworks. By integrating AI coding assistants into my workflow as mentors, I've been able to focus deeply on software architecture—allowing me to build digital products that feel alive and solve real problems for my clients.
        </p>
      </MotionContainer>
    </div>
  );
}
