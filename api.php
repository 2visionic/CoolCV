<?php
declare(strict_types=1);

// Headless PHP REST API for React frontend and backoffice (JWT HS256 + AES-256-CBC + CRUD)

$startTime = microtime(true);

$config = require __DIR__ . '/config.php';
require_once __DIR__ . '/backend/Database.php';
require_once __DIR__ . '/backend/CryptoService.php';
require_once __DIR__ . '/backend/AuthService.php';
require_once __DIR__ . '/backend/PdfService.php';

use CoolCV\Database;
use CoolCV\AuthService;
use CoolCV\PdfService;

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Api-Token, X-HTTP-Method-Override');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$db = new Database($config);
$auth = new AuthService($config, $db);

$rawBody = (string)file_get_contents('php://input');
$jsonBody = [];
if ($rawBody !== '') {
    $decoded = json_decode($rawBody, true);
    if (is_array($decoded)) {
        $jsonBody = $decoded;
    }
}
$input = array_merge($_POST, $jsonBody);

$method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));
$override = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? $input['_method'] ?? null;
if ($method === 'POST' && is_string($override)) {
    $overrideUpper = strtoupper(trim($override));
    if (in_array($overrideUpper, ['PUT', 'DELETE', 'PATCH'], true)) {
        $method = $overrideUpper;
    }
}

$route = trim((string)($_GET['route'] ?? $input['route'] ?? 'status'), '/');
$id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($input['id']) ? (int)$input['id'] : 0);

