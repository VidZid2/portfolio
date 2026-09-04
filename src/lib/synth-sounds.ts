import { getAudioContext } from "./sound-engine";
import { getSoundEnabled } from "@/hooks/use-sound";

// Debounce trackers to prevent audio fatigue and spam
let lastHoverTime = 0;

/**
 * Ultra-smooth, satisfying tactile haptic hover tick.
 * Multi-layer acoustic physics: crisp micro-transient mechanical click layered over a velvety sub-surface body.
 */
export function playHoverTick(volume: number = 0.06) {
  if (!getSoundEnabled()) return;

  const now = Date.now();
  if (now - lastHoverTime < 38) return; // 38ms limiter for silky smooth scrubbing
  lastHoverTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;

    // 1. High-precision tactile micro-transient (stem click)
    const osc1 = ctx.createOscillator();
    const filter1 = ctx.createBiquadFilter();
    const gain1 = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(440, t);
    osc1.frequency.exponentialRampToValueAtTime(180, t + 0.016);

    filter1.type = "bandpass";
    filter1.frequency.setValueAtTime(1200, t);
    filter1.Q.setValueAtTime(1.6, t);

    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(volume * 0.95, t + 0.0015);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.016);

    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(ctx.destination);

    // 2. Warm velvety sub-body resonator (gives physical mass)
    const osc2 = ctx.createOscillator();
    const filter2 = ctx.createBiquadFilter();
    const gain2 = ctx.createGain();

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(180, t);
    osc2.frequency.exponentialRampToValueAtTime(75, t + 0.02);

    filter2.type = "lowpass";
    filter2.frequency.setValueAtTime(450, t);

    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(volume * 0.45, t + 0.001);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.022);
    osc2.stop(t + 0.022);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Deeply satisfying, creamy mechanical keyboard "thock" / luxury tactile button pop.
 * Triple-harmonic architecture: sub-fundamental thump + wooden housing resonance + transient tactile strike.
 */
export function playSoftClick(volume: number = 0.11) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;

    // 1. Primary sub-bass bottom-out thump (creamy low-end)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const filter1 = ctx.createBiquadFilter();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(170, t);
    osc1.frequency.exponentialRampToValueAtTime(48, t + 0.036);

    filter1.type = "lowpass";
    filter1.frequency.setValueAtTime(320, t);

    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(volume, t + 0.002);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);

    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(ctx.destination);

    // 2. Soft mechanical stem housing resonance (gives tactile "thock" body)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const filter2 = ctx.createBiquadFilter();

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(360, t);
    osc2.frequency.exponentialRampToValueAtTime(95, t + 0.028);

    filter2.type = "lowpass";
    filter2.frequency.setValueAtTime(650, t);

    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(volume * 0.5, t + 0.0015);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(ctx.destination);

    // 3. Ultra-short tactile contact transient
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    const filter3 = ctx.createBiquadFilter();

    osc3.type = "sine";
    osc3.frequency.setValueAtTime(820, t);
    osc3.frequency.exponentialRampToValueAtTime(240, t + 0.008);

    filter3.type = "bandpass";
    filter3.frequency.setValueAtTime(900, t);
    filter3.Q.setValueAtTime(1.2, t);

    gain3.gain.setValueAtTime(0, t);
    gain3.gain.linearRampToValueAtTime(volume * 0.35, t + 0.001);
    gain3.gain.exponentialRampToValueAtTime(0.0001, t + 0.009);

    osc3.connect(filter3);
    filter3.connect(gain3);
    gain3.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);
    osc1.stop(t + 0.045);
    osc2.stop(t + 0.045);
    osc3.stop(t + 0.045);
  } catch {
    // Ignore
  }
}

/**
 * Crystalline, uplifting 3-tone celestial Kalimba arpeggio when enabling audio (E5 -> G#5 -> B5).
 */
export function playToggleOn(volume: number = 0.09) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const notes = [659.25, 830.61, 987.77]; // E5 -> G#5 -> B5 (E Major Triad)

    notes.forEach((freq, i) => {
      const start = t + i * 0.048;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2400, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * (0.85 + i * 0.1), start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.23);
    });
  } catch {
    // Ignore
  }
}

/**
 * Gentle, warm descending chime when muting audio (B5 -> G#5 -> E5).
 */
