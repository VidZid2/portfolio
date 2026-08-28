"use client";

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Award, Binary, Layers, ShieldCheck, Sparkles, Code, Zap, GraduationCap } from "lucide-react";
import { certificationsList, type EducationBullet, type EducationBadge, type CertificationData } from "@/data/educationData";
import { type CarouselApi } from "@/components/ui/carousel";
import { CertificateViewerModal } from "@/components/CertificateViewerModal";
import { playHoverTick, playSoftClick } from "@/lib/synth-sounds";
import { cn } from "@/lib/utils";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";

const BOUNCE_SPRING = {
  type: "spring",
  stiffness: 280,
  damping: 18,
  mass: 0.3,
} as const;

function quadraticBezier(start: number, control: number, end: number, progress: number) {
  const remaining = 1 - progress;
  return (
    remaining * remaining * start +
    2 * remaining * progress * control +
    progress * progress * end
  );
}

function DualToneLinkIcon({
  className = "w-3.5 h-3.5",
  grayed = false,
}: {
  className?: string;
  grayed?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Top-Right Loop */}
      <path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        className={grayed ? "stroke-zinc-400 dark:stroke-zinc-500" : "stroke-zinc-800 dark:stroke-zinc-100"}
      />
      {/* Bottom-Left Loop */}
      <path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke={grayed ? "currentColor" : "#6495ED"}
        className={grayed ? "stroke-zinc-400 dark:stroke-zinc-500" : ""}
      />
    </svg>
  );
}

const ICON_MAP = {
  award: <Award className="w-5 h-5 text-amber-500" />,
  code: <Code className="w-5 h-5 text-[#6495ED]" />,
  shield: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
  zap: <Zap className="w-5 h-5 text-purple-500" />,
  grad: <GraduationCap className="w-5 h-5 text-blue-500" />,
};

const BADGE_LUCIDE_ICONS: Record<string, React.ReactNode> = {
  award: <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
  binary: <Binary className="w-3.5 h-3.5 text-[#6495ED] shrink-0" />,
  layers: <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />,
  shield: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
  sparkles: <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />,
  code: <Code className="w-3.5 h-3.5 text-blue-500 shrink-0" />,
};

type FlatBulletItem = {
  id: number;
  text: string;
  isSub: boolean;
};

