import type { Member, Expense, PaidSettlement, Settlement } from '@/types';

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
 * Generate detailed explanation of how settlements were calculated
 */
export const generateSettlementExplanation = (
  members: Member[],
  expenses: Expense[],
  paidSettlements: PaidSettlement[] = []
): SettlementExplanation => {
  const steps: CalculationStep[] = [];
  let stepCounter = 1;

  // Step 1: Analyze Expenses
  steps.push({
    id: `step-${stepCounter++}`,
    type: 'expense_analysis',
    title: '📊 Expense Analysis',
    description: `Found ${expenses.length} expenses totaling $${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}`,
  });

  // Add expense breakdown
  expenses.forEach((expense, index) => {
    const paidBy = members.find(m => m.id === expense.paidBy)?.name || 'Unknown';
    const perPerson = expense.amount / expense.participants.length;

    steps.push({
      id: `step-${stepCounter++}`,
      type: 'expense_analysis',
      title: `Expense ${index + 1}: ${expense.description}`,
      description: `${paidBy} paid $${expense.amount.toFixed(2)} for ${expense.participants.length} people`,
      details: {
        calculation: `$${expense.amount.toFixed(2)} ÷ ${expense.participants.length} people = $${perPerson.toFixed(2)} per person`,
      }
    });
  });

  // Step 2: Calculate Member Balances
  steps.push({
    id: `step-${stepCounter++}`,
    type: 'balance_calculation',
    title: '⚖️ Balance Calculation',
    description: 'Calculating what each member paid vs. what they owe',
  });

  const balances: Record<string, number> = {};
  members.forEach(member => {
    balances[member.id] = 0;
  });

  // Calculate balances from expenses
  expenses.forEach(expense => {
    const perPersonAmount = expense.amount / expense.participants.length;
    
    // Payer gets credited
    balances[expense.paidBy] += expense.amount;
    
    // Participants get debited
    expense.participants.forEach(participantId => {
      balances[participantId] -= perPersonAmount;
    });
  });

  // Account for paid settlements
  paidSettlements.forEach(settlement => {
    balances[settlement.to] -= settlement.amount;
    balances[settlement.from] += settlement.amount;
  });

  // Show balance breakdown for each member
  members.forEach(member => {
    const balance = balances[member.id];
    const totalPaid = expenses
      .filter(e => e.paidBy === member.id)
      .reduce((sum, e) => sum + e.amount, 0);
    
    const totalOwes = expenses
      .filter(e => e.participants.includes(member.id))
      .reduce((sum, e) => sum + (e.amount / e.participants.length), 0);

    steps.push({
      id: `step-${stepCounter++}`,
      type: 'balance_calculation',
      title: `${member.name}'s Balance`,
      description: balance >= 0 
        ? `Should receive $${balance.toFixed(2)}`
        : `Owes $${Math.abs(balance).toFixed(2)}`,
      details: {
        member: member.name,
        amount: balance,
        calculation: `Paid: $${totalPaid.toFixed(2)} - Owes: $${totalOwes.toFixed(2)} = $${balance.toFixed(2)}`,
      }
    });
  });

  // Step 3: Settlement Optimization
  steps.push({
    id: `step-${stepCounter++}`,
    type: 'settlement_optimization',
    title: '🔄 Settlement Optimization',
    description: 'Creating minimal transactions to settle all debts',
  });

  // Create creditors and debtors lists
  const creditors = Object.entries(balances)
    .filter(([, balance]) => balance > 0.01)
    .map(([id, amount]) => ({ id, amount }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = Object.entries(balances)
    .filter(([, balance]) => balance < -0.01)
    .map(([id, amount]) => ({ id, amount: Math.abs(amount) }))
    .sort((a, b) => b.amount - a.amount);

  // Generate settlements with explanation
  const settlements: Settlement[] = [];
  const workingCreditors = creditors.map(c => ({ ...c }));
  const workingDebtors = debtors.map(d => ({ ...d }));

  for (const creditor of workingCreditors) {
    for (const debtor of workingDebtors) {
      if (creditor.amount > 0.01 && debtor.amount > 0.01) {
        const settlementAmount = Math.min(creditor.amount, debtor.amount);
        
        if (settlementAmount > 0.01) {
          const fromMember = members.find(m => m.id === debtor.id)?.name || 'Unknown';
          const toMember = members.find(m => m.id === creditor.id)?.name || 'Unknown';
          
          settlements.push({
            from: debtor.id,
            to: creditor.id,
            amount: Math.round(settlementAmount * 100) / 100
          });

          steps.push({
            id: `step-${stepCounter++}`,
            type: 'settlement_optimization',
            title: `Settlement: ${fromMember} → ${toMember}`,
            description: `${fromMember} pays ${toMember} $${settlementAmount.toFixed(2)}`,
            details: {
              fromAmount: debtor.amount,
              toAmount: creditor.amount,
              amount: settlementAmount,
              calculation: `Min($${debtor.amount.toFixed(2)}, $${creditor.amount.toFixed(2)}) = $${settlementAmount.toFixed(2)}`
            }
          });

          creditor.amount -= settlementAmount;
          debtor.amount -= settlementAmount;
        }
      }
    }
  }

  // Step 4: Final Result
  steps.push({
    id: `step-${stepCounter++}`,
    type: 'final_result',
    title: '✅ Final Settlement Plan',
    description: `Generated ${settlements.length} optimal transactions to settle all debts`,
  });

  // Calculate summary
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balanceCheckSum = Object.values(balances).reduce((sum, balance) => sum + balance, 0);

  return {
    steps,
    summary: {
      totalExpenses,
      totalMembers: members.length,
      totalSettlements: settlements.length,
      balanceCheckSum: Math.round(balanceCheckSum * 100) / 100, // Should be 0 or very close
    }
  };
};
