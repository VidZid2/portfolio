import { getAudioContext } from "./sound-engine";
import { getSoundEnabled } from "@/hooks/use-sound";
import { playHoverTick, playSoftClick } from "./synth-sounds";

export function hoverLink() {
  playHoverTick(0.035);
}

export function swirlFormation() {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    // Crystalline celestial chime (F#5, A#5, C#6)
    const notes = [739.99, 932.33, 1108.73];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = t + idx * 0.04;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.025, start + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.19);
    });
  } catch {
    // Ignore
  }
}

export function swirlClick() {
  playSoftClick(0.06);
}

let lastMoveTime = 0;
export function swirlMove(speed: number) {
  if (!getSoundEnabled()) return;
  const now = Date.now();
  if (now - lastMoveTime < 65) return; // limit frequency of move sounds
  lastMoveTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    const freq = 280 + Math.min(speed * 180, 400);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.025);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.018, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.028);
  } catch {
    // Ignore audio context errors
  }
}

export function swirlChurn(): { stop: () => void } {
  if (typeof window === "undefined" || !getSoundEnabled()) {
    return { stop: () => {} };
  }
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    
    // Create a very warm, soothing low ambient drone
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.value = 65.41; // C2 note - warm soothing drone
    
    osc2.type = "sine";
    osc2.frequency.value = 65.9; // Subtle organic beating
    
    filter.type = "lowpass";
    filter.frequency.value = 140; // Warm lowpass
    
    gain.gain.value = 0.015; // Gentle ambient background
    
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(0);
    osc2.start(0);
    
    return {
      stop: () => {
        try {
          const t = ctx.currentTime;
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
          setTimeout(() => {
            try {
              osc.stop();
              osc2.stop();
            } catch {}
          }, 120);
        } catch {
          // Ignore
        }
      }
    };
  } catch {
    return { stop: () => {} };
  }
}
