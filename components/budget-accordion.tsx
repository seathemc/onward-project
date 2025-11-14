"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BudgetCategory } from "@/types/bahamas-data";
import { MinistryDetailDialog } from "./ministry-detail-dialog";
// Icons replaced with emojis

interface BudgetAccordionProps {
  data: BudgetCategory[];
}

export function BudgetAccordion({ data }: BudgetAccordionProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BS", {
      style: "currency",
      currency: "BSD",
      notation: "compact",
      compactDisplay: "short",
    }).format(amount * 1000000);
  };

  const getStatusIcon = (status: BudgetCategory["status"]) => {
    switch (status) {
      case "on-track":
        return <span className="text-lg">📈</span>;
      case "over-budget":
        return <span className="text-lg">⚠️</span>;
      case "under-utilized":
        return <span className="text-lg">📉</span>;
    }
  };

  const getStatusBadge = (status: BudgetCategory["status"]) => {
    const variants = {
      "on-track": "default",
      "over-budget": "destructive",
      "under-utilized": "secondary",
    } as const;

    const labels = {
      "on-track": "On Track",
      "over-budget": "Over Budget",
      "under-utilized": "Under-Utilized",
    };

    return (
      <Badge variant={variants[status]} className="ml-2">
        {labels[status]}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🏛️</span>
          Ministry Budget Breakdown
        </CardTitle>
        <CardDescription>
          Expandable view of all ministry allocations and spending
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {data.map((ministry) => (
            <AccordionItem key={ministry.id} value={ministry.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(ministry.status)}
                    <div className="text-left">
                      <p className="font-semibold">{ministry.ministry}</p>
                      <p className="text-sm text-muted-foreground">{ministry.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {formatCurrency(ministry.allocated)}
                    </span>
                    {getStatusBadge(ministry.status)}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4 pl-10 pr-4">
                  {/* Budget Overview Grid */}
                  <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-md border p-3 bg-blue-50/50">
                      <p className="text-xs text-muted-foreground mb-1">Allocated</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(ministry.allocated)}
                      </p>
                    </div>
                    <div className="rounded-md border p-3 bg-green-50/50">
                      <p className="text-xs text-muted-foreground mb-1">Spent</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(ministry.spent)}
                      </p>
                    </div>
                    <div className={`rounded-md border p-3 ${
                      ministry.remaining < 0 ? "bg-red-50/50" : "bg-gray-50/50"
                    }`}>
                      <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                      <p className={`text-lg font-bold ${
                        ministry.remaining < 0 ? "text-red-600" : "text-gray-700"
                      }`}>
                        {formatCurrency(ministry.remaining)}
                      </p>
                    </div>
                    <div className="rounded-md border p-3 bg-purple-50/50">
                      <p className="text-xs text-muted-foreground mb-1">Utilization</p>
                      <p className="text-lg font-bold text-purple-600">
                        {ministry.percentageUsed?.toFixed(1) || '0.0'}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget Progress</span>
                      <span className="font-medium">
                        {ministry.percentageUsed?.toFixed(1) || '0.0'}%
                      </span>
                    </div>
                    <Progress
                      value={ministry.percentageUsed || 0}
                      className="h-2"
                    />
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end pt-2">
                    <MinistryDetailDialog ministry={ministry} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
