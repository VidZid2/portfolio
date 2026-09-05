import { beforeEach, describe, expect, it, vi } from "vitest";

// Web Audio API Mock
class MockAudioNode {
  connect = vi.fn().mockImplementation((dest?: unknown) => dest ?? this);
  disconnect = vi.fn();
}

class MockAudioParam {
  value = 0;
  setValueAtTime = vi.fn();
  linearRampToValueAtTime = vi.fn();
  exponentialRampToValueAtTime = vi.fn();
}

class MockOscillatorNode extends MockAudioNode {
  type = "sine";
  frequency = new MockAudioParam();
  start = vi.fn();
  stop = vi.fn();
}

class MockGainNode extends MockAudioNode {
  gain = new MockAudioParam();
}

class MockBiquadFilterNode extends MockAudioNode {
  type = "lowpass";
  frequency = new MockAudioParam();
  Q = new MockAudioParam();
  gain = new MockAudioParam();
}

class MockDynamicsCompressorNode extends MockAudioNode {
  threshold = new MockAudioParam();
  knee = new MockAudioParam();
  ratio = new MockAudioParam();
  attack = new MockAudioParam();
  release = new MockAudioParam();
}

class MockBufferSourceNode extends MockAudioNode {
  buffer: unknown = null;
  playbackRate = new MockAudioParam();
  start = vi.fn();
  stop = vi.fn();
}

class MockAudioContext {
  state: "suspended" | "running" | "closed" = "running";
  currentTime = 0;
  sampleRate = 44100;
  destination = new MockAudioNode();

  createGain = vi.fn(() => new MockGainNode());
  createOscillator = vi.fn(() => new MockOscillatorNode());
  createBiquadFilter = vi.fn(() => new MockBiquadFilterNode());
  createDynamicsCompressor = vi.fn(() => new MockDynamicsCompressorNode());
  createBufferSource = vi.fn(() => new MockBufferSourceNode());
  createBuffer = vi.fn((channels: number, length: number, sampleRate: number) => ({
    numberOfChannels: channels,
    length,
    sampleRate,
    getChannelData: vi.fn(() => new Float32Array(length)),
  }));
  decodeAudioData = vi.fn().mockResolvedValue({
    duration: 1,
    numberOfChannels: 2,
    sampleRate: 44100,
  });
  resume = vi.fn().mockResolvedValue(undefined);
}

// Setup window and globals
const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => void store.set(key, value),
  removeItem: (key: string) => void store.delete(key),
  clear: () => store.clear(),
});

vi.stubGlobal("AudioContext", MockAudioContext);
vi.stubGlobal("window", {
  AudioContext: MockAudioContext,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  localStorage: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
  },
});

type EventCallback = (e: unknown) => void;
const documentListeners = new Map<string, EventCallback[]>();

const mockDocument = {
  addEventListener: vi.fn((event: string, cb: EventCallback) => {
    const list = documentListeners.get(event) || [];
    list.push(cb);
    documentListeners.set(event, list);
  }),
  removeEventListener: vi.fn((event: string, cb: EventCallback) => {
    const list = documentListeners.get(event) || [];
    documentListeners.set(event, list.filter((l) => l !== cb));
  }),
  querySelector: vi.fn(),
  body: {},
};

vi.stubGlobal("document", mockDocument);

import {
  getSoundEnabled,
  setSoundEnabled,
  toggleSound,
} from "@/hooks/use-sound";
import {
  getAudioContext,
  getMasterBus,
  resumeAudioContext,
  unlockAudioContextOnInteraction,
} from "@/lib/sound-engine";
import {
  playHoverTick,
  playSoftClick,
  playTabSelect,
  playPopClick,
  playModalOpen,
  playModalClose,
  playToastIn,
  playToastSuccess,
  playToastError,
  playToastWarning,
  playToastOut,
  playToggleOn,
  playToggleOff,
  playThemeSwoosh,
  playCopySuccess,
  playCommandMenuOpen,
  playCommandMenuClose,
  playListSelect,
  playKeyTick,
  playAccordionToggle,
  playReasoningSound,
  playHitChime,
} from "@/lib/synth-sounds";
import { toast, toastManager } from "@/components/ui/toast";

