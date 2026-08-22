"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JapaneseAsciiText } from "@/components/ui/japanese-ascii-text";

export function AutoShowTooltip({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const [placement, setPlacement] = useState<"top" | "bottom">("top");
  const [offsets, setOffsets] = useState({ left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceTop = rect.top;
        const isTop = spaceTop > 90;
        
        // Tooltip width is 230px to fit the text in a single line
        const tooltipWidth = 230;
        const halfWidth = tooltipWidth / 2;
        const padding = 12; // Safety margin from screen edges
        
        // Center of button relative to the wrapper
        let leftOffset = rect.width / 2;
        
        // Center of button in viewport
        const viewportCenter = rect.left + rect.width / 2;
        
        // Clamp bounds
        if (viewportCenter - halfWidth < padding) {
          const shift = padding - (viewportCenter - halfWidth);
          leftOffset += shift;
        } else if (viewportCenter + halfWidth > window.innerWidth - padding) {
          const shift = (viewportCenter + halfWidth) - (window.innerWidth - padding);
          leftOffset -= shift;
        }
        setPlacement(isTop ? "top" : "bottom");
        setOffsets({ left: leftOffset });
      }
    };

    // Auto show after 1 second delay
    const timer = setTimeout(() => {
      handlePosition();
      setShow(true);
    }, 1000);

    // Track positioning on scroll/resize
    window.addEventListener("resize", handlePosition);
    window.addEventListener("scroll", handlePosition, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handlePosition);
      window.removeEventListener("scroll", handlePosition);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full" 
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: "-50%", y: placement === "top" ? 5 : -5 }}
            animate={{ opacity: 1, x: "-50%", y: 0 }}
            exit={{ opacity: 0, x: "-50%", y: placement === "top" ? 5 : -5 }}
            transition={{ duration: 0.2 }}
            style={{ 
              position: "absolute", 
              width: "230px", 
              zIndex: 9999,
              top: placement === "top" ? "auto" : "calc(100% + 8px)",
              bottom: placement === "top" ? "calc(100% + 8px)" : "auto",
              left: offsets.left
            }}
            onMouseLeave={() => setShow(false)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShow(false);
            }}
            className={`pointer-events-auto px-3 py-2.5 rounded-lg text-center cursor-pointer
              bg-black dark:bg-white text-white dark:text-black
            `}
          >
            <div className="relative flex items-center justify-center">
              <p className="text-[11px] sm:text-[12px] font-semibold leading-tight text-center select-none whitespace-nowrap text-[#6495ED]">
                <JapaneseAsciiText text="Click here to view my Resume!" duration={1500} />
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
