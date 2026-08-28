import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Locked GitHub GraphQL endpoint.
 *
 * The client can only choose one of three named PR searches; the query text
 * never crosses the wire. This used to forward arbitrary client-supplied
 * GraphQL using the owner's token — an open proxy over the token's full scope.
 */

type PrFilter = "merged" | "open" | "closed";

const SEARCH_QUERIES: Record<PrFilter, string> = {
  merged: "author:VidZid2 type:pr is:merged",
  open: "author:VidZid2 type:pr is:open",
  closed: "author:VidZid2 type:pr is:closed is:unmerged",
};

function buildGraphQLQuery(searchQuery: string): string {
  return `query {
    search(query: "${searchQuery}", type: ISSUE, first: 100) {
      edges {
        node {
          ... on PullRequest {
            id
            title
            url
            repository {
              nameWithOwner
            }
            state
            createdAt
            mergedAt
            closedAt
          }
        }
      }
    }
  }`;
}

export async function POST(request: Request) {
  let filter: unknown;
  try {
    ({ filter } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (filter !== "merged" && filter !== "open" && filter !== "closed") {
    return NextResponse.json(
      { error: 'Invalid filter. Expected "merged", "open", or "closed".' },
      { status: 400 }
    );
  }

  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_KEY;
  if (!token) {
    return NextResponse.json({ error: "Server missing GITHUB_TOKEN credential" }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: buildGraphQLQuery(SEARCH_QUERIES[filter]) }),
      signal: AbortSignal.timeout(10_000),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        // Edge-caches identical requests so visitors stop burning the token's rate limit.
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("GitHub API Error:", error);
    return NextResponse.json({ error: "Failed to fetch from GitHub" }, { status: 502 });
  }
}
