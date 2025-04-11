import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SelectField from '../components/form/SelectField';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { exportBackupToJson, createBackup } from '../services/backupService';
import { DocumentArrowDownIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  notifications: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  lastBackupDate?: Date | string;
}

const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'system',
    currency: 'BRL',
    language: 'pt-BR',
    notifications: true,
    backupFrequency: 'monthly'
  });
  const [loading, setLoading] = useState(true);
  const [backupLoading, setBackupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Opções para os selects
  const themeOptions = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Escuro' },
    { value: 'system', label: 'Sistema' }
  ];

  const currencyOptions = [
    { value: 'BRL', label: 'Real Brasileiro (R$)' },
    { value: 'USD', label: 'Dólar Americano ($)' },
    { value: 'EUR', label: 'Euro (€)' }
  ];

  const languageOptions = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' }
  ];

  const backupFrequencyOptions = [
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'never', label: 'Nunca' }
  ];

  // Carrega configurações do usuário
  const loadSettings = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const settingsRef = doc(db, 'usuarios', currentUser.uid);
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        const userData = settingsSnap.data();
        
        // Atualiza as configurações com os dados do banco
        setSettings(prev => ({
          ...prev,
          theme: userData.theme || prev.theme,
          currency: userData.currency || prev.currency,
          language: userData.language || prev.language,
          notifications: userData.notifications !== undefined ? userData.notifications : prev.notifications,
          backupFrequency: userData.backupFrequency || prev.backupFrequency,
          lastBackupDate: userData.lastBackupDate
        }));
        
        // Sincroniza o tema com o contexto de tema
        if (userData.theme) {
          setTheme(userData.theme);
        }
      } else {
        // Se não existir, cria um documento de configurações
        await setDoc(settingsRef, {
          ...settings,
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError('Ocorreu um erro ao carregar as configurações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carrega as configurações quando o componente montar
  useEffect(() => {
    loadSettings();
  }, [currentUser]);

  // Salva as configurações do usuário
  const saveSettings = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const settingsRef = doc(db, 'usuarios', currentUser.uid);
      
      // Atualiza o documento com as novas configurações
      await updateDoc(settingsRef, {
        ...settings,
        updatedAt: serverTimestamp()
      });
      
      // Atualiza o tema no contexto de tema
      setTheme(settings.theme);
      
      setSuccess('Configurações salvas com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      setError('Ocorreu um erro ao salvar as configurações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Manipula mudanças nas configurações
  const handleChange = (name: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manipula backup manual dos dados
  const handleBackup = async () => {
    if (!currentUser) return;
    
    try {
      setBackupLoading(true);
      setError(null);
      setSuccess(null);
      
      // Cria um backup no Firestore
      await createBackup(currentUser.uid);
      
      setSuccess('Backup criado com sucesso!');
    } catch (err) {
      console.error('Erro ao criar backup:', err);
      setError('Ocorreu um erro ao criar o backup. Tente novamente.');
    } finally {
      setBackupLoading(false);
    }
  };

  // Manipula exportação dos dados
  const handleExportData = async () => {
    if (!currentUser) return;
    
    try {
      setBackupLoading(true);
      setError(null);
      setSuccess(null);
      
      // Exporta os dados para JSON
      await exportBackupToJson(currentUser.uid);
      
      setSuccess('Dados exportados com sucesso!');
    } catch (err) {
      console.error('Erro ao exportar dados:', err);
      setError('Ocorreu um erro ao exportar os dados. Tente novamente.');
    } finally {
      setBackupLoading(false);
    }
  };

  // Formata data para exibição
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'Nunca';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout title="Configurações">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card title="Aparência e Idioma">
          <div className="space-y-6">
            <SelectField
              label="Tema"
              options={themeOptions}
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
            />
            
            <SelectField
              label="Moeda"
              options={currencyOptions}
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
            />
            
            <SelectField
              label="Idioma"
              options={languageOptions}
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
            />
          </div>
        </Card>
        
        <Card title="Backup e Exportação">
          <div className="space-y-6">
            <SelectField
              label="Frequência de Backup Automático"
              options={backupFrequencyOptions}
              value={settings.backupFrequency}
              onChange={(e) => handleChange('backupFrequency', e.target.value)}
              hint={`Último backup: ${formatDate(settings.lastBackupDate)}`}
            />
            
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                onClick={handleBackup}
                disabled={backupLoading}
                isLoading={backupLoading}
                icon={<CloudArrowUpIcon className="h-5 w-5" />}
              >
                Backup Manual
              </Button>
              
              <Button
                variant="outline"
                onClick={handleExportData}
                disabled={backupLoading}
                icon={<DocumentArrowDownIcon className="h-5 w-5" />}
              >
                Exportar Dados
              </Button>
            </div>
          </div>
        </Card>
        
        {(error || success) && (
          <div className={`p-4 rounded-lg ${error ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
            <p>{error || success}</p>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={saveSettings}
            disabled={loading}
            isLoading={loading}
          >
            Salvar Configurações
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
