"use client";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";

import React from "react";
import { motion } from "framer-motion";
import { useTransition } from "@/components/TransitionProvider";
import { Calendar, Mail } from "lucide-react";
import ScrambleText from "@/components/ruixen/scramble-text";
import SoftPillButton from "@/components/pixel-perfect/soft-pill-button";
import { usePerformance } from "@/hooks/usePerformance";

export function LetsConnect({ hasSeenScrollAnimations = false }: { hasSeenScrollAnimations?: boolean }) {
  const phase = useArcReveal();
  const { isLowTier } = usePerformance();
  const skip = hasSeenScrollAnimations || isLowTier;
  const { navigate } = useTransition();

  return (
    <motion.div 
      initial={skip ? "visible" : "hidden"}
      whileInView={skip ? undefined : (phase === "done" ? "visible" : "hidden")}
      animate={skip ? "visible" : undefined}
      transition={isLowTier ? { duration: 0 } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15
          }
        }
      }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", bounce: 0.3, duration: 0.6 } }
        }}
        className="text-center sm:text-left"
      >
        <ScrambleText as="h2" className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Let's Connect</ScrambleText>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">Available for new opportunities.</p>
      </motion.div>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.8, x: -10 },
            visible: { opacity: 1, scale: 1, x: 0, transition: { type: "spring", bounce: 0.4, duration: 0.5 } }
          }}
          className="w-full sm:w-auto"
        >
          <a href="/contact" onClick={(e) => { e.preventDefault(); navigate("/contact"); }} className="block w-full">
            <SoftPillButton
              as="span"
              variant="primary"
              className="w-full justify-center px-3 sm:px-4 py-2 !text-[12px] sm:!text-[13px] hover:scale-[1.03] shadow-[0_4px_16px_rgba(100,149,237,0.3)] dark:shadow-[0_4px_16px_rgba(100,149,237,0.15)] transition-all duration-300"
            >
              <div className="flex items-center justify-center w-full gap-1.5 sm:gap-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="font-semibold truncate">Book an intro call</span>
              </div>
            </SoftPillButton>
          </a>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.8, x: -10 },
            visible: { opacity: 1, scale: 1, x: 0, transition: { type: "spring", bounce: 0.4, duration: 0.5 } }
          }}
          className="w-full sm:w-auto"
        >
          <a href="/contact" onClick={(e) => { e.preventDefault(); navigate("/contact"); }} className="block w-full">
            <SoftPillButton
              as="span"
              variant="secondary"
              className="w-full justify-center px-3 sm:px-4 py-2 !text-[12px] sm:!text-[13px] hover:scale-[1.03] shadow-sm transition-all duration-300"
            >
              <div className="flex items-center justify-center w-full gap-1.5 sm:gap-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="font-medium truncate">Send an email</span>
              </div>
            </SoftPillButton>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
