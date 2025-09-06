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
    // Calculate net balance (what they owe or are owed)
    const netBalance = calculateMemberBalance(member.id, currentGroup.expenses, currentGroup.paidSettlements || []);
    
    // Calculate total amount this member has actually paid out
    const amountPaid = getMemberExpenses(member.id, currentGroup.expenses);
    
    // Calculate how much they owe (only if negative balance)
    const amountOwes = netBalance < 0 ? Math.abs(netBalance) : 0;
    
    // Determine status
    const isNeutral = Math.abs(netBalance) < 0.01;
    const isPositive = netBalance > 0;
    
    const variant: BadgeVariant = isNeutral ? 'secondary' : isPositive ? 'success' : 'warning';
    
    return {
      amountPaid,
      amountOwes,
      netBalance, // Keep for internal calculations
      status: {
        variant,
        label: isNeutral ? 'Settled Up' : isPositive ? `Owed ${formatCurrency(netBalance)}` : `Owes ${formatCurrency(Math.abs(netBalance))}`,
        color: isNeutral ? 'blue' : isPositive ? 'green' : 'red'
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
        <UI.Button 
          onClick={() => setIsAddingMember(true)} 
          icon={Icons.Plus}
          className="shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Add Member
        </UI.Button>
      </div>

      {/* Add Member Form */}
      {isAddingMember && (
        <UI.Card className={ANIMATIONS.slideIn} gradient>
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <Icons.Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Member</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add someone to your expense group</p>
            </div>
          </div>
          
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
                    <UI.Avatar 
                      name={member.name} 
                      size="lg" 
                      member={member}
                      allMembers={currentGroup.members}
                    />
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
                    <p className="text-sm text-blue-600 dark:text-blue-400">Amount Contributed</p>
                    <p className="text-lg font-semibold text-blue-900 dark:text-blue-200">
                      {formatCurrency(stats.amountPaid)}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-3">
                    <p className="text-sm text-orange-600 dark:text-orange-400">Amount Owes</p>
                    <p className="text-lg font-semibold text-orange-900 dark:text-orange-200">
                      {stats.amountOwes > 0 ? formatCurrency(stats.amountOwes) : '$0.00'}
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