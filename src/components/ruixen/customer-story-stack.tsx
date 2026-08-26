"use client";

import React, { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { playSoftClick, playHoverTick } from "@/lib/synth-sounds";

export interface CustomerStoryMetric {
  icon: React.ReactNode;
  label: string;
}

export interface CustomerStoryAuthor {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface CustomerStoryCase {
  id: string;
  logo?: React.ReactNode;
  quote: string;
  author: CustomerStoryAuthor;
  metrics?: CustomerStoryMetric[];
  link?: {
    label: string;
    href: string;
  };
}

export interface CustomerStoryStackProps {
  cases: CustomerStoryCase[];
  readMoreLink?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function CustomerStoryStack({
  cases,
  readMoreLink,
  className,
}: CustomerStoryStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentCase = cases[activeIndex] || cases[0];
  const componentId = useId();

  if (!cases || cases.length === 0) return null;

  const handleNext = () => {
    playSoftClick(0.1);
    setActiveIndex((prev) => (prev + 1) % cases.length);
  };

  const handlePrev = () => {
    playSoftClick(0.1);
    setActiveIndex((prev) => (prev - 1 + cases.length) % cases.length);
  };

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      {/* Main Story Card */}
      <div className="relative w-full rounded-2xl bg-zinc-50/90 dark:bg-[#0c0c0e]/90 border border-black/10 dark:border-white/10 p-6 sm:p-8 backdrop-blur-md shadow-xs overflow-hidden">
        {/* Subtle Background Glow */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 bg-[#6495ED]/10 dark:bg-[#6495ED]/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCase.id || activeIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col gap-6 relative z-10"
          >
            {/* Top Bar: Logo / Brand + Carousel Controls */}
            <div className="flex items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                {currentCase.logo ? (
                  <div className="flex items-center">{currentCase.logo}</div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Quote className="w-5 h-5 text-[#6495ED]" />
                    <span className="text-[12px] font-bold tracking-wider uppercase text-zinc-700 dark:text-zinc-300 font-mono">
                      Client Story
                    </span>
                  </div>
                )}
              </div>

              {cases.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mr-1.5">
                    {activeIndex + 1} / {cases.length}
                  </span>
                  <button
                    type="button"
                    onClick={handlePrev}
                    onMouseEnter={() => playHoverTick(0.04)}
                    aria-label="Previous story"
                    className="p-1.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800/70 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    onMouseEnter={() => playHoverTick(0.04)}
                    aria-label="Next story"
                    className="p-1.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800/70 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Quote */}
            <blockquote className="text-[16px] sm:text-[18px] text-zinc-850 dark:text-zinc-150 font-medium italic leading-relaxed sm:leading-relaxed select-text text-zinc-900 dark:text-zinc-100">
              &ldquo;{currentCase.quote}&rdquo;
            </blockquote>

            {/* Metrics Row */}
            {currentCase.metrics && currentCase.metrics.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
                {currentCase.metrics.map((metric, idx) => (
                  <div
                    key={`${componentId}-metric-${idx}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-black/5 dark:border-white/10"
                  >
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[#6495ED] shrink-0">
                      {React.cloneElement(
                        metric.icon as React.ReactElement<{ className?: string }>,
                        { className: "w-4 h-4" }
                      )}
                    </div>
                    <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 leading-snug">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Row: Author info & Read More Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-black/5 dark:border-white/10">
              <div className="flex items-center gap-3">
                {currentCase.author.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentCase.author.avatarUrl}
                    alt={currentCase.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-black/10 dark:border-white/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#6495ED]/15 text-[#6495ED] font-bold text-xs flex items-center justify-center border border-[#6495ED]/30">
                    {currentCase.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                    {currentCase.author.name}
                  </span>
                  <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400">
                    {currentCase.author.role}
                  </span>
                </div>
              </div>

              {(currentCase.link || readMoreLink) && (
                <a
                  href={currentCase.link?.href || readMoreLink?.href}
                  target={currentCase.link?.href?.startsWith("http") ? "_blank" : undefined}
                  rel={currentCase.link?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-[#6495ED] hover:underline self-start sm:self-auto"
                >
                  <span>{currentCase.link?.label || readMoreLink?.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
