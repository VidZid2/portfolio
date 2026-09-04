import {
  BAND,
  BAR_BEATS,
  BAR_H,
  BAR_L,
  BAR_OFF,
  BAR_V,
  BAR_Y,
  BEAT,
  CORE_A,
  CORE_B,
  CORE_CAP,
  CORE_FALLOFF,
  CORE_TIP_MAX,
  CORE_TIP_MIN,
  CORE_TROUGH,
  CURSOR_AMOUNT,
  CURSOR_GESTURE,
  CURSOR_LOCAL_R,
  CURSOR_EASE,
  CURSOR_GRAIN,
  CURSOR_R,
  CURSOR_SPRAY,
  DARK_PALETTES,
  DISC_BEATS,
  DISC_OX,
  DISC_OY,
  DISC_PHASE,
  DISC_R,
  DISC_SPIN,
  DOT_ANGLE,
  DOT_BEATS,
  DOT_FREQ,
  DOT_INSET,
  DOT_MAX,
  DOT_MIN,
  DOT_SPEED,
  DOT_STEP,
  FADE_FRAMES,
  FAN,
  FPS,
  GLIDE,
  GRAIN_INK,
  GRAIN_SCALE,
  GRAIN_PAPER,
  GRAIN_PLATE,
  GRAY_DARK_PALETTES,
  GRAY_LIGHT_PALETTES,
  LIGHT_PALETTES,
  MARGIN,
  ORDER,
  POSES,
  RAY_TAPER,
  RAY_W0,
  RAY_WTIP,
  RING_BEATS,
  RING_GAP_AT,
  RING_GAP_W,
  RING_OFF,
  RING_R,
  RING_SPIN,
  RING_W,
  SCENE_COUNT,
  SNAP,
  SCENE_FRAMES,
  SPATTER,
  SPATTER_DECAY,
  SPRAY_INK,
  SPRAY_PLATE,
  SPRAY_SCALE,
  STAR_STATIONS,
  STATION,
  TIP_GROW,
  TOTAL,
  TRANSIT,
  TRANSIT_OUT,
  TRANSIT_SPLIT,
  WEDGE_AT,
  WEDGE_BEATS,
  WEDGE_R0,
  WEDGE_R1,
  WEDGE_SPIN,
  WEDGE_W,
  WOBBLE_INK,
  WOBBLE_PLATE,
  WOBBLE_SCALE,
  ease,
  type Palette,
  type Pose,
  type RGB,
} from "./params";

const DPR_CAP = 1.5;
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

const STILL_FRAME = ORDER.indexOf(0) * SCENE_FRAMES + 6;

const STAR_TOUR = [4, 0, 2];

const f = (n: number) => (Number.isInteger(n) ? `${n}.0` : `${n}`);

const table = (name: string, vals: readonly number[]) => {
  const chain = vals
    .slice(0, -1)
    .map((v, i) => `i == ${i} ? ${f(v)} : `)
    .join("");
  return `float ${name}(int i) { return ${chain}${f(vals[vals.length - 1])}; }`;
};

const SYNC_PATH1 =
  "M9515 15593 c-396 -395 -1487 -1480 -2423 -2412 l-1704 -1696 204 -199 c111 -109 339 -334 505 -499 l302 -301 380 385 379 384 -121 122 -121 122 1659 1653 c912 909 1661 1653 1665 1653 4 0 515 -506 1135 -1124 l1128 -1124 -271 -270 -271 -271 -253 250 c-139 137 -533 525 -876 863 l-622 614 -377 -378 -376 -377 174 -172 c96 -94 320 -315 499 -491 179 -176 662 -653 1073 -1059 l748 -739 47 44 c96 90 350 337 800 778 l463 454 156 -155 155 -155 -338 -334 c-550 -543 -1632 -1608 -2157 -2124 -268 -263 -486 -483 -484 -489 2 -5 170 -173 374 -373 l370 -363 364 357 c200 196 614 602 919 902 697 686 2337 2290 2408 2355 28 27 52 54 52 61 0 7 -807 815 -1792 1796 -986 981 -2073 2062 -2416 2404 -342 341 -626 621 -630 622 -4 1 -331 -320 -727 -714z";

const SYNC_PATH2 =
  "M8997 12524 c-208 -203 -611 -598 -947 -929 -162 -160 -491 -482 -730 -715 -967 -944 -1398 -1366 -1647 -1613 -143 -143 -267 -263 -275 -268 -9 -6 258 -279 982 -1002 1596 -1592 3842 -3818 3859 -3825 4 -1 515 505 1136 1126 622 621 1712 1706 2423 2412 l1292 1284 -252 254 c-139 139 -365 362 -501 494 l-248 242 -225 -225 c-124 -123 -293 -295 -376 -382 l-152 -158 116 -116 116 -116 -1654 -1661 c-911 -914 -1660 -1661 -1665 -1661 -5 0 -516 508 -1137 1128 l-1128 1128 268 267 c148 147 274 269 279 271 6 2 138 -122 293 -276 268 -266 1168 -1149 1364 -1338 l93 -89 374 374 374 375 -217 210 c-337 325 -1539 1501 -1923 1882 -190 189 -349 343 -354 343 -11 0 -86 -72 -748 -724 -307 -302 -559 -547 -560 -544 -1 2 -71 73 -155 159 l-152 155 297 294 c314 311 441 436 1820 1795 l863 849 -371 365 c-205 201 -376 368 -381 370 -5 1 -73 -59 -151 -135z";

function edt1d(
  f: Float32Array,
  n: number,
  d: Float32Array,
  v: Int32Array,
  z: Float32Array,
) {
  let k = 0;
  v[0] = 0;
  z[0] = -1e20;
  z[1] = 1e20;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = 1e20;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}

