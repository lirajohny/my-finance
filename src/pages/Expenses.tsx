import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getUserExpenses, addExpense, updateExpense, deleteExpense } from '../services/expenseService';
import { getUserExpenseCategories } from '../services/categoryService';
import { Expense, Category } from '../types';

const Expenses: React.FC = () => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carrega despesas e categorias
  const loadData = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [expensesData, categoriesData] = await Promise.all([
        getUserExpenses(currentUser.uid),
        getUserExpenseCategories(currentUser.uid)
      ]);
      
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Ocorreu um erro ao carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados quando o componente montar
  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Abre o modal para adicionar nova despesa
  const handleAddExpense = () => {
    setCurrentExpense(null);
    setShowModal(true);
  };

  // Abre o modal para editar despesa existente
  const handleEditExpense = (expense: Expense) => {
    setCurrentExpense(expense);
    setShowModal(true);
  };

  // Manipula submissão do formulário (adicionar/editar)
  const handleSubmit = async (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;
    
    try {
      setIsSubmitting(true);
      
      if (currentExpense) {
        // Editando despesa existente
        await updateExpense(currentExpense.id, data);
      } else {
        // Adicionando nova despesa
        await addExpense(data);
      }
      
      // Recarrega dados após salvar
      await loadData();
      setShowModal(false);
    } catch (err) {
      console.error('Erro ao salvar despesa:', err);
      setError('Ocorreu um erro ao salvar os dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manipula exclusão de despesa
  const handleDeleteExpense = async (expense: Expense) => {
    if (!window.confirm(`Tem certeza que deseja excluir a despesa "${expense.description}"?`)) {
      return;
    }
    
    try {
      await deleteExpense(expense.id);
      await loadData();
    } catch (err) {
      console.error('Erro ao excluir despesa:', err);
      setError('Ocorreu um erro ao excluir a despesa. Tente novamente.');
    }
  };

  return (
    <Layout title="Despesas">
      <div className="mb-6 flex justify-end">
        <Button
          variant="primary"
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={handleAddExpense}
        >
          Nova Despesa
        </Button>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <TransactionList
          transactions={expenses}
          onEdit={(transaction) => handleEditExpense(transaction as Expense)}
          onDelete={(transaction) => handleDeleteExpense(transaction as Expense)}
          type="expense"
          categories={categories}
        />
      )}
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentExpense ? 'Editar Despesa' : 'Nova Despesa'}
        size="lg"
      >
        <TransactionForm
          type="expense"
          onSubmit={handleSubmit}
          initialData={currentExpense}
          categories={categories}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </Layout>
  );
};

export default Expenses;
