/**
 * Form Components
 * Reusable form components with built-in validation
 */
'use client';

import React from 'react';
import { FormFieldProps } from '@/types/ui';
import { cn } from '@/utils';

/**
 * Form Field Component with built-in validation styling
 */
export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  maxLength,
  className = '',
}) => (
  <div className={cn('space-y-1', className)}>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={cn(
        'w-full px-3 py-2 border rounded-md shadow-sm text-sm',
        'focus:outline-none focus:ring-blue-500 focus:border-blue-500',
        'dark:bg-gray-700 dark:text-white',
        error 
          ? 'border-red-300 dark:border-red-500' 
          : 'border-gray-300 dark:border-gray-600'
      )}
    />
    {error && (
      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
    )}
  </div>
);

/**
 * Form Container Component
 */
export const Form: React.FC<{
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}> = ({ children, onSubmit, className = '' }) => (
  <form onSubmit={onSubmit} className={cn('space-y-4', className)}>
    {children}
  </form>
);

/**
 * Form Actions Component
 */
export const FormActions: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={cn('flex justify-end space-x-3 pt-4', className)}>
    {children}
  </div>
);
