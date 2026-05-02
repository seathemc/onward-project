import { NextRequest, NextResponse } from "next/server";
import {
  EconomicForecastModel,
  ForecastAssumptions,
} from "@/lib/forecast/model";

export const dynamic = "force-dynamic";

const model = new EconomicForecastModel();

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");

  if (type === "list") {
    return NextResponse.json({
      scenarios: [
        {
          id: "conservative",
          name: "Conservative Growth",
          description:
            "Modest 2% GDP growth, focused on debt reduction and fiscal stability",
        },
        {
          id: "moderate",
          name: "Moderate Growth",
          description:
            "Balanced 3% GDP growth with tourism recovery and tech sector expansion",
        },
        {
          id: "optimistic",
          name: "Optimistic Growth",
          description:
            "Strong 3.5% GDP growth with tourism boom and significant infrastructure investment",
        },
      ],
    });
  }

  if (type && ["conservative", "moderate", "optimistic"].includes(type)) {
    const assumptions =
      EconomicForecastModel.SCENARIOS[
        type as keyof typeof EconomicForecastModel.SCENARIOS
      ]();
    const forecast = model.generateForecast(assumptions);

    return NextResponse.json(forecast);
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
      'Invalid query. Use ?type=conservative|moderate|optimistic|custom (POST for custom)',
  });
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
