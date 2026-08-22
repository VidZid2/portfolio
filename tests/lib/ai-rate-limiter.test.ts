import { beforeEach, describe, expect, it, vi } from "vitest";

const dispatchEvent = vi.fn();

vi.mock("@/components/ui/toast", () => ({
  toastManager: { warning: vi.fn() },
}));
vi.mock("@/lib/synth-sounds", () => ({
  playToastError: vi.fn(),
}));

const store = new Map<string, string>();

vi.stubGlobal(
  "localStorage",
  {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  }
);
vi.stubGlobal("window", { dispatchEvent });

import {
  DAILY_REASONING_LIMIT,
  canMakeReasoningRequest,
  consumeReasoningQuota,
  getQuotaState,
  getReasoningQuota,
} from "@/lib/ai-rate-limiter";

beforeEach(() => {
  store.clear();
  dispatchEvent.mockClear();
});

describe("getQuotaState", () => {
  it("starts at zero usage", () => {
    const state = getQuotaState();
    expect(state.highUsed).toBe(0);
    expect(state.maxUsed).toBe(0);
  });

  it("resets counters when the stored record is from a previous day", () => {
    localStorage.setItem(
      "portfolio_ai_reasoning_quota_v1",
      JSON.stringify({ date: "1999-01-01", highUsed: 19, maxUsed: 20 })
    );
    const state = getQuotaState();
    expect(state.highUsed).toBe(0);
    expect(state.maxUsed).toBe(0);
  });

  it("survives corrupt JSON without throwing", () => {
    localStorage.setItem("portfolio_ai_reasoning_quota_v1", "{not json");
    expect(() => getQuotaState()).not.toThrow();
    expect(getQuotaState().highUsed).toBe(0);
  });
});

describe("reasoning quota enforcement", () => {
  it("low/medium are unlimited", () => {
    expect(getReasoningQuota("low").isLimited).toBe(false);
    expect(canMakeReasoningRequest("medium")).toBe(true);
    expect(consumeReasoningQuota("low")).toEqual({ success: true, remaining: Infinity });
  });

  it("consumes one high request at a time", () => {
    expect(consumeReasoningQuota("high")).toEqual({
      success: true,
      remaining: DAILY_REASONING_LIMIT - 1,
    });
    expect(consumeReasoningQuota("high").remaining).toBe(DAILY_REASONING_LIMIT - 2);
  });

  it("blocks requests once the daily limit is exhausted", () => {
    for (let i = 0; i < DAILY_REASONING_LIMIT; i++) {
      expect(consumeReasoningQuota("max").success).toBe(true);
    }
    expect(consumeReasoningQuota("max")).toEqual({ success: false, remaining: 0 });
    expect(canMakeReasoningRequest("max")).toBe(false);
  });

  it("tracks high and max quotas independently", () => {
    for (let i = 0; i < DAILY_REASONING_LIMIT; i++) consumeReasoningQuota("high");
    expect(canMakeReasoningRequest("high")).toBe(false);
    expect(canMakeReasoningRequest("max")).toBe(true);
  });
});
