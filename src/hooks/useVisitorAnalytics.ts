"use client";

import { useEffect, useState } from "react";
import { data as fallbackData } from "@/components/metrics-01";

export interface InsightsData {
  summary: {
    uniqueVisitors: number;
    totalSessions: number;
    totalScreenViews: number;
    avgSessionDuration: number;
  };
  changes: {
    uniqueVisitors: number | null;
    totalSessions: number | null;
    totalScreenViews: number | null;
    avgSessionDuration: number | null;
  };
  series: Array<{
    date: string;
    uniqueVisitors: number;
    totalSessions: number;
  }>;
  startDate: string;
  endDate: string;
}

function getOrCreateId(storage: Storage, key: string, prefix: string): string {
  try {
    let id = storage.getItem(key);
    if (!id) {
      id = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      storage.setItem(key, id);
    }
    return id;
  } catch {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}

export function useVisitorAnalytics() {
  const [insights, setInsights] = useState<InsightsData>(() => fallbackData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const visitorId = getOrCreateId(localStorage, "portfolio_visitor_id", "v");
    const sessionId = getOrCreateId(sessionStorage, "portfolio_session_id", "s");

    let isMounted = true;

    async function recordAndFetch() {
      try {
        // Record this visit
        const res = await fetch("/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, sessionId }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data && isMounted) {
            setInsights(json.data);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to GET
      }

      try {
        const getRes = await fetch("/api/insights");
        if (getRes.ok && isMounted) {
          const data = await getRes.json();
          setInsights(data);
        }
      } catch {
        // Silent fallback to default state
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    recordAndFetch();

    // Heartbeat duration tracking every 30 seconds.
    // Sends only the DELTA since the last beat — the server accumulates,
    // so sending cumulative elapsed would inflate quadratically.
    const startTime = Date.now();
    let lastSentSeconds = 0;
    const interval = setInterval(() => {
      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
      const delta = elapsedSeconds - lastSentSeconds;
      if (delta <= 0) return;
      lastSentSeconds = elapsedSeconds;
      fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, sessionId, durationSeconds: delta }),
      }).catch(() => {});
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { insights, isLoading };
}
