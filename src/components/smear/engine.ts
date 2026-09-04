import { FULL_VERT, TRAIL_FRAG } from "./shaders";
import { makeWordMask, measureWord, ANCHOR_Y } from "./text-mask";

export interface FadeParams {
  echoes: number;
  step: number;
  alpha: number;
  angle: number;
  hueShift: number;
  turbulence: number;
  spread: number;
  edge: number;
  fringe: number;
}

export const DEFAULTS: FadeParams = {
  echoes: 210,
  step: 1.0,
  alpha: 0.022,
  angle: Math.PI / 2,
  hueShift: 24,
  turbulence: 16,
  spread: 0.22,
  edge: 0.55,
  fringe: 0.045,
};

export interface Palette {
  name: string;
  mode: "add" | "subtract";
  bg: string;
  trail: {
    hue: number;
    sat: number;
    light: number;
    dHue: number;
    dSat: number;
    dLight: number;
  };
  bleed: string;
  halo: string;
  core: string;
  pool: [string, string];
  vignette: string;
  alphaScale: number;
}

// Cornflower Blue (#6495ED) palettes engineered for Dark Mode (additive)
export const DARK_PALETTES: Palette[] = [
  {
    name: "Cornflower Glow",
    mode: "add",
    bg: "#09090b",
    trail: { hue: 219, sat: 79, light: 66, dHue: 12, dSat: -16, dLight: -32 },
    bleed: "hsl(219 75% 52%)",
    halo: "hsl(219 88% 70%)",
    core: "hsl(219 92% 96%)",
    pool: ["rgba(100, 149, 237, 0.24)", "rgba(50, 90, 180, 0.09)"],
    vignette: "#182030",
    alphaScale: 1.0,
  },
  {
    name: "Cornflower Royal",
    mode: "add",
    bg: "#070a12",
    trail: { hue: 224, sat: 84, light: 62, dHue: -10, dSat: -12, dLight: -28 },
    bleed: "hsl(222 70% 48%)",
    halo: "hsl(220 86% 68%)",
    core: "hsl(216 95% 95%)",
    pool: ["rgba(100, 149, 237, 0.26)", "rgba(70, 120, 240, 0.10)"],
    vignette: "#1a2336",
    alphaScale: 1.0,
  },
  {
    name: "Cornflower Deep",
    mode: "add",
    bg: "#0a0c10",
    trail: { hue: 218, sat: 76, light: 60, dHue: 18, dSat: -20, dLight: -30 },
    bleed: "hsl(218 68% 46%)",
    halo: "hsl(218 80% 64%)",
    core: "hsl(218 88% 94%)",
    pool: ["rgba(100, 149, 237, 0.22)", "rgba(40, 80, 170, 0.08)"],
    vignette: "#151c2a",
    alphaScale: 1.0,
  },
];

// Cornflower Blue (#6495ED) palettes engineered for Light Mode (subtractive ink on white)
export const LIGHT_PALETTES: Palette[] = [
  {
    name: "Cornflower Pure",
    mode: "subtract",
    bg: "#ffffff",
    trail: { hue: 219, sat: 76, light: 42, dHue: -10, dSat: -16, dLight: 48 },
    bleed: "hsl(219 65% 58%)",
    halo: "hsl(219 78% 38%)",
    core: "hsl(219 85% 22%)",
    pool: ["rgba(100, 149, 237, 0.14)", "rgba(100, 149, 237, 0.035)"],
    vignette: "#eef3fa",
    alphaScale: 0.45,
  },
  {
    name: "Cornflower Azure",
    mode: "subtract",
    bg: "#fdfefe",
    trail: { hue: 215, sat: 72, light: 38, dHue: 12, dSat: -14, dLight: 52 },
    bleed: "hsl(216 60% 56%)",
    halo: "hsl(215 74% 35%)",
    core: "hsl(216 80% 18%)",
    pool: ["rgba(100, 149, 237, 0.16)", "rgba(100, 149, 237, 0.04)"],
    vignette: "#edf2f8",
    alphaScale: 0.45,
  },
  {
    name: "Cornflower Slate",
    mode: "subtract",
    bg: "#f8fafd",
    trail: { hue: 220, sat: 68, light: 40, dHue: -8, dSat: -18, dLight: 50 },
    bleed: "hsl(220 58% 54%)",
    halo: "hsl(220 72% 36%)",
    core: "hsl(220 76% 20%)",
    pool: ["rgba(100, 149, 237, 0.12)", "rgba(100, 149, 237, 0.025)"],
    vignette: "#ebf0f7",
    alphaScale: 0.45,
  },
];

