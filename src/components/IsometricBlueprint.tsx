"use client";

import React from "react";

// Isometric Projection Math
// theta = 30 deg
const COS30 = 0.86602540378;
const SIN30 = 0.5;

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point2D {
  x: number;
  y: number;
}

const ox = 330;
const oy = 105;
const u = 32;

function project(x: number, y: number, z: number): Point2D {
  return {
    x: ox + (x - y) * COS30 * u,
    y: oy + (x + y) * SIN30 * u - z,
  };
}

function toSvgPath(pts: Point2D[]): string {
  if (pts.length === 0) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
}

// Generate rounded triangle vertices in 3D (X, Y plane)
function getRoundedTriangle3D(
  cx: number,
  cy: number,
  z: number,
  radius: number,
  cornerR: number,
  angleOffset = -Math.PI / 2,
  numPts = 6
): Point3D[] {
  const angles = [
    angleOffset,
    angleOffset + (2 * Math.PI) / 3,
    angleOffset + (4 * Math.PI) / 3,
  ];

  const sharpVerts = angles.map((a) => ({
    x: cx + radius * Math.cos(a),
    y: cy + radius * Math.sin(a),
  }));

  const pts: Point3D[] = [];

  for (let i = 0; i < 3; i++) {
    const prev = sharpVerts[(i + 2) % 3];
    const curr = sharpVerts[i];
    const next = sharpVerts[(i + 1) % 3];

    const vPrev = { x: prev.x - curr.x, y: prev.y - curr.y };
    const lenPrev = Math.hypot(vPrev.x, vPrev.y);
    const uPrev = { x: vPrev.x / lenPrev, y: vPrev.y / lenPrev };

    const vNext = { x: next.x - curr.x, y: next.y - curr.y };
    const lenNext = Math.hypot(vNext.x, vNext.y);
    const uNext = { x: vNext.x / lenNext, y: vNext.y / lenNext };

    const pStart = { x: curr.x + uPrev.x * cornerR, y: curr.y + uPrev.y * cornerR };
    const pEnd = { x: curr.x + uNext.x * cornerR, y: curr.y + uNext.y * cornerR };

    for (let s = 0; s <= numPts; s++) {
      const t = s / numPts;
      const bx = (1 - t) * (1 - t) * pStart.x + 2 * (1 - t) * t * curr.x + t * t * pEnd.x;
      const by = (1 - t) * (1 - t) * pStart.y + 2 * (1 - t) * t * curr.y + t * t * pEnd.y;
      pts.push({ x: bx, y: by, z });
    }
  }

  return pts;
}

