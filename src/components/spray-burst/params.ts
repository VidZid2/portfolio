export const FPS = 24;

export const BEAT = 24;

export const SCENE_MS = 3000;
export const SCENE_FRAMES = (SCENE_MS / 1000) * FPS;
export const SCENE_COUNT = 11;
export const FADE_FRAMES = 18;

export const TOTAL = SCENE_FRAMES * SCENE_COUNT;

export const STAR_STATIONS = 3;

export const ORDER = [10, 1, 6, 4, 7, 0, 9, 5, 8, 2, 3];

export const TRANSIT = [
  0.022, 0.055, 0.1, 0.187, 0.679, 0.882, 0.937, 0.97, 0.987, 1.0,
];

export const TRANSIT_OUT = 20;

export const TRANSIT_SPLIT = BEAT - TRANSIT_OUT;

export const STATION = 0.553;

export interface Pose {
  u: number;
  v: number;
  corner: boolean;
}

export const POSES: Pose[] = [
  { u: -1, v: -1, corner: true },
  { u: 1, v: -1, corner: true },
  { u: 1, v: 1, corner: true },
  { u: -1, v: 1, corner: true },
  { u: 0, v: 0, corner: false },
];

export const FAN = [-100.4, -67.6, -28.4, 0, 28.4, 67.6, 100.4];

export const MARGIN = 0.108;

export const CORE_TROUGH = 0.388;

export const CORE_A = 0.167;
export const CORE_B = 0.252;

export const CORE_CAP = 0.62;

export const CORE_TIP_MIN = 1.15;
export const CORE_TIP_MAX = 1.6;

export const BAND = 0.143;

export const CORE_FALLOFF = 1.6;

export const RAY_W0 = 0.388;
export const RAY_WTIP = 0.026;

export const RAY_TAPER = 1.05;

export const TIP_GROW = 0.051;

export const SPRAY_INK = 0.028;
export const SPRAY_PLATE = 0.033;

export const SPRAY_SCALE = [
  1.0,
  0.72,
  1.15,
  1.3,
  0.85,
  1.5,
  0.9,
  1.1,
  0.8,
  1.25,
  0.85,
];

export const GRAIN_SCALE = [1.0, 0.9, 1.35, 1.1, 0.8, 0.6, 0.95, 1.15, 0.85, 1.05, 1.0];

export const SPATTER = 0.02;
export const SPATTER_DECAY = 0.056;

export const WOBBLE_INK = 0.0128;
export const WOBBLE_PLATE = 0.0153;

export const WOBBLE_SCALE = 0.0714;

export const GRAIN_PAPER = 1;
export const GRAIN_PLATE = 4;
export const GRAIN_INK = 1;

export type RGB = readonly [number, number, number];

export interface Palette {
  paper: RGB;
  plate: RGB;
  ink: RGB;
}

// Strictly Cornflower Blue (#6495ED / [100, 149, 237]), White ([255, 255, 255]), and Black ([9, 9, 11])
const CORNFLOWER_BLUE: RGB = [100, 149, 237];
const WHITE: RGB = [255, 255, 255];
const DARK_BLACK: RGB = [9, 9, 11];
const DARK_PLATE: RGB = [24, 27, 36]; // subtle dark charcoal plate contrast
const LIGHT_PLATE: RGB = [236, 240, 248]; // subtle light plate tint

