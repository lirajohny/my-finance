import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

type AlertVariant = 'success' | 'danger' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ 
  variant, 
  children, 
  dismissible = false, 
  onDismiss,
  className = ''
}) => {
  // Define as classes com base na variante
  const variantClasses = {
    success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-500',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-500',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-500',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-500'
  };

  // Define o ícone com base na variante
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'danger':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-start p-4 border-l-4 rounded-md ${variantClasses[variant]} ${className}`}>
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1">
        {children}
      </div>
      {dismissible && onDismiss && (
        <button
          type="button"
          className="flex-shrink-0 ml-3 -mt-1 -mr-1 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={onDismiss}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