describe("Sound Preferences", () => {
  beforeEach(() => {
    store.clear();
    setSoundEnabled(true);
  });

  it("defaults to sound enabled", () => {
    expect(getSoundEnabled()).toBe(true);
  });

  it("updates sound preference correctly", () => {
    setSoundEnabled(false);
    expect(getSoundEnabled()).toBe(false);
    expect(store.get("soundEnabled")).toBe("false");

    toggleSound();
    expect(getSoundEnabled()).toBe(true);
    expect(store.get("soundEnabled")).toBe("true");
  });
});

describe("Sound Engine & Master Bus", () => {
  beforeEach(() => {
    setSoundEnabled(true);
  });

  it("lazily creates an AudioContext singleton", () => {
    const ctx = getAudioContext();
    expect(ctx).toBeDefined();
    expect(ctx.createGain).toBeDefined();
  });

  it("creates master bus with dynamics compression, warmth filter, and rumble cut", () => {
    const ctx = getAudioContext();
    const bus = getMasterBus(ctx);
    expect(bus).toBeDefined();
    expect(ctx.createDynamicsCompressor).toHaveBeenCalled();
    expect(ctx.createBiquadFilter).toHaveBeenCalled();
  });

  it("can resume suspended audio context", async () => {
    const ctx = getAudioContext();
    ctx.state = "suspended";
    await resumeAudioContext();
    expect(ctx.resume).toHaveBeenCalled();
  });

  it("registers interaction listeners to unlock audio", () => {
    expect(() => unlockAudioContextOnInteraction()).not.toThrow();
  });
});

