import { getAudioContext, getMasterBus } from "./sound-engine";
import { getSoundEnabled } from "@/hooks/use-sound";

// Debounce trackers to prevent audio fatigue and spam
let lastHoverTime = 0;
let lastClickTime = 0;
let lastTabTime = 0;
let lastKeyTickTime = 0;
let lastModalTime = 0;
let lastToastOutTime = 0;
let lastAccordionTime = 0;

// Organic micro-pitch round-robin variations to prevent machine-gun ear fatigue
let hoverPitchIndex = 0;
const HOVER_PITCH_RATIOS = [1.0, 1.028, 0.975, 1.036, 0.985];

let clickPitchIndex = 0;
const CLICK_PITCH_RATIOS = [1.0, 0.985, 1.018, 0.992];

let keyPitchIndex = 0;
const KEY_PITCH_RATIOS = [1.0, 0.97, 1.03];

/**
 * Ultra-smooth, satisfying tactile haptic hover tick.
 * Multi-layer acoustic physics:
 * 1. Crisp micro-transient mechanical stem click (12ms exponential ramp through bandpass filter).
 * 2. Warm velvety sub-body resonator (gives physical mass and depth).
 * 3. High-precision silk air impulse (gives spatial tactile presence without harshness).
 * 4. Micro-pitch round-robin eliminates ear fatigue when rapidly scrubbing menus and lists.
 */
export function playHoverTick(volume: number = 0.055) {
  if (!getSoundEnabled()) return;

  const now = Date.now();
  if (now - lastHoverTime < 36) return; // 36ms limiter for silky smooth scrubbing
  lastHoverTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const ratio = HOVER_PITCH_RATIOS[hoverPitchIndex % HOVER_PITCH_RATIOS.length];
    hoverPitchIndex++;

    // 1. High-precision tactile micro-transient (stem click)
    const osc1 = ctx.createOscillator();
    const filter1 = ctx.createBiquadFilter();
    const gain1 = ctx.createGain();

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(580 * ratio, t);
    osc1.frequency.exponentialRampToValueAtTime(220 * ratio, t + 0.012);

    filter1.type = "bandpass";
    filter1.frequency.setValueAtTime(1800, t);
    filter1.Q.setValueAtTime(1.8, t);

    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(volume * 0.9, t + 0.001);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.014);

    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(dest);

    // 2. Warm velvety sub-body resonator (gives physical mass)
    const osc2 = ctx.createOscillator();
    const filter2 = ctx.createBiquadFilter();
    const gain2 = ctx.createGain();

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(160 * ratio, t);
    osc2.frequency.exponentialRampToValueAtTime(65, t + 0.016);

    filter2.type = "lowpass";
    filter2.frequency.setValueAtTime(380, t);

    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(volume * 0.4, t + 0.001);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(dest);

    // 3. Delicate silk air micro-impulse (spatial presence)
    const osc3 = ctx.createOscillator();
    const filter3 = ctx.createBiquadFilter();
    const gain3 = ctx.createGain();

    osc3.type = "sine";
    osc3.frequency.setValueAtTime(3200 * ratio, t);

    filter3.type = "bandpass";
    filter3.frequency.setValueAtTime(3200, t);
    filter3.Q.setValueAtTime(2.5, t);

    gain3.gain.setValueAtTime(0, t);
    gain3.gain.linearRampToValueAtTime(volume * 0.18, t + 0.0008);
    gain3.gain.exponentialRampToValueAtTime(0.0001, t + 0.006);

    osc3.connect(filter3);
    filter3.connect(gain3);
    gain3.connect(dest);

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);
    osc1.stop(t + 0.018);
    osc2.stop(t + 0.02);
    osc3.stop(t + 0.008);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Deeply satisfying, creamy mechanical keyboard "thock" / luxury tactile button pop.
 * Quad-layer acoustic physics:
 * 1. Primary sub-bass bottom-out thump (weight and physical presence).
 * 2. PBT keycap/wooden switch housing resonance (hollow, tactile "thock" body).
 * 3. Tactile contact transient snap (crisp stem impact).
 * 4. Micro-rebound leaf spring release at +11ms (tactile realism).
 * Includes 38ms debounce to prevent mousedown/click double-triggers.
 */
