"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { TransitionLink } from "@/components/TransitionLink";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { ProjectCard } from "@/components/ProjectsGrid";
import { projectsData } from "@/data/projectsData";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Home } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function AllProjectsPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <BlueprintGrid
        headerSlot={
          <div className="absolute left-0 right-0 md:left-[26%] md:right-[26%] top-[22vh] h-[112px] flex items-center px-2 sm:px-4 z-50">
            <div className="flex w-full items-center justify-between">
              {/* Left: Back + Title */}
              <div className="flex items-center gap-5">
                <TransitionLink
                  href="/"
                  direction="left"
                  className="group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                </TransitionLink>
                <div className="flex flex-col justify-center">
                  <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.15),1.5px_0_0_rgba(255,80,0,0.15)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.25),1.5px_0_0_rgba(255,80,0,0.25)]">
                    All Projects
                  </h1>
                  <Breadcrumbs
                    maxItems={2}
                    items={[
                      { label: "Home", href: "/", icon: <Home className="w-3.5 h-3.5" /> },
                      { label: "All Projects" },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Top-right absolute buttons container */}
            <div className="absolute top-1.5 right-2 sm:top-3 sm:right-4 flex items-center gap-1.5 sm:gap-3 pointer-events-auto z-20">
              <CommandMenu />
              <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300 shrink-0" />
            </div>
          </div>
        }
      >
        {/* Content Section */}
        <div className="ml-0 mr-0 md:ml-[26%] md:mr-[26%] pt-[calc(22vh+112px)] pb-16 px-4 flex flex-col z-10 relative">
          <div className="relative pt-6 pb-6">
            {/* Center Vertical Line */}
            <div
              className="absolute top-0 bottom-6 left-1/2 w-0 border-r border-black/30 dark:border-white/[0.35] pointer-events-none -translate-x-1/2 hidden md:block"
              style={{
                maskImage:
                  "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
                WebkitMaskImage:
                  "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
              }}
            />
            {/* Top Center Intersection */}
            <div className="absolute top-0 left-1/2 w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 hidden md:block" />

            <div className="flex flex-col relative z-10 w-full">
              {Array.from({ length: Math.ceil(projectsData.length / 2) }).map((_, rowIndex) => {
                const rowProjects = projectsData.slice(rowIndex * 2, rowIndex * 2 + 2);
                return (
                  <div key={rowIndex} className="flex flex-col relative w-full">
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-x-10 ${
                        rowIndex === 0
                          ? "pb-10 md:pb-6 gap-y-10 md:gap-y-0"
                          : rowIndex === Math.ceil(projectsData.length / 2) - 1
                          ? "pt-0 md:pt-6 gap-y-10 md:gap-y-0"
                          : "pb-10 md:pb-6 pt-0 md:pt-6 gap-y-10 md:gap-y-0"
                      }`}
                    >
                      {rowProjects.map((project) => (
                        <ProjectCard
                          key={project.title}
                          project={project}
                          setActiveVideo={setActiveVideo}
                          isPriority={rowIndex === 0}
                        />
                      ))}
                    </div>
                    {/* Horizontal Divider after each row except the last one */}
                    {rowIndex < Math.ceil(projectsData.length / 2) - 1 && (
                      <div className="relative w-full h-0 hidden md:block">
                        <div
                          className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
                          style={{
                            maskImage:
                              "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                            WebkitMaskImage:
                              "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                          }}
                        />
                        <div className="absolute -left-4 w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
                        <div className="absolute -right-4 w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
                        <div className="absolute left-1/2 w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Separator */}
          <div className="relative mt-8">
            <div
              className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
              style={{
                maskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                WebkitMaskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              }}
            />
            <div className="absolute -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
            <div className="absolute -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          </div>
        </div>
      </BlueprintGrid>

      {/* MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-black rounded-xl overflow-hidden w-[90%] max-w-3xl shadow-2xl"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 p-2 bg-neutral-800/80 hover:bg-neutral-700 rounded-full cursor-pointer transition-colors z-50"
              >
                <X size={20} className="text-neutral-200" />
              </button>

              {activeVideo.includes("youtube") ? (
                <iframe
                  src={activeVideo}
                  className="w-full aspect-video border-0"
                  allowFullScreen
                ></iframe>
              ) : (
                <video src={activeVideo} className="w-full h-auto" controls autoPlay />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
