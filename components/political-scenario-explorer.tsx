"use client";

import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const POLITICAL_SCENARIOS = {
  plpBlueprint: {
    title: "PLP Blueprint for Progress",
    color: "#dc2626", // Red
    gdpGrowth: 2.8,
    shortDescription: "Fiscal consolidation with quality healthcare and digital transformation",
    policies: [
      "Debt reduction from 1.3% deficit (2024) - continued fiscal consolidation",
      "Healthcare expansion with 24-hour mental health services",
      "Digital government integration (MyGateway platform)",
      "Education system transformation",
      "Island development focused on Family Islands",
      "Moody's positive sovereign outlook achievement",
    ],
    economicFocus: "Macroeconomic stability and quality of life improvements",
    strengths: [
      "Strongest debt sustainability path",
      "Improved sovereign rating = lower borrowing costs",
      "Sustainable long-term growth model",
      "Quality healthcare reduces population outmigration",
    ],
    risks: [
      "Slower near-term growth from fiscal restraint",
      "Dependent on continued commodity prices and tourism recovery",
    ],
  },
  fnmBetterBahamas: {
    title: "FNM Better Bahamas for All",
    color: "#059669", // Green
    gdpGrowth: 3.2,
    shortDescription: "Business-focused growth through tax cuts and entrepreneurship investment",
    policies: [
      "VAT and duty removal on healthy foods and essential medicines",
      "$100M entrepreneurship investment fund",
      "Tax cuts for ordinary people",
      "Healthcare expansion: 100 new doctors + 200 new nurses",
      "$200/month child support for first 2 years",
      "Crime reduction (10-Point Crime Plan)",
      "Freedom of Information Act implementation",
    ],
    economicFocus: "Rapid business expansion and private sector growth",
    strengths: [
      "Higher near-term GDP growth (3.2%)",
      "Direct business incentives attract entrepreneurs",
      "Improved living standards through immediate assistance",
      "Lower cost of living from VAT/duty reductions",
    ],
    risks: [
      "Higher debt accumulation from tax cuts",
      "Inflation risk from stimulus measures",
      "Sustainability questions on spending programs",
    ],
  },
  coalitionConsensus: {
    title: "Coalition Consensus",
    color: "#2563eb", // Blue
    gdpGrowth: 3.0,
    shortDescription: "Balanced approach combining fiscal responsibility with growth incentives",
    policies: [
      "Balanced fiscal approach (neither aggressive cuts nor large deficits)",
      "Healthcare improvements with measured expansion",
      "Business support with fiscal constraints",
      "Education and infrastructure investment",
      "Gradual debt reduction",
      "Climate resilience and digital transformation",
    ],
    economicFocus: "Sustainable growth with managed public investment",
    strengths: [
      "Lowest economic volatility",
      "Balanced debt trajectory",
      "Maintains investor confidence",
      "Combines growth with stability",
    ],
    risks: [
      "May lack boldness to address structural challenges",
      "Compromise could reduce effectiveness of individual policies",
    ],
  },
};

