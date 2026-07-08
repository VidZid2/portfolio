"use client";

import * as React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Sparkles,
  Briefcase,
  FolderOpen,
  Code,
  Wrench,
  BookOpen,
} from "lucide-react";

export function GlobalContextMenu({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined") window.history.back();
  };

  const handleForward = () => {
    if (typeof window !== "undefined") window.history.forward();
  };

  const handleReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  // Note: The context menu will trigger on right click on PC and long press on Mobile automatically via Radix UI.
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="min-h-full h-full w-full">{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64 z-[9999] bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl rounded-xl p-1.5 overflow-hidden">
        
        {/* Browser Controls */}
        <ContextMenuItem
          onClick={handleBack}
          className="flex items-center gap-2 rounded-md focus:bg-black/5 dark:focus:bg-white/10 py-1.5 cursor-default"
        >
          <ChevronLeft className="h-4 w-4 text-zinc-500" />
          <span>Back</span>
          <ContextMenuShortcut className="text-zinc-400">⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={handleForward}
          className="flex items-center gap-2 rounded-md focus:bg-black/5 dark:focus:bg-white/10 py-1.5 cursor-default"
        >
          <ChevronRight className="h-4 w-4 text-zinc-500" />
          <span>Forward</span>
          <ContextMenuShortcut className="text-zinc-400">⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={handleReload}
          className="flex items-center gap-2 rounded-md focus:bg-black/5 dark:focus:bg-white/10 py-1.5 cursor-default"
        >
          <RotateCw className="h-4 w-4 text-zinc-500" />
          <span>Reload</span>
          <ContextMenuShortcut className="text-zinc-400">⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        
        <ContextMenuSeparator className="bg-black/5 dark:bg-white/5 my-1" />

        {/* Index Navigation */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2 rounded-md focus:bg-black/5 dark:focus:bg-white/10 py-1.5 cursor-default">
            <span className="flex h-4 w-4 items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
            </span>
            <span className="font-medium text-blue-600 dark:text-blue-400">Navigation Index</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl rounded-xl p-1.5">
            <ContextMenuItem onClick={() => navigateTo("/experience")} className="flex items-center gap-2 rounded-md focus:bg-black/5 dark:focus:bg-white/10 py-1.5 cursor-default">
              <Briefcase className="h-4 w-4 text-zinc-500" />
              <span>Experience</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => navigateTo("/projects")} className="flex items-center gap-2 rounded-md focus:bg-black/5 dark:focus:bg-white/10 py-1.5 cursor-default">
              <FolderOpen className="h-4 w-4 text-zinc-500" />
              <span>Projects</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => navigateTo("/open-source")} className="flex items-center gap-2 rounded-md focus:bg-black/5 dark:focus:bg-white/10 py-1.5 cursor-default">
              <Code className="h-4 w-4 text-zinc-500" />
              <span>Open Source</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => navigateTo("/skills")} className="flex items-center gap-2 rounded-md focus:bg-black/5 dark:focus:bg-white/10 py-1.5 cursor-default">
              <Wrench className="h-4 w-4 text-zinc-500" />
              <span>Skills</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => navigateTo("/blog")} className="flex items-center gap-2 rounded-md focus:bg-black/5 dark:focus:bg-white/10 py-1.5 cursor-default">
              <BookOpen className="h-4 w-4 text-zinc-500" />
              <span>Blog</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator className="bg-black/5 dark:bg-white/5 my-1" />

        {/* AI Action */}
        <ContextMenuItem
          className="flex items-center gap-2 rounded-md focus:bg-purple-500/10 dark:focus:bg-purple-500/20 py-1.5 text-purple-600 dark:text-purple-400 font-medium cursor-default"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask AI</span>
        </ContextMenuItem>
        
      </ContextMenuContent>
    </ContextMenu>
  );
}
