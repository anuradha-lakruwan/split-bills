/**
 * Application Constants
 * Centralized constants for consistent styling and behavior
 */

// Animation class names for consistent usage
export const ANIMATIONS = {
  fadeIn: 'animate-fadeIn',
  slideIn: 'animate-slideIn', 
  scaleIn: 'animate-scaleIn',
  bounceLight: 'animate-bounce-light',
  float: 'animate-float',
  glow: 'animate-glow',
  shimmer: 'animate-shimmer'
} as const;

// Color schemes for consistent theming
export const COLORS = {
  gradients: {
    primary: 'from-blue-600 to-purple-600',
    success: 'from-green-600 to-emerald-600',
    warning: 'from-yellow-500 to-orange-500',
    danger: 'from-red-600 to-pink-600',
    neutral: 'from-blue-50 to-blue-100'
  },
  status: {
    positive: 'green',
    negative: 'red', 
    neutral: 'blue'
  }
} as const;

// Form validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  unique: 'This value already exists',
  minLength: (min: number) => `Minimum ${min} characters required`,
  maxLength: (max: number) => `Maximum ${max} characters allowed`
} as const;

// Common component sizes
export const SIZES = {
  button: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm', 
    lg: 'px-6 py-4 text-base'
  },
  avatar: {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl'
  },
  card: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
} as const;

// Z-index layers for consistent layering
export const Z_INDEX = {
  dropdown: 50,
  modal: 100,
  tooltip: 150,
  toast: 200
} as const;
