"use client";

import React from "react";
import { motion } from "framer-motion";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";
import { usePerformance } from "@/hooks/usePerformance";
import ScrambleText from "@/components/ruixen/scramble-text";

interface StackCategory {
  id: string;
  index: string;
  name: string;
  items: {
    name: string;
    icon: string;
  }[];
}

const STACK_CATEGORIES: StackCategory[] = [
  {
    id: "language",
    index: "01",
    name: "Language",
    items: [
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Python", icon: "python" },
      { name: "HTML5", icon: "html5" },
      { name: "CSS3", icon: "css3" },
    ],
  },
  {
    id: "frontend",
    index: "02",
    name: "Frontend",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "shadcn/ui", icon: "shadcnui" },
      { name: "Radix UI", icon: "radixui" },
      { name: "Base UI", icon: "react" },
      { name: "Motion", icon: "framer" },
      { name: "Three.js", icon: "threedotjs" },
      { name: "Vite", icon: "vite" },
    ],
  },
  {
    id: "backend",
    index: "03",
    name: "Backend & Database",
    items: [
      { name: "Node.js", icon: "nodedotjs" },
      { name: "Bun", icon: "bun" },
      { name: "Supabase", icon: "supabase" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Flask", icon: "flask" },
      { name: "SQLite", icon: "sqlite" },
      { name: "Redis", icon: "redis" },
    ],
  },
  {
    id: "workflow-ai",
    index: "04",
    name: "Workflow & AI",
    items: [
      { name: "Gemini", icon: "googlegemini" },
      { name: "ChatGPT", icon: "openai" },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Docker", icon: "docker" },
      { name: "Vercel", icon: "vercel" },
    ],
  },
];

export function SkillsSection({ hasSeenScrollAnimations = false }: { hasSeenScrollAnimations?: boolean }) {
  const phase = useArcReveal();
  const { isLowTier } = usePerformance();
  const skip = hasSeenScrollAnimations || isLowTier;

  const dashedMask = {
    maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
    WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  };

  const dashedVerticalMask = {
    maskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
    WebkitMaskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
  };

  return (
    <motion.div
      id="skills"
      className="mt-0 flex flex-col relative z-10 scroll-mt-24 w-full"
      initial={skip ? "visible" : "hidden"}
      whileInView={skip ? undefined : (phase === "done" ? "visible" : "hidden")}
      animate={skip ? "visible" : undefined}
      viewport={{ once: true, amount: 0.1 }}
      transition={isLowTier ? { duration: 0 } : undefined}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {/* Top dashed boundary line */}
      <div
        className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={dashedMask}
      />
      <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

      {/* Header: Stack (Framed by top & bottom dotted lines) */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -6, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", bounce: 0.3 } },
        }}
        className="relative h-[38px] sm:h-[42px] flex items-center px-1 sm:px-1.5"
      >
        <ScrambleText
          as="h2"
          className="text-[18px] sm:text-[20px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none"
        >
          Stack
        </ScrambleText>

        {/* Horizontal Dotted Divider under Stack heading */}
        <div
          className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMask}
        />
        <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </motion.div>

      {/* Categorized Matrix Rows */}
      <div className="relative flex flex-col w-full">
        {/* Vertical divider line separating Category Label and Pills on desktop */}
        <div
          className="hidden sm:block absolute top-0 bottom-0 left-[160px] md:left-[190px] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedVerticalMask}
        />

        {STACK_CATEGORIES.map((category) => (
          <motion.div
            key={category.id}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.25 } },
            }}
            className="relative flex flex-col sm:flex-row items-start py-3 sm:py-3.5 px-1 sm:px-1.5 group"
          >
            {/* Category Label (Index + Name) */}
            <div className="w-full sm:w-[160px] md:w-[190px] shrink-0 flex items-center gap-2 sm:gap-2.5 pb-2 sm:pb-0 select-none">
              <span className="text-[12px] sm:text-[13px] font-mono text-zinc-400 dark:text-zinc-500 font-medium">
                {category.index}
              </span>
              <span className="text-[13px] sm:text-[14px] font-medium text-zinc-800 dark:text-zinc-200">
                {category.name}
              </span>
            </div>

            {/* Pills container */}
            <div className="flex-1 flex flex-wrap items-center gap-1.5 sm:gap-2 sm:pl-4">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100/80 dark:bg-zinc-800/60 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/50 text-[12px] sm:text-[13px] font-medium transition-colors cursor-default select-none shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <img
                    src={`https://cdn.simpleicons.org/${item.icon}/71717a`}
                    alt={item.name}
                    width={14}
                    height={14}
                    loading="lazy"
                    decoding="async"
                    className="h-3.5 w-3.5 opacity-80 shrink-0"
                  />
                  <span className="text-inherit font-medium leading-none">{item.name}</span>
                </div>
              ))}
            </div>

            {/* Horizontal Dotted Divider under each row */}
            <div
              className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
              style={dashedMask}
            />
            {/* Intersection nodes */}
            <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            <div className="hidden sm:block absolute bottom-0 left-[160px] md:left-[190px] w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
