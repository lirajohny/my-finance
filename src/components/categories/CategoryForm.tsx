import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import InputField from '../form/InputField';
import SelectField from '../form/SelectField';
import { Category } from '../../types';

interface CategoryFormProps {
  type: 'income' | 'expense';
  onSubmit: (data: Partial<Category>) => void;
  initialData?: Partial<Category>;
  isSubmitting?: boolean;
}

const colorOptions = [
  { value: '#3b82f6', label: 'Azul' },
  { value: '#10b981', label: 'Verde' },
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#f59e0b', label: 'Amarelo' },
  { value: '#8b5cf6', label: 'Violeta' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#6366f1', label: 'Indigo' },
  { value: '#06b6d4', label: 'Ciano' },
  { value: '#d946ef', label: 'Fúcsia' },
  { value: '#6b7280', label: 'Cinza' },
];

const iconOptions = [
  { value: 'home', label: 'Casa' },
  { value: 'shopping-cart', label: 'Compras' },
  { value: 'academic-cap', label: 'Educação' },
  { value: 'heart', label: 'Saúde' },
  { value: 'truck', label: 'Transporte' },
  { value: 'briefcase', label: 'Trabalho' },
  { value: 'ticket', label: 'Lazer' },
  { value: 'light-bulb', label: 'Serviços' },
  { value: 'chart-bar', label: 'Investimentos' },
  { value: 'code', label: 'Tecnologia' },
  { value: 'dots-horizontal', label: 'Outros' },
];

const CategoryForm: React.FC<CategoryFormProps> = ({
  type,
  onSubmit,
  initialData,
  isSubmitting = false
}) => {
  const { currentUser } = useAuth();
  const isExpense = type === 'expense';
  const isEditing = !!initialData?.name;

  // Estado do formulário
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    type: type,
    color: colorOptions[0].value,
    icon: iconOptions[0].value,
    budget: isExpense ? 0 : undefined
  });

  // Configura o formulário com os dados iniciais, se fornecidos
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        type: type // Garante que o tipo está correto
      });
    }
  }, [initialData, type]);

  // Manipula mudanças nos campos do formulário
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manipula envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepara dados para submissão
    const dataToSubmit = {
      ...formData,
      userId: currentUser?.uid,
    };
    
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        label="Nome da Categoria"
        value={formData.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Digite o nome da categoria"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Cor"
          options={colorOptions}
          value={formData.color || colorOptions[0].value}
          onChange={(e) => handleChange('color', e.target.value)}
          required
        />
        
        <SelectField
          label="Ícone"
          options={iconOptions}
          value={formData.icon || iconOptions[0].value}
          onChange={(e) => handleChange('icon', e.target.value)}
          required
        />
      </div>

      {isExpense && (
        <InputField
          type="number"
          label="Orçamento Mensal (opcional)"
          value={formData.budget?.toString() || ''}
          onChange={(e) => handleChange('budget', e.target.value ? parseFloat(e.target.value) : 0)}
          placeholder="0,00"
          hint="Deixe em branco ou zero para não definir um orçamento"
        />
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {isEditing ? 'Atualizar' : 'Criar'} Categoria
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
