import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import SelectField from '../components/form/SelectField';
import Button from '../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartBarIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { getMonthlyReport } from '../services/dashboardService';
import { exportToPDF } from '../services/exportService';

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#ef4444', // red
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6366f1', // indigo
  '#06b6d4', // cyan
  '#d946ef', // fuchsia
  '#6b7280', // gray
];

interface MonthOption {
  value: string;
  label: string;
}

interface YearOption {
  value: string;
  label: string;
}

const Reports: React.FC = () => {
  const { currentUser } = useAuth();
  const reportRef = useRef<HTMLDivElement>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prepara opções para os filtros
  const monthOptions: MonthOption[] = [
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

  // Gera opções para os últimos 3 anos
  const currentYear = new Date().getFullYear();
  const yearOptions: YearOption[] = [
    { value: currentYear.toString(), label: currentYear.toString() },
    { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
    { value: (currentYear - 2).toString(), label: (currentYear - 2).toString() }
  ];

  // Carrega relatório mensal
  const loadReport = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await getMonthlyReport(currentUser.uid, selectedYear, selectedMonth);
      setReportData(data);
    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
      setError('Ocorreu um erro ao gerar o relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carrega relatório quando os filtros mudarem
  useEffect(() => {
    loadReport();
  }, [currentUser, selectedMonth, selectedYear]);

  // Formata valores monetários
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Exporta relatório como PDF
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      await exportToPDF(
        reportRef.current, 
        `relatorio_${selectedYear}_${selectedMonth + 1}`
      );
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
      setError('Ocorreu um erro ao exportar o PDF. Tente novamente.');
    }
  };

  // Prepara dados para o gráfico de categorias de despesa
  const prepareExpenseCategoryData = () => {
    if (!reportData?.expensesByCategory) return [];
    
    return Object.entries(reportData.expensesByCategory).map(([category, amount]) => ({
      name: category,
      value: amount as number
    })).sort((a, b) => b.value - a.value);
  };

  // Prepara dados para o gráfico de evolução diária
  const prepareDailyData = () => {
    if (!reportData?.expensesByDay || !reportData?.incomesByDay) return [];
    
    return Object.keys(reportData.expensesByDay).map(day => ({
      name: day,
      despesas: reportData.expensesByDay[day] || 0,
      receitas: reportData.incomesByDay[day] || 0
    })).sort((a, b) => parseInt(a.name) - parseInt(b.name));
  };

  // Prepara dados para o gráfico de métodos de pagamento
  const preparePaymentMethodData = () => {
    if (!reportData?.expensesByPaymentMethod) return [];
    
    // Traduz os métodos de pagamento para português
    const methodTranslation: Record<string, string> = {
      'credit': 'Crédito',
      'debit': 'Débito',
      'cash': 'Dinheiro',
      'pix': 'Pix',
      'other': 'Outro'
    };
    
    return Object.entries(reportData.expensesByPaymentMethod).map(([method, amount]) => ({
      name: methodTranslation[method] || method,
      value: amount as number
    }));
  };

  // Renderiza o relatório
  const renderReport = () => {
    if (!reportData) return null;
    
    const expenseCategoryData = prepareExpenseCategoryData();
    const dailyData = prepareDailyData();
    const paymentMethodData = preparePaymentMethodData();
    
    const balance = reportData.balance;
    const balanceColorClass = balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    
    return (
      <div ref={reportRef} className="space-y-6">
        <Card title={`Resumo - ${monthOptions[selectedMonth].label} de ${selectedYear}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Receitas</h3>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1">
                {formatCurrency(reportData.totalIncome)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Despesas</h3>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400 mt-1">
                {formatCurrency(reportData.totalExpense)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo</h3>
              <p className={`text-lg font-semibold ${balanceColorClass} mt-1`}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Despesas por Categoria">
            <div className="h-80">
              {expenseCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Sem dados para exibir</p>
                </div>
              )}
            </div>
          </Card>
          
          <Card title="Métodos de Pagamento">
            <div className="h-80">
              {paymentMethodData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Sem dados para exibir</p>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <Card title="Evolução Diária">
          <div className="h-80">
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="receitas" stackId="a" fill="#10b981" name="Receitas" />
                  <Bar dataKey="despesas" stackId="a" fill="#ef4444" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Sem dados para exibir</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <Layout title="Relatórios">
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full md:w-auto flex-grow">
            <SelectField
              label="Mês"
              options={monthOptions}
              value={selectedMonth.toString()}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            />
          </div>
          
          <div className="w-full md:w-auto flex-grow">
            <SelectField
              label="Ano"
              options={yearOptions}
              value={selectedYear.toString()}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            />
          </div>
          
          <div className="w-full md:w-auto">
            <Button
              variant="primary"
              onClick={handleExportPDF}
              icon={<DocumentArrowDownIcon className="h-5 w-5" />}
              disabled={loading || !reportData}
            >
              Exportar PDF
            </Button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <p className="text-danger mb-4">{error}</p>
          <Button 
            variant="primary" 
            onClick={loadReport}
            icon={<ChartBarIcon className="h-5 w-5" />}
          >
            Tentar Novamente
          </Button>
        </Card>
      ) : (
        renderReport()
      )}
    </Layout>
  );
};

export default Reports;
