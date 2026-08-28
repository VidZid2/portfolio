import { NextResponse } from "next/server";

export const runtime = "nodejs";

export interface ContributionDayData {
  level: 0 | 1 | 2 | 3 | 4;
  count: number;
  label?: string;
}

export type ContributionDataMap = Record<string, ContributionDayData>;

function mapGqlLevel(levelStr: string): 0 | 1 | 2 | 3 | 4 {
  switch (levelStr) {
    case "FOURTH_QUARTILE":
      return 4;
    case "THIRD_QUARTILE":
      return 3;
    case "SECOND_QUARTILE":
      return 2;
    case "FIRST_QUARTILE":
      return 1;
    default:
      return 0;
  }
}

function parseGithubHtml(html: string): { total: number; contributions: ContributionDataMap } | null {
  try {
    const totalMatch = html.match(/([\d,]+)\s+contributions\s+in/i);
    const total = totalMatch && totalMatch[1] ? parseInt(totalMatch[1].replace(/,/g, ""), 10) : 0;

    const tooltips = new Map<string, { count: number; label: string }>();
    const tooltipRegex = /<tool-tip[^>]+for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
    let ttMatch: RegExpExecArray | null;
    while ((ttMatch = tooltipRegex.exec(html)) !== null) {
      const id = ttMatch[1];
      const text = ttMatch[2]?.trim() ?? "";
      const countM = text.match(/^(\d+)\s+contribution/i);
      const count = countM && countM[1] ? parseInt(countM[1], 10) : 0;
      if (id) tooltips.set(id, { count, label: text });
    }

    const dayRegex =
      /<td[^>]*id="([^"]+)"[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"[^>]*>|<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="([^"]+)"[^>]*data-level="(\d+)"[^>]*>|<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"[^>]*>/g;

    const contributions: ContributionDataMap = {};
    let match: RegExpExecArray | null;

    while ((match = dayRegex.exec(html)) !== null) {
      const date = match[2] || match[4] || match[7];
      const rawLevel = parseInt(match[3] || match[6] || match[8] || "0", 10);
      const level = Math.min(4, Math.max(0, isNaN(rawLevel) ? 0 : rawLevel)) as 0 | 1 | 2 | 3 | 4;
      const id = match[1] || match[5];
      const tt = id ? tooltips.get(id) : null;
      const count = tt ? tt.count : level > 0 ? 1 : 0;
      const label = tt ? tt.label : `${count} contribution${count === 1 ? "" : "s"} on ${date}`;

      if (date) {
        contributions[date] = {
          level,
          count,
          label,
        };
      }
    }

    if (Object.keys(contributions).length > 0) {
      return { total, contributions };
    }
  } catch (err) {
    console.error("Error parsing GitHub contributions HTML:", err);
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "VidZid2";

  // 1. Primary (if GITHUB_TOKEN configured): Official GitHub GraphQL API (includes private repo commits if token has access)
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_KEY;
  if (token) {
    try {
      const query = `query {
        user(login: "${username}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }`;

      const gqlRes = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "portfolio",
        },
        body: JSON.stringify({ query }),
        signal: AbortSignal.timeout(6000),
        next: { revalidate: 1800 },
      });

      if (gqlRes.ok) {
        const gqlData = await gqlRes.json();
        const cal = gqlData?.data?.user?.contributionsCollection?.contributionCalendar;
        if (cal && Array.isArray(cal.weeks) && cal.weeks.length > 0) {
          const contributions: ContributionDataMap = {};
          for (const week of cal.weeks) {
            for (const day of week.contributionDays || []) {
              const level = mapGqlLevel(day.contributionLevel);
              const count = day.contributionCount ?? 0;
              contributions[day.date] = {
                level,
                count,
                label: `${count} contribution${count === 1 ? "" : "s"} on ${day.date}`,
              };
            }
          }
          return NextResponse.json(
            { total: cal.totalContributions ?? 0, contributions },
            {
              headers: {
                "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
              },
            },
          );
        }
      }
    } catch (err) {
      console.warn("GraphQL contributions fetch failed, falling back to public scraper:", err);
    }
  }

  // 2. Secondary: Official GitHub public profile scraper
  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      next: { revalidate: 1800 },
    });

    if (res.ok) {
      const html = await res.text();
      const parsed = parseGithubHtml(html);
      if (parsed && Object.keys(parsed.contributions).length > 0) {
        return NextResponse.json(parsed, {
          headers: {
            "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
          },
        });
      }
    }
  } catch (error) {
    console.warn("Primary GitHub contributions scraper failed, trying third-party APIs:", error);
  }

  // 3. Tertiary: jogruber API
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=all`, {
      next: { revalidate: 1800 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.contributions) && json.contributions.length > 0) {
        const contributions: ContributionDataMap = {};
        let total = 0;
        for (const entry of json.contributions) {
          const level = Math.min(4, Math.max(0, entry.level ?? 0)) as 0 | 1 | 2 | 3 | 4;
          const count = entry.count ?? (level > 0 ? 1 : 0);
          total += count;
          contributions[entry.date] = {
            level,
            count,
            label: `${count} contribution${count === 1 ? "" : "s"} on ${entry.date}`,
          };
        }
        return NextResponse.json(
          { total: json.total?.lastYear ?? total, contributions },
          {
            headers: {
              "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
            },
          },
        );
      }
    }
  } catch (error) {
    console.warn("Secondary jogruber API failed:", error);
  }

  // 4. Quaternary: vercel fallback
  try {
    const res = await fetch(`https://github-contributions.vercel.app/api/v1/${username}`, {
      next: { revalidate: 1800 },
    });
    if (res.ok) {
      const json = await res.json();
      const list = json?.contributions;
      if (Array.isArray(list) && list.length > 0) {
        const contributions: ContributionDataMap = {};
        let total = 0;
        for (const entry of list) {
          const level = Math.min(4, Math.max(0, entry.intensity ?? entry.level ?? 0)) as 0 | 1 | 2 | 3 | 4;
          const count = entry.count ?? (level > 0 ? 1 : 0);
          total += count;
          contributions[entry.date] = {
            level,
            count,
            label: `${count} contribution${count === 1 ? "" : "s"} on ${entry.date}`,
          };
        }
        return NextResponse.json(
          { total, contributions },
          {
            headers: {
              "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
            },
          },
        );
      }
    }
  } catch (error) {
    console.warn("Tertiary vercel API failed:", error);
  }

  return NextResponse.json(
    { error: `Could not load contributions for ${username}` },
    { status: 502 },
  );
}
