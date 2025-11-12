
import { supabase } from './src/lib/supabase';
import type { Transaction, Account, Category } from './types';

// Fallback mock data in case Supabase is not available
export const mockAccounts: Account[] = [];

export const mockCategories: Category[] = [];

export const mockTransactions: Transaction[] = [];

// Supabase data fetching functions
export async function fetchAccounts(): Promise<Account[]> {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || mockAccounts;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return mockAccounts;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || mockCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return mockCategories;
  }
}

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || mockTransactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return mockTransactions;
  }
}

export async function addTransactionToDB(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    // Fallback: create with local ID
    return {
      ...transaction,
      id: `txn_${Date.now()}`,
    };
  }
}