export function playToggleOff(volume: number = 0.075) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const notes = [987.77, 830.61, 659.25]; // B5 -> G#5 -> E5

    notes.forEach((freq, i) => {
      const start = t + i * 0.042;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * (1.0 - i * 0.15), start + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.17);
    });
  } catch {
    // Ignore
  }
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

    const t = ctx.currentTime;
    const duration = 0.28;

    // 1. Velvet Pink Air Noise Buffer
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.22;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

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
    gain.connect(ctx.destination);

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
    breathGain.connect(ctx.destination);

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
    gain.connect(ctx.destination);

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
    gain.connect(ctx.destination);

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

    const t = ctx.currentTime;
    // Soothing pentatonic scale (D5, E5, G5, A5, C6, D6)
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
    gain.connect(ctx.destination);

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
    woodGain.connect(ctx.destination);

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
      gain.connect(ctx.destination);

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
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.23);
    });
  } catch {
    // Ignore
  }
}

/**
 * Ultra-subtle, soft tactile haptic droplet pop when a notification toast appears.
 * Multi-layer acoustic tap with gentle water-droplet transient.
 */
export function playToastIn(volume: number = 0.065) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    
    // 1. Primary droplet body
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(290, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.024);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1100, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.0018);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.024);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // 2. Delicate droplet sheen overtone
    const sheen = ctx.createOscillator();
    const sheenGain = ctx.createGain();
    const sheenFilter = ctx.createBiquadFilter();

    sheen.type = "triangle";
    sheen.frequency.setValueAtTime(620, t);
    sheen.frequency.exponentialRampToValueAtTime(280, t + 0.015);

    sheenFilter.type = "bandpass";
    sheenFilter.frequency.setValueAtTime(600, t);
    sheenFilter.Q.setValueAtTime(1.5, t);

    sheenGain.gain.setValueAtTime(0, t);
    sheenGain.gain.linearRampToValueAtTime(volume * 0.35, t + 0.001);
    sheenGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.016);

    sheen.connect(sheenFilter);
    sheenFilter.connect(sheenGain);
    sheenGain.connect(ctx.destination);

    osc.start(t);
    sheen.start(t);
    osc.stop(t + 0.028);
    sheen.stop(t + 0.028);
  } catch {
    // Ignore
  }
}

/**
 * Satisfying, warm tactile confirmation double-pop (Apple iOS / Linear haptic standard).
 * Low-frequency, deeply soothing, tactile mechanical double-thock.
 */
export function playToastSuccess(volume: number = 0.085) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const pulses = [
      { time: 0, freqStart: 170, freqEnd: 70, vol: volume * 0.75, dur: 0.026 },
      { time: 0.032, freqStart: 260, freqEnd: 110, vol: volume, dur: 0.034 },
    ];

    pulses.forEach(({ time, freqStart, freqEnd, vol, dur }) => {
      const start = t + time;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freqStart, start);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, start + dur);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(850, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + dur + 0.005);
    });
  } catch {
    // Ignore
  }
}

/**
 * Soft, muted low double-thud with gentle rubber damping when an action fails or is blocked.
 */
export function playToastError(volume: number = 0.075) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const pulses = [
      { time: 0, freqStart: 130, freqEnd: 55, dur: 0.028 },
      { time: 0.036, freqStart: 95, freqEnd: 40, dur: 0.032 },
    ];

    pulses.forEach(({ time, freqStart, freqEnd, dur }) => {
      const start = t + time;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freqStart, start);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, start + dur);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(220, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + dur + 0.005);
    });
  } catch {
    // Ignore
  }
}

/**
 * Ultra-smooth, soft acoustic whoosh-drop when a toast expires or dismisses.
 */
export function playToastOut(volume: number = 0.055) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(340, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.038);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(850, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.0025);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.042);
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
    gain.connect(ctx.destination);

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
    gain.connect(ctx.destination);

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
      gain.connect(ctx.destination);

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
    gain.connect(ctx.destination);

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
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.11);
  } catch {
    // Ignore
  }
}

// Debounce for prompt keystroke ticks
let lastKeyTickTime = 0;

/**
 * Ultra-subtle, velvety tactile keystroke micro-tick when typing in the prompt box.
 */
export function playKeyTick(volume: number = 0.035) {
  if (!getSoundEnabled()) return;

  const now = Date.now();
  if (now - lastKeyTickTime < 40) return; // 40ms limiter for silky smooth typing rhythm
  lastKeyTickTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    // Subtle pitch drop from 280Hz to 140Hz
    osc.type = "sine";
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.012);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

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
      gain.connect(ctx.destination);

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
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + dur + 0.01);
    });
  } catch {
    // Ignore
  }
}

