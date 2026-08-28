"use client";

import React from "react";
import { motion } from "framer-motion";
import ScrambleText from "@/components/ruixen/scramble-text";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { Testimonial } from "@/components/ui/testimonial";
import { CornerMark } from "@/components/ui/corner-mark";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";

interface TestimonialSectionProps {
  hasSeenScrollAnimations?: boolean;
}

export function TestimonialSection({
  hasSeenScrollAnimations = false,
}: TestimonialSectionProps) {
  const { phase, isLowTier, skip } = useSectionReveal(hasSeenScrollAnimations);

  return (
    <motion.div
      id="testimonials"
      className="mt-0 flex flex-col relative scroll-mt-24 w-full"
      initial={skip ? "visible" : "hidden"}
      whileInView={skip ? undefined : (phase === "done" ? "visible" : "hidden")}
      animate={skip ? "visible" : undefined}
      viewport={{ once: true, amount: 0.1 }}
      transition={isLowTier ? { duration: 0 } : undefined}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      {/* Top line — spans between margin guides */}
      <div
        className="absolute top-0 bleed-x h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={DOT_MASK_HORIZONTAL}
      />
      <CornerMark position="top-left" />
      <CornerMark position="top-right" />

      {/* Header Row with ScrambleText matching portfolio font style */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -10, filter: "blur(4px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { type: "spring", bounce: 0.3 },
          },
        }}
        className="py-1 relative flex items-center min-h-[30px]"
      >
        <ScrambleText
          as="h2"
          className="text-[17px] sm:text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none"
        >
          Kind Words
        </ScrambleText>

        {/* Horizontal line below Testimonials heading — spans between margin guides */}
        <div
          className="absolute bottom-0 bleed-x h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />
        <CornerMark position="bottom-left" />
        <CornerMark position="bottom-right" />
      </motion.div>

      {/* Testimonial Quote & Author Block */}
      <div className="relative w-full">
        <Testimonial
          skip={skip}
          phase={phase}
          className="py-8 sm:py-12"
          quote="We greatly acknowledge and appreciate Josiah's work. He built a standout platform for our agency and proved his technical skills under real-world demands. When expanding our engineering team, he is at the very top of our list."
          highlightedText="standout platform for our agency"
          authorName="David Clarence Del Mundo"
          authorImage="/PRIMA.png"
        />
      </div>
    </motion.div>
  );
}