export function playSoftClick(volume: number = 0.1) {
  if (!getSoundEnabled()) return;

  const now = Date.now();
  if (now - lastClickTime < 75) return; // Debounce to prevent rapid double-triggers
  lastClickTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const ratio = CLICK_PITCH_RATIOS[clickPitchIndex % CLICK_PITCH_RATIOS.length];
    clickPitchIndex++;

    // 1. Primary sub-bass bottom-out thump (creamy low-end weight)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const filter1 = ctx.createBiquadFilter();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(155 * ratio, t);
    osc1.frequency.exponentialRampToValueAtTime(44, t + 0.034);

    filter1.type = "lowpass";
    filter1.frequency.setValueAtTime(280, t);

    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(volume * 0.95, t + 0.0018);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.036);

    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(dest);

    // 2. Mechanical switch housing resonance (wooden/PBT tactile "thock" acoustic body)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const filter2 = ctx.createBiquadFilter();

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(340 * ratio, t);
    osc2.frequency.exponentialRampToValueAtTime(105, t + 0.026);

    filter2.type = "bandpass";
    filter2.frequency.setValueAtTime(650, t);
    filter2.Q.setValueAtTime(1.4, t);

    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(volume * 0.55, t + 0.0012);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(dest);

    // 3. Tactile contact transient snap (stem impact)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    const filter3 = ctx.createBiquadFilter();

    osc3.type = "triangle";
    osc3.frequency.setValueAtTime(860 * ratio, t);
    osc3.frequency.exponentialRampToValueAtTime(240, t + 0.007);

    filter3.type = "bandpass";
    filter3.frequency.setValueAtTime(1200, t);
    filter3.Q.setValueAtTime(1.6, t);

    gain3.gain.setValueAtTime(0, t);
    gain3.gain.linearRampToValueAtTime(volume * 0.35, t + 0.0008);
    gain3.gain.exponentialRampToValueAtTime(0.0001, t + 0.008);

    osc3.connect(filter3);
    filter3.connect(gain3);
    gain3.connect(dest);

    // 4. Secondary micro-rebound (subtle mechanical switch leaf release bounce at +11ms)
    const osc4 = ctx.createOscillator();
    const gain4 = ctx.createGain();
    const filter4 = ctx.createBiquadFilter();

    osc4.type = "sine";
    osc4.frequency.setValueAtTime(420 * ratio, t + 0.011);
    osc4.frequency.exponentialRampToValueAtTime(160, t + 0.022);

    filter4.type = "lowpass";
    filter4.frequency.setValueAtTime(800, t + 0.011);

    gain4.gain.setValueAtTime(0, t + 0.011);
    gain4.gain.linearRampToValueAtTime(volume * 0.18, t + 0.0125);
    gain4.gain.exponentialRampToValueAtTime(0.0001, t + 0.024);

    osc4.connect(filter4);
    filter4.connect(gain4);
    gain4.connect(dest);

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);
    osc4.start(t + 0.011);

    osc1.stop(t + 0.04);
    osc2.stop(t + 0.035);
    osc3.stop(t + 0.01);
    osc4.stop(t + 0.028);
  } catch {
    // Ignore
  }
}

/**
 * Crisp, snappy tactile tab switch sound.
 * Optimized for tabs, segmented controls, and category filters.
 */
export function playTabSelect(volume: number = 0.08) {
  if (!getSoundEnabled()) return;

  const now = Date.now();
  if (now - lastTabTime < 75) return;
  lastTabTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    // Crisp tactile tab tick + subtle harmonic sliding pop
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const filter1 = ctx.createBiquadFilter();

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(480, t);
    osc1.frequency.exponentialRampToValueAtTime(240, t + 0.022);

    filter1.type = "bandpass";
    filter1.frequency.setValueAtTime(1400, t);
    filter1.Q.setValueAtTime(2.0, t);

    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(volume, t + 0.001);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(dest);

    // Warm sub-click
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(180, t);
    osc2.frequency.exponentialRampToValueAtTime(90, t + 0.02);

    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(volume * 0.4, t + 0.001);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);

    osc2.connect(gain2);
    gain2.connect(dest);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.03);
    osc2.stop(t + 0.025);
  } catch {
    // Ignore
  }
}

/**
 * Bright, bubbly button pop for pill badges, pills, and interactive chips.
 */
export function playPopClick(volume: number = 0.09) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(190, t + 0.025);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.setValueAtTime(1.8, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.0015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.03);
  } catch {
    // Ignore
  }
}

/**
 * Smooth atmospheric swell when opening a modal, dialog, or drawer.
 */
export function playModalOpen(volume: number = 0.075) {
  if (!getSoundEnabled()) return;
  const now = Date.now();
  if (now - lastModalTime < 80) return;
  lastModalTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    // Atmospheric warm swell (C5 -> G5)
    const notes = [523.25, 783.99];
    notes.forEach((freq, i) => {
      const start = t + i * 0.035;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * 0.9, start);
      osc.frequency.exponentialRampToValueAtTime(freq, start + 0.12);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * (0.8 + i * 0.2), start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + 0.22);
    });
  } catch {
    // Ignore
  }
}

