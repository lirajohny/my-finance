import React, { useState, useEffect } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

// Configura o dayjs para usar o locale pt-br
dayjs.locale('pt-br');

interface DatePickerFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  value: Date | string;
  onChange: (date: Date) => void;
  id?: string;
  name?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ 
  label, 
  error, 
  hint,
  value,
  onChange,
  id,
  name,
  className = '',
  placeholder = 'Selecione uma data',
  disabled = false
}) => {
  const [dateValue, setDateValue] = useState<string>('');
  const inputId = id || name || Math.random().toString(36).substring(2, 9);

  // Atualiza o valor do input quando a prop value mudar
  useEffect(() => {
    if (value) {
      const date = typeof value === 'string' ? new Date(value) : value;
      setDateValue(dayjs(date).format('YYYY-MM-DD'));
    } else {
      setDateValue('');
    }
  }, [value]);

  // Manipula a mudança no input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDateValue(newValue);
    
    if (newValue) {
      const date = new Date(newValue);
      onChange(date);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="date"
          id={inputId}
          name={name}
          className={`
            w-full pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            border border-gray-300 dark:border-gray-600 rounded-lg
            ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500' : ''}
            dark:bg-gray-700 dark:text-white
            ${className}
          `}
          value={dateValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      {(hint || error) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
};

export default DatePickerField;
