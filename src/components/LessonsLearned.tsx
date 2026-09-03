"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Database, Zap, ShieldAlert } from "lucide-react";
import { type CarouselApi } from "@/components/ui/carousel";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";

type LessonData = {
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  date: string;
  impact: string;
  description: string;
};

const lessons: LessonData[] = [
  {
    title: "The PRIMA Database Crash",
    icon: <Database className="w-5 h-5 text-rose-500" />,
    subtitle: "Supabase Architecture",
    date: "Late 2025",
    impact: "Total Outage",
    description: "During my 1st year as a BSIT student, I realized I needed to go beyond the standard curriculum. What started as a basic static site became my ultimate testing ground. I dedicated countless hours after class mastering React, TypeScript, and database design. While implementing real-time features on Supabase, an unoptimized recursive query caused a high-load database outage—a critical trial that forced me to deeply understand indexing, connection pooling, and relational architecture.",
  },
  {
    title: "Animation Overkill",
    icon: <Zap className="w-5 h-5 text-amber-500" />,
    subtitle: "Frontend Performance",
    date: "Early 2026",
    impact: "Heavy Lag",
    description: "My curiosity quickly pushed me toward modern frameworks and interactive UIs. Through trial and error, I taught myself to implement complex animations using Framer Motion. Initially, I added so many animations to PRIMA that lower-end mobile devices started lagging heavily. This overkill taught me the hard way about performance budgets, React rendering cycles, and how to optimize fluid page transitions for all devices so the software wouldn't feel clunky.",
  },
  {
    title: "The eLMS Security Hole",
    icon: <ShieldAlert className="w-5 h-5 text-[#6495ED]" />,
    subtitle: "PostgreSQL RLS",
    date: "Mid 2026",
    impact: "Data Vulnerability",
    description: "I poured my energy into eLMS 2.0, a complete, modernized overhaul of the STI eLMS system. I wanted to prove school software doesn't have to be clunky, focusing on a clean, component-driven architecture with dark mode support. However, on the backend, I realized my initial Supabase setup lacked Row Level Security (RLS). Recognizing the importance of security, I researched and implemented strict Postgres RLS policies and AES encryption to protect sensitive student data. It was a true journey of breaking things and building them back better.",
  }
];

export function LessonsLearned({ activeTab, carouselApi }: { activeTab?: string; carouselApi?: CarouselApi }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselApi || !containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      carouselApi.reInit();
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [carouselApi]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setOpenIdx(null);
    });
    return () => cancelAnimationFrame(frameId);
  }, [activeTab]);

  return (
    <div ref={containerRef} className="block mt-0">
      {lessons.map((item, idx) => {
        const isOpen = openIdx === idx;

        return (
          <motion.div 
            key={idx} 
            className="group relative"
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 15 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
            }}
          >
            {/* Dashed bottom border for all items */}
            <div
              className="absolute bottom-0 left-[-16px] right-[-16px] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
              style={{
                maskImage:
                  DOT_MASK_HORIZONTAL.maskImage,
                WebkitMaskImage:
                  DOT_MASK_HORIZONTAL.WebkitMaskImage,
              }}
            />



            <div
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenIdx(isOpen ? null : idx);
                }
              }}
              className="group/item flex flex-row items-center justify-between gap-2 sm:gap-4 py-3.5 px-4 -mx-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer active:cursor-grabbing select-none relative z-20 rounded-lg sm:py-4 overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 relative z-10">
                <div className="size-10 shrink-0 rounded-[10px] border border-black/10 bg-zinc-50 p-[2px] shadow-sm shadow-black/15 dark:border-zinc-800 dark:bg-[#111111] dark:shadow-md dark:shadow-black/50">
                  <div className="w-full h-full rounded-[7px] border border-black/5 dark:border-black/20 bg-white dark:bg-[#111111] flex items-center justify-center overflow-hidden relative">
                    {item.icon}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 pr-2 sm:pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-bold leading-tight sm:text-[17px] text-zinc-900 dark:text-zinc-100 truncate">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[14px] sm:text-[15px] text-zinc-600 dark:text-zinc-400 truncate">
                    {item.subtitle}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5 text-right shrink-0 relative z-10">
                <div className="flex items-center gap-1 text-[12px] sm:text-[14px] font-medium text-zinc-900 dark:text-zinc-100 relative">
                  <span>{item.date}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#6495ED]" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <span className="text-[13px] sm:text-[14px] text-zinc-500 dark:text-zinc-400">
                  {item.impact}
                </span>
              </div>
            </div>

            {/* Expandable Details Section */}
            <div
              className={`-mx-4 grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`${isOpen ? "pb-4 pt-0 opacity-100 translate-y-0" : "pb-0 pt-0 opacity-0 -translate-y-2"
                    } transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] pl-6 pr-8 text-[14px] text-zinc-600 dark:text-zinc-400`}
                >
                  <div className="mb-2 leading-relaxed text-[13px] sm:text-[14px]">
                    {item.description}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* View All Button (Condition: >= 4 items) */}
      {lessons.length >= 4 && (
        <div className="py-4 px-4 -mx-4 flex justify-center relative hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer rounded-b-lg mt-0">
          <Link href="#" className="relative group block mt-0">
            <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
            <div className="relative flex items-center gap-1.5 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[6px] text-[13px] font-medium transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80">
              View All
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
