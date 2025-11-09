"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Trash2, ShieldAlert, MoreVertical } from "lucide-react";
import type { Expense } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CategoryIcon } from "@/components/category-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

type SortKey = keyof Expense;
type SortDirection = "asc" | "desc";

interface ExpensesTabProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onClearAllExpenses: () => void;
}

export default function ExpensesTab({ expenses, onDeleteExpense, onClearAllExpenses }: ExpensesTabProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
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
    if (sortConfig.key === key && sortConfig.direction === "asc") {
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

  const handleClearAll = () => {
    onClearAllExpenses();
    toast({
      title: "Success",
      description: "All transactions have been cleared.",
    });
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">All Transactions</h2>
            {expenses.length > 0 && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" /> Erase All
                    </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6 text-destructive" /> Are you sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                        This will permanently delete all transactions.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAll} className="bg-destructive hover:bg-destructive/90">
                        Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
        {sortedExpenses.length > 0 ? (
          <div className="space-y-3">
            {sortedExpenses.map((expense) => (
              <Card key={expense.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <CategoryIcon category={expense.category} className="h-8 w-8 text-muted-foreground" />
                    <div className="grid gap-0.5">
                      <p className="font-semibold">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">{expense.date.toLocaleDateString()}</p>
                      <Badge variant="secondary" className="w-fit mt-1">{expense.category}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-lg">{currencyFormatter.format(expense.amount)}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDeleteExpense(expense.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No expenses yet. Add one to get started!
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>View and manage all your recorded expenses.</CardDescription>
        </div>
        {expenses.length > 0 && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Erase All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-destructive" /> Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  of your transactions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} className="bg-destructive hover:bg-destructive/90">
                  Yes, delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort("date")} className="cursor-pointer hover:bg-muted/50 w-[120px]">
                  <div className="flex items-center">Date {getSortIcon("date")}</div>
                </TableHead>
                <TableHead onClick={() => requestSort("category")} className="cursor-pointer hover:bg-muted/50 w-[150px]">
                  <div className="flex items-center">Category {getSortIcon("category")}</div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead onClick={() => requestSort("amount")} className="cursor-pointer hover:bg-muted/50 text-right w-[150px]">
                  <div className="flex items-center justify-end">Amount {getSortIcon("amount")}</div>
                </TableHead>
                <TableHead className="w-[50px] text-right">Actions</TableHead>
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
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDeleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
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
