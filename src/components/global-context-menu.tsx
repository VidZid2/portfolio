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

export function GlobalContextMenu({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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
    if (typeof window !== "undefined") window.history.back();
    setIsOpen(false);
  };

  const handleForward = () => {
    if (typeof window !== "undefined") window.history.forward();
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
      
      // Calculate position to prevent overflowing the screen
      let x = e.clientX;
      let y = e.clientY;
      const menuWidth = 256; // w-64 is 256px
      const estimatedHeight = 360; // Better estimate for the flattened menu
      
      if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
      if (y + estimatedHeight > window.innerHeight) y = window.innerHeight - estimatedHeight - 10;

      setPosition({ x, y });
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
  }, [isOpen]);

  // Pixel-perfect auto-correction after the menu renders its true height
  React.useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (position.y + rect.height > window.innerHeight) {
        // If it still overflows after our estimate, smoothly slide it up!
        setPosition(prev => ({
          ...prev,
          y: window.innerHeight - rect.height - 10
        }));
      }
    }
  }, [isOpen]);

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
              left: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              top: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
            }}
            className="fixed z-[9999] w-64 bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 shadow-2xl rounded-xl p-1.5"
            onContextMenu={(e) => e.preventDefault()}
          >
          {/* Browser Controls */}
          <button
            onClick={handleBack}
            className="w-full flex items-center justify-between rounded-md hover:bg-black/5 dark:hover:bg-white/10 py-1.5 px-2 text-sm outline-none transition-colors"
          >
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4 text-zinc-500" />
              <span>Back</span>
            </div>
            <span className="text-xs tracking-widest text-zinc-400">⌘[</span>
          </button>
          
          <button
            onClick={handleForward}
            className="w-full flex items-center justify-between rounded-md hover:bg-black/5 dark:hover:bg-white/10 py-1.5 px-2 text-sm outline-none transition-colors"
          >
            <div className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-zinc-500" />
              <span>Forward</span>
            </div>
            <span className="text-xs tracking-widest text-zinc-400">⌘]</span>
          </button>
          
          <button
            onClick={handleReload}
            className="w-full flex items-center justify-between rounded-md hover:bg-black/5 dark:hover:bg-white/10 py-1.5 px-2 text-sm outline-none transition-colors"
          >
            <div className="flex items-center gap-2">
              <RotateCw className="h-4 w-4 text-zinc-500" />
              <span>Reload</span>
            </div>
            <span className="text-xs tracking-widest text-zinc-400">⌘R</span>
          </button>

          <div className="h-px bg-black/5 dark:bg-white/5 my-1" />

          {/* Index Navigation */}
          {hasIndex && activeItems.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Navigation Index
              </div>
              {activeItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => scrollToSection(item.id)} 
                  className="w-full flex items-center gap-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 py-1.5 px-2 text-sm outline-none transition-colors"
                >
                  {renderIcon(item.icon)}
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="h-px bg-black/5 dark:bg-white/5 my-1" />
            </>
          )}

          {/* AI Action */}
          <style>{`
            @keyframes shimmer-text {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            .animate-shimmer-text {
              background: linear-gradient(90deg, #6495ED 0%, #C4D7FF 50%, #6495ED 100%);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: shimmer-text 3s infinite linear;
            }
          `}</style>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("open-ai"));
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 rounded-md hover:bg-[#6495ED]/10 dark:hover:bg-[#6495ED]/20 py-1.5 px-2 text-sm outline-none transition-colors font-medium group"
          >
            <Sparkles className="h-4 w-4 text-[#6495ED]" />
            <span className="animate-shimmer-text">Ask AI</span>
          </button>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
