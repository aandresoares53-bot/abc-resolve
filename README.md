# ABCResolve - Marketplace de Prestadores de Serviços

Plataforma responsiva para gerenciamento e busca de prestadores de serviços na região do ABC (Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá e Ribeirão Pires).

## 🚀 Recursos

- **Autenticação por Email e Senha** - Login simples sem confirmação de email
- **Dashboard para Prestadores** - Gerencie seus serviços e informações
- **Busca de Prestadores** - Consumidores podem buscar por tipo de serviço e cidade
- **Design Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- **Banco de Dados SQLite D1** - Armazenamento escalável no Cloudflare
- **Deploy no Cloudflare Pages** - Publicação rápida e segura

## 📦 Tecnologias

- **Next.js 16** - Framework React moderno
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização responsiva
- **Cloudflare Pages** - Hospedagem
- **Cloudflare D1** - Banco de dados SQLite
- **Cloudflare Workers** - API serverless

## 🛠️ Instalação Local

### Pré-requisitos
- Node.js 18+ ou superior
- npm ou yarn
- Conta Cloudflare com acesso ao D1

### Passos

1. **Clonar o repositório**
```bash
cd abc-resolve
```

2. **Instalar dependências**
```bash
npm install --legacy-peer-deps
# ou
yarn install
```

3. **Configurar variáveis de ambiente**
```bash
cp .env.example .env.local
```
Edite `.env.local` e adicione suas credenciais do Cloudflare.

4. **Executar em desenvolvimento**
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

5. **Build para produção**
```bash
npm run build
npm start
```

## 📋 Fluxo de Uso

### Para Consumidores
1. Acessar página inicial
2. Clicar em "Sou Consumidor"
3. Login ou Registro (email/senha)
4. Buscar prestadores por tipo de serviço e cidade
5. Visualizar informações de contato dos prestadores

### Para Prestadores
1. Acessar página inicial
2. Clicar em "Sou Prestador"
3. Criar conta (nome, email, senha, telefone, tipo de serviço, cidade)
4. Acessar dashboard
5. Adicionar e gerenciar serviços
6. Atualizar perfil

## 🌐 Publicação no Cloudflare Pages

### Passo 1: Instalar Wrangler CLI
```bash
npm install -g wrangler
```

### Passo 2: Autenticar com Cloudflare
```bash
wrangler login
```

### Passo 3: Criar Banco de Dados D1
```bash
wrangler d1 create abc-resolve-db
```

### Passo 4: Atualizar wrangler.toml
Atualize `database_id` com o ID obtido no passo anterior.

### Passo 5: Deploy
```bash
# Opção A: Deploy via Git (recomendado)
git push origin main

# Opção B: Deploy direto
wrangler pages deploy
```

### Passo 6: Configurar D1 na conta Cloudflare
1. Acesse seu dashboard do Cloudflare
2. Vá para Pages > seu projeto > Settings
3. Configure as variáveis de ambiente com suas credenciais D1

## 📱 Estrutura do Projeto

```
abc-resolve/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── services/
│   │   └── users/
│   ├── components/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── search/
│   ├── styles/
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── db.ts
├── public/
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── wrangler.toml
```

## 🔐 Segurança

- Senhas são hashadas com SHA-256
- Tokens JWT para autenticação
- Validação de email
- Proteção CORS
- Variáveis de ambiente para dados sensíveis

## 📝 Variáveis de Ambiente

```env
# Cloudflare
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=seu_account_id
NEXT_PUBLIC_CLOUDFLARE_DATABASE_ID=seu_database_id
CLOUDFLARE_API_TOKEN=seu_token

# Database
DATABASE_URL=sua_url_d1

# Auth
JWT_SECRET=sua_chave_secreta
```

## 🤝 Contribuindo

Para reportar bugs ou sugerir melhorias, abra uma issue no repositório.

## 📄 Licença

Este projeto está licenciado sob a Licença ISC.

## 🆘 Suporte

Para dúvidas, entre em contato através do email: aandresoares53@gmail.com