export function PoliticalScenarioExplorer() {
  const [selectedScenario, setSelectedScenario] = useState<"plpBlueprint" | "fnmBetterBahamas" | "coalitionConsensus">("plpBlueprint");
  const [comparisonMode, setComparisonMode] = useState(false);

  const scenario = POLITICAL_SCENARIOS[selectedScenario];

  const comparisonData = [
    {
      metric: "GDP Growth",
      "PLP Blueprint": 2.8,
      "FNM Better": 3.2,
      "Coalition": 3.0,
    },
    {
      metric: "Debt Reduction",
      "PLP Blueprint": 1.5,
      "FNM Better": 0.5,
      "Coalition": 1.0,
    },
    {
      metric: "Education Spend",
      "PLP Blueprint": 4.5,
      "FNM Better": 5.0,
      "Coalition": 4.5,
    },
    {
      metric: "Infrastructure",
      "PLP Blueprint": 3.5,
      "FNM Better": 4.0,
      "Coalition": 3.5,
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold mb-2">Political Scenario Explorer</h2>
        <p className="text-gray-600">
          Compare economic projections based on PLP and FNM 2026 campaign platforms
        </p>
      </div>

      {/* Scenario Selection Tabs */}
      <div className="flex gap-4 border-b">
        {Object.entries(POLITICAL_SCENARIOS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedScenario(key as any);
              setComparisonMode(false);
            }}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              selectedScenario === key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {val.title}
          </button>
        ))}
      </div>

      {!comparisonMode ? (
        <>
          {/* Scenario Details */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-lg p-6 shadow border-l-4" style={{ borderColor: scenario.color }}>
              <h3 className="text-2xl font-bold mb-2">{scenario.title}</h3>
              <p className="text-gray-600 mb-4">{scenario.shortDescription}</p>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-sm text-gray-600">Projected GDP Growth</p>
                  <p className="text-3xl font-bold" style={{ color: scenario.color }}>
                    {scenario.gdpGrowth}%
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">Economic Focus</p>
                  <p className="text-gray-600">{scenario.economicFocus}</p>
                </div>
              </div>
            </div>

            {/* Policies Section */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="text-lg font-semibold mb-4">Key Policies & Commitments</h4>
              <ul className="space-y-2">
                {scenario.policies.map((policy, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">{policy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Two Column: Strengths & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-green-900 mb-4">✓ Strengths</h4>
                <ul className="space-y-2">
                  {scenario.strengths.map((strength, idx) => (
                    <li key={idx} className="text-green-800 flex gap-2">
                      <span className="font-bold">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                <h4 className="text-lg font-semibold text-amber-900 mb-4">⚠ Risks & Challenges</h4>
                <ul className="space-y-2">
                  {scenario.risks.map((risk, idx) => (
                    <li key={idx} className="text-amber-800 flex gap-2">
                      <span className="font-bold">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Comparison Button */}
            <button
              onClick={() => setComparisonMode(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Compare All Scenarios
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Comparison View */}
          <div className="space-y-6">
            <button
              onClick={() => setComparisonMode(false)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Details
            </button>

            {/* Comparison Chart */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold mb-4">Policy Intensity Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="PLP Blueprint" fill="#dc2626" />
                  <Bar dataKey="FNM Better" fill="#059669" />
                  <Bar dataKey="Coalition" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Side by Side Comparison Table */}
            <div className="bg-white rounded-lg p-6 shadow overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Detailed Comparison</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Aspect</th>
                    <th className="text-left py-2 px-4 font-semibold text-red-700">PLP Blueprint</th>
                    <th className="text-left py-2 px-4 font-semibold text-green-700">FNM Better Bahamas</th>
                    <th className="text-left py-2 px-4 font-semibold text-blue-700">Coalition</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">GDP Growth Target</td>
                    <td className="py-3 px-4">2.8%</td>
                    <td className="py-3 px-4">3.2%</td>
                    <td className="py-3 px-4">3.0%</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Fiscal Approach</td>
                    <td className="py-3 px-4">Consolidation</td>
                    <td className="py-3 px-4">Stimulus</td>
                    <td className="py-3 px-4">Balanced</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Debt Focus</td>
                    <td className="py-3 px-4">Rapid reduction</td>
                    <td className="py-3 px-4">Slower reduction</td>
                    <td className="py-3 px-4">Steady reduction</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Tax Policy</td>
                    <td className="py-3 px-4">Current structure</td>
                    <td className="py-3 px-4">VAT/duty reduction</td>
                    <td className="py-3 px-4">Moderate adjustments</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Business Investment</td>
                    <td className="py-3 px-4">Infrastructure focus</td>
                    <td className="py-3 px-4">$100M entrepreneur fund</td>
                    <td className="py-3 px-4">Mixed approach</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Info Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <p className="font-semibold mb-1">📊 Data Source</p>
        <p>Scenarios are based on official 2026 campaign platforms from PLP (Blueprint for Progress) and FNM (Better Bahamas for All).</p>
      </div>
    </div>
  );
}
