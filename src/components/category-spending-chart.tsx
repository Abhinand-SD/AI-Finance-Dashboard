"use client";

import * as React from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import type { Expense, ExpenseCategory } from "@/lib/types";
import { expenseCategories } from "@/lib/types";

const categoryColors: Record<ExpenseCategory, string> = {
    Food: "var(--color-food)",
    Transport: "var(--color-transport)",
    Shopping: "var(--color-shopping)",
    Utilities: "var(--color-utilities)",
    Entertainment: "var(--color-entertainment)",
    Health: "var(--color-health)",
    Travel: "var(--color-travel)",
    Other: "var(--color-other)",
};

const chartConfig = {
  total: {
    label: "Total",
  },
  food: { label: "Food", color: "hsl(var(--chart-1))" },
  transport: { label: "Transport", color: "hsl(var(--chart-2))" },
  shopping: { label: "Shopping", color: "hsl(var(--chart-3))" },
  utilities: { label: "Utilities", color: "hsl(var(--chart-4))" },
  entertainment: { label: "Entertainment", color: "hsl(var(--chart-5))" },
  health: { label: "Health", color: "hsl(var(--chart-1))" },
  travel: { label: "Travel", color: "hsl(var(--chart-2))" },
  other: { label: "Other", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

export function CategorySpendingChart({ expenses }: { expenses: Expense[] }) {
    const data = React.useMemo(() => {
        const categoryTotals: { [key in ExpenseCategory]?: number } = {};
        for (const expense of expenses) {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        }
        return expenseCategories
            .map(category => ({
                category,
                total: categoryTotals[category] || 0,
                fill: categoryColors[category],
            }))
            .filter(item => item.total > 0)
            .sort((a,b) => b.total - a.total);
    }, [expenses]);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Breakdown of expenses across categories.</CardDescription>
            </CardHeader>
            <CardContent>
              {data.length > 0 ? (
                <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                    <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 10, top: 10, right: 10, bottom: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="total" layout="vertical" radius={5} />
                    </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
                  No spending data to display.
                </div>
              )}
            </CardContent>
        </Card>
    );
}
