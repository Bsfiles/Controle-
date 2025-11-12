-- Create tables for expense control app

-- Accounts table
CREATE TABLE accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cash', 'bank', 'credit')),
  balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('revenue', 'expense')),
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  purpose TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('dinheiro', 'cartao', 'transferencia')),
  reference TEXT,
  document_url TEXT,
  reconciled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data (optional - you can remove this section if you don't want sample data)
-- INSERT INTO accounts (name, type, balance) VALUES
--   ('Caixa Principal', 'cash', 7500.50),
--   ('Banco ABC', 'bank', 150000.00),
--   ('Cartão Corporativo', 'credit', -5000.00);

-- INSERT INTO categories (name, type) VALUES
--   ('Receita: Vendas', 'revenue'),
--   ('Receita: Serviços', 'revenue'),
--   ('Despesa: Aluguel', 'expense'),
--   ('Despesa: Salários', 'expense'),
--   ('Despesa: Material de Escritório', 'expense'),
--   ('Despesa: Marketing', 'expense'),
--   ('Despesa: Insumos', 'expense');

-- INSERT INTO transactions (company_id, user_id, type, amount, date, purpose, payment_method, reference, reconciled) VALUES
--   ('c1', 'u1', 'credit', 5000, '2025-10-01T10:00:00Z', 'Pagamento contrato ABC', 'transferencia', 'REC-001', true),
--   ('c1', 'u2', 'debit', 1200, '2025-10-02T11:00:00Z', 'Aluguel setembro', 'transferencia', 'NF-100', true),
--   ('c1', 'u2', 'debit', 300, '2025-10-03T14:30:00Z', 'Compra material escritório', 'dinheiro', 'NF-101', false),
--   ('c1', 'u3', 'credit', 2500, '2025-10-05T16:00:00Z', 'Venda produto X', 'cartao', 'REC-002', false),
--   ('c1', 'u1', 'debit', 4500, '2025-10-10T09:00:00Z', 'Adiantamento salarial', 'transferencia', 'PAY-001', true),
--   ('c1', 'u2', 'debit', 800, '2025-10-12T18:00:00Z', 'Campanha de Ads', 'cartao', 'AD-554', false),
--   ('c1', 'u3', 'credit', 1250, '2025-10-15T12:00:00Z', 'Venda produto Y', 'dinheiro', 'REC-003', true),
--   ('c1', 'u2', 'debit', 1500.50, '2025-11-05T14:30:00Z', 'Compra de insumos - projeto X', 'transferencia', 'NF-1234', false);
