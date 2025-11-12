
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { XIcon } from './icons/Icons';
import type { Account, Category, Transaction } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  accounts: Account[];
  categories: Category[];
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState<'credit' | 'debit'>('debit');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [purpose, setPurpose] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'dinheiro' | 'cartao' | 'transferencia'>('dinheiro');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !purpose) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onSave({
      companyId: 'c1',
      userId: 'u1', // Mocked user
      type,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      purpose,
      paymentMethod,
      reconciled: false,
    });

    // Reset form
    setAmount('');
    setPurpose('');
  };

  if (!isOpen) return null;

  const inputBaseClasses = "w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-dark dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-surface rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b dark:border-border-dark">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Novo Lançamento</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <Button type="button" variant={type === 'debit' ? 'danger' : 'secondary'} onClick={() => setType('debit')}>Saída</Button>
              <Button type="button" variant={type === 'credit' ? 'primary' : 'secondary'} onClick={() => setType('credit')}>Entrada</Button>
            </div>
            
            <div>
              <label htmlFor="amount" className="block font-medium mb-1">Valor</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} step="0.01" placeholder="0,00" required className={inputBaseClasses} />
            </div>

            <div>
              <label htmlFor="date" className="block font-medium mb-1">Data</label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className={inputBaseClasses} />
            </div>

            <div>
              <label htmlFor="purpose" className="block font-medium mb-1">Finalidade</label>
              <input type="text" id="purpose" value={purpose} onChange={e => setPurpose(e.target.value)} required className={inputBaseClasses} />
            </div>

             <div>
                <label htmlFor="paymentMethod" className="block font-medium mb-1">Forma de Pagamento</label>
                <select id="paymentMethod" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} required className={inputBaseClasses}>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao">Cartão</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>
          </div>
          <div className="flex justify-end items-center p-4 border-t dark:border-border-dark space-x-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
