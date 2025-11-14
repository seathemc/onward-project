"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { BudgetCategory } from "@/types/bahamas-data";
import { Info, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface MinistryDetailDialogProps {
  ministry: BudgetCategory;
  children?: React.ReactNode;
}

export function MinistryDetailDialog({ ministry, children }: MinistryDetailDialogProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BS", {
      style: "currency",
      currency: "BSD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1000000);
  };

  const getStatusColor = () => {
    switch (ministry.status) {
      case "on-track":
        return "text-green-600";
      case "over-budget":
        return "text-red-600";
      case "under-utilized":
        return "text-orange-600";
    }
  };

  const getRecommendation = () => {
    if (ministry.status === "over-budget") {
      return "Immediate action required. Review spending and implement cost controls.";
    } else if (ministry.status === "under-utilized") {
      return "Consider reallocating unused funds or accelerating planned initiatives.";
    }
    return "Ministry spending is aligned with budget targets. Continue monitoring.";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Info className="mr-2 h-4 w-4" />
            Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{ministry.ministry}</DialogTitle>
          <DialogDescription>{ministry.category}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Budget Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4 bg-blue-50">
              <p className="text-sm font-medium text-muted-foreground">Allocated</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(ministry.allocated)}
              </p>
            </div>
            <div className="rounded-lg border p-4 bg-green-50">
              <p className="text-sm font-medium text-muted-foreground">Spent</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(ministry.spent)}
              </p>
            </div>
            <div className={`rounded-lg border p-4 ${
              ministry.remaining < 0 ? "bg-red-50" : "bg-gray-50"
            }`}>
              <p className="text-sm font-medium text-muted-foreground">Remaining</p>
              <p className={`text-2xl font-bold ${
                ministry.remaining < 0 ? "text-red-600" : "text-gray-700"
              }`}>
                {formatCurrency(ministry.remaining)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Budget Utilization</span>
              <HoverCard>
                <HoverCardTrigger>
                  <Badge className={getStatusColor()}>
                    {ministry.percentageUsed.toFixed(1)}%
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p className="text-sm">
                    This ministry has used {ministry.percentageUsed.toFixed(1)}% of its allocated budget.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Progress value={ministry.percentageUsed} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <Separator />

          {/* Status Analysis */}
          <div className="rounded-lg border p-4 bg-muted/30">
            <div className="flex items-start gap-3">
              {ministry.status === "on-track" ? (
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              ) : ministry.status === "over-budget" ? (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              ) : (
                <TrendingDown className="h-5 w-5 text-orange-600 mt-0.5" />
              )}
              <div>
                <p className="font-semibold mb-1">
                  Status: <span className={getStatusColor()}>
                    {ministry.status === "on-track" ? "On Track" :
                     ministry.status === "over-budget" ? "Over Budget" :
                     "Under-Utilized"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {getRecommendation()}
                </p>
              </div>
            </div>
          </div>

          {/* Quarterly Breakdown */}
          <div>
            <h4 className="font-semibold mb-3">Projected Quarterly Spending</h4>
            <div className="grid gap-2">
              {["Q1", "Q2", "Q3", "Q4"].map((quarter, index) => {
                const projected = (ministry.allocated / 4) * (index + 1);
                const actual = index < 2 ? (ministry.spent / 2) * (index + 1) :
                               index === 2 ? ministry.spent : 0;
                const percentage = (actual / projected) * 100;

                return (
                  <div key={quarter} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{quarter}</span>
                    <div className="flex-1">
                      <Progress value={percentage} className="h-2" />
                    </div>
                    <span className="text-sm text-muted-foreground w-24 text-right">
                      {actual > 0 ? formatCurrency(actual / 1000) : "Projected"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
