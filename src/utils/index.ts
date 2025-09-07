export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Utility function to combine class names conditionally
 * Similar to clsx/classnames but simpler for our needs
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

import { Expense, PaidSettlement } from '@/types';

export const calculateMemberBalance = (memberId: string, expenses: Expense[], paidSettlements: PaidSettlement[] = [], validMemberIds?: string[]): number => {
  // Use integer arithmetic (cents) to avoid floating point issues
  let balanceCents = 0;
  
  // Validate inputs
  if (!memberId || !Array.isArray(expenses)) {
    return 0;
  }
  
  // Calculate balance from expenses (in cents)
  expenses.forEach(expense => {
    // Validate expense data
    if (!expense || typeof expense.amount !== 'number' || !Array.isArray(expense.participants) || expense.participants.length === 0) {
      return; // Skip invalid expenses
    }
    
    const expenseAmountCents = Math.round(expense.amount * 100);
    const perPersonAmountCents = Math.round(expenseAmountCents / expense.participants.length);
    
    // If this member paid, they get credited
    if (expense.paidBy === memberId) {
      balanceCents += expenseAmountCents;
    }
    
    // If this member participated, they get debited their share
    if (expense.participants.includes(memberId)) {
      balanceCents -= perPersonAmountCents;
    }
  });

  // Account for paid settlements (in cents)
  if (Array.isArray(paidSettlements)) {
    paidSettlements.forEach(settlement => {
      // Validate settlement data
      if (!settlement || typeof settlement.amount !== 'number') {
        return; // Skip invalid settlements
      }
      
      // Skip settlements involving deleted members if validMemberIds is provided
      if (validMemberIds && (!validMemberIds.includes(settlement.from) || !validMemberIds.includes(settlement.to))) {
        return; // Skip settlements with deleted members
      }
      
      const settlementAmountCents = Math.round(settlement.amount * 100);
      
      // If this member received money, reduce their credit (they were owed less)
      if (settlement.to === memberId) {
        balanceCents -= settlementAmountCents;
      }
      
      // If this member paid money, reduce their debt (they owe less)
      if (settlement.from === memberId) {
        balanceCents += settlementAmountCents;
      }
    });
  }
  
  // Convert back to dollars and sanitize the result
  return sanitizeAmount(balanceCents / 100);
};

export const getTotalExpenses = (expenses: Expense[]): number => {
  if (!Array.isArray(expenses)) {
    return 0;
  }
  
  const total = expenses
    .filter(validateExpense)
    .reduce((sum, expense) => sum + expense.amount, 0);
    
  return sanitizeAmount(total);
};

export const getMemberExpenses = (memberId: string, expenses: Expense[]): number => {
  if (!memberId || !Array.isArray(expenses)) {
    return 0;
  }
  
  const total = expenses
    .filter(expense => validateExpense(expense) && expense.paidBy === memberId)
    .reduce((sum, expense) => sum + expense.amount, 0);
    
  return sanitizeAmount(total);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility to ensure monetary values are properly formatted
export const sanitizeAmount = (amount: number): number => {
  // Handle NaN, Infinity values
  if (!isFinite(amount) || isNaN(amount)) {
    return 0;
  }
  
  // Round to 2 decimal places to avoid floating point issues
  // Note: We DON'T use Math.max(0, amount) because negative balances are valid (debts)
  return Math.round(amount * 100) / 100;
};

// Utility to validate expense data
export const validateExpense = (expense: Expense): boolean => {
  return !!(
    expense &&
    expense.id &&
    expense.description &&
    typeof expense.amount === 'number' &&
    expense.amount > 0 &&
    expense.paidBy &&
    Array.isArray(expense.participants) &&
    expense.participants.length > 0 &&
    expense.participants.every(p => typeof p === 'string' && p.trim().length > 0)
  );
};

// Utility to validate settlement data
export const validateSettlement = (settlement: PaidSettlement): boolean => {
  return !!(
    settlement &&
    settlement.id &&
    settlement.from &&
    settlement.to &&
    settlement.from !== settlement.to &&
    typeof settlement.amount === 'number' &&
    settlement.amount > 0 &&
    settlement.datePaid instanceof Date
  );
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

// Re-export avatar utilities
export { generateAvatarInfo, hashStringToColor } from './avatarUtils';
export type { AvatarInfo } from './avatarUtils';

// Re-export PDF utilities
export { exportToPDF, exportSettlementsToPDF, exportCompletePDF } from './pdfExport';