/**
 * Soft acoustic tuck-away pop when closing a modal, dialog, or drawer.
 */
export function playModalClose(volume: number = 0.06) {
  if (!getSoundEnabled()) return;
  const now = Date.now();
  if (now - lastModalTime < 80) return;
  lastModalTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.05);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(500, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.06);
  } catch {
    // Ignore
  }
}

/**
 * Crystalline, uplifting 3-tone celestial Kalimba arpeggio when enabling audio (E5 -> G#5 -> B5).
 */
export function playToggleOn(volume: number = 0.085) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const notes = [659.25, 830.61, 987.77]; // E5 -> G#5 -> B5 (E Major Triad)

    notes.forEach((freq, i) => {
      const start = t + i * 0.042;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2600, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * (0.85 + i * 0.12), start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.24);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + 0.25);
    });
  } catch {
    // Ignore
  }
}

/**
 * Gentle, warm descending chime when muting audio (B5 -> G#5 -> E5).
 */
export function playToggleOff(volume: number = 0.07) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const notes = [987.77, 830.61, 659.25]; // B5 -> G#5 -> E5

    notes.forEach((freq, i) => {
      const start = t + i * 0.038;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1900, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * (1.0 - i * 0.12), start + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + 0.19);
    });
  } catch {
    // Ignore
  }
}

let pinkNoiseCache: AudioBuffer | null = null;
let pinkNoiseCacheSampleRate = 0;

function getPinkNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  if (pinkNoiseCache && pinkNoiseCacheSampleRate === ctx.sampleRate && pinkNoiseCache.length >= bufferSize) {
    return pinkNoiseCache;
  }
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.153852;
    data[i] = (b0 + b1 + b2) * 0.22;
  }
  pinkNoiseCache = buffer;
  pinkNoiseCacheSampleRate = ctx.sampleRate;
  return buffer;
}

/**
 * Smooth, velvety organic air swoosh for theme toggle.
 * - Light Mode: Smooth, uplifting airy whoosh (ascending filter sweep).
 * - Dark Mode: Soft, soothing twilight whoosh (descending filter sweep).
 */
export function playThemeSwoosh(isDark: boolean, volume: number = 0.12) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const duration = 0.28;

    // 1. Velvet Pink Air Noise Buffer (cached)
    const noise = ctx.createBufferSource();
    noise.buffer = getPinkNoiseBuffer(ctx, duration);

    // Dual-stage filter for silky swoosh movement
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(1.4, t);

    if (isDark) {
      // Downward twilight swoosh
      filter.frequency.setValueAtTime(1600, t);
      filter.frequency.exponentialRampToValueAtTime(260, t + duration);
    } else {
      // Upward sunrise swoosh
      filter.frequency.setValueAtTime(320, t);
      filter.frequency.exponentialRampToValueAtTime(1750, t + duration);
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume * 0.9, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(t);
    noise.stop(t + duration);

    // 2. Gentle Warm Sub-breath Harmonic (Organic body)
    const breath = ctx.createOscillator();
    const breathGain = ctx.createGain();
    const breathFilter = ctx.createBiquadFilter();

    breath.type = "sine";
    breathFilter.type = "lowpass";
    breathFilter.frequency.setValueAtTime(600, t);

    if (isDark) {
      breath.frequency.setValueAtTime(420, t);
      breath.frequency.exponentialRampToValueAtTime(150, t + duration * 0.9);
    } else {
      breath.frequency.setValueAtTime(190, t);
      breath.frequency.exponentialRampToValueAtTime(480, t + duration * 0.9);
    }

    breathGain.gain.setValueAtTime(0, t);
    breathGain.gain.linearRampToValueAtTime(volume * 0.35, t + 0.035);
    breathGain.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.9);

    breath.connect(breathFilter);
    breathFilter.connect(breathGain);
    breathGain.connect(dest);

    breath.start(t);
    breath.stop(t + duration);
  } catch {
    // Ignore
  }
}

/**
 * Soft, pleasant retro bubble pulse for interactive arcade elements.
 */
export function playLaserSound(volume: number = 0.055) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(460, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.06);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.065);
  } catch {
    // Ignore
  }
}

/**
 * Warm, deep lofi sub-kick thump with gentle acoustic damping.
 */
export function playExplosionSound(volume: number = 0.07) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.12);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(240, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.13);
  } catch {
    // Ignore
  }
}

/**
 * Sweet, resonant pentatonic kalimba chime for successful hits and milestone progress.
 */
