'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { generateId, formatCurrency, formatDate } from '@/utils';
import { Expense, EXPENSE_CATEGORIES } from '@/types';

export const ExpensesPanel = () => {
  const { state, dispatch } = useApp();
  const { currentGroup } = state;
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: '',
    participants: [] as string[],
    category: 'Food & Dining' as typeof EXPENSE_CATEGORIES[number],
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!currentGroup) return null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!newExpense.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!newExpense.paidBy) {
      newErrors.paidBy = 'Please select who paid';
    }

    if (newExpense.participants.length === 0) {
      newErrors.participants = 'Please select at least one participant';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddExpense = () => {
    if (!validateForm()) return;

    const expense: Expense = {
      id: generateId(),
      description: newExpense.description.trim(),
      amount: parseFloat(newExpense.amount),
      paidBy: newExpense.paidBy,
      participants: newExpense.participants,
      category: newExpense.category,
      date: new Date(newExpense.date),
    };

    dispatch({
      type: 'ADD_EXPENSE',
      payload: { groupId: currentGroup.id, expense }
    });

    resetForm();
  };

  const handleUpdateExpense = () => {
    if (!editingExpense || !validateForm()) return;

    const updatedExpense: Expense = {
      ...editingExpense,
      description: newExpense.description.trim(),
      amount: parseFloat(newExpense.amount),
      paidBy: newExpense.paidBy,
      participants: newExpense.participants,
      category: newExpense.category,
      date: new Date(newExpense.date),
    };

    dispatch({
      type: 'UPDATE_EXPENSE',
      payload: { groupId: currentGroup.id, expense: updatedExpense }
    });

    resetForm();
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch({
        type: 'DELETE_EXPENSE',
        payload: { groupId: currentGroup.id, expenseId }
      });
    }
  };

  const startEditing = (expense: Expense) => {
    setEditingExpense(expense);
    setNewExpense({
      description: expense.description,
      amount: expense.amount.toString(),
      paidBy: expense.paidBy,
      participants: expense.participants,
      category: expense.category as typeof EXPENSE_CATEGORIES[number],
      date: expense.date.toISOString().split('T')[0]
    });
    setIsAddingExpense(true);
  };

  const resetForm = () => {
    setNewExpense({
      description: '',
      amount: '',
      paidBy: '',
      participants: [],
      category: 'Food & Dining',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddingExpense(false);
    setEditingExpense(null);
    setErrors({});
  };

  const toggleParticipant = (memberId: string) => {
    if (newExpense.participants.includes(memberId)) {
      setNewExpense({
        ...newExpense,
        participants: newExpense.participants.filter(id => id !== memberId)
      });
    } else {
      setNewExpense({
        ...newExpense,
        participants: [...newExpense.participants, memberId]
      });
    }
    if (errors.participants) {
      setErrors({ ...errors, participants: '' });
    }
  };

  const sortedExpenses = [...currentGroup.expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (currentGroup.members.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Add members first
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          You need to add group members before you can track expenses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Expenses
        </h2>
        <button
          onClick={() => setIsAddingExpense(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Expense
        </button>
      </div>

      {/* Add/Edit Expense Form */}
      {isAddingExpense && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description *
              </label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => {
                  setNewExpense({ ...newExpense, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.description ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="What was this expense for?"
                maxLength={100}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newExpense.amount}
                  onChange={(e) => {
                    setNewExpense({ ...newExpense, amount: e.target.value });
                    if (errors.amount) setErrors({ ...errors, amount: '' });
                  }}
                  className={`block w-full pl-7 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.amount ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as typeof EXPENSE_CATEGORIES[number] })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Paid by *
              </label>
              <select
                value={newExpense.paidBy}
                onChange={(e) => {
                  setNewExpense({ ...newExpense, paidBy: e.target.value });
                  if (errors.paidBy) setErrors({ ...errors, paidBy: '' });
                }}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.paidBy ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select member</option>
                {currentGroup.members.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
              {errors.paidBy && <p className="mt-1 text-sm text-red-600">{errors.paidBy}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Split between *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentGroup.members.map(member => (
                <label
                  key={member.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    newExpense.participants.includes(member.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={newExpense.participants.includes(member.id)}
                    onChange={() => toggleParticipant(member.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </span>
                </label>
              ))}
            </div>
            {errors.participants && <p className="mt-1 text-sm text-red-600">{errors.participants}</p>}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={editingExpense ? handleUpdateExpense : handleAddExpense}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {editingExpense ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {sortedExpenses.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedExpenses.map(expense => {
              const paidByMember = currentGroup.members.find(m => m.id === expense.paidBy);
              const participantNames = expense.participants
                .map(id => currentGroup.members.find(m => m.id === id)?.name)
                .filter(Boolean);

              return (
                <div key={expense.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {expense.description}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {expense.category}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Paid by <span className="font-medium">{paidByMember?.name}</span> on {formatDate(expense.date)}
                      </div>
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Split between: {participantNames.join(', ')}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(expense.amount)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(expense.amount / expense.participants.length)} per person
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => startEditing(expense)}
                          className="p-2 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
                          title="Edit expense"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                          title="Delete expense"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No expenses yet
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Add the first expense to start tracking who owes what
            </p>
            <button
              onClick={() => setIsAddingExpense(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Add First Expense
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
