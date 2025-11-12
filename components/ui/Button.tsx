import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary text-dark hover:bg-primary-hover focus:ring-primary',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-surface dark:text-text-main-dark dark:hover:bg-border-dark dark:hover:border-primary focus:ring-gray-500 border border-gray-300 dark:border-border-dark',
    danger: 'bg-danger text-white hover:opacity-90 focus:ring-danger',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
    </button>
  );
};