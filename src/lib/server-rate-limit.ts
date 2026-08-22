import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Server-side rate limiting that actually works on serverless:
 * - Upstash Redis (persistent, cross-instance) when UPSTASH env vars are set
 * - In-memory per-instance fallback for local development
 *
 * The fallback resets on every cold start and is keyed per instance; it is a
 * convenience for local runs only. Production must set UPSTASH_REDIS_REST_URL
 * and UPSTASH_REDIS_REST_TOKEN.
 */

export type LimitResult = { success: boolean; limit: number; remaining: number };

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = upstashUrl && upstashToken ? new Redis({ url: upstashUrl, token: upstashToken }) : null;

const chatLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(40, "1 d"),
      prefix: "ratelimit:chat",
    })
  : null;

const insightsLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(120, "1 h"),
      prefix: "ratelimit:insights",
    })
  : null;

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, limit: number, windowMs: number): LimitResult {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { success: false, limit, remaining: 0 };
  }

  bucket.count += 1;
  return { success: true, limit, remaining: limit - bucket.count };
}

// Opportunistic cleanup so the dev-mode map cannot grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of memoryBuckets) {
    if (bucket.resetAt <= now) memoryBuckets.delete(key);
  }
}, 60_000).unref?.();

async function limit(
  limiter: Ratelimit | null,
  identifier: string,
  fallback: () => LimitResult
): Promise<LimitResult> {
  if (limiter) {
    try {
      const result = await limiter.limit(identifier);
      return { success: result.success, limit: result.limit, remaining: result.remaining };
    } catch {
      // Redis unavailable: fail open to the in-memory fallback.
    }
  }
  return fallback();
}

export function limitChat(ip: string): Promise<LimitResult> {
  return limit(chatLimiter, `chat:${ip}`, () => memoryLimit(`chat:${ip}`, 40, 24 * 60 * 60 * 1000));
}

export function limitInsights(ip: string): Promise<LimitResult> {
  return limit(insightsLimiter, `insights:${ip}`, () =>
    memoryLimit(`insights:${ip}`, 120, 60 * 60 * 1000)
  );
}

export function clientIp(req: Request): string {
  return req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
