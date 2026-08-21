"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRightIcon, Heart, Mail, Check, Copy, ExternalLink, Smartphone, Gift } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";
import ScrambleText from "@/components/ruixen/scramble-text";
import { usePerformance } from "@/hooks/usePerformance";
import { PlusIcon } from "@/components/animated-icons/plus-icon";
import { ExpandingArrowButton } from "@/components/ui/expanding-arrow-button";
import { SPONSORS, type Sponsor } from "@/data/sponsorsData";
import { playHoverTick, playSoftClick, playPowerUpSound } from "@/lib/synth-sounds";
import {
  CenterMorphModal,
  CenterMorphModalContent,
} from "@/components/motion/center-morph-modal";
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

const TIP_PRESETS = [
  { amount: "₱100", label: "Coffee", icon: "☕" },
  { amount: "₱250", label: "Slice", icon: "🍕" },
  { amount: "₱500", label: "Fuel", icon: "🚀" },
  { amount: "₱1,000", label: "Hero", icon: "🌟" },
];

interface CommunitySupportSectionProps {
  hasSeenScrollAnimations?: boolean;
}

export function CommunitySupportSection({
  hasSeenScrollAnimations = false,
}: CommunitySupportSectionProps) {
  const phase = useArcReveal();
  const { isLowTier } = usePerformance();
  const skip = hasSeenScrollAnimations || isLowTier;
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMaya, setCopiedMaya] = useState(false);
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
  const mayaAccount = "josiahdeasis009@gmail.com";
  const githubSponsorsUrl = "https://github.com/sponsors/VidZid2";

  const handleCopyEmail = () => {
    playSoftClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleCopyMaya = () => {
    playPowerUpSound(0.065);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(mayaAccount);
      setCopiedMaya(true);
      toast.success("Maya account copied to clipboard!");
      setTimeout(() => setCopiedMaya(false), 2000);
    }
  };

  const handlePresetClick = (label: string) => {
    handleCopyMaya();
  };

  const handleOpenModal = () => {
    playSoftClick();
    setModalOpen(true);
  };

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
        {/* Top Line Intersections at boundary borders */}
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
          <p className="text-[13px] sm:text-[13.5px] text-zinc-500 dark:text-zinc-400 font-sans tracking-normal leading-normal mt-0.5">
            Send a tip or become a sponsor to help support my open-source projects and creative work.
          </p>

          {/* Header Bottom Dotted Line */}
          <div
            className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_HORIZONTAL}
          />
          {/* Header Bottom Intersections */}
          <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        </motion.div>

        {/* 2-Column Sponsor Grid Area — Fully Enveloping Full Bleed Width */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
          }}
          className="relative w-full py-0"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full relative">
            {/* If there are sponsors in the list, render them */}
            {SPONSORS.length > 0 ? (
              <>
                {SPONSORS.map((sponsor: Sponsor, idx: number) => {
                  const isLeftCol = idx % 2 === 0;
                  return (
                    <div
                      key={sponsor.id || idx}
                      className="relative flex items-center justify-center p-6 sm:p-7 min-h-[92px] sm:min-h-[104px] transition-colors duration-200 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    >
                      <a
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={() => playSoftClick()}
                        className="flex items-center justify-center w-full h-full max-w-[200px] text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity"
                      >
                        {sponsor.logo ? (
                          <sponsor.logo className="w-full h-auto max-h-[36px]" />
                        ) : (
                          <span className="font-semibold text-sm tracking-tight">{sponsor.name}</span>
                        )}
                      </a>

                      {/* Right vertical blueprint dotted divider on desktop */}
                      {isLeftCol && (
                        <>
                          <div
                            className="hidden sm:block absolute top-0 bottom-0 right-0 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none"
                            style={DOT_MASK_VERTICAL}
                          />
                          <div className="hidden sm:block absolute top-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
                          <div className="hidden sm:block absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
                        </>
                      )}

                      {/* Horizontal dotted bottom divider */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
                        style={DOT_MASK_HORIZONTAL}
                      />
                    </div>
                  );
                })}

                {/* Trailing Plus (+) Card */}
                <div
                  className="relative flex items-center justify-center p-6 sm:p-7 min-h-[92px] sm:min-h-[104px] transition-colors duration-200 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] cursor-pointer group select-none"
                  onClick={handleOpenModal}
                  onMouseEnter={() => {
                    setIsTrailingPlusHovered(true);
                    playHoverTick(0.04);
                  }}
                  onMouseLeave={() => setIsTrailingPlusHovered(false)}
                >
                  <PlusIcon
                    size={24}
                    isHovered={isTrailingPlusHovered}
                    className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-200"
                  />

                  {/* Horizontal dotted bottom divider */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
                    style={DOT_MASK_HORIZONTAL}
                  />
                </div>
              </>
            ) : (
              /* Initially Empty State Grid Matching Picture 2 & Picture 3 — Full Envelope */
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
            accentClassName="bg-lime-300 dark:bg-lime-400 text-neutral-950"
            labelClassName="text-[11px] sm:text-xs font-semibold tracking-tight"
          >
            Slide to sponsor
          </ExpandingArrowButton>

          {/* Section Bottom full-width line */}
          <div
            className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_HORIZONTAL}
          />
          {/* Section Bottom Line Intersections */}
          <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
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
          <div className="px-4 pb-6 flex flex-col">
            {/* Quick Tip Amount Presets — Borderless Container Cards */}
            <div className="mt-2 flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-medium">
                Quick Tip Presets
              </span>
              <div className="grid grid-cols-4 gap-2">
                {TIP_PRESETS.map((preset) => (
                  <button
                    key={preset.amount}
                    type="button"
                    onClick={() => handlePresetClick(preset.label)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-[#00D665]/10 dark:hover:bg-[#00D665]/15 transition-all duration-150 group cursor-pointer active:scale-95"
                  >
                    <span className="text-sm mb-0.5 group-hover:scale-110 transition-transform">
                      {preset.icon}
                    </span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                      {preset.amount}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 group-hover:text-[#00D665] transition-colors font-sans">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3.5 flex flex-col gap-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-medium">
                Direct Platforms
              </span>

              {/* 1. Maya / PayMaya Option */}
              <div
                onClick={handleCopyMaya}
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors group cursor-pointer select-none active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00D665] text-black flex items-center justify-center shrink-0 font-bold shadow-xs">
                    <span className="font-sans font-black text-sm tracking-tighter">m</span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                        PayMaya / Maya
                      </p>
                      <span className="px-1.5 py-0.2 text-[9.5px] font-mono font-medium rounded bg-[#00D665]/15 text-[#00A84E] dark:text-[#00D665]">
                        Direct Wallet
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
                      {mayaAccount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  {copiedMaya ? (
                    <span className="inline-flex items-center gap-1 text-emerald-500 font-medium text-[11px]">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </span>
                  )}
                </div>
              </div>

              {/* 2. GitHub Sponsors Option */}
              <a
                href={githubSponsorsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSoftClick()}
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors group cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#24292e] dark:bg-[#161b22] text-white flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                      GitHub Sponsors
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
                      github.com/sponsors/VidZid2
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
              </a>

              {/* 3. Direct Sponsorship / Inquiries via Email */}
              <div className="p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="text-xs font-semibold font-sans">Direct Inquiries & Custom Sponsorship</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug font-sans">
                  Interested in featured sponsorship slots, collaboration, or custom contributions? Reach out:
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={`mailto:${email}?subject=[Open Source Support] Tip & Sponsorship`}
                    onClick={() => playSoftClick()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-[11px] font-medium transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Send Email</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300/80 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </BottomSheet>
      ) : (
        <CenterMorphModal open={modalOpen} onOpenChange={setModalOpen}>
          <CenterMorphModalContent
            ariaLabel="Support & Send a Tip"
            className="max-w-lg p-6 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[28px] shadow-2xl z-[9999] max-h-[90vh] overflow-y-auto"
          >
            <div className="space-y-1.5 text-left pr-8">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#00D665]/10 text-[#00D665]">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-sans tracking-tight">
                  Support & Send a Tip
                </h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                Support Josiah&apos;s open-source projects, tools, and creations. Every contribution directly powers new builds and maintenance.
              </p>
            </div>

            {/* Quick Tip Amount Presets — Borderless Container Cards */}
            <div className="mt-4 flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-medium">
                Quick Tip Presets
              </span>
              <div className="grid grid-cols-4 gap-2">
                {TIP_PRESETS.map((preset) => (
                  <button
                    key={preset.amount}
                    type="button"
                    onClick={() => handlePresetClick(preset.label)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-[#00D665]/10 dark:hover:bg-[#00D665]/15 transition-all duration-150 group cursor-pointer"
                  >
                    <span className="text-sm mb-0.5 group-hover:scale-110 transition-transform">
                      {preset.icon}
                    </span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                      {preset.amount}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 group-hover:text-[#00D665] transition-colors font-sans">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3.5 flex flex-col gap-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-medium">
                Direct Platforms
              </span>

              {/* 1. Maya / PayMaya Option */}
              <div
                onClick={handleCopyMaya}
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors group cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00D665] text-black flex items-center justify-center shrink-0 font-bold shadow-xs">
                    <span className="font-sans font-black text-sm tracking-tighter">m</span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                        PayMaya / Maya
                      </p>
                      <span className="px-1.5 py-0.2 text-[9.5px] font-mono font-medium rounded bg-[#00D665]/15 text-[#00A84E] dark:text-[#00D665]">
                        Direct Wallet
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
                      {mayaAccount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  {copiedMaya ? (
                    <span className="inline-flex items-center gap-1 text-emerald-500 font-medium text-[11px]">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </span>
                  )}
                </div>
              </div>

              {/* 2. GitHub Sponsors Option */}
              <a
                href={githubSponsorsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSoftClick()}
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#24292e] dark:bg-[#161b22] text-white flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                      GitHub Sponsors
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
                      github.com/sponsors/VidZid2
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
              </a>

              {/* 3. Direct Sponsorship / Inquiries via Email */}
              <div className="p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="text-xs font-semibold font-sans">Direct Inquiries & Custom Sponsorship</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug font-sans">
                  Interested in featured sponsorship slots, collaboration, or custom contributions? Reach out:
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={`mailto:${email}?subject=[Open Source Support] Tip & Sponsorship`}
                    onClick={() => playSoftClick()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-[11px] font-medium transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Send Email</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300/80 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          </CenterMorphModalContent>
        </CenterMorphModal>
      )}
    </>
  );
}
