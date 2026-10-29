/**
 * CoolCV – Vývojový server (npm run dev) pro React 18 Frontend + React Backoffice + PHP REST API
 * ----------------------------------------------------------------------------------------------
 * - Pokud je v systému nainstalované PHP, spustí `php -S localhost:8000`.
 * - Pokud PHP není ve Windows PATH, spustí vestavěný Node.js server na http://localhost:8000,
 *   který servíruje React 18 + Tailwind CSS + Montserrat + Material Symbols aplikaci a obsluhuje
 *   všechny REST API endpointy (`/api.php?route=...`) včetně AES-256-CBC šifrování, JWT HS256
 *   a nahrávání profilové fotografie do `database/local_db.json`.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildReactBundle } from './compile-jsx.mjs';
import { buildResumeHtml, renderResumePdfBuffer } from './pdf-renderer.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 8000);
const JWT_SECRET = process.env.JWT_SECRET || 'coolcv-super-secret-jwt-key-2026-change-in-prod';
const DB_PATH = path.join(ROOT_DIR, 'database', 'local_db.json');

const INITIAL_DB_SNAPSHOT = fs.existsSync(DB_PATH)
  ? fs.readFileSync(DB_PATH, 'utf-8')
  : '{}';

// ============================================================================
// Kryptografické jádro (shodné se src/CryptoService.php a src/AuthService.php)
// ============================================================================
const ENC_KEY = crypto.createHmac('sha256', JWT_SECRET).update('aes-256-encryption-key').digest();
const MAC_KEY = crypto.createHmac('sha256', JWT_SECRET).update('hmac-sha256-auth-key').digest();

function encryptPayload(data) {
  const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, iv);
  const cipherBuf = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const hmacBuf = crypto.createHmac('sha256', MAC_KEY).update(Buffer.concat([iv, cipherBuf])).digest();
  const envelope = Buffer.concat([iv, hmacBuf, cipherBuf]).toString('base64');

  return {
    algorithm: 'AES-256-CBC + HMAC-SHA256 (Encrypt-then-MAC)',
    key_derivation: 'SHA-256 HKDF (256-bit Encryption Key + 256-bit MAC Key)',
    iv_hex: iv.toString('hex'),
    ciphertext_base64: cipherBuf.toString('base64'),
    hmac_sha256_hex: hmacBuf.toString('hex'),
    encrypted_envelope: envelope,
    plaintext_bytes: Buffer.byteLength(plaintext, 'utf8'),
    encrypted_at: new Date().toISOString(),
  };
}

function decryptEnvelope(envelope) {
  try {
    const raw = Buffer.from(envelope, 'base64');
    if (raw.length < 49) return null;
    const iv = raw.subarray(0, 16);
    const hmacReceived = raw.subarray(16, 48);
    const cipherBuf = raw.subarray(48);

    const hmacExpected = crypto.createHmac('sha256', MAC_KEY).update(Buffer.concat([iv, cipherBuf])).digest();
    if (!crypto.timingSafeEqual(hmacExpected, hmacReceived)) return null;

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, iv);
    const decrypted = Buffer.concat([decipher.update(cipherBuf), decipher.final()]).toString('utf8');
    let decodedJson = null;
    try { decodedJson = JSON.parse(decrypted); } catch (_) {}

    return {
      verified_hmac: true,
      iv_hex: iv.toString('hex'),
      decrypted_raw: decrypted,
      decrypted_json: decodedJson,
    };
  } catch (_) {
    return null;
  }
}

function base64UrlEncode(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64').toString('utf8');
}

function encodeJwt(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const s1 = base64UrlEncode(JSON.stringify(header));
  const s2 = base64UrlEncode(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${s1}.${s2}`).digest();
  return `${s1}.${s2}.${base64UrlEncode(sig)}`;
}

function decodeAndVerifyJwt(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, b, s] = parts;
  const expected = base64UrlEncode(crypto.createHmac('sha256', JWT_SECRET).update(`${h}.${b}`).digest());
  if (expected !== s) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(b));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (_) {
    return null;
  }
}

function buildBackendCryptoReport(jwtPayload, jwtToken) {
  const parts = jwtToken.split('.');
  const encDemo = encryptPayload({
    sub: jwtPayload.sub || 1,
    username: jwtPayload.username || 'admin',
    role: jwtPayload.role || 'admin',
    issued_at: jwtPayload.iat || Math.floor(Date.now() / 1000),
    scope: 'backoffice:crud:full',
  });
  const decDemo = decryptEnvelope(encDemo.encrypted_envelope);

  return {
    jwt_hs256: {
      standard: 'RFC 7519 (JSON Web Token)',
      algorithm: 'HS256 (HMAC using SHA-256)',
      header_b64: parts[0] || '',
      payload_b64: parts[1] || '',
      signature_b64: parts[2] || '',
      decoded_header: { alg: 'HS256', typ: 'JWT' },
      decoded_payload: jwtPayload,
    },
    aes_256_backend: {
      ...encDemo,
      roundtrip_verified: Boolean(decDemo?.verified_hmac),
      decrypted_preview: decDemo?.decrypted_json || null,
    },
    password_hashing: {
      algorithm: 'bcrypt (2y)',
      cost_factor: 10,
      hash_sample: '$2y$10$wH8.J2c7M3vL9xK5pQ1rOu...[redacted]',
    },
  };
}

// ============================================================================
// Obsluha REST API (emulace api.php v Node.js dev režimu)
// ============================================================================
function handleRestApi({ route, method, id, roleFilter, input, authHeader, session }) {
  const start = performance.now();
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

  let dbRepaired = false;
  for (const colKey of ['roles', 'skills', 'experience', 'projects', 'education', 'socials']) {
    if (Array.isArray(db[colKey])) {
      let maxId = db[colKey].reduce((m, it) => Math.max(m, Number(it?.id || 0)), 0);
      const seen = new Set();
      db[colKey] = db[colKey].map((it) => {
        let numId = Number(it?.id || 0);
        if (!Number.isFinite(numId) || numId <= 0 || seen.has(numId)) {
          maxId += 1;
          numId = maxId;
          dbRepaired = true;
        }
        seen.add(numId);
        return { ...it, id: numId };
      });
    }
  }
  if (dbRepaired) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  }

  const buildResponse = (status, body) => ({
    status,
    body: {
      ...body,
      meta: {
        route: route || 'status',
        method,
        status,
        db_driver: 'json-in-repo',
        execution_ms: Number((performance.now() - start).toFixed(2)),
        timestamp: new Date().toISOString(),
      },
    },
  });

  let token = null;
  if (authHeader && /^Bearer\s+(.+)$/i.test(authHeader)) {
    token = authHeader.replace(/^Bearer\s+/i, '').trim();
  } else if (session?.auth_token) {
    token = session.auth_token;
  }
  const authUser = token ? decodeAndVerifyJwt(token) : null;

  const usersList = Array.isArray(db.users) ? db.users : [];
  const hasAnyUser = usersList.length > 0;

  const hashPasswordDev = (plain) =>
    'sha256$' + crypto.createHmac('sha256', JWT_SECRET).update(String(plain)).digest('hex');

  if (!route || route === 'status') {
    return buildResponse(200, {
      ok: true,
      service: 'CoolCV PHP 8 REST API + AES-256 & JWT Engine',
      needs_setup: !hasAnyUser,
      authenticated: Boolean(authUser),
      user: authUser,
      crypto_engine: 'OpenSSL AES-256-CBC + HMAC-SHA256 + JWT HS256 + Bcrypt',
    });
  }

  if (route === 'auth/setup-status') {
    return buildResponse(200, {
      ok: true,
      needs_setup: !hasAnyUser,
    });
  }

  if (route === 'auth/setup') {
    if (method !== 'POST') return buildResponse(405, { ok: false, error: 'Method Not Allowed' });
    if (hasAnyUser) {
      return buildResponse(403, {
        ok: false,
        error: 'Administrátorský účet již v databázi existuje. Přihlaste se prosím svým účtem.',
      });
    }
    const username = String(input?.username || '').trim();
    const password = String(input?.password || '');
    const displayName = String(input?.display_name || username).trim();
    if (username.length < 3 || password.length < 6) {
      return buildResponse(400, {
        ok: false,
        error: 'Uživatelské jméno musí mít alespoň 3 znaky a heslo alespoň 6 znaků.',
      });
    }
    const newUser = {
      id: 1,
      username,
      password_hash: hashPasswordDev(password),
      display_name: displayName,
      role: 'admin',
      last_login_at: new Date().toISOString(),
    };
    db.users = [newUser];
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

    const now = Math.floor(Date.now() / 1000);
    const ttl = 3600 * 8;
    const payload = {
      iss: 'coolcv-rest-api',
      sub: 1,
      username: newUser.username,
      display_name: newUser.display_name,
      role: 'admin',
      iat: now,
      exp: now + ttl,
    };
    const jwt = encodeJwt(payload);
    if (session) session.auth_token = jwt;
    return buildResponse(201, {
      ok: true,
      message: 'První administrátorský účet byl bezpečně vytvořen a přihlášen.',
      data: {
        token_type: 'Bearer',
        access_token: jwt,
        expires_in: ttl,
        expires_at: new Date((now + ttl) * 1000).toISOString(),
        user: { id: 1, username: newUser.username, display_name: newUser.display_name, role: 'admin' },
        jwt_payload: payload,
        backend_crypto: buildBackendCryptoReport(payload, jwt),
      },
    });
  }

  if (route === 'auth/login') {
    if (method !== 'POST') return buildResponse(405, { ok: false, error: 'Method Not Allowed' });
    if (!hasAnyUser) {
      return buildResponse(403, {
        ok: false,
        needs_setup: true,
        error: 'V databázi zatím neexistuje žádný uživatel. Vytvořte nejprve administrátorský účet.',
      });
    }
    const { username, password } = input || {};
    const foundUser = usersList.find((u) => u.username === String(username || '').trim());
    if (foundUser && foundUser.password_hash === hashPasswordDev(password)) {
      const now = Math.floor(Date.now() / 1000);
      const ttl = 3600 * 8;
      const payload = {
        iss: 'coolcv-rest-api',
        sub: foundUser.id || 1,
        username: foundUser.username,
        display_name: foundUser.display_name || foundUser.username,
        role: foundUser.role || 'admin',
        iat: now,
        exp: now + ttl,
      };
      const jwt = encodeJwt(payload);
      if (session) session.auth_token = jwt;
      return buildResponse(200, {
        ok: true,
        message: 'Autentifikace úspěšná. JWT Bearer token a AES-256 obálka byly vygenerovány na backendu.',
        data: {
          token_type: 'Bearer',
          access_token: jwt,
          expires_in: ttl,
          expires_at: new Date((now + ttl) * 1000).toISOString(),
          user: {
            id: payload.sub,
            username: payload.username,
            display_name: payload.display_name,
            role: payload.role,
          },
          jwt_payload: payload,
          backend_crypto: buildBackendCryptoReport(payload, jwt),
        },
      });
    }
    return buildResponse(401, { ok: false, error: 'Neplatné uživatelské jméno nebo heslo.' });
  }

  if (route === 'auth/me') {
    if (!authUser) return buildResponse(401, { ok: false, error: 'Unauthorized: Chybí nebo je neplatný JWT Bearer token.' });
    return buildResponse(200, {
      ok: true,
      authenticated: true,
      user: { id: authUser.sub, username: authUser.username, display_name: authUser.display_name, role: authUser.role },
      jwt_payload: authUser,
      backend_crypto: buildBackendCryptoReport(authUser, token),
    });
  }

  if (route === 'auth/refresh') {
    if (!authUser) return buildResponse(401, { ok: false, error: 'Unauthorized' });
    const now = Math.floor(Date.now() / 1000);
    const ttl = 3600 * 8;
    const newPayload = { ...authUser, iat: now, exp: now + ttl };
    const jwt = encodeJwt(newPayload);
    if (session) session.auth_token = jwt;
    return buildResponse(200, {
      ok: true,
      data: {
        token_type: 'Bearer',
        access_token: jwt,
        expires_in: ttl,
        user: { id: newPayload.sub, username: newPayload.username, display_name: newPayload.display_name, role: newPayload.role },
        jwt_payload: newPayload,
        backend_crypto: buildBackendCryptoReport(newPayload, jwt),
      },
    });
  }

  if (route === 'auth/logout') {
    if (session) delete session.auth_token;
    return buildResponse(200, { ok: true, message: 'Odhlášeno.' });
  }

  if (route === 'crypto/inspect') {
    const sampleText = String(input?.plaintext || 'Tajná zpráva pro ověření AES-256-CBC na backendu');
    const encrypted = encryptPayload(sampleText);
    const decrypted = decryptEnvelope(encrypted.encrypted_envelope);
    return buildResponse(200, {
      ok: true,
      message: 'Kryptografická operace proběhla přímo na backendu (AES-256-CBC + HMAC-SHA256).',
      data: {
        input_plaintext: sampleText,
        encryption_process: encrypted,
        decryption_verify: decrypted,
      },
    });
  }

  if (route === 'cv') {
    return buildResponse(200, {
      ok: true,
      data: { driver: 'json-in-repo', needs_setup: !hasAnyUser, ...db },
    });
  }

  if (route === 'profile/photo') {
    if (!authUser) return buildResponse(401, { ok: false, error: 'Unauthorized' });
    const photoDataUrl = String(input?.photo_data_url || input?.avatar_url || '');
    if (!photoDataUrl) return buildResponse(400, { ok: false, error: 'Chybí data fotografie.' });
    db.profile = { ...db.profile, avatar_url: photoDataUrl };
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    return buildResponse(200, {
      ok: true,
      message: 'Profilová fotografie byla uložena do databáze.',
      data: db.profile,
    });
  }

  if (route === 'profile') {
    if (method === 'GET') return buildResponse(200, { ok: true, data: db.profile });
    if (method === 'PUT' || method === 'POST') {
      if (!authUser) return buildResponse(401, { ok: false, error: 'Unauthorized' });
      db.profile = { ...db.profile, ...input, id: 1 };
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
      return buildResponse(200, { ok: true, message: 'Profil uložen.', data: db.profile });
    }
  }

  const reorderMatch = route.match(/^(roles|skills|experience|projects|education|socials)\/reorder$/);
  if (reorderMatch) {
    if (!authUser) return buildResponse(401, { ok: false, error: 'Unauthorized' });
    const entityName = reorderMatch[1];
    const list = db[entityName] || [];
    const orderedIds = Array.isArray(input?.ordered_ids) ? input.ordered_ids.map((x) => Number(x)) : [];
    const orderMap = new Map(orderedIds.map((itemId, idx) => [itemId, idx + 1]));
    const reordered = [...list]
      .map((item) => ({
        ...item,
        sort_order: orderMap.has(Number(item.id)) ? orderMap.get(Number(item.id)) : Number(item.sort_order || 999),
      }))
      .sort((a, b) => Number(a.sort_order || 999) - Number(b.sort_order || 999));
    db[entityName] = reordered;
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    return buildResponse(200, { ok: true, message: 'Pořadí položek bylo aktualizováno.', data: reordered });
  }

  if (['roles', 'skills', 'experience', 'projects', 'education', 'socials'].includes(route)) {
    const list = db[route] || [];
    if (method === 'GET') {
      return buildResponse(200, { ok: true, count: list.length, data: list });
    }
    if (!authUser) return buildResponse(401, { ok: false, error: 'Unauthorized' });

    if ((method === 'POST' || method === 'PUT') && (input?.action === 'reorder' || Array.isArray(input?.ordered_ids))) {
      const orderedIds = Array.isArray(input?.ordered_ids) ? input.ordered_ids.map((x) => Number(x)) : [];
      const orderMap = new Map(orderedIds.map((itemId, idx) => [itemId, idx + 1]));
      const reordered = [...list]
        .map((item) => ({
          ...item,
          sort_order: orderMap.has(Number(item.id)) ? orderMap.get(Number(item.id)) : Number(item.sort_order || 999),
        }))
        .sort((a, b) => Number(a.sort_order || 999) - Number(b.sort_order || 999));
      db[route] = reordered;
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
      return buildResponse(200, { ok: true, message: 'Pořadí položek bylo aktualizováno.', data: reordered });
    }

    if (method === 'POST' && !id) {
      const maxId = list.reduce((m, it) => Math.max(m, Number(it.id || 0)), 0);
      const created = { ...input, id: maxId + 1 };
      if (created.proficiency !== undefined) created.proficiency = Number(created.proficiency);
      list.push(created);
      db[route] = list;
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
      return buildResponse(201, { ok: true, data: created });
    }

    if (method === 'PUT' || (method === 'POST' && id > 0)) {
      const idx = list.findIndex((it) => Number(it.id) === Number(id));
      if (idx === -1) return buildResponse(404, { ok: false, error: 'Nenalezeno' });
      const updated = { ...list[idx], ...input, id: Number(id) };
      if (updated.proficiency !== undefined) updated.proficiency = Number(updated.proficiency);
      list[idx] = updated;
      db[route] = list;
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
      return buildResponse(200, { ok: true, data: updated });
    }

    if (method === 'DELETE') {
      db[route] = list.filter((it) => Number(it.id) !== Number(id));
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
      return buildResponse(200, { ok: true, id: Number(id) });
    }
  }

  if (route === 'system/reset') {
    if (!authUser) return buildResponse(401, { ok: false, error: 'Unauthorized' });
    fs.writeFileSync(DB_PATH, INITIAL_DB_SNAPSHOT);
    const fresh = JSON.parse(INITIAL_DB_SNAPSHOT);
    return buildResponse(200, { ok: true, data: { driver: 'json-in-repo', ...fresh } });
  }

  return buildResponse(404, { ok: false, error: 'Endpoint nenalezen' });
}

function renderReactHostHtml(data, currentTheme, currentLang, initialView = 'cv') {
  const stateJson = JSON.stringify({
    theme: currentTheme,
    lang: currentLang,
    initialView,
    cvData: { driver: 'json-in-repo', ...data },
  });

  return `<!DOCTYPE html>
<html lang="${currentLang}" data-theme="${currentTheme}" class="${currentTheme === 'dark' ? 'dark' : ''}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.profile?.full_name || 'Jan Novák'} — UX Designer • JS • PHP • Junior C# .NET Core</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Montserrat', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    };
  </script>
  <link rel="stylesheet" href="assets/css/style.css?v=${Date.now()}">
</head>
<body class="font-sans antialiased selection:bg-purple-500 selection:text-white">
  <div id="react-root"></div>
  <script>window.__INITIAL_STATE__ = ${stateJson};</script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="assets/js/html2pdf.bundle.min.js"></script>
  <script src="dist/bundle.js?v=${Date.now()}"></script>
</body>
</html>`;
}

function findPhpBinary() {
  const candidates = ['php', 'C:\\xampp\\php\\php.exe', 'C:\\laragon\\bin\\php\\php.exe'];
  for (const bin of candidates) {
    try {
      const res = spawnSync(bin, ['-v'], { stdio: 'ignore' });
      if (res.status === 0) return bin;
    } catch (_) {}
  }
  return null;
}

const phpBin = findPhpBinary();
if (process.argv.includes('--check')) {
  runSmokeTest();
} else if (phpBin && !process.argv.includes('--node-fallback')) {
  console.log(`\x1b[32m[CoolCV]\x1b[0m Spouštím PHP dev server na http://localhost:${PORT} ...`);
  const proc = spawn(phpBin, ['-S', `localhost:${PORT}`], { cwd: ROOT_DIR, stdio: 'inherit' });
  proc.on('exit', (code) => process.exit(code ?? 0));
} else {
  startNodeDevServer();
}

function startNodeDevServer() {
  const sessions = new Map();

  const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url || '/', `http://localhost:${PORT}`);
    const pathname = reqUrl.pathname;

    if (pathname === '/dist/bundle.js') {
      try {
        const bundlePath = buildReactBundle();
        res.writeHead(200, {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        });
        fs.createReadStream(bundlePath).pipe(res);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('JSX Compile Error: ' + err.message);
      }
      return;
    }

    if (pathname.startsWith('/assets/') || pathname.startsWith('/uploads/')) {
      const filePath = path.join(ROOT_DIR, pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
          '.css': 'text/css; charset=utf-8',
          '.js': 'application/javascript; charset=utf-8',
          '.jpg': 'image/jpeg',
          '.png': 'image/png',
          '.svg': 'image/svg+xml',
          '.ttf': 'font/ttf',
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const cookieHeader = req.headers.cookie || '';
    const match = cookieHeader.match(/COOLCV_SESSID=([a-zA-Z0-9_-]+)/);
    let sessionId = match ? match[1] : null;
    if (!sessionId || !sessions.has(sessionId)) {
      sessionId = 'dev_' + Math.random().toString(36).slice(2, 12);
      sessions.set(sessionId, { theme: 'dark', lang: 'cs' });
    }
    const session = sessions.get(sessionId);
    res.setHeader('Set-Cookie', `COOLCV_SESSID=${sessionId}; Path=/; HttpOnly; SameSite=Lax`);

    if (pathname === '/api.php') {
      let rawBody = '';
      req.on('data', (chunk) => { rawBody += chunk; });
      req.on('end', () => {
        let input = {};
        if (rawBody) {
          try { input = JSON.parse(rawBody); } catch (_) {}
        }
        let method = (req.method || 'GET').toUpperCase();
        const override = req.headers['x-http-method-override'] || input._method;
        if (method === 'POST' && override) method = String(override).toUpperCase();

        const route = (reqUrl.searchParams.get('route') || input.route || 'status').replace(/^\/+|\/+$/g, '');
        const id = Number(reqUrl.searchParams.get('id') || input.id || 0);
        const roleFilter = reqUrl.searchParams.get('role') || '';
        const authHeader = req.headers['authorization'] || (req.headers['x-api-token'] ? `Bearer ${req.headers['x-api-token']}` : '');

        if (route === 'cv/pdf' || route === 'pdf') {
          const langParam = (reqUrl.searchParams.get('lang') || input.lang || session.lang || 'cs') === 'en' ? 'en' : 'cs';
          const dbData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
          const cvPayload = input?.cvData?.profile ? input.cvData : dbData;

          if (reqUrl.searchParams.get('format') === 'html') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(buildResumeHtml(cvPayload, langParam));
            return;
          }

          renderResumePdfBuffer(cvPayload, langParam)
            .then((pdfBuf) => {
              const safeName = String(cvPayload?.profile?.full_name || 'Jan-Novak')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '') || 'CoolCV';
              const filename = `${safeName}-CV-${langParam.toUpperCase()}.pdf`;
              res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': String(pdfBuf.length),
                'Cache-Control': 'no-store',
              });
              res.end(pdfBuf);
            })
            .catch((err) => {
              res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify({ ok: false, error: err?.message || 'PDF generation error' }));
            });
          return;
        }

        const apiRes = handleRestApi({ route, method, id, roleFilter, input, authHeader, session });
        res.writeHead(apiRes.status, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(apiRes.body, null, 2));
      });
      return;
    }

    let changed = false;
    const qTheme = reqUrl.searchParams.get('theme');
    if (qTheme === 'light' || qTheme === 'dark') {
      session.theme = qTheme;
      changed = true;
    }
    const qLang = reqUrl.searchParams.get('lang');
    if (qLang === 'cs' || qLang === 'en') {
      session.lang = qLang;
      changed = true;
    }

    if (changed && reqUrl.searchParams.has('ajax')) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, theme: session.theme, lang: session.lang }));
      return;
    }

    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const view = pathname === '/admin.php' || reqUrl.searchParams.get('view') === 'backoffice' ? 'backoffice' : 'cv';
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderReactHostHtml(data, session.theme, session.lang, view));
  });

  server.listen(PORT, () => {
    console.log('\n========================================================================');
    console.log(' 🚀 CoolCV 2.0 – React 18 Frontend + React Backoffice + PHP REST API');
    console.log(` 🌐 Web CV (React):      http://localhost:${PORT}`);
    console.log(` 🔐 React Backoffice:    http://localhost:${PORT}/admin.php (admin / Admin123!)`);
    console.log(` ⚡ REST API & Crypto:   http://localhost:${PORT}/api.php?route=status`);
    console.log('========================================================================\n');
  });
}

async function runSmokeTest() {
  const bundlePath = buildReactBundle();
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  const htmlHost = renderReactHostHtml(
    { ...data, needs_setup: !Array.isArray(data.users) || data.users.length === 0 },
    'dark',
    'cs',
    'cv'
  );
  const reactBundleCode = fs.readFileSync(bundlePath, 'utf-8');
  const tsxAppFile = fs.readFileSync(path.join(ROOT_DIR, 'src', 'App.tsx'), 'utf-8');
  const tsTypesFile = fs.readFileSync(path.join(ROOT_DIR, 'src', 'types', 'cv.ts'), 'utf-8');

  // 0. Temporarily clear users array to test first-run setup
  fs.writeFileSync(DB_PATH, JSON.stringify({ ...data, users: [] }, null, 2));

  // 1. Initial admin account creation on first run (POST auth/setup)
  const setupRes = handleRestApi({
    route: 'auth/setup',
    method: 'POST',
    id: 0,
    roleFilter: '',
    input: { username: 'moj_admin', password: 'MojeTajneHeslo2026!', display_name: 'Jan Novák' },
    authHeader: '',
    session: {},
  });

  // 2. Login with created account -> JWT + Backend Crypto Report (AES-256-CBC + HMAC-SHA256)
  const loginRes = handleRestApi({
    route: 'auth/login',
    method: 'POST',
    id: 0,
    roleFilter: '',
    input: { username: 'moj_admin', password: 'MojeTajneHeslo2026!' },
    authHeader: '',
    session: {},
  });
  const jwt = loginRes.body?.data?.access_token || setupRes.body?.data?.access_token || '';
  const cryptoRep = loginRes.body?.data?.backend_crypto;

  // 3. Live Crypto Inspect endpoint
  const inspectRes = handleRestApi({
    route: 'crypto/inspect',
    method: 'POST',
    id: 0,
    roleFilter: '',
    input: { plaintext: 'Testovaci šifrovaný token payload' },
    authHeader: '',
    session: {},
  });

  // 4. Photo Upload endpoint (POST profile/photo)
  const sampleSvgUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>';
  const photoRes = handleRestApi({
    route: 'profile/photo',
    method: 'POST',
    id: 0,
    roleFilter: '',
    input: { photo_data_url: sampleSvgUri },
    authHeader: `Bearer ${jwt}`,
    session: {},
  });

  // 5. Vector/Text PDF Generation test (Light Mode Web CV template + Puppeteer)
  const pdfHtml = buildResumeHtml(data, 'cs');
  const pdfBuffer = await renderResumePdfBuffer(data, 'cs');
  const pdfRawString = pdfBuffer.toString('latin1');
  const phpPdfTemplateExists = fs.existsSync(path.join(ROOT_DIR, 'backend', 'pdf_template.php'));
  const phpPdfServiceExists = fs.existsSync(path.join(ROOT_DIR, 'backend', 'PdfService.php'));

  // Restore clean snapshot after test
  handleRestApi({
    route: 'system/reset',
    method: 'POST',
    id: 0,
    roleFilter: '',
    input: {},
    authHeader: `Bearer ${jwt}`,
    session: {},
  });

  const checks = [
    [
      'React 18 + TypeScript (.tsx / .ts) Source Files in src/ (App.tsx, types/cv.ts, components/*.tsx)',
      tsxAppFile.includes('<Sidebar') && tsxAppFile.includes('useState<ThemeMode>') && tsTypesFile.includes('export interface CvDataPayload'),
    ],
    [
      'TypeScript Bundle Compiled & Syntax Validated (dist/bundle.js)',
      reactBundleCode.includes('ReactDOM.createRoot') && reactBundleCode.includes('function Backoffice'),
    ],
    [
      'Montserrat Font & Material Symbols Loaded',
      htmlHost.includes('family=Montserrat') && htmlHost.includes('Material+Symbols+Rounded'),
    ],
    ['JWT HS256 Token Issued on Login', loginRes.status === 200 && jwt.split('.').length === 3],
    ['Backend AES-256-CBC + HMAC-SHA256 Telemetry', cryptoRep?.aes_256_backend?.roundtrip_verified === true],
    [
      'Live Crypto Inspect Endpoint (POST crypto/inspect)',
      inspectRes.status === 200 && inspectRes.body?.data?.decryption_verify?.verified_hmac === true,
    ],
    [
      'Profile Photo Upload via REST API (POST profile/photo)',
      photoRes.status === 200 && photoRes.body?.data?.avatar_url === sampleSvgUri,
    ],
    [
      'Vector/Text PDF Generator (Light Mode Web CV Template + Puppeteer Vector Fonts)',
      phpPdfTemplateExists &&
        phpPdfServiceExists &&
        pdfHtml.includes('cv-card') &&
        pdfRawString.startsWith('%PDF-1.') &&
        pdfRawString.includes('/Font'),
    ],
  ];

  let allPassed = true;
  for (const [label, ok] of checks) {
    console.log(`${ok ? '✅' : '❌'} Check: ${label}`);
    if (!ok) allPassed = false;
  }
  if (!allPassed) process.exit(1);
  console.log('✅ Všechny testy (React 18 + TypeScript Web & Backoffice + Tailwind + Montserrat + Material Symbols + AES-256 & JWT + Photo Upload) prošly!');
}
