"use client";

import React, {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import Image from "next/image";
import {
  CenterMorphModal,
  CenterMorphModalContent,
} from "@/components/motion/center-morph-modal";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CurvedMenu } from "@/components/ui/curved-menu";
import { CylinderCarousel } from "@/components/motion/cylinder-carousel";
import { playSoftClick } from "@/lib/synth-sounds";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { DOT_MASK_HORIZONTAL, DOT_MASK_VERTICAL } from "@/lib/blueprint";
import { CornerMark } from "@/components/ui/corner-mark";
import { cn } from "@/lib/utils";
import { HandwritingText } from "@/components/ui/handwriting-text";

/** How long each logo stays visible before cycling to the next one (ms). */
const CYCLE_INTERVAL = 2600;

/** Delay between adjacent columns within a single wave (ms). */
const STAGGER_DELAY = 125;

/** Duration of a single enter or exit transition (s). */
const TRANSITION_DURATION = 0.45;

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

export interface InspirationItem {
  id: string | number;
  name: string;
  category: "components" | "motion" | "systems" | "portfolios";
  description?: string;
  url?: string;
  svgPath: string;
  darkSvgPath?: string;
  imageFallback?: string;
  /** Whether monochrome black/dark logo should invert to white in dark mode */
  invertInDark?: boolean;
}

export const CATEGORIES = [
  { id: "all", label: "All", count: 20, icon: "✦" },
  { id: "components", label: "Component Kits", count: 6, icon: "🧩" },
  { id: "motion", label: "Motion & Physics", count: 5, icon: "⚡" },
  { id: "systems", label: "Design Systems", count: 5, icon: "📐" },
  { id: "portfolios", label: "Creative Portfolios", count: 4, icon: "✨" },
] as const;

/**
 * ALL 20 COMPONENT & WEBSITE INSPIRATIONS WITH FULL DARK MODE COMPATIBILITY & CASE-SENSITIVE PATHS
 */
