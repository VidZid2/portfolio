"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DrawUnderlineLink } from "@/components/sora-ui/texts/draw-underline-link";
import { useTransition } from "@/components/TransitionProvider";
import { playToastError, playSoftClick } from "@/lib/synth-sounds";

const dashedMaskHorizontal = {
  maskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
};

const dashedMaskVertical = {
  maskImage:
    "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
};

const INSPIRED_BY = [
  { num: "01", name: "Aceternity UI", url: "https://ui.aceternity.com" },
  { num: "02", name: "Magic UI", url: "https://magicui.design" },
  { num: "03", name: "Chánh Đại", url: "https://chanhdai.com" },
  { num: "04", name: "Cult UI", url: "https://www.cult-ui.com" },
  { num: "05", name: "CuiCui UI", url: "https://cuicui.day" },
  { num: "06", name: "Fancy Components", url: "https://fancycomponents.dev" },
  { num: "07", name: "Sora UI", url: "https://soraui.com" },
  { num: "08", name: "Ruixen UI", url: "https://ruixen.com" },
  { num: "09", name: "Origin Kit UI", url: "https://originui.com" },
  { num: "10", name: "Refinery UI", url: "https://refineryui.com" },
  { num: "11", name: "ExtendUI", url: "https://extend-ui.com" },
  { num: "12", name: "Iconiq", url: "https://iconiq.design" },
  { num: "13", name: "BEUI", url: "https://beui.design" },
  { num: "14", name: "Unlumen UI", url: "https://unlumen.me" },
  { num: "15", name: "Vengence UI", url: "https://vengence.design" },
  { num: "16", name: "Watermelon UI", url: "https://watermelon.design" },
  { num: "17", name: "Scribble Animator", url: "https://scribbleanimator.com" },
  { num: "18", name: "Arlan Marat", url: "https://arlanmarat.com" },
  { num: "19", name: "dqnamo's", url: "https://dqnamo.com" },
  { num: "20", name: "bklit", url: "https://bklit.com" },
];

const LABEL_CLASS =
  "text-[9px] sm:text-[10px] font-mono font-normal tracking-[0.08em] text-zinc-400 dark:text-zinc-500 uppercase";

