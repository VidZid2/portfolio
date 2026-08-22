import { NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";
import {
  applyHeartbeat,
  computeChanges,
  dateKey,
  isValidId,
  pruneAndSanitizeStore,
  type InsightsStore,
} from "@/lib/insights-utils";
import { clientIp, limitInsights } from "@/lib/server-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const heartbeatSchema = z.object({
  visitorId: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/).optional(),
  sessionId: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/).optional(),
  /** Per-heartboard DELTA in seconds, not cumulative elapsed. */
  durationSeconds: z.number().int().min(0).max(600).optional(),
});

const DATA_FILE_PATH = path.join(process.cwd(), ".insights-store.json");

function createEmptyStore(): InsightsStore {
  return {
    createdTimestamp: Date.now(),
    lastUpdated: Date.now(),
    records: {},
  };
}

// In-memory store fallback
let memoryStore: InsightsStore | null = null;

function loadStore(): InsightsStore {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content) as InsightsStore;
      if (parsed && typeof parsed.records === "object") {
        // Hardens legacy stores: strips junk, caps arrays, prunes >90 days.
        memoryStore = pruneAndSanitizeStore(parsed);
        return memoryStore;
      }
    }
  } catch {
    // If reading fails, fall back to memoryStore
  }

  if (!memoryStore) {
    memoryStore = createEmptyStore();
    saveStore(memoryStore);
  }

  return memoryStore;
}

function saveStore(store: InsightsStore) {
  memoryStore = store;
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // In read-only serverless filesystems, memoryStore will preserve state
  }
}

function getFormattedData(store: InsightsStore) {
  type SeriesPoint = { date: string; uniqueVisitors: number; totalSessions: number };
  const series: SeriesPoint[] = [];

  let totalUniqueVisitors = 0;
  let totalSessionsCount = 0;
  let totalViewsCount = 0;
  let totalDurationSum = 0;
  let totalDurationSessions = 0;

  // Past 30 days rolling window
  for (let i = 29; i >= 0; i--) {
    const key = dateKey(i);
    const isoDate = `${key}T00:00:00.000Z`;
    const record = store.records[key];

    const visitorsCount = record ? record.uniqueVisitors.length : 0;
    const sessionsCount = record ? record.totalSessions.length : 0;
    const viewsCount = record ? record.screenViews : 0;

    totalUniqueVisitors += visitorsCount;
    totalSessionsCount += sessionsCount;
    totalViewsCount += viewsCount;
    totalDurationSum += record ? record.totalDurationSeconds : 0;
    totalDurationSessions += record ? record.durationCount : 0;

    series.push({
      date: isoDate,
      uniqueVisitors: visitorsCount,
      totalSessions: sessionsCount,
    });
  }

  return {
    summary: {
      uniqueVisitors: totalUniqueVisitors,
      totalSessions: totalSessionsCount,
      totalScreenViews: totalViewsCount,
      avgSessionDuration:
        totalDurationSessions > 0 ? totalDurationSum / totalDurationSessions : 0,
    },
    changes: computeChanges(store.records),
    series,
    startDate: series[0]?.date.split("T")[0] ?? dateKey(29),
    endDate: series[series.length - 1]?.date.split("T")[0] ?? dateKey(0),
  };
}

export async function GET() {
  const store = loadStore();
  const data = getFormattedData(store);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const limit = await limitInsights(clientIp(req));
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parsed = heartbeatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }
    const input = parsed.data;

    // Defensive: schema guarantees shape, pattern check guards legacy IDs.
    const visitorId = input.visitorId && isValidId(input.visitorId) ? input.visitorId : undefined;
    const sessionId = input.sessionId && isValidId(input.sessionId) ? input.sessionId : undefined;

    const store = loadStore();
    const todayKey = dateKey(0);

    if (!store.records[todayKey]) {
      store.records[todayKey] = {
        uniqueVisitors: [],
        totalSessions: [],
        screenViews: 0,
        totalDurationSeconds: 0,
        durationCount: 0,
      };
    }

    applyHeartbeat(store.records[todayKey], {
      visitorId,
      sessionId,
      durationSeconds: input.durationSeconds,
    });

    store.lastUpdated = Date.now();
    saveStore(pruneAndSanitizeStore(store));

    const updatedData = getFormattedData(loadStore());
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to record insight" },
      { status: 500 }
    );
  }
}
