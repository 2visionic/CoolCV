# CoolCV – Interaktivní PHP & MySQL Životopis + REST API & JWT Administrace

Minimalistické, vícejazyčné (**CZ / EN**) online CV navržené jako **technická prezentace (UX Designer • JavaScript • PHP • Junior C# .NET Core)** pro okamžité nasazení na **PHP + MySQL (phpMyAdmin) freehosting** i pro lokální vývoj přes **NPM (`npm run dev`)** nebo **Docker (`npm run docker:up`)**.

---

## ✨ Klíčové vlastnosti

1. **Plnohodnotné RESTful API (`api.php`) & JWT Bearer Autentifikace (`src/AuthService.php`):**
   - Autentifikace pomocí **JWT (JSON Web Token, HMAC-SHA256)** a `password_verify()` (**Bcrypt**).
   - Ošetřena specifika **PHP freehostingů**: token se čte z `Authorization: Bearer <token>`, `REDIRECT_HTTP_AUTHORIZATION`, `X-Api-Token` i z PHP `$_SESSION`, a metody `PUT`/`DELETE` podporují `X-HTTP-Method-Override`.
   - **Živý REST API Explorer** přímo na hlavní stránce životopisu (`#api-showcase`) pro okamžitou demonstraci API odpovědí náborářům a klientům.
2. **Administrace (`admin.php` + `assets/js/admin.js`):**
   - SPA administrace napojená čistě přes `fetch()` na REST API (`api.php`).
   - Přihlášení (`POST api.php?route=auth/login`) s možností jedním kliknutím vyplnit prezentační účet (`admin` / `Admin123!`).
   - **JWT Inspector** (zobrazení aktivního Bearer tokenu, dekódovaného payloadu, ověření platnosti `GET auth/me` a obnovení `POST auth/refresh`).
   - **Kompletní CRUD správa**: Osobní profil, Dovednosti, Pracovní zkušenosti, Projekty a Vzdělání + tlačítko pro obnovení výchozích dat (`POST api.php?route=system/reset`).
   - **Živý Network Monitor** vypisující v reálném čase každý odeslaný HTTP požadavek, dobu odezvy v `ms` a přijatý JSON.
3. **Čtyři hlavní pilíře + interaktivní JS filtr (`assets/js/app.js`):**
   - **UX Designer** (`ux`), **JavaScript Programátor** (`js`), **PHP Programátor** (`php`), **Junior C# .NET Core** (`dotnet`).
4. **Přepínač Světlého / Tmavého tématu a Jazyka (CZ / EN) v PHP `$_SESSION` + Tisk do A4 PDF.**

---

## 🔑 Výchozí přihlášení do Administrace & API

- **URL Administrace:** `/admin.php`
- **Uživatelské jméno:** `admin`
- **Heslo:** `Admin123!`

---

## 📡 Přehled REST API Endpointů (`api.php`)

| Metoda | Endpoint | Popis |
| :--- | :--- | :--- |
| `GET` | `api.php?route=status` | Stav API, aktivní DB driver (`mysql` / `sqlite` / `json`) a seznam endpointů |
| `GET` | `api.php?route=cv` | Kompletní JSON payload životopisu |
| `GET` | `api.php?route=skills&role=ux` | Seznam dovedností (s volitelným filtrem `ux`, `js`, `php`, `dotnet`) |
| `POST` | `api.php?route=auth/login` | Ověří `username` + `password` a vrátí **JWT Bearer token** |
| `GET` | `api.php?route=auth/me` | Ověří podpis a platnost JWT tokenu v hlavičce `Authorization: Bearer ...` |
| `POST` | `api.php?route=auth/refresh` | Vystaví nový JWT token s prodlouženou expirací |
| `PUT` | `api.php?route=profile` | **[JWT Auth]** Aktualizuje osobní profil a kontakty |
| `POST` | `api.php?route={entity}` | **[JWT Auth]** Vytvoří záznam v `skills`, `experience`, `projects` nebo `education` |
| `PUT` | `api.php?route={entity}&id=X` | **[JWT Auth]** Upraví záznam podle `id` |
| `DELETE` | `api.php?route={entity}&id=X` | **[JWT Auth]** Smaže záznam podle `id` |
| `POST` | `api.php?route=system/reset` | **[JWT Auth]** Obnoví databázi do výchozích ukázkových dat |

---

## 🚀 Jak projekt spustit lokálně

### Varianta A: Rychlý vývoj přes NPM (se záložní in-repo databází)
```powershell
npm run dev
```
- **Životopis (CV):** http://localhost:8000
- **Administrace & JWT Login:** http://localhost:8000/admin.php
- **REST API Status:** http://localhost:8000/api.php?route=status
- **Automatické testy (CV + JWT Auth + CRUD):** `npm test`

### Varianta B: Kompletní PHP 8.2 + MySQL 8 + phpMyAdmin v Dockeru
```powershell
npm run docker:up
```
- **PHP Web & API:** http://localhost:8000 (`index.php`, `admin.php`, `api.php`)
- **phpMyAdmin:** http://localhost:8080 (server: `db`, uživatel: `coolcv_user`, heslo: `coolcv_pass`)
