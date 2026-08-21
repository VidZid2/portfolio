import { format } from "date-fns"

import Grid from "@/components/charts/grid"
import LineChart, { Line } from "@/components/charts/line-chart"
import { ChartTooltip } from "@/components/charts/tooltip"
import {
  Metric,
  MetricChange,
  MetricLabel,
  MetricValue,
} from "@/components/metric"

export function Metrics01() {
  return (
    <div className="max-w-screen overflow-x-clip">
      <div className="container mx-auto px-4">
        <div className="border-x border-line py-8">
          <div className="screen-line-top screen-line-bottom">
            <h2 className="screen-line-bottom ml-4 font-heading text-3xl font-medium tracking-tight">
              Insights
              <sup className="top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">
                ({format(new Date(data.startDate), "dd.MM")} –{" "}
                {format(new Date(data.endDate), "dd.MM")})
              </sup>
            </h2>

            <div className="relative">
              <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 md:grid-cols-4">
                <div className="border-r border-line" />
                <div className="border-r border-line max-md:hidden" />
                <div className="border-r border-line max-md:hidden" />
              </div>

              <dl className="grid grid-cols-2 md:grid-cols-4">
                <Metric>
                  <MetricLabel>
                    Unique visitors
                    <MetricChange value={data.changes.uniqueVisitors} />
                  </MetricLabel>
                  <MetricValue>
                    {data.summary.uniqueVisitors.toLocaleString("en-US")}
                  </MetricValue>
                </Metric>

                <Metric>
                  <MetricLabel>
                    Sessions
                    <MetricChange value={data.changes.totalSessions} />
                  </MetricLabel>
                  <MetricValue>
                    {data.summary.totalSessions.toLocaleString("en-US")}
                  </MetricValue>
                </Metric>

                <Metric>
                  <MetricLabel>
                    Views
                    <MetricChange value={data.changes.totalScreenViews} />
                  </MetricLabel>
                  <MetricValue>
                    {data.summary.totalScreenViews.toLocaleString("en-US")}
                  </MetricValue>
                </Metric>

                <Metric>
                  <MetricLabel>
                    Session duration
                    <MetricChange value={data.changes.avgSessionDuration} />
                  </MetricLabel>
                  <MetricValue>
                    {formatDuration(data.summary.avgSessionDuration)}
                  </MetricValue>
                </Metric>
              </dl>
            </div>

            {data.series.length > 0 ? (
              <LineChart
                className="md:aspect-3/1!"
                data={data.series}
                margin={{ top: 16, right: 32, bottom: 40, left: 32 }}
              >
                <Grid horizontal />
                <Line
                  dataKey="totalSessions"
                  stroke="#71717a"
                  strokeWidth={2}
                />
                <Line
                  dataKey="uniqueVisitors"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
                <ChartTooltip />
              </LineChart>
            ) : (
              <div className="grid aspect-2/1 w-full place-content-center md:aspect-3/1">
                <p className="text-muted-foreground">No insights available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

type ISODateString = string

type InsightsSummary = {
  uniqueVisitors: number
  totalSessions: number
  totalScreenViews: number
  avgSessionDuration: number
}

type InsightsSeriesItem = {
  date: ISODateString
  uniqueVisitors: number
  totalSessions: number
}

/**
 * `null` where the previous period was zero, since growth from zero has no
 * meaningful percentage.
 */
type InsightsChanges = Record<keyof InsightsSummary, number | null>

type InsightsData = {
  summary: InsightsSummary
  changes: InsightsChanges
  series: InsightsSeriesItem[]
  startDate: ISODateString
  endDate: ISODateString
}

const initialSeries: InsightsSeriesItem[] = (() => {
  const list: InsightsSeriesItem[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split("T")[0];
    list.push({
      date: `${dateKey}T00:00:00.000Z`,
      uniqueVisitors: 0,
      totalSessions: 0,
    });
  }
  return list;
})();

export const data: InsightsData = {
  summary: {
    uniqueVisitors: 0,
    totalSessions: 0,
    avgSessionDuration: 0,
    totalScreenViews: 0,
  },
  changes: {
    uniqueVisitors: 12.4,
    totalSessions: 8.1,
    avgSessionDuration: 5.7,
    totalScreenViews: -3.2,
  },
  series: initialSeries,
  startDate: initialSeries[0]?.date.split("T")[0] || new Date().toISOString().split("T")[0],
  endDate: initialSeries[initialSeries.length - 1]?.date.split("T")[0] || new Date().toISOString().split("T")[0],
};

/**
 * Formats a duration given in seconds into a compact `Xh Ym Zs` string.
 * Zero-valued units are omitted; a zero duration renders as `0s`.
 */
export function formatDuration(seconds: number): string {
  const totalSeconds = Math.round(seconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0) parts.push(`${secs}s`)

  return parts.length > 0 ? parts.join(" ") : "0s"
}
