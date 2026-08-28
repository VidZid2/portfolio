"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SoftPillButton from "@/components/pixel-perfect/soft-pill-button";
import { socialProfiles, SocialProfileContent } from "@/components/pixel-perfect/social-hover-card";
import { cn } from "@/lib/utils";

interface SocialItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
  hoverClass?: string;
  textHoverClass?: string;
}

export function MorphingSocials({ socials, children, className }: { socials: SocialItem[]; children?: React.ReactNode; className?: string }) {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const prevIndex = useRef<number | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleMouseEnter = (name: string, index: number) => {
    const el = itemRefs.current[name];
    if (el) {
      const cardHalfWidth = 125;
      const centerX = el.offsetLeft + el.offsetWidth / 2;
      const clampedX = Math.max(cardHalfWidth + 2, centerX);
      setHoverPos({
        x: clampedX,
        y: el.offsetTop - 12,
      });
    }
    if (prevIndex.current !== null && prevIndex.current !== index) {
      setDirection(index > prevIndex.current ? 1 : -1);
    }
    prevIndex.current = index;
    setHoveredSocial(name);
  };

  const springTransition = {
    type: "spring" as const,
    stiffness: 380,
    damping: 30,
    mass: 0.5,
  };

  const contentVariants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 32 : dir < 0 ? -32 : 0,
      opacity: 0,
      filter: "blur(4px)",
    }),
    animate: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -32 : dir < 0 ? 32 : 0,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  return (
    <div 
      onMouseLeave={() => {
        setHoveredSocial(null);
        prevIndex.current = null;
      }}
      onBlur={(e) => {
        // Reset when focus moves completely outside this container
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setHoveredSocial(null);
          prevIndex.current = null;
        }
      }}
      className="relative z-50 w-full"
    >
      <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2", className)}>
        {socials.map((social, index) => (
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8, y: 15 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
            }}
            key={social.name}
            ref={(el) => { itemRefs.current[social.name] = el; }}
            className="relative"
            onMouseEnter={() => !social.disabled && handleMouseEnter(social.name, index)}
            onFocus={() => !social.disabled && handleMouseEnter(social.name, index)}
          >
            <SoftPillButton
              as="a"
              href={social.disabled ? undefined : social.href}
              target={social.disabled ? undefined : "_blank"}
              rel={social.disabled ? undefined : "noopener noreferrer"}
              aria-label={social.name}
              aria-disabled={social.disabled}
              tabIndex={social.disabled ? -1 : 0}
              variant="secondary"
              className={cn(
                "w-full justify-center px-3 py-2 !text-[12px] group transition-all duration-300", 
                social.disabled && "opacity-50 pointer-events-none grayscale",
                social.hoverClass
              )}
            >
              <div className={cn("flex items-center justify-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300", social.textHoverClass)}>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                  {social.icon}
                </svg>
                {social.name}
              </div>
            </SoftPillButton>
          </motion.div>
        ))}
        {children && (
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8, y: 15 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
            }}
            className="col-span-2 sm:col-span-1"
          >
            {children}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {hoveredSocial && socialProfiles[hoveredSocial] && (
          <motion.div
            initial={{ opacity: 0, x: hoverPos.x, y: hoverPos.y + 6, scale: 0.96 }}
            animate={{ opacity: 1, x: hoverPos.x, y: hoverPos.y, scale: 1 }}
            exit={{ opacity: 0, x: hoverPos.x, y: hoverPos.y + 6, scale: 0.96 }}
            transition={{
              x: springTransition,
              y: springTransition,
              scale: { duration: 0.18, ease: "easeOut" },
              opacity: { duration: 0.15, ease: "easeOut" },
            }}
            className="absolute top-0 left-0 z-[60] pointer-events-none"
          >
            <motion.div
              layout
              transition={springTransition}
              className={cn(
                "relative -translate-x-1/2 -translate-y-full", 
                "w-[230px] sm:w-[250px] rounded-xl backdrop-blur-md overflow-hidden",
                "bg-white/95 dark:bg-[#0c0c0e]/95 border border-black/5 dark:border-white/5",
                "text-zinc-900 dark:text-zinc-100 select-none origin-bottom"
              )}
            >
              <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.div
                  key={hoveredSocial}
                  custom={direction}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{
                    x: springTransition,
                    opacity: { duration: 0.2, ease: "easeInOut" },
                    filter: { duration: 0.2, ease: "easeInOut" },
                  }}
                  className="w-full relative"
                >
                  <SocialProfileContent
                    socialName={hoveredSocial}
                    profile={socialProfiles[hoveredSocial]}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
