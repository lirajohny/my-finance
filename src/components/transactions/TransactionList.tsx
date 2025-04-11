import React, { useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import TransactionItem from './TransactionItem';
import Button from '../ui/Button';
import SelectField from '../form/SelectField';
import { Income, Expense } from '../../types';

interface TransactionListProps {
  transactions: (Income | Expense)[];
  onEdit: (transaction: Income | Expense) => void;
  onDelete: (transaction: Income | Expense) => void;
  type: 'income' | 'expense';
  categories: { name: string }[];
}

interface Filter {
  category: string;
  month: number;
  year: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onEdit, 
  onDelete,
  type,
  categories
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    category: '',
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });

  // Preparar opções para os filtros
  const categoryOptions = [
    { value: '', label: 'Todas as categorias' },
    ...categories.map(category => ({
      value: category.name,
      label: category.name
    }))
  ];

  const monthOptions = [
    { value: '0', label: 'Janeiro' },
    { value: '1', label: 'Fevereiro' },
    { value: '2', label: 'Março' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Maio' },
    { value: '5', label: 'Junho' },
    { value: '6', label: 'Julho' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Setembro' },
    { value: '9', label: 'Outubro' },
    { value: '10', label: 'Novembro' },
    { value: '11', label: 'Dezembro' }
  ];
  
  // Gerar opções de ano (ano atual e 2 anos anteriores)
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: currentYear.toString(), label: currentYear.toString() },
    { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
    { value: (currentYear - 2).toString(), label: (currentYear - 2).toString() }
  ];

  // Filtrar transações
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = dayjs(typeof transaction.date === 'string' ? transaction.date : transaction.date);
    const monthMatch = transactionDate.month() === filters.month;
    const yearMatch = transactionDate.year() === filters.year;
    const categoryMatch = !filters.category || transaction.category === filters.category;
    
    return monthMatch && yearMatch && categoryMatch;
  });

  // Manipular mudanças nos filtros
  const handleFilterChange = (name: keyof Filter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: name === 'month' || name === 'year' ? parseInt(value) : value
    }));
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      category: '',
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {transactions.length} {type === 'income' ? 'Receitas' : 'Despesas'}
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          icon={<FunnelIcon className="h-4 w-4" />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filtros
        </Button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Categoria"
              options={categoryOptions}
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            />
            <SelectField
              label="Mês"
              options={monthOptions}
              value={filters.month.toString()}
              onChange={(e) => handleFilterChange('month', e.target.value)}
            />
            <SelectField
              label="Ano"
              options={yearOptions}
              value={filters.year.toString()}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button 
              variant="text" 
              size="sm" 
              onClick={clearFilters}
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4 mt-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
              type={type}
            />
          ))
        ) : (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma {type === 'income' ? 'receita' : 'despesa'} encontrada para os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