export function playHitChime(pitchIndex: number = 0, volume: number = 0.075) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const pitches = [587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66];
    const freq = pitches[pitchIndex % pitches.length] ?? 659.25;

    // 1. Primary sine chime
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.98, t + 0.16);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    // 2. Wooden body harmonic
    const wood = ctx.createOscillator();
    const woodGain = ctx.createGain();
    const woodFilter = ctx.createBiquadFilter();

    wood.type = "triangle";
    wood.frequency.setValueAtTime(freq * 0.5, t);

    woodFilter.type = "lowpass";
    woodFilter.frequency.setValueAtTime(600, t);

    woodGain.gain.setValueAtTime(0, t);
    woodGain.gain.linearRampToValueAtTime(volume * 0.3, t + 0.002);
    woodGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    wood.connect(woodFilter);
    woodFilter.connect(woodGain);
    woodGain.connect(dest);

    osc.start(t);
    wood.start(t);
    osc.stop(t + 0.17);
    wood.stop(t + 0.09);
  } catch {
    // Ignore
  }
}

/**
 * Ethereal, relaxing ambient victory progression (lush Rhodes C Major 9 chord).
 */
export function playVictoryFanfare(volume: number = 0.09) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 987.77, 1174.66]; // C5, E5, G5, B5, D6 (C Major 9)

    notes.forEach((freq, i) => {
      const start = t + i * 0.075;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.99, start + 0.4);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2600, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * (0.8 + i * 0.08), start + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + 0.42);
    });
  } catch {
    // Ignore
  }
}

/**
 * Lush, atmospheric combo resonance with harmonic warmth.
 */
export function playSuperComboSound(tier: 5 | 10, volume: number = 0.08) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const notes =
      tier === 5
        ? [587.33, 783.99, 1046.5]
        : [523.25, 659.25, 783.99, 1046.5, 1318.51];

    notes.forEach((freq, i) => {
      const start = t + i * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + 0.23);
    });
  } catch {
    // Ignore
  }
}

/**
 * Luminous water-crystal droplet greeting when a notification appears.
 * Two-tone melodic interval (D5 -> A5) with warm wooden sub-foundation.
 */
export function playToastIn(volume: number = 0.07) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    // 1. Water-droplet tactile pulse (warm tactile entry)
    const drop = ctx.createOscillator();
    const dropFilter = ctx.createBiquadFilter();
    const dropGain = ctx.createGain();

    drop.type = "sine";
    drop.frequency.setValueAtTime(460, t);
    drop.frequency.exponentialRampToValueAtTime(180, t + 0.032);

    dropFilter.type = "lowpass";
    dropFilter.frequency.setValueAtTime(900, t);

    dropGain.gain.setValueAtTime(0, t);
    dropGain.gain.linearRampToValueAtTime(volume * 0.8, t + 0.002);
    dropGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

    drop.connect(dropFilter);
    dropFilter.connect(dropGain);
    dropGain.connect(dest);

    // 2. Crystalline two-tone greeting (D5 -> A5)
    const tones = [
      { freq: 587.33, delay: 0.008, dur: 0.16, amp: 0.85 }, // D5
      { freq: 880.0, delay: 0.045, dur: 0.24, amp: 1.0 },  // A5
    ];

    tones.forEach(({ freq, delay, dur, amp }) => {
      const start = t + delay;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, start + dur);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2600, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * amp, start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + dur + 0.01);
    });

    drop.start(t);
    drop.stop(t + 0.04);
  } catch {
    // Ignore
  }
}

/**
 * Ultra-rewarding, glorious success chime!
 * 3-tone ascending C-major harmonic sparkle (G5 -> C6 -> E6)
 * backed by an instantaneous tactile confirmation thump and crystal shimmer tail.
 */
