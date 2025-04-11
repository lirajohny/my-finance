import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ArrowDownCircleIcon, 
  ArrowUpCircleIcon, 
  TagIcon, 
  ChartPieIcon, 
  Cog6ToothIcon,
  Bars3Icon, 
  XMarkIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { theme, setTheme, isDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navigation = [
    { name: 'Dashboard', to: '/', icon: HomeIcon },
    { name: 'Receitas', to: '/incomes', icon: ArrowUpCircleIcon },
    { name: 'Despesas', to: '/expenses', icon: ArrowDownCircleIcon },
    { name: 'Categorias', to: '/categories', icon: TagIcon },
    { name: 'Relatórios', to: '/reports', icon: ChartPieIcon },
    { name: 'Configurações', to: '/settings', icon: Cog6ToothIcon },
  ];

  const ThemeToggle = () => (
    <div className="flex items-center space-x-2 mt-4 p-2 rounded-lg">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-lg ${theme === 'light' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        title="Modo claro"
      >
        <SunIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        title="Modo escuro"
      >
        <MoonIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-lg ${theme === 'system' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        title="Usar configurações do sistema"
      >
        <ComputerDesktopIcon className="h-5 w-5" />
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-30 h-full w-64 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary">PersonalFinance</h1>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="font-medium mb-2 text-gray-500 dark:text-gray-400">
            Olá, {currentUser?.displayName || 'Usuário'}
          </div>
        </div>

        <nav className="mt-2">
          <ul>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.to}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-base font-medium transition-colors ${isActive
                        ? 'bg-primary/10 text-primary border-r-4 border-primary'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-4 py-2 text-sm text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <h1 className="text-lg font-bold text-gray-800 dark:text-white lg:ml-0 ml-4">
              {title}
            </h1>

            <div className="flex items-center">
              {/* Adicione notíficações, perfil, etc aqui */}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>

        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          PersonalFinance &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default Layout;
