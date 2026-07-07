import { playSound } from "./sound-engine";
import { click003Sound } from "./click-003";
import { clickSoftSound } from "./soundcn/click-soft";
import { laserSmall001Sound } from "./soundcn/laser-small-001";

export function hoverLink() {
  try {
    playSound(click003Sound.dataUri, { volume: 0.08 });
  } catch (e) {
    // Ignore audio context errors
  }
}

export function swirlFormation() {
  try {
    playSound(laserSmall001Sound.dataUri, { volume: 0.12, playbackRate: 0.95 });
  } catch (e) {
    // Ignore audio context errors
  }
}

export function swirlClick() {
  try {
    playSound(clickSoftSound.dataUri, { volume: 0.3, playbackRate: 0.7 });
  } catch (e) {
    // Ignore audio context errors
  }
}

let lastMoveTime = 0;
export function swirlMove(speed: number) {
  const now = Date.now();
  if (now - lastMoveTime < 60) return; // limit frequency of move sounds
  lastMoveTime = now;

  try {
    const rate = Math.min(2.0, Math.max(0.6, 0.5 + speed * 1.5));
    playSound(click003Sound.dataUri, { volume: 0.03, playbackRate: rate });
  } catch (e) {
    // Ignore audio context errors
  }
}

export function swirlChurn(): { stop: () => void } {
  if (typeof window === "undefined") {
    return { stop: () => {} };
  }
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a low frequency oscillator and a lowpass filter to make it sound like a deep ambient churn drone
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.value = 55; // A1 note - very deep bass drone
    
    // Add another oscillator at a slightly different frequency to create a beating/churning effect
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 55.5; // Slightly detuned
    
    filter.type = "lowpass";
    filter.frequency.value = 120; // Cut off high frequencies to keep it deep and rumbling
    
    gain.gain.value = 0.03; // Keep it very quiet as an ambient background drone
    
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(0);
    osc2.start(0);
    
    return {
      stop: () => {
        try {
          osc.stop();
          osc2.stop();
          ctx.close();
        } catch (e) {
          // Ignore
        }
      }
    };
  } catch (e) {
    return { stop: () => {} };
  }
}
