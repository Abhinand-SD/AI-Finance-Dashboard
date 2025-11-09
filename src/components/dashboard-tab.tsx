"use client";

import type { Expense } from "@/lib/types";
import { AIBudgetTool } from "./ai-budget-tool";
import { CategorySpendingChart } from "./category-spending-chart";
import { StatsCards } from "./stats-cards";
import { SpendingOverTimeChart } from "./spending-over-time-chart";

export default function DashboardTab({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <StatsCards expenses={expenses} />
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <CategorySpendingChart expenses={expenses} />
        <SpendingOverTimeChart expenses={expenses} />
      </div>
      <AIBudgetTool expenses={expenses} />
    </div>
  );
}
