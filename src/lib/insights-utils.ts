/**
 * Pure logic for the /api/insights route: payload sanitization, store
 * pruning/hardening, and period-over-period change computation.
 * Kept framework-free so unit tests can run without fs or Next.js.
 */

export const MAX_IDS_PER_DAY = 500;
export const MAX_SCREEN_VIEWS_PER_DAY = 1000;
export const MAX_DURATION_SECONDS_PER_DAY = 86_400; // sanity cap: 24h
export const RECORD_RETENTION_DAYS = 90;

export interface DailyMetricRecord {
  uniqueVisitors: string[];
  totalSessions: string[];
  screenViews: number;
  totalDurationSeconds: number;
  durationCount: number;
}

export interface InsightsStore {
  createdTimestamp: number;
  lastUpdated: number;
  records: Record<string, DailyMetricRecord>;
}

const ID_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

export function isValidId(value: unknown): value is string {
  return typeof value === "string" && ID_PATTERN.test(value);
}

function sanitizeIdList(list: unknown): string[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  for (const entry of list) {
    if (isValidId(entry)) seen.add(entry);
    if (seen.size >= MAX_IDS_PER_DAY) break;
  }
  return [...seen];
}

/** Clamp a stored day record to sane bounds; drops attacker-supplied junk. */
export function sanitizeRecord(raw: unknown): DailyMetricRecord {
  const record = (raw ?? {}) as Partial<DailyMetricRecord>;
  const screenViews =
    typeof record.screenViews === "number" && Number.isFinite(record.screenViews)
      ? Math.min(MAX_SCREEN_VIEWS_PER_DAY, Math.max(0, Math.floor(record.screenViews)))
      : 0;
  const totalDurationSeconds =
    typeof record.totalDurationSeconds === "number" && Number.isFinite(record.totalDurationSeconds)
      ? Math.min(MAX_DURATION_SECONDS_PER_DAY, Math.max(0, Math.floor(record.totalDurationSeconds)))
      : 0;
  const durationCount =
    typeof record.durationCount === "number" && Number.isFinite(record.durationCount)
      ? Math.min(MAX_SCREEN_VIEWS_PER_DAY, Math.max(0, Math.floor(record.durationCount)))
      : 0;

  return {
    uniqueVisitors: sanitizeIdList(record.uniqueVisitors),
    totalSessions: sanitizeIdList(record.totalSessions),
    screenViews,
    totalDurationSeconds,
    durationCount,
  };
}

export function dateKey(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

/** Drop records older than the retention window and re-sanitize the rest. */
export function pruneAndSanitizeStore(store: InsightsStore): InsightsStore {
  const cutoffKey = dateKey(RECORD_RETENTION_DAYS);
  const records: Record<string, DailyMetricRecord> = {};

  for (const [key, value] of Object.entries(store.records ?? {})) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    if (key < cutoffKey) continue;
    records[key] = sanitizeRecord(value);
  }

  return {
    createdTimestamp:
      typeof store.createdTimestamp === "number" ? store.createdTimestamp : Date.now(),
    lastUpdated: Date.now(),
    records,
  };
}

/**
 * Apply one validated heartbeat to today's record.
 * `durationSeconds` must already be a per-heartbeat DELTA, not cumulative.
 */
export function applyHeartbeat(
  record: DailyMetricRecord,
  input: { visitorId?: string; sessionId?: string; durationSeconds?: number }
): void {
  if (input.visitorId && !record.uniqueVisitors.includes(input.visitorId)) {
    record.uniqueVisitors.push(input.visitorId);
  }
  if (input.sessionId && !record.totalSessions.includes(input.sessionId)) {
    record.totalSessions.push(input.sessionId);
  }
  record.screenViews += 1;
  if (
    record.screenViews <= MAX_SCREEN_VIEWS_PER_DAY &&
    typeof input.durationSeconds === "number" &&
    input.durationSeconds > 0
  ) {
    record.totalDurationSeconds += input.durationSeconds;
    record.durationCount += 1;
  }
}

function sumWindow(records: Record<string, DailyMetricRecord>, startOffset: number, days: number) {
  let uniqueVisitors = 0;
  let totalSessions = 0;
  let screenViews = 0;
  let durationSum = 0;
  let durationCount = 0;

  for (let i = startOffset; i < startOffset + days; i++) {
    const record = records[dateKey(i)];
    if (!record) continue;
    uniqueVisitors += record.uniqueVisitors.length;
    totalSessions += record.totalSessions.length;
    screenViews += record.screenViews;
    durationSum += record.totalDurationSeconds;
    durationCount += record.durationCount;
  }

  return {
    uniqueVisitors,
    totalSessions,
    totalScreenViews: screenViews,
    avgSessionDuration: durationCount > 0 ? durationSum / durationCount : 0,
  };
}

function percentChange(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

/** Real period-over-period deltas: current window vs previous window (30d, 7d, or recent active split). */
export function computeChanges(records: Record<string, DailyMetricRecord>) {
  // 1. Primary: 30-day window comparison
  const current30 = sumWindow(records, 0, 30);
  const previous30 = sumWindow(records, 30, 30);

  let uniqueVisitors = percentChange(current30.uniqueVisitors, previous30.uniqueVisitors);
  let totalSessions = percentChange(current30.totalSessions, previous30.totalSessions);
  let totalScreenViews = percentChange(current30.totalScreenViews, previous30.totalScreenViews);
  let avgSessionDuration = percentChange(current30.avgSessionDuration, previous30.avgSessionDuration);

  // 2. If 30d baseline has no prior data, compare recent 4 days vs previous 4 days
  if (uniqueVisitors === null || totalSessions === null) {
    const current4 = sumWindow(records, 0, 4);
    const previous4 = sumWindow(records, 4, 4);
    if (previous4.uniqueVisitors > 0 || previous4.totalSessions > 0) {
      uniqueVisitors = percentChange(current4.uniqueVisitors, previous4.uniqueVisitors);
      totalSessions = percentChange(current4.totalSessions, previous4.totalSessions);
      totalScreenViews = percentChange(current4.totalScreenViews, previous4.totalScreenViews);
      avgSessionDuration = percentChange(current4.avgSessionDuration, previous4.avgSessionDuration);
    }
  }

  return {
    uniqueVisitors,
    totalSessions,
    totalScreenViews,
    avgSessionDuration,
  };
}
