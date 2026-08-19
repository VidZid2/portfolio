"use client";

import React from "react";

interface Point2D {
  x: number;
  y: number;
}

function toSvgPath(pts: Point2D[]): string {
  if (pts.length === 0) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
}

// Generate rounded equilateral triangle vertices in (U, V) screen plane
function getRoundedTriangle2D(cx: number, cy: number, radius: number, cornerR: number, numPtsPerCorner = 8): Point2D[] {
  // 3 sharp vertices of an equilateral triangle pointing straight UP (flat base at bottom)
  const sharpVerts: Point2D[] = [
    { x: cx, y: cy - radius },                                      // Top Apex
    { x: cx - radius * (Math.sqrt(3) / 2), y: cy + radius * 0.5 },   // Bottom Left
    { x: cx + radius * (Math.sqrt(3) / 2), y: cy + radius * 0.5 },   // Bottom Right
  ];

  const pts: Point2D[] = [];

  for (let i = 0; i < 3; i++) {
    const prev = sharpVerts[(i + 2) % 3];
    const curr = sharpVerts[i];
    const next = sharpVerts[(i + 1) % 3];

    // Unit vectors to adjacent vertices
    const vPrev = { x: prev.x - curr.x, y: prev.y - curr.y };
    const lenPrev = Math.hypot(vPrev.x, vPrev.y);
    const uPrev = { x: vPrev.x / lenPrev, y: vPrev.y / lenPrev };

    const vNext = { x: next.x - curr.x, y: next.y - curr.y };
    const lenNext = Math.hypot(vNext.x, vNext.y);
    const uNext = { x: vNext.x / lenNext, y: vNext.y / lenNext };

    // Inset points along edges for corner filleting
    const pStart = { x: curr.x + uPrev.x * cornerR, y: curr.y + uPrev.y * cornerR };
    const pEnd = { x: curr.x + uNext.x * cornerR, y: curr.y + uNext.y * cornerR };

    // Smooth quadratic curve around rounded corner
    for (let s = 0; s <= numPtsPerCorner; s++) {
      const t = s / numPtsPerCorner;
      const bx = (1 - t) * (1 - t) * pStart.x + 2 * (1 - t) * t * curr.x + t * t * pEnd.x;
      const by = (1 - t) * (1 - t) * pStart.y + 2 * (1 - t) * t * curr.y + t * t * pEnd.y;
      pts.push({ x: bx, y: by });
    }
  }

  return pts;
}