describe("Procedural Synthesis Sound Effects", () => {
  beforeEach(() => {
    setSoundEnabled(true);
  });

  it("plays hover tick with micro-pitch variation and connects through master bus", () => {
    const ctx = getAudioContext();
    const oscSpy = vi.spyOn(ctx, "createOscillator");
    playHoverTick(0.06);
    expect(oscSpy).toHaveBeenCalled();
  });

  it("debounces rapid hover ticks within the throttle window", () => {
    const ctx = getAudioContext();
    const oscSpy = vi.spyOn(ctx, "createOscillator");
    oscSpy.mockClear();

    playHoverTick(0.06);
    const firstCallCount = oscSpy.mock.calls.length;
    // Rapid immediate subsequent call
    playHoverTick(0.06);
    expect(oscSpy.mock.calls.length).toBe(firstCallCount);
  });

  it("plays soft click (mechanical thock) with multi-harmonic layers", () => {
    const ctx = getAudioContext();
    const oscSpy = vi.spyOn(ctx, "createOscillator");
    oscSpy.mockClear();

    playSoftClick(0.1);
    // Soft click uses 4 oscillators (sub + housing + contact transient + leaf rebound)
    expect(oscSpy.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  it("debounces soft click to avoid double-triggers", () => {
    const ctx = getAudioContext();
    const oscSpy = vi.spyOn(ctx, "createOscillator");
    oscSpy.mockClear();

    playSoftClick(0.1);
    const countAfterFirst = oscSpy.mock.calls.length;
    // Immediate second trigger within debounce window
    playSoftClick(0.1);
    expect(oscSpy.mock.calls.length).toBe(countAfterFirst);
  });

  it("plays tab select, pop click, and modal open/close", () => {
    expect(() => playTabSelect(0.08)).not.toThrow();
    expect(() => playPopClick(0.09)).not.toThrow();
    expect(() => playModalOpen(0.075)).not.toThrow();
    expect(() => playModalClose(0.06)).not.toThrow();
  });

  it("plays all notification sounds (toast in, success, error, warning, out)", () => {
    expect(() => playToastIn(0.07)).not.toThrow();
    expect(() => playToastSuccess(0.085)).not.toThrow();
    expect(() => playToastError(0.075)).not.toThrow();
    expect(() => playToastWarning(0.075)).not.toThrow();
    expect(() => playToastOut(0.05)).not.toThrow();
  });

  it("plays audio toggle on/off chimes", () => {
    expect(() => playToggleOn(0.085)).not.toThrow();
    expect(() => playToggleOff(0.07)).not.toThrow();
  });

  it("plays theme swoosh for light and dark modes with cached pink noise", () => {
    expect(() => playThemeSwoosh(true, 0.12)).not.toThrow();
    expect(() => playThemeSwoosh(false, 0.12)).not.toThrow();
  });

  it("plays copy success, command menu, and reasoning tiers", () => {
    expect(() => playCopySuccess(0.085)).not.toThrow();
    expect(() => playCommandMenuOpen(0.085)).not.toThrow();
    expect(() => playCommandMenuClose(0.06)).not.toThrow();
    expect(() => playListSelect(0.08)).not.toThrow();
    expect(() => playKeyTick(0.035)).not.toThrow();
    expect(() => playAccordionToggle(true, 0.065)).not.toThrow();
    expect(() => playAccordionToggle(false, 0.065)).not.toThrow();
    expect(() => playReasoningSound("low")).not.toThrow();
    expect(() => playReasoningSound("medium")).not.toThrow();
    expect(() => playReasoningSound("high")).not.toThrow();
    expect(() => playReasoningSound("max")).not.toThrow();
    expect(() => playHitChime(1, 0.075)).not.toThrow();
  });

  it("respects soundEnabled = false by muting all sounds", () => {
    setSoundEnabled(false);
    const ctx = getAudioContext();
    const oscSpy = vi.spyOn(ctx, "createOscillator");
    oscSpy.mockClear();

    playSoftClick(0.1);
    playToastSuccess(0.085);
    playThemeSwoosh(true, 0.12);

    expect(oscSpy).not.toHaveBeenCalled();
  });
});

describe("Notification Integration (toast / toastManager)", () => {
  beforeEach(() => {
    setSoundEnabled(true);
  });

  it("exports unified callable toast function matching toastManager", () => {
    expect(typeof toast).toBe("function");
    expect(typeof toast.success).toBe("function");
    expect(typeof toast.error).toBe("function");
    expect(typeof toast.warning).toBe("function");
    expect(typeof toast.info).toBe("function");
    expect(typeof toast.message).toBe("function");
    expect(typeof toast.promise).toBe("function");
    expect(typeof toast.dismiss).toBe("function");

    expect(toastManager).toBeDefined();
    expect(typeof toastManager.success).toBe("function");
    expect(typeof toastManager.error).toBe("function");
    expect(typeof toastManager.warning).toBe("function");
    expect(typeof toastManager.info).toBe("function");
    expect(typeof toastManager.message).toBe("function");
    expect(typeof toastManager.promise).toBe("function");
    expect(typeof toastManager.dismiss).toBe("function");
  });

  it("triggers sound effects when toast notifications are dispatched", () => {
    const ctx = getAudioContext();
    const oscSpy = vi.spyOn(ctx, "createOscillator");

    oscSpy.mockClear();
    expect(() => toast.success("Saved successfully")).not.toThrow();
    expect(oscSpy).toHaveBeenCalled();

    oscSpy.mockClear();
    expect(() => toast.error("An error occurred")).not.toThrow();
    expect(oscSpy).toHaveBeenCalled();

    expect(() => toast.warning("Caution")).not.toThrow();
    expect(() => toast.info("Info message")).not.toThrow();
    expect(() => toast("Regular message")).not.toThrow();
    expect(() => toast.dismiss()).not.toThrow();

    oscSpy.mockClear();
    expect(() => toastManager.success("Saved successfully")).not.toThrow();
    expect(oscSpy).toHaveBeenCalled();

    oscSpy.mockClear();
    expect(() => toastManager.error("An error occurred")).not.toThrow();
    expect(oscSpy).toHaveBeenCalled();

    expect(() => toastManager.warning("Caution")).not.toThrow();
    expect(() => toastManager.info("Info message")).not.toThrow();
    expect(() => toastManager.message("Regular message")).not.toThrow();
    expect(() => toastManager.dismiss()).not.toThrow();
  });
});

describe("SoundProvider & Interactive Audio Routing", () => {
  beforeEach(() => {
    setSoundEnabled(true);
  });

  it("exports useSound and SoundProvider properly", async () => {
    const { SoundProvider, useSound } = await import("@/components/providers/sound-provider");
    expect(SoundProvider).toBeDefined();
    expect(typeof SoundProvider).toBe("function");
    expect(useSound).toBeDefined();
    expect(typeof useSound).toBe("function");
  });
});