export const PALETTES: Palette[] = DARK_PALETTES;

const FADE_SECONDS = 0.4;
const FOCAL = 1.6;

const LEAN_X_MAX = 0.21;
const LEAN_Y_MAX = 0.12;

const HALO_TRACK_X = 0.07;
const HALO_TRACK_Y = 0.08;

const FONT_STACK = "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

function resolveFamily(cssFamily: string): string {
  if (typeof document === "undefined") return "sans-serif";
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;visibility:hidden";
  probe.style.fontFamily = cssFamily;
  document.body.appendChild(probe);
  const fam = getComputedStyle(probe).fontFamily || "sans-serif";
  probe.remove();
  return fam;
}

export function pixelFontSpec(): string {
  return `800 100px ${resolveFamily(FONT_STACK)}`;
}

type RGB = [number, number, number];

function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

function parseColor(c: string): { rgb: RGB; a: number } {
  const s = c.trim();
  if (s.startsWith("#")) {
    let h = s.slice(1);
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    return {
      rgb: [
        parseInt(h.slice(0, 2), 16) / 255,
        parseInt(h.slice(2, 4), 16) / 255,
        parseInt(h.slice(4, 6), 16) / 255,
      ],
      a: 1,
    };
  }
  const hsl = s.match(/^hsl\(\s*([-\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)$/);
  if (hsl) {
    return { rgb: hslToRgb(+hsl[1], +hsl[2], +hsl[3]), a: 1 };
  }
  const rgba = s.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/,
  );
  if (rgba) {
    return {
      rgb: [+rgba[1] / 255, +rgba[2] / 255, +rgba[3] / 255],
      a: rgba[4] !== undefined ? +rgba[4] : 1,
    };
  }
  return { rgb: [1, 1, 1], a: 1 };
}

interface ResolvedPalette {
  subtract: number;
  bg: RGB;
  head: RGB;
  tail: RGB;
  bleed: RGB;
  halo: RGB;
  core: RGB;
  poolA: RGB;
  poolB: RGB;
  poolAlphaA: number;
  poolAlphaB: number;
  vignette: RGB;
  alphaScale: number;
}

const resolvedCache = new Map<string, ResolvedPalette>();

function resolve(pal: Palette, hueTravel: number): ResolvedPalette {
  const key = `${pal.name}|${pal.mode}|${hueTravel.toFixed(2)}`;
  const hit = resolvedCache.get(key);
  if (hit) return hit;
  const T = pal.trail;
  const pa = parseColor(pal.pool[0]);
  const pb = parseColor(pal.pool[1]);
  const out: ResolvedPalette = {
    subtract: pal.mode === "subtract" ? 1 : 0,
    bg: parseColor(pal.bg).rgb,
    head: hslToRgb(T.hue, T.sat, T.light),
    tail: hslToRgb(T.hue + hueTravel, T.sat + T.dSat, T.light + T.dLight),
    bleed: parseColor(pal.bleed).rgb,
    halo: parseColor(pal.halo).rgb,
    core: parseColor(pal.core).rgb,
    poolA: pa.rgb,
    poolB: pb.rgb,
    poolAlphaA: pa.a,
    poolAlphaB: pb.a,
    vignette: parseColor(pal.vignette).rgb,
    alphaScale: pal.alphaScale,
  };
  resolvedCache.set(key, out);
  return out;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: RGB, b: RGB, t: number): RGB => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

function blend(a: ResolvedPalette, b: ResolvedPalette, t: number): ResolvedPalette {
  return {
    subtract: lerp(a.subtract, b.subtract, t),
    alphaScale: lerp(a.alphaScale, b.alphaScale, t),
    bg: lerp3(a.bg, b.bg, t),
    head: lerp3(a.head, b.head, t),
    tail: lerp3(a.tail, b.tail, t),
    bleed: lerp3(a.bleed, b.bleed, t),
    halo: lerp3(a.halo, b.halo, t),
    core: lerp3(a.core, b.core, t),
    poolA: lerp3(a.poolA, b.poolA, t),
    poolB: lerp3(a.poolB, b.poolB, t),
    poolAlphaA: lerp(a.poolAlphaA, b.poolAlphaA, t),
    poolAlphaB: lerp(a.poolAlphaB, b.poolAlphaB, t),
    vignette: lerp3(a.vignette, b.vignette, t),
  };
}

const UNIFORMS = [
  "uMask", "uResolution", "uAspect",
  "uEchoes", "uStep", "uAlpha", "uFall", "uZStep",
  "uMagnet", "uMagnetOn", "uSwing",
  "uTurb", "uSpread", "uEdge", "uFringe",
  "uAnchor", "uYaw", "uPitch", "uFocal",
  "uTrailHead", "uTrailTail", "uBleed", "uHalo", "uCore", "uBg",
  "uPoolA", "uPoolB", "uPoolAlphaA", "uPoolAlphaB",
  "uVignette", "uSubtract", "uSoft", "uNoise", "uTime",
  "uHaloShift", "uWordShift",
] as const;

export class FadeMotion {
  private host: HTMLElement;
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private quad: WebGLBuffer | null = null;
  private loc: Record<string, WebGLUniformLocation | null> = {};

  private mask: WebGLTexture | null = null;

  readonly params: FadeParams = { ...DEFAULTS };

  private isDark = true;
  private palettes: Palette[] = DARK_PALETTES;
  private paletteIdx = 0;

  private fadeFrom = 0;
  private fadeMix = 1;

  private hero = false;
  private cyclePeriod = 3;
  private cycleT = 3;

  private word = "JD";

  private ghostX = 0.5;
  private ghostY = ANCHOR_Y;

  private realPtr = false;

  private leanX = 0;
  private leanY = 0;
  private leanTargetX = 0;
  private leanTargetY = 0;

  private near = 0;
  private nearTarget = 0;

  private ptr: { x: number; y: number } | null = null;

  private magX = 0.5;
  private magY = ANCHOR_Y;
  private magOn = 0;

  private idleMix = 1;
  private lastFontWidth = 0;

  private t = 0;
  private tReal = 0;

  private raf = 0;
  private last = 0;
  private running = false;
  private dpr = 1;
  private ro: ResizeObserver | null = null;
  private disposed = false;
  private fontFamily = "sans-serif";

  private builtW = 0;
  private builtH = 0;
  private builtFont = "";

  constructor(host: HTMLElement, isDark = true, word = "JD", fontFamily?: string) {
    this.host = host;
    this.isDark = isDark;
    this.word = word;
    this.palettes = isDark ? DARK_PALETTES : LIGHT_PALETTES;
    this.fontFamily = fontFamily ?? resolveFamily(FONT_STACK);

    this.canvas = document.createElement("canvas");
    this.canvas.style.cssText = "display:block;width:100%;height:100%;pointer-events:none;";
    host.appendChild(this.canvas);

    const gl = this.canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;
    this.gl = gl;

    try {
      this.prog = this.build(FULL_VERT, TRAIL_FRAG);
    } catch {
      this.gl = null;
      return;
    }
    for (const u of UNIFORMS) {
      this.loc[u] = gl.getUniformLocation(this.prog, u);
    }

    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const bg = parseColor(this.palette.bg).rgb;
    gl.clearColor(bg[0], bg[1], bg[2], 1);

    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
  }

  get ok() {
    return !!this.gl && !!this.prog;
  }

  setTheme(isDark: boolean, immediate = false) {
    if (this.isDark === isDark && !immediate) return;
    this.isDark = isDark;
    const targetPalettes = isDark ? DARK_PALETTES : LIGHT_PALETTES;
    this.palettes = targetPalettes;
    this.fadeFrom = this.paletteIdx;
    this.paletteIdx = 0;
    this.fadeMix = immediate ? 1 : 0;
    if (!this.running) this.draw(0);
  }

  setWord(word: string) {
    if (this.word === word) return;
    this.word = word;
    this.builtFont = "";
    this.buildMask();
    if (!this.running) this.draw(0);
  }

  private build(vs: string, fs: string): WebGLProgram {
    const gl = this.gl!;
    const c = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(sh) || "compile failed");
      }
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, c(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, c(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || "link failed");
    }
    return prog;
  }

  private buildMask() {
    const gl = this.gl;
    if (!gl || this.disposed) return;
    const W = this.canvas.width;
    const H = this.canvas.height;
    if (!W || !H) return;
    if (W === this.builtW && H === this.builtH && this.fontFamily === this.builtFont) {
      return;
    }
    this.builtW = W;
    this.builtH = H;
    this.builtFont = this.fontFamily;

    const art = makeWordMask(this.word, W, H, this.fontFamily);
    if (!this.mask) this.mask = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.mask);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, art);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  }

  private resize() {
    const gl = this.gl;
    if (!gl || this.disposed) return;
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (!w || !h) return;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.round(w * this.dpr);
    const ch = Math.round(h * this.dpr);
    if (this.canvas.width !== cw || this.canvas.height !== ch) {
      this.canvas.width = cw;
      this.canvas.height = ch;
      gl.viewport(0, 0, cw, ch);
      this.buildMask();
    }
    if (!this.running) this.draw(0);
  }

  setParams(p: Partial<FadeParams>) {
    Object.assign(this.params, p);
    if (!this.running) this.draw(0);
  }

  refreshFonts() {
    if (this.disposed || !this.gl) return;
    this.fontFamily = resolveFamily(FONT_STACK);
    const w = measureWord(this.word, this.fontFamily);
    if (this.mask && w === this.lastFontWidth) return;
    this.lastFontWidth = w;

    this.builtFont = "";
    this.buildMask();
    if (!this.running) this.draw(0);
  }

  setPointer(p: { x: number; y: number } | null) {
    if (!p) {
      this.ptr = null;
      this.realPtr = false;
      return;
    }
    this.ptr = { x: p.x, y: p.y };
    this.realPtr = true;
    this.applyPointerTargets();
  }

  private applyPointerTargets() {
    const p = this.ptr;
    if (!p) return;

    this.leanTargetX = (p.x - 0.5) * 0.42;
    this.leanTargetY = (p.y - 0.5) * 0.24;

    const dx = p.x - 0.5;
    const dy = p.y - ANCHOR_Y;
    this.nearTarget = 1 - Math.min(1, Math.hypot(dx, dy) / 0.62);
  }

  next() {
    this.fadeFrom = this.paletteIdx;
    this.fadeMix = this.fadeMix >= 1 ? 0 : this.fadeMix;
    this.paletteIdx = (this.paletteIdx + 1) % this.palettes.length;
    if (!this.running) this.draw(0);
  }

  enableHero(cyclePeriod = 3) {
    this.hero = true;
    this.cyclePeriod = cyclePeriod;
    this.cycleT = cyclePeriod;
  }

  get palette(): Palette {
    return this.palettes[this.paletteIdx % this.palettes.length];
  }

  get bgCss(): string {
    const c = this.lastBg;
    return `rgb(${Math.round(c[0] * 255)} ${Math.round(c[1] * 255)} ${Math.round(c[2] * 255)})`;
  }
  private lastBg: RGB = [0, 0, 0];

  onBg: ((css: string) => void) | null = null;

  private step(dt: number) {
    if (this.hero && !this.realPtr) {
      const g = this.tReal;
      const gx =
        0.55 * Math.sin(g * 2.30) +
        0.30 * Math.sin(g * 3.70 + 1.1) +
        0.15 * Math.sin(g * 6.10 + 0.4);
      const gy =
        0.55 * Math.cos(g * 1.90 + 2.1) +
        0.30 * Math.sin(g * 4.30 + 0.5) +
        0.15 * Math.cos(g * 7.30 + 1.7);

      this.ghostX = 0.5 + gx * 0.20;
      this.ghostY = ANCHOR_Y + gy * 0.13;
      this.ptr = { x: this.ghostX, y: this.ghostY };
      this.applyPointerTargets();
    }

    const hasPointer = !!this.ptr;

    const mixTarget = hasPointer ? 0 : 1;
    const mixRate = hasPointer ? 26 : 0.7;
    this.idleMix += (mixTarget - this.idleMix) * Math.min(1, dt * mixRate);

    if (hasPointer && this.idleMix < 0.002) this.idleMix = 0;

    this.t += dt * this.idleMix;
    this.tReal += dt;

    this.applyPointerTargets();

    const m = this.idleMix;
    const driftX = Math.sin(this.t * 0.23) * 0.13;
    const driftY = Math.sin(this.t * 0.31 + 1.7) * 0.07;
    const driftN = 0.22 + Math.sin(this.t * 0.17) * 0.1;
    const tx = this.leanTargetX * (1 - m) + driftX * m;
    const ty = this.leanTargetY * (1 - m) + driftY * m;
    const tn = this.nearTarget * (1 - m) + driftN * m;

    const ease = (rate: number) => 1 - Math.exp(-rate * dt);

    const k = ease(hasPointer ? 16 : 2.2);
    this.leanX += (tx - this.leanX) * k;
    this.leanY += (ty - this.leanY) * k;
    this.near += (tn - this.near) * ease(hasPointer ? 12 : 1.8);

    this.leanX = Math.max(-LEAN_X_MAX, Math.min(LEAN_X_MAX, this.leanX));
    this.leanY = Math.max(-LEAN_Y_MAX, Math.min(LEAN_Y_MAX, this.leanY));

    const mk = ease(7);
    if (this.ptr) {
      this.magX += (this.ptr.x - this.magX) * mk;
      this.magY += (this.ptr.y - this.magY) * mk;
    }

    this.magOn += ((this.ptr ? 1 : 0) - this.magOn) * ease(this.ptr ? 9 : 2.4);

    if (this.fadeMix < 1) {
      this.fadeMix = Math.min(1, this.fadeMix + dt / FADE_SECONDS);
    }

    if (this.hero && this.fadeMix >= 1) {
      this.cycleT -= dt;
      if (this.cycleT <= 0) {
        this.cycleT = this.cyclePeriod;
        this.next();
      }
    }
  }

  private draw(dt: number) {
    const gl = this.gl;
    const prog = this.prog;
    if (!gl || !prog) return;
    this.step(dt);
    if (!this.mask) this.buildMask();
    if (!this.mask) return;

    const W = this.canvas.width;
    const H = this.canvas.height;
    const P = this.params;
    const aspect = W / Math.max(1, H);

    const hueOf = (p: Palette) => p.trail.dHue * (P.hueShift / 24);
    const to = this.palettes[this.paletteIdx % this.palettes.length];
    const pal =
      this.fadeMix >= 1
        ? resolve(to, hueOf(to))
        : (() => {
            const from = this.palettes[this.fadeFrom % this.palettes.length];
            const m = this.fadeMix;
            const eased = m * m * (3 - 2 * m);
            return blend(
              resolve(from, hueOf(from)),
              resolve(to, hueOf(to)),
              eased,
            );
          })();

    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    const aPos = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.mask);
    gl.uniform1i(this.loc.uMask, 0);

    gl.uniform1f(this.loc.uYaw, -this.leanX * 0.2);
    gl.uniform1f(this.loc.uPitch, -this.leanY * 0.12);
    gl.uniform1f(this.loc.uFocal, FOCAL);

    gl.uniform2f(
      this.loc.uAnchor,
      0.5 + this.leanX * 0.05,
      1 - (ANCHOR_Y + this.leanY * 0.05),
    );

    gl.uniform2f(
      this.loc.uFall,
      Math.cos(P.angle),
      -Math.sin(P.angle),
    );
    gl.uniform1f(this.loc.uStep, P.step);
    gl.uniform1f(this.loc.uZStep, 0.55 * P.step);
    gl.uniform1f(this.loc.uAlpha, P.alpha * pal.alphaScale);

    gl.uniform2f(this.loc.uMagnet, this.magX, 1 - this.magY);
    gl.uniform1f(this.loc.uMagnetOn, this.magOn);

    gl.uniform1f(this.loc.uSwing, this.leanX * 2.2);

    gl.uniform1f(this.loc.uTurb, P.turbulence * (1 + this.magOn * 0.35));
    gl.uniform1f(this.loc.uSpread, P.spread);
    gl.uniform1f(this.loc.uEdge, P.edge);
    gl.uniform1f(this.loc.uFringe, P.fringe);

    const reach = 1.15 - this.near * 0.6;
    gl.uniform1f(this.loc.uEchoes, Math.max(1, P.echoes * reach));

    gl.uniform3fv(this.loc.uTrailHead, pal.head);
    gl.uniform3fv(this.loc.uTrailTail, pal.tail);

    gl.uniform3fv(this.loc.uBleed, pal.bleed);
    gl.uniform3fv(this.loc.uHalo, pal.halo);
    gl.uniform3fv(this.loc.uCore, pal.core);
    gl.uniform3fv(this.loc.uBg, pal.bg);

    gl.uniform3fv(this.loc.uPoolA, pal.poolA);
    gl.uniform3fv(this.loc.uPoolB, pal.poolB);
    gl.uniform1f(this.loc.uPoolAlphaA, pal.poolAlphaA);
    gl.uniform1f(this.loc.uPoolAlphaB, pal.poolAlphaB);
    gl.uniform3fv(this.loc.uVignette, pal.vignette);

    if (
      pal.bg[0] !== this.lastBg[0] ||
      pal.bg[1] !== this.lastBg[1] ||
      pal.bg[2] !== this.lastBg[2]
    ) {
      this.lastBg = [pal.bg[0], pal.bg[1], pal.bg[2]];
      this.onBg?.(this.bgCss);
    }

    gl.uniform1f(this.loc.uSubtract, pal.subtract);
    gl.uniform1f(this.loc.uSoft, lerp(1, 0.35, pal.subtract));
    gl.uniform1f(this.loc.uNoise, lerp(0.02, 0.012, pal.subtract));

    gl.uniform1f(this.loc.uTime, this.tReal);
    gl.uniform1f(this.loc.uAspect, aspect);
    gl.uniform2f(this.loc.uResolution, W, H);

    gl.uniform2f(
      this.loc.uHaloShift,
      this.leanX * HALO_TRACK_X,
      -this.leanY * HALO_TRACK_Y,
    );

    gl.uniform2f(
      this.loc.uWordShift,
      -this.leanX * 0.006,
      this.leanY * 0.006,
    );

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  renderStill() {
    this.draw(0);
  }

  start() {
    if (this.running || !this.ok || this.disposed) return;
    this.running = true;
    this.last = performance.now();
    const tick = (now: number) => {
      if (!this.running) return;
      const dt = Math.min((now - this.last) / 1000, 1 / 30);
      this.last = now;
      this.draw(dt);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  destroy() {
    this.disposed = true;
    this.stop();
    this.ro?.disconnect();
    this.ro = null;
    const gl = this.gl;
    if (gl) {
      if (this.mask) gl.deleteTexture(this.mask);
      if (this.quad) gl.deleteBuffer(this.quad);
      if (this.prog) gl.deleteProgram(this.prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
    this.gl = null;
    this.canvas.remove();
  }
}
