import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable Card Component
 *
 * A container component with optional title and description
 */
export default function Card({ title, description, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      {children}
    </div>
  );
}
