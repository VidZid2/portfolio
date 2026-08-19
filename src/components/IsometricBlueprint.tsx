"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Box3D {
  x: number;
  y: number;
  z: number;
  w: number;
  l: number;
  h: number;
  hatched?: boolean;
}

const BOXES: Box3D[] = [
  // Left Cluster (3 interlocking extruded blocks)
  { x: -2.3, y: 0.9, z: 0, w: 1.35, l: 0.68, h: 0.36, hatched: true },
  { x: -2.3, y: -0.35, z: 0, w: 1.35, l: 0.68, h: 0.36, hatched: true },
  { x: -0.95, y: -0.35, z: 0, w: 1.35, l: 0.68, h: 0.36, hatched: true },

  // Right Raised Courtyard Structure
  { x: 0.7, y: -0.6, z: 0, w: 2.8, l: 0.7, h: 0.46, hatched: true },
  { x: 0.7, y: 1.5, z: 0, w: 2.8, l: 0.7, h: 0.46, hatched: true },
  { x: 0.7, y: 0.1, z: 0, w: 0.7, l: 1.4, h: 0.46, hatched: true },
  { x: 2.8, y: 0.1, z: 0, w: 0.7, l: 1.4, h: 0.46, hatched: true },

  // Rear Step Wings
  { x: 2.1, y: 2.2, z: 0, w: 1.4, l: 0.8, h: 0.34, hatched: true },
  { x: 0.4, y: 2.2, z: 0, w: 1.3, l: 0.8, h: 0.34, hatched: true },
];

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

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const y = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      targetRotX = y * 0.12;
      targetRotY = x * 0.16;
    };

    const handlePointerLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    window.addEventListener("mousemove", handlePointerMove);
    document.addEventListener("mouseleave", handlePointerLeave);

    const render = () => {
      if (!running) return;

      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 800;
      const h = canvas.clientHeight || 200;

      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const isDark = themeRef.current === "dark";
      const strokeColor = isDark ? "rgba(226, 232, 240, 0.42)" : "rgba(51, 65, 85, 0.55)";
      const hatchColor = isDark ? "rgba(226, 232, 240, 0.18)" : "rgba(51, 65, 85, 0.22)";
      const faceBgColor = isDark ? "rgba(10, 10, 12, 0.94)" : "rgba(255, 255, 255, 0.94)";
      const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";

      const centerX = w * 0.48;
      const centerY = h * 0.56;
      const scale = Math.min(w * 0.09, h * 0.36, 42);

      const isoAngle = Math.PI / 6 + currentRotY * 0.4;
      const cosA = Math.cos(isoAngle);
      const sinA = Math.sin(isoAngle);
      const pitch = 0.56 + currentRotX * 0.4;

      const project = (x: number, y: number, z: number) => {
        const px = centerX + (x - y) * cosA * scale;
        const py = centerY + (x + y) * sinA * scale * pitch - z * scale * 1.15;
        return { x: px, y: py, depth: (x + y) * 10 + z * 2 };
      };

      // 1. Draw subtle isometric ground construction grid lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);

      for (let g = -6; g <= 6; g += 1.5) {
        const p1 = project(-5, g, 0);
        const p2 = project(5, g, 0);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project(g, -5, 0);
        const p4 = project(g, 5, 0);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 2. Build 3D Box faces for depth sorting
      interface Face {
        type: "top" | "front" | "right" | "left" | "back";
        pts: { x: number; y: number }[];
        depth: number;
        hatched?: boolean;
      }

      const faces: Face[] = [];

      BOXES.forEach((b) => {
        const { x, y, z, w: bw, l: bl, h: bh, hatched } = b;

        const v000 = project(x, y, z);
        const v100 = project(x + bw, y, z);
        const v110 = project(x + bw, y + bl, z);
        const v010 = project(x, y + bl, z);
        const v001 = project(x, y, z + bh);
        const v101 = project(x + bw, y, z + bh);
        const v111 = project(x + bw, y + bl, z + bh);
        const v011 = project(x, y + bl, z + bh);

        // Top face (Z+)
        faces.push({
          type: "top",
          pts: [v001, v101, v111, v011],
          depth: (v001.depth + v101.depth + v111.depth + v011.depth) / 4 + 3,
          hatched,
        });

        // Front Face (Y-)
        faces.push({
          type: "front",
          pts: [v000, v100, v101, v001],
          depth: (v000.depth + v100.depth + v101.depth + v001.depth) / 4 + 1,
        });

        // Right Face (X+)
        faces.push({
          type: "right",
          pts: [v100, v110, v111, v101],
          depth: (v100.depth + v110.depth + v111.depth + v101.depth) / 4 + 1,
        });

        // Left Face (X-)
        faces.push({
          type: "left",
          pts: [v000, v010, v011, v001],
          depth: (v000.depth + v010.depth + v011.depth + v001.depth) / 4 - 3,
        });

        // Back Face (Y+)
        faces.push({
          type: "back",
          pts: [v010, v110, v111, v011],
          depth: (v010.depth + v110.depth + v111.depth + v011.depth) / 4 - 3,
        });
      });

      // Painter's Algorithm: Sort faces back to front
      faces.sort((a, b) => a.depth - b.depth);

      // 3. Render Faces
      faces.forEach((f) => {
        ctx.beginPath();
        ctx.moveTo(f.pts[0].x, f.pts[0].y);
        for (let i = 1; i < f.pts.length; i++) {
          ctx.lineTo(f.pts[i].x, f.pts[i].y);
        }
        ctx.closePath();

        // Solid face background to occlude geometry behind it
        ctx.fillStyle = faceBgColor;
        ctx.fill();

        // If top face and hatched, draw 45-degree diagonal blueprint lines
        if (f.type === "top" && f.hatched) {
          ctx.save();
          ctx.clip();
          ctx.strokeStyle = hatchColor;
          ctx.lineWidth = 1;

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

        // Face outline
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      });

      // 4. "Fig. 1." technical blueprint caption (positioned cleanly on bottom-left)
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
    };
  }, [resolvedTheme]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-auto" />
    </div>
  );
}
