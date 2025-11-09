'use server';

/**
 * @fileOverview AI-powered budget recommendation flow.
 *
 * This file exports:
 * - `getBudgetRecommendations`: An asynchronous function that takes expense data and provides personalized savings recommendations.
 * - `BudgetRecommendationsInput`: The input type for the `getBudgetRecommendations` function, defining the structure of the expense data.
 * - `BudgetRecommendationsOutput`: The output type for the `getBudgetRecommendations` function, defining the structure of the savings recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetRecommendationsInputSchema = z.object({
  expenses: z.array(
    z.object({
      category: z.string().describe('The category of the expense (e.g., fuel, food, travel).'),
      amount: z.number().describe('The amount spent on the expense.'),
      date: z.string().describe('The date of the expense (YYYY-MM-DD).'),
    })
  ).describe('An array of expense objects, each containing the category, amount, and date of the expense.'),
  income: z.number().describe('The user monthly income.'),
});

export type BudgetRecommendationsInput = z.infer<typeof BudgetRecommendationsInputSchema>;

const BudgetRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.string().describe('A specific recommendation for saving money, tailored to the user\'s spending patterns.')
  ).describe('An array of personalized recommendations for saving money.'),
  summary: z.string().describe('A summary of the spending analysis.')
});

export type BudgetRecommendationsOutput = z.infer<typeof BudgetRecommendationsOutputSchema>;

export async function getBudgetRecommendations(input: BudgetRecommendationsInput): Promise<BudgetRecommendationsOutput> {
  return budgetRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetRecommendationsPrompt',
  input: {schema: BudgetRecommendationsInputSchema},
  output: {schema: BudgetRecommendationsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the following spending patterns and provide personalized recommendations for saving money.

Expenses:
{{#each expenses}}
- Date: {{date}}, Category: {{category}}, Amount: {{amount}}
{{/each}}

Monthly Income: {{income}}

Based on this spending data, provide a summary of the spending habits, and  a list of specific, actionable, and practical recommendations for the user to save money. The recommendations should be tailored to the user's spending patterns. The summary should indicate where the user is spending the most money, and where they can cut back. If expenses exceed income, recommend the user reduce expenses across all categories.`, 
});

const budgetRecommendationsFlow = ai.defineFlow(
  {
    name: 'budgetRecommendationsFlow',
    inputSchema: BudgetRecommendationsInputSchema,
    outputSchema: BudgetRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
