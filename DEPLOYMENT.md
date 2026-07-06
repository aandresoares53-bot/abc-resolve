# Guia de Deployment - ABCResolve

## 🚀 Publicar no Cloudflare Pages

### Pré-requisitos
- Conta Cloudflare ativa
- Repositório Git (GitHub, GitLab ou Gitea)
- CLI do Wrangler instalado (opcional)

### Opção 1: Deploy via Git (Recomendado)

#### Passo 1: Preparar o Repositório Git

```bash
cd C:\Users\andre.soares\Documents\Sistemas\abc-resolve

# Inicializar repositório Git (se ainda não foi feito)
git init
git add .
git commit -m "Initial commit: ABCResolve marketplace"

# Adicionar repositório remoto
git remote add origin https://github.com/seu-usuario/abc-resolve.git
git branch -M main
git push -u origin main
```

#### Passo 2: Conectar ao Cloudflare Pages

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. Selecione sua conta
3. Vá para **Pages** no menu à esquerda
4. Clique em **"Create a project"** > **"Connect to Git"**
5. Autorize o Cloudflare a acessar seu repositório
6. Selecione o repositório `abc-resolve`
7. Clique em **"Begin setup"**

#### Passo 3: Configurar Build Settings

Na página de configuração do Cloudflare Pages:

- **Project name**: `abc-resolve`
- **Production branch**: `main`
- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Node version**: `18.17.0` ou superior

#### Passo 4: Configurar Variáveis de Ambiente

Antes de fazer deploy, adicione as variáveis:

1. Em **Settings** > **Environment variables**, adicione:
   - `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID` = seu account ID
   - `CLOUDFLARE_API_TOKEN` = seu API token
   - `DATABASE_URL` = URL do banco D1

#### Passo 5: Deploy Automático

Após configurar, qualquer push para a branch `main` fará deploy automaticamente.

```bash
# Fazer push para triggar deploy
git push origin main
```

### Opção 2: Deploy Manual com Wrangler

#### Passo 1: Instalar Wrangler

```bash
npm install -g wrangler
```

#### Passo 2: Autenticar

```bash
wrangler login
```

Isso abrirá o navegador para você autorizar.

#### Passo 3: Criar Banco de Dados D1

```bash
wrangler d1 create abc-resolve-db --location wnam

# Anote o database_id retornado
# Atualize o wrangler.toml com este ID
```

#### Passo 4: Inicializar Banco de Dados

```bash
# Aplicar schema SQL
wrangler d1 execute abc-resolve-db --file ./app/lib/db.ts
```

#### Passo 5: Deploy

```bash
# Build da aplicação
npm run build

# Deploy no Cloudflare Pages
wrangler pages deploy out
```

## 🗄️ Configurar Banco de Dados D1

### Criar Banco via Dashboard

1. Acesse **Workers & Pages** > **D1**
2. Clique em **Create database**
3. Nome: `abc-resolve-db`
4. Clique em **Create**

### Aplicar Schema SQL

No Cloudflare Dashboard:

1. Vá para seu banco D1 (`abc-resolve-db`)
2. Selecione a aba **Console**
3. Execute o SQL em `app/lib/db.ts`

### Ou via CLI:

```bash
wrangler d1 execute abc-resolve-db --remote --file schema.sql
```

## 📝 Arquivo de Configuração do Cloudflare

### wrangler.toml

```toml
name = "abc-resolve"
type = "javascript"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "abc-resolve-db"
database_id = "seu_database_id_aqui"

[env.production]
name = "abc-resolve-prod"
account_id = "seu_account_id_aqui"
workers_dev = false
```

## 🔑 Obter Credenciais do Cloudflare

### Account ID

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. Selecione sua conta
3. Na barra lateral, vá para **Pages**
4. O Account ID está visível na URL ou em **Account Details**

### API Token

1. Acesse [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Clique em **Create Token**
3. Use o template "Edit Cloudflare Workers"
4. Confirme as permissões
5. Copie o token gerado

### Database ID

Após criar o banco D1:

```bash
wrangler d1 list
```

A saída mostrará todos seus bancos com seus IDs.

## 🧪 Testar em Desenvolvimento

Antes de fazer deploy, teste localmente:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

Teste os fluxos:
- [ ] Página inicial carrega corretamente
- [ ] Login de consumidor funciona
- [ ] Login de prestador funciona
- [ ] Registro de novo usuário funciona
- [ ] Busca de prestadores funciona
- [ ] Dashboard de prestador carrega
- [ ] Adicionar serviço funciona

## 📊 Monitorar Deploy

### Via Dashboard do Cloudflare

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. Vá para **Pages** > **abc-resolve**
3. Veja o histórico de deploys em **Deployments**

### Ver Logs

```bash
wrangler pages deployment tail abc-resolve
```

## ⚠️ Troubleshooting

### Erro: "Cannot find module"

- Verifique se todas as dependências foram instaladas: `npm install`
- Execute `npm run build` novamente

### Erro de Autenticação

- Verifique se as variáveis de ambiente estão corretas
- Teste o token com: `wrangler whoami`

### Banco de dados não conecta

- Verifique o database_id no wrangler.toml
- Confirme que as credenciais estão corretas

### Build fails no Cloudflare

- Verifique os logs no dashboard
- Certifique-se de que a versão do Node é 18+
- Teste `npm run build` localmente

## 🔒 Segurança

### Variáveis Sensíveis

Nunca faça commit de `.env` ou `.env.local`:

```bash
# .gitignore deve incluir:
.env
.env.local
.env.*.local
```

### Credenciais D1

Armazene database binding apenas em variáveis de ambiente do Cloudflare.

### Rotação de Tokens

Rotinariamente atualize seus API tokens em [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)

## 📞 Suporte

Para dúvidas sobre Cloudflare:
- [Cloudflare Docs](https://developers.cloudflare.com)
- [Cloudflare Community](https://community.cloudflare.com)

Para dúvidas sobre ABCResolve:
- Email: aandresoares53@gmail.com
