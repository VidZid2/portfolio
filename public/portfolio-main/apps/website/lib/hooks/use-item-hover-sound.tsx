'use client';

import { useCallback, useContext, useRef } from 'react';
import { SoundContext } from '@/lib/contexts/sound-context';

/**
 * Custom hook that creates a soft "pop" sound effect on hover for list items
 * using the Web Audio API.
 */
export function useItemHoverSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastPlayedRef = useRef<number>(0);
  const soundContext = useContext(SoundContext);

  const play = useCallback(() => {
    // Don't play if muted
    if (soundContext?.isMuted) return;

    // Throttle: don't play if less than 80ms since last play
    const now = Date.now();
    if (now - lastPlayedRef.current < 80) return;
    lastPlayedRef.current = now;

    try {
      // Create or resume audio context
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;

        if (!AudioContextClass) return;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;

      // Resume if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const duration = 0.06;
      const currentTime = ctx.currentTime;

      // Create noise buffer for soft swoosh (shorter, lighter version)
      const bufferSize = ctx.sampleRate * duration;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate filtered noise
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;

      // Higher frequency bandpass for lighter sound
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 2200;
      bandpass.Q.value = 0.8;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, currentTime);
      gain.gain.linearRampToValueAtTime(0.1, currentTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

      source.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      source.start(currentTime);
      source.stop(currentTime + duration);
    } catch (e) {
      // Silently fail - sound is not critical
    }
  }, [soundContext?.isMuted]);

  return play;
}
