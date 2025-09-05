/**
 * Form Validation Utilities
 * Centralized validation logic with proper error handling
 */

export type ValidationRule<T> = (value: T) => string | undefined;

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

/**
 * Validates a single field against multiple rules
 */
export const validateField = <T>(value: T, rules: ValidationRule<T>[]): string | undefined => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return undefined;
};

/**
 * Validates an entire form against a schema
 */
export const validateForm = <T extends Record<string, unknown>>(
  data: T,
  schema: ValidationSchema<T>
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};
  
  Object.keys(schema).forEach((key) => {
    const fieldKey = key as keyof T;
    const rules = schema[fieldKey];
    if (rules) {
      const error = validateField(data[fieldKey], rules);
      if (error) errors[fieldKey] = error;
    }
  });
  
  return errors;
};

// Common validation rules
export const validationRules = {
  required: <T>(message = 'This field is required'): ValidationRule<T> => 
    (value) => (!value || (typeof value === 'string' && !value.trim())) ? message : undefined,
    
  email: (message = 'Please enter a valid email address'): ValidationRule<string> =>
    (value) => value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? message : undefined,
    
  minLength: (min: number, message?: string): ValidationRule<string> =>
    (value) => value && value.length < min ? message || `Minimum ${min} characters required` : undefined,
    
  maxLength: (max: number, message?: string): ValidationRule<string> =>
    (value) => value && value.length > max ? message || `Maximum ${max} characters allowed` : undefined,
    
  unique: <T>(items: T[], key: keyof T, currentId?: string, message = 'This value already exists'): ValidationRule<string> =>
    (value) => {
      if (!value) return undefined;
      const exists = items.some(item => 
        item[key] === value && (currentId ? (item as { id: string }).id !== currentId : true)
      );
      return exists ? message : undefined;
    }
};
