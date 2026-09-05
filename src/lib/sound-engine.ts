"use client";

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let masterCompressor: DynamicsCompressorNode | null = null;
let masterHighShelf: BiquadFilterNode | null = null;
let masterHighPass: BiquadFilterNode | null = null;
const bufferCache = new Map<string, AudioBuffer>();

/**
 * Lazily retrieves or instantiates the singleton AudioContext.
 * Gracefully handles SSR environments and browser vendor prefixes.
 */
export function getAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    return {} as AudioContext;
  }
  if (!audioContext || audioContext.state === "closed") {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = new AudioCtx();
    masterGain = null;
    masterCompressor = null;
    masterHighShelf = null;
    masterHighPass = null;
  }
  return audioContext;
}

/**
 * Initializes the master audio mastering bus:
 * masterGain -> DynamicsCompressor -> HighShelf (warmth) -> HighPass (rumble filter) -> Destination.
 * 
 * Benefits:
 * 1. Zero clipping / distortion when multiple UI sound effects overlap.
 * 2. High-shelf tape-like warmth eliminates brittle digital harshness on laptop speakers / earbuds.
 * 3. Highpass cuts sub-30Hz inaudible rumble to maximize amplifier headroom.
 */
function ensureMasterBus(ctx: AudioContext): GainNode {
  if (masterGain && masterCompressor) return masterGain;

  try {
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1.0, ctx.currentTime);

    // Studio-grade soft dynamics limiter/compressor
    masterCompressor = ctx.createDynamicsCompressor();
    masterCompressor.threshold.setValueAtTime(-9, ctx.currentTime);
    masterCompressor.knee.setValueAtTime(12, ctx.currentTime);
    masterCompressor.ratio.setValueAtTime(3.5, ctx.currentTime);
    masterCompressor.attack.setValueAtTime(0.002, ctx.currentTime);
    masterCompressor.release.setValueAtTime(0.12, ctx.currentTime);

    // Gentle analog warmth high-shelf filter (tames harsh digital transients >11.5kHz)
    masterHighShelf = ctx.createBiquadFilter();
    masterHighShelf.type = "highshelf";
    masterHighShelf.frequency.setValueAtTime(11500, ctx.currentTime);
    masterHighShelf.gain.setValueAtTime(-1.8, ctx.currentTime);

    // Sub-sonic highpass filter (eliminates inaudible rumble below 30Hz)
    masterHighPass = ctx.createBiquadFilter();
    masterHighPass.type = "highpass";
    masterHighPass.frequency.setValueAtTime(30, ctx.currentTime);

    // Routing chain
    masterGain.connect(masterCompressor);
    masterCompressor.connect(masterHighShelf);
    masterHighShelf.connect(masterHighPass);
    masterHighPass.connect(ctx.destination);
  } catch {
    // Graceful fallback in environments with partial Web Audio support
  }

  return masterGain!;
}

/**
 * Returns the central master audio node that all synth sounds and sampled audio route into.
 */
export function getMasterBus(ctx?: AudioContext): AudioNode {
  const context = ctx || getAudioContext();
  if (!context || typeof context.createGain !== "function") {
    return {} as AudioNode;
  }
  const bus = ensureMasterBus(context);
  return bus || context.destination;
}

/**
 * Resumes the AudioContext if it is suspended by browser autoplay policies.
 * Unlocks iOS Safari WebKit audio by playing a silent 1-sample buffer.
 */
export async function resumeAudioContext(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      await ctx.resume();
    }
    // Safari iOS unlock: trigger a silent 1-sample buffer
    if (ctx && typeof ctx.createBuffer === "function") {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    }
  } catch {
    // Ignore autoplay restriction errors
  }
}

let isUnlocked = false;

/**
 * Seamlessly unlocks the Web Audio AudioContext on the user's first pointerdown / keydown / touch.
 */
export function unlockAudioContextOnInteraction(): void {
  if (typeof window === "undefined" || isUnlocked) return;
  isUnlocked = true;

  const unlock = () => {
    resumeAudioContext().catch(() => {});
    window.removeEventListener("pointerdown", unlock, true);
    window.removeEventListener("keydown", unlock, true);
    window.removeEventListener("touchstart", unlock, true);
  };

  window.addEventListener("pointerdown", unlock, { capture: true, once: true });
  window.addEventListener("keydown", unlock, { capture: true, once: true });
  window.addEventListener("touchstart", unlock, { capture: true, once: true });
}

export async function decodeAudioData(dataUri: string): Promise<AudioBuffer> {
  const cached = bufferCache.get(dataUri);
  if (cached) return cached;

  const ctx = getAudioContext();
  const base64 = dataUri.split(",")[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
  bufferCache.set(dataUri, audioBuffer);
  return audioBuffer;
}

export interface PlaySoundOptions {
  volume?: number;
  playbackRate?: number;
  onEnd?: () => void;
}

export interface SoundPlayback {
  stop: () => void;
}

import { getSoundEnabled } from "@/hooks/use-sound";

export async function playSound(
  dataUri: string,
  options: PlaySoundOptions = {}
): Promise<SoundPlayback> {
  if (!getSoundEnabled()) {
    return { stop: () => {} };
  }

  const { volume = 1, playbackRate = 1, onEnd } = options;
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume().catch(() => {});
  }

  const buffer = await decodeAudioData(dataUri);
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();

  source.buffer = buffer;
  source.playbackRate.value = playbackRate;
  gain.gain.value = volume;

  source.connect(gain);
  gain.connect(getMasterBus(ctx));

  source.onended = () => {
    onEnd?.();
  };

  source.start(0);

  return {
    stop: () => {
      try {
        source.stop();
      } catch {
        // No-op if already stopped.
      }
    },
  };
}