export function IsometricBlueprint({ className = "" }: { className?: string }) {
  // -----------------------------------------------------------------
  // 1. MODULE 1: LOWER-LEFT TRIANGULAR BLOCK (Pod A)
  // -----------------------------------------------------------------
  const H1 = 15;
  const podA_top = getRoundedTriangle3D(-2.2, 2.6, H1, 1.4, 0.45, -Math.PI / 2).map((p) => project(p.x, p.y, p.z));
  const podA_bot = getRoundedTriangle3D(-2.2, 2.6, 0, 1.4, 0.45, -Math.PI / 2).map((p) => project(p.x, p.y, p.z));

  const podA_sideQuads: string[] = [];
  for (let i = 0; i < podA_top.length; i++) {
    const next = (i + 1) % podA_top.length;
    podA_sideQuads.push(toSvgPath([podA_top[i], podA_top[next], podA_bot[next], podA_bot[i]]));
  }

  // -----------------------------------------------------------------
  // 2. MODULE 2: MIDDLE/UPPER-RIGHT COURTYARD COMPLEX (Pod B)
  // -----------------------------------------------------------------
  const H2 = 18;
  const podB_outer_top = getRoundedTriangle3D(1.4, -1.6, H2, 2.4, 0.65, -Math.PI / 2).map((p) => project(p.x, p.y, p.z));
  const podB_outer_bot = getRoundedTriangle3D(1.4, -1.6, 0, 2.4, 0.65, -Math.PI / 2).map((p) => project(p.x, p.y, p.z));

  const podB_inner_top = getRoundedTriangle3D(1.4, -1.6, H2, 1.15, 0.35, -Math.PI / 2).map((p) => project(p.x, p.y, p.z));
  const podB_inner_bot = getRoundedTriangle3D(1.4, -1.6, 0, 1.15, 0.35, -Math.PI / 2).map((p) => project(p.x, p.y, p.z));

  const podB_outer_sides: string[] = [];
  for (let i = 0; i < podB_outer_top.length; i++) {
    const next = (i + 1) % podB_outer_top.length;
    podB_outer_sides.push(toSvgPath([podB_outer_top[i], podB_outer_top[next], podB_outer_bot[next], podB_outer_bot[i]]));
  }

  const podB_inner_sides: string[] = [];
  for (let i = 0; i < podB_inner_top.length; i++) {
    const next = (i + 1) % podB_inner_top.length;
    podB_inner_sides.push(toSvgPath([podB_inner_top[i], podB_inner_top[next], podB_inner_bot[next], podB_inner_bot[i]]));
  }

  // -----------------------------------------------------------------
  // 3. MODULE 3: UPPER-RIGHT STEPPED WING (Pod C)
  // -----------------------------------------------------------------
  const H3 = 15;
  const podC_top = getRoundedTriangle3D(3.2, -3.4, H3, 1.35, 0.42, -Math.PI / 2).map((p) => project(p.x, p.y, p.z));
  const podC_bot = getRoundedTriangle3D(3.2, -3.4, 0, 1.35, 0.42, -Math.PI / 2).map((p) => project(p.x, p.y, p.z));

  const podC_sideQuads: string[] = [];
  for (let i = 0; i < podC_top.length; i++) {
    const next = (i + 1) % podC_top.length;
    podC_sideQuads.push(toSvgPath([podC_top[i], podC_top[next], podC_bot[next], podC_bot[i]]));
  }

  // -----------------------------------------------------------------
  // 4. ISOMETRIC CONSTRUCTION GUIDELINES (Dashed)
  // -----------------------------------------------------------------
  const g1_start = project(-6.0, 2.6, 0);
  const g1_end = project(6.0, 2.6, 0);

  const g2_start = project(-6.0, -1.6, 0);
  const g2_end = project(6.0, -1.6, 0);

  const g3_start = project(-6.0, -3.4, 0);
  const g3_end = project(6.0, -3.4, 0);

  const g4_start = project(-2.2, -6.0, 0);
  const g4_end = project(-2.2, 6.0, 0);

  const g5_start = project(1.4, -6.0, 0);
  const g5_end = project(1.4, 6.0, 0);

  const g6_start = project(3.2, -6.0, 0);
  const g6_end = project(3.2, 6.0, 0);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none pointer-events-none flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 680 230"
        className="w-full h-full max-h-[220px]"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Light Mode 45-degree Technical Blueprint Hatch Pattern */}
          <pattern
            id="iso-hatch-light"
            width="6"
            height="6"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="6" stroke="#52525b" strokeWidth="0.85" opacity="0.35" />
          </pattern>

          {/* Dark Mode 45-degree Technical Blueprint Hatch Pattern */}
          <pattern
            id="iso-hatch-dark"
            width="6"
            height="6"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="6" stroke="#cbd5e1" strokeWidth="0.85" opacity="0.4" />
          </pattern>
        </defs>

        {/* 1. Isometric Faint Dashed Construction Lines */}
        <g className="stroke-zinc-300/60 dark:stroke-zinc-800/80" strokeWidth="0.8" strokeDasharray="3 3">
          <line x1={g1_start.x} y1={g1_start.y} x2={g1_end.x} y2={g1_end.y} />
          <line x1={g2_start.x} y1={g2_start.y} x2={g2_end.x} y2={g2_end.y} />
          <line x1={g3_start.x} y1={g3_start.y} x2={g3_end.x} y2={g3_end.y} />
          <line x1={g4_start.x} y1={g4_start.y} x2={g4_end.x} y2={g4_end.y} />
          <line x1={g5_start.x} y1={g5_start.y} x2={g5_end.x} y2={g5_end.y} />
          <line x1={g6_start.x} y1={g6_start.y} x2={g6_end.x} y2={g6_end.y} />
        </g>

        {/* --------------------------------------------- */}
        {/* 2. MODULE 3: UPPER-RIGHT WING (Backmost) */}
        {/* --------------------------------------------- */}
        <g className="stroke-zinc-600 dark:stroke-zinc-400 fill-white dark:fill-[#0a0a0c]" strokeWidth="1.1" strokeLinejoin="round">
          {podC_sideQuads.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <path d={toSvgPath(podC_top)} className="fill-white dark:fill-[#0a0a0c]" />
        <path
          d={toSvgPath(podC_top)}
          className="fill-[url(#iso-hatch-light)] dark:fill-[url(#iso-hatch-dark)] stroke-zinc-600 dark:stroke-zinc-400"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* --------------------------------------------- */}
        {/* 3. MODULE 2: MIDDLE/UPPER-RIGHT COURTYARD */}
        {/* --------------------------------------------- */}
        {/* Outer Side Walls */}
        <g className="stroke-zinc-600 dark:stroke-zinc-400 fill-white dark:fill-[#0a0a0c]" strokeWidth="1.1" strokeLinejoin="round">
          {podB_outer_sides.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* Inner Floor */}
        <path d={toSvgPath(podB_inner_bot)} className="fill-white dark:fill-[#0a0a0c] stroke-zinc-400/40 dark:stroke-zinc-600/40" strokeWidth="0.8" />

        {/* Inner Recessed Walls */}
        <g className="stroke-zinc-600 dark:stroke-zinc-400 fill-white dark:fill-[#0a0a0c]" strokeWidth="1.1" strokeLinejoin="round">
          {podB_inner_sides.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* Top Ring Face (Hatched outer) */}
        <path d={toSvgPath(podB_outer_top)} className="fill-white dark:fill-[#0a0a0c]" />
        <path
          d={toSvgPath(podB_outer_top)}
          className="fill-[url(#iso-hatch-light)] dark:fill-[url(#iso-hatch-dark)] stroke-zinc-600 dark:stroke-zinc-400"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* Knockout inner hole to reveal recessed courtyard floor */}
        <path d={toSvgPath(podB_inner_top)} className="fill-white dark:fill-[#0a0a0c] stroke-zinc-600 dark:stroke-zinc-400" strokeWidth="1.1" strokeLinejoin="round" />

        {/* --------------------------------------------- */}
        {/* 4. MODULE 1: LOWER-LEFT BLOCK (Frontmost) */}
        {/* --------------------------------------------- */}
        <g className="stroke-zinc-600 dark:stroke-zinc-400 fill-white dark:fill-[#0a0a0c]" strokeWidth="1.1" strokeLinejoin="round">
          {podA_sideQuads.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <path d={toSvgPath(podA_top)} className="fill-white dark:fill-[#0a0a0c]" />
        <path
          d={toSvgPath(podA_top)}
          className="fill-[url(#iso-hatch-light)] dark:fill-[url(#iso-hatch-dark)] stroke-zinc-600 dark:stroke-zinc-400"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* --------------------------------------------- */}
        {/* 5. "Fig. 1." TECHNICAL CAPTION */}
        {/* --------------------------------------------- */}
        <text
          x="650"
          y="214"
          textAnchor="end"
          className="fill-zinc-400 dark:fill-zinc-500 font-mono text-[11px] font-medium tracking-tight select-none"
        >
          Fig. 1.
        </text>
      </svg>
    </div>
  );
}
