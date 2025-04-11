import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'default' | 'flat';
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  error, 
  hint,
  startIcon,
  endIcon,
  variant = 'default',
  className = '',
  id,
  name = id,
  ...rest
}) => {
  const variantClasses = {
    default: 'border border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary rounded-lg',
    flat: 'bg-gray-100 dark:bg-gray-700 border-0 focus:bg-transparent dark:focus:bg-transparent rounded-lg'
  };

  const inputId = id || name || Math.random().toString(36).substring(2, 9);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">{startIcon}</span>
          </div>
        )}
        <input
          id={inputId}
          name={name}
          className={`
            w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${variantClasses[variant]}
            ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500' : ''}
            ${startIcon ? 'pl-10' : ''}
            ${endIcon ? 'pr-10' : ''}
            dark:bg-gray-700 dark:text-white
            ${className}
          `}
          {...rest}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-gray-500 dark:text-gray-400">{endIcon}</span>
          </div>
        )}
      </div>
      {(hint || error) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
};

export default InputField;
