'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { generateId, validateEmail, calculateMemberBalance, getMemberExpenses, formatCurrency } from '@/utils';
import { Member } from '@/types';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Group Members
        </h2>
        <button
          onClick={() => setIsAddingMember(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Member
        </button>
      </div>

      {/* Add Member Form */}
      {isAddingMember && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
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
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={!newMember.name.trim()}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {currentGroup.members.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentGroup.members.map((member) => {
              const balance = calculateMemberBalance(member.id, currentGroup.expenses);
              const memberExpenses = getMemberExpenses(member.id, currentGroup.expenses);
              const isPositive = balance > 0;
              const isNeutral = Math.abs(balance) < 0.01;

              return (
                <div key={member.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-white">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </h3>
                        {member.email && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {member.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(memberExpenses)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                            <p className={`text-lg font-semibold ${
                              isNeutral
                                ? 'text-gray-500 dark:text-gray-400'
                                : isPositive
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {isNeutral ? 'Settled' : formatCurrency(Math.abs(balance))}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                        title="Remove member"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Member Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Expenses Paid</p>
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">
                        {currentGroup.expenses.filter(e => e.paidBy === member.id).length}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Involved In</p>
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">
                        {currentGroup.expenses.filter(e => e.participants.includes(member.id)).length}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <p className={`text-sm font-medium ${
                        isNeutral
                          ? 'text-gray-600 dark:text-gray-300'
                          : isPositive
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {isNeutral ? 'Settled' : isPositive ? 'Owed Money' : 'Owes Money'}
                      </p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No members yet
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Add the first member to start tracking expenses
            </p>
            <button
              onClick={() => setIsAddingMember(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add First Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
