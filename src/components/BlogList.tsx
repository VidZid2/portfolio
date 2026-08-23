"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { blogsData } from "@/data/blogsData";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedLink from "@/components/ruixen/animated-link";
import Image from "next/image";
import { iconMap, techNames } from "@/data/projectsData";
import { useTransition } from "@/components/TransitionProvider";
import { useTheme } from "next-themes";
import { AsciiWordmark } from "@/components/ui/ascii-wordmark";

// The RealClapIcon has been moved to /public/clap.svg

export function BlogList() {
  const [hoveredBlog, setHoveredBlog] = useState<number | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const { navigate } = useTransition();
  const [isMobile, setIsMobile] = useState(false);
  const { resolvedTheme } = useTheme();
  const glyphColor =
    resolvedTheme === "dark" ? "#6495ED" : resolvedTheme === "light" ? "#000000" : "#6B7280";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    
    // Initial check
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper to generate a consistent placeholder gradient based on index
  const getGradient = (index: number) => {
    const gradients = [
      "from-purple-500/20 to-blue-500/20",
      "from-emerald-500/20 to-teal-500/20",
      "from-rose-500/20 to-orange-500/20",
      "from-blue-500/20 to-cyan-500/20"
    ];
    return gradients[index % gradients.length];
  };

  if (blogsData.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center justify-center sm:justify-end min-h-[200px] sm:min-h-[380px] pb-8 pt-8 sm:pt-24 mt-6 rounded-xl border border-dashed border-black/10 dark:border-white/10 bg-zinc-50/50 dark:bg-[#09090b]/50 w-full overflow-hidden"
      >
        <div className="hidden sm:block absolute inset-0 z-0 opacity-40 dark:opacity-80 scale-[1.8] sm:scale-100 transition-transform duration-500">
          <AsciiWordmark
            word="SOON"
            inkColor={glyphColor}
            className="w-full h-full"
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center pointer-events-none drop-shadow-md">
          <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 mb-1">More writing coming soon</h3>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 text-center max-w-sm px-4">
            I&apos;m currently working on some new content. Check back later for deep dives into front-end architecture and animation.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-10 pb-10 mt-6">
      {blogsData.slice(0, 2).map((blog, idx) => {
        return (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 20 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
            }}
            className="flex flex-col group cursor-pointer"
            onMouseEnter={() => setHoveredBlog(idx)}
            onMouseLeave={() => setHoveredBlog(null)}
          >
            <Link
              href={blog.link}
              target={blog.isExternal ? "_blank" : undefined}
              rel={blog.isExternal ? "noopener noreferrer" : undefined}
              className="flex flex-col"
              onClick={(e) => {
                if (!blog.isExternal) {
                  e.preventDefault();
                  navigate(blog.link);
                }
              }}
            >
              {/* Image / Card Wrapper similar to Projects */}
              <motion.div
                className="relative w-full aspect-[1.4] rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50/80 dark:bg-[#09090b]/80 shadow-sm p-3.5 pb-0 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md hover:border-black/10 dark:hover:border-white/10"
                initial={isMobile ? "hover" : "rest"}
                animate={isMobile || hoveredBlog === idx ? "hover" : "rest"}
              >
                {/* Decorative header dots (mac style) inside the card */}
                <div className="flex items-center gap-1.5 z-10 min-h-[24px]">
                  <div className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10" />
                </div>

                {/* Ambient Hover Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${getGradient(idx)} opacity-50`}
                  variants={{
                    rest: { opacity: 0.3, scale: 1 },
                    hover: { opacity: 1, scale: 1.05 },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />

                <motion.h1
                  className="absolute top-4 right-4 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 z-30 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                  variants={{
                    rest: { opacity: 0, x: 10 },
                    hover: { opacity: 1, x: 0 },
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  Read Blog
                </motion.h1>

                {/* Floating placeholder card directly at the bottom */}
                <motion.div
                  className="absolute bottom-0 left-1/2 w-[85%] rounded-t-[10px] bg-white dark:bg-[#0a0a0a] p-0 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] z-20 border border-black/5 dark:border-white/[0.15] border-b-0 flex items-center justify-center overflow-hidden"
                  variants={{
                    rest: { height: "78%", y: 0, x: "-50%" },
                    hover: { height: "72%", y: 4, x: "-50%" },
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Inner Pattern / Icon to make it look like a placeholder */}
                  <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                  <div className="relative z-10 flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-50">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>

              {/* Content Area directly below the wrapper */}
              <div className="mt-4 flex flex-col px-0.5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[14px] md:text-[15px] font-bold text-zinc-900 dark:text-zinc-100 transition-colors leading-tight">
                    {blog.title}
                  </h3>
                </div>

                <p className="mt-2 sm:mt-1.5 text-[12px] md:text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed pr-2">
                  {blog.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] md:text-[12px] text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{blog.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 font-medium">
                    <Image src="/SVG's/Blog%20SVG's/Star.svg" alt="Stars" width={14} height={14} unoptimized className="w-3.5 h-3.5" />
                    <span>{blog.claps}</span>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="mt-3 flex flex-wrap items-center gap-3 pr-[90px]">
                  {blog.techIcons?.map((techKey, iconIdx) => {
                    const uniqueId = `blog-${idx}-icon-${iconIdx}`;
                    const TechIcon = iconMap[techKey];
                    const tooltipText = techNames[techKey];
                    return (
                      <div
                        key={iconIdx}
                        className="relative flex items-center justify-center"
                        onMouseEnter={() => setHoveredTag(uniqueId)}
                        onMouseLeave={() => setHoveredTag(null)}
                      >
                        <TechIcon className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" />
                        <AnimatePresence>
                          {hoveredTag === uniqueId && (
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
                
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {blog.tags.map((tag, tagIdx) => {
                    const uniqueId = `blog-${idx}-tag-${tagIdx}`;
                    return (
                      <div
                        key={tagIdx}
                        className="relative flex items-center justify-center"
                        onMouseEnter={() => setHoveredTag(uniqueId)}
                        onMouseLeave={() => setHoveredTag(null)}
                      >
                        <span
                          className="flex items-center justify-center px-2 py-0.5 rounded-[4px] border border-black/20 dark:border-white/[0.15] text-[10px] md:text-[11px] font-medium text-zinc-600 dark:text-zinc-400 leading-none"
                        >
                          {tag}
                        </span>
                        <AnimatePresence>
                          {hoveredTag === uniqueId && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                            >
                              <div className="bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[10px] px-2 py-0.5 rounded shadow-xl whitespace-nowrap">
                                {tag}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                <AnimatedLink as="div" variant="right" className="absolute bottom-0 right-0 flex shrink-0 items-center text-[11px] font-medium text-zinc-500 transition-colors cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 sm:text-[12px] mb-0.5" onClick={(e: React.MouseEvent) => { e.stopPropagation(); if (blog.link) window.open(blog.link, "_blank"); }}>
                  View blog
                </AnimatedLink>
              </div>
            </div>
          </Link>  </motion.div>
        );
      })}
    </div>
  );
}