function sendJson(int $statusCode, array $payload, float $startTime, string $driver, string $route, string $method): never
{
    http_response_code($statusCode);
    $elapsedMs = round((microtime(true) - $startTime) * 1000, 2);
    $response = array_merge($payload, [
        'meta' => [
            'route'        => $route,
            'method'       => $method,
            'status'       => $statusCode,
            'db_driver'    => $driver,
            'execution_ms' => $elapsedMs,
            'timestamp'    => date(DATE_ATOM),
        ],
    ]);
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

function requireAuth(AuthService $auth, float $startTime, string $driver, string $route, string $method): array
{
    $userPayload = $auth->authenticateRequest();
    if ($userPayload === null) {
        sendJson(401, [
            'ok'    => false,
            'error' => 'Unauthorized: Chybí nebo je neplatný JWT Bearer token. Přihlaste se v Backoffice.',
        ], $startTime, $driver, $route, $method);
    }
    return $userPayload;
}

$driver = $db->getDriverName();

try {
    // 1. Status and list of endpoints
    if ($route === '' || $route === 'status') {
        $authUser = $auth->authenticateRequest();
        sendJson(200, [
            'ok'            => true,
            'service'       => 'CoolCV PHP 8 REST API + AES-256 & JWT Engine',
            'needs_setup'   => !$db->hasAnyUser(),
            'authenticated' => $authUser !== null,
            'user'          => $authUser,
            'crypto_engine' => 'OpenSSL AES-256-CBC + HMAC-SHA256 + JWT HS256 + Bcrypt',
            'endpoints'     => [
                'GET  api.php?route=status'         => 'Stav API, kryptografický engine a aktivní DB driver',
                'GET  api.php?route=cv'             => 'Kompletní datový model pro React Frontend & Backoffice',
                'POST api.php?route=auth/setup'     => 'Jednorázové vytvoření 1. administrátora při prvním spuštění',
                'POST api.php?route=auth/login'     => 'Autentifikace -> JWT Bearer token + Backend Crypto Report',
                'GET  api.php?route=auth/me'        => 'Ověření platnosti JWT tokenu a detail šifrování',
                'POST api.php?route=crypto/inspect' => 'Živé zašifrování a dešifrování dat na PHP backendu (AES-256-CBC + HMAC-SHA256)',
                'PUT  api.php?route=profile'        => '[JWT] Aktualizace osobního profilu',
                'POST api.php?route=profile/photo'  => '[JWT] Nahrání a uložení profilové fotografie',
                'POST/PUT/DELETE api.php?route={entity}' => '[JWT] CRUD operace pro skills, experience, projects, education',
                'POST api.php?route=system/reset'   => '[JWT] Obnovení databáze do výchozích dat',
            ],
        ], $startTime, $driver, $route, $method);
    }

    // 2. First run admin setup and authentication
    if ($route === 'auth/setup-status') {
        sendJson(200, [
            'ok'          => true,
            'needs_setup' => !$db->hasAnyUser(),
        ], $startTime, $driver, $route, $method);
    }

    if ($route === 'auth/setup') {
        if ($method !== 'POST') {
            sendJson(405, ['ok' => false, 'error' => 'Method Not Allowed (použijte POST)'], $startTime, $driver, $route, $method);
        }
        if ($db->hasAnyUser()) {
            sendJson(403, [
                'ok'    => false,
                'error' => 'Administrátorský účet již v databázi existuje. Přihlaste se prosím svým účtem.',
            ], $startTime, $driver, $route, $method);
        }

        $username = trim((string)($input['username'] ?? ''));
        $password = (string)($input['password'] ?? '');
        $displayName = trim((string)($input['display_name'] ?? ''));

        if (strlen($username) < 3 || strlen($password) < 6) {
            sendJson(400, [
                'ok'    => false,
                'error' => 'Uživatelské jméno musí mít alespoň 3 znaky a heslo alespoň 6 znaků.',
            ], $startTime, $driver, $route, $method);
        }

        $created = $auth->setupInitialAdmin($username, $password, $displayName);
        if ($created === null) {
            sendJson(403, ['ok' => false, 'error' => 'Administrátorský účet již existuje.'], $startTime, $driver, $route, $method);
        }

        sendJson(201, [
            'ok'      => true,
            'message' => 'První administrátorský účet byl bezpečně vytvořen (Bcrypt) a přihlášen (JWT HS256).',
            'data'    => $created,
        ], $startTime, $driver, $route, $method);
    }

    if ($route === 'auth/login') {
        if ($method !== 'POST') {
            sendJson(405, ['ok' => false, 'error' => 'Method Not Allowed (použijte POST)'], $startTime, $driver, $route, $method);
        }
        if (!$db->hasAnyUser()) {
            sendJson(403, [
                'ok'          => false,
                'needs_setup' => true,
                'error'       => 'V databázi zatím neexistuje žádný uživatel. Vytvořte nejprve administrátorský účet.',
            ], $startTime, $driver, $route, $method);
        }
        $username = (string)($input['username'] ?? '');
        $password = (string)($input['password'] ?? '');
        $result = $auth->login($username, $password);

        if ($result === null) {
            sendJson(401, [
                'ok'    => false,
                'error' => 'Neplatné uživatelské jméno nebo heslo.',
            ], $startTime, $driver, $route, $method);
        }

        sendJson(200, [
            'ok'      => true,
            'message' => 'Autentifikace úspěšná. JWT Bearer token a AES-256 obálka byly vygenerovány na backendu.',
            'data'    => $result,
        ], $startTime, $driver, $route, $method);
    }

    if ($route === 'auth/me') {
        $payload = requireAuth($auth, $startTime, $driver, $route, $method);
        $rawToken = $auth->extractTokenFromRequest() ?? ($_SESSION['auth_token'] ?? '');
        $cryptoReport = $auth->getCrypto()->buildBackendCryptoReport($payload, (string)$rawToken);

        sendJson(200, [
            'ok'             => true,
            'authenticated'  => true,
            'user'           => [
                'id'           => $payload['sub'],
                'username'     => $payload['username'],
                'display_name' => $payload['display_name'] ?? $payload['username'],
                'role'         => $payload['role'] ?? 'admin',
            ],
            'jwt_payload'    => $payload,
            'backend_crypto' => $cryptoReport,
        ], $startTime, $driver, $route, $method);
    }

    if ($route === 'auth/refresh') {
        if ($method !== 'POST') {
            sendJson(405, ['ok' => false, 'error' => 'Method Not Allowed'], $startTime, $driver, $route, $method);
        }
        $payload = requireAuth($auth, $startTime, $driver, $route, $method);
        $refreshed = $auth->refreshToken($payload);
        sendJson(200, [
            'ok'      => true,
            'message' => 'JWT token byl obnoven a znovu podepsán pomocí HMAC-SHA256.',
            'data'    => $refreshed,
        ], $startTime, $driver, $route, $method);
    }

    if ($route === 'auth/logout') {
        $auth->logout();
        sendJson(200, [
            'ok'      => true,
            'message' => 'Uživatel byl odhlášen.',
        ], $startTime, $driver, $route, $method);
    }

    // 3. Live encryption demo on PHP backend
    if ($route === 'crypto/inspect') {
        $sampleText = (string)($input['plaintext'] ?? $_GET['plaintext'] ?? 'Tajná zpráva / Token Payload pro ověření AES-256-CBC na PHP backendu');
        $encrypted = $auth->getCrypto()->encryptPayload($sampleText);
        $decrypted = $auth->getCrypto()->decryptEnvelope($encrypted['encrypted_envelope']);

        sendJson(200, [
            'ok'      => true,
            'message' => 'Kryptografická operace proběhla přímo na PHP backendu (OpenSSL AES-256-CBC + HMAC-SHA256).',
            'data'    => [
                'input_plaintext'    => $sampleText,
                'encryption_process' => $encrypted,
                'decryption_verify'  => $decrypted,
            ],
        ], $startTime, $driver, $route, $method);
    }

    // 4. Complete CV data payload for frontend and backoffice
    if ($route === 'cv') {
        sendJson(200, [
            'ok'   => true,
            'data' => $db->getAllData(),
        ], $startTime, $driver, $route, $method);
    }

    // 4B. Vector/text PDF generation from backend/pdf_template.php with live dynamic DB data
    if ($route === 'cv/pdf' || $route === 'pdf') {
        $lang = (string)($_GET['lang'] ?? $input['lang'] ?? 'cs');
        $lang = $lang === 'en' ? 'en' : 'cs';
        $dbData = $db->getAllData();
        $cvPayload = (isset($input['cvData']) && is_array($input['cvData']) && !empty($input['cvData']['profile']))
            ? array_merge($dbData, $input['cvData'])
            : $dbData;

        if (($_GET['format'] ?? '') === 'html') {
            header('Content-Type: text/html; charset=utf-8');
            header('Cache-Control: no-store, no-cache, must-revalidate');
            echo PdfService::buildHtml($cvPayload, $lang);
            exit;
        }

        $rawName = (string)($cvPayload['profile']['full_name'] ?? 'Jan-Novak');
        $safeName = preg_replace('/[^a-zA-Z0-9]+/', '-', iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $rawName) ?: 'CoolCV');
        $safeName = trim((string)$safeName, '-') ?: 'CoolCV';
        $filename = $safeName . '-CV-' . strtoupper($lang) . '.pdf';

        $pdfBytes = PdfService::renderPdf($cvPayload, $lang);
        if ($pdfBytes !== null && strlen($pdfBytes) > 1000) {
            header('Content-Type: application/pdf');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            header('Content-Length: ' . strlen($pdfBytes));
            header('Cache-Control: no-store, no-cache, must-revalidate');
            echo $pdfBytes;
            exit;
        }

        sendJson(200, [
            'ok'       => true,
            'mode'     => 'html_vector_print',
            'filename' => $filename,
            'html'     => PdfService::buildHtml($cvPayload, $lang),
        ], $startTime, $driver, $route, $method);
    }

    // 5. Upload profile photo
    if ($route === 'profile/photo') {
        if ($method !== 'POST' && $method !== 'PUT') {
            sendJson(405, ['ok' => false, 'error' => 'Method Not Allowed'], $startTime, $driver, $route, $method);
        }
        requireAuth($auth, $startTime, $driver, $route, $method);

        $photoDataUrl = (string)($input['photo_data_url'] ?? $input['avatar_url'] ?? '');

        // Support also classic multipart/form-data upload
        if ($photoDataUrl === '' && !empty($_FILES['photo']['tmp_name']) && is_uploaded_file($_FILES['photo']['tmp_name'])) {
            $mime = mime_content_type($_FILES['photo']['tmp_name']) ?: 'image/jpeg';
            $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!in_array($mime, $allowed, true)) {
                sendJson(400, ['ok' => false, 'error' => 'Nepodporovaný formát obrázku. Použijte JPG, PNG nebo WebP.'], $startTime, $driver, $route, $method);
            }
            $rawBytes = (string)file_get_contents($_FILES['photo']['tmp_name']);
            $photoDataUrl = 'data:' . $mime . ';base64,' . base64_encode($rawBytes);
        }

        if ($photoDataUrl === '' || (!str_starts_with($photoDataUrl, 'data:image/') && !str_starts_with($photoDataUrl, 'http') && !str_starts_with($photoDataUrl, '/'))) {
            sendJson(400, ['ok' => false, 'error' => 'Neplatná data fotografie.'], $startTime, $driver, $route, $method);
        }

        // Optional save into uploads/ folder if writable on hosting
        if (str_starts_with($photoDataUrl, 'data:image/')) {
            $uploadsDir = __DIR__ . '/uploads';
            if (!is_dir($uploadsDir)) {
                @mkdir($uploadsDir, 0755, true);
            }
            if (is_dir($uploadsDir) && is_writable($uploadsDir)) {
                $commaPos = strpos($photoDataUrl, ',');
                if ($commaPos !== false) {
                    $b64 = substr($photoDataUrl, $commaPos + 1);
                    $bin = base64_decode($b64, true);
                    if ($bin !== false) {
                        @file_put_contents($uploadsDir . '/avatar_latest.jpg', $bin);
                    }
                }
            }
        }

        $updatedProfile = $db->updateProfile(['avatar_url' => $photoDataUrl]);
        sendJson(200, [
            'ok'      => true,
            'message' => 'Profilová fotografie byla úspěšně nahrána a uložena do databáze.',
            'data'    => $updatedProfile,
        ], $startTime, $driver, $route, $method);
    }

    // 6. Profile endpoint
    if ($route === 'profile') {
        if ($method === 'GET') {
            sendJson(200, [
                'ok'   => true,
                'data' => $db->getAllData()['profile'],
            ], $startTime, $driver, $route, $method);
        }
        if ($method === 'PUT' || $method === 'POST') {
            requireAuth($auth, $startTime, $driver, $route, $method);
            $updated = $db->updateProfile($input);
            sendJson(200, [
                'ok'      => true,
                'message' => 'Profil byl úspěšně aktualizován přes REST API.',
                'data'    => $updated,
            ], $startTime, $driver, $route, $method);
        }
        sendJson(405, ['ok' => false, 'error' => 'Method Not Allowed'], $startTime, $driver, $route, $method);
    }

    // 7. Collections CRUD & Reorder: roles | skills | experience | projects | education | socials
    if (preg_match('#^(roles|skills|experience|projects|education|socials)/reorder$#', $route, $m)) {
        if ($method !== 'POST' && $method !== 'PUT') {
            sendJson(405, ['ok' => false, 'error' => 'Method Not Allowed'], $startTime, $driver, $route, $method);
        }
        requireAuth($auth, $startTime, $driver, $route, $method);
        $entityName = $m[1];
        $orderedIds = isset($input['ordered_ids']) && is_array($input['ordered_ids']) ? $input['ordered_ids'] : [];
        $reordered = $db->reorderItems($entityName, $orderedIds);
        sendJson(200, [
            'ok'      => true,
            'message' => 'Pořadí položek bylo aktualizováno.',
            'data'    => $reordered,
        ], $startTime, $driver, $route, $method);
    }

    if (in_array($route, ['roles', 'skills', 'experience', 'projects', 'education', 'socials'], true)) {
        if ($method === 'GET') {
            $items = $db->getAllData()[$route] ?? [];
            $roleFilter = isset($_GET['role']) ? trim((string)$_GET['role']) : '';
            if ($roleFilter !== '' && $roleFilter !== 'all') {
                $items = array_values(array_filter($items, function (array $row) use ($roleFilter): bool {
                    if (isset($row['role_slug'])) {
                        return $row['role_slug'] === $roleFilter;
                    }
                    $tags = array_map('trim', explode(',', (string)($row['role_tags'] ?? '')));
                    return in_array($roleFilter, $tags, true);
                }));
            }
            sendJson(200, [
                'ok'    => true,
                'count' => count($items),
                'data'  => $items,
            ], $startTime, $driver, $route, $method);
        }

        requireAuth($auth, $startTime, $driver, $route, $method);

        if (($method === 'POST' || $method === 'PUT') && ((string)($_GET['action'] ?? $input['action'] ?? '') === 'reorder' || isset($input['ordered_ids']))) {
            $orderedIds = isset($input['ordered_ids']) && is_array($input['ordered_ids']) ? $input['ordered_ids'] : [];
            $reordered = $db->reorderItems($route, $orderedIds);
            sendJson(200, [
                'ok'      => true,
                'message' => 'Pořadí položek bylo aktualizováno.',
                'data'    => $reordered,
            ], $startTime, $driver, $route, $method);
        }

        if ($method === 'POST' && $id === 0) {
            $created = $db->createItem($route, $input);
            sendJson(201, [
                'ok'      => true,
                'message' => 'Položka byla vytvořena.',
                'data'    => $created,
            ], $startTime, $driver, $route, $method);
        }

        if ($method === 'PUT' || ($method === 'POST' && $id > 0)) {
            if ($id <= 0) {
                sendJson(400, ['ok' => false, 'error' => 'Chybí parametr ID pro úpravu záznamu.'], $startTime, $driver, $route, $method);
            }
            $updated = $db->updateItem($route, $id, $input);
            if ($updated === null) {
                sendJson(404, ['ok' => false, 'error' => 'Záznam s daným ID nebyl nalezen.'], $startTime, $driver, $route, $method);
            }
            sendJson(200, [
                'ok'      => true,
                'message' => 'Položka byla aktualizována.',
                'data'    => $updated,
            ], $startTime, $driver, $route, $method);
        }

        if ($method === 'DELETE') {
            if ($id <= 0) {
                sendJson(400, ['ok' => false, 'error' => 'Chybí parametr ID pro smazání záznamu.'], $startTime, $driver, $route, $method);
            }
            $deleted = $db->deleteItem($route, $id);
            if (!$deleted) {
                sendJson(404, ['ok' => false, 'error' => 'Záznam s daným ID nebyl nalezen.'], $startTime, $driver, $route, $method);
            }
            sendJson(200, [
                'ok'      => true,
                'message' => 'Položka byla smazána.',
                'id'      => $id,
            ], $startTime, $driver, $route, $method);
        }
    }

    // 9. Reset database to default seed data
    if ($route === 'system/reset') {
        if ($method !== 'POST') {
            sendJson(405, ['ok' => false, 'error' => 'Method Not Allowed'], $startTime, $driver, $route, $method);
        }
        requireAuth($auth, $startTime, $driver, $route, $method);
        $resetData = $db->resetToDefaultSeed();
        sendJson(200, [
            'ok'      => true,
            'message' => 'Databáze byla obnovena do výchozích ukázkových dat.',
            'data'    => $resetData,
        ], $startTime, $driver, $route, $method);
    }

    sendJson(404, [
        'ok'    => false,
        'error' => "Endpoint '$route' nebyl nalezen.",
    ], $startTime, $driver, $route, $method);

} catch (Throwable $e) {
    sendJson(500, [
        'ok'    => false,
        'error' => 'Interní chyba serveru: ' . $e->getMessage(),
    ], $startTime, $driver, $route, $method);
}
