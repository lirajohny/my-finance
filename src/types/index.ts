// Tipos para autenticação
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Tipos para receitas
export interface Income {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date | string;
  isRecurring: boolean;
  recurrenceType?: 'monthly' | 'biweekly';
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Tipos para despesas
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  paymentMethod: 'credit' | 'debit' | 'cash' | 'pix' | 'other';
  date: Date | string;
  isRecurring: boolean;
  recurrenceType?: 'monthly' | 'biweekly';
  installment?: {
    current: number;
    total: number;
  };
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Tipos para categorias
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  budget?: number; // Orçamento máximo para categoria (apenas para despesas)
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Tipos para relatórios e dashboard
export interface FinancialSummary {
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  savingsRate: number; // Percentual de economia (receitas - despesas) / receitas
  expensesByCategory: Record<string, number>;
  incomesByCategory: Record<string, number>;
  recentTransactions: (Income | Expense)[];
  budgetAlerts: {
    category: string;
    spent: number;
    budget: number;
    percentage: number;
  }[];
}

// Tipos para período do relatório
export type ReportPeriod = 'week' | 'month' | 'year' | 'custom';

// Tipos para configurações
export interface Settings {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  userId: string;
  notifications: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  lastBackupDate?: Date | string;
}
