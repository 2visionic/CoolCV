<?php
declare(strict_types=1);

namespace CoolCV;

// Cryptographic service on PHP backend (AES-256-CBC + HMAC-SHA256 + Bcrypt + JWT HS256)
class CryptoService
{
    private string $masterSecret;
    private string $encKey;
    private string $macKey;

    public function __construct(string $secret)
    {
        $this->masterSecret = $secret !== '' ? $secret : 'coolcv-default-master-secret-2026';
        // Derive separate 256-bit keys for encryption (AES-256) and integrity (HMAC-SHA256)
        $this->encKey = hash_hmac('sha256', 'aes-256-encryption-key', $this->masterSecret, true);
        $this->macKey = hash_hmac('sha256', 'hmac-sha256-auth-key', $this->masterSecret, true);
    }

    // Encrypt string or array using AES-256-CBC + HMAC-SHA256
    public function encryptPayload(array|string $data): array
    {
        $plaintext = is_array($data)
            ? (string)json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
            : (string)$data;

        $iv = random_bytes(16);
        $cipherRaw = openssl_encrypt(
            $plaintext,
            'aes-256-cbc',
            $this->encKey,
            OPENSSL_RAW_DATA,
            $iv
        );

        if ($cipherRaw === false) {
            throw new \RuntimeException('OpenSSL AES-256-CBC šifrování selhalo.');
        }

        $hmacRaw = hash_hmac('sha256', $iv . $cipherRaw, $this->macKey, true);
        $envelope = base64_encode($iv . $hmacRaw . $cipherRaw);

        return [
            'algorithm'         => 'AES-256-CBC + HMAC-SHA256 (Encrypt-then-MAC)',
            'key_derivation'    => 'SHA-256 HKDF (256-bit Encryption Key + 256-bit MAC Key)',
            'iv_hex'            => bin2hex($iv),
            'ciphertext_base64' => base64_encode($cipherRaw),
            'hmac_sha256_hex'   => bin2hex($hmacRaw),
            'encrypted_envelope'=> $envelope,
            'plaintext_bytes'   => strlen($plaintext),
            'encrypted_at'      => date(DATE_ATOM),
        ];
    }

    // Verify HMAC-SHA256 in constant time and decrypt AES-256-CBC envelope
    public function decryptEnvelope(string $envelope): ?array
    {
        $raw = base64_decode($envelope, true);
        if ($raw === false || strlen($raw) < 49) {
            return null;
        }

        $iv = substr($raw, 0, 16);
        $hmacReceived = substr($raw, 16, 32);
        $cipherRaw = substr($raw, 48);

        $hmacExpected = hash_hmac('sha256', $iv . $cipherRaw, $this->macKey, true);
        if (!hash_equals($hmacExpected, $hmacReceived)) {
            return null;
        }

        $decrypted = openssl_decrypt(
            $cipherRaw,
            'aes-256-cbc',
            $this->encKey,
            OPENSSL_RAW_DATA,
            $iv
        );

        if ($decrypted === false) {
            return null;
        }

        $decodedJson = json_decode($decrypted, true);

        return [
            'verified_hmac'   => true,
            'iv_hex'          => bin2hex($iv),
            'decrypted_raw'   => $decrypted,
            'decrypted_json'  => is_array($decodedJson) ? $decodedJson : null,
        ];
    }

    // Build complete backend crypto telemetry report for Backoffice
    public function buildBackendCryptoReport(array $jwtPayload, string $jwtToken, ?string $bcryptHash = null): array
    {
        $parts = explode('.', $jwtToken);
        $encDemo = $this->encryptPayload([
            'sub'       => $jwtPayload['sub'] ?? 1,
            'username'  => $jwtPayload['username'] ?? 'admin',
            'role'      => $jwtPayload['role'] ?? 'admin',
            'issued_at' => $jwtPayload['iat'] ?? time(),
            'scope'     => 'backoffice:crud:full',
        ]);
        $decDemo = $this->decryptEnvelope($encDemo['encrypted_envelope']);

        $sampleHash = $bcryptHash ?: password_hash('Admin123!', PASSWORD_BCRYPT);
        $hashInfo = password_get_info($sampleHash);

        return [
            'jwt_hs256' => [
                'standard'       => 'RFC 7519 (JSON Web Token)',
                'algorithm'      => 'HS256 (HMAC using SHA-256)',
                'header_b64'     => $parts[0] ?? '',
                'payload_b64'    => $parts[1] ?? '',
                'signature_b64'  => $parts[2] ?? '',
                'decoded_header' => ['alg' => 'HS256', 'typ' => 'JWT'],
                'decoded_payload'=> $jwtPayload,
            ],
            'aes_256_backend' => array_merge($encDemo, [
                'roundtrip_verified' => $decDemo !== null && $decDemo['verified_hmac'] === true,
                'decrypted_preview'  => $decDemo['decrypted_json'] ?? null,
            ]),
            'password_hashing' => [
                'algorithm'   => $hashInfo['algoName'] ?? 'bcrypt (2y)',
                'cost_factor' => $hashInfo['options']['cost'] ?? 10,
                'hash_sample' => substr($sampleHash, 0, 29) . '...[redacted]',
            ],
        ];
    }
}
