import React from 'react';
import { UserCircleIcon, BellIcon, MenuIcon, SunIcon, MoonIcon } from '../icons/Icons';

interface HeaderProps {
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, theme, toggleTheme }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-surface border-b border-gray-200 dark:border-border-dark">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-300 focus:outline-none lg:hidden">
          <MenuIcon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white ml-4">Controle de Gastos</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none p-2 rounded-full hover:bg-gray-100 dark:hover:bg-border-dark"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
        </button>
        <button className="relative text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <UserCircleIcon className="h-8 w-8 text-gray-500 dark:text-gray-300" />
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-800 dark:text-white">Admin User</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">admin@ledgerpro.com</div>
          </div>
        </div>
      </div>
    </header>
  );
};