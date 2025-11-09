import { z } from "zod";

export const expenseCategories = ['Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Health', 'Travel', 'Other'] as const;

export type ExpenseCategory = (typeof expenseCategories)[number];

export type Expense = {
  id: string;
  date: Date;
  category: ExpenseCategory;
  amount: number;
  description: string;
};

export const expenseSchema = z.object({
  description: z.string().min(3, { message: "Description must be at least 3 characters." }).max(100),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  category: z.enum(expenseCategories),
  date: z.date({
    required_error: "A date is required.",
  }),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
