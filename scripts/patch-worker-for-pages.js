#!/usr/bin/env node
// Patches .open-next/worker.js for Cloudflare Pages _worker.js mode.
// In Pages advanced mode, static assets are NOT served automatically —
// the worker must handle them via the env.ASSETS binding.
// See: https://developers.cloudflare.com/pages/functions/advanced-mode/

import { readFileSync, writeFileSync, cpSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const openNext = join(root, '.open-next');
const assets = join(openNext, 'assets');

// 1. Patch worker.js: inject ASSETS static-file handler before Next.js handler
const workerPath = join(openNext, 'worker.js');
let worker = readFileSync(workerPath, 'utf8');

const ASSETS_PATCH = `    async fetch(request, env, ctx) {
        // Cloudflare Pages _worker.js mode: serve static assets via ASSETS binding.
        // In Pages advanced mode static files are NOT served automatically.
        if (env.ASSETS) {
            const url = new URL(request.url);
            if (
                url.pathname.startsWith('/_next/static/') ||
                url.pathname.startsWith('/_next/image/') ||
                url.pathname === '/favicon.ico'
            ) {
                const assetResp = await env.ASSETS.fetch(request);
                if (assetResp.status !== 404) return assetResp;
            }
        }`;

worker = worker.replace('    async fetch(request, env, ctx) {', ASSETS_PATCH);
writeFileSync(join(assets, '_worker.js'), worker, 'utf8');
console.log('✓ Patched _worker.js written to .open-next/assets/_worker.js');

// 2. Copy server-functions, middleware, cloudflare, .build into assets
// so wrangler pages deploy can bundle _worker.js and its imports
const dirs = ['server-functions', 'middleware', 'cloudflare', '.build'];
for (const dir of dirs) {
  const src = join(openNext, dir);
  const dest = join(assets, dir);
  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true });
    console.log(`✓ Copied ${dir}/ → assets/${dir}/`);
  }
}

// 3. Write .assetsignore so these worker files aren't exposed as static content
const ignore = ['_worker.js', 'server-functions', 'middleware', 'cloudflare', '.build'].join('\n');
writeFileSync(join(assets, '.assetsignore'), ignore, 'utf8');
console.log('✓ .assetsignore updated');
console.log('\nReady for: wrangler pages deploy .open-next/assets --project-name abc-resolve');