export function playToastSuccess(volume: number = 0.085) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    // 1. Tactile sub confirmation pop (immediate physical haptic feedback)
    const haptic = ctx.createOscillator();
    const hapticFilter = ctx.createBiquadFilter();
    const hapticGain = ctx.createGain();

    haptic.type = "sine";
    haptic.frequency.setValueAtTime(190, t);
    haptic.frequency.exponentialRampToValueAtTime(65, t + 0.038);

    hapticFilter.type = "lowpass";
    hapticFilter.frequency.setValueAtTime(450, t);

    hapticGain.gain.setValueAtTime(0, t);
    hapticGain.gain.linearRampToValueAtTime(volume * 0.75, t + 0.002);
    hapticGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    haptic.connect(hapticFilter);
    hapticFilter.connect(hapticGain);
    hapticGain.connect(dest);

    // 2. Ascending 3-tone crystalline chime: G5 -> C6 -> E6 (Major triad)
    const notes = [
      { freq: 783.99, delay: 0.006, dur: 0.18, amp: 0.8 },  // G5
      { freq: 1046.5, delay: 0.042, dur: 0.24, amp: 0.95 }, // C6
      { freq: 1318.51, delay: 0.078, dur: 0.35, amp: 1.1 }, // E6 (Sparkling peak)
    ];

    notes.forEach(({ freq, delay, dur, amp }, idx) => {
      const start = t + delay;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = idx === notes.length - 1 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.99, start + dur);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(3200, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * amp, start + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + dur + 0.015);
    });

    // 3. Delicate crystal overtone shimmer
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    const shimmerFilter = ctx.createBiquadFilter();

    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(2637.0, t + 0.082); // E7

    shimmerFilter.type = "bandpass";
    shimmerFilter.frequency.setValueAtTime(2637.0, t + 0.082);
    shimmerFilter.Q.setValueAtTime(2.5, t + 0.082);

    shimmerGain.gain.setValueAtTime(0, t + 0.082);
    shimmerGain.gain.linearRampToValueAtTime(volume * 0.22, t + 0.09);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);

    shimmer.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(dest);

    haptic.start(t);
    shimmer.start(t + 0.082);
    haptic.stop(t + 0.045);
    shimmer.stop(t + 0.32);
  } catch {
    // Ignore
  }
}

/**
 * Soft, gentle acoustic double-tap rubber bumper when an action fails or is blocked.
 * Completely non-fatiguing, never harsh or jarring!
 */
export function playToastError(volume: number = 0.075) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const pulses = [
      { time: 0, freqStart: 175, freqEnd: 85, dur: 0.034, amp: 0.9 },
      { time: 0.048, freqStart: 135, freqEnd: 60, dur: 0.038, amp: 0.75 },
    ];

    pulses.forEach(({ time, freqStart, freqEnd, dur, amp }) => {
      const start = t + time;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freqStart, start);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, start + dur);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(280, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * amp, start + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + dur + 0.005);
    });
  } catch {
    // Ignore
  }
}

/**
 * Warm amber marimba double-chime for alerts and warnings (A5 -> F#5).
 */
export function playToastWarning(volume: number = 0.075) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const notes = [
      { freq: 880.0, delay: 0, dur: 0.16, amp: 0.9 },     // A5
      { freq: 739.99, delay: 0.042, dur: 0.22, amp: 0.8 }, // F#5
    ];

    notes.forEach(({ freq, delay, dur, amp }) => {
      const start = t + delay;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, start + dur);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * amp, start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + dur + 0.01);
    });
  } catch {
    // Ignore
  }
}

/**
 * Ultra-smooth, soft acoustic whoosh-drop when a toast expires or dismisses.
 */
export function playToastOut(volume: number = 0.05) {
  if (!getSoundEnabled()) return;

  const now = Date.now();
  if (now - lastToastOutTime < 80) return;
  lastToastOutTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(75, t + 0.035);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.04);
  } catch {
    // Ignore
  }
}

/**
 * Soft, satisfying acoustic whoosh-pop when the user sends an AI prompt.
 */
export function playChatSend(volume: number = 0.085) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.035);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.04);
  } catch {
    // Ignore
  }
}

/**
 * Gentle, soft bubble ripple when the AI begins streaming response chunks.
 */
export function playChatReceive(volume: number = 0.065) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(360, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.025);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1100, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.028);
  } catch {
    // Ignore
  }
}

/**
 * Sweet, delicate harmonic bell when the AI completes generating its answer.
 */
export function playChatDone(volume: number = 0.075) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const notes = [587.33, 783.99]; // D5 -> G5

    notes.forEach((freq, idx) => {
      const start = t + idx * 0.04;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + 0.13);
    });
  } catch {
    // Ignore
  }
}

/**
 * Ethereal ambient open breath when launching the AI chatbox.
 */
export function playChatOpen(volume: number = 0.08) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.14);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.16);
  } catch {
    // Ignore
  }
}

/**
 * Soft ambient close breath when dismissing the AI chatbox.
 */
export function playChatClose(volume: number = 0.06) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(380, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.1);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(700, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.11);
  } catch {
    // Ignore
  }
}

/**
 * Ultra-subtle, velvety tactile keystroke micro-tick when typing in the prompt box.
 * Includes micro-pitch variation and a 35ms rate limiter for silky smooth typing rhythm.
 */
export function playKeyTick(volume: number = 0.035) {
  if (!getSoundEnabled()) return;

  const now = Date.now();
  if (now - lastKeyTickTime < 35) return;
  lastKeyTickTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const ratio = KEY_PITCH_RATIOS[keyPitchIndex % KEY_PITCH_RATIOS.length];
    keyPitchIndex++;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(280 * ratio, t);
    osc.frequency.exponentialRampToValueAtTime(140 * ratio, t + 0.012);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.015);
  } catch {
    // Ignore
  }
}

