import { NextRequest, NextResponse } from "next/server";
import {
  EconomicForecastModel,
  ForecastAssumptions,
  ForecastScenario,
} from "@/lib/forecast/model";

export const dynamic = "force-dynamic";

const model = new EconomicForecastModel();

interface ComparisonRequest {
  scenarios: Array<{
    id?: string;
    assumptions?: Partial<ForecastAssumptions>;
  }>;
  metrics?: string[]; // e.g., ['gdp', 'debt', 'tourism']
  year?: number; // optional: compare at specific year
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ComparisonRequest;

    if (!body.scenarios || body.scenarios.length === 0) {
      return NextResponse.json(
        { error: "At least one scenario is required" },
        { status: 400 }
      );
    }

    if (body.scenarios.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 scenarios can be compared" },
        { status: 400 }
      );
    }

    const forecasts: ForecastScenario[] = [];

    for (const scenario of body.scenarios) {
      let forecast: ForecastScenario;

      if (scenario.id) {
        // Use built-in scenario
        if (
          !["conservative", "moderate", "optimistic"].includes(scenario.id)
        ) {
          return NextResponse.json(
            { error: `Unknown scenario: ${scenario.id}` },
            { status: 400 }
          );
        }
        const assumptions =
          EconomicForecastModel.SCENARIOS[
            scenario.id as keyof typeof EconomicForecastModel.SCENARIOS
          ]();
        forecast = model.generateForecast(assumptions);
      } else if (scenario.assumptions) {
        // Use custom assumptions
        forecast = model.generateForecast(scenario.assumptions);
      } else {
        return NextResponse.json(
          { error: "Each scenario must have either id or assumptions" },
          { status: 400 }
        );
      }

      forecasts.push(forecast);
    }

    // Generate comparison data
    const comparison = generateComparison(
      forecasts,
      body.metrics,
      body.year
    );

    return NextResponse.json({
      scenarios: forecasts.map((f) => ({
        id: f.id,
        name: f.assumptions.baseName,
        assumptions: f.assumptions,
      })),
      comparison,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate comparison", details: message },
      { status: 500 }
    );
  }
}

function generateComparison(
  scenarios: ForecastScenario[],
  requestedMetrics?: string[],
  compareYear?: number
) {
  const targetYear = compareYear || 2064; // 40 years out
  const metrics = requestedMetrics || ["gdp", "debt", "tourism", "unemployment"];

  const scenarioData = scenarios.map((scenario) => {
    const projection = scenario.projections.find((p) => p.year === targetYear) ||
      scenario.projections[scenario.projections.length - 1];

    const data: Record<string, number | number[] | object | string> = {
      scenarioId: scenario.id,
      year: projection.year,
    };

    for (const metric of metrics) {
      switch (metric) {
        case "gdp":
          data.gdp = projection.gdpNominal;
          data.gdpGrowthRate = projection.gdpGrowthRate;
          break;
        case "debt":
          data.debtToGDPRatio = projection.debtToGDPRatio;
          data.debt = projection.debt;
          break;
        case "tourism":
          data.tourismGDP = projection.sectors.tourism;
          break;
        case "unemployment":
          data.unemploymentRate = projection.unemploymentRate;
          break;
        case "perCapita":
          data.gdpPerCapita = projection.gdpPerCapita;
          break;
        case "sectors":
          data.sectors = projection.sectors;
          break;
        case "spending":
          data.spending = projection.spending;
          break;
      }
    }

    return data;
  });

  // Calculate deltas from base scenario
  const baseScenario = scenarioData[0];
  const deltas = scenarioData.map((scenario, idx) => {
    if (idx === 0) return scenario;

    const delta: Record<string, number | string | object> = {
      scenarioId: scenario.scenarioId,
    };

    // Numeric fields - calculate percentage difference
    for (const [key, value] of Object.entries(scenario)) {
      if (key === "scenarioId" || key === "year") continue;
      if (typeof value === "number" && typeof baseScenario[key] === "number") {
        const baseValue = baseScenario[key] as number;
        delta[`${key}Delta`] = Number(
          (((value - baseValue) / baseValue) * 100).toFixed(2)
        );
      }
    }

    return delta;
  });

  return {
    compareYear: targetYear,
    metrics,
    scenarios: scenarioData,
    deltasFromBase: deltas,
  };
}
