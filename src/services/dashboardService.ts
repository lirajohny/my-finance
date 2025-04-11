import dayjs from 'dayjs';
import { Income, Expense, FinancialSummary, Category } from '../types';
import { getUserIncomes, getIncomesByPeriod } from './incomeService';
import { getUserExpenses, getExpensesByPeriod } from './expenseService';
import { getUserExpenseCategories } from './categoryService';

// Obter resumo financeiro para o dashboard
export const getFinancialSummary = async (userId: string): Promise<FinancialSummary> => {
  try {
    // Define o período atual (mês corrente)
    const now = dayjs();
    const startOfMonth = now.startOf('month').toDate();
    const endOfMonth = now.endOf('month').toDate();
    
    // Busca receitas e despesas do mês atual
    const [incomes, expenses, expenseCategories] = await Promise.all([
      getIncomesByPeriod(userId, startOfMonth, endOfMonth),
      getExpensesByPeriod(userId, startOfMonth, endOfMonth),
      getUserExpenseCategories(userId)
    ]);
    
    // Calcula totais
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const currentBalance = totalIncome - totalExpense;
    
    // Taxa de economia (se não houver receita, é 0)
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    
    // Agrupa por categoria
    const expensesByCategory: Record<string, number> = {};
    const incomesByCategory: Record<string, number> = {};
    
    // Popula despesas por categoria
    expenses.forEach(expense => {
      if (!expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] = 0;
      }
      expensesByCategory[expense.category] += expense.amount;
    });
    
    // Popula receitas por categoria
    incomes.forEach(income => {
      if (!incomesByCategory[income.category]) {
        incomesByCategory[income.category] = 0;
      }
      incomesByCategory[income.category] += income.amount;
    });
    
    // Combina transações recentes
    const allTransactions = [...incomes, ...expenses];
    const recentTransactions = allTransactions
      .sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date as string);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date as string);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);
    
    // Verifica alertas de orçamento
    const budgetAlerts = expenseCategories
      .filter(category => category.budget && category.budget > 0)
      .map(category => {
        const spent = expensesByCategory[category.name] || 0;
        const budget = category.budget || 0;
        const percentage = budget > 0 ? (spent / budget) * 100 : 0;
        
        return {
          category: category.name,
          spent,
          budget,
          percentage
        };
      })
      .filter(alert => alert.percentage >= 80) // Alerta quando gasto atinge 80% do orçamento
      .sort((a, b) => b.percentage - a.percentage);
    
    return {
      currentBalance,
      totalIncome,
      totalExpense,
      savingsRate,
      expensesByCategory,
      incomesByCategory,
      recentTransactions,
      budgetAlerts
    };
  } catch (error) {
    console.error('Erro ao gerar resumo financeiro:', error);
    throw error;
  }
};

