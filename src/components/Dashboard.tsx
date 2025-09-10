'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { GroupSelector } from './GroupSelector';
import { GroupOverview } from './GroupOverview';
import { MembersPanel } from './MembersPanel';
import { ExpensesPanel } from './ExpensesPanel';
import { SettlementsPanel } from './SettlementsPanel';
import { Icons } from './Icons';
import { ThemeToggle } from './ThemeToggle';

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
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: Icons.Dashboard,
      color: 'text-blue-600 border-blue-500'
    },
    { 
      id: 'members', 
      name: 'Members', 
      icon: Icons.Users,
      color: 'text-green-600 border-green-500'
    },
    { 
      id: 'expenses', 
      name: 'Expenses', 
      icon: Icons.CreditCard,
      color: 'text-purple-600 border-purple-500'
    },
    { 
      id: 'settlements', 
      name: 'Settlements', 
      icon: Icons.Calculator,
      color: 'text-orange-600 border-orange-500'
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md dark:bg-gray-800/80 shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40 animate-slideIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-glow">
                  <Icons.CreditCard className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SplitBills
                </h1>
              </div>
              <div className="hidden sm:block">
                <GroupSelector />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle variant="icon" />
              <div className="sm:hidden">
                <GroupSelector />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    isActive
                      ? `${tab.color} dark:text-blue-400`
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  } whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm transition-all duration-300 flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg group`}
                >
                  <IconComponent className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'animate-bounce-light' : ''}`} />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fadeIn">
          {activeTab === 'overview' && <GroupOverview />}
          {activeTab === 'members' && <MembersPanel />}
          {activeTab === 'expenses' && <ExpensesPanel />}
          {activeTab === 'settlements' && <SettlementsPanel />}
        </div>
      </main>
    </div>
  );
};
