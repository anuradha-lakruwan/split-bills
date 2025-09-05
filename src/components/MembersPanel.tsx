'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { generateId, validateEmail, calculateMemberBalance, getMemberExpenses, formatCurrency } from '@/utils';
import { Member } from '@/types';
import { UI } from './UI';
import { Icons } from './Icons';

export const MembersPanel = () => {
  const { state, dispatch } = useApp();
  const { currentGroup } = state;
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  if (!currentGroup) return null;

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!newMember.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (currentGroup.members.some(m => m.name.toLowerCase() === newMember.name.toLowerCase().trim())) {
      newErrors.name = 'Member with this name already exists';
    }

    if (newMember.email && !validateEmail(newMember.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMember = () => {
    if (!validateForm()) return;

    const member: Member = {
      id: generateId(),
      name: newMember.name.trim(),
      email: newMember.email.trim() || undefined,
    };

    dispatch({
      type: 'ADD_MEMBER',
      payload: { groupId: currentGroup.id, member }
    });

    setNewMember({ name: '', email: '' });
    setIsAddingMember(false);
    setErrors({});
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this member? This will also remove all their expenses.')) {
      dispatch({
        type: 'REMOVE_MEMBER',
        payload: { groupId: currentGroup.id, memberId }
      });
    }
  };

  const resetForm = () => {
    setNewMember({ name: '', email: '' });
    setIsAddingMember(false);
    setErrors({});
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Icons.Users className="mr-3 text-blue-600" />
          Group Members
        </h2>
        <UI.Button onClick={() => setIsAddingMember(true)} icon={Icons.Plus}>
          Add Member
        </UI.Button>
      </div>

      {/* Add Member Form */}
      {isAddingMember && (
        <UI.Card className="animate-slideIn" gradient>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Icons.Plus className="mr-2 text-green-600" />
            Add New Member
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="member-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name *
              </label>
              <input
                id="member-name"
                type="text"
                value={newMember.name}
                onChange={(e) => {
                  setNewMember({ ...newMember, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.name
                    ? 'border-red-300 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter member name"
                maxLength={50}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="member-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email (Optional)
              </label>
              <input
                id="member-email"
                type="email"
                value={newMember.email}
                onChange={(e) => {
                  setNewMember({ ...newMember, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.email
                    ? 'border-red-300 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <UI.Button variant="secondary" onClick={resetForm}>
                Cancel
              </UI.Button>
              <UI.Button 
                onClick={handleAddMember}
                disabled={!newMember.name.trim()}
                icon={Icons.Check}
              >
                Add Member
              </UI.Button>
            </div>
          </div>
        </UI.Card>
      )}

      {/* Members List */}
      {currentGroup.members.length > 0 ? (
        <div className="space-y-4">
          {currentGroup.members.map((member) => {
            const balance = calculateMemberBalance(member.id, currentGroup.expenses);
            const memberExpenses = getMemberExpenses(member.id, currentGroup.expenses);
            const isPositive = balance > 0;
            const isNeutral = Math.abs(balance) < 0.01;

            return (
              <UI.Card key={member.id} hover className="animate-slideIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <UI.Avatar name={member.name} size="lg" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      {member.email && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {member.email}
                        </p>
                      )}
                      <div className="mt-1 flex items-center space-x-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Balance:</span>
                        <span className={`font-semibold ${
                          isNeutral
                            ? 'text-gray-500 dark:text-gray-400'
                            : isPositive
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {isNeutral ? 'Settled' : formatCurrency(Math.abs(balance))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <UI.Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    icon={Icons.Trash}
                  >
                    Remove
                  </UI.Button>
                </div>

                {/* Member Stats */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3">
                    <p className="text-sm text-blue-600 dark:text-blue-400">Total Expenses</p>
                    <p className="text-lg font-semibold text-blue-900 dark:text-blue-200">
                      {formatCurrency(Array.isArray(memberExpenses) ? memberExpenses.reduce((sum: number, exp) => sum + exp.amount, 0) : 0)}
                    </p>
                  </div>
                  <div className={`rounded-lg p-3 ${
                    isNeutral
                      ? 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20'
                      : isPositive
                      ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
                      : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'
                  }`}>
                    <p className={`text-sm ${
                      isNeutral
                        ? 'text-gray-600 dark:text-gray-400'
                        : isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>Balance</p>
                    <p className={`text-lg font-semibold ${
                      isNeutral
                        ? 'text-gray-900 dark:text-gray-200'
                        : isPositive
                        ? 'text-green-900 dark:text-green-200'
                        : 'text-red-900 dark:text-red-200'
                    }`}>
                      {formatCurrency(Math.abs(balance))}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 flex flex-col">
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Status</p>
                    <UI.Badge 
                      variant={isNeutral ? 'secondary' : isPositive ? 'success' : 'warning'}
                    >
                      {isNeutral ? 'Settled' : isPositive ? 'Owed Money' : 'Owes Money'}
                    </UI.Badge>
                  </div>
                </div>
              </UI.Card>
            );
          })}
        </div>
      ) : (
        <UI.EmptyState
          icon={Icons.Users}
          title="No members yet"
          description="Add the first member to start tracking expenses and splitting bills"
          action={{
            label: "Add First Member",
            onClick: () => setIsAddingMember(true)
          }}
        />
      )}
    </div>
  );
};