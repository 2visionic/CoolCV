<?php
declare(strict_types=1);

namespace CoolCV;

// Multi-language dictionary (CZ / EN) and helper for localized database fields
class I18n
{
    private string $lang;

    private const DICTIONARY = [
        'cs' => [
            'meta_title'          => 'Životopis & Portfolio | UX Designer • JS • PHP • Junior C# .NET Core',
            'nav_pillars'         => 'Odbornost',
            'nav_skills'          => 'Dovednosti',
            'nav_experience'      => 'Zkušenosti',
            'nav_projects'        => 'Projekty',
            'nav_education'       => 'Vzdělání',
            'nav_api'             => 'REST API',
            'btn_admin'           => 'Administrace & API',
            'theme_light'         => 'Světlý',
            'theme_dark'          => 'Tmavý',
            'theme_toggle_title'  => 'Přepnout světlé / tmavé téma (uloženo v PHP Session)',
            'lang_toggle_title'   => 'Switch language to English (uloženo v PHP Session)',
            'btn_print_pdf'       => 'Tisk / Export A4 PDF',
            'btn_contact'         => 'Napsat e-mail',
            'filter_label'        => 'Filtrovat CV podle zaměření:',
            'filter_all'          => 'Všechny obory (Full-Profile)',
            'filter_active_hint'  => 'Zobrazuji vybranou specializaci – kliknutím na jinou roli upravíte zobrazené dovednosti, praxi i projekty.',
            'section_pillars'     => 'Hlavní pilíře & Role',
            'section_pillars_sub' => 'Kliknutím na libovolnou kartu vyfiltrujete celé CV pro danou pozici.',
            'section_skills'      => 'Technické & UX dovednosti',
            'section_skills_sub'  => 'Přehled nástrojů, technologií a praktických zkušeností podle oboru.',
            'section_experience'  => 'Pracovní zkušenosti',
            'section_exp_sub'     => 'Historie praxe a měřitelné výsledky v UX designu a vývoji.',
            'section_projects'    => 'Vybrané projekty & Případové studie',
            'section_proj_sub'    => 'Ukázky propojení čistého UX/UI návrhu s kódem v JS, PHP a C# .NET Core.',
            'section_education'   => 'Vzdělání & Certifikace',
            'section_api_title'   => 'Živá ukázka: REST API & JWT Autentifikace',
            'section_api_sub'     => 'Tento životopis obsahuje vlastní RESTful API a kompletní administraci. Vyzkoušejte živé dotazy přímo zde nebo otevřete administraci.',
            'api_try_label'       => 'Vyzkoušet živý API endpoint:',
            'api_open_admin'      => 'Otevřít Administraci (JWT Login & CRUD)',
            'outcome_label'       => 'Výsledek / Dopad:',
            'tech_label'          => 'Technologie:',
            'code_link'           => 'Zdrojový kód',
            'case_study_link'     => 'Detail řešení',
            'db_status_label'     => 'Databázový zdroj:',
            'session_status'      => 'PHP Session aktivní',
            'print_footer_note'   => 'Vygenerováno z online interaktivního CV',
            'years_label'         => 'Praxe:',
            'Filter_count_prefix' => 'Zobrazeno položek:',
        ],
        'en' => [
            'meta_title'          => 'Resume & Portfolio | UX Designer • JS • PHP • Junior C# .NET Core',
            'nav_pillars'         => 'Expertise',
            'nav_skills'          => 'Skills',
            'nav_experience'      => 'Experience',
            'nav_projects'        => 'Projects',
            'nav_education'       => 'Education',
            'nav_api'             => 'REST API',
            'btn_admin'           => 'Admin & API',
            'theme_light'         => 'Light',
            'theme_dark'          => 'Dark',
            'theme_toggle_title'  => 'Toggle Light / Dark theme (persisted in PHP Session)',
            'lang_toggle_title'   => 'Přepnout jazyk do češtiny (persisted in PHP Session)',
            'btn_print_pdf'       => 'Print / Export A4 PDF',
            'btn_contact'         => 'Send Email',
            'filter_label'        => 'Filter Resume by Role:',
            'filter_all'          => 'All Disciplines (Full Profile)',
            'filter_active_hint'  => 'Showing tailored view – click any role to dynamically filter skills, experience, and projects.',
            'section_pillars'     => 'Core Pillars & Roles',
            'section_pillars_sub' => 'Click any role card to filter the entire resume for that specific discipline.',
            'section_skills'      => 'Technical & UX Skills',
            'section_skills_sub'  => 'Tools, technologies, and hands-on proficiency across disciplines.',
            'section_experience'  => 'Work Experience',
            'section_exp_sub'     => 'Career track record and measurable impact in UX design and software engineering.',
            'section_projects'    => 'Selected Projects & Case Studies',
            'section_proj_sub'    => 'Bridging clean UX/UI design with production code in JS, PHP, and C# .NET Core.',
            'section_education'   => 'Education & Certifications',
            'section_api_title'   => 'Live Showcase: REST API & JWT Authentication',
            'section_api_sub'     => 'This resume features a built-in RESTful API and a full CRUD administration panel. Test live endpoints below or log into the Admin panel.',
            'api_try_label'       => 'Test Live API Endpoint:',
            'api_open_admin'      => 'Open Admin Panel (JWT Login & CRUD)',
            'outcome_label'       => 'Impact / Outcome:',
            'tech_label'          => 'Tech Stack:',
            'code_link'           => 'Source Code',
            'case_study_link'     => 'Case Study',
            'db_status_label'     => 'Database Engine:',
            'session_status'      => 'PHP Session Active',
            'print_footer_note'   => 'Generated from interactive online CV',
            'years_label'         => 'Experience:',
            'Filter_count_prefix' => 'Items shown:',
        ],
    ];

    public function __construct(string $lang = 'cs')
    {
        $this->lang = in_array($lang, ['cs', 'en'], true) ? $lang : 'cs';
    }

    public function getLang(): string
    {
        return $this->lang;
    }

    public function t(string $key): string
    {
        return self::DICTIONARY[$this->lang][$key]
            ?? self::DICTIONARY['cs'][$key]
            ?? $key;
    }

    // Return column value in current language (e.g. title_cs or title_en)
    public function field(array $row, string $baseKey): string
    {
        $localizedKey = $baseKey . '_' . $this->lang;
        if (isset($row[$localizedKey]) && $row[$localizedKey] !== '') {
            return (string)$row[$localizedKey];
        }
        $fallbackKey = $baseKey . '_cs';
        return (string)($row[$fallbackKey] ?? $row[$baseKey] ?? '');
    }
}
