"use client";

import { memo, useMemo, useState, useEffect, useId, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DrawUnderlineLink } from "@/components/sora-ui/texts/draw-underline-link";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionData = {
  [date: string]: {
    level: ContributionLevel;
    label?: string;
    count?: number;
  };
};

export type ThemeColors = {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
};

export type CellShape = "rounded" | "circle";

export type GithubCalendarProps = {
  username?: string; // GitHub username
  data?: ContributionData; //Optional - Only for manual data
  startDate?: string;
  endDate?: string;
  startsOnSunday?: boolean; //Want to start weeks on Sunday or not ?
  cellSize?: number;
  cellGap?: number;
  cellShape?: CellShape; //Rounded | Circle
  theme?: "github" | ThemeColors;
  showMonthLabels?: boolean; // Want the month labels on top
  showStats?: boolean;
  showLegend?: boolean;
  deviceType?: "mobile" | "tablet" | "desktop"; // Changes animation text and label sizes
  className?: string; // Custom class for custom styling
  onStatusChange?: (status: "live" | "down" | "loading") => void;
};

// ─── Built-in themes ──────────────────────────────────────────────────────────

const THEMES: Record<string, ThemeColors> = {
  github: {
    level0: "#ffffff",
    level1: "#0e4429",
    level2: "#006d32",
    level3: "#26a641",
    level4: "#39d353",
  },
};

