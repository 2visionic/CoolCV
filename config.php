<?php
declare(strict_types=1);

if (basename((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) === basename(__FILE__)) {
    http_response_code(403);
    exit('403 Forbidden');
}

// Configuration of CoolCV app (REST API, AES-256 and JWT Auth)
// Sensitive credentials are loaded from untracked config.secret.php or environment variables.

$secretsFile = __DIR__ . '/config.secret.php';
$secrets = is_file($secretsFile) ? (require $secretsFile) : [];
$mysqlSecrets = is_array($secrets['mysql'] ?? null) ? $secrets['mysql'] : [];

$httpHost = strtolower((string)($_SERVER['HTTP_HOST'] ?? 'localhost'));
$isLocalHost = (
    PHP_SAPI === 'cli' ||
    PHP_SAPI === 'cli-server' ||
    str_starts_with($httpHost, 'localhost') ||
    str_starts_with($httpHost, '127.0.0.1') ||
    str_ends_with($httpHost, '.local')
);

$appEnv = getenv('APP_ENV') ?: ($isLocalHost ? 'development' : 'production');
// In local dev we use in-repo DB unless DB_MYSQL_ENABLED=true is set explicitly
$useMysql = ($appEnv === 'production') || filter_var(getenv('DB_MYSQL_ENABLED') ?: false, FILTER_VALIDATE_BOOLEAN);

return [
    'app' => [
        'env'           => $appEnv,  // 'development' (in-repo DB) or 'production' (MySQL on server)
        'default_lang'  => 'cs',     // 'cs' or 'en'
        'default_theme' => 'dark',   // 'dark' or 'light'
    ],
    'auth' => [
        // Secret key for signing JWT Bearer tokens (HMAC-SHA256) and deriving AES-256 keys
        'jwt_secret'    => getenv('JWT_SECRET') ?: (string)($secrets['jwt_secret'] ?? 'local-dev-only-jwt-secret-key'),
        'cli_sync_key'  => (string)($secrets['cli_sync_key'] ?? ''),
        'token_ttl'     => 3600 * 8, // Token validity: 8 hours
        'issuer'        => 'coolcv-rest-api',
    ],
    'db' => [
        // MySQL credentials for hosting server (loaded from config.secret.php or ENV)
        'mysql' => [
            'enabled'  => $useMysql,
            'host'     => getenv('DB_HOST') ?: (string)($mysqlSecrets['host'] ?? 'localhost'),
            'port'     => (int)(getenv('DB_PORT') ?: ($mysqlSecrets['port'] ?? 3306)),
            'database' => getenv('DB_NAME') ?: (string)($mysqlSecrets['database'] ?? 'coolcv'),
            'username' => getenv('DB_USER') ?: (string)($mysqlSecrets['username'] ?? 'root'),
            'password' => getenv('DB_PASS') !== false ? getenv('DB_PASS') : (string)($mysqlSecrets['password'] ?? ''),
            'charset'  => 'utf8mb4',
        ],
        // Local dev database inside repository
        'sqlite_path' => __DIR__ . '/database/local_dev.sqlite',
        'json_path'   => __DIR__ . '/database/local_db.json',
    ],
];
