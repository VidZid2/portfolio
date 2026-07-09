"use client";

import { useState, useId, useEffect } from "react";
import Image from "next/image";
import { Play, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const SPRING_MODAL = {
  type: "spring",
  stiffness: 300,
  damping: 32,
  mass: 0.9,
} as const;

export function InteractivePreview({ 
  liveUrl, 
  imageSrc, 
  imageAlt 
}: { 
  liveUrl: string; 
  imageSrc: string; 
  imageAlt: string 
}) {
  const [isInteractive, setIsInteractive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);
  const [showHeaderDesktop, setShowHeaderDesktop] = useState(true);
  const layoutId = useId();

  useEffect(() => {
    if (isInteractive) {
      setShowHeaderDesktop(true);
      setIsHoveringHeader(false);
    }
  }, [isInteractive]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isHoveringHeader) {
      timeout = setTimeout(() => {
        setShowHeaderDesktop(false);
      }, 2000);
    } else {
      setShowHeaderDesktop(true);
    }
    return () => clearTimeout(timeout);
  }, [isHoveringHeader]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isInteractive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsInteractive(false);
    };
    window.addEventListener("keydown", onKey);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isInteractive]);

  return (
    <>
      <div className="w-full h-full relative group">
        <AnimatePresence>
          {!isInteractive && (
            <motion.div 
              key="thumbnail"
              layoutId={layoutId}
              transition={SPRING_MODAL}
              style={{ borderRadius: 8 }}
              className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer overflow-hidden bg-black"
              onClick={() => setIsInteractive(true)}
            >
              <Image 
                src={imageSrc} 
                alt={imageAlt} 
                fill 
                priority
                fetchPriority="high"
                sizes="(min-width: 768px) 40vw, 100vw"
                quality={75}
                className="object-cover group-hover:blur-sm transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="relative z-20 flex flex-col items-center gap-3 transform group-hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50 text-white shadow-xl">
                  <Play className="w-6 h-6 ml-1 fill-current" />
                </div>
                <span className="text-white font-medium text-sm drop-shadow-md bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">Click to Load Interactive Demo</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The Fullscreen Interactive Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isInteractive && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 pointer-events-none">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
              onClick={() => setIsInteractive(false)}
            />
            
            {/* Morphing Window */}
            <motion.div
              key="modal"
              layoutId={layoutId}
              transition={SPRING_MODAL}
              style={{ borderRadius: undefined }}
              className="relative w-full h-full bg-black border-0 overflow-hidden pointer-events-auto flex flex-col shadow-2xl"
            >
              {/* Header Bar Area */}
              <div 
                className="md:absolute md:top-0 md:left-0 md:right-0 z-50 md:w-full"
                onMouseEnter={() => setIsHoveringHeader(true)}
                onMouseLeave={() => setIsHoveringHeader(false)}
              >
                {/* Invisible hover area to trigger the header before the cursor reaches the very top */}
                <div className="hidden md:block absolute top-0 left-0 right-0 h-24 bg-transparent -z-10" />
                
                <div className={`flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-zinc-900 shadow-xl transition-transform duration-500 ease-out ${
                  showHeaderDesktop ? "md:translate-y-0" : "md:-translate-y-full"
                }`}>
                  <span className="text-sm font-medium text-white flex items-center gap-2 min-w-0 pr-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="truncate">Live Preview: {imageAlt}</span>
                  </span>
                  
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="hidden md:inline-block text-xs text-white/40 mr-2">Website built by JOSIAH DE ASIS</span>
                    <a 
                      href={liveUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      title="Open in new tab"
                      className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 sm:px-2.5 py-1.5 rounded-md"
                    >
                      <span className="hidden sm:inline-block">Open in new tab</span> <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="w-px h-4 bg-white/20" />
                    <button 
                      onClick={() => setIsInteractive(false)} 
                      className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Iframe content delayed slightly so layout morph happens smoothly first */}
              <motion.div 
                initial={{ opacity: 0, filter: "blur(4px)" }} 
                animate={{ opacity: 1, filter: "blur(0px)" }} 
                transition={{ delay: 0.15, duration: 0.4 }}
                className="flex-1 w-full relative bg-black min-h-0"
              >
                <iframe
                  src={liveUrl}
                  className="w-full h-full border-0 bg-white"
                  title={`${imageAlt} Live Preview`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                ></iframe>
              </motion.div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
