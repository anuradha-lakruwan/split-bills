'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { generateId, calculateMemberBalance, getMemberExpenses, formatCurrency } from '@/utils';
import { validationRules } from '@/lib/validation';
import { useForm } from '@/hooks/useForm';
import { ANIMATIONS } from '@/lib/constants';
import type { Member } from '@/types';
import type { BadgeVariant } from '@/types/ui';
import { UI } from './UI';
import { Icons } from './Icons';
import { FormField, Form, FormActions } from './ui/Form';

/**
 * Optimized Members Panel with centralized form management
 */
export const MembersPanel = () => {
  const { state, dispatch } = useApp();
  const { currentGroup } = state;
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Centralized form management with validation
  const memberForm = useForm({
    initialValues: { name: '', email: '' },
    validationSchema: useMemo(() => ({
      name: [
        validationRules.required(),
        validationRules.unique(currentGroup?.members || [], 'name', undefined, 'Member already exists')
      ],
      email: [validationRules.email()]
    }), [currentGroup?.members]),
    onSubmit: async (values) => {
      if (!currentGroup) return;
      
      const member: Member = {
        id: generateId(),
        name: values.name.trim(),
        email: values.email.trim() || undefined,
      };
      
      dispatch({ type: 'ADD_MEMBER', payload: { groupId: currentGroup.id, member } });
      memberForm.reset();
      setIsAddingMember(false);
    }
  });

  if (!currentGroup) return null;

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Remove member and all their expenses?')) {
      dispatch({ type: 'REMOVE_MEMBER', payload: { groupId: currentGroup.id, memberId } });
    }
  };

  // Optimized member stats calculator
  const getMemberStats = (member: Member) => {
    const balance = calculateMemberBalance(member.id, currentGroup.expenses, currentGroup.paidSettlements || []);
    const expenses = getMemberExpenses(member.id, currentGroup.expenses);
    const totalExpenses = Array.isArray(expenses) ? expenses.reduce((sum, exp) => sum + exp.amount, 0) : 0;
    const isNeutral = Math.abs(balance) < 0.01;
    const isPositive = balance > 0;
    
    const variant: BadgeVariant = isNeutral ? 'secondary' : isPositive ? 'success' : 'warning';
    
    return {
      balance,
      totalExpenses,
      status: {
        variant,
        label: isNeutral ? 'Settled' : isPositive ? 'Owed Money' : 'Owes Money',
        color: isNeutral ? 'gray' : isPositive ? 'green' : 'red'
      }
    };
  };

  return (
    <div className={`space-y-6 ${ANIMATIONS.fadeIn}`}>
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
        <UI.Card className={ANIMATIONS.slideIn} gradient>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Icons.Plus className="mr-2 text-green-600" />
            Add New Member
          </h3>
          
          <Form onSubmit={memberForm.handleSubmit}>
            <FormField
              id="member-name"
              label="Name"
              required
              placeholder="Enter member name"
              maxLength={50}
              {...memberForm.getFieldProps('name')}
            />

            <FormField
              id="member-email"
              label="Email"
              type="email"
              placeholder="Enter email address (optional)"
              {...memberForm.getFieldProps('email')}
            />

            <FormActions>
              <UI.Button 
                variant="secondary" 
                onClick={() => {
                  memberForm.reset();
                  setIsAddingMember(false);
                }}
              >
                Cancel
              </UI.Button>
              <UI.Button 
                type="submit"
                disabled={!memberForm.values.name.trim() || memberForm.isSubmitting}
                loading={memberForm.isSubmitting}
                icon={Icons.Check}
              >
                Add Member
              </UI.Button>
            </FormActions>
          </Form>
        </UI.Card>
      )}

      {/* Members List */}
      {currentGroup.members.length > 0 ? (
        <div className="space-y-4">
          {currentGroup.members.map((member) => {
            const stats = getMemberStats(member);
            return (
              <UI.Card key={member.id} hover className={ANIMATIONS.slideIn}>
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
                        <span className={`font-semibold text-${stats.status.color}-600 dark:text-${stats.status.color}-400`}>
                          {Math.abs(stats.balance) < 0.01 ? 'Settled' : formatCurrency(Math.abs(stats.balance))}
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
                      {formatCurrency(stats.totalExpenses)}
                    </p>
                  </div>
                  
                  <div className={`rounded-lg p-3 bg-gradient-to-br from-${stats.status.color}-50 to-${stats.status.color}-100 dark:from-${stats.status.color}-900/20 dark:to-${stats.status.color}-800/20`}>
                    <p className={`text-sm text-${stats.status.color}-600 dark:text-${stats.status.color}-400`}>Balance</p>
                    <p className={`text-lg font-semibold text-${stats.status.color}-900 dark:text-${stats.status.color}-200`}>
                      {formatCurrency(Math.abs(stats.balance))}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 flex flex-col">
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Status</p>
                    <UI.Badge variant={stats.status.variant}>
                      {stats.status.label}
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