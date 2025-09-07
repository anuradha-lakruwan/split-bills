import type { Member, Expense, PaidSettlement, Settlement } from '@/types';

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

export interface CalculationStep {
  id: string;
  type: 'expense_analysis' | 'balance_calculation' | 'settlement_optimization' | 'final_result';
  title: string;
  description: string;
  details?: {
    member?: string;
    amount?: number;
    calculation?: string;
    fromAmount?: number;
    toAmount?: number;
  };
}

export interface SettlementExplanation {
  steps: CalculationStep[];
  summary: {
    totalExpenses: number;
    totalMembers: number;
    totalSettlements: number;
    balanceCheckSum: number;
  };
}

/**
 * Generate concise explanation focused on settlement optimization algorithm
 */
export const generateSettlementExplanation = (
  members: Member[],
  expenses: Expense[],
  paidSettlements: PaidSettlement[] = []
): SettlementExplanation => {
  const steps: CalculationStep[] = [];
  let stepCounter = 1;

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Step 1: Calculate everyone's net balance (what they paid vs what they owe)
  const balances: Record<string, number> = {};
  const memberPayouts: Record<string, number> = {};
  const memberOwes: Record<string, number> = {};
  
  members.forEach(member => {
    balances[member.id] = 0;
    memberPayouts[member.id] = 0;
    memberOwes[member.id] = 0;
  });

  expenses.forEach(expense => {
    memberPayouts[expense.paidBy] += expense.amount;
    const perPersonAmount = expense.amount / expense.participants.length;
    expense.participants.forEach(participantId => {
      memberOwes[participantId] += perPersonAmount;
    });
  });

  members.forEach(member => {
    const paidOut = memberPayouts[member.id];
    const owes = memberOwes[member.id];
    balances[member.id] = paidOut - owes;
  });

  // Account for previous settlements
  if (paidSettlements.length > 0) {
    paidSettlements.forEach(settlement => {
      balances[settlement.to] -= settlement.amount;
      balances[settlement.from] += settlement.amount;
    });
  }

  // Show current balances
  steps.push({
    id: `step-${stepCounter++}`,
    type: 'balance_calculation',
    title: '⚖️ Current Balances',
    description: `After analyzing ${expenses.length} expenses totaling ${formatCurrency(totalExpenseAmount)}, here's who owes what:`,
  });

  const balanceDescriptions: string[] = [];
  members.forEach(member => {
    const balance = balances[member.id];
    if (Math.abs(balance) > 0.01) {
      if (balance > 0) {
        balanceDescriptions.push(`${member.name} should receive ${formatCurrency(balance)}`);
      } else {
        balanceDescriptions.push(`${member.name} owes ${formatCurrency(Math.abs(balance))}`);
      }
    }
  });

  if (balanceDescriptions.length === 0) {
    steps.push({
      id: `step-${stepCounter++}`,
      type: 'balance_calculation',
      title: '🎉 Everyone is settled up!',
      description: 'All members have paid exactly their fair share.',
    });
    
    return {
      steps,
      summary: {
        totalExpenses: totalExpenseAmount,
        totalMembers: members.length,
        totalSettlements: 0,
        balanceCheckSum: 0,
      }
    };
  }

  steps.push({
    id: `step-${stepCounter++}`,
    type: 'balance_calculation',
    title: '� Balance Summary',
    description: balanceDescriptions.join('\n'),
  });

  // Step 2: Explain the optimization algorithm
  const creditors = Object.entries(balances)
    .filter(([, balance]) => balance > 0.01)
    .map(([id, amount]) => ({ id, amount }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = Object.entries(balances)
    .filter(([, balance]) => balance < -0.01)
    .map(([id, amount]) => ({ id, amount: Math.abs(amount) }))
    .sort((a, b) => b.amount - a.amount);

  steps.push({
    id: `step-${stepCounter++}`,
    type: 'settlement_optimization',
    title: '� Optimization Algorithm: Greedy Matching',
    description: `We use a greedy algorithm to minimize transactions. Instead of ${members.length * (members.length - 1)} possible payments between everyone, we match the largest amounts first to create the fewest transactions.`,
  });

  // Generate optimal settlements
  const settlements: Settlement[] = [];
  const workingCreditors = creditors.map(c => ({ ...c }));
  const workingDebtors = debtors.map(d => ({ ...d }));
  
  steps.push({
    id: `step-${stepCounter++}`,
    type: 'settlement_optimization',
    title: '💡 Why This Works',
    description: `By matching ${creditors.length} people who should receive money with ${debtors.length} people who owe money, we can settle everything with at most ${Math.min(creditors.length, debtors.length)} transactions (vs up to ${creditors.length * debtors.length} if everyone paid everyone).`,
  });

  const optimizationSteps: string[] = [];
  for (const creditor of workingCreditors) {
    for (const debtor of workingDebtors) {
      if (creditor.amount > 0.01 && debtor.amount > 0.01) {
        const settlementAmount = Math.min(creditor.amount, debtor.amount);
        
        if (settlementAmount > 0.01) {
          const fromName = members.find(m => m.id === debtor.id)?.name || 'Unknown';
          const toName = members.find(m => m.id === creditor.id)?.name || 'Unknown';
          
          settlements.push({
            from: debtor.id,
            to: creditor.id,
            amount: Math.round(settlementAmount * 100) / 100
          });

          optimizationSteps.push(`${fromName} pays ${formatCurrency(settlementAmount)} to ${toName} (settles ${settlementAmount === debtor.amount ? 'all of ' + fromName + '\'s debt' : settlementAmount === creditor.amount ? 'all of ' + toName + '\'s credit' : 'partial amounts'})`);

          creditor.amount -= settlementAmount;
          debtor.amount -= settlementAmount;
        }
      }
    }
  }

  if (settlements.length > 0) {
    steps.push({
      id: `step-${stepCounter++}`,
      type: 'settlement_optimization',
      title: '� Optimal Transactions',
      description: optimizationSteps.join('\n'),
    });

    const totalTransactionAmount = settlements.reduce((sum, s) => sum + s.amount, 0);
    steps.push({
      id: `step-${stepCounter++}`,
      type: 'final_result',
      title: '✨ Result: Maximum Efficiency',
      description: `${settlements.length} transaction${settlements.length === 1 ? '' : 's'} will settle ${formatCurrency(totalTransactionAmount)} in debts. This is the minimum number of payments needed to balance everyone.`,
    });
  }

  const balanceCheckSum = Object.values(balances).reduce((sum, balance) => sum + balance, 0);

  return {
    steps,
    summary: {
      totalExpenses: totalExpenseAmount,
      totalMembers: members.length,
      totalSettlements: settlements.length,
      balanceCheckSum: Math.round(balanceCheckSum * 100) / 100,
    }
  };
};
