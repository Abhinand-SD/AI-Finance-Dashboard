"use client";

import * as React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { Expense } from "@/lib/types";
import { getBudgetRecommendations, BudgetRecommendationsOutput } from "@/ai/flows/budget-recommendations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AIBudgetTool({ expenses }: { expenses: Expense[] }) {
    const [income, setIncome] = React.useState('');
    const [recommendations, setRecommendations] = React.useState<BudgetRecommendationsOutput | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    const handleGetRecommendations = async () => {
        if (!income || isNaN(Number(income)) || Number(income) <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Income', description: 'Please enter a valid monthly income.' });
            return;
        }
        setIsLoading(true);
        setRecommendations(null);

        try {
            const formattedExpenses = expenses.map(e => ({
                amount: e.amount,
                category: e.category,
                date: e.date.toISOString().split('T')[0] // YYYY-MM-DD
            }));
            
            const result = await getBudgetRecommendations({
                expenses: formattedExpenses,
                income: Number(income),
            });
            setRecommendations(result);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'AI Error', description: 'Could not generate recommendations at this time.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                    <Sparkles className="text-accent h-5 w-5 md:h-6 md:w-6" />
                    AI Budget Advisor
                </CardTitle>
                <CardDescription>Get personalized savings recommendations based on your spending patterns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        type="number"
                        placeholder="Enter your monthly income"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button onClick={handleGetRecommendations} disabled={isLoading || !income} className="bg-accent hover:bg-accent/90 text-accent-foreground sm:w-auto w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Get Advice
                    </Button>
                </div>
                {isLoading && (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                {recommendations && (
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-4 animate-in fade-in-50">
                        <div>
                            <h4 className="font-semibold text-foreground">Spending Summary</h4>
                            <p className="text-sm text-muted-foreground">{recommendations.summary}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">Recommendations</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {recommendations.recommendations.map((rec: string, i: number) => (
                                    <li key={i}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
