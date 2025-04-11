import React from 'react';

interface CheckboxFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  hint?: string;
  error?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ 
  label, 
  hint, 
  error,
  className = '',
  id,
  name = id,
  ...rest
}) => {
  const inputId = id || name || Math.random().toString(36).substring(2, 9);

  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={inputId}
          name={name}
          className={`
            h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...rest}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={inputId} className="font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {(hint || error) && (
          <p className={`mt-1 ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {error || hint}
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckboxField;