/**
 * Soft, pleasant accordion paper-fold whoosh when toggling chain-of-thought / reasoning steps.
 */
export function playAccordionToggle(isOpen: boolean, volume: number = 0.065) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

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
    gain.connect(ctx.destination);

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
      gain.connect(ctx.destination);

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
    gain.connect(ctx.destination);

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

    const t = ctx.currentTime;
    
    // Fundamental soft sub-tap
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

    // Warm body harmonic
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
    gain.connect(ctx.destination);

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
      gain.connect(ctx.destination);

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

    const t = ctx.currentTime;

    // 1. Crystal bell attack
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
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration + 0.01);
    });

    // 2. Gentle glass overtone
    const glass = ctx.createOscillator();
    const glassGain = ctx.createGain();
    glass.type = "triangle";
    glass.frequency.setValueAtTime(880, t + 0.016);

    glassGain.gain.setValueAtTime(0, t + 0.016);
    glassGain.gain.linearRampToValueAtTime(volume * 0.25, t + 0.02);
    glassGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    glass.connect(glassGain);
    glassGain.connect(ctx.destination);

    glass.start(t + 0.016);
    glass.stop(t + 0.09);
  } catch {
    // Ignore
  }
}

/**
 * Reasoning Level 4: Max (The Ultimate Flagship)
 * Celestial harmonic crystal harp ripple with sub-bass bloom & shimmering sparkle.
 * The best, most deeply satisfying and magical audio reward in the suite.
 */
export function playReasoningMax(volume: number = 0.08) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

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
    subGain.connect(ctx.destination);

    sub.start(t);
    sub.stop(t + 0.19);

    // 2. Ascending 4-tone celestial crystal chord (D Major 9: D4 -> F#4 -> A4 -> E5)
    const arpeggio = [
      { freq: 293.66, delay: 0, dur: 0.12, amp: 0.65 },      // D4
      { freq: 369.99, delay: 0.018, dur: 0.14, amp: 0.85 },  // F#4
      { freq: 440.0, delay: 0.038, dur: 0.16, amp: 0.95 },   // A4
      { freq: 659.25, delay: 0.060, dur: 0.22, amp: 1.15 },  // E5 (Sparkling peak)
    ];

    notes: arpeggio.forEach(({ freq, delay, dur, amp }, idx) => {
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
      gain.connect(ctx.destination);

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
    shimmerGain.connect(ctx.destination);

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
 * Delightful, organic bubbly "pop" sound effect for the interactive cursor follower.
 * Cycles sequentially through a melodic pentatonic scale with velvety tactile attack.
 */
export function playCursorFollowSound(volume: number = 0.09) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const baseFreq = POP_PENTATONIC[popNoteIndex % POP_PENTATONIC.length];
    popNoteIndex++;

    // 1. Primary melodic bell-bubble oscillator
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
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.13);

    // 2. Subtle soft tactile click transient underneath
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = "triangle";
    clickOsc.frequency.setValueAtTime(240, t);
    clickOsc.frequency.exponentialRampToValueAtTime(60, t + 0.015);

    clickGain.gain.setValueAtTime(volume * 0.7, t);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

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

    const t = ctx.currentTime;
    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + idx * 0.045);

      gain.gain.setValueAtTime(0, t + idx * 0.045);
      gain.gain.linearRampToValueAtTime(volume * 0.7, t + idx * 0.045 + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.045 + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

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
    gain.connect(ctx.destination);

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
    gain.connect(ctx.destination);

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
    gain.connect(ctx.destination);

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

    const t = ctx.currentTime;
    // Sub-oscillator
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(160, t);
    sub.frequency.exponentialRampToValueAtTime(28, t + 0.45);

    subGain.gain.setValueAtTime(0, t);
    subGain.gain.linearRampToValueAtTime(volume, t + 0.005);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.48);

    sub.connect(subGain);
    subGain.connect(ctx.destination);

    // Crunch noise transient
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
    midGain.connect(ctx.destination);

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

    const t = ctx.currentTime;
    const notes = [987.77, 1318.51]; // B5 -> E6

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
      gain.connect(ctx.destination);

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
    gain.connect(ctx.destination);

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

    const t = ctx.currentTime;
    const notes = [587.33, 783.99, 987.77, 1174.66, 1567.98]; // D5, G5, B5, D6, G6

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
      gain.connect(ctx.destination);

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
    gain.connect(ctx.destination);

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
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.11);
  } catch {
    // Ignore audio errors
  }
}
