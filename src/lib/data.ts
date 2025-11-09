import type { Expense } from './types';

export const initialExpenses: Expense[] = [
  {
    id: '1',
    date: new Date('2024-07-15'),
    category: 'Food',
    amount: 25.5,
    description: 'Lunch with colleagues',
  },
  {
    id: '2',
    date: new Date('2024-07-15'),
    category: 'Transport',
    amount: 50,
    description: 'Gasoline for car',
  },
  {
    id: '3',
    date: new Date('2024-07-14'),
    category: 'Shopping',
    amount: 120.75,
    description: 'New shoes',
  },
  {
    id: '4',
    date: new Date('2024-07-13'),
    category: 'Food',
    amount: 8.99,
    description: 'Coffee and pastry',
  },
  {
    id: '5',
    date: new Date('2024-07-12'),
    category: 'Utilities',
    amount: 85.0,
    description: 'Electricity bill',
  },
    {
    id: '6',
    date: new Date('2024-07-11'),
    category: 'Entertainment',
    amount: 45.0,
    description: 'Movie tickets for two',
  },
  {
    id: '7',
    date: new Date('2024-06-28'),
    category: 'Travel',
    amount: 450.0,
    description: 'Flight for vacation',
  },
    {
    id: '8',
    date: new Date('2024-06-25'),
    category: 'Health',
    amount: 75.0,
    description: 'Pharmacy',
  },
];
