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
          { name: 'Twitter', href: '#', disabled: true, icon: <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M20 4l-6.768 6.768" stroke="currentColor" strokeWidth="2" fill="none" /> },
          { name: 'LinkedIn', href: '#', icon: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none"></path> },
          { name: 'Discord', href: '#', icon: <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" fill="currentColor"></path> },
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
