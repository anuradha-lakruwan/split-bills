export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

import { Expense } from '@/types';

export const calculateMemberBalance = (memberId: string, expenses: Expense[]): number => {
  let balance = 0;
  
  expenses.forEach(expense => {
    const perPersonAmount = expense.amount / expense.participants.length;
    
    // If this member paid, they get credited
    if (expense.paidBy === memberId) {
      balance += expense.amount;
    }
    
    // If this member participated, they get debited their share
    if (expense.participants.includes(memberId)) {
      balance -= perPersonAmount;
    }
  });
  
  return Math.round(balance * 100) / 100;
};

export const getTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getMemberExpenses = (memberId: string, expenses: Expense[]): number => {
  return expenses
    .filter(expense => expense.paidBy === memberId)
    .reduce((total, expense) => total + expense.amount, 0);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
