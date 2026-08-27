"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { TransitionLink } from "@/components/TransitionLink";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { ProjectCard } from "@/components/ProjectsGrid";
import { projectsData } from "@/data/projectsData";
import { ArrowLeft, Home } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DOT_MASK_HORIZONTAL, DOT_MASK_VERTICAL } from "@/lib/blueprint";

export default function AllProjectsPage() {
  return (
    <>
      <BlueprintGrid
        headerSlot={
          <div className="absolute left-3 right-3 sm:left-4 sm:right-4 md:left-[24.5%] md:right-[24.5%] top-[22vh] h-[112px] flex items-center px-2 sm:px-4 z-50">
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
              <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300 shrink-0" />
              <CommandMenu />
            </div>
          </div>
        }
      >
        {/* Content Section */}
        <div className="ml-3 mr-3 sm:ml-4 sm:mr-4 md:ml-[24.5%] md:mr-[24.5%] md:mx-0 pt-[calc(22vh+112px)] pb-16 px-3 sm:px-4 flex flex-col z-10 relative">
          <div className="relative pt-6 pb-6">
            {/* Center Vertical Line */}
            <div
              className="absolute top-0 bottom-6 left-1/2 w-0 border-r border-black/30 dark:border-white/[0.35] pointer-events-none -translate-x-1/2 hidden md:block"
              style={{
                maskImage:
                  DOT_MASK_VERTICAL.maskImage,
                WebkitMaskImage:
                  DOT_MASK_VERTICAL.WebkitMaskImage,
              }}
            />

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
                              DOT_MASK_HORIZONTAL.maskImage,
                            WebkitMaskImage:
                              DOT_MASK_HORIZONTAL.WebkitMaskImage,
                          }}
                        />
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
                  DOT_MASK_HORIZONTAL.maskImage,
                WebkitMaskImage:
                  DOT_MASK_HORIZONTAL.WebkitMaskImage,
              }}
            />
          </div>
        </div>
      </BlueprintGrid>
    </>
  );
}
