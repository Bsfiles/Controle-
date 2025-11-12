
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { fetchTransactions, fetchAccounts, fetchCategories, addTransactionToDB, mockTransactions, mockAccounts, mockCategories } from './constants';
import { supabase } from './src/lib/supabase';
import type { Transaction, Account, Category } from './types';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [manualBalance, setManualBalance] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('theme', theme);
    } catch (e) {
      console.error('Failed to save theme to localStorage', e);
    }
  }, [theme]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transactionsData, accountsData, categoriesData] = await Promise.all([
          fetchTransactions(),
          fetchAccounts(),
          fetchCategories(),
        ]);
        setTransactions(transactionsData);
        setAccounts(accountsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to mock data
        setTransactions(mockTransactions);
        setAccounts(mockAccounts);
        setCategories(mockCategories);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const addTransaction = useCallback(async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      const addedTransaction = await addTransactionToDB(newTransaction);
      setTransactions(prev => [addedTransaction, ...prev]);
      // Update manual balance if set
      if (manualBalance !== null) {
        const adjustment = newTransaction.type === 'credit' ? newTransaction.amount : -newTransaction.amount;
        setManualBalance(prev => (prev || 0) + adjustment);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      // Fallback: add locally
      const localTransaction = {
        ...newTransaction,
        id: `txn_${Date.now()}`,
      };
      setTransactions(prev => [localTransaction, ...prev]);
      // Update manual balance if set
      if (manualBalance !== null) {
        const adjustment = newTransaction.type === 'credit' ? newTransaction.amount : -newTransaction.amount;
        setManualBalance(prev => (prev || 0) + adjustment);
      }
    }
  }, [manualBalance]);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    try {
      // Try to delete from Supabase
      await supabase.from('transactions').delete().eq('id', transactionId);
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      // Update manual balance if set
      const transaction = transactions.find(t => t.id === transactionId);
      if (manualBalance !== null && transaction) {
        const adjustment = transaction.type === 'credit' ? -transaction.amount : transaction.amount;
        setManualBalance(prev => (prev || 0) + adjustment);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      // Fallback: delete locally
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      // Update manual balance if set
      const transaction = transactions.find(t => t.id === transactionId);
      if (manualBalance !== null && transaction) {
        const adjustment = transaction.type === 'credit' ? -transaction.amount : transaction.amount;
        setManualBalance(prev => (prev || 0) + adjustment);
      }
    }
  }, [manualBalance, transactions]);

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-lg">Carregando...</div>
        </div>
      );
    }

    switch (currentPage) {
      case Page.Dashboard:
        return <DashboardPage transactions={transactions} manualBalance={manualBalance} setManualBalance={setManualBalance} />;
      case Page.Transactions:
        return <TransactionsPage transactions={transactions} addTransaction={addTransaction} deleteTransaction={deleteTransaction} accounts={accounts} categories={categories} />;
      case Page.Reports:
        return <ReportsPage transactions={transactions} />;
      case Page.Settings:
        return <SettingsPage />;
      default:
        return <DashboardPage transactions={transactions} manualBalance={manualBalance} setManualBalance={setManualBalance} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-dark">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-dark p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
