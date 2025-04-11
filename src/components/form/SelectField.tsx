import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  variant?: 'default' | 'flat';
}

const SelectField: React.FC<SelectFieldProps> = ({ 
  label, 
  error, 
  hint,
  options,
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
      <select
        id={inputId}
        name={name}
        className={`
          w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          ${variantClasses[variant]}
          ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500' : ''}
          bg-white dark:bg-gray-700 dark:text-white
          ${className}
        `}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(hint || error) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
};

export default SelectField;
