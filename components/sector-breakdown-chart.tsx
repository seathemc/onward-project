"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

interface SectorBreakdownChartProps {
  data: GDPData[];
}

const chartConfig = {
  tourism: {
    label: "Tourism",
    color: "hsl(var(--chart-1))",
  },
  financial: {
    label: "Financial Services",
    color: "hsl(var(--chart-2))",
  },
  construction: {
    label: "Construction",
    color: "hsl(var(--chart-3))",
  },
  agriculture: {
    label: "Agriculture",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function SectorBreakdownChart({ data }: SectorBreakdownChartProps) {
  // Get the most recent quarter's data
  const latestData = data[data.length - 1];

  const chartData = [
    { sector: "Tourism", value: latestData.sectors.tourism, fill: "var(--color-tourism)" },
    { sector: "Financial", value: latestData.sectors.financial, fill: "var(--color-financial)" },
    { sector: "Construction", value: latestData.sectors.construction, fill: "var(--color-construction)" },
    { sector: "Agriculture", value: latestData.sectors.agriculture, fill: "var(--color-agriculture)" },
    { sector: "Other", value: latestData.sectors.other, fill: "var(--color-other)" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Economic Sectors</CardTitle>
        <CardDescription>
          GDP contribution by sector - {latestData.year} {latestData.quarter} (millions BSD)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="horizontal"
            margin={{
              left: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="sector"
              type="category"
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
