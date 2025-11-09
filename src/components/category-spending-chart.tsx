"use client";

import * as React from "react";
import { Pie, PieChart, Cell } from "recharts";
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
  type ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { Expense, ExpenseCategory } from "@/lib/types";
import { expenseCategories } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";

const categoryColors: Record<ExpenseCategory, string> = {
  Food: "hsl(var(--chart-1))",
  Transport: "hsl(var(--chart-2))",
  Shopping: "hsl(var(--chart-3))",
  Utilities: "hsl(var(--chart-4))",
  Entertainment: "hsl(var(--chart-5))",
  Health: "hsl(var(--chart-1))",
  Travel: "hsl(var(--chart-2))",
  Other: "hsl(var(--chart-3))",
};

const chartConfig = expenseCategories.reduce((acc, category) => {
  acc[category] = { label: category, color: categoryColors[category] };
  return acc;
}, {} as ChartConfig);

export function CategorySpendingChart({ expenses }: { expenses: Expense[] }) {
  const isMobile = useIsMobile();
  const data = React.useMemo(() => {
    const categoryTotals: { [key in ExpenseCategory]?: number } = {};
    for (const expense of expenses) {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    }
    return expenseCategories
      .map((category) => ({
        name: category,
        value: categoryTotals[category] || 0,
        fill: categoryColors[category],
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
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
            <PieChart accessibilityLayer>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 60 : 80}
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      className="text-xs font-bold"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent />}
                wrapperStyle={isMobile ? {fontSize: '0.8rem'} : {}}
              />
            </PieChart>
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
