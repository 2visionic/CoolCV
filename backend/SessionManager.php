<?php
declare(strict_types=1);

namespace CoolCV;

// User session manager ($_SESSION) for theme ('light' | 'dark') and language ('cs' | 'en')
class SessionManager
{
    private string $defaultTheme;
    private string $defaultLang;

    public function __construct(string $defaultTheme = 'light', string $defaultLang = 'cs')
    {
        $this->defaultTheme = in_array($defaultTheme, ['light', 'dark'], true) ? $defaultTheme : 'light';
        $this->defaultLang = in_array($defaultLang, ['cs', 'en'], true) ? $defaultLang : 'cs';

        if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
            session_start();
        }

        if (!isset($_SESSION['theme'])) {
            $_SESSION['theme'] = $this->defaultTheme;
        }
        if (!isset($_SESSION['lang'])) {
            $_SESSION['lang'] = $this->defaultLang;
        }
    }

    // Handle GET/POST requests for changing theme or language in session
    public function handleRequest(): void
    {
        $changed = false;

        // Switch theme (light / dark)
        $requestedTheme = $_POST['theme'] ?? $_GET['theme'] ?? null;
        if (is_string($requestedTheme)) {
            if ($requestedTheme === 'toggle') {
                $_SESSION['theme'] = ($this->getTheme() === 'light') ? 'dark' : 'light';
                $changed = true;
            } elseif (in_array($requestedTheme, ['light', 'dark'], true)) {
                $_SESSION['theme'] = $requestedTheme;
                $changed = true;
            }
        }

        // Switch language (cs / en)
        $requestedLang = $_POST['lang'] ?? $_GET['lang'] ?? null;
        if (is_string($requestedLang)) {
            if ($requestedLang === 'toggle') {
                $_SESSION['lang'] = ($this->getLang() === 'cs') ? 'en' : 'cs';
                $changed = true;
            } elseif (in_array($requestedLang, ['cs', 'en'], true)) {
                $_SESSION['lang'] = $requestedLang;
                $changed = true;
            }
        }

        // If async AJAX request, return JSON response
        $isAjax = isset($_GET['ajax']) || (
            isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
            strtolower((string)$_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest'
        );

        if ($isAjax && $changed) {
            if (!headers_sent()) {
                header('Content-Type: application/json; charset=utf-8');
            }
            echo json_encode([
                'ok'    => true,
                'theme' => $this->getTheme(),
                'lang'  => $this->getLang(),
            ]);
            exit;
        }

        // On normal GET click redirect to clean URL without query params
        if ($changed && ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET' && !headers_sent()) {
            $cleanUrl = strtok((string)($_SERVER['REQUEST_URI'] ?? '/'), '?') ?: '/';
            header('Location: ' . $cleanUrl);
            exit;
        }
    }

    public function getTheme(): string
    {
        $theme = $_SESSION['theme'] ?? $this->defaultTheme;
        return in_array($theme, ['light', 'dark'], true) ? $theme : $this->defaultTheme;
    }

    public function getLang(): string
    {
        $lang = $_SESSION['lang'] ?? $this->defaultLang;
        return in_array($lang, ['cs', 'en'], true) ? $lang : $this->defaultLang;
    }
}
