
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { DepartmentAverageRating } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface DepartmentRatingsChartProps {
  data: DepartmentAverageRating[];
}

const chartConfig = {
  averageRating: {
    label: "Avg. Rating",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function DepartmentRatingsChart({ data }: DepartmentRatingsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Average Ratings</CardTitle>
          <CardDescription>Average performance ratings by department.</CardDescription>
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
        <CardTitle>Department Average Ratings</CardTitle>
        <CardDescription>Average performance ratings (1-5 stars) by department.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="department" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                interval={0}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[0, 5]} 
                allowDecimals={false} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="averageRating" name="Avg. Rating" fill="var(--color-averageRating)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