/**
 * Crisp, tactile physical magnetic snap/paperclip sound when adding attachments.
 */
export function playAttachmentSound(volume: number = 0.08) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const notes = [
      { freq: 680, endFreq: 240, delay: 0, dur: 0.022 },
      { freq: 940, endFreq: 420, delay: 0.016, dur: 0.028 },
    ];

    notes.forEach(({ freq, endFreq, delay, dur }) => {
      const start = t + delay;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(endFreq, start + dur);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.0015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + dur + 0.005);
    });
  } catch {
    // Ignore
  }
}

/**
 * Ultra-satisfying, crystalline triple-tone confirmation when copying code blocks or text (D5 -> A5 -> D6).
 */
export function playCopySuccess(volume: number = 0.085) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const notes = [
      { freq: 587.33, delay: 0, dur: 0.09, vol: volume * 0.8 },      // D5
      { freq: 880.0, delay: 0.028, dur: 0.12, vol: volume * 0.95 },  // A5
      { freq: 1174.66, delay: 0.055, dur: 0.18, vol: volume * 1.1 }, // D6 (Sparkling peak)
    ];

    notes.forEach(({ freq, delay, dur, vol }) => {
      const start = t + delay;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, start + dur);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2800, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + dur + 0.01);
    });
  } catch {
    // Ignore
  }
}

/**
 * Soft, pleasant accordion paper-fold whoosh when toggling chain-of-thought or collapsible items.
 */
export function playAccordionToggle(isOpen: boolean, volume: number = 0.065) {
  if (!getSoundEnabled()) return;

  const now = Date.now();
  if (now - lastAccordionTime < 35) return;
  lastAccordionTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    if (isOpen) {
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(360, t + 0.04);
    } else {
      osc.frequency.setValueAtTime(360, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.04);
    }

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.045);
  } catch {
    // Ignore
  }
}

/**
 * Ethereal, velvety ambient chime when opening the Command Palette (A4 -> C#5 -> E5).
 */
export function playCommandMenuOpen(volume: number = 0.085) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const notes = [
      { freq: 440.0, delay: 0, dur: 0.14, vol: volume * 0.8 },      // A4
      { freq: 554.37, delay: 0.024, dur: 0.16, vol: volume * 0.95 }, // C#5
      { freq: 659.25, delay: 0.048, dur: 0.22, vol: volume * 1.1 },  // E5
    ];

    notes.forEach(({ freq, delay, dur, vol }) => {
      const start = t + delay;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, start + dur);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + dur + 0.01);
    });
  } catch {
    // Ignore
  }
}

/**
 * Soft, soothing acoustic dismiss breath when closing the Command Palette.
 */
export function playCommandMenuClose(volume: number = 0.06) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(95, t + 0.045);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(650, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.05);
  } catch {
    // Ignore
  }
}

/**
 * Tactile confirmation click when selecting a command or list item.
 */
export function playListSelect(volume: number = 0.08) {
  playSoftClick(volume);
}

/**
 * Reasoning Level 1: Low (Eco / Swift)
 * A soft, organic haptic sub-tap with warm wooden body.
 */
export function playReasoningLow(volume: number = 0.055) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.035);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, t);
    filter.Q.setValueAtTime(1.0, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);

    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = "triangle";
    body.frequency.setValueAtTime(260, t);
    body.frequency.exponentialRampToValueAtTime(120, t + 0.025);

    bodyGain.gain.setValueAtTime(0, t);
    bodyGain.gain.linearRampToValueAtTime(volume * 0.35, t + 0.001);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    body.connect(filter);

    osc.start(t);
    body.start(t);
    osc.stop(t + 0.04);
    body.stop(t + 0.04);
  } catch {
    // Ignore
  }
}

/**
 * Reasoning Level 2: Medium (Balanced)
 * Velvety dual-tone marimba micro-tap.
 */
export function playReasoningMedium(volume: number = 0.06) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    [
      { freq: 280, endFreq: 220, delay: 0, weight: 0.8 },
      { freq: 380, endFreq: 310, delay: 0.014, weight: 1.0 },
    ].forEach(({ freq, endFreq, delay, weight }) => {
      const start = t + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(endFreq, start + 0.04);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * weight, start + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + 0.055);
    });
  } catch {
    // Ignore
  }
}

/**
 * Reasoning Level 3: High (Intensive)
 * Crisp, luminous crystal-water droplet with shimmering resonance.
 */
