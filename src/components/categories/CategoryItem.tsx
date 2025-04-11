import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Category } from '../../types';

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ 
  category, 
  onEdit, 
  onDelete 
}) => {
  // Formata valores monetários
  const formatCurrency = (value?: number): string => {
    if (!value || value === 0) return '-';
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Renderiza o ícone correto baseado no valor da propriedade icon
  const renderIcon = () => {
    return (
      <div 
        className="h-10 w-10 rounded-full flex items-center justify-center" 
        style={{ backgroundColor: category.color || '#6b7280' }}
      >
        <span className="text-white text-xl">
          {category.name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        {renderIcon()}
        
        <div className="ml-4 flex-grow">
          <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
          {category.budget !== undefined && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Orçamento: {formatCurrency(category.budget)}
            </p>
          )}
        </div>
        
        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(category)}
            className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Editar"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={() => onDelete(category)}
            className="p-1 text-gray-500 hover:text-danger rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Excluir"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryItem;
