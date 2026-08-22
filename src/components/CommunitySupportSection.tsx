"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRightIcon, Mail, Check, Copy, ExternalLink, Gift } from "lucide-react";
import { toast } from "sonner";

import Image from "next/image";
import { useTransition } from "@/components/TransitionProvider";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";
import ScrambleText from "@/components/ruixen/scramble-text";
import { usePerformance } from "@/hooks/usePerformance";
import { PlusIcon } from "@/components/animated-icons/plus-icon";
import { ExpandingArrowButton } from "@/components/ui/expanding-arrow-button";
import { SPONSORS } from "@/data/sponsorsData";
import { playHoverTick, playSoftClick } from "@/lib/synth-sounds";
import {
  CenterMorphModal,
  CenterMorphModalContent,
} from "@/components/motion/center-morph-modal";
import {
  ActionSwapCascadeIcon,
  ActionSwapCascadeText,
} from "@/components/motion/action-swap-cascade";
import { BottomSheet } from "@/components/ui/bottom-sheet";

const DOT_MASK_HORIZONTAL = {
  maskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
};

const DOT_MASK_VERTICAL = {
  maskImage:
    "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
};

interface CommunitySupportSectionProps {
  hasSeenScrollAnimations?: boolean;
}

export function CommunitySupportSection({
  hasSeenScrollAnimations = false,
}: CommunitySupportSectionProps) {
  const phase = useArcReveal();
  const { isLowTier } = usePerformance();
  const { navigate } = useTransition();
  const skip = hasSeenScrollAnimations || isLowTier;
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isPlusHovered, setIsPlusHovered] = useState(false);
  const [isTrailingPlusHovered, setIsTrailingPlusHovered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    try {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } catch {
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, []);

  const email = "josiahdeasis009@gmail.com";
  const paypalUrl = "https://paypal.me/josiahdeasis";
  const kofiUrl = "https://ko-fi.com/josiahdeasis";

  const handleCopyEmail = () => {
    playSoftClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playSoftClick();
    setModalOpen(false);
    navigate("/contact");
  };

  const handleOpenModal = () => {
    playSoftClick();
    setModalOpen(true);
  };

  const renderSupportContent = () => (
    <div className="flex flex-col gap-2.5 mt-2">
      {/* 1. PayPal Option */}
      <a
        href={paypalUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => playSoftClick()}
        className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors group cursor-pointer active:scale-[0.99] select-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#003087]/10 dark:bg-[#0079C1]/20 flex items-center justify-center shrink-0 shadow-xs">
            <Image
              src="/SVG's/Support SVG'S/Paypal.svg"
              alt="PayPal"
              width={20}
              height={20}
              className="w-4.5 h-4.5 object-contain"
              unoptimized
            />
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                PayPal
              </p>
              <span className="px-1.5 py-0.2 text-[9.5px] font-mono font-medium rounded bg-[#0079C1]/15 text-[#0079C1] dark:text-[#38bdf8]">
                Global & Cards
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans mt-0.5 truncate">
              paypal.me/josiahdeasis
            </p>
          </div>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors shrink-0" />
      </a>

      {/* 2. Ko-fi Option */}
      <a
        href={kofiUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => playSoftClick()}
        className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors group cursor-pointer active:scale-[0.99]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#FF5E5B]/10 dark:bg-[#FF5E5B]/20 flex items-center justify-center shrink-0 shadow-xs">
            <Image
              src="/SVG's/Support SVG'S/Kofi_Symbol.svg"
              alt="Ko-fi"
              width={20}
              height={20}
              className="w-4.5 h-4.5 object-contain"
              unoptimized
            />
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                Ko-fi
              </p>
              <span className="px-1.5 py-0.2 text-[9.5px] font-mono font-medium rounded bg-[#FF5E5B]/15 text-[#FF5E5B]">
                0% Fee & Cards
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
              ko-fi.com/josiahdeasis
            </p>
          </div>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors shrink-0" />
      </a>

      {/* 3. Direct Sponsorship / Inquiries via Email & Contact */}
      <div className="p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="text-xs font-semibold font-sans">Direct Inquiries & Custom Sponsorship</span>
          </div>
        </div>

        {/* Real Email Display with Copy */}
        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
          <span className="truncate select-all">{email}</span>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 text-[11px] font-medium transition-colors cursor-pointer border-0 shrink-0 select-none overflow-hidden active:scale-95"
            title="Copy Email"
          >
            <ActionSwapCascadeIcon value={copiedEmail ? "copied" : "copy"} className="w-3.5 h-3.5">
              {copiedEmail ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </ActionSwapCascadeIcon>
            <ActionSwapCascadeText
              value={copiedEmail ? "copied" : "copy"}
              className={copiedEmail ? "text-emerald-500 font-medium" : "text-zinc-700 dark:text-zinc-300"}
            >
              {copiedEmail ? "Copied" : "Copy"}
            </ActionSwapCascadeText>
          </button>
        </div>

        {/* Contact Page Navigation with Transition Curve + Mailto */}
        <div className="flex items-center gap-2 mt-0.5">
          <button
            type="button"
            onClick={handleContactClick}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-[11px] font-medium transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] border-0"
          >
            <ArrowUpRightIcon className="w-3.5 h-3.5" />
            <span>Open Contact Form</span>
          </button>
          <a
            href={`mailto:${email}?subject=[Open Source Support] Tip & Sponsorship`}
            onClick={() => playSoftClick()}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300/80 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium transition-colors"
            title="Send Email directly"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Mail</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <motion.div
        id="community-support"
        className="mt-0 flex flex-col w-[calc(100%+1.5rem)] sm:w-[calc(100%+2rem)] -mx-3 sm:-mx-4 relative z-10 scroll-mt-24 select-none"
        initial={skip ? "visible" : "hidden"}
        whileInView={skip ? undefined : phase === "done" ? "visible" : "hidden"}
        animate={skip ? "visible" : undefined}
        viewport={{ once: true, amount: 0.1 }}
        transition={isLowTier ? { duration: 0 } : undefined}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {/* Top full-width dotted blueprint line */}
        <div
          className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={DOT_MASK_HORIZONTAL}
        />
        {/* Top line intersections */}
        <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute top-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

        {/* Section Header */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -8 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { type: "spring", bounce: 0.3 },
            },
          }}
          className="pt-2.5 pb-3 px-3 sm:px-4 relative flex flex-col justify-start"
        >
          <div className="flex items-center gap-2">
            <ScrambleText
              as="h2"
              className="text-[17px] sm:text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight"
            >
              Support My Work
            </ScrambleText>
          </div>
          <p className="text-[12px] sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-1 font-sans">
            Send a tip or become a sponsor to help support my open-source projects and creative work.
          </p>

          {/* Dotted horizontal blueprint line underneath the header */}
          <div
            className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_HORIZONTAL}
          />
          <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        </motion.div>

        {/* 2-Column Responsive Blueprint Grid */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 relative"
        >
          {/* Vertical Center Blueprint Dotted Line */}
          <div
            className="hidden sm:block absolute top-0 bottom-0 left-1/2 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
            style={DOT_MASK_VERTICAL}
          />

          {/* Active Sponsors or Empty Slot Showcase */}
          <div className="contents">
            {SPONSORS.length > 0 ? (
              <>
                {/* 1. First Sponsor Slot (Left) */}
                <div
                  onMouseEnter={() => playHoverTick(0.04)}
                  className="relative flex flex-col justify-between p-3.5 sm:p-4 min-h-[100px] sm:min-h-[112px] hover:bg-zinc-50/50 dark:hover:bg-zinc-900/25 transition-colors duration-200 cursor-default"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 font-mono text-[11px] font-bold shrink-0">
                        {SPONSORS[0].name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="text-[11px] sm:text-[12px] font-mono tracking-tight text-zinc-700 dark:text-zinc-300 truncate select-none">
                        {SPONSORS[0].name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 shrink-0 select-none">
                      {SPONSORS[0].tier}
                    </span>
                  </div>

                  <div className="flex flex-col mt-auto leading-tight">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[13px] sm:text-[14px] font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        Supporter
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                      {SPONSORS[0].description || "Backer"}
                    </span>
                  </div>
                </div>

                {/* 2. Interactive Plus (+) Slot (Right) - Pure icon without outline */}
                <div
                  onClick={handleOpenModal}
                  onMouseEnter={() => {
                    setIsPlusHovered(true);
                    playHoverTick(0.04);
                  }}
                  onMouseLeave={() => setIsPlusHovered(false)}
                  className="relative flex items-center justify-center p-6 sm:p-8 min-h-[100px] sm:min-h-[112px] transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer group select-none"
                >
                  <PlusIcon
                    size={24}
                    isHovered={isPlusHovered}
                    className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-200"
                  />
                </div>
              </>
            ) : (
              /* Initially Empty State Grid Matching Picture 4 — Full Envelope */
              <>
                {/* 1. Reserved Sponsor Placeholder Slot (Left) */}
                <div
                  onClick={handleOpenModal}
                  onMouseEnter={() => playHoverTick(0.04)}
                  className="relative flex flex-col items-center justify-center p-6 sm:p-8 min-h-[100px] sm:min-h-[112px] transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors duration-200">
                    <span className="font-mono text-[11px] uppercase tracking-wider font-medium">
                      Spot Reserved
                    </span>
                  </div>
                  <p className="text-[12px] text-zinc-400/80 dark:text-zinc-500/80 font-sans mt-1 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors">
                    Become the first community backer
                  </p>

                  {/* Desktop Middle Vertical Dotted Blueprint Divider */}
                  <div
                    className="hidden sm:block absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
                    style={DOT_MASK_VERTICAL}
                  />
                  <div className="hidden sm:block absolute top-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
                  <div className="hidden sm:block absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />

                  {/* Mobile Horizontal Dotted Divider between Card 1 and Card 2 */}
                  <div
                    className="sm:hidden absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
                    style={DOT_MASK_HORIZONTAL}
                  />
                  <div className="sm:hidden absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
                  <div className="sm:hidden absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
                </div>

                {/* 2. Interactive Plus (+) Slot (Right) - Pure icon without outline */}
                <div
                  onClick={handleOpenModal}
                  onMouseEnter={() => {
                    setIsPlusHovered(true);
                    playHoverTick(0.04);
                  }}
                  onMouseLeave={() => setIsPlusHovered(false)}
                  className="relative flex items-center justify-center p-6 sm:p-8 min-h-[100px] sm:min-h-[112px] transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer group select-none"
                >
                  <PlusIcon
                    size={24}
                    isHovered={isPlusHovered}
                    className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-200"
                  />
                </div>
              </>
            )}
          </div>

          {/* Grid Bottom Blueprint Dotted Line across full screen */}
          <div
            className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_HORIZONTAL}
          />
          {/* Grid Bottom Intersections */}
          <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          <div className="hidden sm:block absolute bottom-0 left-1/2 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        </motion.div>

        {/* Bottom "Sponsor my work" Action Button */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
          }}
          className="flex justify-center py-4 relative w-full"
        >
          <ExpandingArrowButton
            onSlideComplete={handleOpenModal}
            className="h-9 sm:h-10 w-48 sm:w-52 rounded-[15px]"
            accentClassName="bg-[#6495ED] text-white"
            labelClassName="text-[11px] sm:text-xs font-semibold tracking-tight text-zinc-800 dark:text-zinc-200"
          >
            Slide to sponsor
          </ExpandingArrowButton>

          {/* Section Bottom full-width line */}
          <div
            className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_HORIZONTAL}
          />
        </motion.div>
      </motion.div>

      {/* Responsive Modal Architecture: BottomSheet on Mobile/Tablet, CenterMorphModal on Desktop */}
      {isMobile ? (
        <BottomSheet
          open={modalOpen}
          onOpenChange={setModalOpen}
          snapPoints={["auto"]}
          title="Support & Send a Tip"
          description="Support Josiah's open-source projects, tools, and creations. Every contribution directly powers new builds and maintenance."
          className="max-w-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]"
        >
          <div className="px-4 pb-6">
            {renderSupportContent()}
          </div>
        </BottomSheet>
      ) : (
        <CenterMorphModal open={modalOpen} onOpenChange={setModalOpen}>
          <CenterMorphModalContent
            ariaLabel="Support & Send a Tip"
            className="max-w-lg p-6 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[28px] shadow-2xl z-[9999] max-h-[90vh] overflow-y-auto"
          >
            <div className="space-y-1.5 text-left pr-8 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#0079C1]/10 text-[#0079C1] dark:text-[#38bdf8]">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-sans tracking-tight">
                  Support & Send a Tip
                </h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                Support Josiah&apos;s open-source projects, tools, and creations. Every contribution directly powers new builds and maintenance.
              </p>
            </div>
            {renderSupportContent()}
          </CenterMorphModalContent>
        </CenterMorphModal>
      )}
    </>
  );
}
