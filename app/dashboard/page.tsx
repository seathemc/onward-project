"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { EconomicForecast } from "@/components/economic-forecast";

/**
 * Dashboard Page - Future Forecast
 *
 * Displays 7 economic scenarios for the Bahamas (2025-2055):
 * - Good scenarios: Education First, Digital Asset Economy, Financial Sector Boom
 * - Bad scenarios: Chronic Unemployment, Hurricane Disasters, Tourism Collapse, Debt Crisis
 *
 * Users can:
 * - Select multiple scenarios to compare
 * - View projections across different metrics (GDP, unemployment, debt, etc.)
 * - See assumptions and action items for each scenario
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Main content area with left margin for sidebar on desktop, bottom padding for mobile nav */}
      <div className="md:ml-64">
        <div className="container mx-auto px-4 pt-20 pb-24 md:pt-32 md:pb-24 lg:pt-48 lg:pb-32 mb-16 md:mb-0">

          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center space-y-12 mb-20">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight text-foreground leading-tight">
                7 scenarios. 30 years. Your choice.
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-tertiary-foreground font-normal leading-relaxed max-w-3xl mx-auto">
                Select scenarios to compare their outcomes through 2055. See what drives each future. Understand the trade-offs.
              </p>
            </div>
          </div>

          {/* Economic Forecast Component - Interactive scenario comparison */}
          <div id="forecast" className="scroll-mt-8">
            <EconomicForecast />
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6 py-12">
            <p className="text-base text-muted-foreground font-normal">
              Want to see where we are today?
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/current">
                <Button size="lg" className="gap-2">
                  📊 See where we are
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  ← Back to home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