// Obter dados para relatório mensal
export const getMonthlyReport = async (userId: string, year: number, month: number) => {
  try {
    const startDate = dayjs().year(year).month(month).startOf('month').toDate();
    const endDate = dayjs().year(year).month(month).endOf('month').toDate();
    
    const [incomes, expenses] = await Promise.all([
      getIncomesByPeriod(userId, startDate, endDate),
      getExpensesByPeriod(userId, startDate, endDate)
    ]);
    
    // Calcular totais
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpense;
    
    // Despesas por categoria
    const expensesByCategory: Record<string, number> = {};
    expenses.forEach(expense => {
      if (!expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] = 0;
      }
      expensesByCategory[expense.category] += expense.amount;
    });
    
    // Receitas por categoria
    const incomesByCategory: Record<string, number> = {};
    incomes.forEach(income => {
      if (!incomesByCategory[income.category]) {
        incomesByCategory[income.category] = 0;
      }
      incomesByCategory[income.category] += income.amount;
    });
    
    // Despesas por método de pagamento
    const expensesByPaymentMethod: Record<string, number> = {};
    expenses.forEach(expense => {
      if (!expensesByPaymentMethod[expense.paymentMethod]) {
        expensesByPaymentMethod[expense.paymentMethod] = 0;
      }
      expensesByPaymentMethod[expense.paymentMethod] += expense.amount;
    });
    
    // Despesas por dia
    const expensesByDay: Record<string, number> = {};
    const incomesByDay: Record<string, number> = {};
    
    // Inicializa todos os dias do mês
    const daysInMonth = dayjs(startDate).daysInMonth();
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = i.toString().padStart(2, '0');
      expensesByDay[dayStr] = 0;
      incomesByDay[dayStr] = 0;
    }
    
    // Popula despesas por dia
    expenses.forEach(expense => {
      const date = expense.date instanceof Date ? expense.date : new Date(expense.date as string);
      const day = date.getDate().toString().padStart(2, '0');
      expensesByDay[day] += expense.amount;
    });
    
    // Popula receitas por dia
    incomes.forEach(income => {
      const date = income.date instanceof Date ? income.date : new Date(income.date as string);
      const day = date.getDate().toString().padStart(2, '0');
      incomesByDay[day] += income.amount;
    });
    
    return {
      totalIncome,
      totalExpense,
      balance,
      expensesByCategory,
      incomesByCategory,
      expensesByPaymentMethod,
      expensesByDay,
      incomesByDay,
      incomes,
      expenses
    };
  } catch (error) {
    console.error('Erro ao gerar relatório mensal:', error);
    throw error;
  }
};

// Obter projeção para os próximos meses
export const getFutureProjection = async (userId: string, monthsAhead: number = 3) => {
  try {
    // Busca transações recorrentes
    const [incomes, expenses] = await Promise.all([
      getUserIncomes(userId),
      getUserExpenses(userId)
    ]);
    
    const recurringIncomes = incomes.filter(income => income.isRecurring);
    const recurringExpenses = expenses.filter(expense => expense.isRecurring);
    
    // Calcular valores mensais recorrentes
    const monthlyRecurringIncome = recurringIncomes.reduce((sum, income) => {
      // Ajusta valor para quinzenal (multiplicando por 2 para mensal)
      const value = income.recurrenceType === 'biweekly' ? income.amount * 2 : income.amount;
      return sum + value;
    }, 0);
    
    const monthlyRecurringExpense = recurringExpenses.reduce((sum, expense) => {
      // Ajusta valor para quinzenal (multiplicando por 2 para mensal)
      const value = expense.recurrenceType === 'biweekly' ? expense.amount * 2 : expense.amount;
      return sum + value;
    }, 0);
    
    // Projeção para os próximos meses
    const projection = [];
    let estimatedBalance = 0;
    
    // Calcula o saldo atual para o mês corrente
    const now = dayjs();
    const startOfMonth = now.startOf('month').toDate();
    const endOfMonth = now.endOf('month').toDate();
    
    const currentMonthIncomes = await getIncomesByPeriod(userId, startOfMonth, endOfMonth);
    const currentMonthExpenses = await getExpensesByPeriod(userId, startOfMonth, endOfMonth);
    
    const currentMonthTotalIncome = currentMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
    const currentMonthTotalExpense = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    estimatedBalance = currentMonthTotalIncome - currentMonthTotalExpense;
    
    // Para cada mês futuro
    for (let i = 1; i <= monthsAhead; i++) {
      const month = now.add(i, 'month');
      const monthName = month.format('MMMM YYYY');
      
      // Adiciona receitas e despesas recorrentes ao saldo estimado
      estimatedBalance += monthlyRecurringIncome - monthlyRecurringExpense;
      
      projection.push({
        month: monthName,
        estimatedIncome: monthlyRecurringIncome,
        estimatedExpense: monthlyRecurringExpense,
        estimatedBalance
      });
    }
    
    return projection;
  } catch (error) {
    console.error('Erro ao gerar projeção futura:', error);
    throw error;
  }
};
