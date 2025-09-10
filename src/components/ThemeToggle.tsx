'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Icons } from './Icons';
import { Button } from './UI';

export const ThemeToggle: React.FC<{ className?: string; variant?: 'icon' | 'button' }> = ({ 
  className = '', 
  variant = 'icon' 
}) => {
  const { theme, actualTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    if (theme === 'system') {
      return actualTheme === 'dark' ? Icons.Moon : Icons.Sun;
    }
    return theme === 'dark' ? Icons.Moon : Icons.Sun;
  };

  const getLabel = () => {
    if (theme === 'system') return `Auto (${actualTheme === 'dark' ? 'Dark' : 'Light'})`;
    return theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  };

  const getTooltip = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
    return `Switch to ${next} mode`;
  };

  const IconComponent = getIcon();

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          relative p-2 rounded-lg transition-all duration-300 
          bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
          text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100
          border border-gray-200 dark:border-gray-600
          hover:shadow-lg active:scale-95 transform hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          group
          ${className}
        `}
        title={getTooltip()}
        aria-label={getTooltip()}
      >
        <IconComponent className="w-5 h-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
        {theme === 'system' && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        )}
      </button>
    );
  }

  return (
    <Button
      variant="secondary"
      onClick={toggleTheme}
      className={`min-w-[120px] justify-center ${className}`}
      icon={IconComponent}
    >
      {getLabel()}
    </Button>
  );
};
