"use client";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";

import React from "react";
import { motion } from "framer-motion";
import ScrambleText from "@/components/ruixen/scramble-text";

const skills = [
  { name: "Next.js", icon: "nextdotjs" },
  { name: "React", icon: "react" },
  { name: "TypeScript", icon: "typescript" },
  { name: "JavaScript", icon: "javascript" },
  { name: "HTML5", icon: "html5" },
  { name: "CSS3", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" },
  { name: "Tailwind", icon: "tailwindcss" },
  { name: "Vite", icon: "vite" },
  { name: "Motion", icon: "framer" },
  { name: "Supabase", icon: "supabase" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Git", icon: "git" },
  { name: "GitHub", icon: "github" },
  { name: "Vercel", icon: "vercel" },
  { name: "VS Code", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg" },
];

import { usePerformance } from "@/hooks/usePerformance";

export function SkillsSection({ hasSeenScrollAnimations = false }: { hasSeenScrollAnimations?: boolean }) {
  const phase = useArcReveal();
  const { isLowTier } = usePerformance();
  const skip = hasSeenScrollAnimations || isLowTier;
  return (
    <motion.div 
      id="skills" 
      className="mt-0 flex flex-col relative z-10 scroll-mt-24"
      initial={skip ? "visible" : "hidden"}
      whileInView={skip ? undefined : (phase === "done" ? "visible" : "hidden")}
      animate={skip ? "visible" : undefined}
      viewport={{ once: true, amount: 0.1 }}
      
      transition={isLowTier ? { duration: 0 } : undefined}
      
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      {/* Top full-width line */}
      <div
        className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={{
          maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
          WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)'
        }}
      />
      {/* Top Line Intersections */}
      <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

      <motion.div 
        variants={{
          hidden: { opacity: 0, y: -10, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", bounce: 0.3 } }
        }}
        className="py-2 relative mt-1"
      >
        <ScrambleText as="h2" className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Skills & Technologies</ScrambleText>

        {/* Horizontal line below Skills heading */}
        <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
        {/* Intersections */}
        <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </motion.div>

      <div className="relative pt-6 pb-2">
        <div className="flex flex-wrap gap-2 w-full">
          {skills.map((skill, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 15 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.3 } }
              }}
              className="grow flex items-center justify-center gap-2 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#0a0a0a] dark:hover:bg-[#121214] border border-black/30 dark:border-white/[0.15] rounded-[6px] transition-colors duration-200 cursor-default"
            >
              <img
                src={skill.icon.startsWith('http') ? skill.icon : `https://cdn.simpleicons.org/${skill.icon}/71717a`}
                alt={skill.name}
                width={14}
                height={14}
                loading="lazy"
                decoding="async"
                className={`h-3.5 w-3.5 opacity-80 ${skill.icon.startsWith('http') ? 'rounded-sm grayscale' : ''}`}
              />
              <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
