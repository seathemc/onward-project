"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { AnimatedCounter } from "@/components/animated-counter";
import { GDPTrendsChart } from "@/components/gdp-trends-chart";
import { SectorBreakdownChart } from "@/components/sector-breakdown-chart";
import { BudgetTable } from "@/components/budget-table";
import { BudgetAccordion } from "@/components/budget-accordion";
import { YearComparisonTable } from "@/components/year-comparison";
import { gdpData, budgetCategories, yearComparisons } from "@/lib/mock-data";

/**
 * Current Economy Page - 2024 Economic Dashboard
 *
 * Displays real economic data for the Bahamas including:
 * - Key metrics: GDP, GDP per capita, growth rate, population
 * - GDP trends and sector breakdown charts
 * - Government budget allocations by ministry
 * - Year-over-year comparisons
 *
 * Data sources: Ministry of Finance, Bahamas National Statistical Institute
 */
export default function CurrentEconomyPage() {
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
                Where we are today
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-tertiary-foreground font-normal leading-relaxed max-w-3xl mx-auto">
                Real data from government sources. This is our starting point. Understanding where we are helps us plan where we go.
              </p>
            </div>
          </div>

          <div className="space-y-12">

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">💰</div>
                <CardTitle className="text-2xl font-normal">
                  <AnimatedCounter value={15.8} prefix="$" suffix="B" decimals={1} />
                </CardTitle>
                <CardDescription>GDP (2024)</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">👥</div>
                <CardTitle className="text-2xl font-normal">
                  <AnimatedCounter value={38900} prefix="$" decimals={0} />
                </CardTitle>
                <CardDescription>GDP Per Capita</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">📈</div>
                <CardTitle className="text-2xl font-normal">
                  <AnimatedCounter value={3.4} suffix="%" decimals={1} />
                </CardTitle>
                <CardDescription>GDP Growth</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">🏝️</div>
                <CardTitle className="text-2xl font-normal">
                  <AnimatedCounter value={410} suffix="K" decimals={0} />
                </CardTitle>
                <CardDescription>Population</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="gdp">GDP Analysis</TabsTrigger>
              <TabsTrigger value="budget">Budget Details</TabsTrigger>
              <TabsTrigger value="comparison">Year Comparison</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal">GDP Trends</CardTitle>
                    <CardDescription>
                      Quarterly GDP growth over the past year
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GDPTrendsChart data={gdpData} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal">Sector Breakdown</CardTitle>
                    <CardDescription>
                      Economic contribution by sector
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SectorBreakdownChart data={gdpData} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="font-normal">Ministry Budget Allocations</CardTitle>
                  <CardDescription>
                    2024/25 Fiscal Year Budget by Ministry
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetAccordion data={budgetCategories} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* GDP Analysis Tab */}
            <TabsContent value="gdp" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal">GDP Growth Trends</CardTitle>
                  <CardDescription>
                    Quarterly GDP performance and growth rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GDPTrendsChart data={gdpData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-normal">Economic Sectors</CardTitle>
                  <CardDescription>
                    Contribution to GDP by major sectors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SectorBreakdownChart data={gdpData} />
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="text-2xl mb-1">🏖️</div>
                    <CardTitle className="font-normal">Tourism</CardTitle>
                    <CardDescription>47% of GDP</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>7.2M visitors annually</p>
                    <p>Primary economic driver</p>
                    <p>Post-pandemic recovery</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="text-2xl mb-1">🏦</div>
                    <CardTitle className="font-normal">Financial Services</CardTitle>
                    <CardDescription>27% of GDP</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>International banking</p>
                    <p>$19.5B in assets</p>
                    <p>Key diversification</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="text-2xl mb-1">🏗️</div>
                    <CardTitle className="font-normal">Other Sectors</CardTitle>
                    <CardDescription>26% of GDP</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Construction & agriculture</p>
                    <p>Retail and services</p>
                    <p>Emerging tech</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Budget Details Tab */}
            <TabsContent value="budget" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal">Ministry Budget Allocations</CardTitle>
                  <CardDescription>
                    Detailed breakdown by ministry
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetAccordion data={budgetCategories} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-normal">Complete Budget Table</CardTitle>
                  <CardDescription>
                    All ministry budgets with utilization rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetTable data={budgetCategories} />
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal">📊 Revenue</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Revenue</span>
                      <span className="font-normal">$3.54B</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax Revenue</span>
                      <span>$3.02B</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Other Revenue</span>
                      <span>$0.52B</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal">💳 Expenditure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Expenditure</span>
                      <span className="font-normal">$3.61B</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Recurrent</span>
                      <span>$3.10B</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Capital</span>
                      <span>$0.51B</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Year Comparison Tab */}
            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal">Year-over-Year Comparison</CardTitle>
                  <CardDescription>
                    Key economic metrics comparing 2023 and 2024
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <YearComparisonTable data={yearComparisons} fromYear={2023} toYear={2024} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <div className="text-center space-y-6 py-8">
            <p className="text-base text-muted-foreground font-normal">
              Ready to explore the future?
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  🔮 Explore scenarios
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
    </div>
  );
}
