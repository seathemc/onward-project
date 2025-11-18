"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, X } from "lucide-react";

/**
 * WelcomeDialog Component
 *
 * First-time visitor onboarding experience with:
 * - Clear, punchy introduction to Onward
 * - Confetti celebration on continue
 * - localStorage to show only once
 * - Skippable option
 */
export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem("onward-visited");

    if (!hasVisited) {
      // Small delay to let the page load smoothly
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    }
  }, []);

  const handleContinue = () => {
    // Trigger confetti celebration
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50;

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
      });
    }, 250);

    // Show loading state
    setIsLoading(true);

    // Mark as visited and close dialog
    setTimeout(() => {
      localStorage.setItem("onward-visited", "true");
      setIsOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleSkip = () => {
    localStorage.setItem("onward-visited", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal text-center mb-2">
            Welcome to Onward 🇧🇸
          </DialogTitle>
          <DialogDescription className="text-base text-center space-y-4 pt-4">
            <p className="text-foreground font-normal">
              This tool shows 7 possible futures for the Bahamas through 2055.
            </p>

            <div className="space-y-3 text-left text-sm text-muted-foreground pt-2">
              <p className="text-foreground font-normal text-center mb-3">What you'll see:</p>

              <div className="flex gap-3">
                <span className="text-lg">📊</span>
                <div>
                  <p className="font-normal text-foreground">Where we are today</p>
                  <p className="text-xs">Real data showing our current economy</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-lg">🔮</span>
                <div>
                  <p className="font-normal text-foreground">7 paths we could take (2025-2055)</p>
                  <p className="text-xs">Education investment, digital transformation, climate preparation</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-lg">🤝</span>
                <div>
                  <p className="font-normal text-foreground">What actions lead to what outcomes</p>
                  <p className="text-xs">See the specific steps needed for each future</p>
                </div>
              </div>
            </div>

            <p className="text-tertiary-foreground text-sm pt-4">
              Simple. Data-driven. Your future.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <Rocket className="h-5 w-5" />
                Let's go
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSkip}
            className="text-xs text-muted-foreground gap-2"
            disabled={isLoading}
          >
            <X className="h-3 w-3" />
            Skip intro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