export const DARK_PALETTES: Palette[] = [
  // Slot 0 (rings): Cornflower blue rings on dark plate, black paper
  { paper: DARK_BLACK, plate: DARK_PLATE, ink: CORNFLOWER_BLUE },
  // Slot 1 (wedges): White pinwheel wedges on cornflower blue plate, black paper
  { paper: DARK_BLACK, plate: CORNFLOWER_BLUE, ink: WHITE },
  // Slot 2 (starburst): Dark black touring starburst on cornflower blue plate, black paper
  { paper: DARK_BLACK, plate: CORNFLOWER_BLUE, ink: DARK_BLACK },
  // Slot 3 (dots): Cornflower blue halftone field on white plate, black paper
  { paper: DARK_BLACK, plate: WHITE, ink: CORNFLOWER_BLUE },
  // Slot 4 (bars): White sliding bars on cornflower blue plate, black paper
  { paper: DARK_BLACK, plate: CORNFLOWER_BLUE, ink: WHITE },
  // Slot 5 (discs): Cornflower blue fusing discs on dark plate, black paper
  { paper: DARK_BLACK, plate: DARK_PLATE, ink: CORNFLOWER_BLUE },
  // Slot 6 (diamonds): White concentric diamonds on cornflower blue plate, black paper
  { paper: DARK_BLACK, plate: CORNFLOWER_BLUE, ink: WHITE },
  // Slot 7 (crosses): Cornflower blue Swiss crosses on dark plate, black paper
  { paper: DARK_BLACK, plate: DARK_PLATE, ink: CORNFLOWER_BLUE },
  // Slot 8 (hex maze): White nested hexagons on cornflower blue plate, black paper
  { paper: DARK_BLACK, plate: CORNFLOWER_BLUE, ink: WHITE },
  // Slot 9 (waves): Cornflower blue harmonic waves on white plate, black paper
  { paper: DARK_BLACK, plate: WHITE, ink: CORNFLOWER_BLUE },
  // Slot 10 (SYNC logo): Cornflower blue SYNC monogram on dark plate, black paper
  { paper: DARK_BLACK, plate: DARK_PLATE, ink: CORNFLOWER_BLUE },
];

export const LIGHT_PALETTES: Palette[] = [
  // Slot 0 (rings): Cornflower blue rings on soft plate, white paper
  { paper: WHITE, plate: LIGHT_PLATE, ink: CORNFLOWER_BLUE },
  // Slot 1 (wedges): Black pinwheel wedges on cornflower blue plate, white paper
  { paper: WHITE, plate: CORNFLOWER_BLUE, ink: DARK_BLACK },
  // Slot 2 (starburst): White touring starburst on cornflower blue plate, white paper
  { paper: WHITE, plate: CORNFLOWER_BLUE, ink: WHITE },
  // Slot 3 (dots): Cornflower blue halftone field on black plate, white paper
  { paper: WHITE, plate: DARK_BLACK, ink: CORNFLOWER_BLUE },
  // Slot 4 (bars): Black sliding bars on cornflower blue plate, white paper
  { paper: WHITE, plate: CORNFLOWER_BLUE, ink: DARK_BLACK },
  // Slot 5 (discs): Cornflower blue fusing discs on soft plate, white paper
  { paper: WHITE, plate: LIGHT_PLATE, ink: CORNFLOWER_BLUE },
  // Slot 6 (diamonds): Black concentric diamonds on cornflower blue plate, white paper
  { paper: WHITE, plate: CORNFLOWER_BLUE, ink: DARK_BLACK },
  // Slot 7 (crosses): Cornflower blue Swiss crosses on soft plate, white paper
  { paper: WHITE, plate: LIGHT_PLATE, ink: CORNFLOWER_BLUE },
  // Slot 8 (hex maze): Black nested hexagons on cornflower blue plate, white paper
  { paper: WHITE, plate: CORNFLOWER_BLUE, ink: DARK_BLACK },
  // Slot 9 (waves): Cornflower blue harmonic waves on soft plate, white paper
  { paper: WHITE, plate: LIGHT_PLATE, ink: CORNFLOWER_BLUE },
  // Slot 10 (SYNC logo): Cornflower blue SYNC monogram on soft plate, white paper
  { paper: WHITE, plate: LIGHT_PLATE, ink: CORNFLOWER_BLUE },
];

