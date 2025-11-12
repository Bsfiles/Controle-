import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlusIcon } from '../components/icons/Icons';
import TransactionModal from '../components/TransactionModal';
import type { Transaction, Account, Category } from '../types';

interface TransactionsPageProps {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (transactionId: string) => void;
  accounts: Account[];
  categories: Category[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, addTransaction, deleteTransaction, accounts, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [filterMonth, setFilterMonth] = useState<string>('Todos');
  const [filterYear, setFilterYear] = useState<number | 'Todos'>('Todos');
  const [filterType, setFilterType] = useState<'Todos' | 'credit' | 'debit'>('Todos');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesText = t.purpose.toLowerCase().includes(filter.toLowerCase()) || t.amount.toString().includes(filter);
      const matchesMonth = filterMonth === 'Todos' || new Date(t.date).toLocaleString('pt-BR', { month: 'long' }) === filterMonth;
      const matchesYear = filterYear === 'Todos' || new Date(t.date).getFullYear() === filterYear;
      const matchesType = filterType === 'Todos' || t.type === filterType;
      return matchesText && matchesMonth && matchesYear && matchesType;
    });
  }, [transactions, filter, filterMonth, filterYear, filterType]);
  
  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    addTransaction(newTransaction);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Lançamentos</h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Filtrar por finalidade..."
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-surface dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary dark:placeholder-gray-400"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button onClick={() => setIsModalOpen(true)} leftIcon={<PlusIcon className="w-5 h-5" />}>
            Novo Lançamento
          </Button>
        </div>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mês</label>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="px-3 py-2 border rounded-md bg-white dark:bg-surface dark:border-border-dark">
              <option value="Todos">Todos</option>
              <option value="janeiro">Janeiro</option>
              <option value="fevereiro">Fevereiro</option>
              <option value="março">Março</option>
              <option value="abril">Abril</option>
              <option value="maio">Maio</option>
              <option value="junho">Junho</option>
              <option value="julho">Julho</option>
              <option value="agosto">Agosto</option>
              <option value="setembro">Setembro</option>
              <option value="outubro">Outubro</option>
              <option value="novembro">Novembro</option>
              <option value="dezembro">Dezembro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ano</label>
            <select value={filterYear} onChange={e => setFilterYear(e.target.value === 'Todos' ? 'Todos' : parseInt(e.target.value))} className="px-3 py-2 border rounded-md bg-white dark:bg-surface dark:border-border-dark">
              <option value="Todos">Todos</option>
              {Array.from({ length: 10 }, (_, i) => 2025 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value as 'Todos' | 'credit' | 'debit')} className="px-3 py-2 border rounded-md bg-white dark:bg-surface dark:border-border-dark">
              <option value="Todos">Todos</option>
              <option value="credit">Entrada</option>
              <option value="debit">Saída</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-300">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-surface dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Data</th>
                <th scope="col" className="px-6 py-3">Finalidade</th>
                <th scope="col" className="px-6 py-3 text-right">Valor</th>
                <th scope="col" className="px-6 py-3 text-center">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id} className="bg-white border-b dark:bg-surface dark:border-border-dark hover:bg-gray-50 dark:hover:bg-border-dark">
                  <td className="px-6 py-4">{formatDate(t.date)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{t.purpose}</td>
                  <td className={`px-6 py-4 text-right font-medium ${t.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                    {t.type === 'credit' ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {t.type === 'credit' ? (
                       <span className="px-2.5 py-1 text-xs font-semibold uppercase text-white rounded-md" style={{ backgroundColor: '#2ECC71' }}>
                         ENTRADA
                       </span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-semibold uppercase text-white bg-danger rounded-md">
                        SAÍDA
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => deleteTransaction(t.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddTransaction}
          accounts={accounts}
          categories={categories}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