function edt2d(grid: Float32Array, w: number, h: number): Float32Array {
  const f = new Float32Array(Math.max(w, h));
  const d = new Float32Array(Math.max(w, h));
  const v = new Int32Array(Math.max(w, h));
  const z = new Float32Array(Math.max(w, h) + 1);
  const dist = new Float32Array(w * h);

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      f[y] = grid[y * w + x];
    }
    edt1d(f, h, d, v, z);
    for (let y = 0; y < h; y++) {
      dist[y * w + x] = d[y];
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      f[x] = dist[y * w + x];
    }
    edt1d(f, w, d, v, z);
    for (let x = 0; x < w; x++) {
      dist[y * w + x] = Math.sqrt(d[x]);
    }
  }
  return dist;
}

let cachedSdfData: Uint8Array | null = null;

function getSyncLogoSdfData(): Uint8Array {
  if (cachedSdfData) return cachedSdfData;
  if (typeof document === "undefined") {
    return new Uint8Array(256 * 256);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new Uint8Array(256 * 256);

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 256, 256);

  // Map 2048x2048 SVG paths to 256x256 canvas
  ctx.save();
  ctx.scale(256 / 2048, 256 / 2048);
  ctx.translate(0, 2048);
  ctx.scale(0.1, -0.1);
  ctx.fillStyle = "#ffffff";
  ctx.fill(new Path2D(SYNC_PATH1));
  ctx.fill(new Path2D(SYNC_PATH2));
  ctx.restore();

  const imgData = ctx.getImageData(0, 0, 256, 256);
  const data = imgData.data;
  const N = 256 * 256;
  const inside = new Float32Array(N);
  const outside = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    const filled = data[i * 4] > 128;
    inside[i] = filled ? 0 : 1e10;
    outside[i] = filled ? 1e10 : 0;
  }

  const dIn = edt2d(inside, 256, 256);
  const dOut = edt2d(outside, 256, 256);

  const SPREAD = 48.0;
  const out = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    const sd = dIn[i] - dOut[i];
    const norm = Math.max(0, Math.min(255, Math.round((sd / SPREAD) * 127.5 + 127.5)));
    out[i] = norm;
  }
  cachedSdfData = out;
  return out;
}

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

