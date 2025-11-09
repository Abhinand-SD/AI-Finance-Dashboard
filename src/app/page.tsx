"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { initialExpenses } from "@/lib/data";
import type { Expense, ExpenseFormValues } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddExpenseForm } from "@/components/add-expense-form";
import ExpensesTab from "@/components/expenses-tab";
import DashboardTab from "@/components/dashboard-tab";

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addExpense = (data: ExpenseFormValues) => {
    const newExpense: Expense = {
      id: new Date().toISOString(),
      ...data,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setIsDialogOpen(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const clearAllExpenses = () => {
    setExpenses([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="font-headline text-2xl font-bold text-primary">
            ExpenseWise
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a new expense</DialogTitle>
              </DialogHeader>
              <AddExpenseForm onSubmit={addExpense} />
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6">
            <DashboardTab expenses={expenses} />
          </TabsContent>
          <TabsContent value="transactions" className="mt-6">
            <ExpensesTab
              expenses={expenses}
              onDeleteExpense={deleteExpense}
              onClearAllExpenses={clearAllExpenses}
            />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Built for smart budgeting.</p>
      </footer>
    </div>
  );
}
