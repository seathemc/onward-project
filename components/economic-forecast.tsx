"use client";

import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { forecastScenarios } from "@/lib/forecast-scenarios";
import { Check, Plus } from "lucide-react";
import confetti from "canvas-confetti";

const iconMap: Record<string, string> = {
  "trending-up": "📈",
  "plane": "✈️",
  "leaf": "🌱",
  "cpu": "💻",
  "book": "📚",
  "scale": "⚖️",
  "alert-triangle": "⚠️",
};

export function EconomicForecast() {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(["education-first", "chronic-unemployment"]);
  const [metric, setMetric] = useState<"gdp" | "gdpPerCapita" | "unemployment" | "debtToGDP">("gdp");

  const toggleScenario = (id: string) => {
    setSelectedScenarios(prev => {
      const isCurrentlySelected = prev.includes(id);

      // If adding a good scenario, fire confetti
      if (!isCurrentlySelected) {
        const scenario = forecastScenarios.find(s => s.id === id);
        if (scenario?.category === "good") {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }

      return isCurrentlySelected ? prev.filter(s => s !== id) : [...prev, id];
    });
  };

  const selectedData = forecastScenarios.filter(s => selectedScenarios.includes(s.id));

  // Prepare chart data
  const years = [2025, 2030, 2035, 2040, 2045, 2050, 2055];
  const chartData = years.map(year => {
    const dataPoint: any = { year };
    selectedData.forEach(scenario => {
      const projection = scenario.projections.find(p => p.year === year);
      if (projection) {
        dataPoint[scenario.id] = projection[metric];
      }
    });
    return dataPoint;
  });

  const metricLabels = {
    gdp: { label: "GDP (Billions BSD)", format: (v: number) => `$${v}B` },
    gdpPerCapita: { label: "GDP Per Capita (BSD)", format: (v: number) => `$${v.toLocaleString()}` },
    unemployment: { label: "Unemployment Rate (%)", format: (v: number) => `${v}%` },
    debtToGDP: { label: "Debt-to-GDP Ratio (%)", format: (v: number) => `${v}%` },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="outline" className="mb-2">
          🔮 30-Year Economic Forecast
        </Badge>
        <h2 className="text-3xl font-normal">Bahamas 2055</h2>
        <p className="text-base text-muted-foreground max-w-3xl mx-auto font-normal">
          Explore how different policy choices could shape the Bahamas economy over the next three decades
        </p>
      </div>

      {/* Good Scenarios Section */}
      <div className="space-y-4">
        <div className="text-center">
          <Badge variant="outline" className="bg-blue-50">
            ✨ Positive Growth Scenarios
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Optimistic pathways showing strong economic growth and development
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {forecastScenarios.filter(s => s.category === "good").map((scenario) => {
            const emoji = iconMap[scenario.icon] || "📈";
            const isSelected = selectedScenarios.includes(scenario.id);

            return (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-all ${
                  isSelected ? `border-2 border-blue-500` : "hover:shadow-md"
                }`}
                onClick={() => toggleScenario(scenario.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">
                          {emoji}
                        </div>
                        <CardTitle className="text-base font-normal">{scenario.name}</CardTitle>
                      </div>
                      <CardDescription className="text-sm">{scenario.description}</CardDescription>
                    </div>
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3 w-3" />
                          Selected
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3" />
                          Select
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Bad Scenarios Section */}
      <div className="space-y-4">
        <div className="text-center">
          <Badge variant="outline" className="bg-red-50">
            ⚠️ Challenging Scenarios
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Potential risks and negative economic outcomes to prepare for
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {forecastScenarios.filter(s => s.category === "bad").map((scenario) => {
            const emoji = iconMap[scenario.icon] || "⚠️";
            const isSelected = selectedScenarios.includes(scenario.id);

            return (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-all ${
                  isSelected ? `border-2 border-red-500` : "hover:shadow-md"
                }`}
                onClick={() => toggleScenario(scenario.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">
                          {emoji}
                        </div>
                        <CardTitle className="text-base font-normal">{scenario.name}</CardTitle>
                      </div>
                      <CardDescription className="text-sm">{scenario.description}</CardDescription>
                    </div>
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3 w-3" />
                          Selected
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3" />
                          Select
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedData.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center text-muted-foreground">
            Select at least one scenario to view projections
          </CardContent>
        </Card>
      )}

      {selectedData.length > 0 && (
        <>
          {/* Metric Selector */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-normal">Projection Chart</h3>
              <p className="text-sm text-muted-foreground">
                Compare scenarios across different metrics
              </p>
            </div>
            <Select value={metric} onValueChange={(v: any) => setMetric(v)}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gdp">
                  💰 GDP (Total Economy)
                </SelectItem>
                <SelectItem value="gdpPerCapita">
                  👥 GDP Per Capita
                </SelectItem>
                <SelectItem value="unemployment">
                  💼 Unemployment Rate
                </SelectItem>
                <SelectItem value="debtToGDP">
                  📊 Debt-to-GDP Ratio
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{metricLabels[metric].label} - Projections to 2055</CardTitle>
              <CardDescription>
                {selectedData.map((s, i) => (
                  <span key={s.id}>
                    <span style={{ color: s.color }}>●</span> {s.name}
                    {i < selectedData.length - 1 ? " • " : ""}
                  </span>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis
                      tickFormatter={(value) => metricLabels[metric].format(value)}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload) return null;
                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-lg">
                            <div className="font-normal text-sm text-muted-foreground mb-2">
                              Year {payload[0]?.payload.year}
                            </div>
                            {payload.map((entry: any) => {
                              const scenario = forecastScenarios.find(s => s.id === entry.dataKey);
                              return (
                                <div key={entry.dataKey} className="flex items-center gap-2 text-sm mb-1">
                                  <div
                                    className="h-3 w-3 rounded"
                                    style={{ backgroundColor: scenario?.color }}
                                  />
                                  <span className="text-muted-foreground">{scenario?.name}:</span>
                                  <span className="font-normal ml-auto">{metricLabels[metric].format(entry.value)}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }}
                    />
                    {selectedData.map((scenario) => (
                      <Bar
                        key={scenario.id}
                        dataKey={scenario.id}
                        fill={scenario.color}
                        radius={[4, 4, 0, 0]}
                        name={scenario.name}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-normal">Scenario Assumptions</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {selectedData.map((scenario) => {
                const emoji = iconMap[scenario.icon] || "📈";
                const projection2055 = scenario.projections[scenario.projections.length - 1];

                return (
                  <Card key={scenario.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">
                          {emoji}
                        </div>
                        <CardTitle className="font-normal">{scenario.name}</CardTitle>
                      </div>
                      <CardDescription>{scenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-normal mb-2">Key Assumptions:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {scenario.assumptions.map((assumption, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-xs mt-1">•</span>
                              <span>{assumption}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm font-normal mb-2">By 2055:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">GDP</p>
                            <p className="font-normal">${projection2055.gdp}B</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Per Capita</p>
                            <p className="font-normal">${projection2055.gdpPerCapita.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Unemployment</p>
                            <p className="font-normal">{projection2055.unemployment}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Debt/GDP</p>
                            <p className="font-normal">{projection2055.debtToGDP}%</p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm font-normal mb-2">
                          {scenario.category === "good" ? "What we need to do to achieve this:" : "What we need to do to prevent this:"}
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {scenario.actions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-xs mt-1">{scenario.category === "good" ? "✓" : "⚠️"}</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
