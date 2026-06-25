#!/bin/bash
# Script de deploy para Cloudflare Pages

echo "🚀 Iniciando deploy para Cloudflare Pages..."
echo ""

# Build
echo "📦 Fazendo build..."
npm run pages:build || exit 1
echo "✅ Build concluído"
echo ""

# Deploy
echo "🌐 Fazendo deploy..."
npx wrangler pages deploy ./.pages-dist --project-name=abc-resolve --branch=production || exit 1
echo "✅ Deploy concluído"
echo ""

# Git commit
echo "💾 Fazendo commit no Git..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" --allow-empty
echo "✅ Commit realizado"
echo ""

echo "🎉 Deploy finalizado!"
echo "🌍 Acesse: https://abc-resolve.pages.dev/"
