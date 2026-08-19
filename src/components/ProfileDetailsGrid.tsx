"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  Lightbulb, 
  MapPin, 
  Phone, 
  Link2, 
  Clock, 
  Mail, 
  User,
  Globe
} from "lucide-react";
import { playSoftClick, playHoverTick } from "@/lib/synth-sounds";

const SOCIAL_LINKS = [
  {
    name: "X",
    href: "https://x.com",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/VidZid2",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
      </svg>
    ),
  },
  {
    name: "Projects",
    href: "https://josiahdeasis.dev",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.com",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.01c.12.098.246.198.373.292a.077.077 0 0 1-.007.128 12.299 12.299 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export function ProfileDetailsGrid() {
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

  const dashedMask = {
    maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
    WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  };

  const dashedVerticalMask = {
    maskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
    WebkitMaskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
  };

  return (
    <div className="relative w-full flex flex-col z-10">
      {/* Top dashed boundary line */}
      <div
        className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={dashedMask}
      />
      <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

      {/* 2-Column Info Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 py-3 text-[13px] font-mono">
        {/* Vertical divider line for desktop */}
        <div
          className="hidden sm:block absolute top-0 bottom-0 left-1/2 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedVerticalMask}
        />

        {/* Left Column */}
        <div className="flex flex-col gap-2">
          {/* Row 1: Role */}
          <div className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate">
              Full-Stack Front-End Engineer
            </span>
          </div>

          {/* Row 2: Secondary Role */}
          <div className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate">
              UI Systems Architect
            </span>
          </div>

          {/* Row 3: Location */}
          <div className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="text-zinc-600 dark:text-zinc-400 truncate">
              Bulacan, Philippines
            </span>
          </div>

          {/* Row 4: Phone / Contact */}
          <div className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <a
              href="tel:+639458351588"
              onClick={() => playSoftClick(0.04)}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors truncate"
            >
              +63 945 835 1588
            </a>
          </div>

          {/* Row 5: Domain URL */}
          <div className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
              <Link2 className="w-3.5 h-3.5" />
            </div>
            <a
              href="https://josiahdeasis.dev"
              target="_blank"
              rel="noreferrer"
              onClick={() => playSoftClick(0.04)}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors truncate"
            >
              josiahdeasis.dev
            </a>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-2 sm:pl-4">
          {/* Row 1: Time */}
          <div className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
              {timeInfo.time}{" "}
              <span className="text-zinc-400 dark:text-zinc-500 font-normal">
                // {timeInfo.diff}
              </span>
            </span>
          </div>

          {/* Row 2: Email */}
          <div className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <a
              href="mailto:contact@josiahdeasis.com"
              onClick={() => playSoftClick(0.04)}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors truncate"
            >
              contact@josiahdeasis.com
            </a>
          </div>

          {/* Row 3: Pronouns */}
          <div className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-zinc-600 dark:text-zinc-400">he/him</span>
          </div>
        </div>
      </div>

      {/* Full-width dashed separator between Info Grid & Socials */}
      <div className="relative w-full h-0">
        <div
          className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMask}
        />
        <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      </div>

      {/* Socials Row (Matching Reference Picture 2) */}
      <div className="relative flex items-center py-2.5">
        {/* Handwritten Annotation in Left Gutter outside the vertical line */}
        <div className="absolute right-full top-[-12px] pr-2.5 hidden sm:flex flex-col items-end pointer-events-none select-none z-30 min-w-max">
          <span className="inline-block font-caveat italic text-[17px] sm:text-[18px] font-medium text-zinc-600 dark:text-zinc-400 leading-none whitespace-nowrap -rotate-[8deg] tracking-wide select-none">
            say hi
          </span>
          <svg
            width="24"
            height="22"
            viewBox="0 0 24 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-zinc-400 dark:text-zinc-500 overflow-visible mt-0.5"
          >
            <path
              d="M 4 2 C 4 8, 8 15, 20 15"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <path
              d="M 15 11.5 L 21 15 L 16 18.5"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Mobile-only fallback */}
        <div className="flex sm:hidden items-center gap-1 font-caveat italic text-[14px] text-zinc-600 dark:text-zinc-400 select-none shrink-0 mr-2 -mt-0.5">
          <span className="whitespace-nowrap -rotate-[4deg] inline-block">say hi ↘</span>
        </div>

        {/* Social Icon Tiles - Flush with left edge */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {SOCIAL_LINKS.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.name}
              onMouseEnter={() => playHoverTick(0.02)}
              onClick={() => playSoftClick(0.04)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-8 h-8 rounded-lg border border-black/20 dark:border-white/[0.12] bg-zinc-100/80 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center shadow-sm"
            >
              {item.icon}
            </motion.a>
          ))}
        </div>
      </div>

      {/* Full-width dashed separator between Socials & GitHub Activity */}
      <div className="relative w-full h-0">
        <div
          className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={dashedMask}
        />
        <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      </div>
    </div>
  );
}

export default ProfileDetailsGrid;
