"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar";
import { WelcomeDialog } from "@/components/welcome-dialog";

/**
 * Home Page - Landing page for Forward
 *
 * Introduces the Forward platform and explains:
 * - What Forward is (collaborative planning tool)
 * - How it works (3-step process)
 * - Why planning together matters (for all Bahamians)
 */
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is first visit
    const hasVisited = localStorage.getItem("onward-visited");

    if (hasVisited) {
      // If returning visitor, no loading
      setIsLoading(false);
    } else {
      // If first-time visitor, show loading after dialog closes
      const checkInterval = setInterval(() => {
        if (localStorage.getItem("onward-visited")) {
          setIsLoading(false);
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <WelcomeDialog />
      <Navbar />

      {/* Main content area with left margin for sidebar on desktop, bottom padding for mobile nav */}
      <div className="md:ml-64">
        <div className="container mx-auto px-4 pt-20 pb-24 md:pt-32 md:pb-24 lg:pt-48 lg:pb-32 mb-16 md:mb-0">

          {isLoading ? (
            /* Skeleton Loader */
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <div className="space-y-8">
                <Skeleton className="h-20 w-full mx-auto" />
                <Skeleton className="h-16 w-3/4 mx-auto" />
              </div>
              <div className="flex gap-4 justify-center">
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
          ) : (
            <>
              {/* Hero Section */}
              <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight text-foreground leading-tight">
                Plan the Bahamas' future with real data
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-tertiary-foreground font-normal leading-relaxed max-w-3xl mx-auto">
                See where we are. Explore where we could go. Understand what it takes to get there.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 px-8 h-12 text-base">
                  Explore Scenarios
                </Button>
              </Link>
              <Link href="/current">
                <Button size="lg" variant="outline" className="gap-2 px-8 h-12 text-base">
                  See Where We Are
                </Button>
              </Link>
            </div>
          </div>

          <Separator className="my-20 lg:my-32" />

          {/* What Onward Does Section */}
          <div className="max-w-4xl mx-auto text-center space-y-12 mb-24">
            <div>
              <h2 className="text-3xl font-normal mb-4">What Onward does</h2>
              <p className="text-base text-muted-foreground font-normal">
                A tool for exploring different paths for the Bahamas over the next 30 years.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 text-left">
              <Card>
                <CardHeader>
                  <div className="text-3xl mb-2">🔮</div>
                  <CardTitle className="font-normal">Explore possibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    7 futures—from digital transformation to education investment. See what's possible with different choices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="text-3xl mb-2">🎯</div>
                  <CardTitle className="font-normal">Data-driven insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Real projections based on government data and economic research. No guesswork.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="text-3xl mb-2">🤝</div>
                  <CardTitle className="font-normal">Find solutions together</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Compare paths. Understand trade-offs. See the actions we need to take.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-20 lg:my-32" />

          {/* How It Works Section */}
          <div className="max-w-4xl mx-auto text-center space-y-12 mb-24">
            <div>
              <h2 className="text-3xl font-normal mb-4">How to use this</h2>
              <p className="text-base text-muted-foreground font-normal">
                Three steps to exploring the Bahamas' future
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 text-left">
              <Card>
                <CardHeader>
                  <div className="text-3xl mb-2">1️⃣</div>
                  <CardTitle className="font-normal">See where we are</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Real data on our economy, jobs, and budget. This is our starting point.
                  </p>
                  <Link href="/current">
                    <Button variant="outline" size="sm" className="w-full">
                      📊 Current economy
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="text-3xl mb-2">2️⃣</div>
                  <CardTitle className="font-normal">Compare 7 futures</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    From prosperity to challenges. See what drives each outcome through 2055.
                  </p>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="w-full">
                      🔮 Explore scenarios
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="text-3xl mb-2">3️⃣</div>
                  <CardTitle className="font-normal">Understand what works</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    See the specific actions that lead to each outcome. Compare trade-offs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-20 lg:my-32" />

          {/* Why It Matters Section */}
          <div className="max-w-4xl mx-auto space-y-12 mb-24">
            <div className="text-center">
              <h2 className="text-3xl font-normal mb-4">Why this matters</h2>
              <p className="text-base text-muted-foreground font-normal">
                The choices we make today shape the Bahamas for decades. See the data. Understand the trade-offs. Plan wisely.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-normal">
                    👶 For Our Children's Future
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Today's babies will be 30 years old in 2055.</p>
                  <p>
                    What kind of Bahamas will they inherit? Will they have opportunities here, or will they need to leave? Will our islands be resilient?
                  </p>
                  <p>Let's plan the future they deserve.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-normal">
                    🏛️ For Leaders & Policymakers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    See the long-term impact of today's choices—education investment, digital transformation, climate adaptation.
                  </p>
                  <p>Every path has trade-offs. The data shows what works.</p>
                  <p>Let's make informed decisions together.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-normal">
                    🗳️ For Every Bahamian
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>This is about our shared home—jobs, wages, quality of life for everyone.</p>
                  <p>
                    Should we diversify beyond tourism? Invest in education? Prepare for climate change?
                  </p>
                  <p>We all have a voice in shaping our future.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-normal">
                    💼 For Those Who Can Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Investors, developers, and partners—see where the Bahamas is heading and how you can contribute positively.
                  </p>
                  <p>From green infrastructure to tech hubs, understand the opportunities.</p>
                  <p>Let's build something meaningful together.</p>
                </CardContent>
              </Card>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
