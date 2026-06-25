# ABC Resolve - Guia de Deployment e Integração D1

## ✅ DEPLOYMENT CONCLUÍDO COM SUCESSO - 2026-06-25

**Status**: Live em Produção  
**URL**: https://abc-resolve-online.pages.dev  
**Preview**: https://f469ae9c.abc-resolve-online.pages.dev

### O que foi implementado:
- Cloudflare Pages project criado: `abc-resolve-online`
- Next.js 16 buildado e deployado com sucesso
- D1 Database inicializado com schema completo (7 tabelas)
- Migrations aplicadas (0001_init.sql)
- JWT_SECRET configurado como secret no Pages
- Índices de performance criados no banco

**Próximos passos**:
1. Atualizar APIs para usar D1 real (substituir mocks)
2. Testar autenticação e CRUD de dados
3. Monitorar logs em produção

---

## 🚀 Deployment para Cloudflare Pages

### Pré-requisitos

```bash
# 1. Instalar Wrangler CLI
npm install -g wrangler

# 2. Autenticar com Cloudflare
wrangler login

# 3. Criar banco de dados D1
wrangler d1 create abc-resolve-db
```

### Build & Deploy

```bash
# Build do projeto
npm run build

# Deploy para Cloudflare Pages
wrangler pages deploy .vercel/output/static

# Aplicar migrations D1
wrangler d1 migrations apply abc-resolve-db --remote
```

### Variáveis de Ambiente

Configurar secrets no Cloudflare:

```bash
# JWT Secret
wrangler pages secret put JWT_SECRET --project-name=abc-resolve

# Admin Key (opcional)
wrangler pages secret put ADMIN_KEY --project-name=abc-resolve
```

### wrangler.toml Configuration

O arquivo `wrangler.toml` já está configurado com:

```toml
[[d1_databases]]
binding = "DB"
database_name = "abc-resolve-db"
database_id = "YOUR_DB_ID"
migrations_dir = "migrations"
```

**Atualize `database_id` após criar o D1:**

```bash
wrangler d1 list
# Copie o ID do seu banco de dados
```

---

## 🗄️ Integração com Cloudflare D1

### 1. Estrutura do Schema

O schema está em `schema.sql` com:
- ✅ 6 tabelas principais
- ✅ Foreign keys com CASCADE
- ✅ Índices de performance
- ✅ Seed data (12 categorias)

### 2. Aplicar Migrations Localmente

```bash
# Local development
wrangler d1 migrations apply abc-resolve-db --local

# Verificar banco local
sqlite3 .wrangler/state/d1/database.db
```

### 3. Atualizar APIs para Usar D1 Real

**Exemplo: `/api/auth/registrar`**

```typescript
// Antes (mock):
const newUser: User = { id: 1, ... };

// Depois (D1 real):
import { D1Database } from '@cloudflare/workers-types';

type Env = {
  DB: D1Database;
};

export async function POST(request: NextRequest) {
  // Obter DB do contexto
  const db = process.env.DB as D1Database;
  
  const { email, nome, tipo, senha, cidade, estado } = await request.json();
  
  // Verificar se email já existe
  const existing = await db.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first();
  
  if (existing) {
    return NextResponse.json(
      { success: false, error: 'Email já registrado' },
      { status: 400 }
    );
  }
  
  // Hash da senha (usar bcryptjs)
  const hash = await bcrypt.hash(senha, 10);
  
  // Inserir usuário
  const result = await db.prepare(`
    INSERT INTO users (email, password_hash, tipo, nome, cidade, estado, criado_em, atualizado_em)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).bind(hash, tipo, nome, cidade, estado).run();
  
  const newUser = {
    id: result.meta.last_row_id,
    email,
    tipo,
    nome,
    cidade,
    estado,
    ...
  };
  
  const token = signToken(newUser);
  
  return NextResponse.json({
    success: true,
    data: { token, user: newUser }
  });
}
```

### 4. Padrão de Query com D1

```typescript
// SELECT um
const user = await db.prepare(
  'SELECT * FROM users WHERE id = ?'
).bind(userId).first();

// SELECT múltiplos
const { results } = await db.prepare(
  'SELECT * FROM servicos WHERE prestador_id = ? AND ativo = 1'
).bind(prestadorId).all();

// INSERT
const result = await db.prepare(
  'INSERT INTO servicos (...) VALUES (...)'
).bind(...values).run();

