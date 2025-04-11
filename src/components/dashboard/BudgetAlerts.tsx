import React from 'react';
import Card from '../ui/Card';
import Alert from '../ui/Alert';

interface BudgetAlert {
  category: string;
  spent: number;
  budget: number;
  percentage: number;
}

interface BudgetAlertsProps {
  alerts: BudgetAlert[];
}

const BudgetAlerts: React.FC<BudgetAlertsProps> = ({ alerts }) => {
  // Formata valores monetários
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Determina a variante do alerta baseado na porcentagem
  const getAlertVariant = (percentage: number) => {
    if (percentage >= 100) return 'danger';
    if (percentage >= 90) return 'warning';
    return 'info';
  };

  return (
    <Card 
      title="Alertas de Orçamento" 
      className="mb-6"
    >
      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Alert key={alert.category} variant={getAlertVariant(alert.percentage)}>
              <div>
                <h4 className="font-medium">{alert.category}</h4>
                <div className="mt-1 flex justify-between text-sm">
                  <span>Gasto: {formatCurrency(alert.spent)}</span>
                  <span>Orçamento: {formatCurrency(alert.budget)}</span>
                </div>
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${alert.percentage >= 100 ? 'bg-red-500' : 'bg-yellow-500'}`}
                      style={{ width: `${Math.min(100, alert.percentage)}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-right">
                    {alert.percentage.toFixed(0)}% utilizado
                  </p>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Nenhum alerta de orçamento para exibir
        </p>
      )}
    </Card>
  );
};

export default BudgetAlerts;
