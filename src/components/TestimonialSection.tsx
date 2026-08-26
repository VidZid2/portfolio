"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Timer, Layers } from "lucide-react";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  CustomerStoryStack,
  type CustomerStoryCase,
} from "@/registry/ruixenui/customer-story-stack";

interface TestimonialSectionProps {
  hasSeenScrollAnimations?: boolean;
}

const cases: CustomerStoryCase[] = [
  {
    id: "prima-agency",
    logo: (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md bg-black dark:bg-white text-white dark:text-black font-mono text-[11px] font-bold tracking-widest uppercase">
          PRIMA
        </span>
        <span className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
          Digital Technology Solutions
        </span>
      </div>
    ),
    quote:
      "We greatly acknowledge and appreciate Josiah's work. He built a standout platform for our agency and proved his technical skills under real-world demands. When expanding our engineering team, he is at the very top of our list.",
    author: {
      name: "David Clarence Del Mundo",
      role: "Lead / Stakeholder, PRIMA",
      avatarUrl: undefined,
    },
    metrics: [
      {
        icon: <Sparkles />,
        label: "4-Day high-velocity pro-bono client sprint",
      },
      {
        icon: <ShieldCheck />,
        label: "Adopted into official agency client portfolio",
      },
    ],
    link: {
      label: "View Agency Page",
      href: "https://www.facebook.com/primaofficial",
    },
  },
  {
    id: "sti-elms",
    logo: (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md bg-blue-600/15 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold tracking-widest uppercase border border-blue-500/20">
          STI eLMS
        </span>
        <span className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
          UX & Systems Case Study
        </span>
      </div>
    ),
    quote:
      "Educational software is often hindered by legacy friction. Re-architecting multi-step navigation into a single-view modular dashboard with optimistic UI updates proved that higher-ed tools can be both fluid and hardened.",
    author: {
      name: "Josiah De Asis",
      role: "UI Systems Architect & Student Researcher",
      avatarUrl: undefined,
    },
    metrics: [
      {
        icon: <Timer />,
        label: "0ms perceived latency via optimistic updates",
      },
      {
        icon: <Layers />,
        label: "Hardware-aware responsive layouts for mobile",
      },
    ],
    link: {
      label: "Read Case Study",
      href: "/projects/sti-elms",
    },
  },
];

export function TestimonialSection({
  hasSeenScrollAnimations = false,
}: TestimonialSectionProps) {
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

      {/* Customer Story Stack */}
      <CustomerStoryStack
        cases={cases}
        readMoreLink={{ label: "View all featured projects", href: "/projects" }}
      />

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