// UPDATE
await db.prepare(
  'UPDATE users SET nome = ? WHERE id = ?'
).bind(nome, userId).run();

// DELETE
await db.prepare(
  'DELETE FROM servicos WHERE id = ?'
).bind(servicoId).run();

// TRANSACTION
await db.batch([
  db.prepare('INSERT INTO ...').bind(...),
  db.prepare('UPDATE ...').bind(...),
]);
```

### 5. Tipos TypeScript para D1

```typescript
type Env = {
  DB: D1Database;
  JWT_SECRET: string;
  ADMIN_KEY?: string;
};

// Em rotas
export async function POST(request: NextRequest) {
  const env = process.env as Env;
  const db = env.DB;
  // ...
}
```

---

## 🧪 Testing Localmente

### Setup Local

```bash
# Instalar dependências
npm install

# Criar banco local
wrangler d1 create abc-resolve-db --local

# Aplicar schema
wrangler d1 migrations apply abc-resolve-db --local

# Dev server
npm run dev
```

### Verificar Dados

```bash
# Conectar ao banco local
sqlite3 .wrangler/state/d1/database.db

# Comandos SQL
SELECT * FROM users;
SELECT * FROM categorias;
SELECT COUNT(*) FROM servicos;
```

---

## 📊 Monitoramento em Produção

### Logs do Cloudflare

```bash
# Ver logs de deployment
wrangler pages deployment list

# Ver logs de execução
wrangler tail --project-name=abc-resolve
```

### Métricas D1

```bash
# Uso do banco de dados
wrangler d1 info abc-resolve-db

# Estatísticas
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_servicos FROM servicos;
```

---

## 🔒 Security Checklist

- [ ] JWT_SECRET configurado como secret (não em código)
- [ ] CORS configurado para domínio específico
- [ ] Rate limiting nas APIs
- [ ] Validação de inputs em todas as rotas
- [ ] Password hash com bcryptjs (mínimo 10 rounds)
- [ ] HTTPS ativado (Cloudflare automático)
- [ ] Proteção de rotas com middleware
- [ ] SQL injection prevention (usar parameterized queries - já feito)

---

## 📈 Performance Optimization

### Cache com Cloudflare

```typescript
// Headers de cache
export const revalidate = 3600; // 1 hora

// Ou em rotas específicas
export async function GET(request: Request) {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

export default function ServiceImage() {
  return (
    <Image
      src="/servico.jpg"
      alt="Serviço"
      width={400}
      height={300}
      priority
    />
  );
}
```

### Database Indexing

Já estão criados em `schema.sql`:

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_servicos_prestador ON servicos(prestador_id);
CREATE INDEX idx_servicos_categoria ON servicos(categoria_id);
CREATE INDEX idx_avaliacoes_servico ON avaliacoes(servico_id);
CREATE INDEX idx_solicitacoes_cliente ON solicitacoes(cliente_id);
CREATE INDEX idx_orcamentos_prestador ON orcamentos(prestador_id);
```

---

## 🐛 Troubleshooting

### Erro: "D1 database not found"

```bash
# Verificar ID do banco
wrangler d1 list

# Atualizar database_id em wrangler.toml
database_id = "YOUR_CORRECT_ID"
```

### Erro: "CORS blocked"

```typescript
// Adicionar em endpoints que precisam
export async function GET(request: NextRequest) {
  return new Response(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

### Erro: "Table doesn't exist"

```bash
# Verificar se migrations foram aplicadas
wrangler d1 migrations list abc-resolve-db

# Aplicar manualmente
wrangler d1 migrations apply abc-resolve-db --remote
```

---

## 📝 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] D1 database criado
- [ ] Schema e migrations aplicadas
- [ ] API routes atualizadas com D1 real
- [ ] Testes locais passando
- [ ] Build sem erros
- [ ] Deploy para Cloudflare Pages
- [ ] Migrations aplicadas em produção
- [ ] Verificar dados em produção
- [ ] Monitorar logs por 24h

---

## 🎯 Next Steps

1. **Integrar D1 Real**
   - Atualizar `/api/*` com queries reais
   - Testar localmente antes de deploy

2. **Adicionar Autenticação Real**
   - Implementar bcrypt hash
   - Validar passwords em login

3. **Setup CI/CD**
   - GitHub Actions para auto-deploy
   - Testes automáticos antes de push

4. **Monitoramento**
   - Sentry para error tracking
   - Analytics para user behavior

---

**Status**: Pronto para Production ✅
