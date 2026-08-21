"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { LayoutGroup } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Signature } from "@/components/Signature";
import { GithubGraph } from "@/components/GithubGraph";
import { ExperienceSection } from "@/components/ExperienceSection";
import { EducationSection } from "@/components/EducationSection";
import { OpenSourceContributions } from "@/components/OpenSourceContributions";
import { FooterBackground } from "@/components/FooterBackground";
import { CommandMenu } from "@/components/command-menu";
import { ProfilePictureScramble } from "@/components/ProfilePictureScramble";
import { TextReveal } from "@/components/text-reveal";
import { LetsConnect } from "@/components/LetsConnect";
import { ProjectsSection } from "@/components/ProjectsSection";
import { InsightsSection } from "@/components/InsightsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ComponentsSection } from "@/components/ComponentsSection";
import { BlogsSection } from "@/components/BlogsSection";
import { AboutSection } from "@/components/AboutSection";
import { SupportedBySection } from "@/components/SupportedBySection";
import { CommunitySupportSection } from "@/components/CommunitySupportSection";
import { GoalMilestoneSection } from "@/components/GoalMilestoneSection";
import { ColophonSection } from "@/components/ColophonSection";
import { SwirlQuote } from "@/components/swirl/SwirlQuote";
import { SwirlBackground } from "@/components/swirl/SwirlBackground";
import { GlobalBootSequence } from "@/components/GlobalBootSequence";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { ProfileDetailsGrid } from "@/components/ProfileDetailsGrid";
import { Volume2 } from "lucide-react";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { FogTextReveal } from "@/components/sora-ui/texts/fog-text-reveal";
import { playSoftClick } from "@/lib/synth-sounds";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const DOT_MASK_VERTICAL = {
  maskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
};

const DOT_MASK_HORIZONTAL = {
  maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
};

