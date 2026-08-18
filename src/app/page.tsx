"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Signature } from "@/components/Signature";
import { GithubGraph } from "@/components/GithubGraph";
import { ExperienceSection } from "@/components/ExperienceSection";
import { OpenSourceContributions } from "@/components/OpenSourceContributions";
import { FooterBackground } from "@/components/FooterBackground";
import { CommandMenu } from "@/components/command-menu";
import { ProfilePictureScramble } from "@/components/ProfilePictureScramble";
import { TextReveal } from "@/components/text-reveal";
import { LetsConnect } from "@/components/LetsConnect";
import { SocialsSection } from "@/components/SocialsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ComponentsSection } from "@/components/ComponentsSection";
import { BlogsSection } from "@/components/BlogsSection";
import { AboutSection } from "@/components/AboutSection";
import { GoalMilestoneSection } from "@/components/GoalMilestoneSection";
import { SwirlQuote } from "@/components/swirl/SwirlQuote";
import { SwirlBackground } from "@/components/swirl/SwirlBackground";
import { GlobalBootSequence } from "@/components/GlobalBootSequence";
import { BlueprintGrid } from "@/components/BlueprintGrid";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Home() {
  const [hasPlayed, setHasPlayed] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const played = sessionStorage.getItem("portfolio_animations_played_v3");
      if (played) {
        setHasPlayed(true);
      } else {
        sessionStorage.setItem("portfolio_animations_played_v3", "true");
      }
    }
  }, []);

  return (
    <GlobalBootSequence>
      <BlueprintGrid
        headerSlot={
          /* Cell 2: Profile Section - 112px height to wrap the framed image (13px gap top/bottom) */
          <div className="absolute left-0 right-0 md:left-[26%] md:right-[26%] top-[22vh] h-[112px] flex items-center px-2 sm:px-4 z-50 hide-cursor-particles">
            <SwirlBackground />
            <div className="flex w-full items-center justify-between relative z-10 pointer-events-none">
              <div className="flex items-center gap-1.5 min-[360px]:gap-3 sm:gap-5 pointer-events-auto">
                <ProfilePictureScramble />

                <div className="flex flex-col justify-center pt-4 min-[360px]:pt-8">
                  <h1 className="whitespace-nowrap text-[16px] min-[360px]:text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1px_0_0_rgba(0,200,255,0.15),1px_0_0_rgba(255,80,0,0.15)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.25),1.5px_0_0_rgba(255,80,0,0.25)]">
                    Josiah De Asis
                  </h1>
                  <div className="flex flex-nowrap items-center gap-1 sm:gap-2 mt-0.5">
                    <p className="text-[11px] min-[360px]:text-[13px] sm:text-[14px] text-zinc-500 dark:text-zinc-400 shrink-0">20</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top-right absolute buttons container */}
            <div className="absolute top-1.5 right-2 sm:top-3 sm:right-4 flex items-center gap-1.5 sm:gap-3 pointer-events-auto z-20">
              <CommandMenu />
              <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300 shrink-0" />
            </div>
          </div>
        }
      >
        {/* Flowing Content Section */}
        <div className="ml-0 mr-0 md:ml-[26%] md:mr-[26%] pt-[calc(22vh+112px)] pb-0 px-4 flex flex-col z-10 relative min-h-screen">
          {/* About Me Section */}
          <AboutSection key={`about-${hasPlayed}`} hasSeenAboutMe={hasPlayed} />

          {/* Buttons Section */}
          <div className="mt-8 flex flex-col relative z-10 py-6">
            {/* Top full-width line */}
            <div
              className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
              style={{
                maskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                WebkitMaskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              }}
            />
            {/* Top Line Intersections */}
            <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

            <LetsConnect key={`connect-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

            {/* Bottom full-width line */}
            <div
              className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
              style={{
                maskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                WebkitMaskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              }}
            />
            {/* Bottom Line Intersections */}
            <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          </div>

          {/* Socials */}
          <SocialsSection key={`socials-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />
          <GoalMilestoneSection key={`goals-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />
          <ExperienceSection key={`exp-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />
          <ProjectsSection key={`projects-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

          {/* Github Graph */}
          <GithubGraph key={`github-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

          {/* Open Source Contributions */}
          <div id="opensource" className="scroll-mt-24">
            <OpenSourceContributions key={`oss-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />
          </div>

          <SkillsSection key={`skills-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

          <ComponentsSection key={`components-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

          <BlogsSection key={`blogs-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

          {/* Fading Grid Filler */}
          <div className="flex-grow w-[calc(100%+32px)] -mx-4 h-[400px] relative mt-0 overflow-hidden">
            {/* Top full-width line */}
            <div
              className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
              style={{
                maskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                WebkitMaskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              }}
            />
            {/* Intersections */}
            <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute top-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

            {/* Quote Footer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 select-none px-6 text-center">
              {/* Signature above Quote */}
              <div className="z-10 mb-6 md:mb-8 translate-x-8 md:translate-x-12">
                <div className="w-32 sm:w-48 text-zinc-400 dark:text-zinc-600">
                  <Signature duration={2.5} strokeWidth={6} delay={3} />
                </div>
              </div>

              <div className="relative flex items-center justify-center w-full max-w-2xl">
                <p className="text-xl md:text-2xl font-medium tracking-tight text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                  <TextReveal
                    text="Life is not a race. It's a journey you take at your own pace. Trust your timing, keep building, and remember that the most meaningful work takes time to grow."
                    delay={0.5}
                    stagger={0.015}
                    whileInView={true}
                    once={false}
                  />
                </p>
              </div>
            </div>

            <FooterBackground />
          </div>

          {/* Swirl Quote Section */}
          <div className="mt-4 hide-cursor-particles">
            <SwirlQuote />
          </div>
        </div>
      </BlueprintGrid>
    </GlobalBootSequence>
  );
}
