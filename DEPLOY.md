# Deploy — ABCResolve

## Pré-requisitos
- Node.js 20+
- Conta Cloudflare com Workers/Pages habilitados
- Wrangler CLI (`npm i -g wrangler`)

## 1. Instalar dependências
```bash
npm install
```

## 2. Login no Cloudflare
```bash
wrangler login
```

## 3. Criar banco D1
```bash
npm run db:create
```
Copie o `database_id` retornado e atualize `wrangler.toml`.

## 4. Aplicar schema (local)
```bash
npm run db:migrate:local
```

## 5. Aplicar schema (produção)
```bash
npm run db:migrate
```

## 6. Configurar variável de ambiente (senha admin)
No Cloudflare Dashboard → Pages → abc-resolve → Settings → Environment variables:
```
ADMIN_SECRET = sua_senha_segura_aqui
```

## 7. Build e deploy
```bash
npm run deploy
```

## 8. Desenvolvimento local
```bash
npm run dev
```

## Acesso admin
- URL: `https://seu-dominio/admin`
- Senha: a definida em `ADMIN_SECRET`
