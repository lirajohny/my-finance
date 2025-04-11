import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import BalanceSummary from '../components/dashboard/BalanceSummary';
import ExpensesByCategoryChart from '../components/dashboard/ExpensesByCategoryChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetAlerts from '../components/dashboard/BudgetAlerts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { getFinancialSummary } from '../services/dashboardService';
import { FinancialSummary } from '../types';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega o resumo financeiro
  const loadSummary = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await getFinancialSummary(currentUser.uid);
      setSummary(data);
    } catch (err) {
      console.error('Erro ao carregar resumo financeiro:', err);
      setError('Ocorreu um erro ao carregar os dados financeiros. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados quando o componente montar
  useEffect(() => {
    loadSummary();
  }, [currentUser]);

  // Renderiza skeleton loader durante o carregamento
  const renderSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
    </div>
  );

  // Renderiza mensagem de erro
  const renderError = () => (
    <Card className="p-6 text-center">
      <p className="text-danger mb-4">{error}</p>
      <Button 
        variant="primary" 
        onClick={loadSummary}
        icon={<ArrowPathIcon className="h-5 w-5" />}
      >
        Tentar Novamente
      </Button>
    </Card>
  );

  return (
    <Layout title="Dashboard">
      {loading && renderSkeleton()}
      
      {!loading && error && renderError()}
      
      {!loading && !error && summary && (
        <div className="space-y-6">
          <BalanceSummary 
            currentBalance={summary.currentBalance}
            totalIncome={summary.totalIncome}
            totalExpense={summary.totalExpense}
            savingsRate={summary.savingsRate}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpensesByCategoryChart expensesByCategory={summary.expensesByCategory} />
            <BudgetAlerts alerts={summary.budgetAlerts} />
          </div>
          
          <RecentTransactions transactions={summary.recentTransactions} />
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
