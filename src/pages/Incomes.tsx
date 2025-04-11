import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getUserIncomes, addIncome, updateIncome, deleteIncome } from '../services/incomeService';
import { getUserIncomeCategories } from '../services/categoryService';
import { Income, Category } from '../types';

const Incomes: React.FC = () => {
  const { currentUser } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentIncome, setCurrentIncome] = useState<Income | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carrega receitas e categorias
  const loadData = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [incomesData, categoriesData] = await Promise.all([
        getUserIncomes(currentUser.uid),
        getUserIncomeCategories(currentUser.uid)
      ]);
      
      setIncomes(incomesData);
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

  // Abre o modal para adicionar nova receita
  const handleAddIncome = () => {
    setCurrentIncome(null);
    setShowModal(true);
  };

  // Abre o modal para editar receita existente
  const handleEditIncome = (income: Income) => {
    setCurrentIncome(income);
    setShowModal(true);
  };

  // Manipula submissão do formulário (adicionar/editar)
  const handleSubmit = async (data: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;
    
    try {
      setIsSubmitting(true);
      
      if (currentIncome) {
        // Editando receita existente
        await updateIncome(currentIncome.id, data);
      } else {
        // Adicionando nova receita
        await addIncome(data);
      }
      
      // Recarrega dados após salvar
      await loadData();
      setShowModal(false);
    } catch (err) {
      console.error('Erro ao salvar receita:', err);
      setError('Ocorreu um erro ao salvar os dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manipula exclusão de receita
  const handleDeleteIncome = async (income: Income) => {
    if (!window.confirm(`Tem certeza que deseja excluir a receita "${income.description}"?`)) {
      return;
    }
    
    try {
      await deleteIncome(income.id);
      await loadData();
    } catch (err) {
      console.error('Erro ao excluir receita:', err);
      setError('Ocorreu um erro ao excluir a receita. Tente novamente.');
    }
  };

  return (
    <Layout title="Receitas">
      <div className="mb-6 flex justify-end">
        <Button
          variant="primary"
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={handleAddIncome}
        >
          Nova Receita
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
          transactions={incomes}
          onEdit={handleEditIncome}
          onDelete={handleDeleteIncome}
          type="income"
          categories={categories}
        />
      )}
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentIncome ? 'Editar Receita' : 'Nova Receita'}
        size="lg"
      >
        <TransactionForm
          type="income"
          onSubmit={handleSubmit}
          initialData={currentIncome}
          categories={categories}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </Layout>
  );
};

export default Incomes;
