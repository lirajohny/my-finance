import React from 'react';
import dayjs from 'dayjs';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Income, Expense } from '../../types';

interface RecentTransactionsProps {
  transactions: (Income | Expense)[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
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

  // Verifica se é uma despesa
  const isExpense = (transaction: Income | Expense): transaction is Expense => {
    return (transaction as Expense).paymentMethod !== undefined;
  };

  // Renderiza o tipo de transação (receita ou despesa)
  const renderTransactionType = (transaction: Income | Expense) => {
    if (isExpense(transaction)) {
      return <Badge variant="danger" size="sm">Despesa</Badge>;
    }
    return <Badge variant="success" size="sm">Receita</Badge>;
  };

  // Renderiza o valor com cor baseada no tipo de transação
  const renderAmount = (transaction: Income | Expense) => {
    if (isExpense(transaction)) {
      return <span className="font-medium text-red-600 dark:text-red-400">{formatCurrency(transaction.amount)}</span>;
    }
    return <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(transaction.amount)}</span>;
  };

  return (
    <Card 
      title="Transações Recentes" 
      className="mb-6"
    >
      <div className="overflow-x-auto -mx-5">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr 
                  key={transaction.id} 
                  className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/50'} hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors`}
                >
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatDate(transaction.date)}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{transaction.description}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{transaction.category}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm">{renderTransactionType(transaction)}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-right">{renderAmount(transaction)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Nenhuma transação recente</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentTransactions;
