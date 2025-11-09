"use client";

import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, subDays, eachDayOfInterval } from 'date-fns';
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
import type { Expense } from "@/lib/types";

const chartConfig = {
    total: { label: "Total Spend", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
});

export function SpendingOverTimeChart({ expenses }: { expenses: Expense[] }) {
    const data = React.useMemo(() => {
        const thirtyDaysAgo = subDays(new Date(), 29);
        const today = new Date();
        const interval = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
        
        const dailyTotals: { [date: string]: number } = {};
        interval.forEach(day => {
            dailyTotals[format(day, 'yyyy-MM-dd')] = 0;
        });

        expenses.forEach(expense => {
            const dateStr = format(expense.date, 'yyyy-MM-dd');
            if (dailyTotals[dateStr] !== undefined) {
                dailyTotals[dateStr] += expense.amount;
            }
        });

        return Object.entries(dailyTotals).map(([date, total]) => ({ date: format(new Date(date), 'MMM d'), total })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [expenses]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Spending Over Time</CardTitle>
                <CardDescription>Total spending over the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                    <LineChart accessibilityLayer data={data} margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => currencyFormatter.format(value).replace(/₹/g, '₹')} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                        <ChartTooltip 
                            cursor={false} 
                            content={<ChartTooltipContent 
                                hideLabel 
                                formatter={(value) => currencyFormatter.format(value as number)}
                            />} 
                        />
                        <Line dataKey="total" type="monotone" stroke="var(--color-total)" strokeWidth={2} dot={true} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
