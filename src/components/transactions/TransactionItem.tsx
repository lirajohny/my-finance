import React from 'react';
import dayjs from 'dayjs';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Badge from '../ui/Badge';
import { Income, Expense } from '../../types';

interface TransactionItemProps {
  transaction: Income | Expense;
  onEdit: (transaction: Income | Expense) => void;
  onDelete: (transaction: Income | Expense) => void;
  type: 'income' | 'expense';
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onEdit, 
  onDelete,
  type
}) => {
  // Formata valores monetários
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Formata data
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dayjs(dateObj).format('DD/MM/YYYY');
  };

  // Verifica se a transação é do tipo despesa
  const isExpense = (transaction: Income | Expense): transaction is Expense => {
    return (transaction as Expense).paymentMethod !== undefined;
  };

  // Renderiza detalhes específicos da despesa
  const renderExpenseDetails = (expense: Expense) => {
    return (
      <div className="mt-1 space-x-2">
        <Badge variant="gray" size="sm">{expense.paymentMethod}</Badge>
        {expense.installment && expense.installment.total > 1 && (
          <Badge variant="info" size="sm">
            Parcela {expense.installment.current}/{expense.installment.total}
          </Badge>
        )}
      </div>
    );
  };

  // Renderiza badge de recorrência
  const renderRecurringBadge = (transaction: Income | Expense) => {
    if (transaction.isRecurring) {
      const recurrenceText = transaction.recurrenceType === 'monthly' ? 'Mensal' : 'Quinzenal';
      return <Badge variant="secondary" size="sm">{recurrenceText}</Badge>;
    }
    return null;
  };

  // Define a classe de cor do valor
  const amountColorClass = type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{transaction.description}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(transaction.date)} • {transaction.category}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {renderRecurringBadge(transaction)}
            {isExpense(transaction) && renderExpenseDetails(transaction)}
          </div>
        </div>
        
        <div className="text-right">
          <p className={`text-lg font-semibold ${amountColorClass}`}>
            {formatCurrency(transaction.amount)}
          </p>
          
          <div className="flex mt-2 space-x-1">
            <button 
              onClick={() => onEdit(transaction)}
              className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Editar"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onDelete(transaction)}
              className="p-1 text-gray-500 hover:text-danger rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Excluir"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