function BouncingCertificationBulletList({
  bullets,
  badges,
  isOpen,
}: {
  bullets: EducationBullet[];
  badges?: EducationBadge[];
  isOpen: boolean;
}) {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const flatItems: FlatBulletItem[] = useMemo(() => {
    const list: FlatBulletItem[] = [];
    let currentId = 0;
    bullets.forEach((b) => {
      list.push({ id: currentId++, text: b.text, isSub: false });
      if (b.subBullets && b.subBullets.length > 0) {
        b.subBullets.forEach((sub) => {
          list.push({ id: currentId++, text: sub, isSub: true });
        });
      }
    });
    return list;
  }, [bullets]);

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<number, HTMLLIElement>>(new Map());
  const selectedIndexRef = useRef(activeIndex);
  const previousIndexRef = useRef(activeIndex);
  const hasPositionRef = useRef(false);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    selectedIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (!isOpen || isHovered || flatItems.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % flatItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, isHovered, flatItems.length]);

  const snapIndicator = useCallback(() => {
    const item = flatItems[selectedIndexRef.current];
    const selectedItem = itemRefs.current.get(selectedIndexRef.current);
    if (!selectedItem || !item) return;

    animationRef.current?.stop();
    const destX = item.isSub ? 14 : 0;
    const destY = selectedItem.offsetTop + 8;
    x.set(destX);
    y.set(destY);
    hasPositionRef.current = true;
  }, [flatItems, x, y]);

  const positionIndicator = useCallback(
    (shouldAnimate: boolean) => {
      const item = flatItems[activeIndex];
      const selectedItem = itemRefs.current.get(activeIndex);
      if (!selectedItem || !item) return;

      const destinationX = item.isSub ? 14 : 0;
      const destinationY = selectedItem.offsetTop + 8;
      animationRef.current?.stop();

      if (!hasPositionRef.current || reduce || !shouldAnimate) {
        x.set(destinationX);
        y.set(destinationY);
        hasPositionRef.current = true;
        previousIndexRef.current = activeIndex;
        return;
      }

      const startX = x.get();
      const startY = y.get();
      const distanceY = destinationY - startY;
      const travel = Math.abs(distanceY);

      if (travel === 0 && Math.abs(destinationX - startX) < 1) return;

      const longJumpProgress = Math.min(1, Math.max(0, (travel - 48) / 120));
      const minX = Math.min(startX, destinationX);
      const controlX = minX - Math.min(36, Math.max(10, travel * 0.3));
      const midpointY = (startY + destinationY) / 2;
      const controlY = destinationY + (midpointY - destinationY) * longJumpProgress;

      animationRef.current = animate(0, 1, {
        ...BOUNCE_SPRING,
        stiffness: BOUNCE_SPRING.stiffness - 60 * longJumpProgress,
        damping: BOUNCE_SPRING.damping + longJumpProgress,
        mass: BOUNCE_SPRING.mass + 0.15 * longJumpProgress,
        onUpdate: (progress) => {
          x.set(quadraticBezier(startX, controlX, destinationX, progress));
          y.set(quadraticBezier(startY, controlY, destinationY, progress));
        },
        onComplete: () => {
          x.set(destinationX);
          y.set(destinationY);
        },
      });

      previousIndexRef.current = activeIndex;
    },
    [activeIndex, flatItems, reduce, x, y],
  );

  useLayoutEffect(() => {
    if (!isOpen) return;
    const shouldAnimate =
      hasPositionRef.current && previousIndexRef.current !== activeIndex;
    positionIndicator(shouldAnimate);
  }, [positionIndicator, activeIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      hasPositionRef.current = false;
      return;
    }
    const t0 = setTimeout(snapIndicator, 50);
    const t1 = setTimeout(snapIndicator, 150);
    const t2 = setTimeout(snapIndicator, 300);
    const t3 = setTimeout(snapIndicator, 520);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, snapIndicator]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || !isOpen || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(snapIndicator);
    observer.observe(list);
    return () => observer.disconnect();
  }, [snapIndicator, isOpen]);

  useLayoutEffect(
    () => () => {
      animationRef.current?.stop();
    },
    [],
  );

  return (
    <div
      className="relative overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ul
        ref={listRef}
        className="relative flex flex-col gap-2.5 list-none pl-6 overflow-visible leading-relaxed select-text"
      >
        {/* Bouncing Solid Dot Indicator */}
        <li
          aria-hidden="true"
          role="presentation"
          className="pointer-events-none absolute inset-0 list-none overflow-visible"
        >
          <motion.span
            style={{ x, y }}
            className="absolute top-0 left-2 h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 z-20 shadow-none"
          />
        </li>

        {flatItems.map((item) => {
          const isActive = item.id === activeIndex;

          return (
            <li
              key={item.id}
              ref={(node) => {
                if (node) itemRefs.current.set(item.id, node);
                else itemRefs.current.delete(item.id);
              }}
              onClick={() => {
                playSoftClick(0.1);
                setActiveIndex(item.id);
              }}
              onMouseEnter={() => {
                if (item.id !== activeIndex) {
                  playHoverTick(0.055);
                  setActiveIndex(item.id);
                }
              }}
              className={cn(
                "relative flex flex-col cursor-pointer transition-colors duration-300 group outline-none",
                item.isSub ? "ml-3.5" : "ml-0",
                isActive
                  ? "text-zinc-900 dark:text-zinc-100 font-medium"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              )}
            >
              {/* Static Background Track Dot */}
              {item.isSub ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -left-3.5 top-[8px] size-[5px] rounded-full border transition-colors duration-300 shrink-0 pointer-events-none",
                    isActive
                      ? "border-zinc-400/40 dark:border-zinc-600/40 bg-zinc-400/20"
                      : "border-zinc-400 dark:border-zinc-600 bg-transparent"
                  )}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -left-4 top-[8px] h-1.5 w-1.5 rounded-full transition-colors duration-300 shrink-0 pointer-events-none",
                    isActive
                      ? "bg-zinc-400/40 dark:bg-zinc-600/40"
                      : "bg-zinc-300 dark:bg-zinc-700"
                  )}
                />
              )}

              <p className={cn(
                "flex-1 transition-colors duration-300 leading-relaxed",
                item.isSub ? "text-[13px] sm:text-[13.5px]" : "text-[13.5px] sm:text-[14px]"
              )}>
                {item.text}
              </p>
            </li>
          );
        })}
      </ul>

      {/* Small Badges Row (Matching Skills Section - No Outline Border) */}
      {badges && badges.length > 0 && (
        <div className="pt-4 pl-6 flex flex-wrap gap-1.5 items-center">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] bg-zinc-100/90 dark:bg-zinc-800/70 hover:bg-zinc-200/90 dark:hover:bg-zinc-700/90 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 text-[12px] sm:text-[13px] font-medium transition-all duration-150 select-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              {badge.lucideIcon && BADGE_LUCIDE_ICONS[badge.lucideIcon] ? (
                BADGE_LUCIDE_ICONS[badge.lucideIcon]
              ) : badge.customSrc ? (
                <Image
                  src={badge.customSrc}
                  alt={badge.name}
                  width={14}
                  height={14}
                  unoptimized
                  loading="lazy"
                  decoding="async"
                  className="h-3.5 w-3.5 object-contain shrink-0 grayscale opacity-80"
                />
              ) : badge.icon ? (
                <Image
                  src={`https://cdn.simpleicons.org/${badge.icon}/71717a`}
                  alt={badge.name}
                  width={14}
                  height={14}
                  unoptimized
                  loading="lazy"
                  decoding="async"
                  className="h-3.5 w-3.5 opacity-80 shrink-0"
                />
              ) : null}
              <span className="leading-none">{badge.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CertificationsList({ activeTab, carouselApi }: { activeTab?: string; carouselApi?: CarouselApi }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificationData | null>(null);
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

  return (
    <div ref={containerRef} className="block mt-0">
      {certificationsList.map((item, idx) => {
        const isOpen = openIdx === idx;
        const hasPreview = Boolean(item.pdfUrl || item.imageUrl);

        return (
          <motion.div 
            key={idx} 
            className="group relative"
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 15 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
            }}
          >
            {/* Dashed bottom border between items */}
            {idx < certificationsList.length - 1 && (
              <div
                className="absolute bottom-0 left-[-16px] right-[-16px] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
                style={{
                  maskImage:
                    DOT_MASK_HORIZONTAL.maskImage,
                  WebkitMaskImage:
                    DOT_MASK_HORIZONTAL.WebkitMaskImage,
                }}
              />
            )}

            <div
              className="group/item flex flex-row items-center justify-between gap-2 sm:gap-4 py-3.5 px-4 -mx-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer active:cursor-grabbing select-none relative z-20 rounded-lg sm:py-4 overflow-hidden"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="size-10 shrink-0 rounded-[10px] border border-black/10 bg-zinc-50 p-[2px] shadow-sm shadow-black/15 dark:border-zinc-800 dark:bg-[#111111] dark:shadow-md dark:shadow-black/50">
                  <div className="w-full h-full rounded-[7px] border border-black/5 dark:border-black/20 bg-white dark:bg-[#18181b] flex items-center justify-center">
                    {ICON_MAP[item.iconName] || <Award className="w-5 h-5 text-amber-500" />}
                  </div>
                </div>
                
                <div className="flex flex-col gap-0.5 min-w-0 pr-2 sm:pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold leading-tight sm:text-[17px] truncate text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <span className="text-[13px] sm:text-[15px] text-zinc-600 dark:text-zinc-400 truncate">
                      {item.issuer}
                    </span>
                    <span className="inline-flex items-center self-center px-1.5 py-[1px] rounded-[4px] text-[10px] sm:text-[11px] font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-700/50 whitespace-nowrap shrink-0">
                      {item.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: PDF Modal Button (Active or Grayed) + Dates & chevron */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 relative z-10">
                {hasPreview ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSoftClick(0.04);
                      setSelectedCert(item);
                    }}
                    aria-label={`View certificate for ${item.title}`}
                    className="p-1.5 rounded-[6px] bg-zinc-100 hover:bg-zinc-200/90 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-all duration-150 flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-95 group/link"
                    title="View Certificate PDF / Photo"
                  >
                    <DualToneLinkIcon className="w-3.5 h-3.5 transition-transform duration-150 group-hover/link:scale-110" />
                  </button>
                ) : (
                  <div
                    aria-hidden="true"
                    className="p-1.5 rounded-[6px] bg-zinc-100/60 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-40 flex items-center justify-center select-none shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                    title="Certificate reference not available"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DualToneLinkIcon grayed className="w-3.5 h-3.5" />
                  </div>
                )}
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
              </div>
            </div>

            {/* Accordion Content (Bouncing Highlight Bullet List + Badges) */}
            <div
              className={`-mx-4 grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`pt-1 pb-5 pl-4 pr-4 sm:pl-6 sm:pr-8 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                    isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                  }`}
                >
                  <BouncingCertificationBulletList
                    bullets={item.bullets}
                    badges={item.badges}
                    isOpen={isOpen}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Responsive PDF & Certificate Viewer Modal */}
      <CertificateViewerModal
        data={selectedCert}
        isOpen={Boolean(selectedCert)}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
