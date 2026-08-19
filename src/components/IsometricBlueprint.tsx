"use client";

import React from "react";

// Isometric 3D -> 2D projection
// theta = 30 deg (0.5235987756 rad)
const COS30 = 0.86602540378;
const SIN30 = 0.5;

function pt(x: number, y: number, z: number, ox: number, oy: number, u: number): string {
  const px = ox + (x - y) * COS30 * u;
  const py = oy + (x + y) * SIN30 * u - z;
  return `${px.toFixed(1)},${py.toFixed(1)}`;
}

function p(x: number, y: number, z: number, ox: number, oy: number, u: number): { x: number; y: number } {
  return {
    x: ox + (x - y) * COS30 * u,
    y: oy + (x + y) * SIN30 * u - z,
  };
}

export function IsometricBlueprint({ className = "" }: { className?: string }) {
  // Base origin and scale tuned for a 720x240 viewBox
  const ox = 320;
  const oy = 115;
  const u = 32;
  const H1 = 14; // Left blocks height
  const H2 = 18; // Right platform height

  // ----------------------------------------------------
  // 1. LEFT C-BRACKET (3 Rectangular Extrusions)
  // ----------------------------------------------------
  // Block A (Top-Left arm): x in [-3.6, -2.4], y in [0.0, 1.8]
  // Block B (Corner):       x in [-3.6, -2.4], y in [-1.4, 0.0]
  // Block C (Bottom-Right): x in [-2.4, -0.6], y in [-1.4, 0.0]

  // Top faces (z = H1)
  const topA = `${pt(-3.6, 0.0, H1, ox, oy, u)} ${pt(-2.4, 0.0, H1, ox, oy, u)} ${pt(-2.4, 1.8, H1, ox, oy, u)} ${pt(-3.6, 1.8, H1, ox, oy, u)}`;
  const topB = `${pt(-3.6, -1.4, H1, ox, oy, u)} ${pt(-2.4, -1.4, H1, ox, oy, u)} ${pt(-2.4, 0.0, H1, ox, oy, u)} ${pt(-3.6, 0.0, H1, ox, oy, u)}`;
  const topC = `${pt(-2.4, -1.4, H1, ox, oy, u)} ${pt(-0.6, -1.4, H1, ox, oy, u)} ${pt(-0.6, 0.0, H1, ox, oy, u)} ${pt(-2.4, 0.0, H1, ox, oy, u)}`;

  // Vertical visible side walls for Left group:
  // Block A right wall (x = -2.4, y in [0, 1.8])
  const wallA_right = `${pt(-2.4, 0.0, H1, ox, oy, u)} ${pt(-2.4, 1.8, H1, ox, oy, u)} ${pt(-2.4, 1.8, 0, ox, oy, u)} ${pt(-2.4, 0.0, 0, ox, oy, u)}`;
  // Block A top wall (y = 1.8, x in [-3.6, -2.4])
  const wallA_top = `${pt(-3.6, 1.8, H1, ox, oy, u)} ${pt(-2.4, 1.8, H1, ox, oy, u)} ${pt(-2.4, 1.8, 0, ox, oy, u)} ${pt(-3.6, 1.8, 0, ox, oy, u)}`;
  // Block A left wall (x = -3.6, y in [0, 1.8])
  const wallA_left = `${pt(-3.6, 0.0, H1, ox, oy, u)} ${pt(-3.6, 1.8, H1, ox, oy, u)} ${pt(-3.6, 1.8, 0, ox, oy, u)} ${pt(-3.6, 0.0, 0, ox, oy, u)}`;

  // Block B left wall (x = -3.6, y in [-1.4, 0])
  const wallB_left = `${pt(-3.6, -1.4, H1, ox, oy, u)} ${pt(-3.6, 0.0, H1, ox, oy, u)} ${pt(-3.6, 0.0, 0, ox, oy, u)} ${pt(-3.6, -1.4, 0, ox, oy, u)}`;
  // Block B front wall (y = -1.4, x in [-3.6, -2.4])
  const wallB_front = `${pt(-3.6, -1.4, H1, ox, oy, u)} ${pt(-2.4, -1.4, H1, ox, oy, u)} ${pt(-2.4, -1.4, 0, ox, oy, u)} ${pt(-3.6, -1.4, 0, ox, oy, u)}`;

  // Block C front wall (y = -1.4, x in [-2.4, -0.6])
  const wallC_front = `${pt(-2.4, -1.4, H1, ox, oy, u)} ${pt(-0.6, -1.4, H1, ox, oy, u)} ${pt(-0.6, -1.4, 0, ox, oy, u)} ${pt(-2.4, -1.4, 0, ox, oy, u)}`;
  // Block C right wall (x = -0.6, y in [-1.4, 0.0])
  const wallC_right = `${pt(-0.6, -1.4, H1, ox, oy, u)} ${pt(-0.6, 0.0, H1, ox, oy, u)} ${pt(-0.6, 0.0, 0, ox, oy, u)} ${pt(-0.6, -1.4, 0, ox, oy, u)}`;
  // Block C back inner wall (y = 0.0, x in [-2.4, -0.6])
  const wallC_back = `${pt(-2.4, 0.0, H1, ox, oy, u)} ${pt(-0.6, 0.0, H1, ox, oy, u)} ${pt(-0.6, 0.0, 0, ox, oy, u)} ${pt(-2.4, 0.0, 0, ox, oy, u)}`;

  // ----------------------------------------------------
  // 2. RIGHT COURTYARD COMPLEX
  // ----------------------------------------------------
  // Outer boundary: x in [0.8, 4.4], y in [-0.4, 3.2], z = H2
  // Inner courtyard hole: x in [1.8, 3.4], y in [0.6, 2.2], depth = H2 (down to 0)

  // Outer front wall (y = -0.4, x in [0.8, 4.4])
  const plat_front = `${pt(0.8, -0.4, H2, ox, oy, u)} ${pt(4.4, -0.4, H2, ox, oy, u)} ${pt(4.4, -0.4, 0, ox, oy, u)} ${pt(0.8, -0.4, 0, ox, oy, u)}`;
  // Outer left wall (x = 0.8, y in [-0.4, 3.2])
  const plat_left = `${pt(0.8, -0.4, H2, ox, oy, u)} ${pt(0.8, 3.2, H2, ox, oy, u)} ${pt(0.8, 3.2, 0, ox, oy, u)} ${pt(0.8, -0.4, 0, ox, oy, u)}`;
  // Outer right wall (x = 4.4, y in [-0.4, 3.2])
  const plat_right = `${pt(4.4, -0.4, H2, ox, oy, u)} ${pt(4.4, 3.2, H2, ox, oy, u)} ${pt(4.4, 3.2, 0, ox, oy, u)} ${pt(4.4, -0.4, 0, ox, oy, u)}`;

  // Courtyard Top 4 Ring Slabs (Hatched)
  // Front slab: x in [0.8, 4.4], y in [-0.4, 0.6]
  const ring_front = `${pt(0.8, -0.4, H2, ox, oy, u)} ${pt(4.4, -0.4, H2, ox, oy, u)} ${pt(4.4, 0.6, H2, ox, oy, u)} ${pt(0.8, 0.6, H2, ox, oy, u)}`;
  // Back slab: x in [0.8, 4.4], y in [2.2, 3.2]
  const ring_back = `${pt(0.8, 2.2, H2, ox, oy, u)} ${pt(4.4, 2.2, H2, ox, oy, u)} ${pt(4.4, 3.2, H2, ox, oy, u)} ${pt(0.8, 3.2, H2, ox, oy, u)}`;
  // Left slab: x in [0.8, 1.8], y in [0.6, 2.2]
  const ring_left = `${pt(0.8, 0.6, H2, ox, oy, u)} ${pt(1.8, 0.6, H2, ox, oy, u)} ${pt(1.8, 2.2, H2, ox, oy, u)} ${pt(0.8, 2.2, H2, ox, oy, u)}`;
  // Right slab: x in [3.4, 4.4], y in [0.6, 2.2]
  const ring_right = `${pt(3.4, 0.6, H2, ox, oy, u)} ${pt(4.4, 0.6, H2, ox, oy, u)} ${pt(4.4, 2.2, H2, ox, oy, u)} ${pt(3.4, 2.2, H2, ox, oy, u)}`;

  // Inner Courtyard Recessed Visible Walls:
  // Inside Left Wall (facing right): along x = 1.8, y in [0.6, 2.2], from z = H2 down to z = 0
  const inner_left = `${pt(1.8, 0.6, H2, ox, oy, u)} ${pt(1.8, 2.2, H2, ox, oy, u)} ${pt(1.8, 2.2, 0, ox, oy, u)} ${pt(1.8, 0.6, 0, ox, oy, u)}`;
  // Inside Back Wall (facing front): along y = 2.2, x in [1.8, 3.4], from z = H2 down to z = 0
  const inner_back = `${pt(1.8, 2.2, H2, ox, oy, u)} ${pt(3.4, 2.2, H2, ox, oy, u)} ${pt(3.4, 2.2, 0, ox, oy, u)} ${pt(1.8, 2.2, 0, ox, oy, u)}`;
  // Inside Courtyard Floor (z = 0)
  const inner_floor = `${pt(1.8, 0.6, 0, ox, oy, u)} ${pt(3.4, 0.6, 0, ox, oy, u)} ${pt(3.4, 2.2, 0, ox, oy, u)} ${pt(1.8, 2.2, 0, ox, oy, u)}`;

  // ----------------------------------------------------
  // 3. ATTACHED REAR STEP WING
  // ----------------------------------------------------
  // Positioned at x in [2.6, 4.4], y in [3.2, 4.6], z in [0, H2]
  const step_top = `${pt(2.6, 3.2, H2, ox, oy, u)} ${pt(4.4, 3.2, H2, ox, oy, u)} ${pt(4.4, 4.6, H2, ox, oy, u)} ${pt(2.6, 4.6, H2, ox, oy, u)}`;
  const step_right = `${pt(4.4, 3.2, H2, ox, oy, u)} ${pt(4.4, 4.6, H2, ox, oy, u)} ${pt(4.4, 4.6, 0, ox, oy, u)} ${pt(4.4, 3.2, 0, ox, oy, u)}`;
  const step_back = `${pt(2.6, 4.6, H2, ox, oy, u)} ${pt(4.4, 4.6, H2, ox, oy, u)} ${pt(4.4, 4.6, 0, ox, oy, u)} ${pt(2.6, 4.6, 0, ox, oy, u)}`;

  // ----------------------------------------------------
  // 4. ISOMETRIC CONSTRUCTION GUIDELINES (Dashed)
  // ----------------------------------------------------
  const guide1_start = p(-5.5, -1.4, 0, ox, oy, u);
  const guide1_end = p(6.5, -1.4, 0, ox, oy, u);

  const guide2_start = p(-3.6, -3.0, 0, ox, oy, u);
  const guide2_end = p(-3.6, 5.0, 0, ox, oy, u);

  const guide3_start = p(0.8, -2.5, 0, ox, oy, u);
  const guide3_end = p(0.8, 5.5, 0, ox, oy, u);

  const guide4_start = p(-5.0, 3.2, 0, ox, oy, u);
  const guide4_end = p(6.0, 3.2, 0, ox, oy, u);

  const guide5_start = p(4.4, -2.5, 0, ox, oy, u);
  const guide5_end = p(4.4, 6.0, 0, ox, oy, u);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none flex items-center justify-center ${className}`}>
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
          <line x1={guide1_start.x} y1={guide1_start.y} x2={guide1_end.x} y2={guide1_end.y} />
          <line x1={guide2_start.x} y1={guide2_start.y} x2={guide2_end.x} y2={guide2_end.y} />
          <line x1={guide3_start.x} y1={guide3_start.y} x2={guide3_end.x} y2={guide3_end.y} />
          <line x1={guide4_start.x} y1={guide4_start.y} x2={guide4_end.x} y2={guide4_end.y} />
          <line x1={guide5_start.x} y1={guide5_start.y} x2={guide5_end.x} y2={guide5_end.y} />
        </g>

        {/* --------------------------------------------- */}
        {/* 2. REAR STEP WING */}
        {/* --------------------------------------------- */}
        <g className="stroke-zinc-600 dark:stroke-zinc-400 fill-white dark:fill-[#0a0a0c]" strokeWidth="1.1" strokeLinejoin="round">
          <polygon points={step_back} />
          <polygon points={step_right} />
        </g>
        {/* Rear Step Top Hatch */}
        <polygon points={step_top} className="fill-white dark:fill-[#0a0a0c]" />
        <polygon points={step_top} className="fill-[url(#iso-hatch-light)] dark:fill-[url(#iso-hatch-dark)] stroke-zinc-600 dark:stroke-zinc-400" strokeWidth="1.1" strokeLinejoin="round" />

        {/* --------------------------------------------- */}
        {/* 3. RIGHT COURTYARD COMPLEX */}
        {/* --------------------------------------------- */}
        {/* Outer Solid Side Walls */}
        <g className="stroke-zinc-600 dark:stroke-zinc-400 fill-white dark:fill-[#0a0a0c]" strokeWidth="1.1" strokeLinejoin="round">
          <polygon points={plat_left} />
          <polygon points={plat_front} />
          <polygon points={plat_right} />
        </g>

        {/* Inner Courtyard Floor */}
        <polygon points={inner_floor} className="fill-white dark:fill-[#0a0a0c] stroke-zinc-400/40 dark:stroke-zinc-600/40" strokeWidth="0.8" strokeLinejoin="round" />

        {/* Inner Courtyard Recessed Walls */}
        <g className="stroke-zinc-600 dark:stroke-zinc-400 fill-white dark:fill-[#0a0a0c]" strokeWidth="1.1" strokeLinejoin="round">
          <polygon points={inner_back} />
          <polygon points={inner_left} />
        </g>

        {/* Courtyard 4 Top Ring Slabs (Hatched) */}
        <g className="fill-white dark:fill-[#0a0a0c]">
          <polygon points={ring_front} />
          <polygon points={ring_back} />
          <polygon points={ring_left} />
          <polygon points={ring_right} />
        </g>
        <g className="fill-[url(#iso-hatch-light)] dark:fill-[url(#iso-hatch-dark)] stroke-zinc-600 dark:stroke-zinc-400" strokeWidth="1.1" strokeLinejoin="round">
          <polygon points={ring_front} />
          <polygon points={ring_back} />
          <polygon points={ring_left} />
          <polygon points={ring_right} />
        </g>

        {/* --------------------------------------------- */}
        {/* 4. LEFT C-BRACKET (3 BLOCKS) */}
        {/* --------------------------------------------- */}
        {/* Side Walls */}
        <g className="stroke-zinc-600 dark:stroke-zinc-400 fill-white dark:fill-[#0a0a0c]" strokeWidth="1.1" strokeLinejoin="round">
          {/* Block A */}
          <polygon points={wallA_left} />
          <polygon points={wallA_top} />
          <polygon points={wallA_right} />

          {/* Block B */}
          <polygon points={wallB_left} />
          <polygon points={wallB_front} />

          {/* Block C */}
          <polygon points={wallC_front} />
          <polygon points={wallC_right} />
          <polygon points={wallC_back} />
        </g>

        {/* Top Faces with 45-degree Technical Hatching */}
        <g className="fill-white dark:fill-[#0a0a0c]">
          <polygon points={topA} />
          <polygon points={topB} />
          <polygon points={topC} />
        </g>
        <g className="fill-[url(#iso-hatch-light)] dark:fill-[url(#iso-hatch-dark)] stroke-zinc-600 dark:stroke-zinc-400" strokeWidth="1.1" strokeLinejoin="round">
          <polygon points={topA} />
          <polygon points={topB} />
          <polygon points={topC} />
        </g>

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
