"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useTransition } from "@/components/TransitionProvider";
import { motion, AnimatePresence } from "framer-motion";
import { VideoModal } from "@/components/VideoModal";
import AnimatedLink from "@/components/ruixen/animated-link";
import { StatusDot } from "@/components/ui/status-dot";
import {
  type TechIcon,
  type TechKey,
  type TechItem,
  type Project,
  iconMap,
  techNames,
  projectsData,
} from "@/data/projectsData";

export {
  type TechIcon,
  type TechKey,
  type TechItem,
  type Project,
  iconMap,
  techNames,
  projectsData,
};

export const ProjectCard = ({
  project,
  isPriority = false,
}: {
  project: Project;
  isPriority?: boolean;
}) => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [shouldLoadHoverImage, setShouldLoadHoverImage] = useState(false);
  const { resolvedTheme } = useTheme();
  const { navigate } = useTransition();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(mobile);
      if (mobile) setShouldLoadHoverImage(true);
    };
    
    // Initial check
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  const isBuilding = project.title === "Blueprint" || project.title === "Scribble3D";

  return (
    <motion.a
      href={`/projects/${project.slug}`}
      variants={{
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
      }}
      className="flex flex-col group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6495ED] focus-visible:rounded-2xl"
      onClick={(e) => {
        e.preventDefault();
        navigate(`/projects/${project.slug}`);
      }}
      onMouseEnter={() => setShouldLoadHoverImage(true)}
      onFocus={() => setShouldLoadHoverImage(true)}
      onTouchStart={() => setShouldLoadHoverImage(true)}
      aria-label={`View ${project.title} project details`}
    >
      {/* Outer Wrapper with clean, minimalist border */}
      <motion.div
        className="relative w-full aspect-[1.25] rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50/80 dark:bg-[#09090b]/80 shadow-sm hover:border-black/20 dark:hover:border-white/20 p-3.5 pb-0 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md sm:aspect-[1.4] sm:p-4 sm:pb-0"
        initial={isMobile ? "hover" : "rest"}
        animate={isMobile ? "hover" : "rest"}
        whileHover={!isMobile ? "hover" : undefined}
      >
        <div className="flex items-center justify-between z-10 min-h-[24px]">
          {project.categoryBadge ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-black/5 dark:border-white/10 text-[10.5px] font-medium text-zinc-800 dark:text-zinc-200 shadow-sm">
              <StatusDot 
                tone={project.isDown ? "error" : "success"} 
                size="sm" 
                animate={!project.isDown} 
              />
              <span>{project.categoryBadge}</span>
            </div>
          ) : project.live && project.live !== "#" ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-black/5 dark:border-white/10 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300 shadow-sm">
              <StatusDot 
                tone={project.isDown ? "error" : "success"} 
                size="sm" 
                animate={!project.isDown} 
              />
              <span>{project.isDown ? "Offline" : "Live"}</span>
            </div>
          ) : isBuilding ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-black/5 dark:border-white/10 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300 shadow-sm">
              <StatusDot tone="warning" size="sm" animate />
              <span>Building</span>
            </div>
          ) : (
            <div />
          )}

          {project.hasPin && (
            <div className="w-6 h-6 rounded-[6px] bg-transparent border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
              </svg>
            </div>
          )}
        </div>

        {/* Ambient Hover Background */}
        <motion.div
          className="absolute inset-0 z-0 overflow-hidden"
          variants={{
            rest: { opacity: 0, scale: 1 },
            hover: { opacity: 1, scale: 1.05 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {shouldLoadHoverImage && project.backgroundImage && (
            <Image
              src={(resolvedTheme === "dark" && project.darkBackgroundImage) ? project.darkBackgroundImage : project.backgroundImage}
              alt={`${project.title} background`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 70vw, 33vw"
              quality={60}
            />
          )}
        </motion.div>

        {/* Clean Interactive Hover Action Pill */}
        {project.live && project.live !== "#" && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto"
            variants={{
              rest: { scale: 0.85, opacity: 0, y: 6 },
              hover: { scale: 1, opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 dark:bg-zinc-100/95 dark:hover:bg-white text-zinc-50 dark:text-zinc-950 text-[12px] font-medium backdrop-blur-md shadow-2xl border border-white/20 dark:border-black/10 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (project.live && project.live !== "#") {
                  window.open(project.live, "_blank");
                }
              }}
            >
              <span>View Live</span>
              <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Floating screenshot sitting directly at the bottom of the outer wrapper */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-[85%] rounded-t-[10px] bg-white dark:bg-[#0a0a0a] p-0 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] z-20 border border-black/5 dark:border-white/[0.15] border-b-0"
          variants={{
            rest: { height: "78%", y: 0, x: "-50%" },
            hover: { height: "72%", y: 4, x: "-50%" },
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="size-full overflow-hidden rounded-t-[9px]">
            {project.lightModeSrc ? (
              <>
                <Image
                  src={project.lightModeSrc}
                  alt={`${project.title} preview`}
                  width={600}
                  height={400}
                  priority={isPriority}
                  sizes="(min-width: 768px) 17vw, calc(100vw - 2rem)"
                  quality={70}
                  className="size-full object-cover dark:hidden"
                />
                <Image
                  src={project.src}
                  alt={`${project.title} preview`}
                  width={600}
                  height={400}
                  priority={isPriority}
                  sizes="(min-width: 768px) 17vw, calc(100vw - 2rem)"
                  quality={70}
                  className="size-full object-cover hidden dark:block"
                />
              </>
            ) : (
              <Image
                src={project.src}
                alt={`${project.title} preview`}
                width={600}
                height={400}
                priority={isPriority}
                sizes="(min-width: 768px) 17vw, calc(100vw - 2rem)"
                quality={70}
                className="size-full object-cover"
              />
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Content Area directly below the wrapper */}
      <div className="mt-4 flex flex-col px-0.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            {project.title}
          </h3>
        </div>

        <div className="mt-2 sm:mt-1.5 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed pr-2 space-y-2">
          {project.tldr ? (
            <p>
              <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">Summary: </strong>
              <span className="text-zinc-600 dark:text-zinc-400">{project.tldr}</span>
            </p>
          ) : (
            <p>{project.description}</p>
          )}
        </div>

        <div className="relative mt-3 pt-1">
          <div className="flex items-center gap-2.5 flex-wrap pr-[90px]">
            {project.tech.map((item) => {
              const key = typeof item === "string" ? item : item.label;
              const isIconItem = typeof item === "string";
              const tooltipText = isIconItem ? techNames[item] : item.tooltip || item.label;
              const uniqueId = `${project.title}-${key}`;

              return (
                <div
                  key={key}
                  className="relative flex items-center justify-center"
                  onMouseEnter={() => setHoveredTech(uniqueId)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  {isIconItem ? (
                    (() => {
                      const TechIcon = iconMap[item];
                      return <TechIcon className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" aria-label={tooltipText} />;
                    })()
                  ) : (
                    <span className="flex items-center justify-center px-2 py-0.5 rounded-[4px] border border-black/20 dark:border-white/[0.15] text-[10px] font-medium text-zinc-600 dark:text-zinc-400 leading-none">
                      {item.label}
                    </span>
                  )}
                  <AnimatePresence>
                    {hoveredTech === uniqueId && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                      >
                        <div className="bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[10px] px-2 py-0.5 rounded shadow-xl whitespace-nowrap">
                          {tooltipText}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <AnimatedLink as="div" variant="right" className="absolute bottom-0 right-0 flex shrink-0 items-center text-[11px] font-medium text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 sm:text-[12px] mb-0.5" onClick={(e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); if (project.live) window.open(project.live, "_blank"); else if (project.github) window.open(project.github, "_blank"); }}>
            View Project
          </AnimatedLink>
        </div>
      </div>
    </motion.a>
  );
};

export function ProjectsGrid() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-col relative z-10 w-full">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-0 pb-10 md:pb-6">
          {projectsData.slice(0, 2).map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        {/* Middle Horizontal Line Container — spans between margin guides */}
        <div className="relative w-full h-0 hidden md:block">
          <div className="absolute top-0 bleed-x h-0 border-b border-foreground/10 pointer-events-none" />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-0 pt-0 md:pt-6">
          {projectsData.slice(2, 4).map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>

      {/* Video lightbox — dormant until a project sets a video URL. */}
      <VideoModal videoUrl={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}
