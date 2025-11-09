"use client";

import * as React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Expense } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryIcon } from "@/components/category-icon";
import { Badge } from "@/components/ui/badge";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

type SortKey = keyof Expense;
type SortDirection = "asc" | "desc";

export default function ExpensesTab({ expenses }: { expenses: Expense[] }) {
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: SortDirection }>({
    key: "date",
    direction: "desc",
  });

  const sortedExpenses = React.useMemo(() => {
    let sortableItems = [...expenses];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [expenses, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = "asc";
    if (
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "asc" ? <ArrowUp className="ml-2 h-4 w-4 inline" /> : <ArrowDown className="ml-2 h-4 w-4 inline" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort("date")} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center">Date {getSortIcon("date")}</div>
                </TableHead>
                <TableHead onClick={() => requestSort("category")} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center">Category {getSortIcon("category")}</div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead onClick={() => requestSort("amount")} className="cursor-pointer hover:bg-muted/50 text-right">
                  <div className="flex items-center justify-end">Amount {getSortIcon("amount")}</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.length > 0 ? (
                sortedExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.date.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="items-center gap-2 whitespace-nowrap">
                        <CategoryIcon category={expense.category} className="h-4 w-4" />
                        <span>{expense.category}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell className="text-right font-mono">
                      {currencyFormatter.format(expense.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No expenses yet. Add one to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
