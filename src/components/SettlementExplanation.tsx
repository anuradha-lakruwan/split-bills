import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { generateSettlementExplanation, type CalculationStep } from '@/utils/settlementExplanation';
import { formatCurrency } from '@/utils';
import { Icons } from './Icons';
import { Card, Button, Badge } from './UI';

export const SettlementExplanation = () => {
  const { state } = useApp();
  const { currentGroup } = state;
  const [isOpen, setIsOpen] = useState(false);

  if (!currentGroup || currentGroup.expenses.length === 0) return null;

  const explanation = generateSettlementExplanation(
    currentGroup.members,
    currentGroup.expenses,
    currentGroup.paidSettlements || []
  );

  const getStepIcon = (type: CalculationStep['type']) => {
    switch (type) {
      case 'expense_analysis':
        return Icons.Receipt;
      case 'balance_calculation':
        return Icons.Calculator;
      case 'settlement_optimization':
        return Icons.ArrowRight;
      case 'final_result':
        return Icons.Check;
      default:
        return Icons.Sparkles;
    }
  };

  const getStepColor = (type: CalculationStep['type']) => {
    switch (type) {
      case 'expense_analysis':
        return 'from-blue-500 to-blue-600';
      case 'balance_calculation':
        return 'from-green-500 to-green-600';
      case 'settlement_optimization':
        return 'from-purple-500 to-purple-600';
      case 'final_result':
        return 'from-emerald-500 to-emerald-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icons.Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            How Settlements Work
          </h3>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={isOpen ? Icons.ChevronUp : Icons.ChevronDown}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Hide' : 'Show'} Calculation
        </Button>
      </div>

      {/* Explanation Panel */}
      {isOpen && (
        <Card className="animate-fade-in-up">
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {explanation.summary.totalExpenses.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Expenses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {explanation.summary.totalMembers}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {explanation.summary.totalSettlements}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Settlements</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.abs(explanation.summary.balanceCheckSum) < 0.01 ? '✓' : '⚠️'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Balance Check</p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {explanation.steps.map((step, index) => {
                const Icon = getStepIcon(step.type);
                const colorClass = getStepColor(step.type);
                
                return (
                  <div 
                    key={step.id} 
                    className="flex items-start space-x-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Step Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </h4>
                        <Badge variant="secondary" size="sm">
                          Step {index + 1}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {step.description}
                      </p>

                      {/* Step Details */}
                      {step.details && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                          {step.details.calculation && (
                            <div className="flex items-center space-x-2">
                              <Icons.Calculator className="w-4 h-4 text-gray-500" />
                              <code className="text-xs font-mono text-gray-700 dark:text-gray-300">
                                {step.details.calculation}
                              </code>
                            </div>
                          )}
                          
                          {step.details.member && step.details.amount !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {step.details.member}
                              </span>
                              <span className={`text-xs font-bold ${
                                step.details.amount >= 0 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {step.details.amount >= 0 ? '+' : ''}{formatCurrency(step.details.amount)}
                              </span>
                            </div>
                          )}

                          {step.details.fromAmount && step.details.toAmount && (
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              <span>Debtor owes: {formatCurrency(step.details.fromAmount)}</span>
                              <span className="mx-2">•</span>
                              <span>Creditor is owed: {formatCurrency(step.details.toAmount)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-2">
                <Icons.Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    How It Works
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Our algorithm calculates who paid what and who owes what, then creates the minimum number of 
                    transactions needed to settle all debts. This reduces the complexity from everyone paying 
                    everyone else to just a few optimized payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
