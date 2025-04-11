import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import InputField from '../form/InputField';
import SelectField from '../form/SelectField';
import DatePickerField from '../form/DatePickerField';
import CurrencyField from '../form/CurrencyField';
import CheckboxField from '../form/CheckboxField';
import { Category } from '../../types';

interface RecurrenceOption {
  value: string;
  label: string;
}

interface TransactionFormProps {
  type: 'income' | 'expense';
  onSubmit: (data: any) => void;
  initialData?: any;
  categories: Category[];
  isSubmitting?: boolean;
}

const RecurrenceOptions: RecurrenceOption[] = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'biweekly', label: 'Quinzenal' },
];

const PaymentMethodOptions = [
  { value: 'credit', label: 'Cartão de Crédito' },
  { value: 'debit', label: 'Cartão de Débito' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'pix', label: 'PIX' },
  { value: 'other', label: 'Outro' },
];

const TransactionForm: React.FC<TransactionFormProps> = ({
  type,
  onSubmit,
  initialData,
  categories,
  isSubmitting = false
}) => {
  const { currentUser } = useAuth();
  const isExpense = type === 'expense';
  const isEditing = !!initialData;

  // Estado do formulário
  const [formData, setFormData] = useState({
    amount: 0,
    description: '',
    category: '',
    date: new Date(),
    isRecurring: false,
    recurrenceType: 'monthly',
    paymentMethod: 'credit',
    installment: {
      current: 1,
      total: 1
    }
  });

  // Configura o formulário com os dados iniciais, se fornecidos
  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || 0,
        description: initialData.description || '',
        category: initialData.category || '',
        date: initialData.date ? new Date(initialData.date) : new Date(),
        isRecurring: initialData.isRecurring || false,
        recurrenceType: initialData.recurrenceType || 'monthly',
        paymentMethod: initialData.paymentMethod || 'credit',
        installment: initialData.installment || {
          current: 1,
          total: 1
        }
      });
    }
  }, [initialData]);

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
      // Filtra os campos dependendo do tipo de transação
      ...(!isExpense && { paymentMethod: undefined, installment: undefined }),
      ...(!formData.isRecurring && { recurrenceType: undefined }),
      ...((!isExpense || formData.paymentMethod !== 'credit') && { installment: undefined })
    };
    
    onSubmit(dataToSubmit);
  };

  // Prepara opções de categoria para o select
  const categoryOptions = categories.map(category => ({
    value: category.name,
    label: category.name
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CurrencyField
          label="Valor"
          value={formData.amount}
          onChange={(value) => handleChange('amount', value)}
          required
        />
        
        <DatePickerField
          label="Data"
          value={formData.date}
          onChange={(date) => handleChange('date', date)}
          required
        />
      </div>

      <InputField
        label="Descrição"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Insira uma descrição"
        required
      />

      <SelectField
        label="Categoria"
        options={categoryOptions}
        value={formData.category}
        onChange={(e) => handleChange('category', e.target.value)}
        required
      />

      {isExpense && (
        <SelectField
          label="Método de Pagamento"
          options={PaymentMethodOptions}
          value={formData.paymentMethod}
          onChange={(e) => handleChange('paymentMethod', e.target.value)}
          required
        />
      )}

      {isExpense && formData.paymentMethod === 'credit' && (
        <div className="grid grid-cols-2 gap-4">
          <InputField
            type="number"
            label="Parcela Atual"
            value={formData.installment.current.toString()}
            onChange={(e) => handleChange('installment', {
              ...formData.installment,
              current: parseInt(e.target.value) || 1
            })}
            min={1}
            required
          />
          <InputField
            type="number"
            label="Total de Parcelas"
            value={formData.installment.total.toString()}
            onChange={(e) => handleChange('installment', {
              ...formData.installment,
              total: parseInt(e.target.value) || 1
            })}
            min={1}
            required
          />
        </div>
      )}

      <div className="space-y-4">
        <CheckboxField
          label="É uma transação recorrente"
          checked={formData.isRecurring}
          onChange={(e) => handleChange('isRecurring', e.target.checked)}
        />

        {formData.isRecurring && (
          <SelectField
            label="Tipo de Recorrência"
            options={RecurrenceOptions}
            value={formData.recurrenceType}
            onChange={(e) => handleChange('recurrenceType', e.target.value)}
            required
          />
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {isEditing ? 'Atualizar' : 'Salvar'} {isExpense ? 'Despesa' : 'Receita'}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
