#!/usr/bin/env node
/**
 * CoolPublisher – Build & Staging Generator pro projekt CoolCV
 * -------------------------------------------------------------
 * Tento skript je volán přímo z VS Code rozšíření CoolPublisher (tlačítko "🔨 Spustit Build")
 * nebo příkazem `npm run build:publish`.
 *
 * Co přesně udělá:
 * 1. Zkompiluje všechny TypeScript React komponenty (`src/App.tsx`, `src/components/*.tsx`, `src/types/cv.ts`) do `dist/bundle.js`.
 * 2. Připraví 3 čisté produkční moduly do `./dist/publish/` přesně podle struktury `coolpublisher.json`:
 *    - `react-web`        (index.php, dist/bundle.js, assets/css/style.css) -> /htdocs
 *    - `react-backoffice` (admin.php, backoffice/index.php)                 -> /htdocs
 *    - `php-api`          (api.php, config.php, .htaccess, backend/*.php, database/...) -> /htdocs
 * 3. Aktualizuje `builtAt` a `readyForUpload: true` v `coolpublisher.json`, čímž ve VS Code
 *    okamžitě rozsvítí odznáček připraveného buildu k nahrání na FTP (InfinityFree / Endora / Webzdarma).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildReactBundle } from './compile-jsx.mjs';
import { renderResumePdfBuffer } from './pdf-renderer.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function copyFileEnsured(srcRel, destAbs) {
  const srcAbs = path.join(ROOT_DIR, srcRel);
  if (!fs.existsSync(srcAbs)) return;
  const dir = path.dirname(destAbs);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync(srcAbs, destAbs);
}

function copyDirEnsured(srcRel, destAbsDir, excludeFiles = []) {
  const srcAbsDir = path.join(ROOT_DIR, srcRel);
  if (!fs.existsSync(srcAbsDir)) return;
  if (!fs.existsSync(destAbsDir)) {
    fs.mkdirSync(destAbsDir, { recursive: true });
  }
  for (const entry of fs.readdirSync(srcAbsDir, { withFileTypes: true })) {
    if (excludeFiles.includes(entry.name)) continue;
    const s = path.join(srcAbsDir, entry.name);
    const d = path.join(destAbsDir, entry.name);
    if (entry.isDirectory()) {
      copyDirEnsured(path.relative(ROOT_DIR, s), d, excludeFiles);
    } else if (entry.isFile()) {
      fs.copyFileSync(s, d);
    }
  }
}

console.log('🚀 [CoolPublisher] 1/3 Kompiluji React 18 + TypeScript (.tsx) do dist/bundle.js...');
const bundlePath = buildReactBundle();
console.log(`✅ [CoolPublisher] Bundle zkompilován: ${bundlePath}`);

console.log('📦 [CoolPublisher] 2/3 Připravuji produkční složky pro 3 moduly (react-web, react-backoffice, php-api)...');
const stageRoot = path.join(ROOT_DIR, 'dist', 'publish');
if (fs.existsSync(stageRoot)) {
  fs.rmSync(stageRoot, { recursive: true, force: true });
}

// 1. Module: Frontend - Web (React 18 + TypeScript Build)
const webStage = path.join(stageRoot, 'react-web');
copyFileEnsured('index.php', path.join(webStage, 'index.php'));
copyFileEnsured('dist/bundle.js', path.join(webStage, 'dist', 'bundle.js'));
copyFileEnsured('assets/css/style.css', path.join(webStage, 'assets', 'css', 'style.css'));
copyFileEnsured('assets/js/html2pdf.bundle.min.js', path.join(webStage, 'assets', 'js', 'html2pdf.bundle.min.js'));
copyFileEnsured('assets/fonts/Montserrat-Regular.ttf', path.join(webStage, 'assets', 'fonts', 'Montserrat-Regular.ttf'));

// 2. Module: Frontend - Backoffice (React 18 + TypeScript Admin)
const boStage = path.join(stageRoot, 'react-backoffice');
copyFileEnsured('admin.php', path.join(boStage, 'admin.php'));
const boSubdirIndex = path.join(boStage, 'backoffice', 'index.php');
fs.mkdirSync(path.dirname(boSubdirIndex), { recursive: true });
fs.writeFileSync(
  boSubdirIndex,
  `<?php\ndeclare(strict_types=1);\nheader('Location: ../admin.php');\nexit;\n`,
  'utf-8'
);

// 3. Module: Backend - REST API, Vector PDF & Crypto (PHP 8 + MySQL/JSON DB)
const apiStage = path.join(stageRoot, 'php-api');
copyFileEnsured('api.php', path.join(apiStage, 'api.php'));
copyFileEnsured('config.php', path.join(apiStage, 'config.php'));
copyFileEnsured('config.secret.php', path.join(apiStage, 'config.secret.php'));
copyFileEnsured('.htaccess', path.join(apiStage, '.htaccess'));
copyDirEnsured('backend', path.join(apiStage, 'backend'));
copyDirEnsured('database', path.join(apiStage, 'database'), ['app.sqlite']);

// 4. Aktualizace coolpublisher.json
console.log('📝 [CoolPublisher] 3/3 Aktualizuji manifest coolpublisher.json...');
const manifestPath = path.join(ROOT_DIR, 'coolpublisher.json');
let manifest = {
  projectName: 'CoolCV – UX • JS/TS • PHP • .NET Portfolio',
  version: '2.0.0',
  builtAt: new Date().toISOString(),
  readyForUpload: true,
  buildCommand: 'node scripts/coolpublisher-build.mjs',
  ftp: {
    host: 'ftpupload.net',
    port: 21,
    user: 'if0_37xxxxxx',
    secure: true,
    rejectUnauthorized: false,
  },
  mappings: [
    {
      name: 'Frontend - Web (React 18 + TS Build)',
      type: 'react-web',
      localPath: './dist/publish/react-web',
      remotePath: '/htdocs',
      enabled: true,
      exclude: ['*.map'],
    },
    {
      name: 'Frontend - Backoffice (React 18 + TS Admin)',
      type: 'react-backoffice',
      localPath: './dist/publish/react-backoffice',
      remotePath: '/htdocs',
      enabled: true,
      exclude: ['*.map'],
    },
    {
      name: 'Backend - REST API & AES-256/JWT (PHP 8)',
      type: 'php-api',
      localPath: './dist/publish/php-api',
      remotePath: '/htdocs',
      enabled: true,
      exclude: ['.env.local', '.git/**', 'app.sqlite'],
    },
  ],
};

if (fs.existsSync(manifestPath)) {
  try {
    const existing = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    manifest = {
      ...existing,
      builtAt: new Date().toISOString(),
      readyForUpload: true,
    };
  } catch (_) {}
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
console.log('✅ [CoolPublisher] Hotovo! Manifest coolpublisher.json je PŘIPRAVEN PRO FTP UPLOAD ve VS Code.');