export function IsometricBlueprint({ className = "" }: { className?: string }) {
  // Center origin in 700x230 viewBox
  const ox = 340;
  const oy = 118;
  const H = 14; // Extrusion height for 3D depth

  // 3 Pods Dimensions in (U, V)
  const podRadius = 42;
  const cornerRadius = 14;
  const clusterOffset = 46;

  // 3 Pod Centers (Triforce Delta formation matching Picture 2)
  const podCenters: Point2D[] = [
    { x: 0, y: -clusterOffset * 0.95 },                                         // 1. Top Pod
    { x: -clusterOffset * (Math.sqrt(3) / 2), y: clusterOffset * 0.55 },        // 2. Bottom-Left Pod
    { x: clusterOffset * (Math.sqrt(3) / 2), y: clusterOffset * 0.55 },         // 3. Bottom-Right Pod
  ];

  // Map 2D (U, V) to isometric slanted screen coordinates
  // Slanted slightly along 30-deg isometric plane:
  const mapIso = (u: number, v: number, z: number): Point2D => {
    return {
      x: ox + u,
      y: oy + v * 0.85 - z, // 0.85 compression for realistic axonometric perspective
    };
  };

  const pods = podCenters.map((c, podIdx) => {
    const raw2D = getRoundedTriangle2D(c.x, c.y, podRadius, cornerRadius, 8);

    const topPts = raw2D.map((pt) => mapIso(pt.x, pt.y, H));
    const botPts = raw2D.map((pt) => mapIso(pt.x, pt.y, 0));

    // Side extrusion wall quads
    const sideQuads: Point2D[][] = [];
    for (let i = 0; i < topPts.length; i++) {
      const next = (i + 1) % topPts.length;
      sideQuads.push([topPts[i], topPts[next], botPts[next], botPts[i]]);
    }

    return {
      id: podIdx,
      topPath: toSvgPath(topPts),
      botPath: toSvgPath(botPts),
      sideQuads: sideQuads.map(toSvgPath),
      depth: c.y,
    };
  });

  // Sort pods back-to-front for proper depth occlusion
  pods.sort((a, b) => a.depth - b.depth);

  // ----------------------------------------------------
  // ISOMETRIC CONSTRUCTION GUIDELINES (Dashed)
  // ----------------------------------------------------
  const g1_start = mapIso(-240, -clusterOffset * 0.95, 0);
  const g1_end = mapIso(240, -clusterOffset * 0.95, 0);

  const g2_start = mapIso(-240, clusterOffset * 0.55, 0);
  const g2_end = mapIso(240, clusterOffset * 0.55, 0);

  const g3_start = mapIso(0, -110, 0);
  const g3_end = mapIso(0, 110, 0);

  const g4_start = mapIso(-clusterOffset * (Math.sqrt(3) / 2), -100, 0);
  const g4_end = mapIso(-clusterOffset * (Math.sqrt(3) / 2), 100, 0);

  const g5_start = mapIso(clusterOffset * (Math.sqrt(3) / 2), -100, 0);
  const g5_end = mapIso(clusterOffset * (Math.sqrt(3) / 2), 100, 0);

  // Diagonal 30-deg / 150-deg symmetry lines passing through the cluster
  const diagL_start = mapIso(-180, -180 * (1 / Math.sqrt(3)), 0);
  const diagL_end = mapIso(180, 180 * (1 / Math.sqrt(3)), 0);

  const diagR_start = mapIso(180, -180 * (1 / Math.sqrt(3)), 0);
  const diagR_end = mapIso(-180, 180 * (1 / Math.sqrt(3)), 0);

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
            <line x1="0" y1="0" x2="0" y2="6" stroke="#52525b" strokeWidth="0.85" opacity="0.32" />
          </pattern>

          {/* Dark Mode 45-degree Technical Blueprint Hatch Pattern */}
          <pattern
            id="iso-hatch-dark"
            width="6"
            height="6"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="6" stroke="#cbd5e1" strokeWidth="0.85" opacity="0.38" />
          </pattern>
        </defs>

        {/* 1. Isometric Faint Dashed Construction Grid Lines */}
        <g className="stroke-zinc-300/60 dark:stroke-zinc-800/80" strokeWidth="0.75" strokeDasharray="3 3">
          <line x1={g1_start.x} y1={g1_start.y} x2={g1_end.x} y2={g1_end.y} />
          <line x1={g2_start.x} y1={g2_start.y} x2={g2_end.x} y2={g2_end.y} />
          <line x1={g3_start.x} y1={g3_start.y} x2={g3_end.x} y2={g3_end.y} />
          <line x1={g4_start.x} y1={g4_start.y} x2={g4_end.x} y2={g4_end.y} />
          <line x1={g5_start.x} y1={g5_start.y} x2={g5_end.x} y2={g5_end.y} />
          <line x1={diagL_start.x} y1={diagL_start.y} x2={diagL_end.x} y2={diagL_end.y} />
          <line x1={diagR_start.x} y1={diagR_start.y} x2={diagR_end.x} y2={diagR_end.y} />
        </g>

        {/* 2. Render Each of the 3 Extruded Rounded-Triangle Pods */}
        {pods.map((pod) => (
          <g key={pod.id}>
            {/* Base Drop Outline */}
            <path d={pod.botPath} className="fill-white dark:fill-[#0a0a0c] stroke-zinc-400/40 dark:stroke-zinc-600/40" strokeWidth="0.8" />

            {/* Extruded Side Walls */}
            <g className="stroke-zinc-600 dark:stroke-zinc-400 fill-white dark:fill-[#0a0a0c]" strokeWidth="1.1" strokeLinejoin="round">
              {pod.sideQuads.map((d, qIdx) => (
                <path key={qIdx} d={d} />
              ))}
            </g>

            {/* Top Surface Face (Opaque background + 45-degree Technical Hatching) */}
            <path d={pod.topPath} className="fill-white dark:fill-[#0a0a0c]" />
            <path
              d={pod.topPath}
              className="fill-[url(#iso-hatch-light)] dark:fill-[url(#iso-hatch-dark)] stroke-zinc-600 dark:stroke-zinc-400"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
          </g>
        ))}

        {/* 3. "Fig. 1." Technical Blueprint Caption */}
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
