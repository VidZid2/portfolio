import { toastManager } from "@/components/ui/toast";
import { playToastError } from "@/lib/synth-sounds";

export const DAILY_REASONING_LIMIT = 20;

export type TrackedReasoningLevel = "high" | "max";
export type ReasoningLevel = "low" | "medium" | "high" | "max";

interface DailyQuotaRecord {
  date: string;
  highUsed: number;
  maxUsed: number;
}

const STORAGE_KEY = "portfolio_ai_reasoning_quota_v1";

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getQuotaState(): DailyQuotaRecord {
  if (typeof window === "undefined") {
    return { date: getTodayString(), highUsed: 0, maxUsed: 0 };
  }

  const today = getTodayString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: DailyQuotaRecord = JSON.parse(raw);
      if (parsed && parsed.date === today) {
        return {
          date: today,
          highUsed: Math.max(0, Number(parsed.highUsed) || 0),
          maxUsed: Math.max(0, Number(parsed.maxUsed) || 0),
        };
      }
    }
  } catch (e) {
    console.warn("Failed to read AI quota from localStorage:", e);
  }

  const fresh: DailyQuotaRecord = { date: today, highUsed: 0, maxUsed: 0 };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {}
  return fresh;
}

export function saveQuotaState(state: DailyQuotaRecord): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("ai-quota-updated", { detail: state }));
  } catch (e) {
    console.warn("Failed to save AI quota to localStorage:", e);
  }
}

export function getReasoningQuota(level: ReasoningLevel): {
  limit: number;
  used: number;
  remaining: number;
  isLimited: boolean;
  isExceeded: boolean;
} {
  if (level !== "high" && level !== "max") {
    return {
      limit: Infinity,
      used: 0,
      remaining: Infinity,
      isLimited: false,
      isExceeded: false,
    };
  }

  const state = getQuotaState();
  const used = level === "max" ? state.maxUsed : state.highUsed;
  const remaining = Math.max(0, DAILY_REASONING_LIMIT - used);
  const isExceeded = remaining <= 0;

  return {
    limit: DAILY_REASONING_LIMIT,
    used,
    remaining,
    isLimited: true,
    isExceeded,
  };
}

export function canMakeReasoningRequest(level: ReasoningLevel): boolean {
  if (level !== "high" && level !== "max") return true;
  const quota = getReasoningQuota(level);
  return !quota.isExceeded;
}

export function consumeReasoningQuota(level: ReasoningLevel): {
  success: boolean;
  remaining: number;
} {
  if (level !== "high" && level !== "max") {
    return { success: true, remaining: Infinity };
  }

  const state = getQuotaState();
  if (level === "max") {
    if (state.maxUsed >= DAILY_REASONING_LIMIT) {
      return { success: false, remaining: 0 };
    }
    state.maxUsed += 1;
  } else {
    if (state.highUsed >= DAILY_REASONING_LIMIT) {
      return { success: false, remaining: 0 };
    }
    state.highUsed += 1;
  }

  saveQuotaState(state);
  const remaining = Math.max(0, DAILY_REASONING_LIMIT - (level === "max" ? state.maxUsed : state.highUsed));
  return { success: true, remaining };
}

export function showQuotaExceededToast(level: TrackedReasoningLevel): void {
  playToastError(0.05);
  const title = level === "max" ? "Max Reasoning Quota Reached (0/20)" : "High Reasoning Quota Reached (0/20)";
  const levelLabel = level === "max" ? "Max" : "High";

  toastManager.warning(title, {
    description: `You've used all 20 daily ${levelLabel} reasoning queries for today. Quota resets at midnight. Switch to Medium or Low to continue chatting!`,
  });
}
