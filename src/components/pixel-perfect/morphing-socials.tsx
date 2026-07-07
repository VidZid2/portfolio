"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SoftPillButton from "@/components/pixel-perfect/soft-pill-button";
import { socialProfiles, SocialProfileContent } from "@/components/pixel-perfect/social-hover-card";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialItem {
  name: string;
  href: string;
  icon: React.ReactNode;
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
      setHoverPos({
        x: el.offsetLeft + el.offsetWidth / 2,
        y: el.offsetTop - 12,
      });
    }
    if (prevIndex.current !== null && prevIndex.current !== index) {
      setDirection(index > prevIndex.current ? 1 : -1);
    }
    prevIndex.current = index;
    setHoveredSocial(name);
  };

  const transition = {
    type: "spring",
    mass: 0.5,
    damping: 11.5,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001,
  };

  return (
    <div 
      onMouseLeave={() => {
        setHoveredSocial(null);
        prevIndex.current = null;
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
            onMouseEnter={() => handleMouseEnter(social.name, index)}
          >
            <SoftPillButton
              as="a"
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="w-full justify-center px-3 py-2 !text-[12px] group"
            >
              <div className="flex items-center justify-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
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
            initial={{ opacity: 0, x: hoverPos.x, y: hoverPos.y + 8, scale: 0.98 }}
            animate={{ opacity: 1, x: hoverPos.x, y: hoverPos.y, scale: 1 }}
            exit={{ opacity: 0, x: hoverPos.x, y: hoverPos.y + 8, scale: 0.98 }}
            transition={{
              ...transition,
              opacity: { duration: 0.15, ease: "easeOut" }
            } as any}
            className="absolute top-0 left-0 z-[60] pointer-events-none"
          >
            <motion.div
              layout
              transition={transition as any}
              className={cn(
                "relative -translate-x-1/2 -translate-y-full", 
                "w-[230px] sm:w-[250px] rounded-xl shadow-2xl backdrop-blur-md overflow-hidden",
                "bg-white/95 dark:bg-[#0c0c0e]/95 border border-black/5 dark:border-white/5",
                "text-zinc-900 dark:text-zinc-100 select-none origin-bottom"
              )}
            >
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={hoveredSocial}
                  custom={direction}
                  initial={((dir: any) => ({ x: dir === 1 ? "100%" : dir === -1 ? "-100%" : 0 })) as any}
                  animate={{ x: 0 }}
                  exit={((dir: any) => ({ x: dir === 1 ? "-100%" : dir === -1 ? "100%" : 0 })) as any}
                  transition={transition as any}
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
