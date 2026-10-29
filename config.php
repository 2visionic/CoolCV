<?php
declare(strict_types=1);

// Configuration of CoolCV app (REST API, AES-256 and JWT Auth)
// Automatically detects local dev mode vs production server with MySQL

$httpHost = strtolower((string)($_SERVER['HTTP_HOST'] ?? 'localhost'));
$isLocalHost = (
    PHP_SAPI === 'cli' ||
    PHP_SAPI === 'cli-server' ||
    str_starts_with($httpHost, 'localhost') ||
    str_starts_with($httpHost, '127.0.0.1') ||
    str_ends_with($httpHost, '.local')
);

$appEnv = getenv('APP_ENV') ?: ($isLocalHost ? 'development' : 'production');
// In local dev we use in-repo DB unless DB_MYSQL_ENABLED=true is setted explicitly
$useMysql = ($appEnv === 'production') || filter_var(getenv('DB_MYSQL_ENABLED') ?: false, FILTER_VALIDATE_BOOLEAN);

return [
    'app' => [
        'env'           => $appEnv,  // 'development' (in-repo DB) or 'production' (MySQL on server)
        'default_lang'  => 'cs',     // 'cs' or 'en'
        'default_theme' => 'dark',   // 'dark' or 'light'
    ],
    'auth' => [
        // Secret key for signing JWT Bearer tokens (HMAC-SHA256) and deriving AES-256 keys
        'jwt_secret'    => getenv('JWT_SECRET') ?: 'coolcv-super-secret-jwt-key-2026-change-in-prod',
        'token_ttl'     => 3600 * 8, // Token validity: 8 hours
        'issuer'        => 'coolcv-rest-api',
    ],
    'db' => [
        // MySQL credentials for hosting server
        'mysql' => [
            'enabled'  => $useMysql,
            'host'     => getenv('DB_HOST') ?: 'sql201.infinityfree.com',
            'port'     => (int)(getenv('DB_PORT') ?: 3306),
            'database' => getenv('DB_NAME') ?: 'if0_43292832_coolpixel',
            'username' => getenv('DB_USER') ?: 'if0_43292832',
            'password' => getenv('DB_PASS') !== false ? getenv('DB_PASS') : 'dXblEi7wAr',
            'charset'  => 'utf8mb4',
        ],
        // Local dev database inside repository
        'sqlite_path' => __DIR__ . '/database/local_dev.sqlite',
        'json_path'   => __DIR__ . '/database/local_db.json',
    ],
];
