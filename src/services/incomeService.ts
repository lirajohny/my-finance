import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Income } from '../types';

// Adicionar nova receita
export const addIncome = async (income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Filter out undefined values to avoid Firestore errors
    const incomeData = Object.entries(income).reduce((acc: any, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const docRef = await addDoc(collection(db, 'receitas'), {
      ...incomeData,
      date: new Date(income.date),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar receita:', error);
    throw error;
  }
};

// Atualizar receita existente
export const updateIncome = async (id: string, income: Partial<Omit<Income, 'id' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const incomeRef = doc(db, 'receitas', id);
    
    // Filter out undefined values to avoid Firestore errors
    const incomeData = Object.entries(income).reduce((acc: any, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const updateData: any = {
      ...incomeData,
      updatedAt: serverTimestamp()
    };
    
    // Converter a data se existir
    if (income.date) {
      updateData.date = new Date(income.date);
    }
    
    await updateDoc(incomeRef, updateData);
    return id;
  } catch (error) {
    console.error('Erro ao atualizar receita:', error);
    throw error;
  }
};

// Excluir receita
export const deleteIncome = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'receitas', id));
    return id;
  } catch (error) {
    console.error('Erro ao excluir receita:', error);
    throw error;
  }
};

// Buscar todas as receitas do usuário
export const getUserIncomes = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'receitas'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
      } as Income;
    });
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    throw error;
  }
};

// Buscar receitas por período
export const getIncomesByPeriod = async (userId: string, startDate: Date, endDate: Date) => {
  try {
    const q = query(
      collection(db, 'receitas'),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
      } as Income;
    });
  } catch (error) {
    console.error('Erro ao buscar receitas por período:', error);
    throw error;
  }
};

// Buscar receita por ID
export const getIncomeById = async (id: string) => {
  try {
    const docRef = doc(db, 'receitas', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
      } as Income;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar receita por ID:', error);
    throw error;
  }
};
