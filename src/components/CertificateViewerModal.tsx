"use client";

import React, { useEffect, useState, useMemo, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Download, FileText, Image as ImageIcon, Sparkles, MoreHorizontal } from "lucide-react";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { PresenceGate } from "@/lib/presence-gate";
import { EASE_OUT } from "@/lib/ease";
import { playSoftClick } from "@/lib/synth-sounds";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover as MotionPopover,
  PopoverTrigger as MotionPopoverTrigger,
  PopoverContent as MotionPopoverContent,
} from "@/components/motion/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CertificateModalData {
  title: string;
  issuer: string;
  dates: string;
  pdfUrl?: string;
  imageUrl?: string;
  type?: string;
}

const CENTER_FOLDED_CLIP = "inset(48% 48% 48% 48% round 30px)";
const CENTER_OPEN_CLIP = "inset(0% 0% 0% 0% round 30px)";

// Complex clip-path strings can snap when a spring resolves its final distance.
// Keep the radius constant so the whole duration reads as surface unfolding,
// rather than finishing early and spending its last frames rounding corners.
const CENTER_UNFOLD_EASE = [0.2, 0, 0.2, 1] as const;
const CENTER_UNFOLD_TRANSITION = {
  duration: 0.43,
  ease: CENTER_UNFOLD_EASE,
} as const;

function ModalToolbarTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6} className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function FormatSwitchToggle({
  viewMode,
  onToggle,
}: {
  viewMode: "pdf" | "image";
  onToggle: (mode: "pdf" | "image") => void;
}) {
  return (
    <div className="relative flex items-center p-0.5 rounded-[8px] bg-neutral-200/70 dark:bg-neutral-800/80 select-none isolate overflow-hidden">
      {/* High-performance hardware-accelerated sliding active pill */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-[6px] bg-white dark:bg-neutral-700 shadow-sm pointer-events-none z-0"
        initial={false}
        animate={{
          left: viewMode === "pdf" ? "2px" : "calc(50%)",
        }}
        transition={{
          type: "spring",
          stiffness: 480,
          damping: 34,
          mass: 0.55,
        }}
      />

      <button
        type="button"
        onClick={() => {
          if (viewMode !== "pdf") {
            playSoftClick(0.04);
            onToggle("pdf");
          }
        }}
        className={cn(
          "relative z-10 flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors duration-150 outline-none select-none cursor-pointer border-0 bg-transparent",
          viewMode === "pdf"
            ? "text-neutral-950 dark:text-white font-semibold"
            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
        )}
      >
        <FileText className="size-3.5 shrink-0" />
        <span>PDF</span>
      </button>

      <button
        type="button"
        onClick={() => {
          if (viewMode !== "image") {
            playSoftClick(0.04);
            onToggle("image");
          }
        }}
        className={cn(
          "relative z-10 flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors duration-150 outline-none select-none cursor-pointer border-0 bg-transparent",
          viewMode === "image"
            ? "text-neutral-950 dark:text-white font-semibold"
            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
        )}
      >
        <ImageIcon className="size-3.5 shrink-0" />
        <span>Photo</span>
      </button>
    </div>
  );
}

export function CertificateViewerModal({
  data,
  isOpen,
  onClose,
}: {
  data: CertificateModalData | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [cachedData, setCachedData] = useState<CertificateModalData | null>(data);
  const [viewMode, setViewMode] = useState<"pdf" | "image">("pdf");
  const reduce = useReducedMotion() ?? false;
  const panelRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    if (!data) return;
    const frame = requestAnimationFrame(() => setCachedData(data));
    return () => cancelAnimationFrame(frame);
  }, [data]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playSoftClick(0.04);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Set default view mode based on availability
  useEffect(() => {
    const hasPdf = data?.pdfUrl && data.pdfUrl !== "#";
    const hasImage = data?.imageUrl;
    if (!hasPdf && !hasImage) return;
    const frame = requestAnimationFrame(() => setViewMode(hasPdf ? "pdf" : "image"));
    return () => cancelAnimationFrame(frame);
  }, [data]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Calculate responsive auto-fit zoom level for 1000px wide PDF documents
  const autoFitZoom = useMemo(() => {
    if (windowWidth < 480) return 0.35;
    if (windowWidth < 768) return 0.48;
    if (windowWidth < 1024) return 0.62;
    return 0.75;
  }, [windowWidth]);

  if (!mounted) return null;

  const activeData = data || cachedData;
  const downloadUrl = viewMode === "pdf" ? activeData?.pdfUrl : (activeData?.imageUrl || activeData?.pdfUrl);
  const downloadFileName = activeData?.title
    ? `${activeData.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.${viewMode === "pdf" ? "pdf" : "jpg"}`
    : "certificate";

  const hasBothFormats = Boolean(activeData?.pdfUrl && activeData.pdfUrl !== "#" && activeData?.imageUrl);

  return createPortal(
    <AnimatePresence>
      {isOpen && activeData && (
        <PresenceGate>
          {({ isPresent, gate }) => (
            <>
              {/* Backdrop */}
              <motion.button
                type="button"
                aria-label="Dismiss certificate modal"
                tabIndex={-1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                {...gate}
                transition={{
                  duration: reduce ? 0.1 : 0.28,
                  ease: EASE_OUT,
                }}
                onClick={() => {
                  playSoftClick(0.04);
                  onClose();
                }}
                className="pointer-events-auto fixed inset-0 z-[100] h-full w-full cursor-default bg-black/75 backdrop-blur-sm transform-gpu"
              />

              {/* `inset-4` rather than `inset-0 p-4`: same content box, but the
                  layer stays off the viewport edges. It never takes pointer
                  events, so it carries `inert` alone. */}
              <div
                inert={!isPresent}
                className="pointer-events-none fixed inset-2 sm:inset-4 z-[100] flex items-center justify-center overflow-y-auto drop-shadow-2xl"
              >
                {/* Drop-shadow reads the clipped child's alpha, so depth follows the
                    unfolding silhouette without introducing another panel layer. */}
                <div className="flex w-full h-full max-h-[92vh] sm:max-h-[88vh] max-w-5xl flex-col items-center justify-center py-4">
                  {/* Center Morph Panel */}
                  <motion.div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={activeData.title}
                    tabIndex={-1}
                    initial={
                      reduce
                        ? { opacity: 0, clipPath: CENTER_OPEN_CLIP }
                        : { opacity: 1, clipPath: CENTER_FOLDED_CLIP }
                    }
                    animate={{
                      opacity: 1,
                      clipPath: CENTER_OPEN_CLIP,
                    }}
                    exit={
                      reduce
                        ? {
                            opacity: 0,
                            clipPath: CENTER_OPEN_CLIP,
                          }
                        : {
                            opacity: 1,
                            clipPath: CENTER_FOLDED_CLIP,
                          }
                    }
                    {...gate}
                    transition={
                      reduce
                        ? { duration: 0.14, ease: EASE_OUT }
                        : CENTER_UNFOLD_TRANSITION
                    }
                    className={cn(
                      "pointer-events-auto relative flex flex-col w-full max-w-5xl h-full max-h-[92vh] sm:max-h-[88vh] bg-background border border-border rounded-[30px] shadow-2xl overflow-hidden will-change-[clip-path] select-none text-foreground origin-center",
                    )}
                  >
                  {activeData.pdfUrl && activeData.pdfUrl !== "#" ? (
                    <div className="relative w-full h-full min-h-0 flex-1 flex flex-col overflow-hidden">
                      <PDFViewer
                        key={activeData.pdfUrl}
                        src={activeData.pdfUrl}
                        fileName={downloadFileName}
                        className="h-full w-full"
                        defaultZoom={autoFitZoom}
                        title={activeData.title}
                        activeViewMode={viewMode}
                        showToolbar={true}
                        showDownload={true}
                        showUpload={false}
                        disableSearch={true}
                        onClose={onClose}
                        toolbarActions={
                          hasBothFormats ? (
                            <FormatSwitchToggle
                              viewMode={viewMode}
                              onToggle={setViewMode}
                            />
                          ) : null
                        }
                        photoContent={
                          hasBothFormats && activeData.imageUrl ? (
                            <motion.img
                              src={activeData.imageUrl}
                              alt={activeData.title}
                              loading="eager"
                              decoding="async"
                              initial={false}
                              animate={{
                                scale: viewMode === "image" ? 1 : 0.94,
                                opacity: viewMode === "image" ? 1 : 0.75,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 340,
                                damping: 34,
                              }}
                              className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-xl dark:shadow-2xl border border-neutral-200/80 dark:border-zinc-800/80 transition-all transform-gpu"
                            />
                          ) : null
                        }
                      />
                    </div>
                  ) : activeData.imageUrl ? (
                    <div className="relative w-full h-full min-h-0 flex-1 flex flex-col overflow-hidden">
                      {/* Photo Mode Toolbar */}
                      <TooltipProvider>
                        <div className="flex items-center justify-between px-3 h-12 border-b border-border bg-background shrink-0 z-30 overflow-hidden">
                          <div className="flex items-center gap-2 truncate pr-2 flex-1">
                            <span className="text-xs font-semibold text-foreground truncate max-w-[200px] sm:max-w-md">
                              {activeData.title}
                            </span>
                            <span className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                              Photo
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {downloadUrl && downloadUrl !== "#" && (
                              <MotionPopover
                                align="end"
                                side="bottom"
                                sideOffset={14}
                                panelRadius={8}
                                gooStrength={5}
                                blobClassName="bg-neutral-200/80 dark:bg-neutral-800/90 border-0 outline-none shadow-lg dark:shadow-2xl"
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <MotionPopoverTrigger>
                                      <button
                                        type="button"
                                        aria-label="More options"
                                        onClick={() => playSoftClick(0.04)}
                                        className="relative flex items-center justify-center size-7 rounded-[8px] bg-neutral-200/80 dark:bg-neutral-800/90 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-150 border-0 outline-none select-none cursor-pointer shadow-none p-0"
                                      >
                                        <MoreHorizontal className="size-4 pointer-events-none" />
                                      </button>
                                    </MotionPopoverTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom" className="hidden md:flex z-[99999]">
                                    More options
                                  </TooltipContent>
                                </Tooltip>
                                <MotionPopoverContent className="p-0 min-w-[110px] bg-transparent text-neutral-900 dark:text-neutral-100 border-0 outline-none shadow-none">
                                  <a
                                    href={downloadUrl}
                                    download={downloadFileName}
                                    onClick={() => playSoftClick(0.04)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors duration-150 select-none cursor-pointer outline-none border-0 bg-transparent rounded-[8px]"
                                  >
                                    <Download className="size-4" />
                                    <span>Download</span>
                                  </a>
                                </MotionPopoverContent>
                              </MotionPopover>
                            )}

                            <div className="border-l border-neutral-300 dark:border-neutral-700 h-5 self-center mx-1" />

                            <ModalToolbarTooltip label="Close">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Close"
                                onClick={() => {
                                  playSoftClick(0.04);
                                  onClose();
                                }}
                                className="hover:bg-red-500/20 hover:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-400 text-neutral-600 dark:text-neutral-400 transition-colors"
                              >
                                <X className="size-4" />
                              </Button>
                            </ModalToolbarTooltip>
                          </div>
                        </div>
                      </TooltipProvider>

                      <div className="w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-hidden bg-neutral-100/60 dark:bg-neutral-950/60 flex-1 min-h-0">
                        <img
                          src={activeData.imageUrl}
                          alt={activeData.title}
                          loading="eager"
                          decoding="async"
                          className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-xl dark:shadow-2xl border border-neutral-200/80 dark:border-zinc-800/80 transition-all transform-gpu"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-background gap-3">
                      <Sparkles className="size-8 text-[#6495ED]" />
                      <p className="text-sm">Certificate file not available yet.</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </>
        )}
      </PresenceGate>
    )}
  </AnimatePresence>,
  document.body
);
}