export function playReasoningHigh(volume: number = 0.07) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    const notes = [
      { freq: 440, delay: 0, duration: 0.07, amp: 0.7 },
      { freq: 659.25, delay: 0.016, duration: 0.09, amp: 1.0 },
    ];

    notes.forEach(({ freq, delay, duration, amp }) => {
      const start = t + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.96, start + duration);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1600, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * amp, start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + duration + 0.01);
    });

    const glass = ctx.createOscillator();
    const glassGain = ctx.createGain();
    glass.type = "triangle";
    glass.frequency.setValueAtTime(880, t + 0.016);

    glassGain.gain.setValueAtTime(0, t + 0.016);
    glassGain.gain.linearRampToValueAtTime(volume * 0.25, t + 0.02);
    glassGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    glass.connect(glassGain);
    glassGain.connect(dest);

    glass.start(t + 0.016);
    glass.stop(t + 0.09);
  } catch {
    // Ignore
  }
}

/**
 * Reasoning Level 4: Max (The Ultimate Flagship)
 * Celestial harmonic crystal harp ripple with sub-bass bloom & shimmering sparkle.
 */
export function playReasoningMax(volume: number = 0.08) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;

    // 1. Sub-bass velvet bloom (warm, deep foundation)
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    const subFilter = ctx.createBiquadFilter();

    sub.type = "sine";
    sub.frequency.setValueAtTime(146.83, t); // D3
    sub.frequency.exponentialRampToValueAtTime(73.42, t + 0.16); // D2

    subFilter.type = "lowpass";
    subFilter.frequency.setValueAtTime(300, t);

    subGain.gain.setValueAtTime(0, t);
    subGain.gain.linearRampToValueAtTime(volume * 0.7, t + 0.008);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    sub.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(dest);

    sub.start(t);
    sub.stop(t + 0.19);

    // 2. Ascending 4-tone celestial crystal chord (D Major 9: D4 -> F#4 -> A4 -> E5)
    const arpeggio = [
      { freq: 293.66, delay: 0, dur: 0.12, amp: 0.65 },
      { freq: 369.99, delay: 0.018, dur: 0.14, amp: 0.85 },
      { freq: 440.0, delay: 0.038, dur: 0.16, amp: 0.95 },
      { freq: 659.25, delay: 0.060, dur: 0.22, amp: 1.15 },
    ];

    arpeggio.forEach(({ freq, delay, dur, amp }, idx) => {
      const start = t + delay;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = idx === arpeggio.length - 1 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, start + dur);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, start);
      filter.Q.setValueAtTime(1.5, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * amp, start + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + dur + 0.02);
    });

    // 3. Shimmering fairy sparkle overtone on the peak note
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    const shimmerFilter = ctx.createBiquadFilter();

    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(1318.5, t + 0.065); // E6

    shimmerFilter.type = "bandpass";
    shimmerFilter.frequency.setValueAtTime(1318.5, t + 0.065);
    shimmerFilter.Q.setValueAtTime(2.0, t + 0.065);

    shimmerGain.gain.setValueAtTime(0, t + 0.065);
    shimmerGain.gain.linearRampToValueAtTime(volume * 0.35, t + 0.075);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);

    shimmer.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(dest);

    shimmer.start(t + 0.065);
    shimmer.stop(t + 0.27);
  } catch {
    // Ignore
  }
}

/**
 * Universal dispatcher for reasoning level sound effects.
 */
export function playReasoningSound(level: "low" | "medium" | "high" | "max" | string) {
  switch (level) {
    case "low":
      playReasoningLow();
      break;
    case "medium":
      playReasoningMedium();
      break;
    case "high":
      playReasoningHigh();
      break;
    case "max":
      playReasoningMax();
      break;
    default:
      playSoftClick(0.04);
      break;
  }
}

let popNoteIndex = 0;
const POP_PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]; // C5, D5, E5, G5, A5, C6

/**
 * Organic bubbly "pop" sound effect for the interactive cursor follower.
 */
export function playCursorFollowSound(volume: number = 0.09) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const baseFreq = POP_PENTATONIC[popNoteIndex % POP_PENTATONIC.length];
    popNoteIndex++;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq * 1.5, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.04);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(baseFreq * 3, t);
    filter.Q.setValueAtTime(2.0, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.13);

    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = "triangle";
    clickOsc.frequency.setValueAtTime(240, t);
    clickOsc.frequency.exponentialRampToValueAtTime(60, t + 0.015);

    clickGain.gain.setValueAtTime(volume * 0.7, t);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

    clickOsc.connect(clickGain);
    clickGain.connect(dest);

    clickOsc.start(t);
    clickOsc.stop(t + 0.02);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Arcade Power-Up Pickup Sound:
 * Ascending crystalline dual-tone arpeggio (E5 -> G#5 -> B5 -> E6)
 */
export function playPowerUpSound(volume: number = 0.085) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const notes = [659.25, 830.61, 987.77, 1318.51];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + idx * 0.045);

      gain.gain.setValueAtTime(0, t + idx * 0.045);
      gain.gain.linearRampToValueAtTime(volume * 0.7, t + idx * 0.045 + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.045 + 0.16);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t + idx * 0.045);
      osc.stop(t + idx * 0.045 + 0.17);
    });
  } catch {
    // Ignore audio errors
  }
}

