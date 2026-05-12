import { NextRequest, NextResponse } from "next/server";
import {
  EconomicForecastModel,
  ForecastAssumptions,
} from "@/lib/forecast/model";
import { POLITICAL_SCENARIOS, SCENARIO_DETAILS } from "@/lib/forecast/political-scenarios";

export const dynamic = "force-dynamic";

const model = new EconomicForecastModel();

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");

  if (type === "list") {
    return NextResponse.json({
      scenarios: [
        // Economic scenarios
        {
          id: "conservative",
          category: "economic",
          name: "Conservative Growth",
          description:
            "Modest 2% GDP growth, focused on debt reduction and fiscal stability",
        },
        {
          id: "moderate",
          category: "economic",
          name: "Moderate Growth",
          description:
            "Balanced 3% GDP growth with tourism recovery and tech sector expansion",
        },
        {
          id: "optimistic",
          category: "economic",
          name: "Optimistic Growth",
          description:
            "Strong 3.5% GDP growth with tourism boom and significant infrastructure investment",
        },
        // Political scenarios
        {
          id: "plpBlueprint",
          category: "political",
          name: "PLP Blueprint for Progress",
          description: SCENARIO_DETAILS.plpBlueprint.shortDescription,
        },
        {
          id: "fnmBetterBahamas",
          category: "political",
          name: "FNM Better Bahamas for All",
          description: SCENARIO_DETAILS.fnmBetterBahamas.shortDescription,
        },
        {
          id: "coalitionConsensus",
          category: "political",
          name: "Coalition Consensus",
          description: SCENARIO_DETAILS.coalitionConsensus.shortDescription,
        },
      ],
    });
  }

  const allScenarios = {
    ...EconomicForecastModel.SCENARIOS,
    ...POLITICAL_SCENARIOS,
  };

  if (type && type in allScenarios) {
    const assumptions = allScenarios[type as keyof typeof allScenarios]();
    const forecast = model.generateForecast(assumptions);

    // Include scenario details for political scenarios
    const details = SCENARIO_DETAILS[type as keyof typeof SCENARIO_DETAILS];

    return NextResponse.json({
      ...forecast,
      details,
    });
  }

  if (type === "custom") {
    try {
      const body = await req.json();
      const forecast = model.generateForecast(body as Partial<ForecastAssumptions>);
      return NextResponse.json(forecast);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid assumptions provided" },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({
    error:
      "Invalid query. Use ?type=list, or ?type=<scenario>. Available scenarios: " +
      "conservative, moderate, optimistic, plpBlueprint, fnmBetterBahamas, coalitionConsensus. " +
      "POST a body of assumptions to generate a custom scenario.",
  }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const assumptions = (await req.json()) as Partial<ForecastAssumptions>;

    // Validate assumptions if provided
    if (assumptions.gdpGrowthRate !== undefined && assumptions.gdpGrowthRate < -5) {
      return NextResponse.json(
        { error: "GDP growth rate must be >= -5%" },
        { status: 400 }
      );
    }

    if (
      assumptions.debtToGDPRatio !== undefined &&
      (assumptions.debtToGDPRatio < 0 || assumptions.debtToGDPRatio > 150)
    ) {
      return NextResponse.json(
        { error: "Debt/GDP ratio must be between 0 and 150" },
        { status: 400 }
      );
    }

    const forecast = model.generateForecast(assumptions);

    return NextResponse.json(forecast);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate forecast" },
      { status: 500 }
    );
  }
}
