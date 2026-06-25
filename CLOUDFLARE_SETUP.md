# Configuração Cloudflare Pages — ABCResolve

## ✅ Status Atual
- ✅ Projeto criado no Cloudflare Pages
- ✅ Banco de dados D1 sincronizado
- ✅ Deploy automático configurado
- ⏳ **Falta:** Configurar URL de produção

## 🔧 Próximos Passos

### 1️⃣ Configurar URL de Produção (5 minutos)
1. Acesse: https://dash.cloudflare.com
2. **Pages** → **abc-resolve**
3. **Settings** → **Builds & deployments**
4. Em **Production branch**, altere para:
   ```
   Production branch: production
   ```
5. Clique em **Save**
6. Aguarde ~1-2 minutos para ativar

Depois disso, `https://abc-resolve.pages.dev/` estará ativo! ✅

---

## 🚀 Fazer Deploy (Futuros)

### Opção 1: Comando Manual (Recomendado para agora)
```bash
npm run pages:build && npx wrangler pages deploy ./.pages-dist --project-name=abc-resolve --branch=production
```

### Opção 2: Script de Deploy
```bash
bash deploy.sh
```

### Opção 3: GitHub Actions (Recomendado futuro)
Conecte o repositório Git ao GitHub:
```bash
git remote add origin https://github.com/seu-usuario/abc-resolve.git
git branch -M main
git push -u origin main
```

Depois, no Dashboard do Cloudflare Pages:
- **Desconecte** o deploy manual
- **Conecte** o repositório GitHub
- Ative CI/CD automático

---

## 📊 URLs Disponíveis

| URL | Status | Tipo |
|-----|--------|------|
| `abc-resolve.pages.dev` | ⏳ Ativa em breve | Produção |
| `production.abc-resolve.pages.dev` | ✅ Ativa agora | Alias |
| `873ddf2b.abc-resolve.pages.dev` | ✅ Ativa | Preview |

---

## 📝 Informações do Projeto

- **Projeto:** abc-resolve
- **Banco de Dados:** abc-resolve-db (D1)
- **Framework:** Next.js 15.3.2
- **Build:** OpenNext + Cloudflare Pages
- **URL Dashboard:** https://dash.cloudflare.com → Pages → abc-resolve

---

## 🆘 Troubleshooting

### "Deploy não aparece em abc-resolve.pages.dev"
→ Verifique se a Production branch está configurada como "production" no Dashboard

### "Database connection error"
→ Verifique se o D1 binding está correto em `wrangler.toml`

### "Build failed"
→ Execute localmente: `npm run pages:build` para diagnosticar

---

## 📞 Referências
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js + Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
