import { describe, it, expect } from "vitest";
import { getOctoberFirstTarget, calculateTimeRemaining } from "@/components/ReleaseCountdown";

describe("ReleaseCountdown calculations", () => {
  it("targets October 1st of the current year if before October 1st", () => {
    // September 4, 2026
    const sept4 = new Date(2026, 8, 4, 12, 0, 0).getTime();
    const target = getOctoberFirstTarget(sept4);
    const targetDate = new Date(target);
    expect(targetDate.getFullYear()).toBe(2026);
    expect(targetDate.getMonth()).toBe(9); // October
    expect(targetDate.getDate()).toBe(1);
    expect(targetDate.getHours()).toBe(0);
    expect(targetDate.getMinutes()).toBe(0);
  });

  it("targets October 1st of the next year if after October 1st", () => {
    // October 15, 2026
    const oct15 = new Date(2026, 9, 15, 12, 0, 0).getTime();
    const target = getOctoberFirstTarget(oct15);
    const targetDate = new Date(target);
    expect(targetDate.getFullYear()).toBe(2027);
    expect(targetDate.getMonth()).toBe(9);
    expect(targetDate.getDate()).toBe(1);
  });

  it("calculates time remaining correctly", () => {
    const target = new Date(2026, 9, 1, 0, 0, 0).getTime();
    // 2 days, 3 hours, 4 minutes, 5 seconds before target
    const now = target - (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000;
    const remaining = calculateTimeRemaining(target, now);
    expect(remaining.days).toBe(2);
    expect(remaining.hours).toBe(3);
    expect(remaining.minutes).toBe(4);
    expect(remaining.seconds).toBe(5);
    expect(remaining.total).toBeGreaterThan(0);
  });

  it("clamps to 0 when target is reached or in the past", () => {
    const target = new Date(2026, 9, 1, 0, 0, 0).getTime();
    const now = target + 5000;
    const remaining = calculateTimeRemaining(target, now);
    expect(remaining.days).toBe(0);
    expect(remaining.hours).toBe(0);
    expect(remaining.minutes).toBe(0);
    expect(remaining.seconds).toBe(0);
    expect(remaining.total).toBe(0);
  });
});
