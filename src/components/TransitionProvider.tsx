"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export type TransitionDirection = "left" | "right";

const TransitionContext = createContext<{ navigate: (href: string, direction?: TransitionDirection) => void }>({ navigate: () => {} });

export function useTransition() {
    return useContext(TransitionContext);
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState<TransitionDirection>("right");
    const router = useRouter();
    const pathname = usePathname();
    const [windowDimensions, setWindowDimensions] = useState({ w: 0, h: 0 });
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setWindowDimensions({ w: window.innerWidth, h: window.innerHeight });
        const handleResize = () => setWindowDimensions({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navigate = (href: string, dir: TransitionDirection = "right") => {
        if (pathname === href) return;
        setDirection(dir);
        setIsTransitioning(true);
        
        // Wait for the overlay to fully cover the screen (800ms)
        setTimeout(() => {
            const currentUrl = window.location.href;
            router.push(href);
            
            // Wait for Next.js to actually change the page in real-time
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                // If URL changed OR it's been 10 seconds (failsafe)
                if (window.location.href !== currentUrl || attempts > 200) {
                    clearInterval(checkInterval);
                    // Add a tiny delay to ensure the browser has painted the new DOM
                    requestAnimationFrame(() => {
                        setIsTransitioning(false);
                    });
                }
            }, 50);
        }, 800); // matches the curve animation enter duration
    };

    const anim = {
        initial: { x: direction === "right" ? "calc(100% + 100px)" : "calc(-100% - 100px)" },
        enter: { x: "0%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
        exit: { x: direction === "right" ? "calc(-100% - 100px)" : "calc(100% + 100px)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } }
    };

    const initialPath = direction === "right" 
        ? `M100 0 L200 0 L200 ${windowDimensions.h} L100 ${windowDimensions.h} Q-100 ${windowDimensions.h / 2} 100 0`
        : `M0 0 L-100 0 L-100 ${windowDimensions.h} L0 ${windowDimensions.h} Q200 ${windowDimensions.h / 2} 0 0`;
        
    const targetPath = direction === "right"
        ? `M100 0 L200 0 L200 ${windowDimensions.h} L100 ${windowDimensions.h} Q100 ${windowDimensions.h / 2} 100 0`
        : `M0 0 L-100 0 L-100 ${windowDimensions.h} L0 ${windowDimensions.h} Q0 ${windowDimensions.h / 2} 0 0`;

    const curve = {
        initial: { d: initialPath },
        enter: { d: targetPath, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as const } },
        exit: { d: initialPath, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
    };

    const bgColor = "#6495ED";

    return (
        <TransitionContext.Provider value={{ navigate }}>
            {children}
            <AnimatePresence>
                {isTransitioning && windowDimensions.h > 0 && (
                    <motion.div
                        variants={anim}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        className="fixed top-0 left-0 z-[99999] w-screen h-[100dvh] pointer-events-none flex items-center justify-center"
                        style={{ backgroundColor: bgColor }}
                    >
                        <svg
                            className={`absolute top-0 ${direction === "right" ? "-left-[99px]" : "-right-[99px]"} w-[100px] h-full stroke-none overflow-visible`}
                            style={{ fill: bgColor }}
                        >
                            <motion.path
                                variants={curve}
                                initial="initial"
                                animate="enter"
                                exit="exit"
                            />
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>
        </TransitionContext.Provider>
    );
}
