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
          <div className="w-8 h-8 rounded-lg bg-[#003087]/10 dark:bg-[#0079C1]/20 text-[#0079C1] flex items-center justify-center shrink-0 font-bold shadow-xs">
            <svg className="w-4 h-4 fill-current text-[#0079C1]" viewBox="0 0 24 24">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.009.4 5.438 0 5.945 0h7.625c3.554 0 6.046 1.776 5.679 5.372-.379 3.731-2.909 5.823-6.529 5.823H9.98l-1.393 8.847a.784.784 0 0 1-.777.653l-.734.642zm8.128-13.882c.162-1.583-.91-2.355-2.836-2.355H8.79l-1.46 9.255h2.463c2.404 0 4.156-1.337 4.411-3.844.02-.204.03-.396.03-.574a4.07 4.07 0 0 0-.03-.482h.001z" />
            </svg>
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
          <div className="w-8 h-8 rounded-lg bg-[#FF5E5B]/10 dark:bg-[#FF5E5B]/20 text-[#FF5E5B] flex items-center justify-center shrink-0 shadow-xs">
            <svg className="w-4 h-4 fill-current text-[#FF5E5B]" viewBox="0 0 24 24">
              <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.047 3.974-4.047 3.974s-2.7-2.486-3.92-3.938c-1.309-1.557-.775-3.66.906-4.102 1.637-.43 2.879.71 3.014.85.137-.14 1.379-1.28 3.016-.85 1.681.442 2.217 2.545.908 4.098l.123-.032zm6.757-1.12c-.22 1.488-1.579 2.012-3.111 2.012h-.809v-4.14h.983c1.533 0 2.719.64 2.937 2.128z" />
            </svg>
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

        {/* 3. GitHub Sponsors Option */}
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

        {/* 4. Direct Sponsorship / Inquiries via Email */}
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
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300/80 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium transition-colors cursor-pointer border-0"
            >
              {copiedEmail ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-zinc-400" />}
              <span>{copiedEmail ? "Copied" : "Copy"}</span>
            </button>
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
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-black/30 dark:border-white/[0.15]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-black/[0.04] dark:bg-white/[0.06] text-zinc-900 dark:text-zinc-100">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            </span>
            <h2 className="text-[13px] sm:text-[14px] font-mono font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              <ScrambleText>Community Support</ScrambleText>
            </h2>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            {SPONSORS.length} Backers
          </span>
        </div>

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
              <>
                {/* 1. Reserved Slot (Left) */}
                <div
                  onMouseEnter={() => playHoverTick(0.04)}
                  className="relative flex flex-col justify-between p-3.5 sm:p-4 min-h-[100px] sm:min-h-[112px] hover:bg-zinc-50/50 dark:hover:bg-zinc-900/25 transition-colors duration-200 cursor-default"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] sm:text-[12px] font-mono tracking-tight text-zinc-500 dark:text-zinc-400 truncate select-none">
                        Spot Reserved
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 shrink-0 select-none">
                      Available
                    </span>
                  </div>

                  <div className="flex flex-col mt-auto leading-tight">
                    <span className="text-[13px] sm:text-[14px] font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      Become a Backer
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                      Help sponsor ongoing projects
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
