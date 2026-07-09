"use client";

import { memo, useMemo, useState, useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

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

function playSound(type: "laser" | "explosion" | "hit" | "victory") {
  // Sound effects disabled
}

// ─── API fetch ────────────────────────────────────────────────────────────────

type APIResponse = {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: number }[];
};

async function fetchContributions(username: string): Promise<ContributionData> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}`,
  );
  if (!res.ok) {
    throw new Error(
      `Could not fetch contributions for "${username}" (${res.status})`,
    );
  }
  const json: APIResponse = await res.json();

  const result: ContributionData = {};
  for (const entry of json.contributions) {
    result[entry.date] = {
      level: Math.min(4, Math.max(0, entry.level)) as ContributionLevel,
      count: entry.count,
    };
  }
  return result;
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

    fetchContributions(username)
      .then((d) => setFetchedData(d))
      .catch((e) => setFetchError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [username]);

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
    const text = deviceType === "mobile" ? "JD" : deviceType === "tablet" ? "JOSH" : "JOSIAH";
    const textWidth = deviceType === "mobile" ? 11 : deviceType === "tablet" ? 22 : 35;
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
  const monthLabelHeight = showMonthLabels ? 20 : 0;
  const leftMargin = showMonthLabels ? 28 : 0;
  const svgWidth = leftMargin + weeks.length * step - cellGap;
  const svgHeight = monthLabelHeight + 7 * step - cellGap;
  // Auto-scroll to the right end (most recent months) — must be before early returns
  useEffect(() => {
    const scrollToRight = () => {
      if (scrollRef.current) {
        // Set scrollLeft to a very high number to ensure it hits the end, 
        // or use scrollWidth.
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

  // Game loop and autoplay logic
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
    
    // Canvas dimensions must match SVG viewBox exactly to prevent coordinate mismatch
    const canvasWidth = svgWidth + 48;
    const canvasHeight = svgHeight + 8 + 80; // +80 for the player ship area
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // We translate the canvas context so that (0,0) matches the SVG (0,0)
    // The SVG viewBox starts at -24, -4. So (0,0) is 24px right and 4px down.
    ctx.translate(24, 4);

    const logicalWidth = svgWidth;
    const logicalHeight = svgHeight + 80;

    // Local mutable map for dynamic cell levels
    const cellLevels = new Map<string, number>();
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
          }
        }
      });
    });

    // Player (Spacecraft) with automatic direction sweep
    const player = {
      x: logicalWidth / 2 - 15,
      y: logicalHeight - 25,
      width: 30,
      height: 20,
      speed: 4,
      direction: 1, // 1 = right, -1 = left
      color: "#38bdf8",
    };

    // Bullets
    type GameBullet = {
      x: number;
      y: number;
      vy: number;
      width: number;
      height: number;
      color: string;
    };
    let bullets: GameBullet[] = [];
    let lastShot = 0;
    const cooldown = 140; // Autoplay shooting speed

    const shoot = () => {
      bullets.push({
        x: player.x + player.width / 2 - 1.5,
        y: player.y - 4,
        vy: -6,
        width: 3,
        height: 8,
        color: "#fbbf24", // Yellow laser
      });
      playSound("laser");
    };

    // Stars background (Space effect)
    const stars = Array.from({ length: 140 }).map(() => ({
      x: Math.random() * canvasWidth - 24, // -24 to svgWidth + 24
      y: Math.random() * canvasHeight - 4, // -4 to svgHeight + 76
      speed: Math.random() * 0.4 + 0.1,
      size: Math.random() * 1.2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    // Particles (for explosions)
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
    const explode = (x: number, y: number, color: string) => {
      playSound("explosion");
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 1.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: Math.random() * 2 + 1,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 15 + 15,
        });
      }
    };

    const update = () => {
      // Find the min and max column index (wi) that still has active cells (level > 0)
      let minWi = -1;
      let maxWi = -1;
      weeks.forEach((week, wi) => {
        week.forEach((date) => {
          if (!date) return;
          if ((cellLevels.get(date) ?? 0) > 0) {
            if (minWi === -1) minWi = wi;
            minWi = Math.min(minWi, wi);
            maxWi = Math.max(maxWi, wi);
          }
        });
      });

      // If there are active cells, restrict player boundary
      let minX = 0;
      let maxX = logicalWidth - player.width;
      if (minWi !== -1 && maxWi !== -1) {
        const activeLeft = leftMargin + minWi * step;
        const activeRight = leftMargin + maxWi * step + cellSize;
        minX = Math.max(0, activeLeft - 40);
        maxX = Math.min(logicalWidth - player.width, activeRight + 40 - player.width);
        if (minX > maxX) {
          const mid = (minX + maxX) / 2;
          minX = mid;
          maxX = mid;
        }
      }

      // Clamp player position
      player.x = Math.max(minX, Math.min(maxX, player.x));

      // ── Side-to-Side Sweep Ship Movement ──────────────────────────────────
      player.x += player.speed * player.direction;
      if (player.x >= maxX) {
        player.x = maxX;
        player.direction = -1;
      } else if (player.x <= minX) {
        player.x = minX;
        player.direction = 1;
      }

      // ── Continuous Auto-Shooting ──────────────────────────────────────────
      const now = Date.now();
      if (now - lastShot >= cooldown) {
        shoot();
        lastShot = now;
      }

      // ── Reset Game if all contribution cells are cleared to level 0 ──────
      let anyActive = false;
      cellLevels.forEach((level) => {
        if (level > 0) anyActive = true;
      });

      if (!anyActive && !gameWon) {
        gameWon = true;
        playSound("victory");
        // Reset all cell levels back to their original levels
        weeks.forEach((week) => {
          week.forEach((date) => {
            if (!date) return;
            const originalLevel = data[date]?.level ?? 0;
            cellLevels.set(date, originalLevel);
            const rect = document.getElementById(`cell-${id}-${date}`);
            if (rect) {
              const originalColor =
                activeColors[`level${originalLevel}` as keyof ThemeColors] ||
                activeColors.level0;
              rect.setAttribute("fill", originalColor);
              if (originalLevel === 0) {
                rect.style.opacity = "0";
                rect.style.pointerEvents = "none";
              } else {
                rect.style.opacity = "1";
                rect.style.pointerEvents = "auto";
              }
            }
          });
        });
        
        setTimeout(() => {
          setGameActive(false);
        }, 1200);
      }

      // ── Update Environment ────────────────────────────────────────────────
      // Move Stars
      stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > canvasHeight - 4) {
          s.y = -4;
          s.x = Math.random() * canvasWidth - 24;
        }
      });

      // Move Bullets
      bullets = bullets.filter((b) => {
        b.y += b.vy;
        return b.y > 0;
      });

      // Move Particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;
      });
      particles = particles.filter((p) => p.life < p.maxLife);

      // Check laser collisions with cells
      bullets.forEach((bullet, bulletIdx) => {
        weeks.forEach((week, wi) => {
          week.forEach((date, di) => {
            if (!date) return;

            const currentLevel = cellLevels.get(date) ?? 0;
            if (currentLevel === 0) return; // Already finished / level 0

            const cellX = leftMargin + wi * step;
            const cellY = monthLabelHeight + di * step;

            // Simple box-overlap collision check
            if (
              bullet.x < cellX + cellSize &&
              bullet.x + bullet.width > cellX &&
              bullet.y < cellY + cellSize &&
              bullet.y + bullet.height > cellY
            ) {
              // Collision detected! Remove the bullet
              bullets.splice(bulletIdx, 1);

              // Decrement the level by 1
              const newLevel = currentLevel - 1;
              cellLevels.set(date, newLevel);

              // Instantly update the cell color in the SVG DOM
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

              // Play hit explosion effect using the level color before hit
              const hitColor =
                activeColors[`level${currentLevel}` as keyof ThemeColors] ||
                activeColors.level0;
              explode(cellX + cellSize / 2, cellY + cellSize / 2, hitColor);
            }
          });
        });
      });
    };

    const render = () => {
      ctx.clearRect(-24, -4, canvasWidth, canvasHeight);

      // Draw starry space background
      ctx.fillStyle = isDark ? "#ffffff" : "#94a3b8";
      stars.forEach((s) => {
        ctx.globalAlpha = s.alpha;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      ctx.globalAlpha = 1.0;

      // Draw bullets
      bullets.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      // Draw particles
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      ctx.globalAlpha = 1.0;

      // Draw Player Ship (Cyan space fighter style)
      ctx.fillStyle = player.color;
      ctx.shadowColor = player.color;
      ctx.shadowBlur = 6;
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
      ctx.shadowBlur = 0;
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
        
        {/* Game and Calendar Container */}
        <div 
          className={cn(
            "p-3 rounded-xl transition-all duration-500 border border-transparent",
            gameActive ? (isDark ? "bg-black border-neutral-800" : "bg-neutral-100 border-neutral-200 shadow-inner") : ""
          )}
        >
        <div
          ref={scrollRef}
          className="relative w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden transition-all duration-500 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="grid">
            <svg
              width={svgWidth + 48}
              height={svgHeight + 8}
              viewBox={`-24 -4 ${svgWidth + 48} ${svgHeight + 8}`}
              className="col-start-1 row-start-1 overflow-visible block w-full h-auto max-w-full"
              style={deviceType === "desktop" ? { minWidth: svgWidth + 48 } : {}}
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
                  const x = isLast && xPos > svgWidth - 30 ? svgWidth - 30 : xPos;

                  return (
                    <text
                      key={`${label}-${weekIndex}`}
                      x={x}
                      y={15}
                      fontSize={deviceType !== "desktop" ? 14 : 12}
                      fill={isDark ? "#fafafa" : "#0a0a0a"}
                      fontFamily="inherit"
                      className="transition-opacity duration-1000 ease-in-out"
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
                    x={0}
                    y={monthLabelHeight + di * step + cellSize / 2 + 4}
                    fontSize={deviceType !== "desktop" ? 14 : 12}
                    fill={isDark ? "#fafafa" : "#0a0a0a"}
                    fontFamily="inherit"
                    className="transition-opacity duration-1000 ease-in-out"
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
            className={cn(
              "col-start-1 row-start-1 block w-full h-auto max-w-full z-10 cursor-crosshair transition-all duration-1000 ease-in-out",
              gameActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            style={{ 
              minWidth: deviceType === "desktop" ? svgWidth + 48 : undefined,
              aspectRatio: `${svgWidth + 48} / ${svgHeight + 8 + (gameActive ? 80 : 0)}` 
            }}
          />
          </div>
        </div>
        </div>

        {/* custom tooltip — rendered OUTSIDE the scroll container to avoid clipping */}
        {(() => {
          const count = tooltip.count ?? 0;
          const formattedDate = formatTooltipDate(tooltip.date);
          const tooltipText = tooltip.label
            ? `${tooltip.label} on ${formattedDate}.`
            : count === 0
              ? `No contributions on ${formattedDate}.`
              : `${count} contribution${count !== 1 ? "s" : ""} on ${formattedDate}.`;

          return (
            <div
              className={cn(
                "pointer-events-none fixed z-50 rounded bg-[#24292e] dark:bg-[#161b22] px-2.5 py-1 text-[11px] font-medium text-white shadow-md border border-neutral-700/30 whitespace-nowrap transition-all duration-200",
                tooltip.visible ? "opacity-100 visible" : "opacity-0 invisible"
              )}
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: `translate(-50%, calc(-100% - ${tooltip.visible ? '6px' : '2px'})) scale(${tooltip.visible ? 1 : 0.95})`,
              }}
            >
              {tooltip.date ? tooltipText : ""}
              {/* Small arrow pointing down */}
              <div
                className="absolute bg-[#24292e] dark:bg-[#161b22] border-r border-b border-neutral-700/30"
                style={{
                  width: 6,
                  height: 6,
                  left: "50%",
                  bottom: 0,
                  transform: "translateX(-50%) translateY(50%) rotate(45deg)",
                }}
              />
            </div>
          );
        })()}

        <div className="relative w-full h-0 mt-4 mb-7">
          <div 
            className="absolute left-[-100vw] right-[-100vw] top-0 h-0 border-b border-black/30 dark:border-white/[0.15]" 
            style={{ 
              maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', 
              WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' 
            }} 
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-3">
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
              <div className="flex items-center gap-2 border-l border-neutral-300 dark:border-neutral-800 pl-4">
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 select-none">Game Mode</span>
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
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-none",
                    gameActive ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-800",
                    (animationPhase === "animating" || animationPhase === "fading") && "opacity-75 cursor-not-allowed",
                    shakeError && "ring-2 ring-red-500 ring-offset-1 dark:ring-offset-black translate-x-[2px]"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      gameActive ? "translate-x-4" : "translate-x-0"
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
                <span className="font-semibold text-black dark:text-neutral-200 underline decoration-neutral-400 dark:decoration-neutral-400 underline-offset-4">
                  GitHub
                </span>
              </a>
            </div>
          )}
        </div>
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
