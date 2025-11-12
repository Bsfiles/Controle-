import React, { useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { Transaction } from '../types';
// FIX: Import DashboardIcon from ../components/icons/Icons to fix the 'Cannot find name' error.
import { ArrowUpIcon, ArrowDownIcon, DashboardIcon, EditIcon, XIcon } from '../components/icons/Icons';

interface DashboardPageProps {
  transactions: Transaction[];
  manualBalance: number | null;
  setManualBalance: (balance: number | null) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const KpiCard: React.FC<{ title: string; value: string; change?: number; icon: React.ReactNode; onEdit?: () => void }> = ({ title, value, change, icon, onEdit }) => (
    <Card>
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                    {icon}
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-text-secondary-dark">{title}</h3>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
                </div>
            </div>
            {onEdit && (
                <button onClick={onEdit} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <EditIcon className="w-5 h-5" />
                </button>
            )}
        </div>
        {change !== undefined && (
            <div className={`mt-4 flex items-center text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                <span className="ml-1">{Math.abs(change)}% vs. Mês Anterior</span>
            </div>
        )}
    </Card>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ transactions, manualBalance, setManualBalance }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBalanceValue, setEditBalanceValue] = useState('');

  const kpiData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const revenues = transactions
      .filter(t => t.type === 'credit' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'debit' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = transactions.reduce((acc, t) => acc + (t.type === 'credit' ? t.amount : -t.amount), 0);

    // Calculate previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const prevRevenues = transactions
      .filter(t => t.type === 'credit' && new Date(t.date).getMonth() === prevMonth && new Date(t.date).getFullYear() === prevYear)
      .reduce((sum, t) => sum + t.amount, 0);

    const prevExpenses = transactions
      .filter(t => t.type === 'debit' && new Date(t.date).getMonth() === prevMonth && new Date(t.date).getFullYear() === prevYear)
      .reduce((sum, t) => sum + t.amount, 0);

    const revenueChange = prevRevenues > 0 ? ((revenues - prevRevenues) / prevRevenues) * 100 : 0;
    const expenseChange = prevExpenses > 0 ? ((expenses - prevExpenses) / prevExpenses) * 100 : 0;

    return { revenues, expenses, balance, revenueChange, expenseChange };
  }, [transactions]);

  const currentBalance = manualBalance !== null ? manualBalance : kpiData.balance;

  const handleEditBalance = () => {
    setEditBalanceValue(currentBalance.toString());
    setIsEditModalOpen(true);
  };

  const handleSaveBalance = () => {
    const value = parseFloat(editBalanceValue);
    if (!isNaN(value)) {
      setManualBalance(value);
    }
    setIsEditModalOpen(false);
  };

  const chartData = useMemo(() => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let cumulativeBalance = 0;
    const balanceByDay: { [key: string]: number } = {};

    sortedTransactions.forEach(t => {
      cumulativeBalance += t.type === 'credit' ? t.amount : -t.amount;
      const date = new Date(t.date).toLocaleDateString('pt-BR');
      balanceByDay[date] = cumulativeBalance;
    });

    return Object.keys(balanceByDay).map(date => ({
      date,
      Saldo: balanceByDay[date],
    }));
  }, [transactions]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard title="Saldo Atual" value={formatCurrency(currentBalance)} icon={<DashboardIcon className="h-6 w-6"/>} onEdit={handleEditBalance} />
        <KpiCard title="Receitas do Mês" value={formatCurrency(kpiData.revenues)} change={kpiData.revenueChange} icon={<ArrowUpIcon className="h-6 w-6 text-green-500"/>} />
        <KpiCard title="Despesas do Mês" value={formatCurrency(kpiData.expenses)} change={kpiData.expenseChange} icon={<ArrowDownIcon className="h-6 w-6 text-red-500"/>} />
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Evolução do Saldo</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-border-dark" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis tickFormatter={(value) => formatCurrency(value as number)} className="text-xs" />
              <Tooltip
                formatter={(value) => [formatCurrency(value as number), 'Saldo']}
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #2C2C2C', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#A0A0A0' }}
              />
              <Legend />
              <Line type="monotone" dataKey="Saldo" stroke="#D69E2E" strokeWidth={2} activeDot={{ r: 8 }} dot={{r:4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-surface rounded-lg shadow-xl w-full max-w-md max-h-full overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b dark:border-border-dark">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Editar Saldo Atual</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div>
                <label htmlFor="balance" className="block font-medium mb-1">Saldo Atual (R$)</label>
                <input
                  type="number"
                  id="balance"
                  value={editBalanceValue}
                  onChange={e => setEditBalanceValue(e.target.value)}
                  step="0.01"
                  placeholder="0,00"
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-dark dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex justify-end items-center p-4 border-t dark:border-border-dark space-x-2">
              <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveBalance}>Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
