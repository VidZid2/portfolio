"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { playSoftClick } from "@/lib/synth-sounds";

// 3D Isometric Projection Helper
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

function getRoundedTriangle3D(
  cx: number,
  cy: number,
  z: number,
  radius: number,
  cornerR: number,
  angleOffset = -Math.PI / 2,
  numPts = 8
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let curTiltX = 0;
    let curTiltY = 0;
    let clickPulse = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const y = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      targetTiltX = y * 0.08;
      targetTiltY = x * 0.1;
    };

    const handlePointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
    };

    const handleClick = () => {
      clickPulse = 1.0;
      playSoftClick(0.04);
    };

    window.addEventListener("mousemove", handlePointerMove);
    document.addEventListener("mouseleave", handlePointerLeave);
    canvas.addEventListener("click", handleClick);

    const render = () => {
      if (!running) return;

      curTiltX += (targetTiltX - curTiltX) * 0.08;
      curTiltY += (targetTiltY - curTiltY) * 0.08;
      clickPulse *= 0.88;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 720;
      const h = canvas.clientHeight || 220;

      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const isDark = themeRef.current === "dark";
      const strokeColor = isDark ? "rgba(226, 232, 240, 0.48)" : "rgba(51, 65, 85, 0.58)";
      const hatchColor = isDark ? "rgba(226, 232, 240, 0.22)" : "rgba(51, 65, 85, 0.25)";
      const faceBgColor = isDark ? "rgba(8, 8, 10, 0.94)" : "rgba(255, 255, 255, 0.94)";
      const gridColor = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)";

      // Isometric Canvas Center & Scaling (grand, balanced composition across banner)
      const centerX = w * 0.48;
      const centerY = h * 0.54;
      const baseScale = Math.min(w * 0.1, h * 0.38, 45);
      const scale = baseScale * (1 + clickPulse * 0.03);

      const isoAngle = Math.PI / 6 + curTiltY * 0.3;
      const cosA = Math.cos(isoAngle);
      const sinA = Math.sin(isoAngle);
      const pitch = 0.58 + curTiltX * 0.3;

      const project = (pt: Point3D): Point2D & { depth: number } => {
        const px = centerX + (pt.x - pt.y) * cosA * scale;
        const py = centerY + (pt.x + pt.y) * sinA * scale * pitch - pt.z * scale * 1.1;
        return { x: px, y: py, depth: (pt.x + pt.y) * 10 + pt.z * 2 };
      };

      // 1. Draw Subtle Isometric Construction Guidelines (spanning full banner width)
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.85;
      ctx.setLineDash([3, 4]);

      for (let g = -8; g <= 8; g += 2.0) {
        const p1 = project({ x: -7, y: g, z: 0 });
        const p2 = project({ x: 7, y: g, z: 0 });
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project({ x: g, y: -7, z: 0 });
        const p4 = project({ x: g, y: 7, z: 0 });
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // -----------------------------------------------------------------
      // 2. BUILD 3-TRIANGLE ARCHITECTURAL BLUEPRINT PODS (SYNC LOGO FORMATION)
      // -----------------------------------------------------------------
      interface RenderFace {
        pts: (Point2D & { depth: number })[];
        depth: number;
        hatched?: boolean;
      }

      const faces: RenderFace[] = [];

      const addPolygon = (poly3D: Point3D[], hatched = false, depthBias = 0) => {
        const pts = poly3D.map(project);
        const avgDepth = pts.reduce((sum, p) => sum + p.depth, 0) / pts.length + depthBias;
        faces.push({ pts, depth: avgDepth, hatched });
      };

      const addExtrudedPrism = (
        cx: number,
        cy: number,
        radius: number,
        cornerR: number,
        h: number,
        hatched = true,
        angleOffset = -Math.PI / 2
      ) => {
        const top3D = getRoundedTriangle3D(cx, cy, h, radius, cornerR, angleOffset);
        const bot3D = getRoundedTriangle3D(cx, cy, 0, radius, cornerR, angleOffset);

        // Side walls
        for (let i = 0; i < top3D.length; i++) {
          const next = (i + 1) % top3D.length;
          addPolygon([top3D[i], top3D[next], bot3D[next], bot3D[i]], false, 0);
        }

        // Top face
        addPolygon(top3D, hatched, 4);
      };

      // Pod 1: Left Triangular Block (Matching Left Group in Picture 2)
      addExtrudedPrism(-2.2, 0.4, 1.45, 0.45, 0.42, true);

      // Pod 2: Top/Center Raised Courtyard Structure (with recessed inner hole!)
      const topCourtyardOuter = getRoundedTriangle3D(0.6, -1.6, 0.52, 2.35, 0.6, -Math.PI / 2);
      const botCourtyardOuter = getRoundedTriangle3D(0.6, -1.6, 0.0, 2.35, 0.6, -Math.PI / 2);
      const topCourtyardInner = getRoundedTriangle3D(0.6, -1.6, 0.52, 1.1, 0.3, -Math.PI / 2);
      const botCourtyardInner = getRoundedTriangle3D(0.6, -1.6, 0.0, 1.1, 0.3, -Math.PI / 2);

      // Outer side walls of Pod 2
      for (let i = 0; i < topCourtyardOuter.length; i++) {
        const next = (i + 1) % topCourtyardOuter.length;
        addPolygon([topCourtyardOuter[i], topCourtyardOuter[next], botCourtyardOuter[next], botCourtyardOuter[i]], false, 0);
      }

      // Inner courtyard recessed walls
      for (let i = 0; i < topCourtyardInner.length; i++) {
        const next = (i + 1) % topCourtyardInner.length;
        addPolygon([topCourtyardInner[i], topCourtyardInner[next], botCourtyardInner[next], botCourtyardInner[i]], false, 2);
      }

      // Inner floor
      addPolygon(botCourtyardInner, false, 1);

      // Top Ring Face (Hatched outer)
      addPolygon(topCourtyardOuter, true, 3);

      // Inner courtyard knockout polygon (removes hatching in the center to reveal the sunken floor)
      addPolygon(topCourtyardInner, false, 4);

      // Pod 3: Right Extended Stepped Platform
      addExtrudedPrism(2.5, 1.0, 1.45, 0.45, 0.42, true);

      // Painter's Algorithm: Sort faces back to front
      faces.sort((a, b) => a.depth - b.depth);

      // 3. Render Sorted Faces
      faces.forEach((f) => {
        if (f.pts.length < 3) return;

        ctx.beginPath();
        ctx.moveTo(f.pts[0].x, f.pts[0].y);
        for (let i = 1; i < f.pts.length; i++) {
          ctx.lineTo(f.pts[i].x, f.pts[i].y);
        }
        ctx.closePath();

        // Opaque face fill to occlude background/rear lines
        ctx.fillStyle = faceBgColor;
        ctx.fill();

        // 45-degree Technical Blueprint Hatching on top surfaces
        if (f.hatched) {
          ctx.save();
          ctx.clip();
          ctx.strokeStyle = hatchColor;
          ctx.lineWidth = 0.9;

          let minX = f.pts[0].x,
            maxX = f.pts[0].x,
            minY = f.pts[0].y,
            maxY = f.pts[0].y;
          f.pts.forEach((p) => {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
          });

          const step = 5;
          const diagLen = maxX - minX + (maxY - minY);
          for (let d = -diagLen; d <= diagLen; d += step) {
            ctx.beginPath();
            ctx.moveTo(minX + d, minY - 10);
            ctx.lineTo(minX + d + (maxY - minY + 20), maxY + 10);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Crisp wireframe outline
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.15;
        ctx.stroke();
      });

      // 4. "Fig. 1." Blueprint Caption (Bottom-Left corner for clear visibility)
      ctx.font = '500 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';
      ctx.fillStyle = isDark ? "rgba(148, 163, 184, 0.6)" : "rgba(100, 116, 139, 0.7)";
      ctx.textAlign = "left";
      ctx.fillText("Fig. 1.", 24, h - 14);

      ctx.restore();

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, [resolvedTheme]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none cursor-pointer ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-auto" />
    </div>
  );
}
