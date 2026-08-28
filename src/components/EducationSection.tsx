"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import ScrambleText, { type ScrambleTextRef } from "@/components/ruixen/scramble-text";
import { EducationList } from "@/components/EducationList";
import { CertificationsList } from "@/components/CertificationsList";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { type UseEmblaCarouselType } from "embla-carousel-react";
import AutoHeight from "embla-carousel-auto-height";

import { playSoftClick, playHoverTick } from "@/lib/synth-sounds";
import { CornerMark } from "@/components/ui/corner-mark";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { useCarouselMorphHeight } from "@/hooks/use-carousel-morph-height";

type CarouselApi = UseEmblaCarouselType[1];

export function EducationSection({ hasSeenScrollAnimations = false }: { hasSeenScrollAnimations?: boolean }) {
  const { phase, isLowTier, skip } = useSectionReveal(hasSeenScrollAnimations);
  const [activeTab, setActiveTab] = useState<"education" | "certs">("education");
  const [api, setApi] = useState<CarouselApi>();
  const scrambleRef = useRef<ScrambleTextRef>(null);

  useCarouselMorphHeight(api);

  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      const index = api.selectedScrollSnap();
      const tab = index === 0 ? "education" : "certs";
      if (tab !== activeTab) {
        setActiveTab(tab);
        setTimeout(() => {
          scrambleRef.current?.play(tab === "education");
        }, 50);
      }
    });
  }, [api, activeTab]);

  const handleTabSwitch = (tab: "education" | "certs") => {
    if (tab !== activeTab) {
      playSoftClick(0.1);
      const index = tab === "education" ? 0 : 1;
      api?.scrollTo(index);
    }
  };

  return (
    <motion.div 
      id="education" 
      className="mt-0 flex flex-col relative z-10 scroll-mt-24"
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
      {/* Header Row */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: -10 },
          visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } }
        }}
        className="py-1 relative flex items-center justify-between min-h-[30px]"
      >
        <ScrambleText ref={scrambleRef} as="h2" className="text-[17px] sm:text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">
          {activeTab === "education" ? "Education" : "Certifications & Honors"}
        </ScrambleText>
        
        {/* Toggle Switch */}
        <div className="relative group z-30">
          <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
          <div className="relative grid grid-cols-2 p-1 bg-zinc-50 dark:bg-[#09090b] rounded-[6px] border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80 w-fit select-none">
            {/* Sliding Pill Background */}
            <div
              className={`absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/2)] rounded-[4px] bg-white dark:bg-[#1e1e20] border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] transform will-change-transform ${
                activeTab === "education" ? "translate-x-0" : "translate-x-[100%]"
              }`}
            />
            
            {/* Buttons */}
            <button
              onClick={() => handleTabSwitch("education")}
              onMouseEnter={() => playHoverTick(0.055)}
              aria-label="Education"
              className={`z-10 relative flex items-center justify-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-center transition-colors duration-200 ${
                activeTab === "education"
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Education</span>
            </button>
            <button
              onClick={() => handleTabSwitch("certs")}
              onMouseEnter={() => playHoverTick(0.055)}
              aria-label="Certifications & Honors"
              className={`z-10 relative flex items-center justify-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-center transition-colors duration-200 ${
                activeTab === "certs"
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Honors & Certs</span>
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

      {/* Embla Carousel View */}
      <div className="block mt-0 relative -mx-4">
        <Carousel
          setApi={setApi}
          plugins={[AutoHeight()]}
          opts={{
            loop: false,
            watchDrag: true,
          }}
          className="w-full select-none cursor-grab active:cursor-grabbing [&>div:first-child]:transition-[height] [&>div:first-child]:duration-300"
        >
          <CarouselContent className="ml-0 items-start">
            <CarouselItem className="pl-0 px-4">
              <EducationList activeTab={activeTab} carouselApi={api} />
            </CarouselItem>
            <CarouselItem className="pl-0 px-4">
              <CertificationsList activeTab={activeTab} carouselApi={api} />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </motion.div>
  );
}
