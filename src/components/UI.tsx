'use client';

import React from 'react';
import Image from 'next/image';
import { Icons } from './Icons';
import { cn } from '@/utils';
import type { 
  ButtonProps, 
  CardProps, 
  BadgeProps, 
  AvatarProps, 
  EmptyStateProps 
} from '@/types/ui';

// ButtonProps imported from @/types/ui

/**
 * Optimized Button Component with variant-based styling
 */
export const Button: React.FC<ButtonProps & { children: React.ReactNode }> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  icon: IconComponent,
  className = '',
  type = 'button',
}) => {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 hover:scale-105',
    secondary: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-md hover:shadow-lg focus:ring-gray-500',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500 hover:scale-105',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500 hover:scale-105',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500 hover:scale-105',
  } as const;

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  } as const;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 transform active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {loading ? (
        <Icons.Spinner className="w-5 h-5 mr-2" />
      ) : IconComponent ? (
        <IconComponent className="w-5 h-5 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

/**
 * Optimized Card Component with conditional styling
 */
export const Card: React.FC<CardProps & { children: React.ReactNode }> = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  gradient = false
}) => {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  } as const;

  return (
    <div className={cn(
      'rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300',
      gradient 
        ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900' 
        : 'bg-white dark:bg-gray-800',
      hover && 'hover:shadow-2xl hover:scale-[1.02] cursor-pointer',
      paddingStyles[padding],
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Badge Component with variant-based styling
 */
export const Badge: React.FC<BadgeProps & { children: React.ReactNode }> = ({ 
  children, 
  variant = 'primary', 
  size = 'sm',
  className = '' 
}) => {
  const variantStyles = {
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  } as const;

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  } as const;

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full',
      variantStyles[variant],
      sizeStyles[size],
      className
    )}>
      {children}
    </span>
  );
};

/**
 * Avatar Component with automatic color generation
 */
export const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  src, 
  size = 'md', 
  className = '' 
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  } as const;

  const gradientColors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600', 
    'from-yellow-500 to-orange-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-pink-600',
  ] as const;

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colorIndex = name.charCodeAt(0) % gradientColors.length;

  const baseStyles = cn(
    sizeStyles[size],
    'rounded-full ring-2 ring-white dark:ring-gray-800 shadow-lg',
    className
  );

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={80}
        height={80}
        className={cn(baseStyles, 'object-cover')}
      />
    );
  }

  return (
    <div className={cn(
      baseStyles,
      'bg-gradient-to-br',
      gradientColors[colorIndex],
      'flex items-center justify-center font-semibold text-white'
    )}>
      {initials}
    </div>
  );
};

/**
 * Loading Spinner Component
 */
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
  } as const;

  return (
    <div className={cn(sizeStyles[size], className)}>
      <Icons.Spinner className="w-full h-full" />
    </div>
  );
};

/**
 * Progress Bar Component with color variants
 */
export const ProgressBar: React.FC<{
  progress: number;
  className?: string;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}> = ({ progress, className = '', showLabel = false, color = 'blue' }) => {
  const colorStyles = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600', 
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
  } as const;

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      <div className="progress-bar h-2">
        <div 
          className={cn('progress-fill bg-gradient-to-r', colorStyles[color])}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
};

/**
 * Empty State Component with optional action
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: IconComponent = Icons.Sparkles,
  title,
  description,
  action,
  className = '',
}) => (
  <div className={cn('text-center py-12', className)}>
    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-4 animate-bounce-light">
      <IconComponent className="w-8 h-8 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    {description && (
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
    )}
    {action && (
      <Button onClick={action.onClick} icon={Icons.Plus}>
        {action.label}
      </Button>
    )}
  </div>
);

/**
 * Skeleton Loading Component
 */
export const Skeleton: React.FC<{
  className?: string;
  lines?: number;
}> = ({ className = '', lines = 1 }) => (
  <div className={className}>
    {Array.from({ length: lines }, (_, i) => (
      <div 
        key={i} 
        className="skeleton h-4 mb-2 last:mb-0"
        style={{ width: `${Math.random() * 40 + 60}%` }}
      />
    ))}
  </div>
);

// Export all components
export const UI = {
  Button,
  Card,
  Badge,
  Avatar,
  LoadingSpinner,
  ProgressBar,
  EmptyState,
  Skeleton,
};
