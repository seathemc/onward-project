"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from "recharts";

interface Scenario {
  id: string;
  name: string;
  gdp: number;
  gdpGrowthRate: number;
  debtToGDPRatio: number;
  unemploymentRate: number;
  sectors: {
    tourism: number;
    financial: number;
    construction: number;
    agriculture: number;
    other: number;
  };
}

interface ComparisonData {
  scenarios: Scenario[];
  compareYear: number;
  deltasFromBase: Array<Record<string, number | string>>;
}

export function ScenarioExplorer() {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([
    "conservative",
    "moderate",
    "optimistic",
  ]);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timelineData, setTimelineData] = useState<any[] | null>(null);

  const scenarioOptions = [
    { id: "conservative", label: "Conservative (2% growth)" },
    { id: "moderate", label: "Moderate (3% growth)" },
    { id: "optimistic", label: "Optimistic (3.5% growth)" },
  ];

  useEffect(() => {
    fetchComparison();
  }, [selectedScenarios]);

  async function fetchComparison() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/scenarios/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarios: selectedScenarios.map((id) => ({ id })),
          metrics: ["gdp", "debt", "unemployment", "sectors"],
          year: 2064,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch scenarios");

      const data = await response.json();
      setComparisonData(data.comparison);

      // Fetch timeline data for first scenario
      if (selectedScenarios.length > 0) {
        const scenarioResponse = await fetch(
          `/api/scenarios?type=${selectedScenarios[0]}`
        );
        if (scenarioResponse.ok) {
          const scenarioData = await scenarioResponse.json();
          setTimelineData(scenarioData.projections);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading scenarios...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Economic Scenario Explorer</h2>
        <p className="text-gray-600 mb-6">
          Compare economic growth scenarios and their potential impact on the Bahamas economy
        </p>
      </div>

      {/* Scenario Selection */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Select Scenarios to Compare</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarioOptions.map((option) => (
            <label key={option.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedScenarios.includes(option.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedScenarios([...selectedScenarios, option.id]);
                  } else {
                    setSelectedScenarios(selectedScenarios.filter((id) => id !== option.id));
                  }
                }}
                className="w-4 h-4"
              />
              <span className="ml-3 font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonData && (
        <>
          {/* GDP Comparison */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">GDP at 2064</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData.scenarios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => `$${(Number(value) / 1000).toFixed(1)}B`} />
                <Bar dataKey="gdp" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Table */}
          <div className="bg-white rounded-lg p-6 shadow overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Projected Metrics (2064)</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Scenario</th>
                  <th className="text-right py-2 px-4">GDP ($M BSD)</th>
                  <th className="text-right py-2 px-4">Debt/GDP</th>
                  <th className="text-right py-2 px-4">Unemployment</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.scenarios.map((scenario, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">
                      {scenarioOptions.find((o) => selectedScenarios.includes(selectedScenarios[idx]))?.label ||
                        `Scenario ${idx + 1}`}
                    </td>
                    <td className="text-right py-2 px-4">${scenario.gdp.toLocaleString()}</td>
                    <td className="text-right py-2 px-4">{scenario.debtToGDPRatio.toFixed(2)}</td>
                    <td className="text-right py-2 px-4">{scenario.unemploymentRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Timeline Chart */}
          {timelineData && (
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold mb-4">
                40-Year GDP Projection ({selectedScenarios[0]})
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timelineData.filter((d, i) => i % 2 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `$${(Number(value) / 1000).toFixed(1)}B`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="gdpNominal"
                    stroke="#3b82f6"
                    name="GDP (Nominal BSD)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
