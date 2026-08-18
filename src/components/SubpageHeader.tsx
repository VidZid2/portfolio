"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { TransitionLink } from "@/components/TransitionLink";

interface SubpageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  extraControls?: React.ReactNode;
}

export function SubpageHeader({
  title,
  subtitle,
  backHref = "/",
  extraControls,
}: SubpageHeaderProps) {
  return (
    <div className="absolute left-0 right-0 md:left-[26%] md:right-[26%] top-[22vh] h-[112px] flex items-center px-4 z-50">
      <div className="flex w-full items-center justify-between">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-5">
          {backHref && (
            <TransitionLink
              href={backHref}
              direction="left"
              className="group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </TransitionLink>
          )}
          <div className="flex flex-col justify-center">
            <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.15),1.5px_0_0_rgba(255,80,0,0.15)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.25),1.5px_0_0_rgba(255,80,0,0.25)]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-start justify-end gap-1.5 sm:gap-3 h-24 py-1 pointer-events-auto shrink-0">
          {extraControls}
          <CommandMenu />
          <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300 shrink-0" />
        </div>
      </div>
    </div>
  );
}

export default SubpageHeader;
