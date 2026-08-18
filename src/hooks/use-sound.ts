"use client";

import { useSyncExternalStore, useCallback } from "react";

let globalSoundEnabled = true;
let isInitialized = false;
const listeners = new Set<() => void>();

function initFromStorage() {
  if (typeof window !== "undefined" && !isInitialized) {
    isInitialized = true;
    try {
      const saved = localStorage.getItem("soundEnabled");
      if (saved !== null) {
        globalSoundEnabled = saved === "true";
      }
    } catch {
      // Ignore storage errors
    }
  }
}

export function toggleSound() {
  setSoundEnabled(!globalSoundEnabled);
}

export function setSoundEnabled(val: boolean) {
  globalSoundEnabled = val;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("soundEnabled", String(globalSoundEnabled));
    } catch {
      // Ignore storage errors
    }
  }
  listeners.forEach((l) => l());
}

export function getSoundEnabled() {
  initFromStorage();
  return globalSoundEnabled;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useSoundPreferences() {
  initFromStorage();
  const soundEnabled = useSyncExternalStore(
    subscribe,
    () => globalSoundEnabled,
    () => true
  );

  const handleToggle = useCallback(() => {
    toggleSound();
  }, []);

  const handleSet = useCallback((val: boolean) => {
    setSoundEnabled(val);
  }, []);

  return {
    soundEnabled,
    muted: !soundEnabled,
    toggleSound: handleToggle,
    toggleMute: handleToggle,
    setSoundEnabled: handleSet,
  };
}
