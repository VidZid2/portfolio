"use client";

import { memo, useMemo, useState, useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DrawUnderlineLink } from "@/components/sora-ui/texts/draw-underline-link";

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
  } catch (e) {
    return dateStr;
  }
}

import { playLaserSound, playExplosionSound, playHitChime, playVictoryFanfare, playSuperComboSound } from "@/lib/synth-sounds";

function playSound(type: "laser" | "explosion" | "hit" | "victory" | "superCombo", param: number = 0) {
  if (type === "laser") playLaserSound(0.03);
  else if (type === "explosion") playExplosionSound(0.04);
  else if (type === "hit") playHitChime(param, 0.035);
  else if (type === "victory") playVictoryFanfare(0.05);
  else if (type === "superCombo") playSuperComboSound(param === 10 ? 10 : 5, 0.05);
}

// ─── API fetch ────────────────────────────────────────────────────────────────

type APIResponse = {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: number }[];
};

async function fetchContributions(username: string): Promise<ContributionData> {
  // 1. Primary Reliable Endpoint
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}`,
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
    console.warn("Primary GitHub API fetch failed, trying secondary fallback:", err);
  }

  // 2. Secondary Fallback Endpoint
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
    console.warn("Secondary GitHub API fetch failed:", err);
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

function CalendarSkeleton({
  cellSize = 12,
  cellGap = 3,
  className,
}: {
  cellSize?: number;
  cellGap?: number;
  className?: string;
}) {
  const step = cellSize + cellGap;
  const weeks = 53;
  const days = 7;
  return (
    <div className={cn("w-fit mx-auto space-y-3 animate-pulse", className)}>
      <div className="flex gap-6">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
      <div className="overflow-x-auto">
        <svg
          width={weeks * step - cellGap}
          height={16 + days * step - cellGap}
          className="overflow-visible"
        >
          {Array.from({ length: weeks }).map((_, wi) =>
            Array.from({ length: days }).map((_, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * step}
                y={16 + di * step}
                width={cellSize}
                height={cellSize}
                rx={cellSize * 0.2}
                className="fill-muted"
              />
            )),
          )}
        </svg>
      </div>
    </div>
  );
}

// ─── Animation Overlay Cell ─────────────────────────────────────────────────────

const ASCII_CHARS = ['*', '+', '#', '~', 'x', '.', ':', '-', '<', '>', '/', '\\', 'o', '0', '1'];

function AnimOverlayCell({
  wi,
  di,
  x,
  y,
  size,
  rx,
  defaultFill,
  animClass,
  animData,
  isHighlighted,
  isDark,
}: any) {
  const textRef = useRef<SVGTextElement>(null);
  const [phase, setPhase] = useState<"ascii" | "solid">("ascii");

  // Store a random disperse delay on mount so it doesn't change
  const disperseDelay = useRef(800 + Math.random() * 1800);

  useEffect(() => {
    // Gradually disperse the ASCII effect based on the random delay
    const timer = setTimeout(() => {
      setPhase("solid");
    }, disperseDelay.current); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "ascii") return;

    // Scramble on EVERY cell for the whole-grid matrix effect
    const interval = setInterval(() => {
      if (textRef.current) {
        textRef.current.textContent = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
      }
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        rx={rx}
        fill={defaultFill}
        className={phase === "solid" ? animClass : ""}
        style={{
          animationDelay: animData?.delay,
          "--highlight": "#6495ED",
        } as any}
      />
      {phase === "ascii" && (
        <text
          ref={textRef}
          x={x + size / 2}
          y={y + size / 2 + 1}
          fontSize={size * 0.9}
          // Highlighted cells are blue, others are subtle gray
          fill={isHighlighted ? "#6495ED" : (isDark ? "#3f3f46" : "#a1a1aa")}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="monospace"
          fontWeight="bold"
          pointerEvents="none"
        />
      )}
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
  const [loading, setLoading] = useState(!!username);
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
    setFetchedData(null);
    setFetchError(null);
    setLoading(true);
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
  }, [username, onStatusChange]);

  // ── Choose data source ─────────────────────────────────────────────────
  const data: ContributionData = dataProp ?? fetchedData ?? {};

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

  // ── Tooltip state ──────────────────────────────────────────────────────
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    date: "",
    count: undefined,
    label: undefined,
    x: 0,
    y: 0,
  });

  const { weeks, monthLabels, gridStart } = useMemo(
    () => buildGrid(resolvedStart, resolvedEnd, startsOnSunday),
    [resolvedStart, resolvedEnd, startsOnSunday],
  );

  // ── Animation Grid ────────────────────────────────────────────────────────
  const { highlightedCells, cellAnimations } = useMemo(() => {
    const text = deviceType === "mobile" ? "JD" : (weeks.length < 35 ? "JOSH" : "JOSIAH");
    const textWidth = deviceType === "mobile" ? 11 : (weeks.length < 35 ? 22 : 35);
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
  }, [weeks.length]);

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
    
    // Scroll immediately
    scrollToRight();
    
    // Scroll again after a small delay to allow for layout shifts
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

    let gameWon = false;
    let animationFrameId: number;
    let score = 0;
    let combo = 0;
    let lastHitTime = 0;
    let screenShake = 0;
    let shotCount = 0;
    let gameplayAlpha = 1;
    let superLaserCharges = 0;

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

    // Canvas dimensions matching SVG viewBox with high-DPI retina sharpness
    const dpr = typeof window !== "undefined" ? Math.max(window.devicePixelRatio || 1, 2) : 2;
    const canvasWidth = svgWidth;
    const canvasHeight = svgHeight + 36;
    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);

    // Initial scale and translation for high-DPI rendering
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const logicalWidth = svgWidth;
    const logicalHeight = svgHeight + 36;

    // Local mutable map for dynamic cell levels
    const cellLevels = new Map<string, number>();
    let totalTargetCells = 0;
    weeks.forEach((week) => {
      week.forEach((date) => {
        if (!date) return;
        const entry = data[date];
        const initialLevel = entry?.level ?? 0;
        cellLevels.set(date, initialLevel);
        if (initialLevel > 0) totalTargetCells++;
        const rect = document.getElementById(`cell-${id}-${date}`);
        if (rect) {
          if (initialLevel === 0) {
            rect.style.opacity = "0";
            rect.style.pointerEvents = "none";
          } else {
            rect.style.opacity = "1";
            rect.style.pointerEvents = "auto";
          }
        }
      });
    });

    // Player (Spacecraft)
    const player = {
      x: logicalWidth / 2 - 16,
      targetX: logicalWidth / 2 - 16,
      y: logicalHeight - 22,
      width: 32,
      height: 20,
      speed: 2.8,
      direction: 1, // 1 = right, -1 = left
      color: "#38bdf8",
      userControlled: false,
      lastUserInteraction: 0,
    };

    // Mouse & Touch Controls
    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasWidth / rect.width;
      const canvasX = (e.clientX - rect.left) * scaleX;
      player.targetX = canvasX - player.width / 2;
      player.userControlled = true;
      player.lastUserInteraction = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasWidth / rect.width;
      const canvasX = (e.touches[0].clientX - rect.left) * scaleX;
      player.targetX = canvasX - player.width / 2;
      player.userControlled = true;
      player.lastUserInteraction = Date.now();
    };

    const handlePointerLeave = () => {
      player.userControlled = false;
    };

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("mouseleave", handlePointerLeave);

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
    const cooldown = 380; // Slower, rhythmic and deliberate shooting pace

    const shoot = () => {
      shotCount++;

      if (superLaserCharges > 0) {
        // Hyper Plasma Tri-Beam (5x / 10x Combo Reward!)
        superLaserCharges--;
        bullets.push({
          x: player.x + 2,
          y: player.y - 2,
          vx: -0.6,
          vy: -4.2,
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
          vy: -4.5,
          width: 4,
          height: 12,
          color: "#e879f9",
          glowColor: "#c084fc",
          isSpecial: true,
        });
        bullets.push({
          x: player.x + player.width - 5.5,
          y: player.y - 2,
          vx: 0.6,
          vy: -4.2,
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
          vy: -4.0,
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
          vy: -4.0,
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
          vy: -4.0,
          width: 3,
          height: 9,
          color: "#fbbf24",
          glowColor: "#f59e0b",
        });
      }
      playSound("laser");
    };

    // Stars background (Deep Space parallax effect)
    const stars = Array.from({ length: 120 }).map(() => ({
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

    const explode = (x: number, y: number, color: string, isFullDestroy: boolean) => {
      if (isFullDestroy) {
        playSound("explosion");
        screenShake = 3;
        // Spawn Shockwave Ring
        shockwaves.push({
          x,
          y,
          radius: 2,
          maxRadius: 24,
          color,
          alpha: 0.9,
        });
      } else {
        playSound("hit", combo);
      }

      // Shard Debris Particles
      const count = isFullDestroy ? 14 : 6;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = isFullDestroy ? (Math.random() * 2.8 + 1.2) : (Math.random() * 1.5 + 0.8);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: Math.random() * 2.5 + 1.2,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 20 + 20,
        });
      }
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
      const isUserActive = player.userControlled && (now - player.lastUserInteraction < 2000);

      if (isUserActive) {
        // Smoothly glide to pointer position with inertia
        const clampedTarget = Math.max(minX, Math.min(maxX, player.targetX));
        player.x += (clampedTarget - player.x) * 0.16;
      } else {
        // Smooth, full-range auto-pilot patrol sweep
        player.x += player.speed * player.direction;
        if (player.x >= maxX) {
          player.x = maxX;
          player.direction = -1;
        } else if (player.x <= minX) {
          player.x = minX;
          player.direction = 1;
        }
      }

      // Clamp player bounds
      player.x = Math.max(minX, Math.min(maxX, player.x));

      // ── Thruster Exhaust Plasma Particles ──────────────────────────────────
      if (!victoryState.active && Math.random() < 0.6) {
        particles.push({
          x: player.x + player.width / 2 + (Math.random() * 6 - 3),
          y: player.y + player.height * 0.8,
          vx: (Math.random() - 0.5) * 0.8,
          vy: Math.random() * 1.8 + 1.2,
          color: combo >= 10 ? "#e879f9" : combo >= 5 ? "#facc15" : Math.random() > 0.4 ? "#38bdf8" : "#f59e0b",
          size: Math.random() * 2 + 1,
          alpha: 0.8,
          life: 0,
          maxLife: 15,
        });
      }

      // ── Rhythmic Auto-Shooting ─────────────────────────────────────────────
      if (!victoryState.active && now - lastShot >= cooldown) {
        shoot();
        lastShot = now;
      }

      // ── Smooth Victory Animation & Gameplay Fade-out State Update ───────────
      const targetGameplayAlpha = victoryState.active ? 0 : 1;
      gameplayAlpha += (targetGameplayAlpha - gameplayAlpha) * 0.12;

      if (victoryState.active) {
        if (now - victoryState.startTime >= 2300) {
          victoryState.targetAlpha = 0;
        }
        victoryState.alpha += (victoryState.targetAlpha - victoryState.alpha) * 0.08;
        victoryState.scale += (1 - victoryState.scale) * 0.08;
      }

      // ── Victory Check ──────────────────────────────────────────────────────
      if (remainingTargets === 0 && !gameWon) {
        gameWon = true;
        victoryState.active = true;
        victoryState.startTime = now;
        victoryState.targetAlpha = 1;
        playSound("victory");
        screenShake = 4.0;

        // Big Celebratory Confetti Burst
        for (let i = 0; i < 45; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4.5 + 1.2;
          particles.push({
            x: logicalWidth / 2,
            y: logicalHeight / 2 - 10,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: ["#38bdf8", "#facc15", "#e879f9", "#34d399", "#60a5fa"][Math.floor(Math.random() * 5)]!,
            size: Math.random() * 3 + 1.5,
            alpha: 1,
            life: 0,
            maxLife: 60,
          });
        }

        // Concentric Victory Shockwaves
        shockwaves.push({
          x: logicalWidth / 2,
          y: logicalHeight / 2 - 10,
          radius: 4,
          maxRadius: 70,
          color: "#38bdf8",
          alpha: 1,
        });
        shockwaves.push({
          x: logicalWidth / 2,
          y: logicalHeight / 2 - 10,
          radius: 2,
          maxRadius: 50,
          color: "#facc15",
          alpha: 0.9,
        });

        // Smoothly close the game mode after the winner sequence concludes (cells will smoothly restore on cleanup)
        setTimeout(() => {
          setGameActive(false);
        }, 2800);
      }

      // ── Update Stars ───────────────────────────────────────────────────────
      stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > canvasHeight - 4) {
          s.y = -4;
          s.x = Math.random() * canvasWidth;
        }
      });

      // ── Update Bullets ─────────────────────────────────────────────────────
      bullets = bullets.filter((b) => {
        b.x += b.vx;
        b.y += b.vy;
        return b.y > 0;
      });

      // ── Update Particles ───────────────────────────────────────────────────
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;
      });
      particles = particles.filter((p) => p.life < p.maxLife);

      // ── Update Shockwaves ──────────────────────────────────────────────────
      shockwaves.forEach((s) => {
        s.radius += 1.2;
        s.alpha = Math.max(0, 1 - s.radius / s.maxRadius);
      });
      shockwaves = shockwaves.filter((s) => s.radius < s.maxRadius);

      // ── Update Floating Text ───────────────────────────────────────────────
      floatTexts.forEach((t) => {
        t.y += t.vy;
        t.alpha -= 0.02;
      });
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
              comboDisplay.scale = 1.35; // spring bounce

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
                screenShake = 4.5;
                superLaserCharges += 4;
                // Golden Solar Shockwave
                shockwaves.push({
                  x: logicalWidth / 2,
                  y: logicalHeight / 2 - 20,
                  radius: 4,
                  maxRadius: 46,
                  color: "#facc15",
                  alpha: 1,
                });
                // Golden Spark Blast
                for (let i = 0; i < 22; i++) {
                  const angle = Math.random() * Math.PI * 2;
                  const speed = Math.random() * 3.2 + 1.5;
                  particles.push({
                    x: logicalWidth / 2,
                    y: logicalHeight / 2 - 20,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: Math.random() > 0.3 ? "#facc15" : "#38bdf8",
                    size: Math.random() * 2.8 + 1.2,
                    alpha: 1,
                    life: 0,
                    maxLife: 28,
                  });
                }
                floatTexts.push({
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
                screenShake = 6.0;
                superLaserCharges += 6;
                // Dual Cosmic Nova Rings
                shockwaves.push({
                  x: logicalWidth / 2,
                  y: logicalHeight / 2 - 20,
                  radius: 4,
                  maxRadius: 56,
                  color: "#e879f9",
                  alpha: 1,
                });
                shockwaves.push({
                  x: logicalWidth / 2,
                  y: logicalHeight / 2 - 20,
                  radius: 2,
                  maxRadius: 38,
                  color: "#38bdf8",
                  alpha: 0.9,
                });
                // Cosmic Spark Burst
                for (let i = 0; i < 32; i++) {
                  const angle = Math.random() * Math.PI * 2;
                  const speed = Math.random() * 4.0 + 2.0;
                  particles.push({
                    x: logicalWidth / 2,
                    y: logicalHeight / 2 - 20,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: ["#e879f9", "#facc15", "#38bdf8"][Math.floor(Math.random() * 3)]!,
                    size: Math.random() * 3 + 1.5,
                    alpha: 1,
                    life: 0,
                    maxLife: 32,
                  });
                }
                floatTexts.push({
                  x: logicalWidth / 2,
                  y: logicalHeight / 2 - 15,
                  text: "🔥 10X HYPER STREAK! 🔥",
                  color: "#e879f9",
                  alpha: 1,
                  vy: -0.45,
                });
              }

              const points = newLevel === 0 ? (150 * Math.min(combo, 10)) : (50 * Math.min(combo, 10));
              score += points;

              // Spawn floating score popup
              floatTexts.push({
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
      stars.forEach((s) => {
        ctx.globalAlpha = s.alpha;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      ctx.globalAlpha = 1.0;

      // 2. Shockwave Rings
      shockwaves.forEach((s) => {
        ctx.save();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // 3. Bullets
      bullets.forEach((b) => {
        ctx.save();
        ctx.shadowColor = b.glowColor;
        ctx.shadowBlur = 6;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.restore();
      });

      // 4. Particles
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      ctx.globalAlpha = 1.0;

      // 5. Floating Text Popups (Crisp Geist Mono font)
      floatTexts.forEach((t) => {
        ctx.save();
        ctx.font = '700 10.5px var(--font-geist-mono), "Geist Mono", monospace';
        ctx.fillStyle = t.color;
        ctx.globalAlpha = t.alpha;
        ctx.textAlign = "center";
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();
      });

      // 6. In-Game HUD (Crisp Geist Mono font matching website typography)
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

        // Smooth Animated Combo Banner (Smooth In / Out + Special 5x & 10x Pulse)
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

      // 7. Player Spaceship (Smoothly hidden during victory)
      if (gameplayAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = gameplayAlpha;
        ctx.fillStyle = combo >= 10 ? "#e879f9" : combo >= 5 ? "#facc15" : player.color;
        ctx.shadowColor = combo >= 10 ? "#e879f9" : combo >= 5 ? "#facc15" : player.color;
        ctx.shadowBlur = combo >= 5 ? 12 : 8;
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2, player.y);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.lineTo(
          player.x + player.width * 0.7,
          player.y + player.height * 0.75,
        );
        ctx.lineTo(
          player.x + player.width * 0.3,
          player.y + player.height * 0.75,
        );
        ctx.lineTo(player.x, player.y + player.height);
        ctx.closePath();
        ctx.fill();

        // Cockpit Glow
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(
          player.x + player.width / 2,
          player.y + player.height * 0.45,
          2.5,
          4.5,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }

      // 8. Winner Overlay Banner (Centered, High-DPI Crisp Geist Mono)
      if (victoryState.active && victoryState.alpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, Math.max(0, victoryState.alpha));
        ctx.translate(logicalWidth / 2, logicalHeight / 2 - 10);
        ctx.scale(victoryState.scale, victoryState.scale);

        // High contrast backdrop card
        const bannerW = Math.min(logicalWidth - 32, 280);
        const bannerH = 50;

        ctx.fillStyle = isDark ? "rgba(9, 9, 11, 0.9)" : "rgba(255, 255, 255, 0.92)";
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
        ctx.fillText("★ ALL TARGETS CLEARED! ★", 0, -9);

        // Subtitle & Score Text
        ctx.font = '600 10px var(--font-geist-mono), "Geist Mono", monospace';
        ctx.fillStyle = isDark ? "#e4e4e7" : "#3f3f46";
        ctx.fillText(`VICTORY • SCORE: ${score.toLocaleString()}`, 0, 11);

        ctx.restore();
      }

      ctx.restore();
    };

    const loop = () => {
      update();
      render();
      if (gameActive) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("mouseleave", handlePointerLeave);
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
              height="auto"
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

                if (!date) {
                  const cellDate = formatDate(
                    addDays(parseDate(gridStart), wi * 7 + di),
                  );
                  // We removed the return null here so the graph remains a perfect rectangle
                }

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
                      !gameActive && date && "cursor-pointer hover:stroke-black/40 dark:hover:stroke-white/40 stroke-transparent stroke-[1.5px] origin-center hover:scale-[1.15]"
                    )}
                    style={{
                      transition: gameActive 
                        ? "opacity 0.1s, fill 0.1s, stroke 0.3s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
                        : "opacity 1s ease-in-out, fill 1s ease-in-out, stroke 0.3s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      opacity: gameActive ? (level === 0 || !date ? 0 : 1) : 1,
                      pointerEvents: gameActive ? (level === 0 || !date ? "none" : "auto") : "auto",
                      transformBox: "fill-box",
                    }}
                    onMouseEnter={(e) => {
                      if (!date || gameActive) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        visible: true,
                        date,
                        count: entry?.count,
                        label: entry?.label,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      });
                    }}
                    onMouseLeave={() =>
                      setTooltip((t) => ({ ...t, visible: false }))
                    }
                  />
                );
              }),
            )}

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
            if (tooltip.x > window.innerWidth - 130) {
              transformPercent = 85;
            } else if (tooltip.x < 130) {
              transformPercent = 15;
            }
          }

          return (
            <div
              className={cn(
                "pointer-events-none fixed z-50 rounded bg-[#24292e] dark:bg-[#161b22] px-2.5 py-1 text-[11px] font-medium text-white shadow-md border border-neutral-700/30 whitespace-nowrap transition-all duration-200",
                tooltip.visible ? "opacity-100 visible" : "opacity-0 invisible"
              )}
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: `translate(-${transformPercent}%, calc(-100% - ${tooltip.visible ? '6px' : '2px'})) scale(${tooltip.visible ? 1 : 0.95})`,
              }}
            >
              {tooltip.date ? tooltipText : ""}
              {/* Small arrow pointing down */}
              <div
                className="absolute bg-[#24292e] dark:bg-[#161b22] border-r border-b border-neutral-700/30"
                style={{
                  width: 6,
                  height: 6,
                  left: `${transformPercent}%`,
                  bottom: 0,
                  transform: "translateX(-50%) translateY(50%) rotate(45deg)",
                }}
              />
            </div>
          );
        })()}

        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
          className="relative w-full h-0 mt-4 mb-7"
        >
          <div 
            className="absolute left-[-100vw] right-[-100vw] top-0 h-0 border-b border-black/30 dark:border-white/[0.15]" 
            style={{ 
              maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', 
              WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' 
            }} 
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
                  onClick={() => {
                    if (animationPhase === "animating" || animationPhase === "fading") {
                      setShakeError(true);
                      setTimeout(() => setShakeError(false), 300);
                      return;
                    }
                    setGameActive(!gameActive);
                  }}
                  aria-label="Toggle Game Mode"
                  className={cn(
                    "group flex items-center gap-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[11px] font-mono transition-all duration-200 select-none cursor-pointer outline-none",
                    gameActive
                      ? "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/30 shadow-[0_1px_2px_rgba(16,185,129,0.08)]"
                      : "bg-zinc-100/90 dark:bg-zinc-800/80 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/70 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
                    (animationPhase === "animating" || animationPhase === "fading") && "opacity-60 cursor-not-allowed",
                    shakeError && "ring-2 ring-red-500"
                  )}
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="6" y1="12" x2="10" y2="12" />
                      <line x1="8" y1="10" x2="8" y2="14" />
                      <line x1="15" y1="13" x2="15.01" y2="13" />
                      <line x1="18" y1="11" x2="18.01" y2="11" />
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                    </svg>
                    <span>Game Mode</span>
                  </span>

                  <span
                    className={cn(
                      "relative inline-flex h-3.5 w-6 shrink-0 rounded-full p-[2px] transition-colors duration-200 ease-in-out pointer-events-none",
                      gameActive ? "bg-emerald-500 dark:bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-2.5 w-2.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out",
                        gameActive ? "translate-x-2.5" : "translate-x-0"
                      )}
                    />
                  </span>
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