const DIAGONAL_HATCH_PATTERN = {
  backgroundImage:
    "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(120, 120, 120, 0.15) 5px, rgba(120, 120, 120, 0.15) 6px)",
};

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
        showRightNavbar={false}
        headerSlot={
          /* Cell 2: Profile Section - 112px height with mathematical dotted grid sub-cells */
          <div className="absolute left-3 right-3 sm:left-4 sm:right-4 md:left-[24.5%] md:right-[24.5%] top-[22vh] h-[112px] flex z-50 hide-cursor-particles">
            {/* 1. Left Avatar Box (Framed by Dotted Lines with Diagonal Hatch Background) */}
            <div className="w-[84px] min-[360px]:w-[96px] sm:w-[112px] h-[112px] shrink-0 flex items-center justify-center relative overflow-hidden">
              {/* Diagonal Slanted Blueprint Hatch Pattern */}
              <div
                className="absolute inset-0 pointer-events-none opacity-70 dark:opacity-40"
                style={DIAGONAL_HATCH_PATTERN}
              />

              <div className="relative z-10">
                <ProfilePictureScramble />
              </div>

              {/* Vertical Dotted Divider Line */}
              <div
                className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
                style={DOT_MASK_VERTICAL}
              />
              {/* Intersection Nodes */}
              <div className="absolute top-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
              <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            </div>

            {/* 2. Right Content Column (With Dotted Sub-Row Dividers & WebGL Swirl) */}
            <div className="flex-1 h-[112px] relative flex flex-col justify-between overflow-visible">
              <SwirlBackground />

              {/* Sub-row 1: Top Action Buttons (36px) */}
              <div className="h-[36px] flex items-center justify-end px-2 sm:px-4 relative z-20 pointer-events-auto">
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300 shrink-0" />
                  <CommandMenu />
                </div>
                {/* Horizontal Dotted Divider under Buttons */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
                  style={DOT_MASK_HORIZONTAL}
                />
                <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
                <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
              </div>

              {/* Sub-row 2: Name & Badge (42px) */}
              <div className="h-[42px] flex items-center px-2.5 sm:px-4 relative z-20 pointer-events-auto">
                <div className="flex items-center gap-1">
                  <h1 className="whitespace-nowrap text-[17px] min-[360px]:text-[20px] sm:text-[24px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-0.5">
                    Josiah De Asis
                  </h1>
                  <VerifiedBadge size={20} tone="brand" variant="shimmer" className="shrink-0 text-[#6495ED]" />
                  <button
                    type="button"
                    onClick={() => {
                      playSoftClick(0.04);
                      if (typeof window !== "undefined" && "speechSynthesis" in window) {
                        const utterance = new SpeechSynthesisUtterance("Josiah De Asis");
                        utterance.rate = 0.9;
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="p-0.5 rounded text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors inline-flex items-center justify-center"
                    aria-label="Pronounce name"
                  >
                    <Volume2 className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
                {/* Horizontal Dotted Divider under Name */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
                  style={DOT_MASK_HORIZONTAL}
                />
                <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
                <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
              </div>

              {/* Sub-row 3: Tagline with FogTextReveal (34px, 2s lifespan) */}
              <div className="h-[34px] flex items-center px-2.5 sm:px-4 relative z-20 overflow-hidden">
                <FogTextReveal
                  holdDuration={5200}
                  transitionDuration={0.55}
                  loop={true}
                  maxBlur={14}
                  startOnView={true}
                  className="text-[11px] min-[360px]:text-[12px] sm:text-[13px] text-zinc-500 dark:text-zinc-400 font-mono leading-none"
                  text={[
                    "Building what I love, one line at a time.",
                    "Crafting digital experiences with soul.",
                    "Curious by nature. Driven by passion.",
                    "Turning bold ideas into real software.",
                    "Small details make all the difference.",
                  ]}
                />
              </div>
            </div>
          </div>
        }
      >
        {/* Flowing Content Section */}
        <LayoutGroup id="flowing-sections">
          <div className="ml-3 mr-3 sm:ml-4 sm:mr-4 md:ml-[24.5%] md:mr-[24.5%] pt-[calc(22vh+112px)] pb-0 px-3 sm:px-4 flex flex-col z-10 relative min-h-screen">
            {/* 1. Profile 2-Column Details Grid + Let's Connect + Socials */}
            <ProfileDetailsGrid hasSeenScrollAnimations={hasPlayed} />

            {/* 2. Github Activity (Matching Reference Picture 1) */}
            <GithubGraph key={`github-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

            {/* 3. About Me Section (Matching Reference Picture 2) */}
            <AboutSection key={`about-${hasPlayed}`} hasSeenAboutMe={hasPlayed} />

            {/* 4. Supported By Section (Special Thanks & Component Inspirations) */}
            <SupportedBySection key={`supported-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

            {/* 5. Components Section */}
            <ComponentsSection key={`components-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

            {/* 6. Blogs Section */}
            <BlogsSection key={`blogs-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

            {/* 7. Skills & Technologies Section (Stack) */}
            <SkillsSection key={`skills-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

            {/* Blueprint Diagonal Slanted Line Spacer 1 (Between Stack and Experiences) */}
            <div className="relative h-6 sm:h-8 my-0">
              {/* Slanted diagonal hatch pattern spanning full width across the margins */}
              <div
                className="absolute inset-y-0 left-[-100vw] right-[-100vw] pointer-events-none opacity-40 dark:opacity-20"
                style={DIAGONAL_HATCH_PATTERN}
              />
              {/* Left & Right continuous vertical dotted boundary lines */}
              <div
                className="absolute top-0 bottom-0 -left-3 sm:-left-4 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-20"
                style={DOT_MASK_VERTICAL}
              />
              <div
                className="absolute top-0 bottom-0 -right-3 sm:-right-4 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-20"
                style={DOT_MASK_VERTICAL}
              />
            </div>

            {/* 8. Experience Section */}
            <ExperienceSection key={`exp-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

            {/* 9. Education Section */}
            <EducationSection key={`edu-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

            {/* 10. Milestone Goals Section */}
            <GoalMilestoneSection key={`goals-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

            {/* 11. Projects, Open Source */}
            <ProjectsSection key={`projects-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

            {/* Blueprint Diagonal Slanted Line Spacer (Between Projects and Insights Section) */}
            <div className="relative h-6 sm:h-8 my-0">
              {/* Slanted diagonal hatch pattern spanning full width across the margins */}
              <div
                className="absolute inset-y-0 left-[-100vw] right-[-100vw] pointer-events-none opacity-40 dark:opacity-20"
                style={DIAGONAL_HATCH_PATTERN}
              />
              {/* Left & Right continuous vertical dotted boundary lines */}
              <div
                className="absolute top-0 bottom-0 -left-3 sm:-left-4 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-20"
                style={DOT_MASK_VERTICAL}
              />
              <div
                className="absolute top-0 bottom-0 -right-3 sm:-right-4 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-20"
                style={DOT_MASK_VERTICAL}
              />
            </div>

            {/* 12. Insights / Viewers Section */}
            <InsightsSection key={`insights-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

            {/* Blueprint Diagonal Slanted Line Spacer (Between Insights and Community Support Section) */}
            <div className="relative h-6 sm:h-8 my-0">
              {/* Slanted diagonal hatch pattern spanning full width across the margins */}
              <div
                className="absolute inset-y-0 left-[-100vw] right-[-100vw] pointer-events-none opacity-40 dark:opacity-20"
                style={DIAGONAL_HATCH_PATTERN}
              />
              {/* Left & Right continuous vertical dotted boundary lines */}
              <div
                className="absolute top-0 bottom-0 -left-3 sm:-left-4 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-20"
                style={DOT_MASK_VERTICAL}
              />
              <div
                className="absolute top-0 bottom-0 -right-3 sm:-right-4 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-20"
                style={DOT_MASK_VERTICAL}
              />
            </div>

            {/* 13. Backed by the Community / Support Section */}
            <CommunitySupportSection key={`support-${hasPlayed}`} hasSeenScrollAnimations={hasPlayed} />

            {/* Blueprint Diagonal Slanted Line Spacer (Between Community Support and Motivation Section) */}
            <div className="relative h-6 sm:h-8 my-0">
              {/* Slanted diagonal hatch pattern spanning full width across the margins */}
              <div
                className="absolute inset-y-0 left-[-100vw] right-[-100vw] pointer-events-none opacity-40 dark:opacity-20"
                style={DIAGONAL_HATCH_PATTERN}
              />
              {/* Left & Right continuous vertical dotted boundary lines */}
              <div
                className="absolute top-0 bottom-0 -left-3 sm:-left-4 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-20"
                style={DOT_MASK_VERTICAL}
              />
              <div
                className="absolute top-0 bottom-0 -right-3 sm:-right-4 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-20"
                style={DOT_MASK_VERTICAL}
              />
              {/* Bottom full-width line */}
              <div
                className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
                style={DOT_MASK_HORIZONTAL}
              />
              {/* Bottom Line Intersections */}
              <div className="absolute bottom-0 -left-3 sm:-left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
              <div className="absolute bottom-0 -right-3 sm:-right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            </div>

            {/* Fading Grid Filler */}
            <div className="flex-grow w-[calc(100%+24px)] -mx-3 sm:w-[calc(100%+32px)] sm:-mx-4 h-[400px] relative mt-0 overflow-hidden">
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

            {/* Colophon & Portfolio Metadata Table */}
            <ColophonSection />

            {/* Swirl Quote Section */}
            <div className="mt-0 hide-cursor-particles">
              <SwirlQuote />
            </div>
          </div>
        </LayoutGroup>
      </BlueprintGrid>
    </GlobalBootSequence>
  );
}
