"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { YearComparison } from "@/types/bahamas-data";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface YearComparisonProps {
  data: YearComparison[];
  fromYear: number;
  toYear: number;
}

export function YearComparisonTable({ data, fromYear, toYear }: YearComparisonProps) {
  const formatValue = (value: number, isPercentage: boolean = false) => {
    if (isPercentage) {
      return `${value.toFixed(2)}%`;
    }
    return new Intl.NumberFormat("en-BS", {
      style: "currency",
      currency: "BSD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value * 1000000);
  };

  const getTrendIcon = (trend: YearComparison["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "stable":
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendBadge = (changePercent: number) => {
    if (changePercent > 5) {
      return (
        <Badge variant="default" className="bg-green-600">
          +{changePercent.toFixed(2)}%
        </Badge>
      );
    } else if (changePercent < -5) {
      return (
        <Badge variant="destructive">{changePercent.toFixed(2)}%</Badge>
      );
    } else {
      return (
        <Badge variant="secondary">
          {changePercent > 0 ? "+" : ""}
          {changePercent.toFixed(2)}%
        </Badge>
      );
    }
  };

  const isPercentageMetric = (metric: string) => {
    return metric.toLowerCase().includes("ratio") || metric.toLowerCase().includes("rate");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Year-over-Year Comparison</CardTitle>
        <CardDescription>
          Key metrics comparing {fromYear} to {toYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">{fromYear}</TableHead>
                <TableHead className="text-right">{toYear}</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">% Change</TableHead>
                <TableHead className="text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => {
                const isPercentage = isPercentageMetric(item.metric);
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.metric}</TableCell>
                    <TableCell className="text-right">
                      {formatValue(item.previousYear, isPercentage)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatValue(item.currentYear, isPercentage)}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        item.change > 0
                          ? "text-green-600"
                          : item.change < 0
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {item.change > 0 ? "+" : ""}
                      {formatValue(item.change, isPercentage)}
                    </TableCell>
                    <TableCell className="text-right">
                      {getTrendBadge(item.changePercent)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getTrendIcon(item.trend)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
