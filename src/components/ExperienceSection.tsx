"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import ScrambleText, { type ScrambleTextRef } from "@/components/ruixen/scramble-text";
import { ExperienceList } from "@/components/ExperienceList";
import { LessonsLearned } from "@/components/LessonsLearned";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import AutoHeight from "embla-carousel-auto-height";
import { Briefcase, AlertTriangle } from "lucide-react";
import { playHoverTick, playTabSelect } from "@/lib/synth-sounds";
import { TransitionLink } from "@/components/TransitionLink";

import { CornerMark } from "@/components/ui/corner-mark";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { useCarouselMorphHeight } from "@/hooks/use-carousel-morph-height";

export function ExperienceSection({ hasSeenScrollAnimations = false }: { hasSeenScrollAnimations?: boolean }) {
  const { phase, isLowTier, skip } = useSectionReveal(hasSeenScrollAnimations);
  const [activeTab, setActiveTab] = useState<'experiences' | 'lessons'>('experiences');
  const [api, setApi] = useState<CarouselApi>();
  const scrambleRef = useRef<ScrambleTextRef>(null);

  useCarouselMorphHeight(api);

  const handleTabSwitch = (tab: 'experiences' | 'lessons') => {
    if (tab === activeTab) return;
    playTabSelect(0.08);
    setActiveTab(tab);
    if (api) {
      api.scrollTo(tab === 'experiences' ? 0 : 1);
    }
    scrambleRef.current?.play(true);
  };

  return (
    <motion.div 
      id="experience" 
      className="mt-0 flex flex-col relative scroll-mt-24"
      initial={skip ? "visible" : "hidden"}
      whileInView={skip ? undefined : (phase === "done" ? "visible" : "hidden")}
      animate={skip ? "visible" : undefined}
      viewport={{ once: true, amount: 0.1 }}
      transition={isLowTier ? { duration: 0 } : undefined}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } }
      }}
    >
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: -10 },
          visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } }
        }}
        className="py-1 relative flex items-center justify-between min-h-[30px]"
      >
        <ScrambleText ref={scrambleRef} as="h2" className="text-[17px] sm:text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">
          {activeTab === 'experiences' ? 'Experiences' : 'What I Broke'}
        </ScrambleText>
        
        {/* Toggle Switch */}
        <div className="relative group z-30">
          <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
          <div className="relative grid grid-cols-2 p-1 bg-zinc-50 dark:bg-[#09090b] rounded-[6px] border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80 w-fit select-none">
            {/* Sliding Pill Background */}
            <div
              className={`absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/2)] rounded-[4px] bg-white dark:bg-[#1e1e20] border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] transform will-change-transform ${
                activeTab === 'experiences' ? 'translate-x-0' : 'translate-x-[100%]'
              }`}
            />
            
            {/* Buttons */}
            <button
              role="tab"
              aria-selected={activeTab === 'experiences'}
              data-sound-custom="true"
              onClick={() => handleTabSwitch('experiences')}
              onMouseEnter={() => playHoverTick(0.055)}
              aria-label="Experiences"
              className={`z-10 relative flex items-center justify-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-center transition-colors duration-200 cursor-pointer ${
                activeTab === 'experiences'
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Experiences</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'lessons'}
              data-sound-custom="true"
              onClick={() => handleTabSwitch('lessons')}
              onMouseEnter={() => playHoverTick(0.055)}
              aria-label="Lessons Learned"
              className={`z-10 relative flex items-center justify-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-center transition-colors duration-200 cursor-pointer ${
                activeTab === 'lessons'
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lessons Learned</span>
            </button>
          </div>
        </div>
        {/* Bottom line under header — spans between margin guides */}
        <div
          className="absolute bottom-0 bleed-x h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />
        <CornerMark position="bottom-left" />
        <CornerMark position="bottom-right" />
      </motion.div>

      <div className="block mt-0 relative -mx-4">
        <Carousel setApi={setApi} opts={{ loop: false, watchDrag: true }} plugins={[AutoHeight()]} className="w-full select-none cursor-grab active:cursor-grabbing [&>div:first-child]:transition-[height] [&>div:first-child]:duration-300">
          <CarouselContent className="ml-0 items-start">
            <CarouselItem className="pl-0 px-4">
              <ExperienceList activeTab={activeTab} carouselApi={api} />
              {/* View All Button */}
              <div className="py-4 px-4 -mx-4 flex justify-center relative hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer rounded-b-lg mt-0">
                <TransitionLink href="/experience" className="relative group block mt-0">
                  <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
                  <div className="relative flex items-center gap-1.5 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[6px] text-[13px] font-medium transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80">
                    View All
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </TransitionLink>
              </div>
            </CarouselItem>
            <CarouselItem className="pl-0 px-4">
              <LessonsLearned activeTab={activeTab} carouselApi={api} />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      {/* Bottom line for the entire section — spans between margin guides */}
      <div
        className="absolute bottom-0 bleed-x h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={DOT_MASK_HORIZONTAL}
      />
      <CornerMark position="bottom-left" />
      <CornerMark position="bottom-right" />
    </motion.div>
  );
}
