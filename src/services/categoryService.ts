import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Category } from '../types';

// Adicionar nova categoria
export const addCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const categoryId = `${category.userId}_${category.name}`;
    const docRef = doc(db, category.type === 'income' ? 'categorias_receita' : 'categorias_despesa', categoryId);
    
    // Filter out undefined values to avoid Firestore errors
    const categoryData = Object.entries(category).reduce((acc: any, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    await setDoc(docRef, {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return categoryId;
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    throw error;
  }
};

// Atualizar categoria existente
export const updateCategory = async (id: string, category: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>, type: 'income' | 'expense') => {
  try {
    const collectionName = type === 'income' ? 'categorias_receita' : 'categorias_despesa';
    const categoryRef = doc(db, collectionName, id);
    
    // Filter out undefined values to avoid Firestore errors
    const categoryData = Object.entries(category).reduce((acc: any, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const updateData = {
      ...categoryData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(categoryRef, updateData);
    return id;
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }
};

// Excluir categoria
export const deleteCategory = async (id: string, type: 'income' | 'expense') => {
  try {
    const collectionName = type === 'income' ? 'categorias_receita' : 'categorias_despesa';
    await deleteDoc(doc(db, collectionName, id));
    return id;
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    throw error;
  }
};

// Buscar todas as categorias de receita do usuário
export const getUserIncomeCategories = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'categorias_receita'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
      } as Category;
    });
  } catch (error) {
    console.error('Erro ao buscar categorias de receita:', error);
    throw error;
  }
};

// Buscar todas as categorias de despesa do usuário
export const getUserExpenseCategories = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'categorias_despesa'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
      } as Category;
    });
  } catch (error) {
    console.error('Erro ao buscar categorias de despesa:', error);
    throw error;
  }
};
