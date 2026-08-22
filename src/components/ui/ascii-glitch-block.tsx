"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const JAPANESE_CHARS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

export function AsciiGlitchBlock({ className }: { className?: string }) {
  // 16 cells for a 4x4 grid
  const [cells, setCells] = useState<string[]>(Array(16).fill(""));

  useEffect(() => {
    let frameId: number;
    let lastUpdate = 0;
    
    // We update individual cells independently to create a "gradual" effect
    const update = () => {
      const now = Date.now();
      if (now - lastUpdate > 150) { // Slower update for smoother morphing
        setCells((prev) => {
          const newCells = [...prev];
          
          const isSyncFlash = (Math.floor(now / 5000) % 2 === 0) && (now % 5000 < 1500);

          if (isSyncFlash) {
            // Smoothly morph to SYNC and SYS.
            const syncStr = "SYNC";
            const sysStr = "SYS.";
            for (let j = 0; j < 4; j++) {
              newCells[4 + j] = syncStr[j]; // Row 2 (index 4 to 7)
              newCells[8 + j] = sysStr[j];  // Row 3 (index 8 to 11)
            }
            
            // Randomly glitch the remaining cells
            for (const i of [0, 1, 2, 3, 12, 13, 14, 15]) {
              if (Math.random() > 0.6) {
                newCells[i] = JAPANESE_CHARS[Math.floor(Math.random() * JAPANESE_CHARS.length)];
              }
            }
          } else {
            // Normal gradual glitching
            // Only update 3-4 random cells per tick to make it feel organic and gradual
            const cellsToUpdate = Math.floor(Math.random() * 3) + 2;
            for (let c = 0; c < cellsToUpdate; c++) {
              const randomIndex = Math.floor(Math.random() * 16);
              if (Math.random() > 0.8) {
                newCells[randomIndex] = " ";
              } else {
                newCells[randomIndex] = JAPANESE_CHARS[Math.floor(Math.random() * JAPANESE_CHARS.length)];
              }
            }
          }
          
          return newCells;
        });
        lastUpdate = now;
      }
      frameId = requestAnimationFrame(update);
    };
    
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div 
      className={cn(
        "grid grid-cols-4 grid-rows-4 gap-0 w-full h-full items-center justify-items-center font-mono font-bold select-none", 
        className
      )}
      style={{ fontSize: "7.5px", lineHeight: "1" }}
    >
      {cells.map((char, i) => (
        <div key={i} className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={char + i} // Re-animate when char changes
              initial={{ opacity: 0, filter: "blur(2px)", scale: 0.8 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(2px)", scale: 1.2 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute"
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
