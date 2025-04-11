import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import CategoryList from '../components/categories/CategoryList';
import CategoryForm from '../components/categories/CategoryForm';
import Modal from '../components/ui/Modal';
import Tabs from '../components/ui/Tabs';
import { getUserIncomeCategories, getUserExpenseCategories, addCategory, updateCategory, deleteCategory } from '../services/categoryService';
import { Category } from '../types';

const Categories: React.FC = () => {
  const { currentUser } = useAuth();
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carrega categorias
  const loadData = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [incomeCats, expenseCats] = await Promise.all([
        getUserIncomeCategories(currentUser.uid),
        getUserExpenseCategories(currentUser.uid)
      ]);
      
      setIncomeCategories(incomeCats);
      setExpenseCategories(expenseCats);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setError('Ocorreu um erro ao carregar as categorias. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados quando o componente montar
  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Abre o modal para adicionar nova categoria
  const handleAddCategory = (type: 'income' | 'expense') => {
    setCurrentCategory(null);
    setCategoryType(type);
    setShowModal(true);
  };

  // Abre o modal para editar categoria existente
  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setCategoryType(category.type);
    setShowModal(true);
  };

  // Manipula submissão do formulário (adicionar/editar)
  const handleSubmit = async (data: Partial<Category>) => {
    if (!currentUser) return;
    
    try {
      setIsSubmitting(true);
      
      if (currentCategory) {
        // Editando categoria existente
        await updateCategory(currentCategory.id, data, categoryType);
      } else {
        // Adicionando nova categoria
        await addCategory(data as Omit<Category, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      // Recarrega dados após salvar
      await loadData();
      setShowModal(false);
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      setError('Ocorreu um erro ao salvar os dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manipula exclusão de categoria
  const handleDeleteCategory = async (category: Category) => {
    if (!window.confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      return;
    }
    
    try {
      await deleteCategory(category.id, category.type);
      await loadData();
    } catch (err) {
      console.error('Erro ao excluir categoria:', err);
      setError('Ocorreu um erro ao excluir a categoria. Tente novamente.');
    }
  };

  // Conteúdo das abas
  const tabs = [
    {
      id: 'expenses',
      label: 'Despesas',
      content: (
        <CategoryList
          categories={expenseCategories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onAdd={() => handleAddCategory('expense')}
          type="expense"
        />
      )
    },
    {
      id: 'incomes',
      label: 'Receitas',
      content: (
        <CategoryList
          categories={incomeCategories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onAdd={() => handleAddCategory('income')}
          type="income"
        />
      )
    }
  ];

  return (
    <Layout title="Categorias">
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-xs"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <Tabs tabs={tabs} />
      )}
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${currentCategory ? 'Editar' : 'Nova'} Categoria de ${categoryType === 'income' ? 'Receita' : 'Despesa'}`}
      >
        <CategoryForm
          type={categoryType}
          onSubmit={handleSubmit}
          initialData={currentCategory || undefined}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </Layout>
  );
};

export default Categories;
