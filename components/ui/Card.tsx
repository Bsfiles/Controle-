
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-surface rounded-lg shadow-md p-6 border border-gray-200 dark:border-border-dark ${className}`}>
      {children}
    </div>
  );
};

export default Card;