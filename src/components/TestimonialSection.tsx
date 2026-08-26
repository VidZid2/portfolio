"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";
import { useSectionReveal } from "@/hooks/use-section-reveal";

interface TestimonialSectionProps {
  hasSeenScrollAnimations?: boolean;
}

export function TestimonialSection({ hasSeenScrollAnimations = false }: TestimonialSectionProps) {
  const { phase, skip } = useSectionReveal(hasSeenScrollAnimations);
  const isVisible = skip || phase === "done";

  const dashedMask = {
    maskImage: DOT_MASK_HORIZONTAL.maskImage,
    WebkitMaskImage: DOT_MASK_HORIZONTAL.WebkitMaskImage,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full py-6 sm:py-7 my-0"
    >
      {/* Top Full-Width Dashed Blueprint Line */}
      <div
        className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={dashedMask}
      />
      <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

      {/* Testimonial Card Container */}
      <div className="relative rounded-xl sm:rounded-2xl bg-zinc-50/80 dark:bg-[#0c0c0e]/80 border border-black/10 dark:border-white/10 p-5 sm:p-7 shadow-xs backdrop-blur-xs overflow-hidden">
        {/* Badge Header */}
        <div className="flex items-center gap-2 mb-3.5 text-emerald-600 dark:text-emerald-400 text-[11px] sm:text-[11.5px] font-bold tracking-wider uppercase">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span>CLIENT &amp; MENTOR ENDORSEMENT</span>
        </div>

        {/* Quote Body */}
        <blockquote className="text-[15px] sm:text-[16.5px] text-zinc-800 dark:text-zinc-200 italic font-medium leading-relaxed sm:leading-relaxed mb-5 select-text">
          &ldquo;We greatly acknowledge and appreciate Josiah&apos;s work. He built a standout platform for our agency and proved his technical skills under real-world demands. When expanding our engineering team, he is at the very top of our list.&rdquo;
        </blockquote>

        {/* Footer Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-black/5 dark:border-white/10 text-[13px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">David Clarence Del Mundo</span>
            <span className="text-zinc-400 dark:text-zinc-500">&mdash;</span>
            <span className="text-zinc-600 dark:text-zinc-400">Lead / Stakeholder, PRIMA</span>
          </div>

          <a
            href="https://www.facebook.com/primaofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#6495ED] hover:underline shrink-0"
          >
            <span>View Agency Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Bottom Full-Width Dashed Blueprint Line */}
      <div
        className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={dashedMask}
      />
      <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
    </motion.div>
  );
}
