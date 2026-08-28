'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type SoundContextType = {
  isMuted: boolean;
  toggleMute: () => void;
};

export const SoundContext = createContext<SoundContextType | null>(null);

const STORAGE_KEY = 'sound-muted';

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Load preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsMuted(stored === 'true');
    }
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    return audioCtxRef.current;
  }, []);

  const playToggleSound = useCallback(
    (turningOn: boolean) => {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const currentTime = ctx.currentTime;
        const gain = ctx.createGain();
        gain.connect(ctx.destination);

        if (turningOn) {
          // Wingling sound - quick ascending notes
          const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, currentTime + i * 0.06);

            noteGain.gain.setValueAtTime(0, currentTime + i * 0.06);
            noteGain.gain.linearRampToValueAtTime(0.12, currentTime + i * 0.06 + 0.01);
            noteGain.gain.exponentialRampToValueAtTime(0.001, currentTime + i * 0.06 + 0.08);

            osc.connect(noteGain);
            noteGain.connect(ctx.destination);

            osc.start(currentTime + i * 0.06);
            osc.stop(currentTime + i * 0.06 + 0.1);
          });
        } else {
          // Descending soft sound for mute
          const notes = [784, 523]; // G5, C5
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, currentTime + i * 0.08);

            noteGain.gain.setValueAtTime(0, currentTime + i * 0.08);
            noteGain.gain.linearRampToValueAtTime(0.08, currentTime + i * 0.08 + 0.01);
            noteGain.gain.exponentialRampToValueAtTime(0.001, currentTime + i * 0.08 + 0.1);

            osc.connect(noteGain);
            noteGain.connect(ctx.destination);

            osc.start(currentTime + i * 0.08);
            osc.stop(currentTime + i * 0.08 + 0.12);
          });
        }
      } catch {
        // Silently fail
      }
    },
    [getAudioContext]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY, String(newValue));

      // Play toggle sound (only when unmuting, since we're about to mute otherwise)
      if (!newValue) {
        playToggleSound(true);
      }

      return newValue;
    });
  }, [playToggleSound]);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
