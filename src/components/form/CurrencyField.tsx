import React, { useState, useEffect, useRef } from 'react';

interface CurrencyFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  id?: string;
  name?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  prefix?: string;
  required?: boolean;
}

const CurrencyField: React.FC<CurrencyFieldProps> = ({ 
  label, 
  error, 
  hint,
  value,
  onChange,
  id,
  name,
  className = '',
  placeholder = '0,00',
  disabled = false,
  prefix = 'R$'
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || name || Math.random().toString(36).substring(2, 9);
  
  // Atualiza o valor do input quando a prop value mudar
  useEffect(() => {
    if (value !== undefined) {
      // Só atualize o input se ele não estiver com foco
      if (document.activeElement !== inputRef.current) {
        setInputValue(formatForDisplay(value));
      }
    } else {
      setInputValue('');
    }
  }, [value]);
  
  // Formata o valor para exibição
  const formatForDisplay = (value: number): string => {
    return `${prefix} ${value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Converte string para número
  const parseValue = (value: string): number => {
    // Remove todos os caracteres não numéricos, exceto vírgula e ponto
    const cleanValue = value.replace(/[^0-9.,]/g, '');
    // Substitui vírgula por ponto para conversão correta
    const normalizedValue = cleanValue.replace(',', '.');
    // Converte para número
    return parseFloat(normalizedValue) || 0;
  };

  // Manipula a mudança no input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Remove o prefixo se existir para processar apenas o número
    const valueWithoutPrefix = newValue.replace(prefix, '').trim();
    
    // Processa apenas se houver algum valor
    if (valueWithoutPrefix) {
      const numericValue = parseValue(valueWithoutPrefix);
      onChange(numericValue);
    } else {
      onChange(0);
    }
  };

  // Manipula o foco no input
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Seleciona todo o texto ao focar
    e.target.select();
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
          <span className="text-gray-500 dark:text-gray-400">{prefix}</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          id={inputId}
          name={name}
          className={`
            w-full pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            border border-gray-300 dark:border-gray-600 rounded-lg
            ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500' : ''}
            dark:bg-gray-700 dark:text-white
            ${className}
          `}
          value={inputValue || formatForDisplay(value)}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={`${prefix} ${placeholder}`}
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

export default CurrencyField;