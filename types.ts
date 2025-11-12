
export enum Page {
  Dashboard = 'dashboard',
  Transactions = 'transactions',
  Reports = 'reports',
  Receipts = 'receipts',
  Settings = 'settings',
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit';
  balance: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'revenue' | 'expense';
  parentId?: string | null;
}

export interface Transaction {
  id: string;
  companyId: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string; // ISO 8601 format
  purpose: string;
  paymentMethod: 'dinheiro' | 'cartao' | 'transferencia';
  reference?: string;
  documentUrl?: string;
  reconciled: boolean;
}
