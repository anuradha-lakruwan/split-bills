'use client';

import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, getTotalExpenses, calculateMemberBalance } from '@/utils';

export const GroupOverview = () => {
  const { state, calculateSettlements } = useApp();
  const { currentGroup } = state;

  if (!currentGroup) return null;

  const totalExpenses = getTotalExpenses(currentGroup.expenses);
  const settlements = calculateSettlements();
  const recentExpenses = [...currentGroup.expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Group Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentGroup.name}
            </h2>
            {currentGroup.description && (
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {currentGroup.description}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
              Created {formatDate(currentGroup.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">Total Expenses</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 text-sm">👥</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Members</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentGroup.members.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-300 text-sm">💰</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expenses</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentGroup.expenses.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 dark:text-yellow-300 text-sm">⚖️</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Settlements</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {settlements.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Expenses
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentExpenses.length > 0 ? (
                recentExpenses.map((expense) => {
                  const paidByMember = currentGroup.members.find(m => m.id === expense.paidBy);
                  return (
                    <div key={expense.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {expense.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Paid by {paidByMember?.name} • {formatDate(expense.date)} • {expense.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(expense.amount)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {expense.participants.length} people
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No expenses yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Member Balances */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Member Balances
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentGroup.members.length > 0 ? (
                currentGroup.members.map((member) => {
                  const balance = calculateMemberBalance(member.id, currentGroup.expenses);
                  const isPositive = balance > 0;
                  const isNeutral = Math.abs(balance) < 0.01;
                  
                  return (
                    <div key={member.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isNeutral
                            ? 'text-gray-500 dark:text-gray-400'
                            : isPositive
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {isNeutral ? 'Settled' : formatCurrency(Math.abs(balance))}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No members yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Settlements */}
          {settlements.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Suggested Settlements
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {settlements.slice(0, 3).map((settlement, index) => {
                  const fromMember = currentGroup.members.find(m => m.id === settlement.from);
                  const toMember = currentGroup.members.find(m => m.id === settlement.to);
                  
                  return (
                    <div key={index} className="px-6 py-4">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{fromMember?.name}</span>
                        {' owes '}
                        <span className="font-medium">{toMember?.name}</span>
                      </p>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {formatCurrency(settlement.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