function makeSceneGlsl(tag: "A" | "B"): string {
  const C = `uC${tag}`;
  const A = tag === "A" ? "uA" : "uB";
  const T = tag === "A" ? "uT" : "uTB";

  return `
float ringsDist_${tag}(vec2 p) {
  vec2 q = p - ${C};
  float th = atan(q.y, q.x) / TAU;
  float r = length(q);
  float d = 1e5;
  for (int i = 0; i < 5; i++) {
    float ri = RING_R(i) * uUnit;
    float wi = RING_W(i) * uUnit;
    float ring = abs(r - ri) - wi;
    float g = th - ${A}[i];
    g = g - floor(g + 0.5);
    float halfGap = RING_GAP_W(i) * 0.5;
    float cut = (halfGap - abs(g)) * TAU * ri;
    d = min(d, max(ring, cut));
  }
  return d;
}

float barsDist_${tag}(vec2 p) {
  float d = 1e5;
  for (int i = 0; i < 6; i++) {
    vec2 c = vec2(${A}[i], ${C}.y + BAR_Y(i) * uUnit);
    d = min(d, sdBox(p, c, vec2(BAR_L(i) * uUnit, BAR_H(i) * uUnit)));
  }
  return d;
}

float discsDist_${tag}(vec2 p) {
  float d = 1e5;
  for (int i = 0; i < 7; i++) {
    d = min(d, length(p - vec2(${A}[i], ${T}[i])) - DISC_R(i) * uUnit);
  }
  return d;
}

float wedgeDist_${tag}(vec2 p) {
  vec2 q = p - ${C};
  float r = max(length(q), 1e-4);
  float th = atan(q.y, q.x) / TAU;
  float rad = max(${f(WEDGE_R0)} * uUnit - r, r - ${f(WEDGE_R1)} * uUnit);
  float d = 1e5;
  for (int i = 0; i < 7; i++) {
    float g = th - ${A}[i];
    g = g - floor(g + 0.5);
    float ang = (abs(g) - WEDGE_W(i)) * TAU * r;
    d = min(d, max(ang, rad));
  }
  return d;
}

float dotsDist_${tag}(vec2 p) {
  float step = ${f(DOT_STEP)} * uUnit;
  vec2 q = p - ${C};
  vec2 cell = floor(q / step);
  vec2 local = q - (cell + 0.5) * step;
  float phase = dot(cell + 0.5, vec2(${A}[1], ${A}[2])) + ${A}[0];
  float wave = 0.5 + 0.5 * sin(phase * TAU);
  float rr = mix(${f(DOT_MIN)}, ${f(DOT_MAX)}, wave);
  vec2 cc = ${C} + (cell + 0.5) * step;
  float swell = ${A}[3] * (1.0 - smoothstep(0.0, ${f(CURSOR_LOCAL_R)} * uUnit, distance(cc, uCursor.xy)));
  rr = min(rr * (1.0 + swell), 0.48) * step;
  float dots = length(local) - rr;
  vec2 rc = vec2((uRect.x + uRect.z) * 0.5, (uRect.y + uRect.w) * 0.5);
  vec2 rh = vec2((uRect.z - uRect.x) * 0.5, (uRect.w - uRect.y) * 0.5) - ${f(DOT_INSET)} * uUnit;
  return max(dots, sdBox(p, rc, rh));
}

float starDist_${tag}(vec2 p) {
  vec2 q = p - ${C};
  float r = length(q);
  float th = atan(q.y, q.x);
  float d1 = 99.0, d2 = 99.0, t1 = 0.0;
  for (int i = 0; i < 8; i++) {
    float dd = angDist(th, ${A}[i]);
    if (dd < d1) { d2 = d1; d1 = dd; t1 = ${T}[i]; }
    else if (dd < d2) { d2 = dd; }
  }
  float bump = pow(1.0 - clamp(d1 / max(d2, 1e-4), 0.0, 1.0), ${f(CORE_FALLOFF)});
  float coreR = mix(${f(CORE_TROUGH)} * uUnit, corePeak(t1), bump);
  float d = max(coreR - r, r - (coreR + ${f(BAND)} * uUnit));
  for (int i = 0; i < 8; i++) {
    d = min(d, rayDist(q, ${A}[i], ${T}[i], corePeak(${T}[i])));
  }
  return d;
}

float diamondsDist_${tag}(vec2 p) {
  vec2 q = p - ${C};
  float rot = ${A}[0];
  float phase = ${A}[1];
  float cosR = cos(rot), sinR = sin(rot);
  vec2 rq = vec2(q.x * cosR - q.y * sinR, q.x * sinR + q.y * cosR);
  float r = (abs(rq.x) + abs(rq.y)) * 0.70710678;
  float d = 1e5;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float ri = (0.22 + fi * 0.19) * uUnit * (1.0 + 0.07 * sin(phase + fi * 0.9));
    float wi = (0.045 - fi * 0.004) * uUnit;
    d = min(d, abs(r - ri) - wi);
  }
  float core = r - 0.085 * uUnit * (1.0 + 0.12 * sin(phase * 2.0));
  return min(d, core);
}

float crossesDist_${tag}(vec2 p) {
  vec2 q = p - ${C};
  float rot = ${A}[0];
  float phase = ${A}[1];
  float step = 0.44 * uUnit;
  vec2 cell = floor((q + 0.5 * step) / step);
  if (abs(cell.x) > 1.5 || abs(cell.y) > 1.5) return 1e5;
  vec2 local = q - cell * step;
  float dir = mod(abs(cell.x + cell.y), 2.0) == 0.0 ? 1.0 : -1.0;
  float r = rot * dir + (cell.x + cell.y * 2.0) * 0.3;
  float cr = cos(r), sr = sin(r);
  vec2 rl = vec2(local.x * cr - local.y * sr, local.x * sr + local.y * cr);
  float armL = (0.13 + 0.02 * sin(phase + (cell.x - cell.y))) * uUnit;
  float armW = 0.04 * uUnit;
  float barH = sdBox(rl, vec2(0.0), vec2(armL, armW));
  float barV = sdBox(rl, vec2(0.0), vec2(armW, armL));
  return min(barH, barV);
}

float hexMazeDist_${tag}(vec2 p) {
  vec2 q = p - ${C};
  float th = atan(q.y, q.x) / TAU;
  float hr = max(abs(q.x) * 0.8660254 + abs(q.y) * 0.5, abs(q.y));
  float d = 1e5;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float ri = (0.28 + fi * 0.22) * uUnit;
    float wi = (0.048 - fi * 0.005) * uUnit;
    float ring = abs(hr - ri) - wi;
    float gapAt = ${A}[i];
    float g = th - gapAt;
    g = g - floor(g + 0.5);
    float cut = (0.14 - abs(g)) * TAU * ri;
    d = min(d, max(ring, cut));
  }
  return d;
}

float wavesDist_${tag}(vec2 p) {
  vec2 q = p - ${C};
  float phase = ${A}[0];
  float freq = ${A}[1];
  float d = 1e5;
  for (int i = 0; i < 5; i++) {
    float fi = float(i) - 2.0;
    float yBase = fi * 0.32 * uUnit;
    float w = sin(q.x * freq + phase + fi * 0.8) * (0.07 * uUnit)
            + sin(q.x * freq * 1.8 - phase * 0.6) * (0.035 * uUnit);
    float distY = abs(q.y - (yBase + w)) - (0.038 + 0.012 * sin(fi * 1.5 + phase)) * uUnit;
    d = min(d, distY);
  }
  vec2 rc = vec2((uRect.x + uRect.z) * 0.5, (uRect.y + uRect.w) * 0.5);
  vec2 rh = vec2((uRect.z - uRect.x) * 0.5, (uRect.w - uRect.y) * 0.5) - 0.05 * uUnit;
  return max(d, sdBox(p, rc, rh));
}

float syncLogoDist_${tag}(vec2 p) {
  vec2 q = p - ${C};
  float rot = ${A}[0];
  float floatY = ${A}[1];
  float size = ${A}[2];
  float wave0 = ${A}[3];
  float wave1 = ${A}[4];
  float morph = ${A}[5];
  float pulse = ${A}[6];

  float cR = cos(rot), sR = sin(rot);
  vec2 lq = q - vec2(0.0, floatY);
  vec2 rq = vec2(lq.x * cR - lq.y * sR, lq.x * sR + lq.y * cR);

  vec2 uv = (rq / size) + 0.5;
  vec2 clUv = clamp(uv, vec2(0.002), vec2(0.998));
  float val = texture2D(uSyncTex, clUv).r;
  float sdInPixels = (val - 0.5) * 2.0 * 48.0 * (size / 256.0);
  vec2 boxDist = max(abs(rq) - vec2(size * 0.5), vec2(0.0));
  float outsideDist = length(boxDist);
  float d = sdInPixels + outsideDist;

  // Concentric diamond pulse morph echoes
  float rDiamond = (abs(rq.x) + abs(rq.y)) * 0.70710678;
  float rCircle = length(rq);
  // As it expands, subtly softens corners for organic harmonic tension
  float rShape = mix(rDiamond, rDiamond * 0.86 + rCircle * 0.14, morph);

  // Inner echo ring: expands from 0.56 to 0.80 * size, then morphs smoothly back
  float r0 = mix(0.56, 0.80, wave0) * size;
  float w0 = (0.017 + 0.006 * wave0) * uUnit * (1.0 + 0.25 * pulse);
  float d0 = abs(rShape - r0) - w0;
  d = min(d, d0);

  // Outer echo ring: expands further out from 0.82 to 1.22 * size, then morphs smoothly back
  float r1 = mix(0.82, 1.22, wave1) * size;
  float w1 = (0.015 + 0.008 * wave1) * uUnit * (1.0 + 0.3 * pulse);
  float d1 = abs(rShape - r1) - w1;
  d = min(d, d1);

  return d;
}

float evalScene_${tag}(vec2 p, int sc) {
  if (sc == 0) return starDist_${tag}(p);
  if (sc == 1) return ringsDist_${tag}(p);
  if (sc == 2) return barsDist_${tag}(p);
  if (sc == 3) return discsDist_${tag}(p);
  if (sc == 4) return wedgeDist_${tag}(p);
  if (sc == 5) return dotsDist_${tag}(p);
  if (sc == 6) return diamondsDist_${tag}(p);
  if (sc == 7) return crossesDist_${tag}(p);
  if (sc == 8) return hexMazeDist_${tag}(p);
  if (sc == 9) return wavesDist_${tag}(p);
  return syncLogoDist_${tag}(p);
}
`;
}

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform vec4  uRect;
uniform float uUnit;
uniform float uSeed;
uniform vec3  uPaper;
uniform vec3  uPlate;
uniform vec3  uInk;
uniform vec3  uGrain;
uniform vec3  uCursor;
uniform sampler2D uSyncTex;

