'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { generateId } from '@/utils';
import { Group } from '@/types';

export const WelcomeScreen = () => {
  const { dispatch } = useApp();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <svg
              className="h-8 w-8 text-blue-600 dark:text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome to SplitBills
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Split expenses effortlessly with friends, roommates, and travel groups
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Group Name
              </label>
              <input
                id="group-name"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Weekend Trip, House Expenses"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                maxLength={50}
              />
            </div>
            
            <div>
              <label htmlFor="group-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description (Optional)
              </label>
              <textarea
                id="group-description"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Brief description of this group..."
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                maxLength={200}
              />
            </div>
          </div>

          <button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || isCreating}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            )}
            {isCreating ? 'Creating Group...' : 'Create Your First Group'}
          </button>
        </div>

        <div className="mt-8 space-y-4 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Features:</h3>
            <ul className="space-y-1">
              <li>✓ Add group members and track their expenses</li>
              <li>✓ Split bills equally or customize shares</li>
              <li>✓ See who owes whom at a glance</li>
              <li>✓ Export expense summaries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
