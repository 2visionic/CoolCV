<?php
declare(strict_types=1);

namespace CoolCV;

require_once __DIR__ . '/CryptoService.php';

// API Authentication service (JWT Bearer HS256 + AES-256-CBC telemetry + Bcrypt)
class AuthService
{
    private string $secret;
    private string $cliSyncKey;
    private int $ttl;
    private string $issuer;
    private Database $db;
    private CryptoService $crypto;

    public function __construct(array $config, Database $db)
    {
        $authCfg = $config['auth'] ?? [];
        $this->secret = (string)($authCfg['jwt_secret'] ?? 'coolcv-secret-key');
        $this->cliSyncKey = (string)($authCfg['cli_sync_key'] ?? '');
        $this->ttl = (int)($authCfg['token_ttl'] ?? 28800);
        $this->issuer = (string)($authCfg['issuer'] ?? 'coolcv-rest-api');
        $this->db = $db;
        $this->crypto = new CryptoService($this->secret);

        if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
            session_start();
        }
    }

    public function getCrypto(): CryptoService
    {
        return $this->crypto;
    }

    // One-time creation of first admin account on first run if no user exist yet
    public function setupInitialAdmin(string $username, string $password, string $displayName = ''): ?array
    {
        if ($this->db->hasAnyUser()) {
            return null;
        }

        $username = trim($username);
        $displayName = trim($displayName) !== '' ? trim($displayName) : $username;
        if (strlen($username) < 3 || strlen($password) < 6) {
            throw new \InvalidArgumentException('Uživatelské jméno musí mít alespoň 3 znaky a heslo alespoň 6 znaků.');
        }

        $bcryptHash = password_hash($password, PASSWORD_BCRYPT);
        $user = $this->db->createInitialAdminUser($username, $bcryptHash, $displayName);

        return $this->issueSessionAndTokenForUser($user, $bcryptHash);
    }

    // Verify login credentials against cv_users table and issue JWT token
    public function login(string $username, string $password): ?array
    {
        $username = trim($username);
        if ($username === '' || $password === '') {
            return null;
        }

        $user = $this->db->findUserByUsername($username);
        if ($user === null) {
            return null;
        }

        $hash = (string)($user['password_hash'] ?? '');
        if ($hash === '' || !password_verify($password, $hash)) {
            return null;
        }

        $this->db->touchUserLogin((int)($user['id'] ?? 1));

        return $this->issueSessionAndTokenForUser($user, $hash);
    }

    private function issueSessionAndTokenForUser(array $user, string $activeHash): array
    {
        $now = time();
        $exp = $now + $this->ttl;
        $pwdFp = substr(hash_hmac('sha256', $activeHash, $this->secret), 0, 24);
        $payload = [
            'iss'          => $this->issuer,
            'sub'          => (int)($user['id'] ?? 1),
            'username'     => (string)$user['username'],
            'display_name' => (string)($user['display_name'] ?? $user['username']),
            'role'         => (string)($user['role'] ?? 'admin'),
            'pwd_fp'       => $pwdFp,
            'iat'          => $now,
            'exp'          => $exp,
        ];

        $token = $this->encodeJwt($payload);
        $csrfToken = bin2hex(random_bytes(16));
        $cryptoReport = $this->crypto->buildBackendCryptoReport($payload, $token, $activeHash);

        $_SESSION['auth_user'] = [
            'id'           => $payload['sub'],
            'username'     => $payload['username'],
            'display_name' => $payload['display_name'],
            'role'         => $payload['role'],
        ];
        $_SESSION['auth_token'] = $token;
        $_SESSION['csrf_token'] = $csrfToken;

        return [
            'token_type'     => 'Bearer',
            'access_token'   => $token,
            'expires_in'     => $this->ttl,
            'expires_at'     => date(DATE_ATOM, $exp),
            'csrf_token'     => $csrfToken,
            'user'           => $_SESSION['auth_user'],
            'jwt_payload'    => $payload,
            'backend_crypto' => $cryptoReport,
        ];
    }

    public function logout(): void
    {
        unset($_SESSION['auth_user'], $_SESSION['auth_token'], $_SESSION['csrf_token']);
    }

    public function authenticateRequest(): ?array
    {
        $token = $this->extractTokenFromRequest();
        if ($token !== null) {
            $payload = $this->decodeAndVerifyJwt($token);
            if ($payload !== null && $this->verifyUserFingerprint($payload)) {
                return $payload;
            }
        }

        if (!empty($_SESSION['auth_token']) && is_string($_SESSION['auth_token'])) {
            $payload = $this->decodeAndVerifyJwt($_SESSION['auth_token']);
            if ($payload !== null && $this->verifyUserFingerprint($payload)) {
                return $payload;
            }
        }

        return null;
    }

    private function verifyUserFingerprint(array $payload): bool
    {
        $username = trim((string)($payload['username'] ?? ''));
        $tokenFp = (string)($payload['pwd_fp'] ?? '');
        if ($username === '' || $tokenFp === '') {
            return false;
        }
        if ($this->cliSyncKey !== '' && strlen($this->cliSyncKey) >= 32) {
            $expectedCliFp = substr(hash_hmac('sha256', $this->cliSyncKey, $this->secret), 0, 24);
            if (hash_equals($expectedCliFp, $tokenFp)) {
                return true;
            }
        }
        $user = $this->db->findUserByUsername($username);
        if ($user === null) {
            return false;
        }
        $dbHash = (string)($user['password_hash'] ?? '');
        if ($dbHash === '') {
            return false;
        }
        $expectedFp = substr(hash_hmac('sha256', $dbHash, $this->secret), 0, 24);
        return hash_equals($expectedFp, $tokenFp);
    }

    public function refreshToken(array $currentPayload): array
    {
        $now = time();
        $exp = $now + $this->ttl;
        $newPayload = [
            'iss'          => $this->issuer,
            'sub'          => $currentPayload['sub'],
            'username'     => $currentPayload['username'],
            'display_name' => $currentPayload['display_name'] ?? $currentPayload['username'],
            'role'         => $currentPayload['role'] ?? 'admin',
            'pwd_fp'       => $currentPayload['pwd_fp'] ?? '',
            'iat'          => $now,
            'exp'          => $exp,
        ];

        $token = $this->encodeJwt($newPayload);
        $_SESSION['auth_token'] = $token;
        $cryptoReport = $this->crypto->buildBackendCryptoReport($newPayload, $token);

        return [
            'token_type'     => 'Bearer',
            'access_token'   => $token,
            'expires_in'     => $this->ttl,
            'expires_at'     => date(DATE_ATOM, $exp),
            'user'           => [
                'id'           => $newPayload['sub'],
                'username'     => $newPayload['username'],
                'display_name' => $newPayload['display_name'],
                'role'         => $newPayload['role'],
            ],
            'jwt_payload'    => $newPayload,
            'backend_crypto' => $cryptoReport,
        ];
    }

    public function extractTokenFromRequest(): ?string
    {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? null;

        if ($authHeader === null && function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (is_array($headers)) {
                foreach ($headers as $k => $v) {
                    if (strtolower((string)$k) === 'authorization') {
                        $authHeader = (string)$v;
                        break;
                    }
                }
            }
        }

        if (is_string($authHeader) && preg_match('/^Bearer\s+(.+)$/i', trim($authHeader), $matches)) {
            return trim($matches[1]);
        }

        if (!empty($_SERVER['HTTP_X_API_TOKEN'])) {
            return trim((string)$_SERVER['HTTP_X_API_TOKEN']);
        }

        return null;
    }

    public function encodeJwt(array $payload): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $segments = [
            $this->base64UrlEncode((string)json_encode($header)),
            $this->base64UrlEncode((string)json_encode($payload)),
        ];
        $signingInput = implode('.', $segments);
        $signature = hash_hmac('sha256', $signingInput, $this->secret, true);
        $segments[] = $this->base64UrlEncode($signature);

        return implode('.', $segments);
    }

    public function decodeAndVerifyJwt(string $jwt): ?array
    {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) {
            return null;
        }

        [$headB64, $bodyB64, $cryptoB64] = $parts;
        $header = json_decode($this->base64UrlDecode($headB64), true);
        if (!is_array($header) || ($header['alg'] ?? '') !== 'HS256') {
            return null;
        }

        $expectedSig = $this->base64UrlEncode(
            hash_hmac('sha256', $headB64 . '.' . $bodyB64, $this->secret, true)
        );

        if (!hash_equals($expectedSig, $cryptoB64)) {
            return null;
        }

        $payload = json_decode($this->base64UrlDecode($bodyB64), true);
        if (!is_array($payload)) {
            return null;
        }

        if (isset($payload['exp']) && (int)$payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return (string)base64_decode(strtr($data, '-_', '+/'));
    }
}
