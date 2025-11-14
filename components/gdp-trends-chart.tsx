"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GDPData } from "@/types/bahamas-data";

interface GDPTrendsChartProps {
  data: GDPData[];
}

const chartConfig = {
  gdp: {
    label: "GDP",
    color: "hsl(var(--chart-1))",
  },
  tourism: {
    label: "Tourism",
    color: "hsl(var(--chart-2))",
  },
  financial: {
    label: "Financial",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function GDPTrendsChart({ data }: GDPTrendsChartProps) {
  const chartData = data.map((item) => ({
    period: `${item.year} ${item.quarter}`,
    gdp: item.gdp,
    tourism: item.sectors.tourism,
    financial: item.sectors.financial,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>GDP Trends</CardTitle>
        <CardDescription>
          Quarterly GDP and sector performance (in millions BSD)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 7)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="gdp"
              type="natural"
              fill="var(--color-gdp)"
              fillOpacity={0.4}
              stroke="var(--color-gdp)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