export const INSPIRATIONS: InspirationItem[] = [
  {
    id: 1,
    name: "Aceternity UI",
    category: "components",
    description: "Trending UI components and copy-paste interactive React & Tailwind CSS elements.",
    url: "https://ui.aceternity.com",
    svgPath: "/component-inspirations/acernity-ui.svg",
    imageFallback: "/component-inspirations/acernity-ui.png",
    invertInDark: true,
  },
  {
    id: 2,
    name: "Magic UI",
    category: "motion",
    description: "50+ animated components built with React, Tailwind CSS, and Framer Motion.",
    url: "https://magicui.design",
    svgPath: "/component-inspirations/magic-ui.svg",
    darkSvgPath: "/component-inspirations/magic-ui-dark.svg",
    imageFallback: "/component-inspirations/magic-ui.png",
  },
  {
    id: 3,
    name: "Chánh Đại",
    category: "portfolios",
    description: "Minimalist portfolio architecture with grid physics, blueprint lines & micro-interactions.",
    url: "https://chanhdai.com",
    svgPath: "/component-inspirations/chanhdai.svg",
    imageFallback: "/component-inspirations/chanhdai.png",
    invertInDark: true,
  },
  {
    id: 4,
    name: "Cult UI",
    category: "motion",
    description: "Curated UI components with playful physics, fluid spring transitions & clean animations.",
    url: "https://www.cult-ui.com",
    svgPath: "/component-inspirations/cult-ui.svg",
    imageFallback: "/component-inspirations/cult-ui.png",
    invertInDark: true,
  },
  {
    id: 5,
    name: "CuiCui UI",
    category: "components",
    description: "Ready-to-use modern web components for Tailwind CSS and React developers.",
    url: "https://cuicui.day",
    svgPath: "/component-inspirations/cuicui-ui.svg",
    imageFallback: "/component-inspirations/cuicui-ui.png",
    invertInDark: false,
  },
  {
    id: 6,
    name: "Fancy Components",
    category: "motion",
    description: "Creative, experimental UI components with high-end typography and visual flair.",
    url: "https://fancycomponents.dev",
    svgPath: "/component-inspirations/fancy-components.svg",
    imageFallback: "/component-inspirations/fancy-components.png",
    invertInDark: true,
  },
  {
    id: 7,
    name: "Sora UI",
    category: "components",
    description: "Clean, minimalist component system engineered for modern high-performance web apps.",
    url: "https://soraui.com",
    svgPath: "/component-inspirations/sora-ui.svg",
    imageFallback: "/component-inspirations/sora-ui.png",
    invertInDark: true,
  },
  {
    id: 8,
    name: "Ruixen UI",
    category: "components",
    description: "Polished UI elements, fluid hero sections, and elegant interactive micro-animations.",
    url: "https://ruixen.com",
    svgPath: "/component-inspirations/ruixen-ui.svg",
    imageFallback: "/component-inspirations/ruixen-ui.png",
    invertInDark: true,
  },
  {
    id: 9,
    name: "Origin Kit UI",
    category: "components",
    description: "Comprehensive Tailwind CSS & Radix UI component library with accessible patterns.",
    url: "https://originui.com",
    svgPath: "/component-inspirations/origin-kit-ui.svg",
    darkSvgPath: "/component-inspirations/origin-kit-ui-dark.svg",
    imageFallback: "/component-inspirations/origin-kit-ui.png",
  },
  {
    id: 10,
    name: "Refinery UI",
    category: "systems",
    description: "Precision-crafted design elements, refined layouts, and interactive frontend components.",
    url: "https://refineryui.com",
    svgPath: "/component-inspirations/refinery-ui.svg",
    imageFallback: "/component-inspirations/refinery-ui.png",
    invertInDark: true,
  },
  {
    id: 11,
    name: "ExtendUI",
    category: "components",
    description: "Component extensions, layout primitives, and design patterns for web experiences.",
    url: "https://extend-ui.com",
    svgPath: "/component-inspirations/ExtendUI.svg",
    imageFallback: "/component-inspirations/extendui.png",
    invertInDark: true,
  },
  {
    id: 12,
    name: "Iconiq",
    category: "systems",
    description: "Design engineering inspiration, curated frontend components, and modern icon systems.",
    url: "https://iconiq.design",
    svgPath: "/component-inspirations/Iconiq.svg",
    imageFallback: "/component-inspirations/iconiq.png",
    invertInDark: true,
  },
  {
    id: 13,
    name: "BEUI",
    category: "motion",
    description: "Modern motion tokens, drawers, spring physics components, and fluid interactions.",
    url: "https://beui.design",
    svgPath: "/component-inspirations/BEUI.svg",
    imageFallback: "/component-inspirations/beui.png",
    invertInDark: true,
  },
  {
    id: 14,
    name: "Unlumen UI",
    category: "systems",
    description: "Dark-mode focused design system with subtle glowing accents and sleek aesthetics.",
    url: "https://unlumen.me",
    svgPath: "/component-inspirations/unlumen-ui.svg",
    imageFallback: "/component-inspirations/unlumen-ui.png",
    invertInDark: true,
  },
  {
    id: 15,
    name: "Vengence UI",
    category: "systems",
    description: "Cyberpunk and tech-forward UI components with sharp contrast and futuristic details.",
    url: "https://vengence.design",
    svgPath: "/component-inspirations/vengence-ui.svg",
    imageFallback: "/component-inspirations/vengence-ui.png",
    invertInDark: true,
  },
  {
    id: 16,
    name: "Watermelon UI",
    category: "systems",
    description: "Fresh, vibrant UI components with delightful interactive micro-states.",
    url: "https://watermelon.design",
    svgPath: "/component-inspirations/watermelon-ui.svg",
    darkSvgPath: "/component-inspirations/watermelon-ui-dark.svg",
    imageFallback: "/component-inspirations/watermelon-ui.png",
  },
  {
    id: 17,
    name: "Scribble Animator",
    category: "motion",
    description: "Hand-drawn SVG animations, scribble effects, and sketch notes for creative storytelling.",
    url: "https://scribbleanimator.com",
    svgPath: "/component-inspirations/scribble-animator.svg",
    imageFallback: "/component-inspirations/scribble-animator.png",
    invertInDark: true,
  },
  {
    id: 18,
    name: "Arlan Marat",
    category: "portfolios",
    description: "Creative developer portfolio featuring smooth spatial transitions and web layouts.",
    url: "https://arlanmarat.com",
    svgPath: "/component-inspirations/arlan-marat.svg",
    imageFallback: "/component-inspirations/arlan-marat.png",
    invertInDark: true,
  },
  {
    id: 19,
    name: "dqnamo's",
    category: "portfolios",
    description: "Creative design engineering portfolio with interactive canvas work and fluid animations.",
    url: "https://dqnamo.com",
    svgPath: "/component-inspirations/dqnamo.svg",
    imageFallback: "/component-inspirations/dqnamo.png",
    invertInDark: true,
  },
  {
    id: 20,
    name: "bklit",
    category: "portfolios",
    description: "Boutique frontend design studio with bespoke web layouts and typography.",
    url: "https://bklit.com",
    svgPath: "/component-inspirations/bklit.svg",
    imageFallback: "/component-inspirations/bklit.svg",
    invertInDark: false,
  },
];