// Scene A uniforms
uniform int   uSceneA;
uniform vec2  uCA;
uniform float uSprayIA;
uniform float uA[8];
uniform float uT[8];

// Scene B uniforms (for smooth transition)
uniform int   uSceneB;
uniform vec2  uCB;
uniform float uSprayIB;
uniform float uB[8];
uniform float uTB[8];

// Transition crossfade factor (0.0 = only A, 1.0 = only B)
uniform float uFade;

const float TAU = 6.28318530718;

${table("RING_R", RING_R)}
${table("RING_W", RING_W)}
${table("RING_GAP_W", RING_GAP_W)}
${table("BAR_Y", BAR_Y)}
${table("BAR_H", BAR_H)}
${table("BAR_L", BAR_L)}
${table("DISC_R", DISC_R)}
${table("WEDGE_W", WEDGE_W)}

float hash(vec2 p, float s) {
  vec3 p3 = fract(vec3(p.x, p.y, p.x + s) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p, float s) {
  vec2 i = floor(p), fr = fract(p);
  fr = fr * fr * (3.0 - 2.0 * fr);
  return mix(mix(hash(i, s),                 hash(i + vec2(1.0, 0.0), s), fr.x),
             mix(hash(i + vec2(0.0, 1.0), s), hash(i + vec2(1.0, 1.0), s), fr.x), fr.y);
}

float sdBox(vec2 p, vec2 c, vec2 h) {
  vec2 d = abs(p - c) - h;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float angDist(float a, float b) {
  float d = mod(abs(a - b), TAU);
  return min(d, TAU - d);
}

float corePeak(float tip) {
  return min(uUnit * (${f(CORE_A)} + ${f(CORE_B)} * clamp(tip / uUnit, ${f(CORE_TIP_MIN)}, ${f(CORE_TIP_MAX)})),
             ${f(CORE_CAP)} * uUnit);
}

float rayDist(vec2 q, float a, float tip, float base) {
  vec2 dir = vec2(cos(a), sin(a));
  float along = dot(q, dir);
  float perp = abs(q.x * dir.y - q.y * dir.x);
  float t = clamp((along - base) / max(1.0, tip - base), 0.0, 1.0);
  float w0 = ${f(RAY_W0)} * uUnit, wt = ${f(RAY_WTIP)} * uUnit;
  float hw = 0.5 * (wt + (w0 - wt) * pow(1.0 - t, ${f(RAY_TAPER)}));
  vec2 d = vec2(max(base - along, along - tip), perp - hw);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float coverage(float d, float sigma) {
  float c = 1.0 / (1.0 + exp(clamp(d * 1.702 / sigma, -20.0, 20.0)));
  if (d > 0.0) {
    c = max(c, ${f(SPATTER)} * exp(-d / (${f(SPATTER_DECAY)} * uUnit)));
  }
  return c;
}

float grainStep(vec2 p, float s) {
  float h = hash(p, s);
  return floor(h * h * 3.0);
}

${makeSceneGlsl("A")}
${makeSceneGlsl("B")}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float wob = ${f(WOBBLE_SCALE)} * uUnit;

  // Hoisted pointer term at top of main to satisfy GLSL ES 1.0 declaration order
  float near = uCursor.z * (1.0 - smoothstep(0.0, ${f(CURSOR_R)} * uUnit,
                                             distance(p, uCursor.xy)));

  vec3 col = uPaper - grainStep(p, uSeed + 71.3) * uGrain.x;

  vec2 rc = vec2((uRect.x + uRect.z) * 0.5, (uRect.y + uRect.w) * 0.5);
  vec2 rh = vec2((uRect.z - uRect.x) * 0.5, (uRect.w - uRect.y) * 0.5);
  float dp = sdBox(p, rc, rh)
           + (vnoise(p / wob, uSeed + 11.0) - 0.5) * 2.0 * ${f(WOBBLE_PLATE)} * uUnit;
  if (hash(p, uSeed + 3.7) < coverage(dp, ${f(SPRAY_PLATE)} * uUnit)) {
    col = uPlate - grainStep(p, uSeed + 91.1) * uGrain.y * (1.0 + ${f(CURSOR_GRAIN)} * near);
  }

  float dbA = evalScene_A(p, uSceneA)
           + (vnoise(p / wob, uSeed + 29.0) - 0.5) * 2.0 * ${f(WOBBLE_INK)} * uUnit;
  float covA = coverage(dbA, uSprayIA * (1.0 + ${f(CURSOR_SPRAY)} * near));

  float cov = covA;
  if (uFade > 0.001) {
    float dbB = evalScene_B(p, uSceneB)
             + (vnoise(p / wob, uSeed + 43.0) - 0.5) * 2.0 * ${f(WOBBLE_INK)} * uUnit;
    float covB = coverage(dbB, uSprayIB * (1.0 + ${f(CURSOR_SPRAY)} * near));
    cov = mix(covA, covB, uFade);
  }

  if (hash(p, uSeed + 5.1) < cov) {
    col = uInk - grainStep(p, uSeed + 53.9) * uGrain.z * (1.0 + ${f(CURSOR_GRAIN)} * near);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

function lerpAngle(a: number, b: number, t: number): number {
  const d = (((b - a + Math.PI) % TAU) + TAU) % TAU - Math.PI;
  return a + d * t;
}

function turnDelta(a: number, b: number): number {
  return b - a - Math.round(b - a);
}

function lerpRGB(a: RGB, b: RGB, t: number): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function poseCentre(pose: Pose, rect: Rect): [number, number] {
  const hw = (rect.x1 - rect.x0) * 0.5;
  const hh = (rect.y1 - rect.y0) * 0.5;
  return [
    rect.x0 + hw + pose.u * STATION * hw,
    rect.y0 + hh + pose.v * STATION * hh,
  ];
}

function poseRays(pose: Pose, cx: number, cy: number, rect: Rect): number[] {
  const norm = (a: number) => ((a % TAU) + TAU) % TAU;
  let out: number[];
  if (pose.corner) {
    const fx = pose.u > 0 ? rect.x0 : rect.x1;
    const fy = pose.v > 0 ? rect.y0 : rect.y1;
    const far = Math.atan2(fy - cy, fx - cx);
    out = [...FAN.map((o) => far + o * DEG), far + Math.PI];
  } else {
    const corners: [number, number][] = [
      [rect.x1, rect.y1],
      [rect.x0, rect.y1],
      [rect.x0, rect.y0],
      [rect.x1, rect.y0],
    ];
    out = [
      0,
      Math.PI / 2,
      Math.PI,
      -Math.PI / 2,
      ...corners.map(([x, y]) => Math.atan2(y - cy, x - cx)),
    ];
  }
  return out.map(norm).sort((a, b) => a - b);
}

function tipRadius(cx: number, cy: number, a: number, r: Rect): number {
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  let t = Infinity;
  if (dx > 1e-6) t = Math.min(t, (r.x1 - cx) / dx);
  else if (dx < -1e-6) t = Math.min(t, (r.x0 - cx) / dx);
  if (dy > 1e-6) t = Math.min(t, (r.y1 - cy) / dy);
  else if (dy < -1e-6) t = Math.min(t, (r.y0 - cy) / dy);
  return Number.isFinite(t) ? t : 0;
}

function samplePaletteWithTransition(
  palettes: Palette[],
  slot: number,
  k: number,
  isFixed = false,
): { paper: RGB; plate: [number, number, number]; ink: [number, number, number] } {
  const curr = palettes[slot];
  if (isFixed || k < SCENE_FRAMES - FADE_FRAMES) {
    return {
      paper: curr.paper,
      plate: [curr.plate[0], curr.plate[1], curr.plate[2]],
      ink: [curr.ink[0], curr.ink[1], curr.ink[2]],
    };
  }
  const nextSlot = (slot + 1) % SCENE_COUNT;
  const next = palettes[nextSlot];
  const progress = (k - (SCENE_FRAMES - FADE_FRAMES) + 1) / (FADE_FRAMES + 1);
  // Smooth cubic ease for seamless color gliding
  const t = progress * progress * (3 - 2 * progress);
  return {
    paper: curr.paper, // paper stays rock-solid within theme
    plate: lerpRGB(curr.plate, next.plate, t),
    ink: lerpRGB(curr.ink, next.ink, t),
  };
}

export class SprayBurst {
  ok = false;

  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private quad: WebGLBuffer | null = null;
  private syncTex: WebGLTexture | null = null;
  private u: Record<string, WebGLUniformLocation | null> = {};

  private raf = 0;
  private running = false;
  private start0 = 0;
  private lastFrame = -1;

  private rect: Rect = { x0: 0, y0: 0, x1: 0, y1: 0 };
  private unit = 1;

  private anglesA = new Float32Array(8);
  private tipsA = new Float32Array(8);
  private anglesB = new Float32Array(8);
  private tipsB = new Float32Array(8);

  private px = 0;
  private py = 0;
  private over = false;
  private cursor = 0;
  private lastT = 0;
  private star = { cx: 0, cy: 0, a: new Float32Array(8), t: new Float32Array(8) };

  // Theme management with smooth transition damping
  private isDark = true;
  private isGray = false;
  private bare = false;
  private fixedScene: number | null = null;
  private themeProgress = 1.0; // 0.0 = full light, 1.0 = full dark

  constructor(
    canvas: HTMLCanvasElement,
    isDark = true,
    isGray = false,
    bare = false,
    fixedScene: number | null = null,
  ) {
    this.canvas = canvas;
    this.isDark = isDark;
    this.isGray = isGray;
    this.bare = bare;
    this.fixedScene = fixedScene;
    this.themeProgress = isDark ? 1.0 : 0.0;

    const gl =
      (canvas.getContext("webgl", {
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
      }) as WebGLRenderingContext | null) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;
    this.gl = gl;

    const prog = this.link(VERT, FRAG);
    if (!prog) return;
    this.prog = prog;

    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    for (const n of [
      "uRes", "uRect", "uUnit", "uSeed",
      "uPaper", "uPlate", "uInk", "uGrain", "uCursor",
      "uSceneA", "uSceneB", "uFade",
      "uCA", "uCB", "uSprayIA", "uSprayIB",
      "uSyncTex",
    ]) {
      this.u[n] = gl.getUniformLocation(prog, n);
    }
    this.u.uA = gl.getUniformLocation(prog, "uA[0]");
    this.u.uT = gl.getUniformLocation(prog, "uT[0]");
    this.u.uB = gl.getUniformLocation(prog, "uB[0]");
    this.u.uTB = gl.getUniformLocation(prog, "uTB[0]");

    const syncTex = gl.createTexture();
    if (syncTex) {
      this.syncTex = syncTex;
      const sdfData = getSyncLogoSdfData();
      gl.bindTexture(gl.TEXTURE_2D, syncTex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.LUMINANCE,
        256,
        256,
        0,
        gl.LUMINANCE,
        gl.UNSIGNED_BYTE,
        sdfData,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    this.ok = true;
    this.resize();
  }

  setTheme(isDark: boolean, immediate = false) {
    this.isDark = isDark;
    if (immediate) {
      this.themeProgress = isDark ? 1.0 : 0.0;
      if (!this.running) this.renderStill();
    }
  }

  setGray(isGray: boolean) {
    if (this.isGray !== isGray) {
      this.isGray = isGray;
      if (!this.running) this.renderStill();
    }
  }

  setBare(bare: boolean) {
    if (this.bare !== bare) {
      this.bare = bare;
      this.resize();
      if (!this.running) this.renderStill();
    }
  }

  setFixedScene(scene: number | null) {
    if (this.fixedScene !== scene) {
      this.fixedScene = scene;
      if (!this.running) this.renderStill();
    }
  }

  private compile(type: number, src: string): WebGLShader | null {
    const gl = this.gl;
    if (!gl) return null;
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  private link(vs: string, fs: string): WebGLProgram | null {
    const gl = this.gl;
    if (!gl) return null;
    const v = this.compile(gl.VERTEX_SHADER, vs);
    const f2 = this.compile(gl.FRAGMENT_SHADER, fs);
    if (!v || !f2) return null;
    const p = gl.createProgram();
    if (!p) return null;
    gl.attachShader(p, v);
    gl.attachShader(p, f2);
    gl.linkProgram(p);
    gl.deleteShader(v);
    gl.deleteShader(f2);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      gl.deleteProgram(p);
      return null;
    }
    gl.useProgram(p);
    return p;
  }

  resize() {
    const gl = this.gl;
    if (!gl || !this.ok) return;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    gl.viewport(0, 0, w, h);

    if (this.bare) {
      // Full bleed: plate and drawings completely envelop all 4 corners
      const bleed = 6 * dpr;
      this.rect = { x0: -bleed, y0: -bleed, x1: w + bleed, y1: h + bleed };
      this.unit = Math.min(w, h) * 0.52;
    } else {
      const m = h * MARGIN;
      this.rect = { x0: m, y0: m, x1: w - m, y1: h - m };
      this.unit = (this.rect.y1 - this.rect.y0) * 0.5;
    }
    this.lastFrame = -1;
  }

  private starFrame(k0: number, out: { cx: number; cy: number; a: Float32Array; t: Float32Array }) {
    const beat = Math.floor(k0 / BEAT) % STAR_STATIONS;
    const k = k0 % BEAT;

    let from = beat;
    let to = beat;
    let p = 1;
    if (k >= TRANSIT_OUT) {
      to = (beat + 1) % STAR_STATIONS;
      p = TRANSIT[k - TRANSIT_OUT];
    } else if (k < TRANSIT.length - TRANSIT_SPLIT) {
      from = (beat + STAR_STATIONS - 1) % STAR_STATIONS;
      p = TRANSIT[k + TRANSIT_SPLIT];
    }

    const [ax, ay] = poseCentre(POSES[STAR_TOUR[from]], this.rect);
    const [bx, by] = poseCentre(POSES[STAR_TOUR[to]], this.rect);
    out.cx = ax + (bx - ax) * p;
    out.cy = ay + (by - ay) * p;

    const ra = poseRays(POSES[STAR_TOUR[from]], ax, ay, this.rect);
    const rb = poseRays(POSES[STAR_TOUR[to]], bx, by, this.rect);

    const grow = TIP_GROW * this.unit;
    const tipRect: Rect = {
      x0: this.rect.x0 - grow,
      y0: this.rect.y0 - grow,
      x1: this.rect.x1 + grow,
      y1: this.rect.y1 + grow,
    };
    for (let i = 0; i < 8; i++) {
      const a = lerpAngle(ra[i], rb[i], p);
      out.a[i] = a;
      out.t[i] = tipRadius(out.cx, out.cy, a, tipRect);
    }
  }

  private computeScene(
    scene: number,
    k: number,
    u: number,
    angles: Float32Array,
    tips: Float32Array,
  ): { cx: number; cy: number } {
    const paced = (tbl: number[], beats: number) => {
      const b = u * beats;
      return Math.floor(b) + ease(tbl, b % 1);
    };

    const amt = this.cursor * CURSOR_AMOUNT[scene];
    const gesture = CURSOR_GESTURE[scene];
    const localR = CURSOR_LOCAL_R * this.unit;

    const nearness = (x: number, y: number) =>
      Math.max(0, 1 - Math.hypot(x - this.px, y - this.py) / localR);

    let cx = (this.rect.x0 + this.rect.x1) * 0.5;
    let cy = (this.rect.y0 + this.rect.y1) * 0.5;

    if (scene === 0) {
      this.starFrame(k, this.star);
      cx = this.star.cx;
      cy = this.star.cy;
      angles.set(this.star.a);
      tips.set(this.star.t);

      if (gesture === "reach" && amt > 0) {
        const toCur = Math.atan2(this.py - cy, this.px - cx);
        for (let i = 0; i < 8; i++) {
          const align = Math.max(0, Math.cos(angles[i] - toCur));
          tips[i] *= 1 + amt * align * align;
        }
      }
    } else if (scene === 1) {
      cx += RING_OFF[0] * this.unit;
      cy += RING_OFF[1] * this.unit;

      const g = paced(SNAP, RING_BEATS);
      const toCur = Math.atan2(this.py - cy, this.px - cx) / TAU;
      for (let i = 0; i < RING_SPIN.length; i++) {
        const own = RING_GAP_AT[i] + RING_SPIN[i] * g;
        angles[i] = own + amt * turnDelta(own, toCur);
      }
    } else if (scene === 2) {
      const reach = Math.max(...BAR_L) * this.unit;
      const span = this.rect.x1 - this.rect.x0 + 2 * reach;
      for (let i = 0; i < BAR_V.length; i++) {
        const b = u * BAR_BEATS + BAR_OFF[i];
        const g = Math.floor(b) + ease(SNAP, b % 1);
        const t = ((BAR_V[i] * g) % 1 + 1) % 1;
        const x = this.rect.x0 - reach + t * span;

        angles[i] =
          x +
          amt *
            nearness(
              x,
              this.rect.y0 +
                (this.rect.y1 - this.rect.y0) * 0.5 +
                BAR_Y[i] * this.unit,
            ) *
            (this.px - x);
      }
    } else if (scene === 3) {
      const g = paced(GLIDE, DISC_BEATS);
      for (let i = 0; i < DISC_R.length; i++) {
        const th = (DISC_PHASE[i] + DISC_SPIN[i] * g) * TAU;
        let x = cx + Math.cos(th) * DISC_OX[i] * this.unit;
        let y = cy + Math.sin(th) * DISC_OY[i] * this.unit;

        const pull = amt * nearness(x, y) * (DISC_R[0] / DISC_R[i]);
        x += pull * (this.px - x);
        y += pull * (this.py - y);
        angles[i] = x;
        tips[i] = y;
      }
    } else if (scene === 4) {
      let g = WEDGE_SPIN * paced(SNAP, WEDGE_BEATS);

      if (amt > 0) {
        const toCur = Math.atan2(this.py - cy, this.px - cx) / TAU;
        let best = 0;
        for (let i = 0; i < WEDGE_AT.length; i++) {
          const d = turnDelta(WEDGE_AT[i] + g, toCur);
          if (Math.abs(d) < Math.abs(best) || i === 0) best = d;
        }
        g += amt * best;
      }
      for (let i = 0; i < WEDGE_AT.length; i++) angles[i] = WEDGE_AT[i] + g;
    } else if (scene === 5) {
      const th = DOT_ANGLE * TAU;
      angles[0] = DOT_SPEED * paced(GLIDE, DOT_BEATS);
      angles[1] = Math.cos(th) * DOT_FREQ * DOT_STEP;
      angles[2] = Math.sin(th) * DOT_FREQ * DOT_STEP;
      angles[3] = amt;
    } else if (scene === 6) {
      // Concentric breathing diamonds
      const spin = paced(SNAP, 2) * 0.12 * TAU;
      angles[0] = spin;
      angles[1] = u * 2.0 * TAU;
      angles[2] = amt;
    } else if (scene === 7) {
      // Swiss crosses
      const rot = paced(SNAP, 2) * 0.25 * TAU;
      angles[0] = rot;
      angles[1] = u * 2.0 * TAU;
      angles[2] = amt;
    } else if (scene === 8) {
      // Hexagon labyrinth
      const hexSpin = [0.4, -0.6, 0.75, -0.35];
      const g = paced(SNAP, 2);
      for (let i = 0; i < 4; i++) {
        angles[i] = i * 0.25 + hexSpin[i] * g;
      }
    } else if (scene === 9) {
      // Harmonic contour waves
      angles[0] = u * 2.0 * TAU;
      angles[1] = 3.2 / this.unit;
      angles[2] = amt;
    } else if (scene === 10) {
      // SYNC Monogram with idle breathing, floating levitation, micro-rotation tilt, radiating echoes, and cursor reactivity
      cy = this.rect.y0 + (this.rect.y1 - this.rect.y0) * 0.44;

      const beatU = (k % SCENE_FRAMES) / SCENE_FRAMES;

      // 1. Organic gentle breathing scale (loops seamlessly)
      const breath = 1.0 + 0.035 * Math.sin(beatU * TAU * 2.0);
      const size = 1.34 * this.unit * breath;

      // 2. Gentle floating levitation (loops seamlessly)
      const floatY = Math.sin(beatU * TAU * 1.0) * (0.024 * this.unit);

      // 3. Subtle micro-rotation wobble (loops seamlessly)
      let rot = Math.sin(beatU * TAU * 1.0 + 0.4) * 0.02;

      // 4. Smooth harmonic wave expansion & return morph (100% seamless zero-velocity loop)
      const wave0 = 0.5 - 0.5 * Math.cos(beatU * TAU * 1.0);
      const wave1 = 0.5 - 0.5 * Math.cos(beatU * TAU * 1.0 - 0.35);
      const morph = 0.5 - 0.5 * Math.cos(beatU * TAU * 1.0);

      // 5. Cursor interactivity: subtle tilt and lean towards pointer
      if (amt > 0) {
        const toCur = Math.atan2(this.py - cy, this.px - cx);
        rot += amt * 0.04 * Math.sin(toCur);
        cx += (this.px - cx) * 0.05 * amt;
        cy += (this.py - cy) * 0.05 * amt;
      }

      angles[0] = rot;
      angles[1] = floatY;
      angles[2] = size;
      angles[3] = wave0;
      angles[4] = wave1;
      angles[5] = morph;
      angles[6] = amt;
      angles[7] = 0;
    }

    return { cx, cy };
  }

  private render(frame: number) {
    const gl = this.gl;
    if (!gl || !this.prog || gl.isContextLost()) return;

    const isFixed = this.fixedScene !== null;
    const slotA = isFixed
      ? (ORDER.indexOf(this.fixedScene!) >= 0 ? ORDER.indexOf(this.fixedScene!) : 0)
      : Math.floor(frame / SCENE_FRAMES) % SCENE_COUNT;
    const sceneA = isFixed ? this.fixedScene! : ORDER[slotA];
    const k = frame % SCENE_FRAMES;
    const u = k / SCENE_FRAMES;

    let uFade = 0;
    let slotB = slotA;
    let sceneB = sceneA;

    if (!isFixed && k >= SCENE_FRAMES - FADE_FRAMES) {
      slotB = (slotA + 1) % SCENE_COUNT;
      sceneB = ORDER[slotB];
      const progress = (k - (SCENE_FRAMES - FADE_FRAMES) + 1) / (FADE_FRAMES + 1);
      uFade = progress * progress * (3 - 2 * progress);
    }

    // Smooth inter-scene palette gliding and dual-theme interpolation
    const darkPalettes = this.isGray ? GRAY_DARK_PALETTES : DARK_PALETTES;
    const lightPalettes = this.isGray ? GRAY_LIGHT_PALETTES : LIGHT_PALETTES;
    const darkSample = samplePaletteWithTransition(darkPalettes, slotA, k, isFixed);
    const lightSample = samplePaletteWithTransition(lightPalettes, slotA, k, isFixed);

    const tp = this.themeProgress;
    const palPaper = lerpRGB(lightSample.paper, darkSample.paper, tp);
    const palPlate = [
      lightSample.plate[0] + (darkSample.plate[0] - lightSample.plate[0]) * tp,
      lightSample.plate[1] + (darkSample.plate[1] - lightSample.plate[1]) * tp,
      lightSample.plate[2] + (darkSample.plate[2] - lightSample.plate[2]) * tp,
    ];
    const palInk = [
      lightSample.ink[0] + (darkSample.ink[0] - lightSample.ink[0]) * tp,
      lightSample.ink[1] + (darkSample.ink[1] - lightSample.ink[1]) * tp,
      lightSample.ink[2] + (darkSample.ink[2] - lightSample.ink[2]) * tp,
    ];

    const centerA = this.computeScene(sceneA, k, u, this.anglesA, this.tipsA);
    let centerB = centerA;
    if (uFade > 0.001) {
      centerB = this.computeScene(sceneB, k, u, this.anglesB, this.tipsB);
    }

    gl.useProgram(this.prog);
    gl.uniform2f(this.u.uRes!, this.canvas.width, this.canvas.height);
    gl.uniform4f(
      this.u.uRect!,
      this.rect.x0,
      this.rect.y0,
      this.rect.x1,
      this.rect.y1,
    );
    gl.uniform1f(this.u.uUnit!, this.unit);
    gl.uniform3f(this.u.uPaper!, palPaper[0] / 255, palPaper[1] / 255, palPaper[2] / 255);
    gl.uniform3f(this.u.uPlate!, palPlate[0] / 255, palPlate[1] / 255, palPlate[2] / 255);
    gl.uniform3f(this.u.uInk!, palInk[0] / 255, palInk[1] / 255, palInk[2] / 255);
    gl.uniform3f(this.u.uCursor!, this.px, this.py, this.cursor);

    const gsA = GRAIN_SCALE[sceneA];
    const gsB = GRAIN_SCALE[sceneB];
    const gs = uFade > 0.001 ? gsA + (gsB - gsA) * uFade : gsA;
    gl.uniform3f(
      this.u.uGrain!,
      (GRAIN_PAPER * gs) / 255,
      (GRAIN_PLATE * gs) / 255,
      (GRAIN_INK * gs) / 255,
    );

    gl.uniform1f(this.u.uSeed!, frame * 7.13 + 0.5);

    // Scene A upload
    gl.uniform1i(this.u.uSceneA!, sceneA);
    gl.uniform2f(this.u.uCA!, centerA.cx, centerA.cy);
    gl.uniform1f(this.u.uSprayIA!, SPRAY_INK * this.unit * SPRAY_SCALE[sceneA]);
    gl.uniform1fv(this.u.uA!, this.anglesA);
    gl.uniform1fv(this.u.uT!, this.tipsA);

    // Scene B upload
    gl.uniform1i(this.u.uSceneB!, sceneB);
    gl.uniform2f(this.u.uCB!, centerB.cx, centerB.cy);
    gl.uniform1f(this.u.uSprayIB!, SPRAY_INK * this.unit * SPRAY_SCALE[sceneB]);
    gl.uniform1fv(this.u.uB!, this.anglesB);
    gl.uniform1fv(this.u.uTB!, this.tipsB);

    // Fade factor upload
    gl.uniform1f(this.u.uFade!, uFade);

    if (this.syncTex) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.syncTex);
      if (this.u.uSyncTex) {
        gl.uniform1i(this.u.uSyncTex, 0);
      }
    }

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private frame = (now: number) => {
    if (!this.running) return;
    if (!this.start0) this.start0 = now;

    const dt = this.lastT ? Math.min((now - this.lastT) / 1000, 0.05) : 0;
    this.lastT = now;
    const target = this.over ? 1 : 0;
    const targetTheme = this.isDark ? 1.0 : 0.0;

    if (dt > 0) {
      this.cursor += (target - this.cursor) * (1 - Math.exp(-dt / CURSOR_EASE));
      // Smooth theme damping transition
      this.themeProgress += (targetTheme - this.themeProgress) * (1 - Math.exp(-dt / 0.25));
    }

    const cursorMoving = Math.abs(this.cursor - target) > 0.001;
    const themeChanging = Math.abs(this.themeProgress - targetTheme) > 0.001;
    const idx = Math.floor(((now - this.start0) / 1000) * FPS) % TOTAL;

    if (idx !== this.lastFrame || cursorMoving || themeChanging) {
      this.lastFrame = idx;
      this.render(idx);
    }
    this.raf = requestAnimationFrame(this.frame);
  };

  start() {
    if (!this.ok || this.running) return;
    this.running = true;
    this.start0 = performance.now() - (this.lastFrame < 0 ? 0 : (this.lastFrame / FPS) * 1000);
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  setPointer(x: number | null, y: number | null) {
    if (x == null || y == null) {
      this.over = false;
      return;
    }
    const scale = this.canvas.width / Math.max(1, this.canvas.clientWidth);
    this.px = x * scale;
    this.py = y * scale;
    this.over = true;
  }

  renderStill() {
    if (!this.ok) return;
    const still =
      this.fixedScene !== null
        ? (ORDER.indexOf(this.fixedScene) >= 0
            ? ORDER.indexOf(this.fixedScene) * SCENE_FRAMES + 6
            : 6)
        : STILL_FRAME;
    this.lastFrame = still;
    this.render(still);
  }

  destroy() {
    this.stop();
    const gl = this.gl;
    if (gl) {
      if (this.syncTex) {
        gl.deleteTexture(this.syncTex);
        this.syncTex = null;
      }
      if (this.quad) gl.deleteBuffer(this.quad);
      if (this.prog) gl.deleteProgram(this.prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
    this.gl = null;
    this.prog = null;
    this.ok = false;
  }
}
