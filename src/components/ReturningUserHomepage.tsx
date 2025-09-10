'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, getTotalExpenses, formatDate } from '@/utils';
import { Icons } from './Icons';
import { Card, Button } from './UI';
import { Group } from '@/types';

export const ReturningUserHomepage = () => {
  const { state, dispatch } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleSelectGroup = (group: Group) => {
    dispatch({ type: 'SET_CURRENT_GROUP', payload: group });
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      members: [],
      expenses: [],
      paidSettlements: [],
      createdAt: new Date(),
      description: ''
    };
    
    dispatch({ type: 'ADD_GROUP', payload: newGroup });
    setNewGroupName('');
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Button
              onClick={() => setShowCreateForm(false)}
              variant="secondary"
              className="inline-flex items-center space-x-2"
            >
              <Icons.ArrowRight className="w-4 h-4 transform rotate-180" />
              <span>Back to Groups</span>
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Group</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Name
                </label>
                <input
                  id="groupName"
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleCreateGroup();
                  }}
                  placeholder="Enter group name..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex space-x-4">
                <Button
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim()}
                  className="flex-1"
                >
                  Create Group
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Icons.CreditCard className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
              Welcome Back!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              You have {state.groups.length} group{state.groups.length !== 1 ? 's' : ''} ready to manage
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Icons.Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {state.groups.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active Groups
            </div>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Icons.CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(
                state.groups.reduce((total, group) => total + getTotalExpenses(group.expenses), 0)
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Expenses
            </div>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Icons.Receipt className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {state.groups.reduce((total, group) => total + group.expenses.length, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Transactions
            </div>
          </Card>
        </div>

        {/* Action Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            What would you like to do?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={handleCreateNew}
              size="lg"
              className="inline-flex items-center space-x-3 px-8 py-4 text-lg"
            >
              <Icons.Plus className="w-5 h-5" />
              <span>Create New Group</span>
            </Button>
            <div className="text-gray-400 dark:text-gray-500">or</div>
            <div className="text-gray-600 dark:text-gray-400">
              Select an existing group below
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.groups.map((group) => {
            const totalExpenses = getTotalExpenses(group.expenses);
            const memberCount = group.members.length;
            const expenseCount = group.expenses.length;
            
            return (
              <div 
                key={group.id} 
                className="cursor-pointer"
                onClick={() => handleSelectGroup(group)}
              >
                <Card 
                  hover 
                  className="group transition-all duration-200 hover:shadow-lg"
                >
                  <div className="p-6">
                    {/* Group Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Icons.Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {group.name}
                          </h3>
                          {group.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                              {group.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Icons.ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>

                  {/* Group Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total Expenses</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(totalExpenses)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Members</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {memberCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Transactions</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {expenseCount}
                      </span>
                    </div>
                  </div>

                    {/* Group Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Created {formatDate(group.createdAt)}</span>
                        {expenseCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Click on any group to start managing expenses, or create a new group for your next adventure!
          </p>
        </div>
      </div>
    </div>
  );
};
