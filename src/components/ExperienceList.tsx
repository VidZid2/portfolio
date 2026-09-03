"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

import { experiences } from "@/data/experienceData";
import { type CarouselApi } from "@/components/ui/carousel";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";
import { TechBadge } from "@/components/TechBadge";

export function ExperienceList({ activeTab, carouselApi }: { activeTab?: string; carouselApi?: CarouselApi }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselApi || !containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      carouselApi.reInit();
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [carouselApi]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setOpenIdx(null);
    });
    return () => cancelAnimationFrame(frameId);
  }, [activeTab]);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  return (
    <div ref={containerRef} className="block">
      {experiences.map((item, idx) => {
        const isOpen = openIdx === idx;

        return (
          <motion.div 
            key={idx} 
            className="group relative"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 15 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
            }}
          >
            {/* Dashed bottom border for all items */}
            <div
              className="absolute bottom-0 left-[-16px] right-[-16px] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
              style={{
                maskImage:
                  DOT_MASK_HORIZONTAL.maskImage,
                WebkitMaskImage:
                  DOT_MASK_HORIZONTAL.WebkitMaskImage,
              }}
            />



            <div
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenIdx(isOpen ? null : idx);
                }
              }}
              className="group/item flex flex-row items-center justify-between gap-2 sm:gap-4 py-3.5 px-4 -mx-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer active:cursor-grabbing select-none relative z-20 rounded-lg sm:py-4 overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
            >
              {item.title === "STI eLMS 2.0" && (hoveredIdx === idx || isOpen) && (
                <div className="absolute inset-0 z-0 opacity-100 transition-opacity duration-500 pointer-events-none animate-in fade-in">
                  <FlickeringGrid
                    className="size-full"
                    squareSize={4}
                    gridGap={6}
                    color="#6495ED"
                    maxOpacity={0.15}
                    flickerChance={0.1}
                  />
                </div>
              )}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 relative z-10">
                <div className="size-10 shrink-0 rounded-[10px] border border-black/10 bg-zinc-50 p-[2px] shadow-sm shadow-black/15 dark:border-zinc-800 dark:bg-[#111111] dark:shadow-md dark:shadow-black/50">
                  <div className="w-full h-full rounded-[7px] border border-black/5 dark:border-black/20 bg-white dark:bg-[#111111] flex items-center justify-center overflow-hidden relative">
                    <Image
                      src={item.src}
                      alt={item.title}
                      width={40}
                      height={40}
                      sizes="40px"
                      quality={60}
                      style={item.imageZoom ? { transform: `scale(${item.imageZoom})` } : undefined}
                      className={`${item.imageFit === "contain" ? "object-contain" : "object-cover"} w-full h-full`}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 pr-2 sm:pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold leading-tight sm:text-[17px] truncate text-zinc-900 dark:text-zinc-100">
                      {item.title === "Vercel OSS Program x VengenceUI" ? (
                        <>
                          <span className="sm:hidden truncate">Vercel OSS Program x VengenceUI</span>
                          <span className="hidden flex-wrap items-center gap-x-2 gap-y-1 align-middle sm:inline-flex">
                            <span className="inline-flex h-10 items-center">
                              Vercel OSS Program
                            </span>
                            <span className="inline-flex h-10 items-center text-[13px] font-semibold leading-none text-zinc-500 dark:text-zinc-500">
                              x
                            </span>
                            <span className="inline-flex h-10 items-center gap-2 leading-none">
                              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-black/10 bg-zinc-50 p-[2px] shadow-sm shadow-black/15 dark:border-zinc-800 dark:bg-[#111111] dark:shadow-md dark:shadow-black/50">
                                <span className="inline-flex size-full items-center justify-center overflow-hidden rounded-[7px] border border-black/5 bg-white dark:border-black/20">
                                  <Image
                                    src="/Experience-image/vengenceui-title-bg-less.png"
                                    alt=""
                                    width={113}
                                    height={96}
                                    sizes="40px"
                                    quality={60}
                                    aria-hidden="true"
                                    className="h-[18px] w-auto -translate-x-px translate-y-px rotate-180 object-contain"
                                  />
                                </span>
                              </span>
                              <span className="inline-flex h-10 items-center">
                                VengenceUI
                              </span>
                            </span>
                          </span>
                        </>
                      ) : (
                        item.title
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <span
                      className={`${item.title === "Vercel OSS Program x VengenceUI" ? "sm:-mt-2" : ""} text-[13px] sm:text-[15px] text-zinc-600 dark:text-zinc-400 truncate`}
                    >
                      {item.role}
                    </span>
                    {item.type && (
                      <span className="inline-flex items-center self-center px-1.5 py-[1px] rounded-[4px] text-[10px] sm:text-[11px] font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-700/50 whitespace-nowrap shrink-0">
                        {item.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5 text-right shrink-0 relative z-10">
                <div className="flex items-center gap-1 text-[12px] sm:text-[14px] font-medium text-zinc-900 dark:text-zinc-100 relative">
                  <span>{item.dates}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#6495ED]" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <span className="hidden sm:block text-[13px] sm:text-[14px] text-zinc-500 dark:text-zinc-400">
                  {item.location}
                </span>
              </div>
            </div>

            {/* Expandable Details Section */}
            <div
              className={`-mx-4 grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`pb-4 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] pl-4 pr-4 sm:pl-6 sm:pr-8 text-[14px] text-zinc-600 dark:text-zinc-400 ${
                    isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                  }`}
                >
                  {item.metrics && (
                    <div className="relative -ml-4 -mr-4 sm:-ml-6 sm:-mr-8 mb-4">
                      <div className="grid max-w-full grid-cols-2 pl-4 pr-4 sm:pl-6 sm:pr-8 md:grid-cols-4">
                        {item.metrics.map((metric) => (
                          <div
                            key={metric.label}
                            className="relative min-w-0 px-3 py-2 after:absolute after:bottom-0 after:right-0 after:top-0 after:w-0 after:border-r after:border-black/30 dark:after:border-white/[0.15] after:[mask-image:repeating-linear-gradient(to_bottom,black_0,black_1px,transparent_1px,transparent_4px)] [&:nth-child(2n)]:after:hidden md:[&:not(:last-child)]:after:block md:[&:last-child]:after:hidden"
                          >
                            <p
                              className={`${metric.value.includes(" - ") ? "text-[13px]" : "text-[16px]"} whitespace-nowrap font-bold leading-none text-zinc-900 dark:text-zinc-100`}
                            >
                              {metric.value}
                            </p>
                            <p className="mt-1 text-[10px] font-medium uppercase text-zinc-400 dark:text-zinc-600">
                              {metric.label}
                            </p>
                          </div>
                        ))}
                      </div>
                      <span
                        className="pointer-events-none absolute inset-x-0 top-0 h-0 border-t border-black/30 dark:border-white/[0.15]"
                        style={{
                          maskImage:
                            DOT_MASK_HORIZONTAL.maskImage,
                          WebkitMaskImage:
                            DOT_MASK_HORIZONTAL.WebkitMaskImage,
                        }}
                      />
                      {item.metrics.length > 2 && (
                        <span
                          className="pointer-events-none absolute inset-x-0 top-1/2 h-0 border-t border-black/30 dark:border-white/[0.15] md:hidden"
                          style={{
                            maskImage:
                              DOT_MASK_HORIZONTAL.maskImage,
                            WebkitMaskImage:
                              DOT_MASK_HORIZONTAL.WebkitMaskImage,
                          }}
                        />
                      )}
                      <span
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-0 border-b border-black/30 dark:border-white/[0.15]"
                        style={{
                          maskImage:
                            DOT_MASK_HORIZONTAL.maskImage,
                          WebkitMaskImage:
                            DOT_MASK_HORIZONTAL.WebkitMaskImage,
                        }}
                      />
                      <span className="pointer-events-none absolute left-0 top-0 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/[0.25]" />
                      <span className="pointer-events-none absolute right-0 top-0 h-[2px] w-[2px] translate-x-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/[0.25]" />
                      <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-[2px] -translate-x-1/2 translate-y-1/2 bg-black/50 dark:bg-white/[0.25]" />
                      <span className="pointer-events-none absolute bottom-0 right-0 h-[2px] w-[2px] translate-x-1/2 translate-y-1/2 bg-black/50 dark:bg-white/[0.25]" />
                    </div>
                  )}

                  {item.screenshot && (
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        const isDarkNow = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
                        setSelectedImage((isDarkNow && item.darkScreenshot) ? item.darkScreenshot : item.screenshot!); 
                      }}
                      className="group/img relative mb-4 overflow-hidden rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-black/5 dark:bg-white/5 w-full cursor-zoom-in"
                    >
                      {item.darkScreenshot ? (
                        <>
                          <Image
                            src={item.screenshot}
                            alt={`${item.title} screenshot`}
                            width={1400}
                            height={1050}
                            sizes="(min-width: 768px) 40vw, calc(100vw - 3rem)"
                            quality={70}
                            className="h-auto w-full object-cover transition-transform duration-500 group-hover/img:scale-[1.02] dark:hidden block"
                          />
                          <Image
                            src={item.darkScreenshot}
                            alt={`${item.title} screenshot`}
                            width={1400}
                            height={1050}
                            sizes="(min-width: 768px) 40vw, calc(100vw - 3rem)"
                            quality={70}
                            className="h-auto w-full object-cover transition-transform duration-500 group-hover/img:scale-[1.02] hidden dark:block"
                          />
                        </>
                      ) : (
                        <Image
                          src={item.screenshot}
                          alt={`${item.title} screenshot`}
                          width={1400}
                          height={1050}
                          sizes="(min-width: 768px) 40vw, calc(100vw - 3rem)"
                          quality={70}
                          className="h-auto w-full object-cover transition-transform duration-500 group-hover/img:scale-[1.02]"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/img:bg-black/10 flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                        <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </button>
                  )}

                  {item.tldr && (
                    <div className="mb-4 text-[14px]">
                      <p>
                        <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">Summary: </strong>
                        <span className="text-zinc-600 dark:text-zinc-400">{item.tldr}</span>
                      </p>
                    </div>
                  )}

                  {!item.tldr && (
                    <ul className="mb-4 space-y-2 text-[14px] leading-relaxed">
                      {item.description
                        .split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((point, i) => {
                          return (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-zinc-400 dark:text-zinc-500 mt-[2px] text-[15px] leading-none">•</span>
                              <span className="text-zinc-600 dark:text-zinc-400">
                                {point
                                  .trim()
                                  .split(/(\*\*.*?\*\*)/)
                                  .map((part, partIndex) => {
                                    if (part.startsWith("**") && part.endsWith("**")) {
                                      return (
                                        <strong
                                          key={partIndex}
                                          className="font-semibold text-zinc-800 dark:text-zinc-200"
                                        >
                                          {part.slice(2, -2)}
                                        </strong>
                                      );
                                    }
                                    return part;
                                  })}
                              </span>
                            </li>
                          );
                        })}
                    </ul>
                  )}

                  {item.tech && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
                      {item.tech.map((tech) => (
                        <TechBadge key={tech} name={tech} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

        {hydrated && createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 sm:p-8 backdrop-blur-sm cursor-zoom-out"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-h-full max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedImage}
                  alt="Expanded screenshot"
                  width={2800}
                  height={2100}
                  quality={90}
                  className="h-auto max-h-[85vh] w-auto object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/80 hover:text-white backdrop-blur-md"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
