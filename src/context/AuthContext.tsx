import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { User } from '../types';

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Converte o usuário do Firebase para nosso tipo de usuário
  const formatUser = (user: FirebaseUser | null): User | null => {
    if (!user) return null;
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    };
  };

  // Registro de novo usuário
  async function register(email: string, password: string, name: string) {
    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualiza o perfil com o nome
      await updateProfile(user, { displayName: name });
      
      // Cria o documento do usuário
      await setDoc(doc(db, 'usuarios', user.uid), {
        email: user.email,
        displayName: name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Criar categorias padrão para o usuário
      await createDefaultCategories(user.uid);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Login
  async function login(email: string, password: string) {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Logout
  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  // Reset de senha
  async function resetPassword(email: string) {
    try {
      // Todo: implementar reset de senha
      // await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw error;
    }
  }

  // Criar categorias padrão para um novo usuário
  async function createDefaultCategories(userId: string) {
    try {
      // Categorias de receita padrão
      const defaultIncomeCategories = [
        { name: 'Salário', color: '#3b82f6', icon: 'briefcase' },
        { name: 'Investimentos', color: '#10b981', icon: 'chart-bar' },
        { name: 'Freelance', color: '#8b5cf6', icon: 'code' },
        { name: 'Outros', color: '#6b7280', icon: 'dots-horizontal' }
      ];
      
      // Categorias de despesa padrão
      const defaultExpenseCategories = [
        { name: 'Alimentação', color: '#ef4444', icon: 'shopping-cart', budget: 0 },
        { name: 'Moradia', color: '#f59e0b', icon: 'home', budget: 0 },
        { name: 'Transporte', color: '#3b82f6', icon: 'truck', budget: 0 },
        { name: 'Lazer', color: '#8b5cf6', icon: 'ticket', budget: 0 },
        { name: 'Saúde', color: '#10b981', icon: 'heart', budget: 0 },
        { name: 'Educação', color: '#6366f1', icon: 'academic-cap', budget: 0 },
        { name: 'Serviços', color: '#ec4899', icon: 'light-bulb', budget: 0 },
        { name: 'Outros', color: '#6b7280', icon: 'dots-horizontal', budget: 0 }
      ];

      // Adiciona categorias de receita
      for (const category of defaultIncomeCategories) {
        const categoryRef = doc(db, 'categorias_receita', `${userId}_${category.name}`);
        await setDoc(categoryRef, {
          ...category,
          type: 'income',
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // Adiciona categorias de despesa
      for (const category of defaultExpenseCategories) {
        const categoryRef = doc(db, 'categorias_despesa', `${userId}_${category.name}`);
        await setDoc(categoryRef, {
          ...category,
          type: 'expense',
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Erro ao criar categorias padrão:', error);
      throw error;
    }
  }

  // Observa mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(formatUser(user));
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
