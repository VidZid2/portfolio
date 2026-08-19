"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export function IsometricBlueprint({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let renderer: THREE.WebGLRenderer;
    let deltaGroup: THREE.Group | null = null;
    let gridHelper: THREE.GridHelper | null = null;
    let axisLinesGroup: THREE.Group | null = null;
    let hatchTexture: THREE.CanvasTexture | null = null;
    let animationFrameId = 0;
    let isDisposed = false;

    // Theme color palettes matching the blueprint generator
    const getThemeColors = (isDark: boolean) => {
      if (isDark) {
        return {
          bg: 0x000000,
          grid: 0x27272a,
          axis: 0x3f3f46,
          lineColor: 0xf4f4f5,
          hatchColor: "#a1a1aa",
          topFill: "#27272a",
          sideFill: 0x202023,
          textColor: "#a1a1aa",
        };
      }
      return {
        bg: 0xffffff,
        grid: 0xe2dfd7,
        axis: 0xd3cebe,
        lineColor: 0x2c2825,
        hatchColor: "#635e58",
        topFill: "#ffffff",
        sideFill: 0xf2efe6,
        textColor: "#5a554d",
      };
    };

    // 1. Create Diagonal 45-degree Technical Hatch Texture
    function createHatchTexture(hatchColorHex: string, bgColorHex: string) {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.fillStyle = bgColorHex;
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = hatchColorHex;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const rad = (45 * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const spacing = 24 * 1.2;

      for (let d = -1024; d < 1024; d += spacing) {
        const x1 = d * cos - 1024 * sin + 256;
        const y1 = d * sin + 1024 * cos + 256;
        const x2 = d * cos + 1024 * sin + 256;
        const y2 = d * sin - 1024 * cos + 256;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(0.12, 0.12);
      tex.needsUpdate = true;
      return tex;
    }

    // 2. Create Rounded Triangle Vector Shape
    function createRoundedTriangleShape(size: number, cornerRadius: number) {
      const shape = new THREE.Shape();
      const radius = Math.min(cornerRadius * 0.8, size * 0.35);
      const h = size * (Math.sqrt(3) / 2);

      // Vertices of equilateral triangle pointing upwards
      const v0 = { x: 0, y: (2 / 3) * h };
      const v1 = { x: -size / 2, y: -(1 / 3) * h };
      const v2 = { x: size / 2, y: -(1 / 3) * h };

      const pts = [v0, v1, v2];
      const n = pts.length;

      for (let i = 0; i < n; i++) {
        const prev = pts[(i + n - 1) % n];
        const curr = pts[i];
        const next = pts[(i + 1) % n];

        const vPrev = { x: prev.x - curr.x, y: prev.y - curr.y };
        const lenPrev = Math.hypot(vPrev.x, vPrev.y);
        const normPrev = { x: vPrev.x / lenPrev, y: vPrev.y / lenPrev };

        const vNext = { x: next.x - curr.x, y: next.y - curr.y };
        const lenNext = Math.hypot(vNext.x, vNext.y);
        const normNext = { x: vNext.x / lenNext, y: vNext.y / lenNext };

        const d = radius * 1.2;
        const startPt = { x: curr.x + normPrev.x * d, y: curr.y + normPrev.y * d };
        const endPt = { x: curr.x + normNext.x * d, y: curr.y + normNext.y * d };

        if (i === 0) {
          shape.moveTo(startPt.x, startPt.y);
        } else {
          shape.lineTo(startPt.x, startPt.y);
        }
        shape.quadraticCurveTo(curr.x, curr.y, endPt.x, endPt.y);
      }
      shape.closePath();
      return shape;
    }

    // 3. Build 3D Extruded Delta Structure
    function build3DStructure(colors: ReturnType<typeof getThemeColors>) {
      if (deltaGroup) scene.remove(deltaGroup);
      deltaGroup = new THREE.Group();

      const triangleSize = 2.4;
      const cornerRadius = 0.55;
      const height = 0.8;
      const shape = createRoundedTriangleShape(triangleSize, cornerRadius);

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        steps: 1,
        depth: height,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 3,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.center();

      const sideMaterial = new THREE.MeshBasicMaterial({ color: colors.sideFill });

      if (hatchTexture) hatchTexture.dispose();
      hatchTexture = createHatchTexture(colors.hatchColor, colors.topFill);
      const topCapMaterial = new THREE.MeshBasicMaterial({ map: hatchTexture });

      const materials = [sideMaterial, topCapMaterial];
      const edgesGeo = new THREE.EdgesGeometry(geometry, 12);
      const lineMat = new THREE.LineBasicMaterial({
        color: colors.lineColor,
        linewidth: 1.8,
      });

      const dist = 1.35 + 0.25;
      const positions = [
        { x: 0, z: -dist * 0.866, y: 0, rotY: 0 },
        { x: -dist * 0.866, z: dist * 0.5, y: 0, rotY: 0 },
        { x: dist * 0.866, z: dist * 0.5, y: 0, rotY: 0 },
      ];

      positions.forEach((pos) => {
        const mesh = new THREE.Mesh(geometry, materials);
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = pos.rotY;
        mesh.position.set(pos.x, pos.y + height / 2, pos.z);

        const lineSegments = new THREE.LineSegments(edgesGeo, lineMat);
        mesh.add(lineSegments);
        deltaGroup?.add(mesh);
      });

      scene.add(deltaGroup);
    }

    // 4. Build Floor Grid & Dashed Construction Axes
    function buildFloorGrid(colors: ReturnType<typeof getThemeColors>) {
      if (gridHelper) scene.remove(gridHelper);
      gridHelper = new THREE.GridHelper(18, 18, colors.axis, colors.grid);
      gridHelper.position.y = -0.01;
      scene.add(gridHelper);
    }

    function buildAxisLines(colors: ReturnType<typeof getThemeColors>) {
      if (axisLinesGroup) scene.remove(axisLinesGroup);
      axisLinesGroup = new THREE.Group();

      const lineMat = new THREE.LineDashedMaterial({
        color: colors.axis,
        dashSize: 0.2,
        gapSize: 0.15,
        linewidth: 1,
      });

      const points1 = [new THREE.Vector3(-10, 0, -10), new THREE.Vector3(10, 0, 10)];
      const geo1 = new THREE.BufferGeometry().setFromPoints(points1);
      const line1 = new THREE.Line(geo1, lineMat);
      line1.computeLineDistances();

      const points2 = [new THREE.Vector3(-10, 0, 10), new THREE.Vector3(10, 0, -10)];
      const geo2 = new THREE.BufferGeometry().setFromPoints(points2);
      const line2 = new THREE.Line(geo2, lineMat);
      line2.computeLineDistances();

      axisLinesGroup.add(line1);
      axisLinesGroup.add(line2);
      scene.add(axisLinesGroup);
    }

    // Initialize Three.js Scene
    const isDark = themeRef.current === "dark";
    const colors = getThemeColors(isDark);

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 220;
    const aspect = width / Math.max(1, height);
    const d = 4.2;

    scene = new THREE.Scene();
    scene.background = null; // Transparent to blend seamlessly with banner background

    // True Isometric Camera Setup
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    buildFloorGrid(colors);
    buildAxisLines(colors);
    build3DStructure(colors);

    const onWindowResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 220;
      const asp = w / Math.max(1, h);

      camera.left = -d * asp;
      camera.right = d * asp;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };

    window.addEventListener("resize", onWindowResize);

    // Static render (or clean RAF loop)
    const animate = () => {
      if (isDisposed) return;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onWindowResize);
      if (hatchTexture) hatchTexture.dispose();
      renderer.dispose();
      container.innerHTML = "";
    };
  }, [resolvedTheme]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full block" />

      {/* Fig. 1. Architectural Label */}
      <div className="absolute bottom-3 left-4 pointer-events-none text-left z-20">
        <span className="font-mono text-[11px] font-medium tracking-tight text-zinc-400 dark:text-zinc-500">
          Fig. 1. 3D Extruded Delta Emblem & Hatch Projection
        </span>
      </div>
    </div>
  );
}
