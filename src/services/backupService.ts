import { collection, getDocs, query, where, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getUserIncomes } from './incomeService';
import { getUserExpenses } from './expenseService';
import { getUserIncomeCategories, getUserExpenseCategories } from './categoryService';

// Cria um backup completo dos dados do usuário
export const createBackup = async (userId: string) => {
  try {
    // Busca todos os dados do usuário
    const [incomes, expenses, incomeCategories, expenseCategories] = await Promise.all([
      getUserIncomes(userId),
      getUserExpenses(userId),
      getUserIncomeCategories(userId),
      getUserExpenseCategories(userId)
    ]);
    
    // Cria o documento de backup
    const backupData = {
      userId,
      createdAt: serverTimestamp(),
      data: {
        incomes,
        expenses,
        incomeCategories,
        expenseCategories
      }
    };
    
    // Salva o backup no Firestore
    const backupRef = await addDoc(collection(db, 'backups'), backupData);
    
    // Atualiza as configurações do usuário com a data do último backup
    const userSettingsRef = doc(db, 'usuarios', userId);
    await getDoc(userSettingsRef).then(async (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const docRef = doc(db, 'usuarios', userId);
        await updateDoc(docRef, {
          lastBackupDate: serverTimestamp()
        });
      }
    });
    
    return backupRef.id;
  } catch (error) {
    console.error('Erro ao criar backup:', error);
    throw error;
  }
};

// Busca todos os backups do usuário
export const getUserBackups = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'backups'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        createdAt: data.createdAt,
        userId: data.userId
      };
    });
  } catch (error) {
    console.error('Erro ao buscar backups:', error);
    throw error;
  }
};

// Busca um backup específico
export const getBackupById = async (backupId: string) => {
  try {
    const backupRef = doc(db, 'backups', backupId);
    const backupSnap = await getDoc(backupRef);
    
    if (backupSnap.exists()) {
      return backupSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar backup:', error);
    throw error;
  }
};

// Exporta o backup como arquivo JSON para download local
export const exportBackupToJson = async (userId: string) => {
  try {
    // Busca todos os dados do usuário
    const [incomes, expenses, incomeCategories, expenseCategories] = await Promise.all([
      getUserIncomes(userId),
      getUserExpenses(userId),
      getUserIncomeCategories(userId),
      getUserExpenseCategories(userId)
    ]);
    
    // Cria o objeto de backup
    const backupData = {
      userId,
      createdAt: new Date(),
      data: {
        incomes,
        expenses,
        incomeCategories,
        expenseCategories
      }
    };
    
    // Converte para JSON e cria o blob
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Cria o link de download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `personalfinance_backup_${new Date().toISOString().slice(0, 10)}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Erro ao exportar backup:', error);
    throw error;
  }
};
