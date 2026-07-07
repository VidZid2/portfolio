"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileText } from "lucide-react";
import SoftPillButton from "@/components/pixel-perfect/soft-pill-button";
import { MorphingSocials } from "@/components/pixel-perfect/morphing-socials";
import { usePerformance } from "@/hooks/usePerformance";

export function SocialsSection({ hasSeenScrollAnimations = false }: { hasSeenScrollAnimations?: boolean }) {
  const { isLowTier } = usePerformance();
  const skip = hasSeenScrollAnimations || isLowTier;
  return (
    <motion.div 
      id="contact" 
      className="mt-6 scroll-mt-24"
      initial={skip ? "visible" : "hidden"}
      whileInView={skip ? undefined : "visible"}
      animate={skip ? "visible" : undefined}
      transition={isLowTier ? { duration: 0 } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <motion.h2 
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0, transition: { type: "spring", bounce: 0.4 } }
        }}
        className="text-[14px] text-zinc-500 mb-2"
      >
        Here are my <span className="font-medium text-zinc-800 dark:text-zinc-200">socials</span>
      </motion.h2>
      
      <MorphingSocials
        socials={[
          { name: 'GitHub', href: 'https://github.com/VidZid2', icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="2" fill="none"></path> },
          { name: 'Twitter', href: '#', icon: <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M20 4l-6.768 6.768" stroke="currentColor" strokeWidth="2" fill="none" /> },
          { name: 'LinkedIn', href: '#', icon: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none"></path> },
          { name: 'Discord', href: '#', icon: <path d="M18 5c-1.5-.7-3.2-1-5-1s-3.5.3-5 1c-1.5 3.5-2.5 8-2.5 8 1.5 2 4.5 3 7.5 3s6-1 7.5-3c0 0-1-4.5-2.5-8zM9 13c-.8 0-1.5-.7-1.5-1.5S8.2 10 9 10s1.5.7 1.5 1.5S9.8 13 9 13zm6 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" fill="currentColor"></path> },
        ]}
      >
        <Link href="/resume" className="w-full relative z-10">
          <SoftPillButton
            as="span"
            variant="secondary"
            className="w-full justify-center px-3 py-2 !text-[12px]"
          >
            <span className="flex items-center justify-center gap-1.5 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
              <FileText className="h-3.5 w-3.5" />
              Resume
            </span>
          </SoftPillButton>
        </Link>
      </MorphingSocials>
    </motion.div>
  );
}
