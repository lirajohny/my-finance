import React from 'react';
import Card from '../ui/Card';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface BalanceSummaryProps {
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({ 
  currentBalance,
  totalIncome,
  totalExpense,
  savingsRate
}) => {
  // Formata valores monetários
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Determina a cor do saldo baseado no valor
  const balanceColorClass = currentBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return (
    <Card className="mb-6">
      <div>
        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">Saldo do Mês</h3>
        <p className={`text-3xl font-bold mt-1 ${balanceColorClass}`}>
          {formatCurrency(currentBalance)}
        </p>
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full my-4">
          <div 
            className="h-1 bg-primary rounded-full" 
            style={{ width: `${Math.min(100, savingsRate)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm">
          <div>
            <p className="font-medium text-gray-500 dark:text-gray-400">Receitas</p>
            <p className="flex items-center mt-1 font-semibold text-green-600 dark:text-green-400">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-500 dark:text-gray-400">Despesas</p>
            <p className="flex items-center mt-1 font-semibold text-red-600 dark:text-red-400">
              <ArrowDownIcon className="h-4 w-4 mr-1" />
              {formatCurrency(totalExpense)}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-500 dark:text-gray-400">Economia</p>
            <p className="mt-1 font-semibold text-primary">
              {savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BalanceSummary;
