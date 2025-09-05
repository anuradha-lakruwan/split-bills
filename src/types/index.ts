export interface Member {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // Member ID
  participants: string[]; // Array of Member IDs
  category: string;
  date: Date;
  receipt?: string; // URL to receipt image
}

export interface Settlement {
  from: string; // Member ID
  to: string; // Member ID
  amount: number;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: Member[];
  expenses: Expense[];
  createdAt: Date;
}

export type ExpenseCategory = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Accommodation'
  | 'Entertainment'
  | 'Shopping'
  | 'Utilities'
  | 'Health'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Transportation',
  'Accommodation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Health',
  'Other'
];
