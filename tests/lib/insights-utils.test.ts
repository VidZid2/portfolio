import { beforeEach, describe, expect, it } from "vitest";
import {
  MAX_DURATION_SECONDS_PER_DAY,
  MAX_IDS_PER_DAY,
  MAX_SCREEN_VIEWS_PER_DAY,
  RECORD_RETENTION_DAYS,
  applyHeartbeat,
  computeChanges,
  dateKey,
  isValidId,
  pruneAndSanitizeStore,
  sanitizeRecord,
  type DailyMetricRecord,
  type InsightsStore,
} from "@/lib/insights-utils";

function emptyRecord(): DailyMetricRecord {
  return {
    uniqueVisitors: [],
    totalSessions: [],
    screenViews: 0,
    totalDurationSeconds: 0,
    durationCount: 0,
  };
}

describe("isValidId", () => {
  it("accepts well-formed ids up to 64 chars", () => {
    expect(isValidId("v-123-abc")).toBe(true);
    expect(isValidId("a".repeat(64))).toBe(true);
  });

  it("rejects injection-shaped or oversized ids", () => {
    expect(isValidId('{"$gt":1}')).toBe(false);
    expect(isValidId("a".repeat(65))).toBe(false);
    expect(isValidId("has space")).toBe(false);
    expect(isValidId(42)).toBe(false);
    expect(isValidId(undefined)).toBe(false);
  });
});

describe("sanitizeRecord", () => {
  it("caps id lists at the daily maximum", () => {
    const raw = {
      uniqueVisitors: Array.from({ length: 5000 }, (_, i) => `v-${i}`),
      totalSessions: [],
    };
    const clean = sanitizeRecord(raw);
    expect(clean.uniqueVisitors.length).toBe(MAX_IDS_PER_DAY);
  });

  it("clamps numeric fields into sane ranges", () => {
    const clean = sanitizeRecord({
      screenViews: 1e9,
      totalDurationSeconds: -50,
      durationCount: 1e9,
      uniqueVisitors: ["not a valid id!", "v-ok"],
    });
    expect(clean.screenViews).toBe(MAX_SCREEN_VIEWS_PER_DAY);
    expect(clean.totalDurationSeconds).toBe(0);
    expect(clean.durationCount).toBe(MAX_SCREEN_VIEWS_PER_DAY);
    expect(clean.uniqueVisitors).toEqual(["v-ok"]);
  });

  it("survives null/garbage input", () => {
    expect(sanitizeRecord(null)).toEqual(emptyRecord());
    expect(sanitizeRecord("junk")).toEqual(emptyRecord());
  });
});

describe("pruneAndSanitizeStore", () => {
  it("drops records beyond the retention window and malformed keys", () => {
    const store: InsightsStore = {
      createdTimestamp: 0,
      lastUpdated: 0,
      records: {
        [dateKey(0)]: emptyRecord(),
        [dateKey(RECORD_RETENTION_DAYS - 1)]: emptyRecord(),
        [dateKey(RECORD_RETENTION_DAYS + 1)]: emptyRecord(),
        "1999-01-01": emptyRecord(),
        "DROP TABLE;": emptyRecord(),
      },
    };

    const pruned = pruneAndSanitizeStore(store);
    expect(Object.keys(pruned.records).sort()).toEqual(
      [dateKey(RECORD_RETENTION_DAYS - 1), dateKey(0)].sort()
    );
  });
});

describe("applyHeartbeat", () => {
  it("registers visitor/session once and adds the duration delta", () => {
    const record = emptyRecord();
    applyHeartbeat(record, { visitorId: "v1", sessionId: "s1", durationSeconds: 30 });
    applyHeartbeat(record, { visitorId: "v1", sessionId: "s1", durationSeconds: 45 });

    expect(record.uniqueVisitors).toEqual(["v1"]);
    expect(record.totalSessions).toEqual(["s1"]);
    expect(record.screenViews).toBe(2);
    expect(record.totalDurationSeconds).toBe(75);
    expect(record.durationCount).toBe(2);
  });

  it("ignores non-positive deltas", () => {
    const record = emptyRecord();
    applyHeartbeat(record, { visitorId: "v1", durationSeconds: 0 });
    expect(record.totalDurationSeconds).toBe(0);
    expect(record.durationCount).toBe(0);
  });
});

describe("computeChanges", () => {
  beforeEach(() => {
    viUseFakeNow();
  });

  function recordWith(visitors: number, views: number): DailyMetricRecord {
    const record = emptyRecord();
    record.uniqueVisitors = Array.from({ length: visitors }, (_, i) => `v-${i}`);
    record.screenViews = views;
    return record;
  }

  it("computes real period-over-period percentages", () => {
    const records: Record<string, DailyMetricRecord> = {
      [dateKey(0)]: recordWith(10, 20),
      [dateKey(35)]: recordWith(5, 10),
    };

    const changes = computeChanges(records);
    expect(changes.uniqueVisitors).toBe(100); // 10 vs 5
    expect(changes.totalScreenViews).toBe(100); // 20 vs 10
    expect(changes.avgSessionDuration).toBeNull(); // no durations anywhere
  });

  it("returns null changes when the previous window is empty", () => {
    const records: Record<string, DailyMetricRecord> = {
      [dateKey(0)]: recordWith(10, 20),
    };
    const changes = computeChanges(records);
    expect(changes.uniqueVisitors).toBeNull();
    expect(changes.totalScreenViews).toBeNull();
  });
});

/** dateKey() derives from wall-clock; tests only need a stable "today". */
function viUseFakeNow() {
  // Nothing to fake: dateKey offsets are relative, so results are
  // deterministic regardless of the current date. Kept as documentation.
}