/**
 * Arcade UFO / Mystery Drone Flyby & Hit:
 * Ethereal dual-oscillator resonant sweep
 */
export function playUFOSound(volume: number = 0.08) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1760, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.22);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.25);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Arcade EMP Nuke Sound:
 * Deep sonic boom with sub-bass drop & metallic wash
 */
export function playEMPNukeSound(volume: number = 0.09) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.35);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.42);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Arcade Critical / Plasma Laser:
 * High-tech dual frequency chirp with razor transient.
 */
export function playCritLaserSound(volume: number = 0.07) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(840, t);
    osc1.frequency.exponentialRampToValueAtTime(220, t + 0.08);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1260, t);
    osc2.frequency.exponentialRampToValueAtTime(310, t + 0.07);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1600, t);
    filter.Q.setValueAtTime(2.5, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.085);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.09);
    osc2.stop(t + 0.09);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Arcade Seismic Mega Boom:
 * Multi-harmonic sub-bass rumble explosion with distortion-style warmth.
 */
export function playMegaBoomSound(volume: number = 0.1) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(160, t);
    sub.frequency.exponentialRampToValueAtTime(28, t + 0.45);

    subGain.gain.setValueAtTime(0, t);
    subGain.gain.linearRampToValueAtTime(volume, t + 0.005);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.48);

    sub.connect(subGain);
    subGain.connect(dest);

    const mid = ctx.createOscillator();
    const midFilter = ctx.createBiquadFilter();
    const midGain = ctx.createGain();
    mid.type = "sawtooth";
    mid.frequency.setValueAtTime(95, t);
    mid.frequency.exponentialRampToValueAtTime(32, t + 0.22);

    midFilter.type = "lowpass";
    midFilter.frequency.setValueAtTime(280, t);

    midGain.gain.setValueAtTime(0, t);
    midGain.gain.linearRampToValueAtTime(volume * 0.7, t + 0.003);
    midGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

    mid.connect(midFilter);
    midFilter.connect(midGain);
    midGain.connect(dest);

    sub.start(t);
    mid.start(t);
    sub.stop(t + 0.5);
    mid.stop(t + 0.27);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Arcade Energy Orb / Coin Pickup:
 * Classic retro 8-bit crystal arpeggio ping (B5 -> E6).
 */
export function playCoinPickupSound(volume: number = 0.08) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const notes = [987.77, 1318.51];

    notes.forEach((freq, idx) => {
      const start = t + idx * 0.04;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + 0.13);
    });
  } catch {
    // Ignore audio errors
  }
}

/**
 * Arcade Shield Deflect / Energy Bubble:
 * Ethereal glassy ping with acoustic damping.
 */
export function playShieldDeflectSound(volume: number = 0.075) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(620, t);
    osc.frequency.exponentialRampToValueAtTime(1100, t + 0.04);
    osc.frequency.exponentialRampToValueAtTime(540, t + 0.18);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, t);
    filter.Q.setValueAtTime(3.0, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.19);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.2);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Arcade Overdrive / Fever Mode Fanfare:
 * Euphoric ascending synth fanfare (D5 -> G5 -> B5 -> D6 -> G6).
 */
export function playOverdriveFanfare(volume: number = 0.09) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const notes = [587.33, 783.99, 987.77, 1174.66, 1567.98];

    notes.forEach((freq, idx) => {
      const start = t + idx * 0.045;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * (0.8 + idx * 0.08), start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.26);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(start);
      osc.stop(start + 0.28);
    });
  } catch {
    // Ignore audio errors
  }
}

/**
 * Celestial Comet Flyby Whoosh:
 * High-speed doppler filter sweep through pink-like noise/sine harmonics.
 */
export function playCometWhizSound(volume: number = 0.075) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.35);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(3200, t + 0.12);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.35);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.4);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Arcade Homing Rocket Launch:
 * Rocket engine ignition hiss and pitch climb.
 */
export function playMissileLaunchSound(volume: number = 0.065) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const dest = getMasterBus(ctx);
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(620, t + 0.09);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(550, t);
    filter.Q.setValueAtTime(2.0, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.11);
  } catch {
    // Ignore audio errors
  }
}
