/**
 * Form Management Hook
 * Centralized form state and validation management
 */
import { useState, useCallback } from 'react';
import { validateForm, ValidationSchema } from '@/lib/validation';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export const useForm = <T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  const validate = useCallback(() => {
    if (!validationSchema) return true;
    
    const validationErrors = validateForm(values, validationSchema);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validationSchema]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validate()) return false;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  return {
    values,
    errors,
    isSubmitting,
    isDirty,
    setValue,
    setFieldError,
    clearErrors,
    reset,
    validate,
    handleSubmit,
    // Helper function for creating field props
    getFieldProps: (field: keyof T) => ({
      value: String(values[field] || ''),
      onChange: (value: string) => setValue(field, value as T[keyof T]),
      error: errors[field]
    })
  };
};
