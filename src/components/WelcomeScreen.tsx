'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { generateId } from '@/utils';
import { Group } from '@/types';
import { Icons } from './Icons';
import { Card, Button } from './UI';
import { ThemeToggle } from './ThemeToggle';

export const WelcomeScreen = () => {
  const { dispatch } = useApp();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const features = [
    {
      icon: Icons.Users,
      title: "Add Members",
      description: "Invite friends instantly",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Icons.Calculator,
      title: "Split Bills",
      description: "Smart & fair splitting",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Icons.TrendingUp,
      title: "Track Balances",
      description: "See who owes what",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Icons.Receipt,
      title: "Export Reports",
      description: "Download summaries",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const steps = [
    {
      icon: Icons.Plus,
      title: "Create Group",
      description: "Start with a group name"
    },
    {
      icon: Icons.Users,
      title: "Add Friends",
      description: "Invite your squad"
    },
    {
      icon: Icons.CreditCard,
      title: "Add Expenses",
      description: "Track your spending"
    },
    {
      icon: Icons.Calculator,
      title: "Split & Settle",
      description: "Fair shares for everyone"
    }
  ];

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;

    setIsCreating(true);
    
    const newGroup: Group = {
      id: generateId(),
      name: groupName.trim(),
      description: groupDescription.trim(),
      members: [],
      expenses: [],
      paidSettlements: [],
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_GROUP', payload: newGroup });
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Theme Toggle - Fixed Position */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle variant="icon" />
      </div>

      {/* Modern Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-float [animation-delay:2s]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-float [animation-delay:4s]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/25 mb-8 animate-bounce-light">
            <Icons.Calculator className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Split Bills
            </span>
            <br />
            <span className="text-gray-800 dark:text-white">Made Simple</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Track expenses, split bills fairly, and settle up effortlessly with friends, roommates, and travel groups
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index}
              hover 
              gradient
              className={`text-center group animate-slide-in-up [animation-delay:${index * 0.1}s]`}
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get started in 4 simple steps
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col lg:flex-row items-center">
                {/* Step Card */}
                <div className={`text-center animate-fade-in-up [animation-delay:${0.5 + index * 0.1}s] px-4`}>
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-4 border-blue-100 dark:border-blue-900 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                      <step.icon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-xl">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-40 mx-auto leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow (except for last item) */}
                {index < steps.length - 1 && (
                  <div className={`flex-shrink-0 animate-fade-in-up [animation-delay:${0.6 + index * 0.1}s]`}>
                    {/* Mobile: Down Arrow */}
                    <div className="lg:hidden mx-auto my-6">
                      <div className="w-14 h-14 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl animate-pulse-subtle">
                        <Icons.ChevronDown className="w-6 h-6 text-white animate-bounce" />
                      </div>
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-300 to-purple-300 mx-auto mt-2 rounded-full opacity-60"></div>
                    </div>
                    
                    {/* Desktop: Right Arrow */}
                    <div className="hidden lg:block mx-8">
                      <div className="flex items-center">
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-60"></div>
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 animate-pulse-subtle mx-2">
                          <Icons.ArrowRight className="w-6 h-6 text-white" />
                        </div>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-60"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Get Started Section */}
        <div className="max-w-md mx-auto animate-slide-in-up [animation-delay:0.8s]">
          <Card gradient className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <Icons.Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Get Started Now
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create your first group and start splitting!
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name (e.g., Weekend Trip)"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                  maxLength={50}
                />
              </div>
              
              <div>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all resize-none"
                  maxLength={200}
                />
              </div>

              <Button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || isCreating}
                variant="primary"
                size="lg"
                icon={isCreating ? Icons.Spinner : Icons.Plus}
                loading={isCreating}
                className="w-full"
              >
                {isCreating ? 'Creating Group...' : 'Create My Group'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
