<?php
declare(strict_types=1);

// CoolCV main entry file for React 18 frontend web and PHP REST API hydration
$config = require __DIR__ . '/config.php';

require_once __DIR__ . '/backend/SessionManager.php';
require_once __DIR__ . '/backend/Database.php';
require_once __DIR__ . '/backend/I18n.php';

use CoolCV\SessionManager;
use CoolCV\Database;

// Default theme is setted to dark by reference design (can switch in session to light)
$session = new SessionManager(
    $_SESSION['theme'] ?? 'dark',
    $config['app']['default_lang'] ?? 'cs'
);
$session->handleRequest();

$currentTheme = $session->getTheme();
$currentLang  = $session->getLang();

$db   = new Database($config);
$data = $db->getAllData();

$initialView = (isset($_GET['view']) && $_GET['view'] === 'backoffice') ? 'backoffice' : 'cv';

function e(?string $value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$initialStateJson = json_encode([
    'theme'       => $currentTheme,
    'lang'        => $currentLang,
    'initialView' => $initialView,
    'cvData'      => $data,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP);
?>
<!DOCTYPE html>
<html lang="<?= e($currentLang) ?>" data-theme="<?= e($currentTheme) ?>" class="<?= $currentTheme === 'dark' ? 'dark' : '' ?>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e($data['profile']['full_name'] ?? 'Jan Novák') ?> — UX Designer • JS • PHP • Junior C# .NET Core</title>
  <meta name="description" content="<?= e($data['profile']['bio_cs'] ?? '') ?>">

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
          },
          colors: {
            obsidian: {
              950: '#090a10',
              900: '#0d0f18',
              800: '#141724',
              700: '#1c2032',
            }
          }
        }
      }
    };
  </script>

  <?php
    $cssVer = @filemtime(__DIR__ . '/assets/css/style.css') ?: time();
    $jsVer  = @filemtime(__DIR__ . '/dist/bundle.js') ?: time();
  ?>
  <link rel="stylesheet" href="assets/css/style.css?v=<?= $cssVer ?>">
</head>
<body class="font-sans antialiased selection:bg-purple-500 selection:text-white">

  <div id="react-root"></div>

  <script>
    window.__INITIAL_STATE__ = <?= $initialStateJson ?>;
  </script>

  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="assets/js/html2pdf.bundle.min.js"></script>

  <script src="dist/bundle.js?v=<?= $jsVer ?>"></script>
</body>
</html>
