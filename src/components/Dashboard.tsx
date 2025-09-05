'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { GroupSelector } from './GroupSelector';
import { GroupOverview } from './GroupOverview';
import { MembersPanel } from './MembersPanel';
import { ExpensesPanel } from './ExpensesPanel';
import { SettlementsPanel } from './SettlementsPanel';

type ActiveTab = 'overview' | 'members' | 'expenses' | 'settlements';

export const Dashboard = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  if (!state.currentGroup && state.groups.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GroupSelector />
      </div>
    );
  }

  if (!state.currentGroup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No group selected</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'members', name: 'Members', icon: '👥' },
    { id: 'expenses', name: 'Expenses', icon: '💰' },
    { id: 'settlements', name: 'Settlements', icon: '⚖️' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                SplitBills
              </h1>
              <div className="hidden sm:block">
                <GroupSelector />
              </div>
            </div>
            <div className="sm:hidden">
              <GroupSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && <GroupOverview />}
        {activeTab === 'members' && <MembersPanel />}
        {activeTab === 'expenses' && <ExpensesPanel />}
        {activeTab === 'settlements' && <SettlementsPanel />}
      </main>
    </div>
  );
};
