"use client";

import React from "react";
import { motion } from "framer-motion";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";
import { usePerformance } from "@/hooks/usePerformance";
import ScrambleText from "@/components/ruixen/scramble-text";

function OpenAIIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

interface StackItem {
  name: string;
  icon?: string;
  customSrc?: string;
  isLobeOpenAI?: boolean;
}

interface StackCategory {
  id: string;
  index: string;
  name: string;
  items: StackItem[];
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
      { name: "HTML5", customSrc: "/SVG's/Stack SVG's/HTML.svg" },
      { name: "CSS3", customSrc: "/SVG's/Stack SVG's/CSS3.svg" },
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
      { name: "ChatGPT", isLobeOpenAI: true },
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

            {/* Smooth curved squircle tiles (No outline) */}
            <div className="flex-1 flex flex-wrap items-center gap-1.5 sm:gap-2 sm:pl-4">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] bg-zinc-100/90 dark:bg-zinc-800/70 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300 text-[12px] sm:text-[13px] font-medium transition-colors cursor-default select-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  {item.isLobeOpenAI ? (
                    <OpenAIIcon className="h-3.5 w-3.5 opacity-80 shrink-0" />
                  ) : item.customSrc ? (
                    <img
                      src={item.customSrc}
                      alt={item.name}
                      width={14}
                      height={14}
                      loading="lazy"
                      decoding="async"
                      className="h-3.5 w-3.5 object-contain shrink-0"
                    />
                  ) : (
                    <img
                      src={`https://cdn.simpleicons.org/${item.icon}/71717a`}
                      alt={item.name}
                      width={14}
                      height={14}
                      loading="lazy"
                      decoding="async"
                      className="h-3.5 w-3.5 opacity-80 shrink-0"
                    />
                  )}
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
