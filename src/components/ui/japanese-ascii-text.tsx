"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const KANA = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ';

export interface JapaneseAsciiTextProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
  idleScramble?: boolean;
}

export function JapaneseAsciiText({
  text,
  delay = 0,
  duration = 3000, // Slow reveal
  className,
  idleScramble = false,
}: JapaneseAsciiTextProps) {
  const [chars, setChars] = useState<{ char: string; resolved: boolean }[]>([]);
  const [isFullyResolved, setIsFullyResolved] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: "some" });

  useEffect(() => {
    if (!isInView) return;

    // Initial scrambled state
    setChars(
      text.split('').map((c) => ({
        char: c === ' ' ? ' ' : KANA[Math.floor(Math.random() * KANA.length)],
        resolved: false,
      }))
    );

    // Pre-calculate random reveal thresholds (0 to 1) for each character
    const revealThresholds = text.split('').map(() => Math.random());

    const timeout = setTimeout(() => {
      const startTime = Date.now();
      let frameId: number;
      let lastUpdate = 0;
      const fps = 15; // Slower scramble speed for dramatic effect
      const frameInterval = 1000 / fps;

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);

        if (now - lastUpdate >= frameInterval || progress === 1) {
          lastUpdate = now;
          setChars(
            text.split('').map((actualChar, i) => {
              // A character resolves if the overall progress has passed its random threshold
              if (progress >= revealThresholds[i] || progress === 1 || actualChar === ' ') {
                return { char: actualChar, resolved: true };
              } else {
                return { char: KANA[Math.floor(Math.random() * KANA.length)], resolved: false };
              }
            })
          );
        }

        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        } else {
          setIsFullyResolved(true);
        }
      };

      frameId = requestAnimationFrame(animate);
      
      return () => {
        if (frameId) cancelAnimationFrame(frameId);
      };
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, text, delay, duration]);

  // Idle Scramble Effect
  useEffect(() => {
    if (!idleScramble || !isFullyResolved) return;

    let timeoutId: NodeJS.Timeout;

    const scheduleNextIdle = () => {
      // Random delay between 1.5 to 4 seconds
      const nextDelay = 1500 + Math.random() * 2500;
      timeoutId = setTimeout(() => {
        // Pick a random non-space character index
        const validIndices = text.split('').map((c, i) => c !== ' ' ? i : -1).filter(i => i !== -1);
        if (validIndices.length === 0) return scheduleNextIdle();

        const targetIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
        const originalChar = text[targetIndex];
        
        let scrambleCount = 0;
        const maxScrambles = 5 + Math.random() * 5; // Scramble it 5 to 10 times

        const scrambleFrame = () => {
          scrambleCount++;
          setChars((prev) => {
            const next = [...prev];
            next[targetIndex] = {
              char: KANA[Math.floor(Math.random() * KANA.length)],
              resolved: false,
            };
            return next;
          });

          if (scrambleCount < maxScrambles) {
            timeoutId = setTimeout(scrambleFrame, 100); // 10 fps scramble
          } else {
            // Restore original character
            setChars((prev) => {
              const next = [...prev];
              next[targetIndex] = { char: originalChar, resolved: true };
              return next;
            });
            scheduleNextIdle(); // Schedule the next one
          }
        };

        scrambleFrame();
      }, nextDelay);
    };

    scheduleNextIdle();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [idleScramble, isFullyResolved, text]);

  if (chars.length === 0) {
    return (
      <span ref={containerRef} className={cn("inline", className)}>
        <span className="opacity-0">{text}</span>
      </span>
    );
  }

  return (
    <span ref={containerRef} className={cn("inline-flex flex-nowrap", className)}>
      {chars.map((c, i) => (
        <span
          key={i}
          className={cn(
            "inline-block whitespace-pre transition-colors duration-200",
            !c.resolved ? "text-[#6495ED]" : ""
          )}
        >
          {c.char}
        </span>
      ))}
    </span>
  );
}