export const GRAY_DARK_PALETTES: Palette[] = [
  // Slot 0 (rings): Silver/gray rings on charcoal plate, black paper
  { paper: DARK_BLACK, plate: [26, 26, 30], ink: [160, 160, 170] },
  // Slot 1 (wedges): White wedges on dark plate, black paper
  { paper: DARK_BLACK, plate: [36, 36, 42], ink: [240, 240, 245] },
  // Slot 2 (starburst): Dark black starburst on medium gray plate, black paper
  { paper: DARK_BLACK, plate: [80, 80, 90], ink: DARK_BLACK },
  // Slot 3 (dots): Dark dots on light gray plate, black paper
  { paper: DARK_BLACK, plate: [180, 180, 190], ink: [30, 30, 35] },
  // Slot 4 (bars): White bars on dark plate, black paper
  { paper: DARK_BLACK, plate: [40, 40, 46], ink: WHITE },
  // Slot 5 (discs): Silver fusing discs on charcoal plate, black paper
  { paper: DARK_BLACK, plate: [26, 26, 30], ink: [150, 150, 160] },
  // Slot 6 (diamonds): White diamonds on dark gray plate, black paper
  { paper: DARK_BLACK, plate: [48, 48, 54], ink: WHITE },
  // Slot 7 (crosses): Silver crosses on dark plate, black paper
  { paper: DARK_BLACK, plate: [28, 28, 32], ink: [180, 180, 190] },
  // Slot 8 (hex maze): White hexagons on medium charcoal plate, black paper
  { paper: DARK_BLACK, plate: [42, 42, 48], ink: WHITE },
  // Slot 9 (waves): Silver waves on charcoal plate, black paper
  { paper: DARK_BLACK, plate: [30, 30, 34], ink: [160, 160, 170] },
  // Slot 10 (SYNC logo): Silver SYNC monogram on charcoal plate, black paper
  { paper: DARK_BLACK, plate: [26, 26, 30], ink: [160, 160, 170] },
];

export const GRAY_LIGHT_PALETTES: Palette[] = [
  // Slot 0 (rings): Medium gray rings on soft light plate, white paper
  { paper: WHITE, plate: [230, 230, 236], ink: [90, 90, 100] },
  // Slot 1 (wedges): Dark gray wedges on soft plate, white paper
  { paper: WHITE, plate: [235, 235, 240], ink: [35, 35, 40] },
  // Slot 2 (starburst): White starburst on medium gray plate, white paper
  { paper: WHITE, plate: [140, 140, 150], ink: WHITE },
  // Slot 3 (dots): Dark gray dots on light plate, white paper
  { paper: WHITE, plate: [225, 225, 230], ink: [60, 60, 70] },
  // Slot 4 (bars): Black bars on light plate, white paper
  { paper: WHITE, plate: [230, 230, 236], ink: DARK_BLACK },
  // Slot 5 (discs): Medium gray discs on soft plate, white paper
  { paper: WHITE, plate: [230, 230, 236], ink: [90, 90, 100] },
  // Slot 6 (diamonds): Dark gray diamonds on soft plate, white paper
  { paper: WHITE, plate: [230, 230, 236], ink: [40, 40, 48] },
  // Slot 7 (crosses): Charcoal crosses on soft plate, white paper
  { paper: WHITE, plate: [232, 232, 238], ink: [50, 50, 60] },
  // Slot 8 (hex maze): Dark gray hexagons on light plate, white paper
  { paper: WHITE, plate: [235, 235, 240], ink: [38, 38, 45] },
  // Slot 9 (waves): Medium gray waves on soft plate, white paper
  { paper: WHITE, plate: [230, 230, 236], ink: [85, 85, 95] },
  // Slot 10 (SYNC logo): Medium gray SYNC monogram on soft light plate, white paper
  { paper: WHITE, plate: [230, 230, 236], ink: [90, 90, 100] },
];

export const PALETTES: Palette[] = DARK_PALETTES;

