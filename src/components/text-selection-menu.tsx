"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { playSoftClick, playChatOpen } from "@/lib/synth-sounds";

export function TextSelectionMenu() {
  const [selection, setSelection] = React.useState({
    text: "",
    x: 0,
    y: 0,
    isAbove: true,
    show: false,
  });

  React.useEffect(() => {
    const handlePointerUp = (e: PointerEvent) => {
      // Small delay to allow the browser to update the selection
      setTimeout(() => {
        const sel = window.getSelection();
        if (sel && sel.toString().trim().length > 0) {
          const range = sel.getRangeAt(0);
          const rects = range.getClientRects();
          if (rects.length === 0) return;
          
          // We use the exact dimensions of the first and last line of the highlight
          const firstRect = rects[0];
          const lastRect = rects[rects.length - 1];
          
          // Determine if we have enough space to show it above the text
          const spaceAbove = firstRect.top;
          let x, y, isAbove;
          
          if (spaceAbove > 60) {
            // Enough space! Show perfectly centered above the FIRST line
            x = firstRect.left + firstRect.width / 2;
            y = firstRect.top - 10;
            isAbove = true;
          } else {
            // Not enough space at top of screen! Flip to show below the LAST line
            x = lastRect.left + lastRect.width / 2;
            y = lastRect.bottom + 10;
            isAbove = false;
          }
          
          playSoftClick(0.025);
          setSelection({
            text: sel.toString().trim(),
            x,
            y,
            isAbove,
            show: true,
          });
        } else {
          setSelection((prev) => ({ ...prev, show: false }));
        }
      }, 10);
    };

    const handlePointerDown = (e: PointerEvent) => {
      // If clicking inside the menu, don't hide it yet
      const target = e.target as HTMLElement;
      if (target.closest("#text-selection-menu")) return;
      
      const sel = window.getSelection();
      if (!sel || sel.toString().trim().length === 0) {
        setSelection((prev) => ({ ...prev, show: false }));
      }
    };

    const handleScroll = () => {
      setSelection((prev) => ({ ...prev, show: false }));
    };

    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return (
    <AnimatePresence>
      {selection.show && (
        <div
          id="text-selection-menu"
          className="fixed z-[9999] pointer-events-auto"
          style={{
            left: selection.x,
            top: selection.y,
            // Wrapper handles the absolute offset so Framer Motion doesn't override it
            transform: selection.isAbove ? "translate(-50%, -100%)" : "translate(-50%, 0%)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: selection.isAbove ? 10 : -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: selection.isAbove ? 5 : -5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative"
          >
            <div className="bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 shadow-2xl rounded-xl p-1.5 flex items-center gap-1">
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
                  playChatOpen(0.035);
                  const enhancedPrompt = `Can you explain or give me more details about this from the portfolio?\n\n"${selection.text.trim()}"`;
                  
                  // Forcefully clear the selection across all browsers/devices
                  const sel = window.getSelection();
                  if (sel) {
                    sel.removeAllRanges();
                    if (sel.empty) {
                      sel.empty();
                    }
                  }
                  
                  // Blur the active element to drop the mobile keyboard/highlight
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }

                  window.dispatchEvent(new CustomEvent("open-ai", { detail: { initialQuery: enhancedPrompt } }));
                  setSelection(prev => ({ ...prev, show: false }));
                }}
                className="flex items-center gap-2 rounded-md hover:bg-[#6495ED]/10 dark:hover:bg-[#6495ED]/20 py-1.5 px-3 text-sm outline-none transition-colors font-medium group"
              >
                <span className="animate-shimmer-text whitespace-nowrap">Ask this to AI?</span>
              </button>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
