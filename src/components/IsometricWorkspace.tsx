"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sun, Moon, Lightbulb, LightbulbOff, Volume2, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { playSoftClick } from "@/lib/synth-sounds";

export interface IsometricWorkspaceProps {
  name?: string;
  role?: string;
  tagline?: string;
  location?: string;
  compact?: boolean;
}

export const IsometricWorkspace: React.FC<IsometricWorkspaceProps> = ({
  name = "Josiah De Asis",
  role = "UI Systems Architect",
  tagline = "Creating with code. Small details matter.",
  location = "Philippines",
  compact = false,
}) => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [isLightOn, setIsLightOn] = useState<boolean>(true);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);

  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position values for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth tilt tracking
  const springConfig = { damping: 20, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const xPercent = (e.clientX - rect.left) / width - 0.5;
      const yPercent = (e.clientY - rect.top) / height - 0.5;

      mouseX.set(xPercent);
      mouseY.set(yPercent);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const toggleLamp = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (audioFeedback) playSoftClick(isLightOn ? 0.03 : 0.06);
    setIsLightOn((prev) => !prev);
  };

  const toggleTheme = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (audioFeedback) playSoftClick(0.05);
    setTheme(isDarkMode ? "light" : "dark");
  };

  // If used in compact mode (e.g. top banner canvas)
  if (compact) {
    return (
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative flex items-center justify-center cursor-crosshair select-none overflow-hidden"
        style={{ perspective: 1000 }}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="w-full h-full relative flex items-center justify-center"
        >
          {/* Dynamic Spotlight Glare */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20 transition-opacity z-10"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, ${isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.7)"} 0%, transparent 60%)`
              ),
            }}
          />

          {/* Isometric Room SVG Artwork */}
          <svg
            viewBox="0 0 500 380"
            className="w-full h-full max-h-full drop-shadow-md transition-transform duration-300 pointer-events-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Lamp Light Glow Gradient */}
              <radialGradient id="lampGlowCompact" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={isLightOn ? (isDarkMode ? "0.55" : "0.40") : "0"} />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity={isLightOn ? "0.15" : "0"} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>

              {/* Monitor Screen Glow */}
              <linearGradient id="monitorScreenCompact" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDarkMode ? "#09090b" : "#1e1b4b"} />
                <stop offset="100%" stopColor={isDarkMode ? "#18181b" : "#312e81"} />
              </linearGradient>

              {/* Room Grid Pattern */}
              <pattern id="isoGridCompact" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                <path
                  d="M 0 10 L 20 10 M 10 0 L 10 20"
                  stroke={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            {/* Background Grid Floor Plate */}
            <polygon
              points="250,90 440,195 250,300 60,195"
              fill={isDarkMode ? "#121215" : "#e4e4e7"}
              stroke={isDarkMode ? "#27272a" : "#d4d4d8"}
              strokeWidth="1.5"
            />
            <polygon points="250,90 440,195 250,300 60,195" fill="url(#isoGridCompact)" />

            {/* Room Back Walls */}
            <polygon
              points="60,195 250,300 250,150 60,45"
              fill={isDarkMode ? "#18181b" : "#f4f4f5"}
              stroke={isDarkMode ? "#27272a" : "#e4e4e7"}
              strokeWidth="1"
            />
            <polygon
              points="250,300 440,195 440,45 250,150"
              fill={isDarkMode ? "#1c1c20" : "#ebebeb"}
              stroke={isDarkMode ? "#27272a" : "#e4e4e7"}
              strokeWidth="1"
            />

            {/* Floating Shelf with Plants & Books */}
            <g transform="translate(90, 75)">
              <polygon points="40,25 100,60 100,66 40,31" fill={isDarkMode ? "#3f3f46" : "#a1a1aa"} />
              <polygon points="48,22 55,26 55,14 48,10" fill="#3b82f6" />
              <polygon points="57,27 64,31 64,17 57,13" fill="#ec4899" />
              <ellipse cx="85" cy="45" rx="6" ry="3" fill="#10b981" />
              <polygon points="81,45 89,45 87,52 83,52" fill={isDarkMode ? "#71717a" : "#d4d4d8"} />
            </g>

            {/* Volumetric Lamp Light Cone */}
            {isLightOn && (
              <polygon
                points="165,145 100,270 290,285 220,165"
                fill="url(#lampGlowCompact)"
                className="transition-opacity duration-500 pointer-events-none"
              />
            )}

            {/* Isometric Desk Table */}
            <g id="desk-table">
              <polygon
                points="250,160 370,225 250,290 130,225"
                fill={isDarkMode ? "#27272a" : "#ffffff"}
                stroke={isDarkMode ? "#3f3f46" : "#e4e4e7"}
                strokeWidth="1.5"
              />
              <polygon points="130,225 250,290 250,298 130,233" fill={isDarkMode ? "#1e1e22" : "#d4d4d8"} />
              <polygon points="250,290 370,225 370,233 250,298" fill={isDarkMode ? "#18181b" : "#c4c4c8"} />
              <line x1="135" y1="233" x2="135" y2="280" stroke={isDarkMode ? "#52525b" : "#71717a"} strokeWidth="4" strokeLinecap="round" />
              <line x1="365" y1="233" x2="365" y2="280" stroke={isDarkMode ? "#52525b" : "#71717a"} strokeWidth="4" strokeLinecap="round" />
              <line x1="250" y1="298" x2="250" y2="340" stroke={isDarkMode ? "#71717a" : "#a1a1aa"} strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* Desk Accessories */}
            <g id="desk-accessories">
              <polygon points="250,185 335,230 250,275 165,230" fill={isDarkMode ? "#18181b" : "#3f3f46"} />
              <polygon points="230,235 270,255 260,260 220,240" fill={isDarkMode ? "#3f3f46" : "#d4d4d8"} stroke={isLightOn ? "#60a5fa" : "none"} strokeWidth="0.5" />
              <ellipse cx="285" cy="245" rx="4" ry="2.5" fill={isDarkMode ? "#71717a" : "#a1a1aa"} />
              <ellipse cx="160" cy="215" rx="5" ry="3" fill="#f97316" />
              <polygon points="155,215 165,215 164,222 156,222" fill="#ea580c" />
            </g>

            {/* Ultrawide Monitor & Stand */}
            <g id="monitor" transform="translate(0, -10)">
              <ellipse cx="250" cy="205" rx="14" ry="7" fill={isDarkMode ? "#3f3f46" : "#a1a1aa"} />
              <line x1="250" y1="205" x2="250" y2="175" stroke={isDarkMode ? "#52525b" : "#71717a"} strokeWidth="3" />
              <polygon
                points="210,135 290,175 290,140 210,100"
                fill="url(#monitorScreenCompact)"
                stroke={isDarkMode ? "#52525b" : "#1e1b4b"}
                strokeWidth="1.5"
              />
              <line x1="225" y1="120" x2="250" y2="132" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="230" y1="127" x2="270" y2="147" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="235" y1="134" x2="260" y2="147" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="230" y1="141" x2="275" y2="163" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Interactive Articulated Desk Lamp */}
            <g id="desk-lamp" className="cursor-pointer group pointer-events-auto" onClick={toggleLamp}>
              <ellipse cx="180" cy="195" rx="8" ry="4" fill={isDarkMode ? "#3f3f46" : "#71717a"} />
              <line x1="180" y1="195" x2="165" y2="160" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              <line x1="165" y1="160" x2="185" y2="140" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
              <polygon
                points="180,132 195,140 185,150 170,142"
                fill={isLightOn ? "#fbbf24" : isDarkMode ? "#52525b" : "#a1a1aa"}
                stroke="#d97706"
                strokeWidth="1"
                className="transition-colors duration-300 group-hover:scale-105"
              />
              {isLightOn && (
                <circle cx="183" cy="144" r="3.5" fill="#ffffff" className="animate-pulse" />
              )}
            </g>
          </svg>

          {/* Floating Lamp Toggle Quick Button on Corner */}
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1">
            <button
              onClick={toggleLamp}
              title={isLightOn ? "Turn Lamp Off" : "Turn Lamp On"}
              className={`p-1 rounded-md text-[11px] font-mono flex items-center gap-1 border transition-all ${
                isLightOn
                  ? "bg-amber-400/20 text-amber-600 dark:text-amber-300 border-amber-500/30"
                  : "bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-500 border-zinc-200 dark:border-zinc-700"
              }`}
            >
              {isLightOn ? <Lightbulb className="w-3 h-3 text-amber-500" /> : <LightbulbOff className="w-3 h-3" />}
              <span className="hidden sm:inline-block">{isLightOn ? "Desk Lamp" : "Lamp Off"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Full Card View (matching Fig 1.)
  const stateLabel = `Avatar with lights ${isLightOn ? "on" : "off"} in ${isDarkMode ? "dark" : "light"} mode`;

  return (
    <div className={`w-full max-w-xl mx-auto font-sans antialiased transition-colors duration-500`}>
      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-2xl transition-all">
        {/* Header / Figure metadata */}
        <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-3.5 mb-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Fig. 1.</span>
            <span className="hidden sm:inline-block text-zinc-400 dark:text-zinc-600">/</span>
            <span className="truncate max-w-[200px] sm:max-w-none text-[11px] sm:text-xs">{stateLabel}</span>
          </div>

          {/* Quick toggle bar */}
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-1 rounded-lg">
            <button
              onClick={toggleLamp}
              title={isLightOn ? "Turn Lamp Off" : "Turn Lamp On"}
              className={`p-1.5 rounded-md transition-all ${
                isLightOn
                  ? "bg-amber-400/20 text-amber-600 dark:text-amber-300 font-medium"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {isLightOn ? <Lightbulb className="w-3.5 h-3.5" /> : <LightbulbOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={toggleTheme}
              title="Toggle Light/Dark Theme"
              className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all"
            >
              {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                setAudioFeedback(!audioFeedback);
                if (!audioFeedback) playSoftClick(0.06);
              }}
              title="Toggle Audio Feedback"
              className={`p-1.5 rounded-md transition-all ${audioFeedback ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-400 dark:text-zinc-600"}`}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3D Perspective Stage */}
        <div style={{ perspective: 1200 }} className="relative">
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-crosshair select-none bg-gradient-to-b from-zinc-100 to-zinc-200/80 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800/80 transition-colors duration-500 flex items-center justify-center"
          >
            {/* Dynamic Spotlight Glare */}
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-25 transition-opacity"
              style={{
                background: useTransform(
                  [glareX, glareY],
                  ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, ${isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.8)"} 0%, transparent 60%)`
                ),
              }}
            />

            {/* Isometric Room SVG Artwork */}
            <svg
              viewBox="0 0 500 400"
              className="w-full h-full p-4 drop-shadow-lg transition-transform duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="lampGlowFull" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity={isLightOn ? (isDarkMode ? "0.45" : "0.35") : "0"} />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity={isLightOn ? "0.12" : "0"} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>

                <linearGradient id="monitorScreenFull" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isDarkMode ? "#09090b" : "#1e1b4b"} />
                  <stop offset="100%" stopColor={isDarkMode ? "#18181b" : "#312e81"} />
                </linearGradient>

                <pattern id="isoGridFull" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                  <path
                    d="M 0 10 L 20 10 M 10 0 L 10 20"
                    stroke={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              <polygon
                points="250,90 440,195 250,300 60,195"
                fill={isDarkMode ? "#121215" : "#e4e4e7"}
                stroke={isDarkMode ? "#27272a" : "#d4d4d8"}
                strokeWidth="1.5"
              />
              <polygon points="250,90 440,195 250,300 60,195" fill="url(#isoGridFull)" />

              <polygon
                points="60,195 250,300 250,150 60,45"
                fill={isDarkMode ? "#18181b" : "#f4f4f5"}
                stroke={isDarkMode ? "#27272a" : "#e4e4e7"}
                strokeWidth="1"
              />
              <polygon
                points="250,300 440,195 440,45 250,150"
                fill={isDarkMode ? "#1c1c20" : "#ebebeb"}
                stroke={isDarkMode ? "#27272a" : "#e4e4e7"}
                strokeWidth="1"
              />

              <g transform="translate(90, 75)">
                <polygon points="40,25 100,60 100,66 40,31" fill={isDarkMode ? "#3f3f46" : "#a1a1aa"} />
                <polygon points="48,22 55,26 55,14 48,10" fill="#3b82f6" />
                <polygon points="57,27 64,31 64,17 57,13" fill="#ec4899" />
                <ellipse cx="85" cy="45" rx="6" ry="3" fill="#10b981" />
                <polygon points="81,45 89,45 87,52 83,52" fill={isDarkMode ? "#71717a" : "#d4d4d8"} />
              </g>

              {isLightOn && (
                <polygon
                  points="165,145 100,270 290,285 220,165"
                  fill="url(#lampGlowFull)"
                  className="transition-opacity duration-500"
                />
              )}

              <g id="desk-table-full">
                <polygon
                  points="250,160 370,225 250,290 130,225"
                  fill={isDarkMode ? "#27272a" : "#ffffff"}
                  stroke={isDarkMode ? "#3f3f46" : "#e4e4e7"}
                  strokeWidth="1.5"
                />
                <polygon points="130,225 250,290 250,298 130,233" fill={isDarkMode ? "#1e1e22" : "#d4d4d8"} />
                <polygon points="250,290 370,225 370,233 250,298" fill={isDarkMode ? "#18181b" : "#c4c4c8"} />
                <line x1="135" y1="233" x2="135" y2="280" stroke={isDarkMode ? "#52525b" : "#71717a"} strokeWidth="4" strokeLinecap="round" />
                <line x1="365" y1="233" x2="365" y2="280" stroke={isDarkMode ? "#52525b" : "#71717a"} strokeWidth="4" strokeLinecap="round" />
                <line x1="250" y1="298" x2="250" y2="340" stroke={isDarkMode ? "#71717a" : "#a1a1aa"} strokeWidth="4" strokeLinecap="round" />
              </g>

              <g id="desk-accessories-full">
                <polygon points="250,185 335,230 250,275 165,230" fill={isDarkMode ? "#18181b" : "#3f3f46"} />
                <polygon points="230,235 270,255 260,260 220,240" fill={isDarkMode ? "#3f3f46" : "#d4d4d8"} stroke={isLightOn ? "#60a5fa" : "none"} strokeWidth="0.5" />
                <ellipse cx="285" cy="245" rx="4" ry="2.5" fill={isDarkMode ? "#71717a" : "#a1a1aa"} />
                <ellipse cx="160" cy="215" rx="5" ry="3" fill="#f97316" />
                <polygon points="155,215 165,215 164,222 156,222" fill="#ea580c" />
              </g>

              <g id="monitor-full" transform="translate(0, -10)">
                <ellipse cx="250" cy="205" rx="14" ry="7" fill={isDarkMode ? "#3f3f46" : "#a1a1aa"} />
                <line x1="250" y1="205" x2="250" y2="175" stroke={isDarkMode ? "#52525b" : "#71717a"} strokeWidth="3" />
                <polygon
                  points="210,135 290,175 290,140 210,100"
                  fill="url(#monitorScreenFull)"
                  stroke={isDarkMode ? "#52525b" : "#1e1b4b"}
                  strokeWidth="1.5"
                />
                <line x1="225" y1="120" x2="250" y2="132" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="230" y1="127" x2="270" y2="147" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="235" y1="134" x2="260" y2="147" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="230" y1="141" x2="275" y2="163" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              <g id="desk-lamp-full" className="cursor-pointer group pointer-events-auto" onClick={toggleLamp}>
                <ellipse cx="180" cy="195" rx="8" ry="4" fill={isDarkMode ? "#3f3f46" : "#71717a"} />
                <line x1="180" y1="195" x2="165" y2="160" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                <line x1="165" y1="160" x2="185" y2="140" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                <polygon
                  points="180,132 195,140 185,150 170,142"
                  fill={isLightOn ? "#fbbf24" : isDarkMode ? "#52525b" : "#a1a1aa"}
                  stroke="#d97706"
                  strokeWidth="1"
                  className="transition-colors duration-300 group-hover:scale-105"
                />
                {isLightOn && (
                  <circle cx="183" cy="144" r="3.5" fill="#ffffff" className="animate-pulse" />
                )}
              </g>
            </svg>

            {/* Floating Interaction Hint */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-zinc-400 dark:text-zinc-500 pointer-events-none">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                follows your cursor
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                click lamp to toggle light
              </span>
            </div>
          </motion.div>
        </div>

        {/* Profile Card Footer */}
        <div className="mt-4 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{name}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {role}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{tagline}</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 dark:text-zinc-500">
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsometricWorkspace;
