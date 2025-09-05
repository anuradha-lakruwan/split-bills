'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Group, Member, Expense, Settlement, PaidSettlement } from '@/types';

interface AppState {
  groups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GROUPS'; payload: Group[] }
  | { type: 'ADD_GROUP'; payload: Group }
  | { type: 'SET_CURRENT_GROUP'; payload: Group | null }
  | { type: 'ADD_MEMBER'; payload: { groupId: string; member: Member } }
  | { type: 'REMOVE_MEMBER'; payload: { groupId: string; memberId: string } }
  | { type: 'ADD_EXPENSE'; payload: { groupId: string; expense: Expense } }
  | { type: 'UPDATE_EXPENSE'; payload: { groupId: string; expense: Expense } }
  | { type: 'DELETE_EXPENSE'; payload: { groupId: string; expenseId: string } }
  | { type: 'UPDATE_GROUP'; payload: Group }
  | { type: 'MARK_SETTLEMENT_PAID'; payload: { groupId: string; settlement: Settlement } };

const initialState: AppState = {
  groups: [],
  currentGroup: null,
  isLoading: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_GROUPS':
      return { ...state, groups: action.payload };
    
    case 'ADD_GROUP':
      return { 
        ...state, 
        groups: [...state.groups, action.payload],
        currentGroup: action.payload
      };
    
    case 'SET_CURRENT_GROUP':
      return { ...state, currentGroup: action.payload };
    
    case 'ADD_MEMBER':
      const updatedGroupsAddMember = state.groups.map(group =>
        group.id === action.payload.groupId
          ? { ...group, members: [...group.members, action.payload.member] }
          : group
      );
      return {
        ...state,
        groups: updatedGroupsAddMember,
        currentGroup: state.currentGroup?.id === action.payload.groupId
          ? { ...state.currentGroup, members: [...state.currentGroup.members, action.payload.member] }
          : state.currentGroup
      };
    
    case 'REMOVE_MEMBER':
      const updatedGroupsRemoveMember = state.groups.map(group =>
        group.id === action.payload.groupId
          ? { 
              ...group, 
              members: group.members.filter(m => m.id !== action.payload.memberId),
              expenses: group.expenses.filter(e => 
                e.paidBy !== action.payload.memberId &&
                !e.participants.includes(action.payload.memberId)
              )
            }
          : group
      );
      return {
        ...state,
        groups: updatedGroupsRemoveMember,
        currentGroup: state.currentGroup?.id === action.payload.groupId
          ? updatedGroupsRemoveMember.find(g => g.id === action.payload.groupId) || null
          : state.currentGroup
      };
    
    case 'ADD_EXPENSE':
      const updatedGroupsAddExpense = state.groups.map(group =>
        group.id === action.payload.groupId
          ? { ...group, expenses: [...group.expenses, action.payload.expense] }
          : group
      );
      return {
        ...state,
        groups: updatedGroupsAddExpense,
        currentGroup: state.currentGroup?.id === action.payload.groupId
          ? { ...state.currentGroup, expenses: [...state.currentGroup.expenses, action.payload.expense] }
          : state.currentGroup
      };
    
    case 'UPDATE_EXPENSE':
      const updatedGroupsUpdateExpense = state.groups.map(group =>
        group.id === action.payload.groupId
          ? { 
              ...group, 
              expenses: group.expenses.map(e => 
                e.id === action.payload.expense.id ? action.payload.expense : e
              )
            }
          : group
      );
      return {
        ...state,
        groups: updatedGroupsUpdateExpense,
        currentGroup: state.currentGroup?.id === action.payload.groupId
          ? { 
              ...state.currentGroup, 
              expenses: state.currentGroup.expenses.map(e => 
                e.id === action.payload.expense.id ? action.payload.expense : e
              )
            }
          : state.currentGroup
      };
    
    case 'DELETE_EXPENSE':
      const updatedGroupsDeleteExpense = state.groups.map(group =>
        group.id === action.payload.groupId
          ? { ...group, expenses: group.expenses.filter(e => e.id !== action.payload.expenseId) }
          : group
      );
      return {
        ...state,
        groups: updatedGroupsDeleteExpense,
        currentGroup: state.currentGroup?.id === action.payload.groupId
          ? { ...state.currentGroup, expenses: state.currentGroup.expenses.filter(e => e.id !== action.payload.expenseId) }
          : state.currentGroup
      };
    
    case 'UPDATE_GROUP':
      const updatedGroups = state.groups.map(group =>
        group.id === action.payload.id ? action.payload : group
      );
      return {
        ...state,
        groups: updatedGroups,
        currentGroup: state.currentGroup?.id === action.payload.id ? action.payload : state.currentGroup
      };
    
    case 'MARK_SETTLEMENT_PAID':
      const paidSettlement: PaidSettlement = {
        id: Date.now().toString(),
        from: action.payload.settlement.from,
        to: action.payload.settlement.to,
        amount: action.payload.settlement.amount,
        datePaid: new Date()
      };
      
      const updatedGroupsSettlement = state.groups.map(group =>
        group.id === action.payload.groupId
          ? { 
              ...group, 
              paidSettlements: [...(group.paidSettlements || []), paidSettlement]
            }
          : group
      );
      
      return {
        ...state,
        groups: updatedGroupsSettlement,
        currentGroup: state.currentGroup?.id === action.payload.groupId
          ? { 
              ...state.currentGroup, 
              paidSettlements: [...(state.currentGroup.paidSettlements || []), paidSettlement]
            }
          : state.currentGroup
      };
    
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  calculateSettlements: () => Settlement[];
} | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedGroups = localStorage.getItem('splitbills-groups');
    if (savedGroups) {
      try {
        const parsedData = JSON.parse(savedGroups);
        
        // Validate that parsedData is an array
        if (!Array.isArray(parsedData)) {
          console.warn('Invalid groups data in localStorage, expected array');
          return;
        }
        
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const groups = parsedData
          .filter((item: unknown) => item && typeof item === 'object' && 'id' in item) // Filter out invalid groups
          .map((group: any) => {
            // Validate and sanitize group data
            const sanitizedGroup: Group = {
              id: group.id || '',
              name: group.name || '',
              description: group.description || '',
              createdAt: group.createdAt ? new Date(group.createdAt) : new Date(),
              members: Array.isArray(group.members) ? group.members.filter((m: any) => m && m.id) : [],
              expenses: Array.isArray(group.expenses) ? group.expenses
                .filter((expense: any) => 
                  expense && 
                  expense.id && 
                  typeof expense.amount === 'number' && 
                  expense.amount >= 0 &&
                  Array.isArray(expense.participants) && 
                  expense.participants.length > 0 &&
                  expense.paidBy
                )
                .map((expense: any) => ({
                  id: expense.id,
                  description: expense.description || '',
                  amount: Math.round(expense.amount * 100) / 100, // Ensure 2 decimal places
                  paidBy: expense.paidBy,
                  participants: expense.participants,
                  category: expense.category || 'other',
                  date: expense.date ? new Date(expense.date) : new Date(),
                  receipt: expense.receipt
                })) : [],
              paidSettlements: Array.isArray(group.paidSettlements) ? group.paidSettlements
                .filter((settlement: any) => 
                  settlement && 
                  settlement.id && 
                  settlement.from && 
                  settlement.to && 
                  typeof settlement.amount === 'number' && 
                  settlement.amount > 0
                )
                .map((settlement: any) => ({
                  id: settlement.id,
                  from: settlement.from,
                  to: settlement.to,
                  amount: Math.round(settlement.amount * 100) / 100, // Ensure 2 decimal places
                  datePaid: settlement.datePaid ? new Date(settlement.datePaid) : new Date()
                })) : []
            };
            
            return sanitizedGroup;
          });
        /* eslint-enable @typescript-eslint/no-explicit-any */
          
        dispatch({ type: 'SET_GROUPS', payload: groups });
      } catch (error) {
        console.error('Failed to load groups from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('splitbills-groups');
      }
    }
  }, []);

  // Save data to localStorage whenever groups change
  useEffect(() => {
    if (state.groups.length > 0) {
      localStorage.setItem('splitbills-groups', JSON.stringify(state.groups));
    }
  }, [state.groups]);

  const calculateSettlements = (): Settlement[] => {
    if (!state.currentGroup || !Array.isArray(state.currentGroup.members)) {
      return [];
    }

    // Use cents for precision throughout calculations
    const balancesCents: Record<string, number> = {};
    
    // Initialize balances for all members
    state.currentGroup.members.forEach(member => {
      if (member && member.id) {
        balancesCents[member.id] = 0;
      }
    });

    // Calculate net balances for each member from expenses (in cents)
    if (Array.isArray(state.currentGroup.expenses)) {
      state.currentGroup.expenses.forEach(expense => {
        // Validate expense data
        if (!expense || typeof expense.amount !== 'number' || !Array.isArray(expense.participants) || expense.participants.length === 0) {
          return; // Skip invalid expenses
        }
        
        const expenseAmountCents = Math.round(expense.amount * 100);
        const perPersonAmountCents = Math.round(expenseAmountCents / expense.participants.length);
        
        // Person who paid gets credited
        if (expense.paidBy && balancesCents.hasOwnProperty(expense.paidBy)) {
          balancesCents[expense.paidBy] += expenseAmountCents;
        }
        
        // Each participant gets debited their share
        expense.participants.forEach(participantId => {
          if (participantId && balancesCents.hasOwnProperty(participantId)) {
            balancesCents[participantId] -= perPersonAmountCents;
          }
        });
      });
    }

    // Account for paid settlements (in cents)
    if (Array.isArray(state.currentGroup.paidSettlements)) {
      state.currentGroup.paidSettlements.forEach(paidSettlement => {
        // Validate settlement data
        if (!paidSettlement || typeof paidSettlement.amount !== 'number') {
          return; // Skip invalid settlements
        }
        
        const settlementAmountCents = Math.round(paidSettlement.amount * 100);
        
        // The person who received money should have less credit
        if (paidSettlement.to && balancesCents.hasOwnProperty(paidSettlement.to)) {
          balancesCents[paidSettlement.to] -= settlementAmountCents;
        }
        
        // The person who paid should have less debt
        if (paidSettlement.from && balancesCents.hasOwnProperty(paidSettlement.from)) {
          balancesCents[paidSettlement.from] += settlementAmountCents;
        }
      });
    }

    // Convert back to dollars
    const balances: Record<string, number> = {};
    Object.entries(balancesCents).forEach(([id, amountCents]) => {
      balances[id] = Math.round(amountCents) / 100;
    });

    // Convert balances to settlements
    const settlements: Settlement[] = [];
    
    // Create copies of creditors and debtors to avoid mutation issues
    const creditors = Object.entries(balances)
      .filter(([, balance]) => balance > 0.01)
      .map(([id, amount]) => ({ id, amount }))
      .sort((a, b) => b.amount - a.amount); // Sort by highest amount first
    
    const debtors = Object.entries(balances)
      .filter(([, balance]) => balance < -0.01)
      .map(([id, amount]) => ({ id, amount: Math.abs(amount) }))
      .sort((a, b) => b.amount - a.amount); // Sort by highest debt first

    // Use working copies to avoid mutating the original data
    const workingCreditors = creditors.map(c => ({ ...c }));
    const workingDebtors = debtors.map(d => ({ ...d }));

    // Calculate settlements without modifying original balances
    for (const creditor of workingCreditors) {
      for (const debtor of workingDebtors) {
        if (creditor.amount > 0.01 && debtor.amount > 0.01) {
          const settlementAmount = Math.min(creditor.amount, debtor.amount);
          
          if (settlementAmount > 0.01) {
            settlements.push({
              from: debtor.id,
              to: creditor.id,
              amount: Math.round(settlementAmount * 100) / 100
            });
            
            creditor.amount -= settlementAmount;
            debtor.amount -= settlementAmount;
          }
        }
      }
    }

    return settlements;
  };

  return (
    <AppContext.Provider value={{ state, dispatch, calculateSettlements }}>
      {children}
    </AppContext.Provider>
  );
};