export function ColophonSection() {
  const [isXError, setIsXError] = useState(false);
  const { navigate } = useTransition();

  const handleXClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playToastError(0.045);
    setIsXError(true);
    setTimeout(() => setIsXError(false), 500);
  };

  return (
    <motion.section
      layout="position"
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className="relative z-10 w-[calc(100%+24px)] -mx-3 sm:w-[calc(100%+32px)] sm:-mx-4 flex flex-col font-mono mt-0 select-none"
      aria-label="Colophon and Portfolio Metadata"
    >
      {/* Top full-width line */}
      <div
        className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={dashedMaskHorizontal}
      />
      <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute top-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

      {/* Row 1: Header (Domain + Subtitle) */}
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between py-1.5 sm:py-2 px-3 sm:px-4 gap-1 sm:gap-4 min-h-[34px]">
        <span className="font-bold text-[13.5px] sm:text-[14px] tracking-tight text-zinc-900 dark:text-zinc-100 font-mono leading-tight">
          sync-portfolio-jd.vercel.app
        </span>
        <span className="text-[11.5px] sm:text-[12px] font-mono text-zinc-500 dark:text-zinc-400 leading-tight">
          An interactive blueprint UI system crafted with obsessive detail.
        </span>

        {/* Bottom divider line */}
        <div
          className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMaskHorizontal}
        />
        <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </div>

      {/* Row 2: 4-Column Metadata Grid (Top Half) */}
      <div className="relative grid grid-cols-2 sm:grid-cols-4 w-full">
        {/* Cell 1: Crafted By */}
        <div className="relative p-3 sm:p-4 flex flex-col gap-1">
          <span className={LABEL_CLASS}>
            Crafted By
          </span>
          <DrawUnderlineLink
            href="https://github.com/VidZid2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] sm:text-[14px] font-mono font-normal text-zinc-800 dark:text-zinc-200 hover:text-[#6495ED] dark:hover:text-[#6495ED] transition-colors"
          >
            @VidZid2
          </DrawUnderlineLink>
          {/* Vertical right line on mobile & desktop */}
          <div
            className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={dashedMaskVertical}
          />
        </div>

        {/* Cell 2: Build */}
        <div className="relative p-3 sm:p-4 flex flex-col gap-1">
          <span className={LABEL_CLASS}>
            Build
          </span>
          <DrawUnderlineLink
            className="text-[13px] sm:text-[14px] font-mono font-normal text-zinc-800 dark:text-zinc-200 hover:text-[#6495ED] dark:hover:text-[#6495ED] transition-colors"
          >
            e5f3b78
          </DrawUnderlineLink>
          {/* Vertical right line on desktop */}
          <div
            className="hidden sm:block absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={dashedMaskVertical}
          />
        </div>

        {/* Cell 3: Date */}
        <div className="relative p-3 sm:p-4 flex flex-col gap-1">
          <span className={LABEL_CLASS}>
            Date
          </span>
          <span className="text-[13px] sm:text-[14px] font-mono font-normal text-zinc-800 dark:text-zinc-200">
            2026-08-19
          </span>
          {/* Vertical right line on mobile & desktop */}
          <div
            className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={dashedMaskVertical}
          />
        </div>

        {/* Cell 4: Portfolio Version + Changelog Trigger */}
        <div className="relative p-3 sm:p-4 flex flex-col gap-1">
          {/* Handwritten Annotation in Right Gutter: changelog ↙ - PC/Desktop only */}
          <div className="absolute left-full top-[-14px] pl-4 sm:pl-5 hidden md:flex flex-col items-start pointer-events-none select-none z-30 min-w-max">
            <span className="font-caveat italic text-[16px] sm:text-[18px] leading-none font-medium text-zinc-500 dark:text-zinc-400 rotate-[3deg] tracking-wide ml-1">
              changelog
            </span>
            <svg
              className="w-12 h-6 text-zinc-400 dark:text-zinc-500 overflow-visible mt-1 -ml-3"
              viewBox="0 0 46 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M42 4 C 30 9, 16 15, 3 17" />
              <path d="m 11 12 -8 5 8 4" />
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <span className={LABEL_CLASS}>
              Portfolio
            </span>
            <button
              type="button"
              onClick={() => {
                playSoftClick(0.04);
                navigate("/changelog");
              }}
              className="group flex items-center justify-center size-[20px] sm:size-[22px] rounded-[5px] sm:rounded-[6px] bg-zinc-200/90 dark:bg-zinc-800/90 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs focus:outline-none -mt-0.5 -mr-0.5"
              title="Open Portfolio Changelog"
              aria-label="Open Portfolio Changelog"
            >
              <svg
                className="size-3 sm:size-3.5 transition-transform duration-200 group-hover:scale-110"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.9928 1.0404C14.2962 1.14421 14.5 1.42938 14.5 1.75V13.25C14.5 13.5707 14.2961 13.8559 13.9927 13.9596C13.6897 14.0633 13.3544 13.9631 13.1579 13.7103L13.1571 13.7094C12.8251 13.2933 12.4342 12.9173 12.021 12.5833C11.2941 11.9959 10.3992 11.5 9.5 11.5H5C2.79079 11.5 1 9.70922 1 7.5C1 5.29079 2.79079 3.5 5 3.5H9.5C10.3986 3.5 11.2935 3.00417 12.0206 2.41664C12.5486 1.99001 12.9365 1.55507 13.0883 1.37461C13.3178 1.10177 13.6232 0.913921 13.9928 1.0404Z"
                  className="fill-[#6495ED]"
                />
                <path
                  d="M5.14069 11.5L6.11812 16.1716C6.31746 17.1176 7.245 17.7208 8.18852 17.5235L8.63573 17.433L8.64148 17.4318C9.58859 17.2322 10.1921 16.3025 9.99263 15.3578L9.1774 11.5H5.14069Z"
                  className="fill-[#1C1F21] dark:fill-[#F4F4F5]"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.3715 5.52744C16.6421 5.40696 16.9582 5.45703 17.1784 5.65523C17.6817 6.10843 18 6.76754 18 7.50001C18 8.23247 17.6817 8.89158 17.1784 9.34478C16.9582 9.54298 16.6421 9.59305 16.3715 9.47257C16.1009 9.35208 15.9265 9.08362 15.9265 8.78741V6.2126C15.9265 5.91639 16.1009 5.64793 16.3715 5.52744Z"
                  className="fill-[#1C1F21] dark:fill-[#F4F4F5]"
                />
                <path
                  d="M4 11.374C2.27473 10.93 1 9.36391 1 7.5C1 5.63609 2.27473 4.07003 4 3.62601V11.374Z"
                  className="fill-[#6495ED]"
                />
              </svg>
            </button>
          </div>
          <span className="text-[13px] sm:text-[14px] font-mono font-normal text-zinc-800 dark:text-zinc-200">
            v2.0.0
          </span>
        </div>

        {/* Horizontal Divider between Top & Bottom Grid */}
        <div
          className="col-span-2 sm:col-span-4 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMaskHorizontal}
        />
      </div>

      {/* Row 3: 4-Column Metadata Grid (Bottom Half) */}
      <div className="relative grid grid-cols-2 sm:grid-cols-4 w-full">
        {/* Cell 5: Deployed On */}
        <div className="relative p-3 sm:p-4 flex flex-col gap-1">
          <span className={LABEL_CLASS}>
            Deployed On
          </span>
          <span className="text-[13px] sm:text-[14px] font-mono font-normal text-zinc-800 dark:text-zinc-200">
            Vercel
          </span>
          <div
            className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={dashedMaskVertical}
          />
        </div>

        {/* Cell 6: Source Code */}
        <div className="relative p-3 sm:p-4 flex flex-col gap-1">
          <span className={LABEL_CLASS}>
            Source Code
          </span>
          <DrawUnderlineLink
            href="https://github.com/VidZid2/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] sm:text-[14px] font-mono font-normal text-zinc-800 dark:text-zinc-200 hover:text-[#6495ED] dark:hover:text-[#6495ED] transition-colors"
          >
            GitHub
          </DrawUnderlineLink>
          <div
            className="hidden sm:block absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={dashedMaskVertical}
          />
        </div>

        {/* Cell 7: License */}
        <div className="relative p-3 sm:p-4 flex flex-col gap-1">
          <span className={LABEL_CLASS}>
            License
          </span>
          <DrawUnderlineLink
            className="text-[13px] sm:text-[14px] font-mono font-normal text-zinc-800 dark:text-zinc-200 hover:text-[#6495ED] dark:hover:text-[#6495ED] transition-colors"
          >
            MIT License
          </DrawUnderlineLink>
          <div
            className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={dashedMaskVertical}
          />
        </div>

        {/* Cell 8: Aesthetic / Design System */}
        <div className="relative p-3 sm:p-4 flex flex-col gap-1">
          <span className={LABEL_CLASS}>
            Aesthetic
          </span>
          <span className="text-[13px] sm:text-[14px] font-mono font-normal text-zinc-800 dark:text-zinc-200">
            Technical Blueprint
          </span>
        </div>

        {/* Bottom divider line */}
        <div
          className="col-span-2 sm:col-span-4 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMaskHorizontal}
        />
      </div>

      {/* Row 4: Analytics & Stack (2-Column Grid) */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 w-full">
        {/* Left: Analytics */}
        <div className="relative p-3 sm:p-4 flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>
            Analytics
          </span>
          <div className="flex flex-col gap-1 text-[13px] sm:text-[14px] font-mono text-zinc-800 dark:text-zinc-200">
            <span>Vercel Analytics</span>
            <span>Speed Insights</span>
          </div>
          <div
            className="hidden sm:block absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={dashedMaskVertical}
          />
        </div>

        {/* Right: Stack */}
        <div className="relative p-3 sm:p-4 flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>
            Stack
          </span>
          <div className="flex flex-col gap-0.5 text-[12px] sm:text-[13px] font-mono text-zinc-800 dark:text-zinc-200">
            <span>next@16.2.6</span>
            <span>react@19.2.0</span>
            <span>framer-motion@12.4</span>
            <span>three@0.184</span>
            <span>tailwindcss@4.0</span>
          </div>
        </div>

        {/* Bottom divider line */}
        <div
          className="col-span-1 sm:col-span-2 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMaskHorizontal}
        />
      </div>

      {/* Row 5: Inspired By */}
      <div className="relative pt-2 sm:pt-2.5 pb-3 sm:pb-3.5 px-3 sm:px-4 flex flex-col gap-2 w-full">
        <span className={LABEL_CLASS}>
          Inspired By
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 sm:gap-y-2 text-[12.5px] sm:text-[13px] text-zinc-800 dark:text-zinc-200">
          {INSPIRED_BY.map((item) => (
            <div key={item.num} className="flex items-center gap-2">
              <span className="font-mono font-normal text-zinc-400 dark:text-zinc-500 shrink-0">
                {item.num}
              </span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-normal truncate hover:text-[#6495ED] dark:hover:text-[#6495ED] transition-colors"
              >
                {item.name}
              </a>
            </div>
          ))}
        </div>

        {/* Bottom divider line */}
        <div
          className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMaskHorizontal}
        />
        <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </div>

      {/* Row 6: Bottom Copyright & Socials */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between py-3.5 px-3 sm:px-4 gap-3 sm:gap-4">
        {/* Left: Copyright & Trademark */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] font-mono text-zinc-600 dark:text-zinc-400">
          <span>&copy; 2026 Josiah De Asis.</span>
          <DrawUnderlineLink
            className="text-[12px] sm:text-[13px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-[#6495ED] dark:hover:text-[#6495ED] transition-colors"
          >
            Trademark
          </DrawUnderlineLink>
        </div>

        {/* Right: Social Icons + DMCA Protected Badge */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-zinc-600 dark:text-zinc-400">
          {/* X (Twitter) - Grayed out & Interactive Error Reaction */}
          <motion.button
            type="button"
            onClick={handleXClick}
            aria-label="X (Twitter) - Inactive"
            animate={isXError ? { x: [-3, 3, -2, 2, 0] } : { x: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "flex items-center justify-center shrink-0 p-0.5 cursor-not-allowed select-none transition-colors outline-none",
              isXError
                ? "text-red-500 dark:text-red-500 scale-105"
                : "text-zinc-400/40 dark:text-zinc-600/50 hover:text-red-500/80 dark:hover:text-red-400/80 active:text-red-500"
            )}
          >
            <svg className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </motion.button>

          {/* Separator 1 */}
          <svg
            className="w-[1px] h-[15px] sm:h-[16px] shrink-0 text-black/20 dark:text-white/20 overflow-visible pointer-events-none"
            viewBox="0 0 1 16"
            fill="none"
            aria-hidden="true"
          >
            <line x1="0.5" y1="0" x2="0.5" y2="16" stroke="currentColor" strokeWidth="1" shapeRendering="crispEdges" />
          </svg>

          {/* GitHub */}
          <a
            href="https://github.com/VidZid2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center justify-center shrink-0 p-0.5"
          >
            <svg className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px]" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Separator 2 */}
          <svg
            className="w-[1px] h-[15px] sm:h-[16px] shrink-0 text-black/20 dark:text-white/20 overflow-visible pointer-events-none"
            viewBox="0 0 1 16"
            fill="none"
            aria-hidden="true"
          >
            <line x1="0.5" y1="0" x2="0.5" y2="16" stroke="currentColor" strokeWidth="1" shapeRendering="crispEdges" />
          </svg>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center justify-center shrink-0 p-0.5"
          >
            <svg className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63-.73-1.63-1.63-1.63Z" />
            </svg>
          </a>

          {/* Separator 3 */}
          <svg
            className="w-[1px] h-[15px] sm:h-[16px] shrink-0 text-black/20 dark:text-white/20 overflow-visible pointer-events-none"
            viewBox="0 0 1 16"
            fill="none"
            aria-hidden="true"
          >
            <line x1="0.5" y1="0" x2="0.5" y2="16" stroke="currentColor" strokeWidth="1" shapeRendering="crispEdges" />
          </svg>

          {/* DMCA Protected Official Vector Badge */}
          <a
            href="https://www.dmca.com/Protection/Status.aspx?ID=04d03fb3-e9ce-41af-9071-56c0566a1b4a"
            target="_blank"
            rel="noopener noreferrer"
            title="DMCA.com Protection Status"
            className="dmca-badge flex items-center shrink-0 select-none p-0.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 86 24" 
              fill="currentColor" 
              className="h-[17px] sm:h-[18px] w-auto shrink-0 transition-colors"
            >
              <path d="M22.689 5.234 21.056 3.6l-1.104 1.104a11.5 11.5 0 1 0 3.046 7.78c.001-2.086-.572-4.132-1.656-5.915l1.347-1.335Zm-1.965 7.24a9.236 9.236 0 1 1-2.328-6.158l-7.979 7.978-3.785-3.785-1.688 1.622 5.419 5.418 9.312-9.313a9.156 9.156 0 0 1 1.05 4.237ZM30.852 14h-4.854V0h4.595c.6-.004 1.198.03 1.792.104.553.068 1.098.2 1.622.392a5.644 5.644 0 0 1 2.737 2.084 7.299 7.299 0 0 1 1.25 4.328c0 4.72-2.381 7.084-7.142 7.092Zm2.795-9.786a3.089 3.089 0 0 0-2.535-1.105h-1.577v7.737h1.577a3.142 3.142 0 0 0 2.602-1.072c.57-.808.844-1.787.777-2.773a4.34 4.34 0 0 0-.844-2.787Zm18.184 9.74.097-10.511-2.853 10.511h-2.24L44.001 3.444 44.1 13.92h-3.101V0h4.307l2.628 9.18L50.528 0h4.47v14l-3.167-.046Zm19.166-5.236a6.75 6.75 0 0 1-2.49 3.827 7.303 7.303 0 0 1-9.413-.562 6.621 6.621 0 0 1-2.093-5.03 6.62 6.62 0 0 1 2.071-4.952A6.964 6.964 0 0 1 64.11.004a6.733 6.733 0 0 1 5.963 3.2c.466.658.782 1.411.925 2.205H67.36a3.307 3.307 0 0 0-3.306-2.349 3.36 3.36 0 0 0-2.634 1.18 4.05 4.05 0 0 0-.96 2.713 4.127 4.127 0 0 0 .992 2.78 3.305 3.305 0 0 0 2.658 1.224 3.406 3.406 0 0 0 3.25-2.271l3.637.032ZM81.148 14l-.719-2.026h-4.842L74.845 14h-3.848l5.63-14h2.833l5.537 14h-3.849Zm-3.07-9.671-1.451 4.802h2.889l-1.439-4.802ZM25.997 24v-6.998h2.463c.334-.008.668.014 1 .067.289.045.565.156.81.326.22.18.4.411.526.675.131.3.2.626.2.957a2.199 2.199 0 0 1-.537 1.508 2.417 2.417 0 0 1-1.915.619H26.86V24h-.863Zm.863-3.669h1.694c.422.044.843-.076 1.19-.336.25-.234.383-.58.357-.935a1.334 1.334 0 0 0-.21-.754.94.94 0 0 0-.547-.416 4.084 4.084 0 0 0-.81-.056H26.86v2.497Zm6.137 3.635v-6.963h3.01a3.99 3.99 0 0 1 1.391.19c.319.126.585.359.756.66.187.32.285.683.285 1.053a1.78 1.78 0 0 1-.472 1.254 2.372 2.372 0 0 1-1.445.639c.192.093.372.21.536.347.288.277.541.59.757.929l1.182 1.892h-1.095l-.898-1.445c-.204-.33-.423-.652-.657-.962a1.73 1.73 0 0 0-.449-.46 1.378 1.378 0 0 0-.416-.19 2.557 2.557 0 0 0-.504 0h-1.062V24l-.92-.034Zm.92-3.884h1.937c.327.012.653-.033.964-.134.213-.08.396-.224.526-.415a1.138 1.138 0 0 0-.165-1.444 1.605 1.605 0 0 0-1.094-.313h-2.169v2.306Zm5.086.522a3.53 3.53 0 0 1 .976-2.642 3.467 3.467 0 0 1 2.527-.96 3.736 3.736 0 0 1 1.821.447c.504.297.912.733 1.175 1.256a3.74 3.74 0 0 1 .494 1.79 3.672 3.672 0 0 1-.459 1.845 2.852 2.852 0 0 1-1.268 1.234 3.738 3.738 0 0 1-1.775.425 3.594 3.594 0 0 1-1.845-.469 3.048 3.048 0 0 1-1.175-1.255 3.742 3.742 0 0 1-.47-1.67Zm1 0c-.043.705.21 1.397.704 1.933a2.605 2.605 0 0 0 1.793.702c.674 0 1.32-.254 1.792-.703a2.727 2.727 0 0 0 .705-2.02 3.301 3.301 0 0 0-.317-1.44 2.235 2.235 0 0 0-.882-.961c-.982-.55-2.239-.42-3.067.317a2.802 2.802 0 0 0-.752 2.194l.024-.022ZM49.026 24v-6.167h-2.028V17h5v.833h-2.14V24h-.832Zm3.972 0v-7h4.849v.833h-3.965v2.139h3.706v.82h-3.706v2.387h4.115V24h-5Zm11.11-2.474.89.226a2.978 2.978 0 0 1-1.008 1.674 2.831 2.831 0 0 1-1.786.571 3.255 3.255 0 0 1-1.766-.442 2.756 2.756 0 0 1-1.082-1.285 4.493 4.493 0 0 1-.358-1.825 3.91 3.91 0 0 1 .402-1.835 2.768 2.768 0 0 1 1.147-1.188 3.332 3.332 0 0 1 1.7-.42 2.831 2.831 0 0 1 1.7.507c.472.36.808.87.953 1.447l-.877.205a2.159 2.159 0 0 0-.671-1.08 1.834 1.834 0 0 0-1.083-.335 2.245 2.245 0 0 0-1.3.367c-.347.247-.605.6-.736 1.005a3.944 3.944 0 0 0-.27 1.328c-.009.51.075 1.02.248 1.5.14.398.417.734.78.95.346.21.743.318 1.148.314.459.013.907-.136 1.267-.421.367-.333.613-.777.703-1.264ZM68.056 24v-6.167h-2.058V17h5v.833H68.94V24h-.884Zm3.942 0v-7h4.838v.833h-3.954v2.139h3.707v.82H72.88v2.387h4.116V24h-5Zm7-.012v-6.986h2.498a6.34 6.34 0 0 1 1.295.102c.392.08.757.253 1.063.505.386.317.68.729.85 1.19.207.535.307 1.103.292 1.674.006.475-.06.949-.198 1.404a3.4 3.4 0 0 1-.49 1.022 2.293 2.293 0 0 1-.665.629 2.596 2.596 0 0 1-.864.36 5.184 5.184 0 0 1-1.167.111l-2.614-.011Zm.957-.82h1.552c.394.019.788-.026 1.167-.135a1.57 1.57 0 0 0 .653-.36c.247-.249.43-.552.538-.886.133-.425.2-.868.198-1.314a3.187 3.187 0 0 0-.373-1.685 1.89 1.89 0 0 0-.911-.797 4.115 4.115 0 0 0-1.237-.136h-1.587v5.313Z" />
            </svg>
          </a>
        </div>

        {/* Bottom divider line */}
        <div
          className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMaskHorizontal}
        />
        <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </div>
    </motion.section>
  );
}

export default ColophonSection;
