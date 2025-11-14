"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BudgetCategory } from "@/types/bahamas-data";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface BudgetTableProps {
  data: BudgetCategory[];
}

export function BudgetTable({ data }: BudgetTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BS", {
      style: "currency",
      currency: "BSD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1000000);
  };

  const getStatusBadge = (status: BudgetCategory["status"]) => {
    switch (status) {
      case "on-track":
        return (
          <Badge variant="default" className="bg-green-500">
            <Minus className="mr-1 h-3 w-3" />
            On Track
          </Badge>
        );
      case "over-budget":
        return (
          <Badge variant="destructive">
            <ArrowUp className="mr-1 h-3 w-3" />
            Over Budget
          </Badge>
        );
      case "under-utilized":
        return (
          <Badge variant="secondary">
            <ArrowDown className="mr-1 h-3 w-3" />
            Under-Utilized
          </Badge>
        );
    }
  };

  const totalAllocated = data.reduce((sum, item) => sum + item.allocated, 0);
  const totalSpent = data.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = data.reduce((sum, item) => sum + item.remaining, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Breakdown by Ministry</CardTitle>
        <CardDescription>
          Current fiscal year expenditure tracking (millions BSD)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ministry</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Allocated</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead className="text-right">% Used</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.ministry}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.allocated)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.spent)}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      item.remaining < 0 ? "text-red-600 font-bold" : ""
                    }`}
                  >
                    {formatCurrency(item.remaining)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.percentageUsed.toFixed(1)}%
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalAllocated)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalSpent)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalRemaining)}
                </TableCell>
                <TableCell className="text-right">
                  {((totalSpent / totalAllocated) * 100).toFixed(1)}%
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