const DARK_THEMES: Record<string, ThemeColors> = {
  github: {
    level0: "#0a0a0a",
    level1: "#0e4429",
    level2: "#006d32",
    level3: "#26a641",
    level4: "#39d353",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(dateStr: string): Date {
  const parts = dateStr.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const FULL_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatTooltipDate(dateStr: string): string {
  try {
    const date = parseDate(dateStr);
    const month = FULL_MONTH_NAMES[date.getMonth()];
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    return `${month} ${day}${suffix}`;
  } catch {
    return dateStr;
  }
}

import {
  playLaserSound,
  playExplosionSound,
  playHitChime,
  playVictoryFanfare,
  playSuperComboSound,
  playPowerUpSound,
  playUFOSound,
  playEMPNukeSound,
  playHoverTick,
} from "@/lib/synth-sounds";

function playSound(
  type: "laser" | "explosion" | "hit" | "victory" | "superCombo" | "powerup" | "ufo" | "nuke",
  param: number = 0
) {
  if (type === "laser") playLaserSound(0.055);
  else if (type === "explosion") playExplosionSound(0.07);
  else if (type === "hit") playHitChime(param, 0.075);
  else if (type === "victory") playVictoryFanfare(0.09);
  else if (type === "superCombo") playSuperComboSound(param === 10 ? 10 : 5, 0.08);
  else if (type === "powerup") playPowerUpSound(0.085);
  else if (type === "ufo") playUFOSound(0.085);
  else if (type === "nuke") playEMPNukeSound(0.095);
}

// ─── API fetch ────────────────────────────────────────────────────────────────

type APIResponse = {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: number }[];
};

async function fetchContributions(username: string): Promise<ContributionData> {
  // 1. Primary: Internal robust API route with caching & official GitHub scraping
  try {
    const res = await fetch(`/api/github/contributions?username=${username}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.contributions && Object.keys(json.contributions).length > 0) {
        return json.contributions as ContributionData;
      }
    }
  } catch (err) {
    console.warn("Internal GitHub contributions API failed, falling back to external sources:", err);
  }

  // 2. Secondary: jogruber API
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=all`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const json: APIResponse = await res.json();
      if (json && Array.isArray(json.contributions) && json.contributions.length > 0) {
        const result: ContributionData = {};
        for (const entry of json.contributions) {
          result[entry.date] = {
            level: Math.min(4, Math.max(0, entry.level)) as ContributionLevel,
            count: entry.count,
          };
        }
        return result;
      }
    }
  } catch (err) {
    console.warn("Secondary GitHub API fetch failed, trying tertiary fallback:", err);
  }

  // 3. Tertiary Fallback Endpoint
  try {
    const res2 = await fetch(
      `https://github-contributions.vercel.app/api/v1/${username}`,
      { cache: "no-store" }
    );
    if (res2.ok) {
      const json2 = await res2.json();
      const list = json2?.contributions;
      if (Array.isArray(list) && list.length > 0) {
        const result: ContributionData = {};
        for (const entry of list) {
          result[entry.date] = {
            level: Math.min(4, Math.max(0, entry.intensity ?? entry.level ?? 0)) as ContributionLevel,
            count: entry.count ?? 0,
          };
        }
        return result;
      }
    }
  } catch (err) {
    console.warn("Tertiary GitHub API fetch failed:", err);
  }

  throw new Error(`Could not fetch live contributions for "${username}"`);
}

// ─── Build calendar grid ──────────────────────────────────────────────────────

function buildGrid(
  startDate: string,
  endDate: string,
  startsOnSunday: boolean,
): {
  weeks: (string | null)[][];
  monthLabels: { label: string; weekIndex: number; exactWeek: number }[];
  gridStart: string;
} {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const startDay = startsOnSunday ? 0 : 1;
  const startDow = start.getDay();
  const offset = (startDow - startDay + 7) % 7;
  const gridStart = addDays(start, -offset);

  const weeks: (string | null)[][] = [];
  const monthLabels: { label: string; weekIndex: number; exactWeek: number }[] = [];

  let current = new Date(gridStart);
  let weekIndex = 0;
  let lastMonth = -1;

  while (
    current <= end ||
    (weeks.length > 0 && (weeks[weeks.length - 1]?.length ?? 0) < 7)
  ) {
    const week: (string | null)[] = [];

    for (let d = 0; d < 7; d++) {
      const dateStr = formatDate(current);
      const isInRange = current >= start && current <= end;
      week.push(isInRange ? dateStr : null);

      if (isInRange && current.getMonth() !== lastMonth) {
        lastMonth = current.getMonth();
        monthLabels.push({
          label: MONTH_NAMES[current.getMonth()]!,
          weekIndex,
          exactWeek: weekIndex + (d / 7),
        });
      }

      current = addDays(current, 1);
    }

    weeks.push(week);
    weekIndex++;

    if (
      current > end &&
      weeks.length > 0 &&
      (weeks[weeks.length - 1]?.every(
        (d) => d === null || parseDate(d) > end,
      ) ??
        false)
    )
      break;
  }

  return { weeks, monthLabels, gridStart: formatDate(gridStart) };
}

// ─── Tooltip state type ───────────────────────────────────────────────────────

type TooltipState = {
  visible: boolean;
  date: string;
  count: number | undefined;
  label: string | undefined;
  x: number;
  y: number;
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

// ─── Animation Overlay Cell ─────────────────────────────────────────────────────

const ASCII_CHARS = ['*', '+', '#', '~', 'x', '.', ':', '-', '<', '>', '/', '\\', 'o', '0', '1'];

interface AnimOverlayCellProps {
  wi: number;
  di: number;
  x: number;
  y: number;
  size: number;
  rx: number;
  defaultFill: string;
  animClass: string;
  animData?: { delay: string; shouldFlash: boolean };
  isHighlighted: boolean;
  isDark: boolean;
}

// ─── Shared 60fps Scramble Animation Controller ──────────────────────────────

type ScrambleSubscriber = {
  element: SVGTextElement;
  isActive: boolean;
};

const scrambleSubscribers = new Set<ScrambleSubscriber>();
let sharedScrambleRafId = 0;
let lastScrambleTime = 0;

function runSharedScramble(now: number) {
  if (scrambleSubscribers.size === 0) {
    sharedScrambleRafId = 0;
    return;
  }

  // Update glyphs at ~18 scrambles/sec (every 55ms) for crisp matrix effect
  // while running inside a single unified requestAnimationFrame loop (0 timer thrashing)
  if (now - lastScrambleTime >= 55) {
    lastScrambleTime = now;
    const len = ASCII_CHARS.length;
    scrambleSubscribers.forEach((sub) => {
      if (sub.isActive && sub.element) {
        sub.element.textContent = ASCII_CHARS[Math.floor(Math.random() * len)];
      }
    });
  }

  sharedScrambleRafId = requestAnimationFrame(runSharedScramble);
}

function registerScrambleCell(sub: ScrambleSubscriber) {
  scrambleSubscribers.add(sub);
  if (!sharedScrambleRafId) {
    lastScrambleTime = performance.now();
    sharedScrambleRafId = requestAnimationFrame(runSharedScramble);
  }
}

function unregisterScrambleCell(sub: ScrambleSubscriber) {
  scrambleSubscribers.delete(sub);
}

function AnimOverlayCell({
  wi,
  di: _di,
  x,
  y,
  size,
  rx,
  defaultFill,
  animClass,
  animData,
  isHighlighted,
  isDark,
}: AnimOverlayCellProps) {
  const textRef = useRef<SVGTextElement>(null);
  const [phase, setPhase] = useState<"ascii" | "solid">("ascii");
  const disperseDelay = useRef(0);

  useEffect(() => {
    if (disperseDelay.current === 0) {
      // Natural organic wave dispersal from left to right with stochastic scatter
      disperseDelay.current = 700 + wi * 22 + Math.random() * 450;
    }

    const sub: ScrambleSubscriber = {
      element: textRef.current!,
      isActive: true,
    };

    if (textRef.current) {
      textRef.current.textContent = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
      registerScrambleCell(sub);
    }

    // Gradually disperse the ASCII effect into solid block
    const disperseTimer = setTimeout(() => {
      sub.isActive = false;
      setPhase("solid");
    }, disperseDelay.current);

    // Unregister completely after the smooth fade-out transition finishes (500ms)
    const cleanupTimer = setTimeout(() => {
      unregisterScrambleCell(sub);
    }, disperseDelay.current + 500);

    return () => {
      clearTimeout(disperseTimer);
      clearTimeout(cleanupTimer);
      unregisterScrambleCell(sub);
    };
  }, [wi]);

  const isSolid = phase === "solid";

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        rx={rx}
        fill={defaultFill}
        className={isSolid ? animClass : ""}
        style={{
          animationDelay: animData?.delay,
          ...({ "--highlight": "#6495ED" } as React.CSSProperties),
        }}
      />
      <text
        ref={textRef}
        x={x + size / 2}
        y={y + size / 2 + 1}
        fontSize={size * 0.88}
        // Highlighted cells are signature blue, others subtle monochrome
        fill={isHighlighted ? "#6495ED" : (isDark ? "#52525b" : "#a1a1aa")}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="monospace"
        fontWeight="bold"
        pointerEvents="none"
        style={{
          opacity: isSolid ? 0 : 1,
          transform: isSolid ? "scale(0.35)" : "scale(1)",
          transformOrigin: `${x + size / 2}px ${y + size / 2 + 1}px`,
          transition: "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "opacity, transform",
        }}
      />
    </g>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const GithubCalendar = memo(function GithubCalendar({
  username,
  data: dataProp,
  startDate,
  endDate,
  startsOnSunday = true,
  cellSize = 12,
  cellGap = 3,
  cellShape = "rounded",
  theme = "github",
  showMonthLabels = true,
  showStats = true,
  showLegend = true,
  deviceType = "desktop",
  className,
  onStatusChange,
}: GithubCalendarProps) {
  const id = useId();
  // Scroll ref — used to auto-scroll to most recent months on compact viewports
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.body.classList.contains("dark"),
      );
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    const opts = { attributes: true, attributeFilter: ["class"] };
    observer.observe(document.documentElement, opts);
    observer.observe(document.body, opts);

    return () => observer.disconnect();
  }, []);

  // ── Fetch state ────────────────────────────────────────────────────────
  const [fetchedData, setFetchedData] = useState<ContributionData | null>(null);
  const [, setLoading] = useState(!!username);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState<"idle" | "animating" | "fading" | "done">("idle");
  const [shakeError, setShakeError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let isPlaying = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isPlaying) {
          isPlaying = true;
          setAnimationPhase("animating");
          timer1 = setTimeout(() => {
            setAnimationPhase("fading");
          }, 4000);
          timer2 = setTimeout(() => {
            setAnimationPhase("done");
          }, 5000);
        } else if (!entry?.isIntersecting && isPlaying) {
          isPlaying = false;
          setAnimationPhase("idle");
          clearTimeout(timer1);
          clearTimeout(timer2);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (!username) return;
    const frame = requestAnimationFrame(() => {
      setFetchedData(null);
      setFetchError(null);
      setLoading(true);
    });
    onStatusChange?.("loading");

    fetchContributions(username)
      .then((d) => {
        setFetchedData(d);
        onStatusChange?.("live");
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e);
        setFetchError(msg);
        onStatusChange?.("down");
      })
      .finally(() => setLoading(false));
    return () => cancelAnimationFrame(frame);
  }, [username, onStatusChange]);

  // ── Choose data source ─────────────────────────────────────────────────
  const data: ContributionData = useMemo(
    () => dataProp ?? fetchedData ?? {},
    [dataProp, fetchedData]
  );

  // ── Resolve dates ──────────────────────────────────────────────────────
  const resolvedEnd = endDate ?? formatDate(new Date());
  const resolvedStart = useMemo(() => {
    if (startDate) return startDate;
    const d = parseDate(resolvedEnd);
    d.setMonth(d.getMonth() - 9);
    d.setDate(d.getDate() + 1);
    return formatDate(d);
  }, [startDate, resolvedEnd]);

  // ── Resolve theme colors ───────────────────────────────────────────────
  const activeColors = useMemo(() => {
    if (typeof theme === "object") return theme;
    return isDark ? DARK_THEMES.github : THEMES.github;
  }, [theme, isDark]);

  // ── Hover & Selection state ──────────────────────────────────────────
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    wi: number;
    di: number;
    x: number;
    y: number;
    level: number;
    count?: number;
    label?: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const lastTickTime = useRef(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstShowRef = useRef(true);
  const [isFirstShow, setIsFirstShow] = useState(true);

  const markFirstShow = useCallback((value: boolean) => {
    isFirstShowRef.current = value;
    setIsFirstShow(value);
  }, []);

  const triggerHoverSound = useCallback(() => {
    const now = performance.now();
    if (now - lastTickTime.current > 75) {
      lastTickTime.current = now;
      playHoverTick(0.02);
    }
  }, []);

  // ── Tooltip state ──────────────────────────────────────────────────────
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    date: "",
    count: undefined,
    label: undefined,
    x: 0,
    y: 0,
  });

  const handleCellEnter = useCallback(
    (
      date: string,
      wi: number,
      di: number,
      cellX: number,
      cellY: number,
      level: number,
      entry: { count?: number; label?: string; level?: number } | undefined,
      domRect: DOMRect
    ) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      setHoveredCell({
        date,
        wi,
        di,
        x: cellX,
        y: cellY,
        level,
        count: entry?.count,
        label: entry?.label,
      });

      setTooltip((prev) => {
        if (!prev.visible) {
          markFirstShow(true);
          setTimeout(() => {
            markFirstShow(false);
          }, 40);
        } else {
          markFirstShow(false);
        }
        return {
          visible: true,
          date,
          count: entry?.count,
          label: entry?.label,
          x: domRect.left + domRect.width / 2,
          y: domRect.top,
        };
      });

      triggerHoverSound();
    },
    [markFirstShow, triggerHoverSound]
  );

  const handleCellLeave = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredCell(null);
      if (!selectedDate) {
        setTooltip((t) => (t.visible ? { ...t, visible: false } : t));
        markFirstShow(true);
      }
    }, 140);
  }, [markFirstShow, selectedDate]);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const { weeks, monthLabels, gridStart } = useMemo(
    () => buildGrid(resolvedStart, resolvedEnd, startsOnSunday),
    [resolvedStart, resolvedEnd, startsOnSunday],
  );

  // ── Animation Grid ────────────────────────────────────────────────────────
  const { highlightedCells, cellAnimations } = useMemo(() => {
    const isSmallScreen = deviceType === "mobile" || deviceType === "tablet" || weeks.length <= 32;
    const text = isSmallScreen ? "JD" : "JOSIAH";
    const textWidth = isSmallScreen ? 11 : 35;
    const startCol = Math.max(Math.floor((weeks.length - textWidth) / 2), 0);
    const highlighted = generateTextPattern(text, startCol);
    
    const getPseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const animations = new Map<string, { delay: string; shouldFlash: boolean }>();
    for (let wi = 0; wi < weeks.length; wi++) {
      for (let di = 0; di < 7; di++) {
        const rand1 = getPseudoRandom(wi * 10 + di + 1);
        const rand2 = getPseudoRandom(wi * 10 + di + 1000);
        animations.set(`${wi}-${di}`, {
          delay: `${(rand1 * 0.6).toFixed(1)}s`,
          shouldFlash: rand2 < 0.3,
        });
      }
    }
    return { highlightedCells: highlighted, cellAnimations: animations };
  }, [weeks.length, deviceType]);

  // ── Stats ──────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const entries = Object.entries(data);
    const total = entries.reduce(
      (sum, [, v]) => sum + (v.count ?? (v.level > 0 ? 1 : 0)),
      0,
    );
    const activeDays = entries.filter(([, v]) => v.level > 0).length;
    const maxStreak = (() => {
      let max = 0;
      let cur = 0;
      const sorted = entries
        .filter(([, v]) => v.level > 0)
        .map(([d]) => d)
        .sort();
      for (let i = 0; i < sorted.length; i++) {
        if (i === 0) {
          cur = 1;
          max = 1;
          continue;
        }
        const prev = parseDate(sorted[i - 1]!);
        const curr = parseDate(sorted[i]!);
        const diff = (curr.getTime() - prev.getTime()) / 86400000;
        if (diff === 1) {
          cur++;
          max = Math.max(max, cur);
        } else cur = 1;
      }
      return max;
    })();
    return { total, activeDays, maxStreak };
  }, [data]);

  // ── Dimensions ────────────────────────────────────────────────────────
  const step = cellSize + cellGap;
  const monthLabelHeight = showMonthLabels ? 22 : 0;
  const leftMargin = showMonthLabels ? 22 : 0;
  const svgWidth = leftMargin + weeks.length * step - cellGap + 6;
  const svgHeight = monthLabelHeight + 7 * step + 4;

  // Auto-scroll to the right end (most recent months) on compact viewports
  useEffect(() => {
    const scrollToRight = () => {
      if (scrollRef.current && typeof window !== "undefined" && window.innerWidth <= 768) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      }
    };
    
    scrollToRight();
    const timeoutId = setTimeout(scrollToRight, 150);
    return () => clearTimeout(timeoutId);
  }, [fetchedData, dataProp, deviceType]);

  // Close tooltip on scroll
  useEffect(() => {
    const handleScroll = () => {
      setTooltip((t) => (t.visible ? { ...t, visible: false } : t));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Game loop and interactive space shooter logic
  useEffect(() => {
    if (!gameActive) {
      // Restore all cells opacity and colors when game is stopped
      weeks.forEach((week) => {
        week.forEach((date) => {
          if (!date) return;
          const rect = document.getElementById(`cell-${id}-${date}`);
          if (rect) {
            rect.style.opacity = "1";
            rect.style.pointerEvents = "auto";
            const originalLevel = data[date]?.level ?? 0;
            const originalColor =
              activeColors[`level${originalLevel}` as keyof ThemeColors] ||
              activeColors.level0;
            rect.setAttribute("fill", originalColor);
          }
        });
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isUnmounted = false;
    let isVisible = true;
    let animationFrameId: number = 0;
    let gameWon = false;
    let score = 0;
    let combo = 0;
    let lastHitTime = 0;
    let screenShake = 0;
    let shotCount = 0;
    let gameplayAlpha = 1;
    let superLaserCharges = 0;
    let triBeamUntil = 0;
    let rapidFireUntil = 0;
    let shieldActive = false;
    let wave = 1;

    // Load High Score from localStorage safely
    let highScore = 0;
    try {
      if (typeof window !== "undefined") {
        highScore = parseInt(localStorage.getItem("portfolio_arcade_highscore") || "0", 10) || 0;
      }
    } catch {
      highScore = 0;
    }

    const saveHighScore = (newScore: number) => {
      if (newScore > highScore) {
        highScore = newScore;
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("portfolio_arcade_highscore", String(newScore));
          }
        } catch {
          // Ignore storage errors
        }
      }
    };

    // Device performance constraints
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const isTablet = typeof window !== "undefined" && window.innerWidth < 1024;
    const MAX_PARTICLES = isMobile ? 32 : isTablet ? 48 : 72;
    const MAX_SHOCKWAVES = 4;
    const MAX_FLOAT_TEXTS = 6;
    const STAR_COUNT = isMobile ? 30 : isTablet ? 55 : 85;

    // Victory celebration state
    const victoryState = {
      active: false,
      startTime: 0,
      alpha: 0,
      targetAlpha: 1,
      scale: 0.85,
    };

    // Smooth Animated Combo State
    const comboDisplay = {
      alpha: 0,
      targetAlpha: 0,
      scale: 1,
      text: "",
      color: "#38bdf8",
    };

    // Canvas dimensions matching SVG viewBox with mobile-friendly retina scaling
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2) : 1.5;
    const canvasWidth = svgWidth;
    const canvasHeight = svgHeight + 36;
    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);

    // Initial scale and translation for high-DPI rendering
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = isMobile ? "medium" : "high";

    const logicalWidth = svgWidth;
    const logicalHeight = svgHeight + 36;

    // Local mutable map for dynamic cell levels
    const cellLevels = new Map<string, number>();
    const resetCells = () => {
      weeks.forEach((week) => {
        week.forEach((date) => {
          if (!date) return;
          const entry = data[date];
          const initialLevel = entry?.level ?? 0;
          cellLevels.set(date, initialLevel);
          const rect = document.getElementById(`cell-${id}-${date}`);
          if (rect) {
            if (initialLevel === 0) {
              rect.style.opacity = "0";
              rect.style.pointerEvents = "none";
            } else {
              rect.style.opacity = "1";
              rect.style.pointerEvents = "auto";
              const originalColor =
                activeColors[`level${initialLevel}` as keyof ThemeColors] ||
                activeColors.level0;
              rect.setAttribute("fill", originalColor);
            }
          }
        });
      });
    };
    resetCells();

    // Player (Spacecraft)
    const player = {
      x: logicalWidth / 2 - 16,
      targetX: logicalWidth / 2 - 16,
      y: logicalHeight - 22,
      width: 32,
      height: 20,
      speed: 3.0,
      direction: 1, // 1 = right, -1 = left
      color: "#38bdf8",
      userControlled: false,
      lastUserInteraction: 0,
    };

    // Golden Mystery UFO Boss
    const ufo = {
      active: false,
      x: -40,
      y: monthLabelHeight > 0 ? monthLabelHeight - 12 : 6,
      vx: 2.2,
      width: 30,
      height: 11,
      health: 2,
      nextSpawn: Date.now() + 12000,
    };

    // Power-Up Drops
    type PowerUp = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      type: "tri" | "shield" | "nuke" | "rapid";
      label: string;
      icon: string;
      color: string;
      glowColor: string;
      radius: number;
      createdAt: number;
    };
    let powerUps: PowerUp[] = [];

    // Mouse & Touch Controls
    const setTargetFromClientX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasWidth / rect.width;
      const canvasX = (clientX - rect.left) * scaleX;
      player.targetX = canvasX - player.width / 2;
      player.userControlled = true;
      player.lastUserInteraction = Date.now();
    };

    const handlePointerMove = (e: MouseEvent) => {
      setTargetFromClientX(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        setTargetFromClientX(e.touches[0].clientX);
      }
    };

    const handlePointerLeave = () => {
      player.userControlled = false;
    };

    // Handle Victory Modal Buttons (Play Again / Exit)
    const handleCanvasClick = (e: MouseEvent | Touch) => {
      if (!victoryState.active || victoryState.alpha < 0.5) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasWidth / rect.width;
      const scaleY = canvasHeight / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      const centerX = logicalWidth / 2;
      const centerY = logicalHeight / 2 - 10;

      // Play Again Button bounds (Centered Left)
      const playAgainBounds = {
        left: centerX - 110,
        right: centerX - 8,
        top: centerY + 18,
        bottom: centerY + 40,
      };

      // Exit Button bounds (Centered Right)
      const exitBounds = {
        left: centerX + 8,
        right: centerX + 110,
        top: centerY + 18,
        bottom: centerY + 40,
      };

      if (
        clickX >= playAgainBounds.left &&
        clickX <= playAgainBounds.right &&
        clickY >= playAgainBounds.top &&
        clickY <= playAgainBounds.bottom
      ) {
        // Restart game with fresh wave
        playSound("powerup");
        wave++;
        gameWon = false;
        victoryState.active = false;
        victoryState.alpha = 0;
        victoryState.targetAlpha = 0;
        gameplayAlpha = 1;
        superLaserCharges += 2;
        resetCells();
      } else if (
        clickX >= exitBounds.left &&
        clickX <= exitBounds.right &&
        clickY >= exitBounds.top &&
        clickY <= exitBounds.bottom
      ) {
        // Exit game mode cleanly
        setGameActive(false);
      }
    };

    const handleMouseClick = (e: MouseEvent) => handleCanvasClick(e);
    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches[0]) handleCanvasClick(e.changedTouches[0]);
    };

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("mouseleave", handlePointerLeave);
    canvas.addEventListener("click", handleMouseClick);
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Bullets with trails & plasma glow
    type GameBullet = {
      x: number;
      y: number;
      vy: number;
      vx: number;
      width: number;
      height: number;
      color: string;
      glowColor: string;
      isSpecial?: boolean;
    };
    let bullets: GameBullet[] = [];
    let lastShot = 0;

    const shoot = () => {
      shotCount++;
      const now = Date.now();
      const hasTriBeam = now < triBeamUntil || superLaserCharges > 0;

      if (hasTriBeam) {
        if (superLaserCharges > 0 && now >= triBeamUntil) {
          superLaserCharges--;
        }
        // Hyper Plasma Tri-Beam
        bullets.push({
          x: player.x + 2,
          y: player.y - 2,
          vx: -0.65,
          vy: -4.3,
          width: 3.5,
          height: 11,
          color: "#facc15",
          glowColor: "#eab308",
          isSpecial: true,
        });
        bullets.push({
          x: player.x + player.width / 2 - 1.75,
          y: player.y - 5,
          vx: 0,
          vy: -4.6,
          width: 4,
          height: 12,
          color: "#e879f9",
          glowColor: "#c084fc",
          isSpecial: true,
        });
        bullets.push({
          x: player.x + player.width - 5.5,
          y: player.y - 2,
          vx: 0.65,
          vy: -4.3,
          width: 3.5,
          height: 11,
          color: "#facc15",
          glowColor: "#eab308",
          isSpecial: true,
        });
      } else if (shotCount % 5 === 0) {
        // Dual Wing Laser Cannons
        bullets.push({
          x: player.x + 4,
          y: player.y - 2,
          vx: -0.2,
          vy: -4.1,
          width: 3.5,
          height: 10,
          color: "#38bdf8",
          glowColor: "#0284c7",
          isSpecial: true,
        });
        bullets.push({
          x: player.x + player.width - 7.5,
          y: player.y - 2,
          vx: 0.2,
          vy: -4.1,
          width: 3.5,
          height: 10,
          color: "#38bdf8",
          glowColor: "#0284c7",
          isSpecial: true,
        });
      } else {
        // Center Plasma Laser
        bullets.push({
          x: player.x + player.width / 2 - 1.5,
          y: player.y - 4,
          vx: 0,
          vy: -4.1,
          width: 3,
          height: 9,
          color: "#fbbf24",
          glowColor: "#f59e0b",
        });
      }
      playSound("laser");
    };

    // Stars background (Deep Space parallax effect)
    const stars = Array.from({ length: STAR_COUNT }).map(() => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      speed: Math.random() * 0.35 + 0.1,
      size: Math.random() * 1.2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    // Particles (for explosions, engine thrusters & debris)
    type GameParticle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
    };
    let particles: GameParticle[] = [];

    // Shockwave rings
    type Shockwave = {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      color: string;
      alpha: number;
    };
    let shockwaves: Shockwave[] = [];

    // Floating text popups (+100, COMBO x2)
    type FloatText = {
      x: number;
      y: number;
      text: string;
      color: string;
      alpha: number;
      vy: number;
    };
    let floatTexts: FloatText[] = [];

    const addParticle = (p: GameParticle) => {
      particles.push(p);
      if (particles.length > MAX_PARTICLES) {
        particles.shift();
      }
    };

    const addShockwave = (s: Shockwave) => {
      shockwaves.push(s);
      if (shockwaves.length > MAX_SHOCKWAVES) {
        shockwaves.shift();
      }
    };

    const addFloatText = (t: FloatText) => {
      floatTexts.push(t);
      if (floatTexts.length > MAX_FLOAT_TEXTS) {
        floatTexts.shift();
      }
    };

    const explode = (x: number, y: number, color: string, isFullDestroy: boolean) => {
      if (isFullDestroy) {
        playSound("explosion");
        screenShake = 3;
        addShockwave({
          x,
          y,
          radius: 2,
          maxRadius: 22,
          color,
          alpha: 0.9,
        });
      } else {
        playSound("hit", combo);
      }

      // Shard Debris Particles
      const count = isFullDestroy ? (isMobile ? 7 : 12) : isMobile ? 3 : 5;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = isFullDestroy ? Math.random() * 2.5 + 1.0 : Math.random() * 1.4 + 0.6;
        addParticle({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: Math.random() * 2.2 + 1.0,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 16 + 16,
        });
      }
    };

    // Quantum EMP Nuke detonation
    const triggerEMPNuke = (originX: number) => {
      playSound("nuke");
      screenShake = 6;
      addShockwave({
        x: originX,
        y: logicalHeight / 2,
        radius: 4,
        maxRadius: 120,
        color: "#60a5fa",
        alpha: 1,
      });

      // Detonate cells in radius
      weeks.forEach((week, wi) => {
        week.forEach((date, di) => {
          if (!date) return;
          const currentLevel = cellLevels.get(date) ?? 0;
          if (currentLevel === 0) return;

          const cellX = leftMargin + wi * step;
          if (Math.abs(cellX - originX) < step * 4.5) {
            cellLevels.set(date, 0);
            const rect = document.getElementById(`cell-${id}-${date}`);
            if (rect) {
              rect.style.opacity = "0";
              rect.style.pointerEvents = "none";
            }
            score += 150;
            explode(cellX + cellSize / 2, monthLabelHeight + di * step + cellSize / 2, "#60a5fa", true);
          }
        });
      });

      addFloatText({
        x: originX,
        y: logicalHeight / 2 - 20,
        text: "💥 QUANTUM EMP BLAST! 💥",
        color: "#60a5fa",
        alpha: 1,
        vy: -0.5,
      });
      saveHighScore(score);
    };

    const update = () => {
      const now = Date.now();

      // Smoothly fade out combo if inactive for > 1.6s
      if (now - lastHitTime > 1600) {
        combo = 0;
        comboDisplay.targetAlpha = 0;
      }

      // Smooth spring interpolation for combo display
      comboDisplay.alpha += (comboDisplay.targetAlpha - comboDisplay.alpha) * 0.12;
      comboDisplay.scale += (1 - comboDisplay.scale) * 0.14;

      // Find active column boundaries
      let minWi = -1;
      let maxWi = -1;
      let remainingTargets = 0;
      weeks.forEach((week, wi) => {
        week.forEach((date) => {
          if (!date) return;
          if ((cellLevels.get(date) ?? 0) > 0) {
            remainingTargets++;
            if (minWi === -1) minWi = wi;
            minWi = Math.min(minWi, wi);
            maxWi = Math.max(maxWi, wi);
          }
        });
      });

      // Stable, full-width grid boundaries for smooth left-to-right ship patrol
      const gridLeft = leftMargin;
      const gridRight = leftMargin + weeks.length * step - cellGap;
      const minX = Math.max(0, gridLeft - 6);
      const maxX = Math.min(logicalWidth - player.width, gridRight - player.width + 6);

      // ── Ship Movement (Interactive + Auto-patrol fallback) ─────────────────
      const isUserActive = player.userControlled && now - player.lastUserInteraction < 2200;

      if (isUserActive) {
        const clampedTarget = Math.max(minX, Math.min(maxX, player.targetX));
        player.x += (clampedTarget - player.x) * 0.18;
      } else {
        player.x += player.speed * player.direction;
        if (player.x >= maxX) {
          player.x = maxX;
          player.direction = -1;
        } else if (player.x <= minX) {
          player.x = minX;
          player.direction = 1;
        }
      }

      player.x = Math.max(minX, Math.min(maxX, player.x));

      // ── Thruster Exhaust Plasma Particles ──────────────────────────────────
      if (!victoryState.active && Math.random() < (isMobile ? 0.4 : 0.6)) {
        addParticle({
          x: player.x + player.width / 2 + (Math.random() * 6 - 3),
          y: player.y + player.height * 0.8,
          vx: (Math.random() - 0.5) * 0.8,
          vy: Math.random() * 1.6 + 1.1,
          color:
            now < triBeamUntil
              ? "#e879f9"
              : now < rapidFireUntil
              ? "#f97316"
              : combo >= 10
              ? "#e879f9"
              : combo >= 5
              ? "#facc15"
              : Math.random() > 0.4
              ? "#38bdf8"
              : "#f59e0b",
          size: Math.random() * 2 + 1,
          alpha: 0.8,
          life: 0,
          maxLife: 14,
        });
      }

      // ── Shooting Logic (Adapts with Rapid Fire Overclock) ─────────────────
      const cooldown = now < rapidFireUntil ? 170 : 360;
      if (!victoryState.active && now - lastShot >= cooldown) {
        shoot();
        lastShot = now;
      }

      // ── Golden UFO Drone Spawning & Movement ──────────────────────────────
      if (!ufo.active && now >= ufo.nextSpawn && !victoryState.active) {
        ufo.active = true;
        ufo.health = 2;
        const fromLeft = Math.random() > 0.5;
        ufo.x = fromLeft ? -40 : logicalWidth + 40;
        ufo.vx = fromLeft ? 2.0 : -2.0;
        ufo.nextSpawn = now + Math.random() * 10000 + 16000;
      }

      if (ufo.active) {
        ufo.x += ufo.vx;
        // Thruster sparks behind UFO
        if (Math.random() < 0.5) {
          addParticle({
            x: ufo.x + (ufo.vx > 0 ? 0 : ufo.width),
            y: ufo.y + ufo.height / 2,
            vx: -ufo.vx * 0.4 + (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            color: "#facc15",
            size: Math.random() * 2 + 1,
            alpha: 0.9,
            life: 0,
            maxLife: 12,
          });
        }
        if (ufo.x < -60 || ufo.x > logicalWidth + 60) {
          ufo.active = false;
        }
      }

      // ── Update Power-Up Capsules & Player Collision ────────────────────────
      powerUps = powerUps.filter((p) => {
        p.y += p.vy;
        p.x += Math.sin((now - p.createdAt) * 0.005) * 0.4;

        // Check collection collision with player
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        const dist = Math.hypot(p.x - playerCenterX, p.y - playerCenterY);

        if (dist < player.width / 2 + p.radius + 6) {
          // Collected!
          playSound("powerup");
          addShockwave({
            x: p.x,
            y: p.y,
            radius: 2,
            maxRadius: 28,
            color: p.color,
            alpha: 0.9,
          });

          if (p.type === "tri") {
            triBeamUntil = now + 10000;
            addFloatText({ x: p.x, y: p.y - 10, text: "⚡ TRI-BEAM PLASMA! ⚡", color: p.color, alpha: 1, vy: -0.5 });
          } else if (p.type === "rapid") {
            rapidFireUntil = now + 7000;
            addFloatText({ x: p.x, y: p.y - 10, text: "🔥 OVERCLOCK RAPID! 🔥", color: p.color, alpha: 1, vy: -0.5 });
          } else if (p.type === "shield") {
            shieldActive = true;
            addFloatText({ x: p.x, y: p.y - 10, text: "🛡️ SHIELD BARRIER! 🛡️", color: p.color, alpha: 1, vy: -0.5 });
          } else if (p.type === "nuke") {
            triggerEMPNuke(p.x);
          }

          score += 250;
          saveHighScore(score);
          return false;
        }

        return p.y < logicalHeight + 20;
      });

      // ── Smooth Victory Animation & Gameplay Fade-out ───────────────────────
      const targetGameplayAlpha = victoryState.active ? 0.3 : 1;
      gameplayAlpha += (targetGameplayAlpha - gameplayAlpha) * 0.12;

      if (victoryState.active) {
        victoryState.alpha += (victoryState.targetAlpha - victoryState.alpha) * 0.08;
        victoryState.scale += (1 - victoryState.scale) * 0.08;
      }

      // ── Victory Check ──────────────────────────────────────────────────────
      if (remainingTargets === 0 && !gameWon) {
        gameWon = true;
        victoryState.active = true;
        victoryState.startTime = now;
        victoryState.targetAlpha = 1;
        saveHighScore(score);
        playSound("victory");
        screenShake = 4.0;

        // Big Celebratory Confetti Burst
        const confettiCount = isMobile ? 24 : 40;
        for (let i = 0; i < confettiCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4.0 + 1.2;
          addParticle({
            x: logicalWidth / 2,
            y: logicalHeight / 2 - 10,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: ["#38bdf8", "#facc15", "#e879f9", "#34d399", "#60a5fa"][Math.floor(Math.random() * 5)]!,
            size: Math.random() * 3 + 1.5,
            alpha: 1,
            life: 0,
            maxLife: 50,
          });
        }

        // Concentric Victory Shockwaves
        addShockwave({
          x: logicalWidth / 2,
          y: logicalHeight / 2 - 10,
          radius: 4,
          maxRadius: 65,
          color: "#38bdf8",
          alpha: 1,
        });
      }

      // ── Update Stars ───────────────────────────────────────────────────────
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (s) {
          s.y += s.speed;
          if (s.y > canvasHeight - 4) {
            s.y = -4;
            s.x = Math.random() * canvasWidth;
          }
        }
      }

      // ── Update Bullets ─────────────────────────────────────────────────────
      bullets = bullets.filter((b) => {
        b.x += b.vx;
        b.y += b.vy;

        // Check UFO Collision
        if (ufo.active && !victoryState.active) {
          if (
            b.x < ufo.x + ufo.width &&
            b.x + b.width > ufo.x &&
            b.y < ufo.y + ufo.height &&
            b.y + b.height > ufo.y
          ) {
            ufo.health--;
            if (ufo.health <= 0) {
              ufo.active = false;
              playSound("ufo");
              screenShake = 4.5;
              score += 500;
              saveHighScore(score);
              addShockwave({
                x: ufo.x + ufo.width / 2,
                y: ufo.y + ufo.height / 2,
                radius: 2,
                maxRadius: 36,
                color: "#facc15",
                alpha: 1,
              });
              for (let k = 0; k < (isMobile ? 12 : 20); k++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3.5 + 1.0;
                addParticle({
                  x: ufo.x + ufo.width / 2,
                  y: ufo.y + ufo.height / 2,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  color: ["#facc15", "#e879f9", "#38bdf8", "#34d399"][k % 4]!,
                  size: Math.random() * 2.5 + 1.2,
                  alpha: 1,
                  life: 0,
                  maxLife: 28,
                });
              }
              addFloatText({
                x: ufo.x + ufo.width / 2,
                y: ufo.y - 12,
                text: "🛸 +500 UFO BONUS! 🛸",
                color: "#facc15",
                alpha: 1,
                vy: -0.5,
              });
            } else {
              playSound("hit", 4);
              explode(ufo.x + ufo.width / 2, ufo.y + ufo.height / 2, "#facc15", false);
            }
            return false;
          }
        }

        return b.y > 0;
      });

      // ── Update Particles ───────────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p) {
          p.x += p.vx;
          p.y += p.vy;
          p.life++;
          p.alpha = 1 - p.life / p.maxLife;
        }
      }
      particles = particles.filter((p) => p.life < p.maxLife);

      // ── Update Shockwaves ──────────────────────────────────────────────────
      for (let i = 0; i < shockwaves.length; i++) {
        const s = shockwaves[i];
        if (s) {
          s.radius += 1.2;
          s.alpha = Math.max(0, 1 - s.radius / s.maxRadius);
        }
      }
      shockwaves = shockwaves.filter((s) => s.radius < s.maxRadius);

      // ── Update Floating Text ───────────────────────────────────────────────
      for (let i = 0; i < floatTexts.length; i++) {
        const t = floatTexts[i];
        if (t) {
          t.y += t.vy;
          t.alpha -= 0.02;
        }
      }
      floatTexts = floatTexts.filter((t) => t.alpha > 0);

      // Decay screen shake
      if (screenShake > 0) screenShake -= 0.4;

      // ── Bullet Collision with Cells ────────────────────────────────────────
      bullets.forEach((bullet, bulletIdx) => {
        weeks.forEach((week, wi) => {
          week.forEach((date, di) => {
            if (!date) return;

            const currentLevel = cellLevels.get(date) ?? 0;
            if (currentLevel === 0) return;

            const cellX = leftMargin + wi * step;
            const cellY = monthLabelHeight + di * step;

            if (
              bullet.x < cellX + cellSize &&
              bullet.x + bullet.width > cellX &&
              bullet.y < cellY + cellSize &&
              bullet.y + bullet.height > cellY
            ) {
              // Collision detected!
              bullets.splice(bulletIdx, 1);

              const newLevel = currentLevel - 1;
              cellLevels.set(date, newLevel);

              // Combo & Score calculation
              lastHitTime = now;
              combo++;
              comboDisplay.targetAlpha = 1;
              comboDisplay.scale = 1.35;

              if (combo >= 10) {
                comboDisplay.text = `🔥 HYPER COMBO x${combo}! 🔥`;
                comboDisplay.color = "#e879f9";
              } else if (combo >= 5) {
                comboDisplay.text = `⚡ SUPER COMBO x${combo}! ⚡`;
                comboDisplay.color = "#facc15";
              } else {
                comboDisplay.text = `COMBO x${combo}!`;
                comboDisplay.color = "#38bdf8";
              }

              // ── Milestone 5x Combo Trigger ─────────────────────────────────
              if (combo === 5) {
                playSound("superCombo", 5);
                screenShake = 4.0;
                superLaserCharges += 4;
                addShockwave({
                  x: logicalWidth / 2,
                  y: logicalHeight / 2 - 20,
                  radius: 4,
                  maxRadius: 46,
                  color: "#facc15",
                  alpha: 1,
                });
                addFloatText({
                  x: logicalWidth / 2,
                  y: logicalHeight / 2 - 15,
                  text: "⚡ 5X COMBO STREAK! ⚡",
                  color: "#facc15",
                  alpha: 1,
                  vy: -0.45,
                });
              }

              // ── Milestone 10x Combo Trigger ────────────────────────────────
              if (combo === 10) {
                playSound("superCombo", 10);
                screenShake = 5.5;
                superLaserCharges += 6;
                addShockwave({
                  x: logicalWidth / 2,
                  y: logicalHeight / 2 - 20,
                  radius: 4,
                  maxRadius: 56,
                  color: "#e879f9",
                  alpha: 1,
                });
                addFloatText({
                  x: logicalWidth / 2,
                  y: logicalHeight / 2 - 15,
                  text: "🔥 10X HYPER STREAK! 🔥",
                  color: "#e879f9",
                  alpha: 1,
                  vy: -0.45,
                });
              }

              const points = newLevel === 0 ? 150 * Math.min(combo, 10) : 50 * Math.min(combo, 10);
              score += points;
              saveHighScore(score);

              // ── Chance to Spawn Power-Up Capsule from Level 3/4 cells ──────
              if (newLevel === 0 && currentLevel >= 3 && Math.random() < 0.45) {
                const types: ("tri" | "shield" | "nuke" | "rapid")[] = ["tri", "rapid", "shield", "nuke"];
                const pType = types[Math.floor(Math.random() * types.length)] || "tri";
                const pColors = {
                  tri: { color: "#facc15", glow: "#eab308", icon: "⚡", label: "TRI-BEAM" },
                  rapid: { color: "#f97316", glow: "#ea580c", icon: "🔥", label: "RAPID" },
                  shield: { color: "#38bdf8", glow: "#0284c7", icon: "🛡️", label: "SHIELD" },
                  nuke: { color: "#60a5fa", glow: "#3b82f6", icon: "💣", label: "EMP" },
                }[pType];

                powerUps.push({
                  x: cellX + cellSize / 2,
                  y: cellY + cellSize / 2,
                  vx: (Math.random() - 0.5) * 0.4,
                  vy: 0.9,
                  type: pType,
                  label: pColors.label,
                  icon: pColors.icon,
                  color: pColors.color,
                  glowColor: pColors.glow,
                  radius: 7,
                  createdAt: now,
                });
              }

              // Spawn floating score popup
              addFloatText({
                x: cellX + cellSize / 2,
                y: cellY - 4,
                text: newLevel === 0 ? `+${points}${combo > 1 ? ` (x${combo})` : ""}` : `+${points}`,
                color: combo >= 10 ? "#e879f9" : combo >= 5 ? "#facc15" : newLevel === 0 ? "#60a5fa" : "#fbbf24",
                alpha: 1,
                vy: -0.6,
              });

              // Instantly update cell in SVG DOM
              const rect = document.getElementById(`cell-${id}-${date}`);
              if (rect) {
                if (newLevel === 0) {
                  rect.style.opacity = "0";
                  rect.style.pointerEvents = "none";
                } else {
                  const newColor =
                    activeColors[`level${newLevel}` as keyof ThemeColors] ||
                    activeColors.level0;
                  rect.setAttribute("fill", newColor);
                }
              }

              const hitColor =
                activeColors[`level${currentLevel}` as keyof ThemeColors] ||
                activeColors.level0;
              explode(cellX + cellSize / 2, cellY + cellSize / 2, hitColor, newLevel === 0);
            }
          });
        });
      });
    };

    const render = () => {
      const now = Date.now();

      // Clean Transform with DPR scaling and screen shake
      const shakeX = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
      const shakeY = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
      ctx.setTransform(dpr, 0, 0, dpr, shakeX * dpr, shakeY * dpr);

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // 1. Starry Space Background
      ctx.fillStyle = isDark ? "#ffffff" : "#94a3b8";
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (s) {
          ctx.globalAlpha = s.alpha;
          ctx.fillRect(s.x, s.y, s.size, s.size);
        }
      }
      ctx.globalAlpha = 1.0;

      // 2. Shockwave Rings
      for (let i = 0; i < shockwaves.length; i++) {
        const s = shockwaves[i];
        if (s) {
          ctx.save();
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = s.alpha;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3. Falling Power-Up Capsules
      powerUps.forEach((p) => {
        ctx.save();
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = '700 8px var(--font-geist-mono), "Geist Mono", monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.icon, p.x, p.y);
        ctx.restore();
      });

      // 4. Mystery Golden UFO Drone
      if (ufo.active) {
        ctx.save();
        ctx.fillStyle = "#facc15";
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(ufo.x + ufo.width / 2, ufo.y + ufo.height / 2, ufo.width / 2, ufo.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dome cockpit
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ufo.x + ufo.width / 2, ufo.y + 3, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Bullets
      bullets.forEach((b) => {
        ctx.save();
        ctx.shadowColor = b.glowColor;
        ctx.shadowBlur = 6;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.restore();
      });

      // 6. Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }
      ctx.globalAlpha = 1.0;

      // 7. Floating Text Popups (Crisp Geist Mono font)
      floatTexts.forEach((t) => {
        ctx.save();
        ctx.font = '700 10.5px var(--font-geist-mono), "Geist Mono", monospace';
        ctx.fillStyle = t.color;
        ctx.globalAlpha = t.alpha;
        ctx.textAlign = "center";
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();
      });

      // 8. In-Game HUD (SCORE, HIGH SCORE, COMBO, ACTIVE BUFFS)
      if (gameplayAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = gameplayAlpha;
        ctx.font = '600 11px var(--font-geist-mono), "Geist Mono", monospace';
        ctx.fillStyle = isDark ? "#a1a1aa" : "#71717a";
        ctx.textAlign = "left";
        ctx.fillText("SCORE: ", 4, 12);
        const scoreLabelWidth = ctx.measureText("SCORE: ").width;

        ctx.font = '700 11px var(--font-geist-mono), "Geist Mono", monospace';
        ctx.fillStyle = isDark ? "#f4f4f5" : "#18181b";
        ctx.fillText(score.toLocaleString(), 4 + scoreLabelWidth, 12);

        // High Score display on top right
        ctx.font = '600 10px var(--font-geist-mono), "Geist Mono", monospace';
        ctx.fillStyle = isDark ? "#71717a" : "#a1a1aa";
        ctx.textAlign = "right";
        ctx.fillText(`HI: ${highScore.toLocaleString()}`, logicalWidth - 6, 12);

        // Active Buff Indicators
        const buffs: string[] = [];
        if (now < triBeamUntil) buffs.push("⚡ TRI-BEAM");
        if (now < rapidFireUntil) buffs.push("🔥 OVERCLOCK");
        if (shieldActive) buffs.push("🛡️ SHIELD");

        if (buffs.length > 0) {
          ctx.font = '700 9px var(--font-geist-mono), "Geist Mono", monospace';
          ctx.fillStyle = "#38bdf8";
          ctx.textAlign = "left";
          ctx.fillText(buffs.join("  "), 4, 24);
        }

        // Smooth Animated Combo Banner
        if (comboDisplay.alpha > 0.005) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, comboDisplay.alpha * gameplayAlpha);
          const pulse = combo >= 10 ? Math.sin(now * 0.012) * 0.08 : combo >= 5 ? Math.sin(now * 0.008) * 0.05 : 0;
          ctx.translate(logicalWidth / 2, 12);
          ctx.scale(comboDisplay.scale + pulse, comboDisplay.scale + pulse);

          ctx.font = '700 11px var(--font-geist-mono), "Geist Mono", monospace';
          ctx.fillStyle = comboDisplay.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(comboDisplay.text, 0, 0);
          ctx.restore();
        }
        ctx.restore();
      }

      // 9. Player Spaceship & Shield
      if (gameplayAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = gameplayAlpha;

        // Protective Orbital Shield Ring
        if (shieldActive) {
          ctx.save();
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 1.8;
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2 + 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        ctx.fillStyle =
          now < triBeamUntil
            ? "#e879f9"
            : now < rapidFireUntil
            ? "#f97316"
            : combo >= 10
            ? "#e879f9"
            : combo >= 5
            ? "#facc15"
            : player.color;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = combo >= 5 ? 12 : 8;
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2, player.y);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.lineTo(player.x + player.width * 0.7, player.y + player.height * 0.75);
        ctx.lineTo(player.x + player.width * 0.3, player.y + player.height * 0.75);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.closePath();
        ctx.fill();

        // Cockpit Glow
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(player.x + player.width / 2, player.y + player.height * 0.45, 2.5, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 10. Interactive Winner Overlay Banner (With Clickable Play Again & Exit Buttons)
      if (victoryState.active && victoryState.alpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, Math.max(0, victoryState.alpha));
        ctx.translate(logicalWidth / 2, logicalHeight / 2 - 10);
        ctx.scale(victoryState.scale, victoryState.scale);

        // High contrast backdrop card
        const bannerW = Math.min(logicalWidth - 28, 290);
        const bannerH = 74;

        ctx.fillStyle = isDark ? "rgba(9, 9, 11, 0.94)" : "rgba(255, 255, 255, 0.95)";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH, 10);
        } else {
          ctx.rect(-bannerW / 2, -bannerH / 2, bannerW, bannerH);
        }
        ctx.fill();
        ctx.stroke();

        // Primary Header Text
        ctx.font = '700 12px var(--font-geist-mono), "Geist Mono", monospace';
        ctx.fillStyle = "#38bdf8";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("★ ALL TARGETS CLEARED! ★", 0, -20);

        // Subtitle & Score Text
        ctx.font = '600 10px var(--font-geist-mono), "Geist Mono", monospace';
        ctx.fillStyle = isDark ? "#e4e4e7" : "#3f3f46";
        ctx.fillText(`VICTORY • SCORE: ${score.toLocaleString()} • BEST: ${highScore.toLocaleString()}`, 0, -4);

        // ── Interactive Buttons Inside Canvas ─────────────────────────────────
        // 1. Play Again / Next Wave Button
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(-110, 10, 102, 20, 4);
        } else {
          ctx.rect(-110, 10, 102, 20);
        }
        ctx.fill();

        ctx.font = '700 9.5px var(--font-geist-mono), "Geist Mono", monospace';
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`⟳ WAVE ${wave + 1}`, -59, 20);

        // 2. Exit Button
        ctx.fillStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(8, 10, 102, 20, 4);
        } else {
          ctx.rect(8, 10, 102, 20);
        }
        ctx.fill();
        ctx.stroke();

        ctx.font = '600 9.5px var(--font-geist-mono), "Geist Mono", monospace';
        ctx.fillStyle = isDark ? "#d4d4d8" : "#52525b";
        ctx.fillText("✕ EXIT GAME", 59, 20);

        ctx.restore();
      }

      ctx.restore();
    };

    const loop = () => {
      if (isUnmounted) return;
      if (isVisible) {
        update();
        render();
      }
      if (gameActive) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    // IntersectionObserver: sleep game loop completely when scrolled out of view!
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = !!entry?.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      isUnmounted = true;
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("mouseleave", handlePointerLeave);
      canvas.removeEventListener("click", handleMouseClick);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    gameActive,
    data,
    weeks,
    step,
    cellSize,
    cellGap,
    monthLabelHeight,
    activeColors,
    id,
    svgWidth,
    svgHeight,
    leftMargin,
    isDark,
  ]);

  if (fetchError) {
    return (
      <div
        className={cn(
          "w-fit mx-auto flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
          className,
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {fetchError}
      </div>
    );
  }

  const cellRx = cellShape === "circle" ? cellSize / 2 : cellSize * 0.2;

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-fit mx-auto overflow-visible transition-all duration-500",
        className,
      )}
    >
      <div className="relative w-full mx-auto max-w-full min-w-0 block overflow-visible">
        
        {/* Game and Calendar Container with Smooth Spring Layout Morphing */}
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
          className={cn(
            "p-0 transition-colors duration-500 ease-out w-full overflow-visible",
            gameActive ? (isDark ? "bg-black/70 rounded-xl ring-1 ring-neutral-800" : "bg-neutral-900/[0.04] rounded-xl ring-1 ring-neutral-200") : ""
          )}
        >
        <div
          ref={scrollRef}
          className="relative w-full max-w-full min-w-0 overflow-x-auto overflow-y-visible py-1 transition-all duration-500 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="grid w-full"
          >
            <svg
              width="100%"
              viewBox={`0 0 ${svgWidth} ${svgHeight + (gameActive ? 36 : 0)}`}
              className="col-start-1 row-start-1 overflow-visible block w-full h-auto"
            >
            {/* month labels */}
            {showMonthLabels &&
              (() => {
                const byWeek = new Map<number, string>();
                monthLabels.forEach(({ label, weekIndex }) =>
                  byWeek.set(weekIndex, label),
                );
                const entries = Array.from(byWeek.entries());
                const validEntries: { weekIndex: number; label: string; exactWeek: number }[] = [];
                for (let i = 0; i < entries.length; i++) {
                  const current = entries[i]!;
                  const next = entries[i + 1];
                  // If the first month is too close to the second, skip the first one
                  if (i === 0 && next && next[0] - current[0] < 3) {
                    continue;
                  }
                  // If this month is too close to the last added one, skip it
                  const lastValid = validEntries[validEntries.length - 1];
                  if (lastValid && current[0] - lastValid.weekIndex < 3) {
                    continue;
                  }
                  validEntries.push({
                    weekIndex: current[0],
                    label: current[1],
                    exactWeek: monthLabels.find((m) => m.weekIndex === current[0] && m.label === current[1])?.exactWeek ?? current[0],
                  });
                }
                return validEntries.map(({ weekIndex, label, exactWeek }, i) => {
                  const xPos = leftMargin + exactWeek * step;
                  const isLast = i === validEntries.length - 1;
                  const x = isLast && xPos > svgWidth - 28 ? svgWidth - 28 : xPos;

                  return (
                    <text
                      key={`${label}-${weekIndex}`}
                      x={x}
                      y={15}
                      fontSize={deviceType !== "desktop" ? 13 : 12}
                      fill={isDark ? "#a1a1aa" : "#71717a"}
                      fontFamily="inherit"
                      className="transition-opacity duration-1000 ease-in-out font-mono font-medium select-none"
                      style={{ opacity: gameActive ? 0 : 1 }}
                    >
                      {label}
                    </text>
                  );
                });
              })()}

            {/* weekday labels */}
            {showMonthLabels &&
              (() => {
                const labels = startsOnSunday
                  ? [{ di: 1, label: "M" }, { di: 3, label: "W" }, { di: 5, label: "F" }]
                  : [{ di: 0, label: "M" }, { di: 2, label: "W" }, { di: 4, label: "F" }];

                return labels.map(({ di, label }) => (
                  <text
                    key={`day-${di}`}
                    x={2}
                    y={monthLabelHeight + di * step + cellSize / 2 + 4.5}
                    fontSize={deviceType !== "desktop" ? 12.5 : 11.5}
                    fill={isDark ? "#a1a1aa" : "#71717a"}
                    fontFamily="inherit"
                    className="transition-opacity duration-1000 ease-in-out font-mono font-medium select-none"
                    style={{ opacity: gameActive ? 0 : 1 }}
                  >
                    {label}
                  </text>
                ));
              })()}

            {/* Real Data Cells */}
            {weeks.map((week, wi) =>
              week.map((date, di) => {
                const entry = date ? data[date] : undefined;
                const level: ContributionLevel = entry?.level ?? 0;
                const cellTopY = monthLabelHeight + di * step;
                const isHovered = hoveredCell?.date === date;
                const isSelected = selectedDate === date;

                return (
                  <rect
                    key={`real-${wi}-${di}`}
                    id={date ? `cell-${id}-${date}` : undefined}
                    x={leftMargin + wi * step}
                    y={cellTopY}
                    width={cellSize}
                    height={cellSize}
                    rx={cellRx}
                    fill={activeColors[`level${level}` as keyof ThemeColors]}
                    className={cn(
                      !gameActive && date && "cursor-pointer origin-center transition-all duration-200",
                      !gameActive && date && (isHovered || isSelected ? "opacity-100" : "hover:opacity-90")
                    )}
                    style={{
                      transition: gameActive 
                        ? "opacity 0.1s, fill 0.1s"
                        : "opacity 0.4s ease, fill 0.4s ease",
                      opacity: gameActive ? (level === 0 || !date ? 0 : 1) : 1,
                      pointerEvents: gameActive ? (level === 0 || !date ? "none" : "auto") : "auto",
                      transformBox: "fill-box",
                    }}
                    onMouseEnter={(e) => {
                      if (!date || gameActive) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      handleCellEnter(
                        date,
                        wi,
                        di,
                        leftMargin + wi * step,
                        cellTopY,
                        level,
                        entry,
                        rect
                      );
                    }}
                    onMouseLeave={handleCellLeave}
                    onClick={(e) => {
                      if (!date || gameActive) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const isNowSelected = selectedDate !== date;
                      setSelectedDate(isNowSelected ? date : null);
                      if (isNowSelected) {
                        handleCellEnter(
                          date,
                          wi,
                          di,
                          leftMargin + wi * step,
                          cellTopY,
                          level,
                          entry,
                          rect
                        );
                        playSound("hit", 1);
                      } else {
                        handleCellLeave();
                      }
                    }}
                  />
                );
              }),
            )}

            {/* Active / Hovered Highlight Ring Overlay (Rendered in front for crisp border stroke, matching Image 1) */}
            {hoveredCell && !gameActive && (
              <rect
                x={hoveredCell.x}
                y={hoveredCell.y}
                width={cellSize}
                height={cellSize}
                rx={cellRx}
                fill={activeColors[`level${hoveredCell.level}` as keyof ThemeColors]}
                stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.55)"}
                strokeWidth={1.5}
                style={{
                  pointerEvents: "none",
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: "scale(1.08)",
                  transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.15s ease",
                  filter: isDark 
                    ? "drop-shadow(0 0 4px rgba(255, 255, 255, 0.18))" 
                    : "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.15))",
                }}
              />
            )}

            {/* Selected Date Highlight Ring (When clicked/locked) */}
            {selectedDate && (!hoveredCell || hoveredCell.date !== selectedDate) && !gameActive && (() => {
              let selWi = -1;
              let selDi = -1;
              let selLevel = 0;
              for (let wi = 0; wi < weeks.length; wi++) {
                for (let di = 0; di < 7; di++) {
                  if (weeks[wi][di] === selectedDate) {
                    selWi = wi;
                    selDi = di;
                    selLevel = data[selectedDate]?.level ?? 0;
                    break;
                  }
                }
                if (selWi !== -1) break;
              }
              if (selWi === -1) return null;
              const selX = leftMargin + selWi * step;
              const selY = monthLabelHeight + selDi * step;

              return (
                <rect
                  x={selX}
                  y={selY}
                  width={cellSize}
                  height={cellSize}
                  rx={cellRx}
                  fill={activeColors[`level${selLevel}` as keyof ThemeColors]}
                  stroke={isDark ? "#6495ED" : "#3b82f6"}
                  strokeWidth={1.75}
                  style={{
                    pointerEvents: "none",
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    transform: "scale(1.1)",
                    filter: "drop-shadow(0 0 6px rgba(100, 149, 237, 0.45))",
                  }}
                />
              );
            })()}

            {/* Animation Overlay Cells */}
            {(animationPhase === "animating" || animationPhase === "fading") && (
              <g
                className={cn(
                  "transition-opacity duration-1000",
                  animationPhase === "fading" ? "opacity-0" : "opacity-100"
                )}
                style={{ pointerEvents: "none" }}
              >
                {weeks.map((week, wi) =>
                  week.map((date, di) => {
                    const cellTopY = monthLabelHeight + di * step;

                    if (!date) {
                      const cellDate = formatDate(
                        addDays(parseDate(gridStart), wi * 7 + di),
                      );
                      if (cellDate > resolvedEnd) return null;
                    }

                    const isHighlighted = highlightedCells.has(`${wi},${di}`);
                    const animData = cellAnimations.get(`${wi}-${di}`);
                    const shouldFlash = !isHighlighted && animData?.shouldFlash;

                    const defaultFill = isDark ? "#27272a" : "#f4f4f5";
                    const animClass = isHighlighted
                      ? "animate-highlight"
                      : shouldFlash
                      ? "animate-flash"
                      : "";

                    return (
                      <AnimOverlayCell
                        key={`anim-${wi}-${di}`}
                        wi={wi}
                        di={di}
                        x={leftMargin + wi * step}
                        y={cellTopY}
                        size={cellSize}
                        rx={cellRx}
                        defaultFill={defaultFill}
                        animClass={animClass}
                        animData={animData}
                        isHighlighted={isHighlighted}
                        isDark={isDark}
                      />
                    );
                  }),
                )}
              </g>
            )}
          </svg>

          {/* Game canvas overlay */}
          <canvas
            ref={canvasRef}
            width={svgWidth}
            height={svgHeight + (gameActive ? 36 : 0)}
            className={cn(
              "col-start-1 row-start-1 block w-full h-auto z-10 cursor-crosshair transition-opacity duration-500 ease-in-out",
              gameActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            style={{ 
              aspectRatio: `${svgWidth} / ${svgHeight + (gameActive ? 36 : 0)}` 
            }}
          />
          </motion.div>
          {gameActive && (
            <div className="md:hidden flex items-center justify-center gap-2 py-1.5 px-3 mt-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 select-none animate-pulse">
              <span>◀</span>
              <span>TOUCH & DRAG TO PILOT SHIP</span>
              <span>▶</span>
            </div>
          )}
        </div>
        </motion.div>

        {/* custom tooltip — rendered OUTSIDE the scroll container to avoid clipping */}
        {(() => {
          const count = tooltip.count ?? 0;
          const formattedDate = formatTooltipDate(tooltip.date);
          const tooltipText = tooltip.label
            ? `${tooltip.label} on ${formattedDate}.`
            : count === 0
              ? `No contributions on ${formattedDate}.`
              : `${count} contribution${count !== 1 ? "s" : ""} on ${formattedDate}.`;

          let transformPercent = 50;
          if (tooltip.visible && typeof window !== "undefined") {
            if (tooltip.x > window.innerWidth - 140) {
              transformPercent = 85;
            } else if (tooltip.x < 140) {
              transformPercent = 15;
            }
          }

          return (
            <div
              className="pointer-events-none fixed z-50 select-none"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: `translate(-${transformPercent}%, calc(-100% - 8px))`,
                transition: isFirstShow
                  ? "none"
                  : "left 0.16s cubic-bezier(0.16, 1, 0.3, 1), top 0.16s cubic-bezier(0.16, 1, 0.3, 1), transform 0.16s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <AnimatePresence>
                {tooltip.visible && tooltip.date && (
                  <motion.div
                    key="calendar-tooltip-card"
                    initial={{ opacity: 0, scale: 0.84, y: 7 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.88,
                      y: 4,
                      transition: { duration: 0.14, ease: "easeOut" },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 24,
                      mass: 0.5,
                    }}
                    className="relative rounded-md bg-[#181a1f] dark:bg-[#181a1f] px-3 py-1.5 text-xs font-semibold text-white shadow-2xl border border-zinc-700/60 dark:border-zinc-700/60 whitespace-nowrap"
                  >
                    <span>{tooltipText}</span>
                    {/* Downward Caret Arrow pointing directly at hovered cell */}
                    <div
                      className="absolute bg-[#181a1f] dark:bg-[#181a1f] border-r border-b border-zinc-700/60 transition-all duration-150"
                      style={{
                        width: 6,
                        height: 6,
                        left: `${transformPercent}%`,
                        bottom: -3,
                        transform: "translateX(-50%) rotate(45deg)",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })()}

        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
          className="relative w-full h-0 mt-4 mb-7"
        >
          <div 
            className="absolute bleed-x top-0 h-0 border-b border-black/30 dark:border-white/[0.15]" 
            style={DOT_MASK_HORIZONTAL}
          />
        </motion.div>

        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-3"
        >
          {/* legend (left) */}
          {showLegend && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground shrink-0">
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
                  <svg key={level} width={cellSize} height={cellSize}>
                    <rect
                      width={cellSize}
                      height={cellSize}
                      rx={cellRx}
                      fill={activeColors[`level${level}`]}
                    />
                  </svg>
                ))}
                <span>More</span>
              </div>

              {/* Game Mode Switch */}
              <div className="flex items-center border-l border-neutral-300 dark:border-neutral-800 pl-3 sm:pl-4">
                <button
                  type="button"
                  onClick={() => {
                    if (animationPhase === "animating" || animationPhase === "fading") {
                      setShakeError(true);
                      setTimeout(() => setShakeError(false), 300);
                      return;
                    }
                    setGameActive(!gameActive);
                  }}
                  aria-label="Toggle Game Mode"
                  title={gameActive ? "Disable Game Mode" : "Enable Game Mode (Space Invaders)"}
                  className={cn(
                    "group flex items-center gap-1.5 px-2 py-1 rounded-[6px] text-[11px] font-mono transition-all duration-150 select-none cursor-pointer outline-none border-0 ring-0",
                    gameActive
                      ? "text-[#6495ED] dark:text-[#6495ED] bg-[#6495ED]/10 font-medium"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
                    (animationPhase === "animating" || animationPhase === "fading") && "opacity-60 cursor-not-allowed",
                    shakeError && "ring-1 ring-red-500"
                  )}
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-105"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.5 3.5H4.5C2.567 3.5 1 5.067 1 7V11C1 12.933 2.567 14.5 4.5 14.5H13.5C15.433 14.5 17 12.933 17 11V7C17 5.067 15.433 3.5 13.5 3.5Z"
                      className={cn(
                        "transition-colors duration-200",
                        gameActive
                          ? "fill-[#6495ED]"
                          : "fill-zinc-400 dark:fill-zinc-600 group-hover:fill-zinc-600 dark:group-hover:fill-zinc-400"
                      )}
                    />
                    {/* D-Pad Cross */}
                    <path
                      d="M5.5 7V11M3.5 9H7.5"
                      stroke="white"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                    {/* Buttons */}
                    <circle cx="12.5" cy="7.75" r="0.7" fill="white" />
                    <circle cx="14.25" cy="9.5" r="0.7" fill="white" />
                    <circle cx="12.5" cy="11.25" r="0.7" fill="white" />
                    <circle cx="10.75" cy="9.5" r="0.7" fill="white" />
                  </svg>
                  <span>Game Mode</span>
                  <span
                    className={cn(
                      "size-1.5 rounded-full transition-colors duration-200",
                      gameActive ? "bg-[#6495ED]" : "bg-zinc-300 dark:bg-zinc-600"
                    )}
                  />
                </button>
              </div>
            </div>
          )}

          {/* stats line (right) */}
          {showStats && (
            <div className="flex flex-wrap justify-center text-sm font-sans tracking-wide">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-1 text-neutral-600 dark:text-neutral-400 select-none"
              >
                <span className="font-semibold text-blue-600 dark:text-[#6495ED]">
                  {username}
                </span>
                <span>contributed</span>
                <span className="font-bold text-blue-600 dark:text-[#6495ED]">
                  {stats.total.toLocaleString()}
                </span>
                <span>this year on</span>
                <DrawUnderlineLink className="font-semibold text-black dark:text-neutral-200 hover:text-[#6495ED] dark:hover:text-[#6495ED] transition-colors">
                  GitHub
                </DrawUnderlineLink>
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
});

GithubCalendar.displayName = "GithubCalendar";

export default GithubCalendar;

const generateTextPattern = (text: string, startCol: number) => {
  const allowedChars = Object.keys(letterPatterns);
  const withoutAccents = text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const chars = withoutAccents.split("").filter((char) => allowedChars.includes(char));

  let currentPosition = startCol;
  const highlightedCells = new Set<string>();

  chars.forEach((char) => {
    if (letterPatterns[char]) {
      letterPatterns[char].forEach((pos) => {
        const row = Math.floor(pos / 50);
        const col = pos % 50;
        highlightedCells.add(`${currentPosition + col},${row}`);
      });
    }
    currentPosition += 6; // spacing
  });
  return highlightedCells;
};

const letterPatterns: { [key: string]: number[] } = {
  A: [1, 2, 3, 50, 100, 150, 200, 250, 300, 54, 104, 154, 204, 254, 304, 151, 152, 153],
  B: [0, 1, 2, 3, 4, 50, 100, 150, 151, 200, 250, 300, 301, 302, 303, 304, 54, 104, 152, 153, 204, 254, 303],
  C: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
  D: [0, 1, 2, 3, 50, 100, 150, 200, 250, 300, 301, 302, 54, 104, 154, 204, 254, 303],
  E: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304, 151, 152],
  F: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 151, 152, 153],
  G: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 153, 204, 154, 304, 254],
  H: [0, 50, 100, 150, 200, 250, 300, 151, 152, 153, 4, 54, 104, 154, 204, 254, 304],
  I: [0, 1, 2, 3, 4, 52, 102, 152, 202, 252, 300, 301, 302, 303, 304],
  J: [0, 1, 2, 3, 4, 52, 102, 152, 202, 250, 252, 302, 300, 301],
  K: [0, 4, 50, 100, 150, 200, 250, 300, 151, 152, 103, 54, 203, 254, 304],
  L: [0, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
  M: [0, 50, 100, 150, 200, 250, 300, 51, 102, 53, 4, 54, 104, 154, 204, 254, 304],
  N: [0, 50, 100, 150, 200, 250, 300, 51, 102, 153, 204, 4, 54, 104, 154, 204, 254, 304],
  Ñ: [0, 50, 100, 150, 200, 250, 300, 51, 102, 153, 204, 4, 54, 104, 154, 204, 254, 304],
  O: [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 303, 54, 104, 154, 204, 254],
  P: [0, 50, 100, 150, 200, 250, 300, 1, 2, 3, 54, 104, 151, 152, 153],
  Q: [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 54, 104, 154, 204, 202, 253, 304],
  R: [0, 50, 100, 150, 200, 250, 300, 1, 2, 3, 54, 104, 151, 152, 153, 204, 254, 304],
  S: [1, 2, 3, 4, 50, 100, 151, 152, 153, 204, 254, 300, 301, 302, 303],
  T: [0, 1, 2, 3, 4, 52, 102, 152, 202, 252, 302],
  U: [0, 50, 100, 150, 200, 250, 301, 302, 303, 4, 54, 104, 154, 204, 254],
  V: [0, 50, 100, 150, 200, 251, 302, 4, 54, 104, 154, 204, 253],
  W: [0, 50, 100, 150, 200, 250, 301, 152, 202, 252, 4, 54, 104, 154, 204, 254, 303],
  X: [0, 50, 203, 254, 304, 4, 54, 152, 101, 103, 201, 250, 300],
  Y: [0, 50, 101, 152, 202, 252, 302, 4, 54, 103],
  Z: [0, 1, 2, 3, 4, 54, 103, 152, 201, 250, 300, 301, 302, 303, 304],
  "0": [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 303, 54, 104, 154, 204, 254],
  "1": [1, 52, 102, 152, 202, 252, 302, 0, 2, 300, 301, 302, 303, 304],
  "2": [0, 1, 2, 3, 54, 104, 152, 153, 201, 250, 300, 301, 302, 303, 304],
  "3": [0, 1, 2, 3, 54, 104, 152, 153, 204, 254, 300, 301, 302, 303],
  "4": [0, 50, 100, 150, 4, 54, 104, 151, 152, 153, 154, 204, 254, 304],
  "5": [0, 1, 2, 3, 4, 50, 100, 151, 152, 153, 204, 254, 300, 301, 302, 303],
  "6": [1, 2, 3, 50, 100, 150, 151, 152, 153, 200, 250, 301, 302, 204, 254, 303],
  "7": [0, 1, 2, 3, 4, 54, 103, 152, 201, 250, 300],
  "8": [1, 2, 3, 50, 100, 151, 152, 153, 200, 250, 301, 302, 303, 54, 104, 204, 254],
  "9": [1, 2, 3, 50, 100, 151, 152, 153, 154, 204, 254, 304, 54, 104],
  " ": [],
};
