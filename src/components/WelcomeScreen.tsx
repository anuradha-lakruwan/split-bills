'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { generateId } from '@/utils';
import { Group } from '@/types';
import { Icons } from './Icons';

export const WelcomeScreen = () => {
  const { dispatch } = useApp();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const features = [
    {
      icon: "👥",
      title: "Add group members",
      description: "Invite friends and track their expenses"
    },
    {
      icon: "💰",
      title: "Split bills equally",
      description: "Or customize shares for different amounts"
    },
    {
      icon: "📊",
      title: "See who owes whom",
      description: "Clear overview of all balances"
    },
    {
      icon: "📈",
      title: "Export summaries",
      description: "Download expense reports anytime"
    }
  ];

  // Cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;

    setIsCreating(true);
    
    const newGroup: Group = {
      id: generateId(),
      name: groupName.trim(),
      description: groupDescription.trim(),
      members: [],
      expenses: [],
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_GROUP', payload: newGroup });
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <div className="text-center animate-fadeIn mb-12">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg animate-bounce-light mb-8">
            <Icons.CreditCard className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Welcome to SplitBills
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Split expenses effortlessly with friends, roommates, and travel groups
          </p>
        </div>

        {/* Feature showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slideIn">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`card card-interactive p-6 text-center transition-all duration-500 ${
                index === currentStep ? 'animate-glow scale-105' : ''
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="text-4xl mb-4 animate-bounce-light" style={{animationDelay: `${index * 0.2}s`}}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto space-y-8 animate-scaleIn">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Create Your First Group
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Name
                </label>
                <input
                  id="group-name"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Weekend Trip, House Expenses"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                  maxLength={50}
                />
              </div>
              
              <div>
                <label htmlFor="group-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="group-description"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Brief description of this group..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all resize-none"
                  maxLength={200}
                />
              </div>

              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || isCreating}
                className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <Icons.Spinner className="mr-3" />
                    Creating Group...
                  </>
                ) : (
                  <>
                    <Icons.Plus className="mr-3" />
                    Create Your First Group
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
