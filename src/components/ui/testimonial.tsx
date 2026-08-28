"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence, type HTMLMotionProps, type Variants } from "framer-motion";

export interface TestimonialItem {
  id: string;
  companyLogo?: string;
  darkCompanyLogo?: string;
  customLogo?: React.ReactNode;
  quote: string;
  highlightedText?: string;
  authorName: string;
  authorPosition?: string;
  authorImage?: string;
  authorInitials?: string;
}

export interface TestimonialProps extends HTMLMotionProps<"div"> {
  items?: TestimonialItem[];
  skip?: boolean;
  phase?: string;
  companyLogo?: string;
  darkCompanyLogo?: string;
  quote?: string;
  authorName?: string;
  authorPosition?: string;
  authorImage?: string;
  authorInitials?: string;
  highlightedText?: string;
}

const EASE_SMOOTH = [0.16, 1, 0.3, 1] as const;
const TRANSITION_DURATION = 0.65;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    transform: "translateY(16px)",
    filter: "blur(2px)",
  },
  visible: {
    opacity: 1,
    transform: "translateY(0px)",
    filter: "blur(0px)",
    transition: {
      duration: TRANSITION_DURATION,
      ease: EASE_SMOOTH,
    },
  },
  exit: {
    opacity: 0,
    transform: "translateY(-12px)",
    filter: "blur(2px)",
    transition: {
      duration: 0.4,
      ease: EASE_SMOOTH,
    },
  },
};

export const Testimonial = React.forwardRef<HTMLDivElement, TestimonialProps>(
  (
    {
      className,
      items,
      skip = false,
      phase = "done",
      companyLogo,
      darkCompanyLogo,
      quote,
      authorName,
      authorPosition,
      authorImage,
      authorInitials,
      highlightedText,
      ...props
    },
    ref,
  ) => {
    const list: TestimonialItem[] = items || [
      {
        id: "default",
        companyLogo,
        darkCompanyLogo,
        quote: quote || "",
        highlightedText,
        authorName: authorName || "",
        authorPosition,
        authorImage,
        authorInitials,
      },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const active = list[currentIndex] || list[0];

    const formattedQuote = active.highlightedText
      ? active.quote.replace(
          active.highlightedText,
          `<strong class="font-semibold text-zinc-950 dark:text-white">${active.highlightedText}</strong>`,
        )
      : active.quote;

    return (
      <motion.div
        ref={ref}
        initial={skip ? "visible" : "hidden"}
        whileInView={skip ? undefined : phase === "done" ? "visible" : "hidden"}
        animate={skip ? "visible" : undefined}
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
        className={cn("relative py-12 sm:py-16 overflow-hidden", className)}
        {...props}
      >
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="flex flex-col items-center w-full"
              >
                {/* Brand Logo */}
                {active.customLogo ? (
                  <motion.div variants={itemVariants} className="mb-7 flex items-center justify-center">
                    {active.customLogo}
                  </motion.div>
                ) : active.companyLogo ? (
                  <motion.div
                    variants={itemVariants}
                    className="mb-7 relative h-10 sm:h-12 w-44 sm:w-52 flex items-center justify-center"
                  >
                    {active.darkCompanyLogo ? (
                      <>
                        <Image
                          src={active.companyLogo}
                          alt="Company logo"
                          fill
                          className="object-contain dark:hidden"
                          priority
                        />
                        <Image
                          src={active.darkCompanyLogo}
                          alt="Company logo"
                          fill
                          className="object-contain hidden dark:block"
                          priority
                        />
                      </>
                    ) : (
                      <Image
                        src={active.companyLogo}
                        alt="Company logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    )}
                  </motion.div>
                ) : null}

                {/* Quote with refined serif quotation styling */}
                <motion.p
                  variants={itemVariants}
                  className="max-w-xl text-balance text-center text-lg sm:text-xl font-normal text-zinc-750 dark:text-zinc-250 leading-relaxed before:mr-1.5 before:font-serif before:text-[#6495ED]/70 dark:before:text-[#6495ED]/80 before:content-['“'] after:ml-1.5 after:font-serif after:text-[#6495ED]/70 dark:after:text-[#6495ED]/80 after:content-['”']"
                  dangerouslySetInnerHTML={{ __html: formattedQuote }}
                />

                {/* Author Block */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 sm:mt-10 flex items-center justify-center gap-3.5"
                >
                  {active.authorImage ? (
                    <div className="relative size-10 sm:size-11 rounded-full overflow-hidden border border-black/10 dark:border-white/15 ring-1 ring-black/5 dark:ring-white/10 shadow-sm bg-zinc-100 dark:bg-zinc-900 shrink-0">
                      <Image
                        src={active.authorImage}
                        alt={active.authorName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : active.authorInitials ? (
                    <div className="relative size-10 sm:size-11 rounded-full flex items-center justify-center border border-black/10 dark:border-white/15 ring-1 ring-black/5 dark:ring-white/10 shadow-sm bg-zinc-100 dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 shrink-0">
                      {active.authorInitials}
                    </div>
                  ) : null}
                  <div className="text-left space-y-0.5">
                    <h5 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                      {active.authorName}
                    </h5>
                    {active.authorPosition && (
                      <h5 className="text-xs sm:text-sm font-normal text-zinc-500 dark:text-zinc-400 leading-tight">
                        {active.authorPosition}
                      </h5>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Pagination dots if multiple items */}
            {list.length > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {list.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Switch to testimonial ${idx + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      idx === currentIndex
                        ? "w-6 bg-[#6495ED]"
                        : "w-1.5 bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  },
);

Testimonial.displayName = "Testimonial";
