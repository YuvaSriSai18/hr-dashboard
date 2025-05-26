
"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { BookmarkTrend } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface BookmarkTrendsChartProps {
  data: BookmarkTrend[];
}

const chartConfig = {
  bookmarks: {
    label: "Bookmarks",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export function BookmarkTrendsChart({ data }: BookmarkTrendsChartProps) {
   if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bookmark Trends</CardTitle>
          <CardDescription>Number of employees bookmarked over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available to display the chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Bookmark Trends</CardTitle>
        <CardDescription>Mocked data showing number of employees bookmarked over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <Tooltip 
                  cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, fill: 'hsl(var(--accent))', opacity: 0.1 }}
                  content={<ChartTooltipContent indicator="dot" />}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="bookmarks" name="Bookmarks" stroke="var(--color-bookmarks)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-bookmarks)' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
