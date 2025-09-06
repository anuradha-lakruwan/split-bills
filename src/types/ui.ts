/**
 * UI Component Type Definitions
 * Centralized type definitions for UI components
 */

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type CardPadding = 'sm' | 'md' | 'lg';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface IconProps {
  className?: string;
  size?: number;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentType<IconProps>;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends BaseComponentProps {
  hover?: boolean;
  padding?: CardPadding;
  gradient?: boolean;
}

export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
  member?: { id: string; name: string };
  allMembers?: { id: string; name: string }[];
}

export interface EmptyStateProps {
  icon?: React.ComponentType<IconProps>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  className?: string;
}
