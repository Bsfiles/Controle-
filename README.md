<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 💰 Controle de Gastos - Aplicativo de Gestão Financeira

Aplicativo web moderno para controle e acompanhamento de despesas pessoais e empresariais com integração Supabase.

## 🚀 Características

- 📊 Dashboard com visualização de gastos
- 📝 Gerenciamento de transações
- 📈 Relatórios detalhados
- 🌙 Modo claro/escuro
- 💾 Sincronização com Supabase
- 📱 Design responsivo

## 📋 Pré-requisitos

- Node.js (v16+)
- npm ou yarn
- Conta Supabase (para dados em nuvem)

## 🔧 Instalação e Configuração Local

### 1. Clonar o repositório
```bash
git clone https://github.com/Bsfiles/Controle-.git
cd controle-de-gastos
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com:
```
GEMINI_API_KEY=sua-chave-gemini-aqui
VITE_SUPABASE_URL=https://fmxrottaqjusasuegtcl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteHJvdHRhcWp1c2FzdWVndGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MTIyNjcsImV4cCI6MjA3ODQ4ODI2N30.zj3nGvLN7b5ty30YcXJcBfaN_PqIcRlqB3y5Wro7Tuw
```

### 4. Executar localmente
```bash
npm run dev
```

O app estará disponível em `http://localhost:3000`

## 🌐 Deploy no Netlify

### Passo 1: Push para GitHub
```bash
git add .
git commit -m "Initial commit with Supabase configuration"
git push origin main
```

### Passo 2: Conectar ao Netlify
1. Acesse [Netlify](https://netlify.com)
2. Clique em "New site from Git"
3. Selecione seu repositório GitHub
4. Configure Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### Passo 3: Adicionar variáveis de ambiente
1. Vá em **Site settings → Build & Deploy → Environment**
2. Adicione as seguintes variáveis:
   - `VITE_SUPABASE_URL`: `https://fmxrottaqjusasuegtcl.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: (sua chave anonima)
   - `GEMINI_API_KEY`: (sua chave Gemini)

### Passo 4: Deploy
1. Clique em **Trigger deploy**
2. Aguarde o build e deploy completarem
3. Acesse sua URL do Netlify

## 📦 Scripts disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Visualiza build de produção localmente
```

## 🏗️ Estrutura do Projeto

```
├── components/          # Componentes React
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── ui/            # UI components (Button, Card)
│   └── icons/         # Ícones
├── pages/             # Páginas principais
├── src/
│   └── lib/          # Serviços (Supabase)
├── types.ts          # Tipos TypeScript
├── constants.ts      # Constantes e mocks
├── App.tsx           # Componente principal
└── index.tsx         # Entry point
```

## 🔐 Segurança

- ⚠️ **NUNCA** commit `.env.local` no Git
- Use `.env.example` como template
- Mantenha suas chaves no Netlify Environment Variables

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

[Bsfiles](https://github.com/Bsfiles)

---

**Status:** ✅ Configurado e pronto para deploy no Netlify
