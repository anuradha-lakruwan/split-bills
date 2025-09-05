'use client';

import { useApp } from '@/context/AppContext';
import { formatCurrency, calculateMemberBalance } from '@/utils';
import { useSettlement } from '@/hooks/useSettlement';

export const SettlementsPanel = () => {
  const { state, calculateSettlements } = useApp();
  const { currentGroup } = state;
  const { markSettlementAsPaid } = useSettlement();

  if (!currentGroup) return null;

  const settlements = calculateSettlements();
  const memberBalances = currentGroup.members.map(member => ({
    member,
    balance: calculateMemberBalance(member.id, currentGroup.expenses)
  }));

  const creditors = memberBalances.filter(mb => mb.balance > 0.01);
  const debtors = memberBalances.filter(mb => mb.balance < -0.01);
  const settled = memberBalances.filter(mb => Math.abs(mb.balance) <= 0.01);

  const exportSettlements = () => {
    const data = settlements.map(settlement => {
      const fromMember = currentGroup.members.find(m => m.id === settlement.from);
      const toMember = currentGroup.members.find(m => m.id === settlement.to);
      return {
        from: fromMember?.name,
        to: toMember?.name,
        amount: settlement.amount
      };
    });

    const csvContent = "data:text/csv;charset=utf-8," + 
      "From,To,Amount\n" +
      data.map(row => `${row.from},${row.to},${row.amount}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentGroup.name}-settlements.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (currentGroup.expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No settlements needed
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add some expenses first to see who owes whom.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settlements
        </h2>
        {settlements.length > 0 && (
          <button
            onClick={exportSettlements}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        )}
      </div>

      {settlements.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            All settled up! 🎉
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No one owes anyone money in this group.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Settlement Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Settlement Instructions
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>Follow these payments to settle all debts in the group:</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settlements List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
            {settlements.map((settlement, index) => {
              const fromMember = currentGroup.members.find(m => m.id === settlement.from);
              const toMember = currentGroup.members.find(m => m.id === settlement.to);

              return (
                <div key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-red-600 dark:text-red-300">
                            {fromMember?.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {fromMember?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Owes</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-600 dark:text-green-300">
                            {toMember?.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {toMember?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Receives</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(settlement.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center transition-colors"
                      onClick={() => markSettlementAsPaid(settlement)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as paid
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* People who are owed money */}
        {creditors.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-green-600 dark:text-green-400">
                Should Receive
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {creditors.map(({ member, balance }) => (
                <div key={member.id} className="px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-green-600 dark:text-green-300">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    +{formatCurrency(balance)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* People who owe money */}
        {debtors.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-red-600 dark:text-red-400">
                Should Pay
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {debtors.map(({ member, balance }) => (
                <div key={member.id} className="px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-red-600 dark:text-red-300">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(Math.abs(balance))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* People who are settled */}
        {settled.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
                Settled Up
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {settled.map(({ member }) => (
                <div key={member.id} className="px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    ✓ Settled
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
