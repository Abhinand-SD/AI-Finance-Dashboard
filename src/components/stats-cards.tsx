"use client";

import { useMemo } from 'react';
import type { Expense } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export function StatsCards({ expenses }: { expenses: Expense[] }) {
  const { totalSpendCurrentMonth, transactionsCurrentMonth } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const total = currentMonthExpenses.reduce((acc, e) => acc + e.amount, 0);
    const count = currentMonthExpenses.length;
    
    return {
      totalSpendCurrentMonth: total,
      transactionsCurrentMonth: count,
    };
  }, [expenses]);

  return (
    <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
      <Card>
          <CardHeader className='pb-2'>
              <CardDescription>Total Spend (This Month)</CardDescription>
              <CardTitle className="text-3xl md:text-4xl">{currencyFormatter.format(totalSpendCurrentMonth)}</CardTitle>
          </CardHeader>
      </Card>
      <Card>
          <CardHeader className='pb-2'>
              <CardDescription>Total Transactions (This Month)</CardDescription>
              <CardTitle className="text-3xl md:text-4xl">{transactionsCurrentMonth}</CardTitle>
          </CardHeader>
      </Card>
    </div>
  );
}