export const CARD_BG_DARK: RGB = DARK_PALETTES[0].paper;
export const CARD_BG_LIGHT: RGB = LIGHT_PALETTES[0].paper;
export const CARD_BG = CARD_BG_DARK;

export const SNAP = [0.0, 0.012, 0.03, 0.055, 0.09, 0.42, 0.78, 0.9, 0.955, 0.985, 1.0];

export const GLIDE = [0.0, 0.03, 0.08, 0.17, 0.34, 0.62, 0.82, 0.92, 0.97, 1.0];

export function ease(table: number[], u: number): number {
  const n = table.length - 1;
  const x = Math.min(Math.max(u, 0), 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  return table[i] + (table[i + 1] - table[i]) * (x - i);
}

export const RING_BEATS = 2;
export const BAR_BEATS = 2;
export const DISC_BEATS = 1;
export const WEDGE_BEATS = 3;
export const DOT_BEATS = 2;

export const RING_R = [0.3, 0.47, 0.64, 0.82, 1.02];
export const RING_W = [0.055, 0.038, 0.062, 0.03, 0.045];

export const RING_GAP_AT = [0.0, 0.31, 0.62, 0.14, 0.79];
export const RING_GAP_W = [0.12, 0.2, 0.09, 0.16, 0.13];

export const RING_SPIN = [0.35, -0.52, 0.81, -0.29, 0.63];

export const RING_OFF: [number, number] = [0, 0];

export const BAR_Y = [-0.78, -0.44, -0.12, 0.19, 0.5, 0.84];
export const BAR_H = [0.028, 0.062, 0.021, 0.045, 0.034, 0.055];
export const BAR_L = [0.52, 0.78, 0.34, 0.95, 0.61, 0.44];
export const BAR_V = [0.9, -1.4, 1.9, -0.7, 1.2, -1.6];

export const BAR_OFF = [0.0, 0.17, 0.34, 0.5, 0.67, 0.83];

export const DISC_R = [0.42, 0.16, 0.11, 0.2, 0.09, 0.14, 0.07];
export const DISC_OX = [0.05, 0.62, 0.78, 0.52, 0.88, 0.7, 0.95];
export const DISC_OY = [0.04, 0.4, 0.62, 0.72, 0.3, 0.55, 0.48];
export const DISC_SPIN = [0.18, 0.62, -0.44, 0.35, -0.71, 0.51, -0.28];
export const DISC_PHASE = [0.0, 0.12, 0.38, 0.55, 0.71, 0.84, 0.93];

export const WEDGE_COUNT = 7;

export const WEDGE_W = [0.052, 0.031, 0.068, 0.024, 0.045, 0.06, 0.037];

export const WEDGE_AT = [0.0, 0.13, 0.27, 0.41, 0.56, 0.7, 0.86];

export const WEDGE_SPIN = 0.22;

export const WEDGE_R0 = 0.22;
export const WEDGE_R1 = 1.25;

export const DOT_INSET = 0.05;

export const DOT_STEP = 0.26;
export const DOT_MAX = 0.44;

export const DOT_MIN = 0.06;

export const DOT_FREQ = 1.35;
export const DOT_ANGLE = 0.08;
export const DOT_SPEED = 1.0;

export const CURSOR_R = 1.6;

export const CURSOR_SPRAY = 0.35;
export const CURSOR_GRAIN = 0.5;

export type Gesture = "reach" | "face" | "aim" | "drag" | "gather" | "swell";

export const CURSOR_GESTURE: Gesture[] = [
  "reach",
  "face",
  "drag",
  "gather",
  "aim",
  "swell",
  "face",
  "reach",
  "aim",
  "drag",
  "reach",
];

export const CURSOR_AMOUNT = [0.55, 0.7, 0.45, 0.5, 0.6, 0.8, 0.65, 0.5, 0.6, 0.7, 0.6];

export const CURSOR_LOCAL_R = 1.1;

export const CURSOR_EASE = 0.28;
