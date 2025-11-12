import React from 'react';
import { DashboardIcon, TransactionsIcon, ReportsIcon, SettingsIcon, LogoIcon, XIcon } from '../icons/Icons';
import type { Page } from '../../types';
import { Page as PageEnum } from '../../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-2 text-base font-normal rounded-lg transition-colors duration-150
        ${
          isActive
            ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-white'
            : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-border-dark'
        }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setOpen }) => {
  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    if (window.innerWidth < 1024) { // lg breakpoint
      setOpen(false);
    }
  };
    
  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setOpen(false)}></div>
      <aside className={`absolute lg:relative z-30 w-64 h-full transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 bg-white dark:bg-surface border-r border-gray-200 dark:border-border-dark`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <LogoIcon className="h-8 w-8 text-primary" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white ml-2">Controle de Gastos</span>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400">
            <XIcon className="w-6 h-6"/>
          </button>
        </div>
        <nav className="px-3 py-4">
          <ul className="space-y-2">
            <NavItem
              icon={<DashboardIcon className="w-6 h-6" />}
              label="Dashboard"
              isActive={currentPage === PageEnum.Dashboard}
              onClick={() => handleNavigation(PageEnum.Dashboard)}
            />
            <NavItem
              icon={<TransactionsIcon className="w-6 h-6" />}
              label="Lançamentos"
              isActive={currentPage === PageEnum.Transactions}
              onClick={() => handleNavigation(PageEnum.Transactions)}
            />
            <NavItem
              icon={<ReportsIcon className="w-6 h-6" />}
              label="Relatórios"
              isActive={currentPage === PageEnum.Reports}
              onClick={() => handleNavigation(PageEnum.Reports)}
            />
            <NavItem
              icon={<SettingsIcon className="w-6 h-6" />}
              label="Comprovantes"
              isActive={currentPage === PageEnum.Settings}
              onClick={() => handleNavigation(PageEnum.Settings)}
            />
          </ul>
        </nav>
      </aside>
    </>
  );
};