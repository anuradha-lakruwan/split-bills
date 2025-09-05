'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, getTotalExpenses, calculateMemberBalance, cn } from '@/utils';
import { Icons } from './Icons';
import { Card, Badge, Avatar, EmptyState, Button } from './UI';

export const GroupOverview = () => {
  const { state, dispatch, calculateSettlements } = useApp();
  const { currentGroup } = state;

  // Memoized calculations for performance
  const groupStats = useMemo(() => {
    if (!currentGroup) return null;
    
    const totalExpenses = getTotalExpenses(currentGroup.expenses);
    const settlements = calculateSettlements();
    const recentExpenses = [...currentGroup.expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    return {
      totalExpenses,
      settlements,
      recentExpenses,
      memberCount: currentGroup.members.length,
      expenseCount: currentGroup.expenses.length,
    };
  }, [currentGroup, calculateSettlements]);

  if (!currentGroup || !groupStats) return null;

  const { totalExpenses, settlements, recentExpenses, memberCount, expenseCount } = groupStats;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Enhanced Group Info Header */}
      <Card gradient hover className="group">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Icons.Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {currentGroup.name}
              </h2>
              {currentGroup.description && (
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {currentGroup.description}
                </p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <Icons.Calendar className="w-4 h-4 text-gray-500" />
                <p className="text-gray-500 dark:text-gray-400">
                  Created {formatDate(currentGroup.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {formatCurrency(totalExpenses)}
            </div>
            <Badge variant="success" className="mt-2">
              Total Expenses
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Enhanced Quick Stats */}
        <div className="xl:col-span-2 space-y-6 lg:space-y-8">
          {/* Modern Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card hover className="group animate-slide-in-up [animation-delay:0.1s]">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Icons.Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Members</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {memberCount}
                  </p>
                </div>
              </div>
            </Card>

            <Card hover className="group animate-slide-in-up [animation-delay:0.2s]">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Icons.DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expenses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {expenseCount}
                  </p>
                </div>
              </div>
            </Card>

            <Card hover className="group animate-slide-in-up [animation-delay:0.3s]">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Icons.Calculator className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Settlements</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {settlements.length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Enhanced Recent Expenses */}
          <Card className="animate-slide-in-up [animation-delay:0.4s]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icons.Receipt className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Expenses
                </h3>
              </div>
              <Badge variant="secondary">
                {recentExpenses.length} recent
              </Badge>
            </div>
            <div className="space-y-4">
              {recentExpenses.length > 0 ? (
                recentExpenses.map((expense, index) => {
                  const paidByMember = currentGroup.members.find(m => m.id === expense.paidBy);
                  return (
                    <div key={expense.id} className={cn(
                      "p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group",
                      "animate-fade-in-up"
                    )}
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
                              <Icons.CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {expense.description}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Avatar name={paidByMember?.name || 'Unknown'} size="sm" />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {paidByMember?.name} • {formatDate(expense.date)} • {expense.category}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(expense.amount)}
                          </p>
                          <Badge variant="secondary" size="sm">
                            {expense.participants.length} people
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  icon={Icons.Receipt}
                  title="No expenses yet"
                  description="Add your first expense to start tracking spending"
                />
              )}
            </div>
          </Card>
        </div>

        {/* Enhanced Member Balances */}
        <div className="space-y-6 lg:space-y-8">
          <Card className="animate-slide-in-right [animation-delay:0.5s]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icons.TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Member Balances
                </h3>
              </div>
              <Badge variant="primary">
                {memberCount} members
              </Badge>
            </div>
            <div className="space-y-3">
              {currentGroup.members.length > 0 ? (
                currentGroup.members.map((member, index) => {
                  const balance = calculateMemberBalance(member.id, currentGroup.expenses);
                  const isPositive = balance > 0;
                  const isNeutral = Math.abs(balance) < 0.01;
                  
                  return (
                    <div 
                      key={member.id} 
                      className={cn(
                        "p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 border border-gray-100 dark:border-gray-700",
                        "animate-fade-in-up"
                      )}
                      style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar name={member.name} size="md" />
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {member.name}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {isNeutral ? 'All settled up' : isPositive ? 'Should receive' : 'Owes money'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {isNeutral ? (
                            <Badge variant="success" size="sm">
                              Settled
                            </Badge>
                          ) : (
                            <span
                              className={cn(
                                "text-lg font-semibold",
                                isPositive
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              )}
                            >
                              {isPositive ? '+' : '-'}{formatCurrency(Math.abs(balance))}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  icon={Icons.Users}
                  title="No members yet"
                  description="Add members to start splitting expenses"
                />
              )}
            </div>
          </Card>

          {/* Enhanced Quick Settlements */}
          {settlements.length > 0 && (
            <Card className="animate-slide-in-right [animation-delay:0.6s]">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Icons.Calculator className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Suggested Settlements
                    </h3>
                  </div>
                  <div className="flex items-center justify-center sm:justify-end">
                    <div className="flex items-center space-x-2 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-full border border-orange-200 dark:border-orange-800">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                        {settlements.length} pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 lg:space-y-4">
                {settlements.slice(0, 3).map((settlement, index) => {
                  const fromMember = currentGroup.members.find(m => m.id === settlement.from);
                  const toMember = currentGroup.members.find(m => m.id === settlement.to);
                  
                  return (
                    <div 
                      key={index} 
                      className={cn(
                        "p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700",
                        "bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
                        "hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md",
                        "transition-all duration-300 group animate-fade-in-up overflow-hidden"
                      )}
                      style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                    >
                      {/* Mobile Layout */}
                      <div className="block sm:hidden">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2" title={`${fromMember?.name} owes ${toMember?.name}`}>
                            <Avatar name={fromMember?.name || 'Unknown'} size="sm" />
                            <Icons.ArrowRight className="w-4 h-4 text-blue-500" />
                            <Avatar name={toMember?.name || 'Unknown'} size="sm" />
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {formatCurrency(settlement.amount)}
                            </p>
                          </div>
                          <Button 
                            variant="success" 
                            size="sm"
                            icon={Icons.Check}
                            className="text-xs px-2 py-1 shadow-sm hover:shadow-md !transform-none hover:!transform-none hover:!scale-100"
                            onClick={() => {
                              dispatch({ 
                                type: 'MARK_SETTLEMENT_PAID', 
                                payload: { 
                                  groupId: currentGroup.id, 
                                  settlement 
                                } 
                              });
                            }}
                          >
                            Mark Paid
                          </Button>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center justify-between">
                        <div className="flex items-center space-x-3" title={`${fromMember?.name} owes ${toMember?.name}`}>
                          <Avatar name={fromMember?.name || 'Unknown'} size="md" />
                          <Icons.ArrowRight className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
                          <Avatar name={toMember?.name || 'Unknown'} size="md" />
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(settlement.amount)}
                          </p>
                          <Button 
                            variant="success" 
                            size="sm"
                            icon={Icons.Check}
                            className="text-sm px-3 py-2 shadow-sm hover:shadow-md !transform-none hover:!transform-none hover:!scale-100"
                            onClick={() => {
                              dispatch({ 
                                type: 'MARK_SETTLEMENT_PAID', 
                                payload: { 
                                  groupId: currentGroup.id, 
                                  settlement 
                                } 
                              });
                            }}
                          >
                            Mark Paid
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {settlements.length > 3 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-center">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        icon={Icons.ChevronDown}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border-0"
                        onClick={() => {
                          // Handle showing more settlements
                          console.log('Show more settlements');
                        }}
                      >
                        +{settlements.length - 3} more
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
