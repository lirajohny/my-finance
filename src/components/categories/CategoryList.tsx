import React from 'react';
import CategoryItem from './CategoryItem';
import Button from '../ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Category } from '../../types';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAdd: () => void;
  type: 'income' | 'expense';
}

const CategoryList: React.FC<CategoryListProps> = ({ 
  categories, 
  onEdit, 
  onDelete,
  onAdd,
  type
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Categorias de {type === 'income' ? 'Receita' : 'Despesa'}
        </h2>
        <Button 
          variant="primary" 
          size="sm" 
          icon={<PlusIcon className="h-4 w-4" />}
          onClick={onAdd}
        >
          Nova Categoria
        </Button>
      </div>

      <div className="space-y-4 mt-4">
        {categories.length > 0 ? (
          categories.map(category => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma categoria de {type === 'income' ? 'receita' : 'despesa'} encontrada.
            </p>
            <Button 
              variant="primary" 
              size="sm" 
              icon={<PlusIcon className="h-4 w-4" />}
              onClick={onAdd}
              className="mt-4"
            >
              Criar Categoria
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
