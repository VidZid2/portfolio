import { getAudioContext } from "./sound-engine";
import { getSoundEnabled } from "@/hooks/use-sound";

// Debounce trackers to prevent audio fatigue and spam
let lastHoverTime = 0;
let lastMoveSoundTime = 0;

/**
 * Ultra-smooth, satisfying haptic hover tick.
 * Sounds like a gentle wooden tap or velvety tactile micro-bump without any harsh frequencies.
 */
export function playHoverTick(volume: number = 0.035) {
  if (!getSoundEnabled()) return;

  const now = Date.now();
  if (now - lastHoverTime < 45) return; // Prevent rapid buzzing over lists
  lastHoverTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;

    // Dual-stage warm resonator
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    // Gentle warm sine dropping from 380Hz to 160Hz for organic body
    osc.type = "sine";
    osc.frequency.setValueAtTime(380, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.022);

    // Warm low-pass filter to eliminate harsh click edges
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(1.2, t);

    // Smooth, non-clicking exponential envelope (22ms total duration)
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.025);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Deeply satisfying, warm tactile button "thock" / mechanical velvet pop.
 */
export function playSoftClick(volume: number = 0.06) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;

    // 1. Primary warm fundamental
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(240, t);
    osc1.frequency.exponentialRampToValueAtTime(70, t + 0.04);

    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(volume, t + 0.002);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    // 2. Soft wooden body transient
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const filter2 = ctx.createBiquadFilter();

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(420, t);
    osc2.frequency.exponentialRampToValueAtTime(120, t + 0.03);

    filter2.type = "lowpass";
    filter2.frequency.setValueAtTime(800, t);

    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(volume * 0.4, t + 0.001);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.045);
    osc2.stop(t + 0.045);
  } catch {
    // Ignore
  }
}

/**
 * Crystalline, uplifting two-tone marimba chime when enabling audio.
 */
export function playToggleOn(volume: number = 0.06) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const notes = [523.25, 659.25]; // C5 -> E5 (Major 3rd)

    notes.forEach((freq, i) => {
      const start = t + i * 0.065;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.17);
    });
  } catch {
    // Ignore
  }
}

/**
 * Gentle, warm descending chime when muting audio.
 */
export function playToggleOff(volume: number = 0.04) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const notes = [659.25, 493.88]; // E5 -> B4

    notes.forEach((freq, i) => {
      const start = t + i * 0.055;
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
 * Smooth, velvety organic air swoosh for theme toggle.
 * - Light Mode: Smooth, uplifting airy whoosh (ascending filter sweep).
 * - Dark Mode: Soft, soothing twilight whoosh (descending filter sweep).
 */
export function playThemeSwoosh(isDark: boolean, volume: number = 0.08) {
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
export function playLaserSound(volume: number = 0.025) {
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
export function playExplosionSound(volume: number = 0.035) {
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
export function playHitChime(pitchIndex: number = 0, volume: number = 0.03) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    // Soothing pentatonic scale (D5, E5, G5, A5, C6, D6)
    const pitches = [587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66];
    const freq = pitches[pitchIndex % pitches.length] ?? 659.25;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  } catch {
    // Ignore
  }
}

/**
 * Ethereal, relaxing ambient victory progression (gentle Rhodes chords).
 */
export function playVictoryFanfare(volume: number = 0.04) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C major 7th arpeggio

    notes.forEach((freq, i) => {
      const start = t + i * 0.09;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.36);
    });
  } catch {
    // Ignore
  }
}

/**
 * Lush, atmospheric combo resonance with harmonic warmth.
 */
export function playSuperComboSound(tier: 5 | 10, volume: number = 0.04) {
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
 * Non-musical, gentle acoustic tap.
 */
export function playToastIn(volume: number = 0.025) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.022);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.025);
  } catch {
    // Ignore
  }
}

/**
 * Satisfying, warm tactile confirmation double-pop (like an Apple iOS / Linear haptic confirmation).
 * Low-frequency, deeply soothing, non-musical.
 */
export function playToastSuccess(volume: number = 0.035) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const pulses = [
      { time: 0, freqStart: 180, freqEnd: 80, vol: volume * 0.75, dur: 0.028 },
      { time: 0.035, freqStart: 240, freqEnd: 110, vol: volume, dur: 0.032 },
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
      filter.frequency.setValueAtTime(900, start);

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
 * Soft, muted low double-thud when an action fails.
 */
export function playToastError(volume: number = 0.028) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const pulses = [
      { time: 0, freqStart: 140, freqEnd: 65, dur: 0.03 },
      { time: 0.04, freqStart: 110, freqEnd: 50, dur: 0.035 },
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
      filter.frequency.setValueAtTime(300, start);

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
export function playToastOut(volume: number = 0.028) {
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
    osc.frequency.exponentialRampToValueAtTime(95, t + 0.04);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, t);

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
 * Soft, satisfying acoustic whoosh-pop when the user sends an AI prompt.
 */
export function playChatSend(volume: number = 0.04) {
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
export function playChatReceive(volume: number = 0.028) {
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
export function playChatDone(volume: number = 0.03) {
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
export function playChatOpen(volume: number = 0.035) {
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
export function playChatClose(volume: number = 0.025) {
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
export function playKeyTick(volume: number = 0.015) {
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
 * Crisp, soft physical paperclip/snap sound when adding or uploading attachments.
 */
export function playAttachmentSound(volume: number = 0.035) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const notes = [620, 880];

    notes.forEach((freq, idx) => {
      const start = t + idx * 0.025;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.045);
    });
  } catch {
    // Ignore
  }
}

/**
 * Satisfying dual-tick confirmation when copying code blocks or message responses.
 */
export function playCopySuccess(volume: number = 0.035) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const notes = [587.33, 880.0];

    notes.forEach((freq, idx) => {
      const start = t + idx * 0.035;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.065);
    });
  } catch {
    // Ignore
  }
}

/**
 * Soft, pleasant accordion paper-fold whoosh when toggling chain-of-thought / reasoning steps.
 */
export function playAccordionToggle(isOpen: boolean, volume: number = 0.028) {
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
 * Ethereal ambient chime when opening the Command Palette (Cmd+K).
 */
export function playCommandMenuOpen(volume: number = 0.035) {
  if (!getSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const notes = [440.0, 659.25];

    notes.forEach((freq, idx) => {
      const start = t + idx * 0.03;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.004);
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
 * Soft dismiss breath when closing the Command Palette.
 */
export function playCommandMenuClose(volume: number = 0.02) {
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
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.055);
  } catch {
    // Ignore
  }
}

/**
 * Tactile confirmation click when selecting a command or list item.
 */
export function playListSelect(volume: number = 0.04) {
  playSoftClick(volume);
}

/**
 * Reasoning Level 1: Low (Eco / Swift)
 * A soft, organic haptic sub-tap with warm wooden body.
 */
export function playReasoningLow(volume: number = 0.024) {
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
export function playReasoningMedium(volume: number = 0.026) {
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
export function playReasoningHigh(volume: number = 0.028) {
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
export function playReasoningMax(volume: number = 0.032) {
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
      playSoftClick(0.02);
      break;
  }
}


