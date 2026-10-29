-- ============================================================================
-- CoolCV - SQL Import pro phpMyAdmin (Freehosting & Docker MySQL)
-- Kodovani: utf8mb4_unicode_ci
-- Obsahuje: Profil, 4 Hlavni role (UX, JS, PHP, C# .NET Core), Dovednosti,
--           Pracovni zkusenosti, Projekty a Vzdelani (v CZ i EN).
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- 1. Tabulka profilu (zakladni informace v hlavicce CV)
DROP TABLE IF EXISTS `cv_profile`;
CREATE TABLE `cv_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(120) NOT NULL,
  `subtitle_cs` varchar(255) NOT NULL,
  `subtitle_en` varchar(255) NOT NULL,
  `bio_cs` text NOT NULL,
  `bio_en` text NOT NULL,
  `location_cs` varchar(120) NOT NULL,
  `location_en` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(60) NOT NULL,
  `website` varchar(180) NOT NULL,
  `github` varchar(180) NOT NULL,
  `linkedin` varchar(180) NOT NULL,
  `availability_cs` varchar(150) NOT NULL,
  `availability_en` varchar(150) NOT NULL,
  `avatar_url` longtext DEFAULT NULL,
  `years_exp_badge` varchar(20) NOT NULL DEFAULT '5+',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cv_profile` (
  `id`, `full_name`, `subtitle_cs`, `subtitle_en`, `bio_cs`, `bio_en`,
  `location_cs`, `location_en`, `email`, `phone`, `website`, `github`, `linkedin`,
  `availability_cs`, `availability_en`, `avatar_url`, `years_exp_badge`
) VALUES (
  1,
  'Jan Novák',
  'UX Designer • JavaScript & PHP Developer • Junior C# .NET Core',
  'UX Designer • JavaScript & PHP Developer • Junior C# .NET Core',
  'Propojuji uživatelsky přívětivý UX/UI design s čistým a spolehlivým kódem. Navrhuji rozhraní, která dávají smysl lidem i byznysu, a následně je sám implementuji v moderním JavaScriptu, PHP (MySQL) a rozvíjím své schopnosti v ekosystému C# .NET Core.',
  'I bridge user-centric UX/UI design with clean, reliable engineering. I design interfaces that make sense for both users and business, implementing them in modern JavaScript and PHP (MySQL) while expanding my backend expertise in C# .NET Core.',
  'Praha / Česká republika (Remote / Hybrid)',
  'Prague / Czech Republic (Remote / Hybrid)',
  'jan.novak@example.cz',
  '+420 777 123 456',
  'https://coolcv.example.cz',
  'https://github.com/username',
  'https://linkedin.com/in/username',
  'Otevřený novým projektům a spolupráci',
  'Open to new projects & opportunities',
  '',
  '5+'
);

-- 2. Tabulka hlavnich roli / piliru (pro filtrovani UX / JS / PHP / .NET)
DROP TABLE IF EXISTS `cv_roles`;
CREATE TABLE `cv_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(32) NOT NULL,
  `badge_code` varchar(20) NOT NULL,
  `icon` varchar(50) NOT NULL DEFAULT 'code',
  `level_cs` varchar(60) NOT NULL,
  `level_en` varchar(60) NOT NULL,
  `title_cs` varchar(120) NOT NULL,
  `title_en` varchar(120) NOT NULL,
  `summary_cs` text NOT NULL,
  `summary_en` text NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cv_roles` (`id`, `slug`, `badge_code`, `icon`, `level_cs`, `level_en`, `title_cs`, `title_en`, `summary_cs`, `summary_en`, `sort_order`) VALUES
(1, 'ux', 'UX / UI', 'rocket_launch', 'Mid–Senior', 'Mid–Senior', 'UX Designer', 'UX Designer',
 'Uživatelský výzkum, informační architektura, wireframy, interaktivní prototypy ve Figmě, design systémy a přístupnost (WCAG).',
 'User research, information architecture, wireframing, interactive Figma prototypes, design systems, and WCAG accessibility.', 1),
(2, 'js', 'JS / React', 'code', 'Mid–Senior', 'Mid–Senior', 'JavaScript Programátor', 'JavaScript Developer',
 'Moderní JavaScript (ES6+), React, stavová architektura, asynchronní komunikace přes REST API, výkon frontendu a čisté UI komponenty.',
 'Modern JavaScript (ES6+), React, state architecture, async REST API integration, frontend performance, and clean UI components.', 2),
(3, 'php', 'PHP & SQL', 'dns', 'Mid–Senior', 'Mid–Senior', 'PHP Programátor', 'PHP Developer',
 'Vývoj headless REST API v PHP 8+, návrh a optimalizace MySQL databází (PDO, phpMyAdmin), JWT autentifikace a AES-256 šifrování.',
 'Headless REST API development in PHP 8+, MySQL database design & optimization (PDO, phpMyAdmin), JWT authentication, and AES-256 encryption.', 3),
(4, 'dotnet', 'C# .NET', 'terminal', 'Junior', 'Junior', 'Junior C# .NET Core', 'Junior C# .NET Core',
 'Objektově orientovaný vývoj v C#, základy ASP.NET Core Web API / MVC, práce s daty přes Entity Framework Core, LINQ a čistá architektura.',
 'Object-oriented programming in C#, ASP.NET Core Web API / MVC fundamentals, data access with Entity Framework Core, LINQ, and clean architecture.', 4);

-- 3. Tabulka dovednosti (Skills)
DROP TABLE IF EXISTS `cv_skills`;
CREATE TABLE `cv_skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_slug` varchar(32) NOT NULL,
  `name_cs` varchar(100) NOT NULL,
  `name_en` varchar(100) NOT NULL,
  `proficiency` int(11) NOT NULL DEFAULT 80,
  `years_exp` varchar(30) NOT NULL,
  `tags` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_role_slug` (`role_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cv_skills` (`id`, `role_slug`, `name_cs`, `name_en`, `proficiency`, `years_exp`, `tags`, `sort_order`) VALUES
-- UX Designer
(1, 'ux', 'Figma & Design Systémy', 'Figma & Design Systems', 95, '4+ roky', 'Auto-layout, Components, Tokens, Prototyping', 1),
(2, 'ux', 'Informační architektura & Wireframing', 'Information Architecture & Wireframing', 92, '4+ roky', 'User Flows, Sitemaps, Low/High-Fi', 2),
(3, 'ux', 'Uživatelské testování & UX Audit', 'Usability Testing & UX Audits', 88, '3+ roky', 'Heuristická analýza, A/B testy, Přístupnost WCAG', 3),
(4, 'ux', 'Responzivní UI & Typografie (CSS Grid/Flex)', 'Responsive UI & Typography (CSS Grid/Flex)', 94, '5+ let', 'Mobile-First, Minimalismus, Print CSS', 4),
-- JavaScript
(5, 'js', 'Moderní JavaScript (ES6+ / Vanilla JS)', 'Modern JavaScript (ES6+ / Vanilla JS)', 92, '4+ roky', 'Modules, Closures, Async/Await, DOM API', 5),
(6, 'js', 'Interaktivní UI & State Management', 'Interactive UI & State Management', 88, '4 roky', 'Custom Events, Filtrování, Dynamické šablony', 6),
(7, 'js', 'REST API integrace & JSON / AJAX', 'REST API Integration & JSON / AJAX', 90, '4 roky', 'Fetch API, Formulářová validace, Optimalizace', 7),
(8, 'js', 'Node.js, NPM skripty & Frontend Tooling', 'Node.js, NPM Scripts & Frontend Tooling', 82, '3 roky', 'NPM, Vite/Webpack, ESLint, Git workflow', 8),
-- PHP
(9, 'php', 'PHP 8.x (OOP, Strict Types, MVC)', 'PHP 8.x (OOP, Strict Types, MVC)', 90, '4+ roky', 'Čistá architektura, Namespaces, Sessions', 9),
(10, 'php', 'MySQL / MariaDB & phpMyAdmin (PDO)', 'MySQL / MariaDB & phpMyAdmin (PDO)', 88, '4+ roky', 'Návrh schématu, Indexy, Prepared Statements', 10),
(11, 'php', 'Bezpečnost webových aplikací & Nasazení', 'Web Application Security & Deployment', 86, '4 roky', 'XSS/CSRF/SQLi ochrana, Freehosting / Docker', 11),
(12, 'php', 'Tvorba backend API a šablonovacích systémů', 'Backend APIs & Templating Systems', 87, '3+ roky', 'JSON Endpointy, Vícejazyčnost (i18n), Exporty', 12),
-- Junior C# .NET Core
(13, 'dotnet', 'Jazyk C# & Objektově orientované programování', 'C# Language & Object-Oriented Programming', 72, '1+ rok', 'Třídy, Rozhraní, Generika, Kolekce, Async', 13),
(14, 'dotnet', 'ASP.NET Core (Web API & MVC základy)', 'ASP.NET Core (Web API & MVC Basics)', 68, '1+ rok', 'Controllery, Routing, Dependency Injection, REST', 14),
(15, 'dotnet', 'Entity Framework Core & LINQ dotazy', 'Entity Framework Core & LINQ Queries', 65, '1 rok', 'Code-First migrace, DbContext, Relační dotazy', 15),
(16, 'dotnet', '.NET CLI, Visual Studio & Git spolupráce', '.NET CLI, Visual Studio & Git Workflow', 75, '1+ rok', 'NuGet, Debugging, Unit testy (xUnit základy)', 16);

-- 4. Tabulka pracovnich zkusenosti (Experience)
DROP TABLE IF EXISTS `cv_experience`;
CREATE TABLE `cv_experience` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `period_cs` varchar(80) NOT NULL,
  `period_en` varchar(80) NOT NULL,
  `role_cs` varchar(150) NOT NULL,
  `role_en` varchar(150) NOT NULL,
  `company` varchar(150) NOT NULL,
  `description_cs` text NOT NULL,
  `description_en` text NOT NULL,
  `achievements_cs` text NOT NULL,
  `achievements_en` text NOT NULL,
  `role_tags` varchar(120) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cv_experience` (`id`, `period_cs`, `period_en`, `role_cs`, `role_en`, `company`, `description_cs`, `description_en`, `achievements_cs`, `achievements_en`, `role_tags`, `sort_order`) VALUES
(1, '2024 – Současnost', '2024 – Present',
 'UX Designer & Full-Stack Developer (JS / PHP / .NET)', 'UX Designer & Full-Stack Developer (JS / PHP / .NET)',
 'Freelance & Digitální projekty',
 'Kompletní návrh a realizace webových aplikací od UX výzkumu a prototypu ve Figmě až po implementaci frontendu v JavaScriptu a backendu v PHP/MySQL a C# .NET Core.',
 'End-to-end design and development of web applications from UX research and Figma prototyping to JavaScript frontend and PHP/MySQL or C# .NET Core backend implementation.',
 'Zvýšení konverzního poměru klientských webů o 35 % díky UX redesignu|Vývoj modulárních PHP 8 + MySQL systémů s okamžitou odezvou|Implementace interních mikroslužeb a REST API v ASP.NET Core (C#)',
 'Increased client conversion rates by 35% through UX redesign|Built modular PHP 8 + MySQL systems with sub-100ms response times|Implemented internal microservices and REST APIs in ASP.NET Core (C#)',
 'ux,js,php,dotnet', 1),
(2, '2022 – 2024', '2022 – 2024',
 'Frontend (JavaScript) & PHP Developer', 'Frontend (JavaScript) & PHP Developer',
 'WebStudio Creative s.r.o.',
 'Vývoj zakázkových webových portálů, klientských zón a redakčních systémů postavených na PHP a MySQL s důrazem na čistý JavaScript bez závislostí na těžkých knihovnách.',
 'Developed custom web portals, client dashboards, and CMS solutions built on PHP and MySQL with a focus on clean, dependency-free JavaScript.',
 'Návrh a nasazení vlastního UI design systému sdíleného napříč 12 projekty|Optimalizace SQL dotazů v phpMyAdmin a zrychlení načítání stránek o 50 %|Zavedení automatizovaného lokálního vývoje pomocí Dockeru a NPM skriptů',
 'Designed and deployed a shared UI design system across 12 client projects|Optimized SQL queries via phpMyAdmin, cutting page load times by 50%|Introduced automated local development using Docker and NPM scripts',
 'ux,js,php', 2),
(3, '2020 – 2022', '2020 – 2022',
 'UX/UI Designer & Junior Web Developer', 'UX/UI Designer & Junior Web Developer',
 'DesignLab Agency',
 'Tvorba drátěných modelů (wireframes), uživatelských cest (user flows) a kódování responzivních šablon v HTML5, CSS3, JavaScriptu a PHP.',
 'Created wireframes, user flows, and coded accessible responsive templates in HTML5, CSS3, JavaScript, and PHP.',
 'Příprava více než 25 kompletních UX prototypů a testování s reálnými uživateli|Spolupráce s backend týmem na integraci šablon a formulářů',
 'Delivered 25+ complete UX prototypes tested with real users|Collaborated with backend teams on template and form integrations',
 'ux,js', 3);

-- 5. Tabulka vybranych projektu (Portfolio)
DROP TABLE IF EXISTS `cv_projects`;
CREATE TABLE `cv_projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title_cs` varchar(150) NOT NULL,
  `title_en` varchar(150) NOT NULL,
  `subtitle_cs` varchar(180) NOT NULL,
  `subtitle_en` varchar(180) NOT NULL,
  `description_cs` text NOT NULL,
  `description_en` text NOT NULL,
  `outcome_cs` varchar(255) NOT NULL,
  `outcome_en` varchar(255) NOT NULL,
  `tech_stack` varchar(255) NOT NULL,
  `role_tags` varchar(120) NOT NULL,
  `demo_url` varchar(200) NOT NULL,
  `repo_url` varchar(200) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cv_projects` (`id`, `title_cs`, `title_en`, `subtitle_cs`, `subtitle_en`, `description_cs`, `description_en`, `outcome_cs`, `outcome_en`, `tech_stack`, `role_tags`, `demo_url`, `repo_url`, `sort_order`) VALUES
(1,
 'FinTrack UX & Design System',
 'FinTrack UX & Design System',
 'Kompletní UX případová studie a komponentová knihovna',
 'End-to-end UX case study and accessible component library',
 'Kompletní redesign finanční aplikace zaměřený na čitelnost dat, vysoký kontrast (světlý/tmavý režim) a zjednodušení onboardingu z 8 kroků na 3.',
 'Complete redesign of a personal finance web app focused on data legibility, high-contrast Light/Dark themes, and reducing onboarding from 8 steps to 3.',
 'Snížení míry opuštění formuláře o 42 % při uživatelském testování.',
 'Reduced form drop-off rate by 42% in moderated usability testing.',
 'Figma, UX Research, WCAG 2.1, CSS Variables, Vanilla JS',
 'ux,js',
 '#project-fintrack', 'https://github.com/username/fintrack-ui', 1),
(2,
 'TaskFlow CRM & Fakturace',
 'TaskFlow CRM & Invoicing',
 'Rychlá webová aplikace v PHP 8, MySQL a čistém JavaScriptu',
 'Fast web application built with PHP 8, MySQL, and Vanilla JS',
 'Lehký firemní systém navržený pro okamžitý běh na běžném hostingu (PHP + MySQL / phpMyAdmin) s živým filtrováním v JavaScriptu a generováním tiskových A4 sestav.',
 'Lightweight business system engineered to run smoothly on standard PHP + MySQL hosting with instant JavaScript filtering and printable A4 invoice generation.',
 'Okamžitá odezva (< 60 ms) a 100% kompatibilita s freehostingy i Dockerem.',
 'Sub-60ms response time and 100% compatibility with shared hosting and Docker.',
 'PHP 8.2, PDO MySQL, phpMyAdmin, ES6 JavaScript, Print CSS',
 'php,js,ux',
 '#project-taskflow', 'https://github.com/username/taskflow-php', 2),
(3,
 'InventoryHub .NET Core API & Dashboard',
 'InventoryHub .NET Core API & Dashboard',
 'Skladové REST API v C# ASP.NET Core s JS frontendem',
 'Inventory REST API in C# ASP.NET Core with a JS Frontend',
 'Ukázkový full-stack projekt propojující backend v C# .NET 8 (ASP.NET Core Web API, Entity Framework Core, LINQ) s přehledným minimalistickým rozhraním v JavaScriptu.',
 'Full-stack showcase connecting a C# .NET 8 backend (ASP.NET Core Web API, Entity Framework Core, LINQ) with a clean minimalist JavaScript frontend.',
 'Čistá vícevrstvá architektura, REST endpointy a plně responzivní UX.',
 'Clean layered architecture, documented REST endpoints, and responsive UX.',
 'C#, ASP.NET Core 8, EF Core, LINQ, JavaScript ES6+',
 'dotnet,js,ux',
 '#project-inventoryhub', 'https://github.com/username/inventoryhub-dotnet', 3),
(4,
 'CoolCV – Interaktivní PHP & MySQL Životopis',
 'CoolCV – Interactive PHP & MySQL Resume',
 'Minimalistické vícejazyčné CV s podporou tisku do A4 PDF',
 'Minimalist bilingual CV with session theming and A4 PDF print',
 'Tento otevřený projekt životopisu: přepínání světlého a tmavého tématu i jazyka (CZ/EN) v PHP session, interaktivní JS filtry a hybridní databázová vrstva (MySQL / SQLite / JSON).',
 'This open-source resume project: Light/Dark theme and CZ/EN language persisted in PHP session, interactive JS role filters, and hybrid DB layer (MySQL / SQLite / JSON).',
 'Připraveno pro FTP nasazení na freehosting i lokální vývoj přes NPM a Docker.',
 'Ready for FTP freehosting deployment as well as local NPM and Docker dev.',
 'PHP 8, MySQL, JavaScript, UX/UI, Docker, NPM',
 'ux,js,php,dotnet',
 '#top', 'https://github.com/username/coolcv', 4);

-- 6. Tabulka vzdelani a certifikaci (Education)
DROP TABLE IF EXISTS `cv_education`;
CREATE TABLE `cv_education` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `period` varchar(60) NOT NULL,
  `title_cs` varchar(160) NOT NULL,
  `title_en` varchar(160) NOT NULL,
  `institution_cs` varchar(160) NOT NULL,
  `institution_en` varchar(160) NOT NULL,
  `details_cs` text NOT NULL,
  `details_en` text NOT NULL,
  `role_tags` varchar(120) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cv_education` (`id`, `period`, `title_cs`, `title_en`, `institution_cs`, `institution_en`, `details_cs`, `details_en`, `role_tags`, `sort_order`) VALUES
(1, '2024 – 2025',
 'C# a ASP.NET Core – Vývoj moderních webových aplikací',
 'C# and ASP.NET Core – Modern Web Application Development',
 'Odborná certifikace & intenzivní praxe',
 'Professional Certification & Intensive Practice',
 'Objektové programování v C#, návrh REST API v ASP.NET Core, práce s databází přes Entity Framework Core a LINQ.',
 'Object-oriented programming in C#, REST API design in ASP.NET Core, database access via Entity Framework Core and LINQ.',
 'dotnet', 1),
(2, '2021 – 2023',
 'UX/UI Design, Přístupnost & Produktový výzkum',
 'UX/UI Design, Accessibility & Product Research',
 'Google UX Design / Design systém akademie',
 'Google UX Design / Design Systems Academy',
 'Návrh zaměřený na člověka (Human-Centered Design), informační architektura, typografie, kontrast a použitelnost.',
 'Human-Centered Design, information architecture, typography, high-contrast systems, and usability testing.',
 'ux', 2),
(3, '2017 – 2021',
 'Informační technologie a webové inženýrství',
 'Information Technology & Web Engineering',
 'Technická fakulta / Vyšší odborné a VŠ studium IT',
 'Faculty of Information Technology',
 'Algoritmizace, relační databáze (SQL), vývoj webových aplikací v PHP a JavaScriptu, softwarové inženýrství.',
 'Algorithms, relational databases (SQL), web application development in PHP and JavaScript, software engineering.',
 'js,php', 3);

-- 7. Tabulka uzivatelu administrace a API autentifikace (Users)
-- Poznamka: Tabulka je pri prvnim nasazeni prazdna. Prvni administratorky ucet
--           si vytvorite pri prvnim otevreni React Backoffice na serveru.
DROP TABLE IF EXISTS `cv_users`;
CREATE TABLE `cv_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(60) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `display_name` varchar(120) NOT NULL,
  `role` varchar(32) NOT NULL DEFAULT 'admin',
  `last_login_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET foreign_key_checks = 1;
