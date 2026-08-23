"use client";
import { motion, AnimatePresence } from "motion/react";
import { BellIcon, XIcon } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { useMeasure } from "@/hooks/use-measure";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AsciiText } from "./ascii-text";

export default function DynamicIslandNotification({
  title,
  children,
  showNotification,
  closeNotification,
}: Readonly<{
  title: string;
  children: React.ReactNode;
  showNotification: boolean;
  closeNotification: () => void;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [ref, { height: viewHeight }] = useMeasure();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const WIDTH = isMobile ? 320 : 420;

  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const handleOpenSettings = () => {
    setIsOpen((prev) => !prev);
  };

  if (!hydrated) return null;

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          exit={{ y: 190, filter: "blur(8px)", opacity: 0, scale: 0 }}
          animate={{
            height: isOpen ? (viewHeight ?? 0) : 52,
            width: isOpen ? WIDTH : 52,
          }}
          className={cn(
            "absolute z-50 bottom-6 right-6 overflow-hidden rounded-2xl dark:bg-neutral-900 bg-white border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-xl transition-shadow",
            !isOpen &&
              "after:size-2 after:absolute after:top-3 after:right-3 after:bg-blue-500 after:rounded-full after:pointer-events-none",
            !isOpen &&
              "before:size-3 before:absolute before:top-2.5 before:right-2.5 before:border before:border-blue-500 before:rounded-xl before:animate-ping before:pointer-events-none",
            !isOpen && "dark:hover:bg-neutral-800 hover:bg-neutral-50 cursor-pointer"
          )}
          transition={{
            type: "spring",
            duration: 0.6,
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {!isOpen && (
              <motion.button
                key="icon-button"
                className="size-full absolute top-0 right-0 inline-grid place-content-center transform-gpu dark:text-neutral-400 text-neutral-600 transition-colors duration-500 dark:hover:text-neutral-300 hover:text-neutral-700"
                onClick={handleOpenSettings}
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BellIcon className="transform-gpu transition duration-300 pointer-events-none size-6" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                key="content"
                ref={(node: HTMLDivElement | null) => ref(node)}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.6, type: "spring" }}
                className="flex flex-col gap-2 p-3 pr-8 relative"
                style={{ width: WIDTH }}
              >
                <button
                  className="absolute top-2.5 right-2.5 p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    closeNotification();
                  }}
                >
                  <XIcon className="size-4" />
                </button>
                <div className="space-y-1">
                  <h6 className="text tracking-tight font-medium text-xs text-neutral-500 dark:text-neutral-400 uppercase">
                    <AsciiText text={title} duration={800} />
                  </h6>
                  <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-snug">
                    {children}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
