"use client";

import { useState, useEffect } from "react";

// Default to true (sound enabled) but we will initialize from localStorage
let globalSoundEnabled = true; 
const listeners = new Set<(val: boolean) => void>();

export function toggleSound() {
  globalSoundEnabled = !globalSoundEnabled;
  localStorage.setItem("soundEnabled", String(globalSoundEnabled));
  listeners.forEach((l) => l(globalSoundEnabled));
}

export function setSoundEnabled(val: boolean) {
  globalSoundEnabled = val;
  localStorage.setItem("soundEnabled", String(globalSoundEnabled));
  listeners.forEach((l) => l(globalSoundEnabled));
}

export function getSoundEnabled() {
  return globalSoundEnabled;
}

export function useSoundPreferences() {
  const [enabled, setEnabled] = useState(globalSoundEnabled);

  useEffect(() => {
    // Only access localStorage on the client
    const saved = localStorage.getItem("soundEnabled");
    if (saved !== null) {
      const val = saved === "true";
      if (val !== globalSoundEnabled) {
        globalSoundEnabled = val;
      }
    }
    setEnabled(globalSoundEnabled);

    const listener = (val: boolean) => setEnabled(val);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { soundEnabled: enabled, toggleSound, setSoundEnabled };
}