function distributeLogos(
  logos: ReactNode[],
  columnCount: number
): ReactNode[][] {
  const effectiveCount = Math.min(columnCount, logos.length);
  const columns: ReactNode[][] = Array.from(
    { length: effectiveCount },
    () => []
  );

  logos.forEach((logo, index) => {
    columns[index % effectiveCount].push(logo);
  });

  return columns;
}

interface LogoColumnProps {
  logos: ReactNode[];
  columnIndex: number;
  waveIndex: number;
  activeIndex: number;
  reduceMotion: boolean;
}

const LogoColumn = memo(function LogoColumn({
  logos,
  columnIndex,
  waveIndex,
  activeIndex,
  reduceMotion,
}: LogoColumnProps) {
  const transition: Transition = {
    ease: EASE_OUT_QUAD,
    duration: TRANSITION_DURATION,
    delay: waveIndex * (STAGGER_DELAY / 1000),
  };

  const variants = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition },
        exit: { opacity: 0, transition },
      }
    : {
        initial: {
          opacity: 0,
          transform: "translateY(60%)",
          filter: "blur(2px)",
        },
        animate: {
          opacity: 1,
          transform: "translateY(0%)",
          filter: "blur(0px)",
          transition,
        },
        exit: {
          opacity: 0,
          transform: "translateY(-50%)",
          filter: "blur(3px)",
          transition,
        },
      };

  return (
    <div
      data-slot="logos-carousel-column"
      className="relative flex items-center justify-center h-[68px] sm:h-[76px] w-full overflow-hidden"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={`${columnIndex}-${activeIndex}`}
          data-slot="logos-carousel-logo"
          className="absolute inset-0 flex items-center justify-center size-full"
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
        >
          {logos[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
LogoColumn.displayName = "LogoColumn";

export function SupportedBySection({
  hasSeenScrollAnimations = false,
}: {
  hasSeenScrollAnimations?: boolean;
}) {
  const { phase, skip } = useSectionReveal(hasSeenScrollAnimations);
  const reduceMotion = useReducedMotion() ?? false;

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px", once: false });

  const renderedLogos = useMemo(() => {
    return INSPIRATIONS.map((item) => (
      <a
        key={item.id}
        href={item.url || "#"}
        target={item.url ? "_blank" : undefined}
        rel={item.url ? "noopener noreferrer" : undefined}
        className="relative flex items-center justify-center size-full group px-2 sm:px-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-200"
        title={item.name}
      >
        {item.darkSvgPath ? (
          <>
            {/* Light mode: colored icon + black text */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.svgPath}
              alt={item.name}
              onError={(e) => {
                const target = e.currentTarget;
                if (item.imageFallback && target.src !== item.imageFallback) {
                  target.src = item.imageFallback;
                }
              }}
              className="h-7 sm:h-8 w-auto max-w-[130px] sm:max-w-[155px] max-h-[34px] sm:max-h-[38px] object-contain shrink-0 transition-transform duration-200 group-hover:scale-105 dark:hidden"
              loading="eager"
              decoding="async"
            />
            {/* Dark mode: colored icon + WHITE text */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.darkSvgPath}
              alt={item.name}
              onError={(e) => {
                const target = e.currentTarget;
                if (item.imageFallback && target.src !== item.imageFallback) {
                  target.src = item.imageFallback;
                }
              }}
              className="h-7 sm:h-8 w-auto max-w-[130px] sm:max-w-[155px] max-h-[34px] sm:max-h-[38px] object-contain shrink-0 transition-transform duration-200 group-hover:scale-105 hidden dark:block"
              loading="eager"
              decoding="async"
            />
          </>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.svgPath}
            alt={item.name}
            onError={(e) => {
              const target = e.currentTarget;
              if (item.imageFallback && target.src !== item.imageFallback) {
                target.src = item.imageFallback;
              }
            }}
            className={`h-7 sm:h-8 w-auto max-w-[130px] sm:max-w-[155px] max-h-[34px] sm:max-h-[38px] object-contain shrink-0 transition-transform duration-200 group-hover:scale-105 ${
              item.invertInDark ? "dark:invert" : ""
            }`}
            loading="eager"
            decoding="async"
          />
        )}
      </a>
    ));
  }, []);

  const columns = useMemo(() => distributeLogos(renderedLogos, 4), [renderedLogos]);

  const [step, setStep] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState<(typeof INSPIRATIONS)[0] | null>(null);
  const [visitingUrl, setVisitingUrl] = useState<string | null>(null);
  const [isTipVisible, setIsTipVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const checkScreen = () => {
      setWindowWidth(window.innerWidth);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isMobileOrTablet = windowWidth < 1024;

  const carouselConfig = isMobile
    ? {
        itemSize: 130,
        visibleItems: 3,
        minScale: 0.58,
        arc: 16,
        height: 190,
        selectedOffset: 0,
      }
    : isTablet
    ? {
        itemSize: 160,
        visibleItems: 4,
        minScale: 0.54,
        arc: 24,
        height: 230,
        selectedOffset: -170,
      }
    : {
        itemSize: 200,
        visibleItems: 5,
        minScale: 0.52,
        arc: 36,
        height: 290,
        selectedOffset: -210,
      };

  const shouldPlay = isInView || skip;

  useEffect(() => {
    if (!isDrawerOpen) return;

    // 1.8s entry delay: smoothly morphs and slides up if the user stays for 1.5 - 2 seconds
    const timer = setTimeout(() => {
      setIsTipVisible(true);
    }, 1800);

    return () => {
      clearTimeout(timer);
      setIsTipVisible(false);
    };
  }, [isDrawerOpen]);

  const handleSelectBrand = (item: (typeof INSPIRATIONS)[0]) => {
    if (selectedBrand?.id === item.id) {
      setSelectedBrand(null);
    } else {
      setSelectedBrand(item);
    }
  };

  const handleBack = () => {
    setSelectedBrand(null);
  };

  const handleVisitWebsite = (e: React.MouseEvent, url?: string) => {
    if (!url) return;
    e.preventDefault();
    playSoftClick();
    setVisitingUrl(url);

    // Wait for the transition curve to envelop the screen smoothly
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      // Smoothly fade out the transition overlay
      setTimeout(() => {
        setVisitingUrl(null);
      }, 300);
    }, 750);
  };

  useEffect(() => {
    if (!shouldPlay) return;

    const beatId = setInterval(() => {
      setStep((prev) => prev + 1);
    }, CYCLE_INTERVAL);

    return () => clearInterval(beatId);
  }, [shouldPlay]);

  const renderGalleryContent = () => (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-y-auto overscroll-contain bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 sm:px-8 pt-8 sm:pt-10 pb-8 sm:pb-10 select-none">
      {/* Floating Close Button */}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => {
                playSoftClick(0.04);
                setIsDrawerOpen(false);
              }}
              className="absolute top-4 right-4 sm:top-5 sm:right-6 z-50 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all duration-150 active:scale-95 focus-visible:outline-none cursor-pointer border border-zinc-200/50 dark:border-zinc-800/50 shadow-xs"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={6}
            hideArrow
            className="hidden md:flex px-2 py-1 text-[11px] font-medium rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-none shadow-md z-[10000]"
          >
            Close
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Tribute & Credits Header (Concise & Horizontal SaaS Style) */}
      <div className="w-full flex flex-col items-center text-center max-w-2xl mx-auto font-sans shrink-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
          Inspired by Extraordinary Creators
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-1.5 sm:mt-2 leading-relaxed max-w-xl font-normal line-clamp-2 sm:line-clamp-none">
          This portfolio was inspired by the innovative design engineers, UI libraries, and physics experiments below. Without their creativity and open-source contributions, building this wouldn&apos;t have been possible.
        </p>
      </div>

      {/* Inspirations Convex Cylinder Carousel & Detail View */}
      <div 
        className="relative w-full flex-1 min-h-[220px] max-h-[340px] flex items-center justify-center bg-white dark:bg-black overflow-hidden my-auto"
        onWheel={(e) => {
          if (selectedBrand) {
            e.stopPropagation();
          }
        }}
      >
        {/* Seamless Edge Fade Overlays on Both Ends */}
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white dark:from-black via-white/70 dark:via-black/70 to-transparent z-20 transition-opacity duration-300 ${
            selectedBrand ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white dark:from-black via-white/70 dark:via-black/70 to-transparent z-20 transition-opacity duration-300 ${
            selectedBrand ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Carousel Base Layer: Real circle slides left on select, others fade out. On mobile, fades out on select to give detail card full focus with zero overlap */}
        <div
          className={cn(
            "w-full h-full flex items-center justify-center transition-opacity duration-300",
            isMobile && selectedBrand ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <CylinderCarousel
            itemSize={carouselConfig.itemSize}
            visibleItems={carouselConfig.visibleItems}
            variant="convex"
            minScale={carouselConfig.minScale}
            arc={carouselConfig.arc}
            snap={true}
            autoRotate={false}
            defaultIndex={activeIdx}
            onIndexChange={setActiveIdx}
            selectedIndex={
              selectedBrand
                ? INSPIRATIONS.findIndex((i) => i.id === selectedBrand.id)
                : null
            }
            selectedOffset={carouselConfig.selectedOffset}
            height={carouselConfig.height}
            className="w-full"
          >
            {INSPIRATIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectBrand(item)}
                className="w-full h-full rounded-full aspect-square bg-zinc-100 dark:bg-[#141416] flex items-center justify-center p-2.5 sm:p-4 transition-transform duration-200 group select-none relative overflow-hidden cursor-pointer outline-none focus:outline-none ring-0 border-0 shadow-none dark:shadow-md"
              >
                {item.darkSvgPath ? (
                  <>
                    <Image
                      src={item.svgPath}
                      alt={item.name}
                      width={112}
                      height={80}
                      unoptimized
                      className="h-10 sm:h-12 md:h-12 lg:h-14 w-auto max-w-[76%] max-h-[70%] object-contain dark:hidden pointer-events-none transition-transform duration-200 group-hover:scale-110"
                      loading="lazy"
                    />
                    <Image
                      src={item.darkSvgPath}
                      alt={item.name}
                      width={112}
                      height={80}
                      unoptimized
                      className="h-10 sm:h-12 md:h-12 lg:h-14 w-auto max-w-[76%] max-h-[70%] object-contain hidden dark:block pointer-events-none transition-transform duration-200 group-hover:scale-110"
                      loading="lazy"
                    />
                  </>
                ) : (
                  <Image
                    src={item.svgPath}
                    alt={item.name}
                    width={112}
                    height={80}
                    unoptimized
                    className={`h-10 sm:h-12 md:h-12 lg:h-14 w-auto max-w-[76%] max-h-[70%] object-contain pointer-events-none transition-transform duration-200 group-hover:scale-110 ${
                      item.invertInDark ? "dark:invert" : ""
                    }`}
                    loading="lazy"
                  />
                )}
              </button>
            ))}
          </CylinderCarousel>
        </div>

        {/* Selected Brand Detail Showcase */}
        <AnimatePresence>
          {selectedBrand && (
            <motion.div
              key={selectedBrand.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 p-3 sm:p-4"
            >
              <div className="relative w-full max-w-3xl h-full flex items-center justify-center md:justify-start">
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    x: isMobile ? 0 : 20,
                    y: isMobile ? 12 : 0,
                    filter: "blur(6px)",
                  }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" }}
                  exit={{
                    opacity: 0,
                    scale: 0.92,
                    x: isMobile ? 0 : 15,
                    y: isMobile ? 8 : 0,
                    filter: "blur(4px)",
                    transition: { duration: 0.15 },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 340,
                    damping: 28,
                    delay: isMobile ? 0.08 : 0.45,
                  }}
                  className="relative md:absolute md:top-1/2 md:-translate-y-1/2 flex flex-col items-start text-left gap-3 sm:gap-3.5 w-[92%] sm:w-[360px] md:w-[380px] lg:w-[440px] max-w-[440px] p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-50 via-zinc-100/95 to-zinc-100/85 dark:from-[#18181b] dark:via-[#121214]/95 dark:to-[#09090b]/95 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 outline-none ring-0 shadow-xl pointer-events-auto font-sans md:left-[calc(50%-20px)] lg:left-[calc(50%-50px)] md:translate-x-0 select-none"
                >
                  <motion.div
                    initial={{ opacity: 0, x: isMobile ? 0 : 25, y: isMobile ? 8 : 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: isMobile ? 0 : 15, y: isMobile ? 6 : 0, filter: "blur(4px)", transition: { duration: 0.15 } }}
                    transition={{
                      duration: 0.35,
                      delay: isMobile ? 0.12 : 0.54,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex flex-col gap-1 w-full"
                  >
                    <div className="flex items-center gap-3 w-full">
                      {/* Mobile Brand Circular Logo Avatar (hidden on tablet/desktop where carousel ball sits proudly on the left) */}
                      <div className="md:hidden size-11 sm:size-12 rounded-full aspect-square bg-zinc-100 dark:bg-[#141416] p-2 flex items-center justify-center shrink-0 border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
                        {selectedBrand.darkSvgPath ? (
                          <>
                            <Image
                              src={selectedBrand.svgPath}
                              alt={selectedBrand.name}
                              width={36}
                              height={36}
                              unoptimized
                              className="size-6 sm:size-7 object-contain dark:hidden pointer-events-none"
                            />
                            <Image
                              src={selectedBrand.darkSvgPath}
                              alt={selectedBrand.name}
                              width={36}
                              height={36}
                              unoptimized
                              className="size-6 sm:size-7 object-contain hidden dark:block pointer-events-none"
                            />
                          </>
                        ) : (
                          <Image
                            src={selectedBrand.svgPath}
                            alt={selectedBrand.name}
                            width={36}
                            height={36}
                            unoptimized
                            className={cn(
                              "size-6 sm:size-7 object-contain pointer-events-none",
                              selectedBrand.invertInDark && "dark:invert"
                            )}
                          />
                        )}
                      </div>

                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-normal font-sans tracking-tight text-zinc-900 dark:text-white leading-tight truncate">
                            {selectedBrand.name}
                          </h3>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-zinc-200/70 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 text-[11px] sm:text-[12px] font-medium font-sans select-none shrink-0">
                            {selectedBrand.category === "components"
                              ? "Component Kit"
                              : selectedBrand.category === "motion"
                              ? "Motion & Physics"
                              : selectedBrand.category === "systems"
                              ? "Design System"
                              : selectedBrand.category === "portfolios"
                              ? "Creative Portfolio"
                              : selectedBrand.category}
                          </span>
                        </div>
                        {selectedBrand.url && (
                          <span className="text-xs text-[#6495ED] font-mono hover:underline cursor-pointer truncate">
                            {selectedBrand.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {selectedBrand.description && (
                    <motion.p
                      initial={{ opacity: 0, x: isMobile ? 0 : 25, y: isMobile ? 8 : 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: isMobile ? 0 : 15, y: isMobile ? 6 : 0, filter: "blur(4px)", transition: { duration: 0.15 } }}
                      transition={{
                        duration: 0.35,
                        delay: isMobile ? 0.16 : 0.62,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-xs sm:text-sm md:text-[15px] font-sans text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-lg line-clamp-3 sm:line-clamp-none"
                    >
                      {selectedBrand.description}
                    </motion.p>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: isMobile ? 0 : 25, y: isMobile ? 8 : 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: isMobile ? 0 : 15, y: isMobile ? 6 : 0, filter: "blur(4px)", transition: { duration: 0.15 } }}
                    transition={{
                      duration: 0.35,
                      delay: isMobile ? 0.2 : 0.7,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="hidden sm:flex items-center gap-2 flex-wrap text-[11px] text-zinc-500 dark:text-zinc-400 font-mono"
                  >
                    <span className="px-2.5 py-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-0 shadow-none">
                      UI Component
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-0 shadow-none">
                      Design Engineering
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-0 shadow-none">
                      Curated
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: isMobile ? 0 : 25, y: isMobile ? 8 : 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: isMobile ? 0 : 15, y: isMobile ? 6 : 0, filter: "blur(4px)", transition: { duration: 0.15 } }}
                    transition={{
                      duration: 0.35,
                      delay: isMobile ? 0.24 : 0.78,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center gap-2.5 mt-1 w-full font-sans"
                  >
                    {selectedBrand.url && (
                      <a
                        href={selectedBrand.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleVisitWebsite(e, selectedBrand.url)}
                        className="flex-1 min-h-[38px] sm:min-h-[42px] py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl bg-zinc-900 dark:bg-[#6495ED] hover:bg-zinc-800 dark:hover:bg-[#5382dc] text-white text-xs sm:text-[13px] font-medium font-sans flex items-center justify-center transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] border-0 outline-none ring-0 shadow-none cursor-pointer text-center select-none"
                      >
                        <span className="truncate">Visit {selectedBrand.name}</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 min-h-[38px] sm:min-h-[42px] py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl bg-zinc-200/80 dark:bg-zinc-800/90 hover:bg-zinc-300/80 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs sm:text-[13px] font-medium font-sans flex items-center justify-center transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] border-0 outline-none ring-0 shadow-none cursor-pointer text-center select-none"
                    >
                      <span>Back</span>
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Tip & Ask AI Action */}
      <div className="w-full flex items-center justify-center shrink-0 pt-2 min-h-[44px] z-20">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(6px)", scale: 0.96 }}
          animate={
            isTipVisible
              ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
              : { opacity: 0, y: 18, filter: "blur(6px)", scale: 0.96 }
          }
          transition={{
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 font-sans text-center px-4 max-w-sm sm:max-w-none mx-auto leading-normal",
            !isTipVisible && "pointer-events-none"
          )}
        >
          <span>If you need help finding what you needed</span>
          <div className="inline-flex items-center gap-1.5">
            <span>just</span>
            <button
              type="button"
              onClick={() => {
                playSoftClick(0.04);
                setIsDrawerOpen(false);
                window.dispatchEvent(new CustomEvent("open-ai"));
              }}
              onMouseEnter={() => {
                import("@/components/prompt-box-preview");
              }}
              onTouchStart={() => {
                import("@/components/prompt-box-preview");
              }}
              className="inline-flex items-center gap-1.5 font-medium cursor-pointer transition-all duration-200 hover:opacity-85 active:scale-95 border-0 bg-transparent p-0 outline-none select-none align-middle group"
              title="Ask AI"
              aria-label="Ask AI"
            >
            <svg
              className="size-3.5 sm:size-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.025,5.623c.068,.204,.26,.342,.475,.342s.406-.138,.475-.342l.421-1.263,1.263-.421c.204-.068,.342-.259,.342-.474s-.138-.406-.342-.474l-1.263-.421-.421-1.263c-.137-.408-.812-.408-.949,0l-.421,1.263-1.263,.421c-.204,.068-.342,.259-.342,.474s.138,.406,.342,.474l1.263,.421,.421,1.263Z"
                className="fill-[#6495ED]"
              />
              <path
                d="M16.525,8.803l-4.535-1.793-1.793-4.535c-.227-.572-1.168-.572-1.395,0l-1.793,4.535-4.535,1.793c-.286,.113-.475,.39-.475,.697s.188,.584,.475,.697l4.535,1.793,1.793,4.535c.113,.286,.39,.474,.697,.474s.584-.188,.697-.474l1.793-4.535,4.535-1.793c.286-.113,.475-.39,.475-.697s-.188-.584-.475-.697Z"
                className="fill-[#6495ED]"
              />
            </svg>
            <span className="animate-shimmer-text font-medium leading-none text-[#6495ED]">Ask AI</span>
          </button>
        </div>
      </motion.div>
      </div>
    </div>
  );

  return (
    <>
      <motion.div
        ref={containerRef}
        id="supported-by"
        className="relative flex flex-col z-10 w-full select-none"
        initial={skip ? "visible" : "hidden"}
        whileInView={skip ? undefined : phase === "done" ? "visible" : "hidden"}
        animate={skip ? "visible" : undefined}
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {/* Top line — spans between margin guides */}
        <div
          className="absolute top-0 bleed-x h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />

        {/* Centered Header: SPECIAL THANKS & COMPONENT INSPIRATIONS */}
        <div className="relative h-[32px] sm:h-[36px] flex items-center justify-center px-8 sm:px-10 text-center">
          {/* Handwritten Annotation in Right Gutter: extraordinary creators ↙ - PC/Desktop only */}
          <div className="absolute left-full top-[-16px] sm:top-[-18px] pl-5 sm:pl-6 hidden xl:flex flex-col items-start pointer-events-none select-none z-30 min-w-max">
            <div className="rotate-[3deg] ml-1 text-zinc-500 dark:text-zinc-400">
              <HandwritingText text="extraordinary creators" delay={0.2} duration={1.3} height="19px" />
            </div>
            <svg
              className="w-12 h-6 text-zinc-400 dark:text-zinc-500 overflow-visible mt-1 -ml-3"
              viewBox="0 0 46 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M42 4 C 30 9, 16 15, 3 17"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.5, ease: "easeInOut" }}
              />
              <motion.path
                d="m 11 12 -8 5 8 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 2.1, ease: "easeOut" }}
              />
            </svg>
          </div>

          <span className="text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.14em] sm:tracking-[0.18em] font-normal text-zinc-500 dark:text-zinc-400 text-center whitespace-nowrap leading-none select-none">
            <span className="hidden md:inline">
              SPECIAL THANKS & COMPONENT INSPIRATIONS
            </span>
            <span className="inline md:hidden">
              SPECIAL THANKS
            </span>
          </span>

          {/* Far Right: Square Container with smooth curved edges & SVG icon (opens sidebar on left) */}
          <button
            type="button"
            onClick={() => {
              setIsDrawerOpen(true);
            }}
            className="group absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center size-[22px] sm:size-[26px] rounded-[6px] bg-zinc-200/90 dark:bg-zinc-800/90 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs focus:outline-none"
            title="Open Component Inspirations Sidebar"
            aria-label="Open Component Inspirations Sidebar"
          >
            <svg
              className="size-3.5 sm:size-4 transition-transform duration-200 group-hover:scale-110"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.9928 1.0404C14.2962 1.14421 14.5 1.42938 14.5 1.75V13.25C14.5 13.5707 14.2961 13.8559 13.9927 13.9596C13.6897 14.0633 13.3544 13.9631 13.1579 13.7103L13.1571 13.7094C12.8251 13.2933 12.4342 12.9173 12.021 12.5833C11.2941 11.9959 10.3992 11.5 9.5 11.5H5C2.79079 11.5 1 9.70922 1 7.5C1 5.29079 2.79079 3.5 5 3.5H9.5C10.3986 3.5 11.2935 3.00417 12.0206 2.41664C12.5486 1.99001 12.9365 1.55507 13.0883 1.37461C13.3178 1.10177 13.6232 0.913921 13.9928 1.0404Z"
                className="fill-[#6495ED]"
              />
              <path
                d="M5.14069 11.5L6.11812 16.1716C6.31746 17.1176 7.245 17.7208 8.18852 17.5235L8.63573 17.433L8.64148 17.4318C9.58859 17.2322 10.1921 16.3025 9.99263 15.3578L9.1774 11.5H5.14069Z"
                className="fill-[#1C1F21] dark:fill-[#F4F4F5]"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.3715 5.52744C16.6421 5.40696 16.9582 5.45703 17.1784 5.65523C17.6817 6.10843 18 6.76754 18 7.50001C18 8.23247 17.6817 8.89158 17.1784 9.34478C16.9582 9.54298 16.6421 9.59305 16.3715 9.47257C16.1009 9.35208 15.9265 9.08362 15.9265 8.78741V6.2126C15.9265 5.91639 16.1009 5.64793 16.3715 5.52744Z"
                className="fill-[#1C1F21] dark:fill-[#F4F4F5]"
              />
              <path
                d="M4 11.374C2.27473 10.93 1 9.36391 1 7.5C1 5.63609 2.27473 4.07003 4 3.62601V11.374Z"
                className="fill-[#1C1F21] dark:fill-[#F4F4F5]"
              />
            </svg>
          </button>

          {/* Bottom divider line under header — spans between margin guides */}
          <div
            className="absolute bottom-0 bleed-x h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_HORIZONTAL}
          />
          <CornerMark position="bottom-left" />
          <CornerMark position="bottom-right" />
        </div>

        {/* 4-Column Animated Grid */}
        <div className="relative flex items-center w-full py-0">
          {/* 4-Column Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 w-full relative">
            {columns.map((columnLogos, columnIndex) => (
              <div
                key={columnIndex}
                className="relative flex items-center justify-center"
              >
                {/* Vertical Divider on the right of each cell (except last on desktop) */}
                {columnIndex < columns.length - 1 && (
                  <div
                    className="hidden sm:block absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
                    style={DOT_MASK_VERTICAL}
                  />
                )}
                {/* Mobile 2-column vertical divider */}
                {columnIndex % 2 === 0 && (
                  <div
                    className="sm:hidden absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
                    style={DOT_MASK_VERTICAL}
                  />
                )}
                {/* Mobile 2-column horizontal divider for row 1 */}
                {columnIndex < 2 && (
                  <div
                    className="sm:hidden absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
                    style={DOT_MASK_HORIZONTAL}
                  />
                )}

                <LogoColumn
                  logos={columnLogos}
                  columnIndex={columnIndex}
                  waveIndex={columnIndex}
                  activeIndex={step % columnLogos.length}
                  reduceMotion={reduceMotion}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom line — spans between margin guides */}
        <div
          className="absolute bottom-0 bleed-x h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />
        <CornerMark position="bottom-left" />
        <CornerMark position="bottom-right" />
      </motion.div>

      {/* Responsive Gallery Presentation: CurvedMenu on Mobile/Tablet, CenterMorphModal on PC/Desktop */}
      {isMobileOrTablet ? (
        <CurvedMenu
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          {renderGalleryContent()}
        </CurvedMenu>
      ) : (
        <CenterMorphModal
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        >
          <CenterMorphModalContent
            ariaLabel="Component Inspirations Showcase"
            showCloseButton={false}
            className="w-full max-w-5xl lg:max-w-6xl bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col rounded-[28px] shadow-2xl overflow-hidden border-0 p-0"
          >
            {renderGalleryContent()}
          </CenterMorphModalContent>
        </CenterMorphModal>
      )}

      {/* Curved Screen Transition Overlay (starts at center and envelops the screen smoothly) */}
      <AnimatePresence>
        {visitingUrl && (
          <motion.div
            key="website-transition-overlay"
            initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 1 }}
            animate={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              clipPath: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
              opacity: { duration: 0.25, ease: "easeOut" },
            }}
            className="fixed inset-0 z-[99999] pointer-events-auto flex items-center justify-center bg-[#6495ED]"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
              className="flex flex-col items-center gap-2 text-white font-sans text-center px-4"
            >
              <span className="text-xl sm:text-2xl font-normal tracking-tight">
                Opening {selectedBrand?.name}...
              </span>
              <span className="text-xs sm:text-sm text-white/80 font-mono">
                {selectedBrand?.url ? selectedBrand.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : ""}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
