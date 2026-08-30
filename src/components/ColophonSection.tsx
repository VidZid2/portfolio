"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { DrawUnderlineLink } from "@/components/sora-ui/texts/draw-underline-link";
import { useTransition } from "@/components/TransitionProvider";
import { playToastError, playSoftClick } from "@/lib/synth-sounds";
import { DOT_MASK_HORIZONTAL, DOT_MASK_VERTICAL } from "@/lib/blueprint";
import { CornerMark } from "@/components/ui/corner-mark";
import LogoTraceLoader from "@/components/ui/logo-trace-loader";

const dashedMaskHorizontal = {
  maskImage:
    DOT_MASK_HORIZONTAL.maskImage,
  WebkitMaskImage:
    DOT_MASK_HORIZONTAL.WebkitMaskImage,
};

const dashedMaskVertical = {
  maskImage:
    DOT_MASK_VERTICAL.maskImage,
  WebkitMaskImage:
    DOT_MASK_VERTICAL.WebkitMaskImage,
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
  const footerLogoRef = useRef<HTMLDivElement>(null);
  const isFooterInView = useInView(footerLogoRef, { once: true, margin: "-10px" });

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
      {/* Corner marks matching the rest of the site */}
      <CornerMark position="top-left" flush />
      <CornerMark position="top-right" flush />
      <CornerMark position="bottom-left" flush />
      <CornerMark position="bottom-right" flush />

      {/* Top full-width line */}
      <div
        className="absolute top-0 left-0 right-0 h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={dashedMaskHorizontal}
      />

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
          className="absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMaskHorizontal}
        />
        {/* Left & Right Corner Intersection Node Dots */}
        <div className="absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-30 left-0 bottom-0 -translate-x-1/2 translate-y-1/2" />
        <div className="absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-30 right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
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
              tabIndex={0}
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
        {/* Left & Right Corner Intersection Node Dots */}
        <div className="absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-30 left-0 bottom-0 -translate-x-1/2 translate-y-1/2" />
        <div className="absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-30 right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
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
        {/* Left & Right Corner Intersection Node Dots */}
        <div className="absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-30 left-0 bottom-0 -translate-x-1/2 translate-y-1/2" />
        <div className="absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-30 right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
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
        {/* Left & Right Corner Intersection Node Dots */}
        <div className="absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-30 left-0 bottom-0 -translate-x-1/2 translate-y-1/2" />
        <div className="absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-30 right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
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
          className="absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMaskHorizontal}
        />
        {/* Left & Right Corner Intersection Node Dots */}
        <div className="absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-30 left-0 bottom-0 -translate-x-1/2 translate-y-1/2" />
        <div className="absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-30 right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Row 6: Bottom Copyright & Socials */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between py-1 sm:py-1.5 px-3 sm:px-4 gap-2 sm:gap-4 min-h-[44px]">
        {/* Left: Brand Monogram Animated Trace Logo */}
        <div ref={footerLogoRef} className="flex items-center">
          <LogoTraceLoader
            loading={!isFooterInView}
            isComplete={isFooterInView}
            size={38}
            strokeWidth={180}
            className="text-[#6495ED] shrink-0"
          />
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
          <div
            className="w-0 h-[15px] sm:h-[16px] border-r border-black/30 dark:border-white/[0.15] shrink-0 pointer-events-none"
            style={dashedMaskVertical}
          />

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
          <div
            className="w-0 h-[15px] sm:h-[16px] border-r border-black/30 dark:border-white/[0.15] shrink-0 pointer-events-none"
            style={dashedMaskVertical}
          />

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
          <div
            className="w-0 h-[15px] sm:h-[16px] border-r border-black/30 dark:border-white/[0.15] shrink-0 pointer-events-none"
            style={dashedMaskVertical}
          />

          {/* Code of Conduct */}
          <a
            href="https://github.com/VidZid2/portfolio/blob/main/CODE_OF_CONDUCT.md"
            target="_blank"
            rel="noopener noreferrer"
            title="Code of Conduct"
            aria-label="Code of Conduct"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center justify-center shrink-0 p-0.5"
          >
            <svg
              className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px]"
              viewBox="0 0 2400 1792"
              fill="currentColor"
            >
              <g transform="translate(0,1792) scale(0.1,-0.1)">
                <path d="M9915 14164 c-442 -45 -788 -155 -1125 -357 -212 -128 -477 -361 -633 -557 -479 -602 -676 -1367 -556 -2157 114 -749 514 -1496 1148 -2146 l154 -157 -31 -63 c-18 -34 -38 -89 -47 -122 -19 -76 -19 -243 0 -315 67 -252 297 -443 552 -458 l82 -4 6 -67 c15 -162 82 -299 198 -407 105 -99 224 -151 367 -162 l85 -7 6 -71 c14 -157 72 -279 184 -390 113 -112 255 -174 401 -174 l71 0 11 -84 c28 -215 145 -389 328 -484 112 -58 194 -75 319 -69 181 10 290 63 456 224 l115 112 90 -90 c166 -168 286 -228 469 -237 185 -8 341 53 470 183 112 113 165 220 188 382 l13 84 78 5 c310 19 569 270 593 575 l6 77 81 7 c235 20 432 153 535 361 37 76 52 131 60 224 l6 75 79 7 c250 23 470 193 553 430 20 54 27 100 31 178 5 117 -9 190 -55 292 l-26 58 120 127 c585 625 949 1293 1087 1998 50 255 66 634 37 860 -82 642 -317 1152 -726 1574 -425 438 -943 680 -1590 742 -132 13 -441 7 -565 -11 -307 -44 -576 -129 -839 -266 -220 -114 -409 -251 -609 -439 l-92 -87 -103 98 c-392 378 -851 602 -1407 689 -101 16 -483 28 -575 19z m531 -349 c479 -71 873 -266 1236 -613 l91 -88 -494 -535 c-687 -744 -1066 -1152 -1333 -1439 -125 -135 -235 -258 -244 -275 -22 -42 -21 -122 3 -163 24 -40 143 -121 270 -185 216 -107 413 -145 650 -127 152 12 281 47 413 110 205 99 254 140 652 541 361 364 366 368 413 375 34 4 60 2 90 -10 34 -13 289 -266 1357 -1347 1084 -1097 1320 -1340 1344 -1387 25 -48 30 -69 30 -132 1 -62 -4 -85 -27 -132 -54 -109 -152 -172 -272 -172 -130 0 -93 -32 -885 759 -492 491 -724 716 -743 721 -71 17 -147 -10 -191 -69 -28 -37 -33 -123 -9 -163 10 -18 329 -345 709 -729 550 -554 697 -707 717 -748 103 -212 -46 -445 -281 -440 -116 3 -102 -9 -877 764 -632 630 -715 709 -752 719 -87 22 -177 -30 -204 -118 -27 -92 -57 -58 711 -827 785 -788 754 -751 754 -895 1 -62 -4 -85 -27 -132 -74 -151 -242 -213 -392 -145 -54 25 -116 83 -576 545 -553 553 -549 550 -634 536 -30 -5 -52 -18 -86 -53 l-45 -47 -28 58 c-35 71 -136 183 -211 232 -67 45 -161 81 -249 97 l-66 11 0 70 c0 259 -157 490 -398 586 -62 24 -78 26 -207 26 -102 0 -151 -4 -180 -15 l-40 -16 -26 78 c-63 187 -206 337 -382 399 -86 31 -267 39 -357 16 -134 -34 -181 -67 -371 -253 l-176 -173 -120 127 c-238 253 -408 465 -565 704 -442 672 -620 1417 -502 2109 107 628 463 1183 979 1523 272 179 636 301 1012 337 122 12 388 4 519 -15z" />
              </g>
            </svg>
          </a>

          {/* Separator 4 */}
          <div
            className="w-0 h-[15px] sm:h-[16px] border-r border-black/30 dark:border-white/[0.15] shrink-0 pointer-events-none"
            style={dashedMaskVertical}
          />

          {/* MIT License */}
          <a
            href="https://github.com/VidZid2/portfolio/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            title="MIT License"
            aria-label="MIT License"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center justify-center shrink-0 p-0.5"
          >
            <svg
              className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="M7 21h10" />
              <path d="M12 3v18" />
              <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
            </svg>
          </a>
        </div>

        {/* Bottom divider line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMaskHorizontal}
        />
      </div>
    </motion.section>
  );
}

export default ColophonSection;
