"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Code2,
  FileText,
  GraduationCap,
  MapPin,
  Sparkles,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { playHoverTick, playSoftClick, playToastError } from "@/lib/synth-sounds";
import { LetsConnect } from "@/components/LetsConnect";
import { TransitionLink } from "@/components/TransitionLink";
import { DOT_MASK_HORIZONTAL, DOT_MASK_VERTICAL } from "@/lib/blueprint";
import { CornerMark } from "@/components/ui/corner-mark";
import { HandwritingText } from "@/components/ui/handwriting-text";

const SOCIAL_LINKS = [
  {
    name: "X",
    label: "X",
    href: "https://x.com",
    disabled: true,
    isInternal: false,
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    label: "GitHub",
    href: "https://github.com/VidZid2",
    disabled: false,
    isInternal: false,
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/josiah-deasis/",
    disabled: false,
    isInternal: false,
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
      </svg>
    ),
  },
  {
    name: "Discord",
    label: "Discord",
    href: "https://discord.com",
    disabled: false,
    isInternal: false,
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.01c.12.098.246.198.373.292a.077.077 0 0 1-.007.128 12.299 12.299 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: "Resume",
    label: "Resume",
    href: "/resume",
    disabled: false,
    isInternal: true,
    icon: (
      <FileText className="w-3.5 h-3.5" />
    ),
  },
];

