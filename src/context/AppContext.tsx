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
        const groups = JSON.parse(savedGroups).map((group: Group & { createdAt: string; expenses: Array<Expense & { date: string }>; paidSettlements?: Array<PaidSettlement & { datePaid: string }> }) => ({
          ...group,
          createdAt: new Date(group.createdAt),
          expenses: group.expenses.map((expense: Expense & { date: string }) => ({
            ...expense,
            date: new Date(expense.date)
          })),
          paidSettlements: (group.paidSettlements || []).map((settlement: PaidSettlement & { datePaid: string }) => ({
            ...settlement,
            datePaid: new Date(settlement.datePaid)
          }))
        }));
        dispatch({ type: 'SET_GROUPS', payload: groups });
      } catch (error) {
        console.error('Failed to load groups from localStorage:', error);
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
    if (!state.currentGroup) return [];

    const balances: Record<string, number> = {};
    
    // Initialize balances for all members
    state.currentGroup.members.forEach(member => {
      balances[member.id] = 0;
    });

    // Calculate net balances for each member from expenses
    state.currentGroup.expenses.forEach(expense => {
      const perPersonAmount = expense.amount / expense.participants.length;
      
      // Person who paid gets credited
      balances[expense.paidBy] += expense.amount;
      
      // Each participant gets debited their share
      expense.participants.forEach(participantId => {
        balances[participantId] -= perPersonAmount;
      });
    });

    // Account for paid settlements
    if (state.currentGroup.paidSettlements) {
      state.currentGroup.paidSettlements.forEach(paidSettlement => {
        // The person who received money should have less credit
        balances[paidSettlement.to] -= paidSettlement.amount;
        // The person who paid should have less debt
        balances[paidSettlement.from] += paidSettlement.amount;
      });
    }

    // Convert balances to settlements
    const settlements: Settlement[] = [];
    const creditors = Object.entries(balances).filter(([, balance]) => balance > 0.01);
    const debtors = Object.entries(balances).filter(([, balance]) => balance < -0.01);

    creditors.forEach(([creditorId, credit]) => {
      let remainingCredit = credit;
      
      debtors.forEach(([debtorId, debt]) => {
        if (remainingCredit > 0.01 && debt < -0.01) {
          const settlementAmount = Math.min(remainingCredit, Math.abs(debt));
          
          settlements.push({
            from: debtorId,
            to: creditorId,
            amount: Math.round(settlementAmount * 100) / 100
          });
          
          remainingCredit -= settlementAmount;
          balances[debtorId] += settlementAmount;
        }
      });
    });

    return settlements;
  };

  return (
    <AppContext.Provider value={{ state, dispatch, calculateSettlements }}>
      {children}
    </AppContext.Provider>
  );
};
