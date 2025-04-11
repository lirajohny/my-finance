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
import { Expense } from '../types';

// Adicionar nova despesa
export const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Filter out undefined values to avoid Firestore errors
    const expenseData = Object.entries(expense).reduce((acc: any, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const docRef = await addDoc(collection(db, 'despesas'), {
      ...expenseData,
      date: new Date(expense.date),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar despesa:', error);
    throw error;
  }
};

// Atualizar despesa existente
export const updateExpense = async (id: string, expense: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const expenseRef = doc(db, 'despesas', id);
    
    // Filter out undefined values to avoid Firestore errors
    const filteredExpense = Object.entries(expense).reduce((acc: any, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const updateData: any = {
      ...filteredExpense,
      updatedAt: serverTimestamp()
    };
    
    // Converter a data se existir
    if (expense.date) {
      updateData.date = new Date(expense.date);
    }
    
    await updateDoc(expenseRef, updateData);
    return id;
  } catch (error) {
    console.error('Erro ao atualizar despesa:', error);
    throw error;
  }
};

// Excluir despesa
export const deleteExpense = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'despesas', id));
    return id;
  } catch (error) {
    console.error('Erro ao excluir despesa:', error);
    throw error;
  }
};

// Buscar todas as despesas do usuário
export const getUserExpenses = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'despesas'),
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
      } as Expense;
    });
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    throw error;
  }
};

// Buscar despesas por período
export const getExpensesByPeriod = async (userId: string, startDate: Date, endDate: Date) => {
  try {
    const q = query(
      collection(db, 'despesas'),
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
      } as Expense;
    });
  } catch (error) {
    console.error('Erro ao buscar despesas por período:', error);
    throw error;
  }
};

// Buscar despesas por categoria
export const getExpensesByCategory = async (userId: string, category: string) => {
  try {
    const q = query(
      collection(db, 'despesas'),
      where('userId', '==', userId),
      where('category', '==', category),
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
      } as Expense;
    });
  } catch (error) {
    console.error('Erro ao buscar despesas por categoria:', error);
    throw error;
  }
};

// Buscar despesa por ID
export const getExpenseById = async (id: string) => {
  try {
    const docRef = doc(db, 'despesas', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
      } as Expense;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar despesa por ID:', error);
    throw error;
  }
};
