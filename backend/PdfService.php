<?php
declare(strict_types=1);

namespace CoolCV;

// Service for rendering the standalone PHP template (backend/pdf_template.php) with live dynamic data
class PdfService
{
    // Render standalone PHP template (backend/pdf_template.php) with live dynamic $cvData into HTML string
    public static function buildHtml(array $cvData, string $lang = 'cs'): string
    {
        $lang = $lang === 'en' ? 'en' : 'cs';
        ob_start();
        include __DIR__ . '/pdf_template.php';
        return (string)ob_get_clean();
    }

    // Render live dynamic HTML into binary vector PDF if Headless Chromium/Chrome/Edge is available on the server
    public static function renderPdf(array $cvData, string $lang = 'cs'): ?string
    {
        $lang = $lang === 'en' ? 'en' : 'cs';
        $html = self::buildHtml($cvData, $lang);

        if (!function_exists('exec')) {
            return null;
        }

        $browsers = [
            getenv('CHROME_PATH') ?: '',
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
        ];

        foreach ($browsers as $bin) {
            if (($bin !== '' && @is_executable($bin)) || ($bin !== '' && @file_exists($bin))) {
                $tmpHtml = tempnam(sys_get_temp_dir(), 'coolcv_') . '.html';
                $tmpPdf  = tempnam(sys_get_temp_dir(), 'coolcv_') . '.pdf';
                @file_put_contents($tmpHtml, $html);
                $cmd = sprintf(
                    '"%s" --headless --disable-gpu --no-sandbox --print-to-pdf-no-header --print-to-pdf="%s" "file:///%s" 2>&1',
                    $bin,
                    $tmpPdf,
                    str_replace('\\', '/', $tmpHtml)
                );
                @exec($cmd, $out, $code);
                if ($code === 0 && @file_exists($tmpPdf) && @filesize($tmpPdf) > 1000) {
                    $bytes = (string)@file_get_contents($tmpPdf);
                    @unlink($tmpHtml);
                    @unlink($tmpPdf);
                    return $bytes;
                }
                @unlink($tmpHtml);
                @unlink($tmpPdf);
            }
        }

        return null;
    }
}