export function ProfileDetailsGrid({ hasSeenScrollAnimations = false }: { hasSeenScrollAnimations?: boolean }) {
  const [timeInfo, setTimeInfo] = useState({ time: "02:00 PM", diff: "PHT" });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const phtString = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const visitorOffsetMinutes = -now.getTimezoneOffset();
      const phtOffsetMinutes = 480; // UTC+8
      const diffHours = Math.round((phtOffsetMinutes - visitorOffsetMinutes) / 60);

      let diffText = "";
      if (diffHours === 0) {
        diffText = "same timezone";
      } else if (diffHours > 0) {
        diffText = `${diffHours}h ahead`;
      } else {
        diffText = `${Math.abs(diffHours)}h behind`;
      }

      setTimeInfo({ time: phtString, diff: diffText });
    };

    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const [xErrorGrid, setXErrorGrid] = useState(false);

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playToastError(0.08);
    setXErrorGrid(true);
    setTimeout(() => setXErrorGrid(false), 500);
  };

  const dashedVerticalMask = {
    maskImage:
      DOT_MASK_VERTICAL.maskImage,
    WebkitMaskImage:
      DOT_MASK_VERTICAL.WebkitMaskImage,
  };

  return (
    <div className="flex flex-col w-[calc(100%+1.5rem)] sm:w-[calc(100%+2rem)] -mx-3 sm:-mx-4 relative">
      {/* Upper Grid (6-Box Dashboard) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 w-full relative">
        {/* Mobile/Tablet Middle Horizontal Divider 1 (between row 1 and row 2) */}
        <div
          className="lg:hidden absolute top-1/3 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
          style={DOT_MASK_HORIZONTAL}
        />
        <CornerMark position="top-left" flush className="lg:hidden top-1/3" />
        <CornerMark position="top-right" flush className="lg:hidden top-1/3" />

        {/* Mobile/Tablet Middle Horizontal Divider 2 (between row 2 and row 3) */}
        <div
          className="lg:hidden absolute top-2/3 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
          style={DOT_MASK_HORIZONTAL}
        />
        <CornerMark position="top-left" flush className="lg:hidden top-2/3" />
        <CornerMark position="top-right" flush className="lg:hidden top-2/3" />

        {/* Desktop Middle Horizontal Divider (between row 1 and row 2) */}
        <div
          className="hidden lg:block absolute top-1/2 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
          style={DOT_MASK_HORIZONTAL}
        />
        <CornerMark position="top-left" flush className="hidden lg:block top-1/2" />
        <CornerMark position="top-right" flush className="hidden lg:block top-1/2" />

        {/* Cell 1: Status */}
        <div
          onMouseEnter={() => playHoverTick(0.055)}
          className="group relative flex flex-col justify-between p-2.5 min-[360px]:p-3 sm:p-4 min-h-[96px] sm:min-h-[105px] hover:bg-zinc-50/50 dark:hover:bg-zinc-900/25 transition-colors duration-200 cursor-default"
        >
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors min-w-0">
              <span className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-emerald-500 shrink-0">
                <Sparkles className="w-3 h-3" />
              </span>
              <span className="text-[10.5px] min-[360px]:text-[11px] sm:text-[12px] font-mono tracking-tight select-none truncate">
                Status
              </span>
            </div>
            <span className="text-[9px] min-[360px]:text-[9.5px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium select-none whitespace-nowrap shrink-0">
              Active
            </span>
          </div>
          <div className="flex flex-col mt-auto leading-tight">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[13px] sm:text-[14px] font-mono font-bold text-zinc-900 dark:text-zinc-100">
                Open to Work
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">
              Internships · Freelance · Clients
            </span>
          </div>
          {/* Right vertical dashed border (col 1 in both 2-col and 3-col) */}
          <div
            className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={dashedVerticalMask}
          />
        </div>

        {/* Cell 2: Building */}
        <div
          onMouseEnter={() => playHoverTick(0.055)}
          className="group relative flex flex-col justify-between p-2.5 min-[360px]:p-3 sm:p-4 min-h-[96px] sm:min-h-[105px] hover:bg-zinc-50/50 dark:hover:bg-zinc-900/25 transition-colors duration-200 cursor-default"
        >
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors min-w-0">
              <span className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 shrink-0">
                <Code2 className="w-3 h-3" />
              </span>
              <span className="text-[10.5px] min-[360px]:text-[11px] sm:text-[12px] font-mono tracking-tight select-none truncate">
                Building
              </span>
            </div>
            <span className="text-[9px] min-[360px]:text-[9.5px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 select-none whitespace-nowrap shrink-0">
              <span className="hidden sm:inline">2023 — Now</span>
              <span className="hidden min-[360px]:inline sm:hidden">2023–Now</span>
              <span className="min-[360px]:hidden">&apos;23–Now</span>
            </span>
          </div>
          <div className="flex flex-col mt-auto leading-tight">
            <div className="flex items-baseline gap-1">
              <span className="text-[14px] sm:text-[15px] font-mono font-bold text-zinc-900 dark:text-zinc-100">
                2+
              </span>
              <span className="text-[12px] sm:text-[13px] font-mono text-zinc-600 dark:text-zinc-400">
                Years
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">
              Frontend & Full-Stack
            </span>
          </div>
          {/* Right vertical dashed line (Desktop 3-col only; in 2-col it is the rightmost column) */}
          <div
            className="hidden lg:block absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={dashedVerticalMask}
          />
        </div>

        {/* Cell 3: Location */}
        <div
          onMouseEnter={() => playHoverTick(0.055)}
          className="group relative flex flex-col justify-between p-2.5 min-[360px]:p-3 sm:p-4 min-h-[96px] sm:min-h-[105px] hover:bg-zinc-50/50 dark:hover:bg-zinc-900/25 transition-colors duration-200 cursor-default"
        >
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors min-w-0">
              <span className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 shrink-0">
                <MapPin className="w-3 h-3" />
              </span>
              <span className="text-[10.5px] min-[360px]:text-[11px] sm:text-[12px] font-mono tracking-tight select-none truncate">
                Location
              </span>
            </div>
            <span className="text-[9px] min-[360px]:text-[9.5px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 select-none whitespace-nowrap shrink-0">
              UTC+8
            </span>
          </div>
          <div className="flex flex-col mt-auto leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] sm:text-[14px] font-mono font-bold text-zinc-900 dark:text-zinc-100 truncate">
                Bulacan, Philippines
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-1 truncate">
              Open to Global Remote
            </span>
          </div>
          {/* Mobile/Tablet Right Border (col 1 in 2-col layout) */}
          <div
            className="lg:hidden absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={dashedVerticalMask}
          />
        </div>

        {/* Cell 4: Local Time */}
        <div
          onMouseEnter={() => playHoverTick(0.055)}
          className="group relative flex flex-col justify-between p-2.5 min-[360px]:p-3 sm:p-4 min-h-[96px] sm:min-h-[105px] hover:bg-zinc-50/50 dark:hover:bg-zinc-900/25 transition-colors duration-200 cursor-default"
        >
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors min-w-0">
              <span className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 shrink-0">
                <Clock className="w-3 h-3" />
              </span>
              <span className="text-[10.5px] min-[360px]:text-[11px] sm:text-[12px] font-mono tracking-tight select-none truncate">
                Local Time
              </span>
            </div>
          </div>
          <div className="flex flex-col mt-auto leading-tight">
            <span className="text-[13px] sm:text-[14px] font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {timeInfo.time}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">
              PHT ({timeInfo.diff})
            </span>
          </div>
          {/* Desktop Right Border (Col 1 in 3-col) */}
          <div
            className="hidden lg:block absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={dashedVerticalMask}
          />
        </div>

        {/* Cell 5: Focus */}
        <div
          onMouseEnter={() => playHoverTick(0.055)}
          className="group relative flex flex-col justify-between p-2.5 min-[360px]:p-3 sm:p-4 min-h-[96px] sm:min-h-[105px] hover:bg-zinc-50/50 dark:hover:bg-zinc-900/25 transition-colors duration-200 cursor-default"
        >
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors min-w-0">
              <span className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 shrink-0">
                <Terminal className="w-3 h-3" />
              </span>
              <span className="text-[10.5px] min-[360px]:text-[11px] sm:text-[12px] font-mono tracking-tight select-none truncate">
                Focus
              </span>
            </div>
          </div>
          <div className="flex flex-col mt-auto leading-tight">
            <span className="text-[13px] sm:text-[14px] font-mono font-bold text-zinc-900 dark:text-zinc-100">
              Full-Stack Eng
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">
              React, Next.js, TS & Systems
            </span>
          </div>
          {/* Right vertical dashed border (col 1 in 2-col; col 2 in 3-col) */}
          <div
            className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={dashedVerticalMask}
          />
        </div>

        {/* Cell 6: Education */}
        <div
          onMouseEnter={() => playHoverTick(0.055)}
          className="group relative flex flex-col justify-between p-2.5 min-[360px]:p-3 sm:p-4 min-h-[96px] sm:min-h-[105px] hover:bg-zinc-50/50 dark:hover:bg-zinc-900/25 transition-colors duration-200 cursor-default"
        >
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors min-w-0">
              <span className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 shrink-0">
                <GraduationCap className="w-3 h-3" />
              </span>
              <span className="text-[10.5px] min-[360px]:text-[11px] sm:text-[12px] font-mono tracking-tight select-none truncate">
                Education
              </span>
            </div>
          </div>
          <div className="flex flex-col mt-auto leading-tight">
            <span className="text-[13px] sm:text-[14px] font-mono font-bold text-zinc-900 dark:text-zinc-100 truncate">
              BS Information Tech
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-1 truncate">
              STI Meycauayan · Grad 2026
            </span>
          </div>
        </div>
      </div>

      {/* Full-width separator between Dashboard & Let's Connect */}
      <div className="relative w-full h-0">
        <div
          className="absolute top-0 left-0 right-0 h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />
        <CornerMark position="top-left" flush />
        <CornerMark position="top-right" flush />
      </div>

      {/* Let's Connect Section (Between Info Grid and Socials) */}
      <div className="relative flex flex-col py-4 sm:py-5 px-3 sm:px-4 w-full">
        <LetsConnect hasSeenScrollAnimations={hasSeenScrollAnimations} />
      </div>

      {/* Full-width separator between Let's Connect & Socials */}
      <div className="relative w-full h-0">
        <div
          className="absolute top-0 left-0 right-0 h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />
        <CornerMark position="top-left" flush />
        <CornerMark position="top-right" flush />
      </div>

      {/* Socials Row (5-Column Mathematical Blueprint Grid) */}
      <div className="relative flex items-center py-0 w-full">
        {/* Handwritten Annotation in Left Gutter outside the vertical line - PC/Desktop only */}
        <div className="absolute right-full top-[-54px] sm:top-[-56px] pr-4 sm:pr-5 hidden xl:flex flex-col items-end pointer-events-none select-none z-30 min-w-max">
          <div className="flex flex-col items-end text-right font-medium text-zinc-700 dark:text-zinc-300 select-none mr-2 -rotate-[6deg] tracking-wide gap-1">
            <HandwritingText text="feel free to reach out" delay={0.2} duration={1.3} height="30px" strokeWidth={2.0} />
            <HandwritingText text="say hi or connect" delay={0.9} duration={1.2} height="30px" strokeWidth={2.0} />
          </div>
          <svg
            width="26"
            height="18"
            viewBox="0 0 26 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-zinc-500 dark:text-zinc-400 overflow-visible mt-1 translate-x-1"
          >
            <motion.path
              d="M 3 2 C 3 7, 10 12, 23 12"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.6, ease: "easeInOut" }}
            />
            <motion.path
              d="M 17 8 L 23 12 L 17 16"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 2.2, ease: "easeOut" }}
            />
          </svg>
        </div>

        <div className="grid grid-cols-5 w-full relative">
          {SOCIAL_LINKS.map((item, idx) => (
            <div key={item.name} className="relative flex items-center justify-center">
              {item.disabled ? (
                <motion.button
                  type="button"
                  onClick={handleDisabledClick}
                  aria-label={`${item.name} (inactive)`}
                  animate={xErrorGrid ? { x: [-3, 3, -2, 2, 0] } : { x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "h-9 px-1 sm:px-2 flex items-center justify-center gap-1.5 sm:gap-2 cursor-not-allowed select-none text-[12px] sm:text-[13px] font-mono w-full transition-colors outline-none",
                    xErrorGrid
                      ? "text-red-500 dark:text-red-500 scale-105"
                      : "text-zinc-400/40 dark:text-zinc-600/50 hover:text-red-500/80 dark:hover:text-red-400/80 active:text-red-500"
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="hidden sm:inline truncate">{item.label}</span>
                </motion.button>
              ) : item.isInternal ? (
                <TransitionLink
                  href={item.href}
                  direction="right"
                  aria-label={item.name}
                  onMouseEnter={() => playHoverTick(0.055)}
                  onClick={() => playSoftClick(0.1)}
                  className="h-9 px-1 sm:px-2 flex items-center justify-center gap-1.5 sm:gap-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors text-[12px] sm:text-[13px] font-mono font-medium w-full"
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="hidden sm:inline truncate">{item.label}</span>
                </TransitionLink>
              ) : (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.name}
                  onMouseEnter={() => playHoverTick(0.055)}
                  onClick={() => playSoftClick(0.1)}
                  className="h-9 px-1 sm:px-2 flex items-center justify-center gap-1.5 sm:gap-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors text-[12px] sm:text-[13px] font-mono font-medium w-full"
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="hidden sm:inline truncate">{item.label}</span>
                </a>
              )}

              {/* Vertical Dotted Divider Line on right of each cell except the last */}
              {idx < SOCIAL_LINKS.length - 1 && (
                <div
                  className="absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
                  style={dashedVerticalMask}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full-width separator between Socials & GitHub Activity */}
      <div className="relative w-full h-0">
        <div
          className="absolute top-0 left-0 right-0 h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />
        <CornerMark position="top-left" flush />
        <CornerMark position="top-right" flush />
      </div>
    </div>
  );
}

export default ProfileDetailsGrid;
