"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Sparkles,
  Briefcase,
  FolderOpen,
  Code,
  Wrench,
  BookOpen,
  ChevronRight as ChevronRightIcon,
  FileText
} from "lucide-react";
import { homeItems, primaItems } from "@/components/RightNavbar";
import { useTransition } from "@/components/TransitionProvider";
import { playSoftClick, playListSelect } from "@/lib/synth-sounds";
import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";

export function GlobalContextMenu({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { transitionBack, transitionForward } = useTransition();
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const menuRef = React.useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const isPrimaDoc = pathname === "/projects/prima-digital-agency/how-its-made";
  const hasIndex = isHome || isPrimaDoc;
  const activeItems = isHome ? homeItems : (isPrimaDoc ? primaItems : []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "briefcase": return <Briefcase className="h-4 w-4 text-zinc-500" />;
      case "folder": return <FolderOpen className="h-4 w-4 text-zinc-500" />;
      case "code": return <Code className="h-4 w-4 text-zinc-500" />;
      case "wrench": return <Wrench className="h-4 w-4 text-zinc-500" />;
      case "book": return <BookOpen className="h-4 w-4 text-zinc-500" />;
      case "file": return <FileText className="h-4 w-4 text-zinc-500" />;
      default: return <ChevronRightIcon className="h-4 w-4 text-zinc-500" />;
    }
  };

  const handleBack = () => {
    transitionBack();
    setIsOpen(false);
  };

  const handleForward = () => {
    transitionForward();
    setIsOpen(false);
  };

  const handleReload = () => {
    if (typeof window !== "undefined") window.location.reload();
    setIsOpen(false);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleGlobalContextMenu = (e: MouseEvent) => {
      // Disable custom context menu on mobile/tablet devices
      if (window.innerWidth < 768) {
        return;
      }

      // Allow default browser context menu on input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest("input") ||
        target.closest("textarea")
      ) {
        return;
      }

      e.preventDefault();
      
      // Calculate position to keep the menu cleanly within viewport boundaries
      let x = e.clientX;
      let y = e.clientY;
      const menuWidth = 256;
      // Precise height based on whether Navigation Index is active
      const menuHeight = (hasIndex && activeItems.length > 0) ? 310 : 120;
      const padding = 12;

      // Keep fully inside viewport horizontally
      if (x + menuWidth > window.innerWidth - padding) {
        x = Math.max(padding, window.innerWidth - menuWidth - padding);
      } else {
        x = Math.max(padding, x);
      }

      // Keep fully inside viewport vertically
      if (y + menuHeight > window.innerHeight - padding) {
        y = Math.max(padding, window.innerHeight - menuHeight - padding);
      } else {
        y = Math.max(padding, y);
      }

      setPosition({ x, y });
      playSoftClick(0.04);
      setIsOpen(true);
    };

    // Close menu on any click outside or left click
    const handlePointerDown = (e: PointerEvent) => {
      if (!isOpen) return;
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return; // Clicked inside the menu
      }
      // If it's a right click, we let contextmenu handler deal with it
      if (e.button === 2) return;
      
      setIsOpen(false);
    };

    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    // Use capture phase for contextmenu to bypass ANY stopPropagation() from other components!
    window.addEventListener("contextmenu", handleGlobalContextMenu, true);
    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("contextmenu", handleGlobalContextMenu, true);
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, hasIndex, activeItems.length]);

  return (
    <>
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, left: position.x, top: position.y }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              left: position.x, 
              top: position.y 
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
              left: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
              top: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
            }}
            className="fixed z-[9999] w-64 bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-xl p-1.5 shadow-2xl"
            onContextMenu={(e) => e.preventDefault()}
          >
            <SharedLayoutBg
              pillClassName="bg-black/5 dark:bg-white/10 rounded-md"
              inset={0}
              className="gap-0.5"
            >
              {/* Browser Controls */}
              {!isHome && (
                <button
                  key="back"
                  onClick={handleBack}
                  className="w-full flex items-center justify-between rounded-md py-1.5 px-2 text-sm outline-none bg-transparent cursor-pointer select-none border-0 text-neutral-800 dark:text-neutral-200"
                >
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4 text-zinc-500" />
                    <span>Back</span>
                  </div>
                  <span className="text-xs tracking-widest text-zinc-400">⌘[</span>
                </button>
              )}
              {!isHome && (
                <button
                  key="forward"
                  onClick={handleForward}
                  className="w-full flex items-center justify-between rounded-md py-1.5 px-2 text-sm outline-none bg-transparent cursor-pointer select-none border-0 text-neutral-800 dark:text-neutral-200"
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                    <span>Forward</span>
                  </div>
                  <span className="text-xs tracking-widest text-zinc-400">⌘]</span>
                </button>
              )}
              
              <button
                key="reload"
                onClick={handleReload}
                className="w-full flex items-center justify-between rounded-md py-1.5 px-2 text-sm outline-none bg-transparent cursor-pointer select-none border-0 text-neutral-800 dark:text-neutral-200"
              >
                <div className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4 text-zinc-500" />
                  <span>Reload</span>
                </div>
                <span className="text-xs tracking-widest text-zinc-400">⌘R</span>
              </button>

              <div key="sep-1" data-non-interactive className="h-px bg-black/5 dark:bg-white/5 my-1" />

              {/* Index Navigation */}
              {hasIndex && activeItems.length > 0 && (
                <div key="label-index" data-non-interactive className="px-2 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Navigation Index
                </div>
              )}
              {hasIndex && activeItems.length > 0 && activeItems.map((item) => (
                <button 
                  key={`item-${item.id}`} 
                  onClick={() => scrollToSection(item.id)} 
                  className="w-full flex items-center gap-2 rounded-md py-1.5 px-2 text-sm outline-none bg-transparent cursor-pointer select-none border-0 text-neutral-800 dark:text-neutral-200"
                >
                  <span className="flex items-center gap-2">
                    {renderIcon(item.icon)}
                    <span>{item.label}</span>
                  </span>
                </button>
              ))}
              {hasIndex && activeItems.length > 0 && (
                <div key="sep-2" data-non-interactive className="h-px bg-black/5 dark:bg-white/5 my-1" />
              )}

              {/* AI Action */}
              <button
                key="ai"
                data-pill-class="bg-[#6495ED]/10 dark:bg-[#6495ED]/20 rounded-md"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-ai"));
                  setIsOpen(false);
                }}
                onMouseEnter={() => {
                  import("@/components/prompt-box-preview");
                }}
                onTouchStart={() => import("@/components/prompt-box-preview")}
                className="w-full flex items-center gap-2 rounded-md py-1.5 px-2 text-sm outline-none font-medium group bg-transparent cursor-pointer select-none border-0"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="size-4 shrink-0"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.025,5.623c.068,.204,.26,.342,.475,.342s.406-.138,.475-.342l.421-1.263,1.263-.421c.204-.068,.342-.259,.342-.474s-.138-.406-.342-.474l-1.263-.421-.421-1.263c-.137-.408-.812-.408-.949,0l-.421,1.263-1.263,.421c-.204,.068-.342,.259-.342,.474s.138,.406,.342,.474l1.263,.421,.421,1.263Z"
                      className="fill-[#6495ED]"
                    />
                    <path
                      d="M16.525,8.803l-4.535-1.793-1.793-4.535c-.227-.572-1.168-.572-1.395,0l-1.793,4.535-4.535,1.793c-.286,.113-.475,.39-.475,.697s.188,.584,.475,.697l4.535,1.793,1.793,4.535c.113,.286,.39,.474,.697,.474s.584-.188,.697-.474l1.793-4.535,4.535-1.793c.286-.113,.475-.39,.475-.697s-.188-.584-.475-.697Z"
                      className="fill-[#6495ED]"
                    />
                  </svg>
                  <span className="animate-shimmer-text font-medium text-[#6495ED]">Ask AI</span>
                </div>
              </button>
            </SharedLayoutBg>
            <style jsx global>{`
              @keyframes shimmer-text {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
              .animate-shimmer-text {
                background: linear-gradient(90deg, #6495ED 0%, #B0C4DE 40%, #E6E6FA 50%, #B0C4DE 60%, #6495ED 100%);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: shimmer-text 2.5s infinite linear;
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
