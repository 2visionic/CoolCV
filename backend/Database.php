<?php
declare(strict_types=1);

namespace CoolCV;

use PDO;
use PDOException;
use InvalidArgumentException;

// Hybrid database layer with full CRUD support (MySQL on server, JSON/SQLite in local dev)
class Database
{
    private ?PDO $pdo = null;
    private string $driver = 'in-repo-seed';
    private array $config;
    private array $seedData;
    private string $jsonPath;

    private const ENTITY_MAP = [
        'roles' => [
            'table'   => 'cv_roles',
            'columns' => ['slug', 'badge_code', 'icon', 'level_cs', 'level_en', 'title_cs', 'title_en', 'summary_cs', 'summary_en', 'sort_order'],
        ],
        'skills' => [
            'table'   => 'cv_skills',
            'columns' => ['role_slug', 'name_cs', 'name_en', 'proficiency', 'years_exp', 'tags', 'sort_order'],
        ],
        'experience' => [
            'table'   => 'cv_experience',
            'columns' => ['period_cs', 'period_en', 'role_cs', 'role_en', 'company', 'description_cs', 'description_en', 'achievements_cs', 'achievements_en', 'role_tags', 'sort_order'],
        ],
        'projects' => [
            'table'   => 'cv_projects',
            'columns' => ['title_cs', 'title_en', 'subtitle_cs', 'subtitle_en', 'description_cs', 'description_en', 'outcome_cs', 'outcome_en', 'tech_stack', 'role_tags', 'demo_url', 'repo_url', 'sort_order'],
        ],
        'education' => [
            'table'   => 'cv_education',
            'columns' => ['period', 'title_cs', 'title_en', 'institution_cs', 'institution_en', 'details_cs', 'details_en', 'role_tags', 'sort_order'],
        ],
        'socials' => [
            'table'   => 'cv_socials',
            'columns' => ['title', 'url', 'icon', 'sort_order'],
        ],
    ];

    private const PROFILE_COLUMNS = [
        'full_name', 'subtitle_cs', 'subtitle_en', 'bio_cs', 'bio_en',
        'location_cs', 'location_en', 'email', 'phone', 'website',
        'github', 'linkedin', 'availability_cs', 'availability_en',
        'avatar_url', 'years_exp_badge',
    ];

    public function __construct(array $config)
    {
        $this->config = $config;
        $this->seedData = require __DIR__ . '/../database/seed_data.php';
        $this->jsonPath = (string)($config['db']['json_path'] ?? (__DIR__ . '/../database/local_db.json'));
        $this->connect();
    }

    private function connect(): void
    {
        $mysqlCfg = $this->config['db']['mysql'] ?? [];

        // If modified database/local_db.json exists in repo, load it as default seed
        if (file_exists($this->jsonPath)) {
            $decoded = json_decode((string)file_get_contents($this->jsonPath), true);
            if (is_array($decoded) && isset($decoded['profile'])) {
                $this->seedData = array_merge($this->seedData, $decoded);
            }
        }

        // 1. Connect to MySQL (used on production server / freehosting)
        if (!empty($mysqlCfg['enabled']) && extension_loaded('pdo_mysql')) {
            try {
                $dsn = sprintf(
                    'mysql:host=%s;port=%d;dbname=%s;charset=%s',
                    $mysqlCfg['host'] ?? '127.0.0.1',
                    $mysqlCfg['port'] ?? 3306,
                    $mysqlCfg['database'] ?? 'coolcv',
                    $mysqlCfg['charset'] ?? 'utf8mb4'
                );
                $this->pdo = new PDO(
                    $dsn,
                    (string)($mysqlCfg['username'] ?? 'root'),
                    (string)($mysqlCfg['password'] ?? ''),
                    [
                        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_TIMEOUT            => 4,
                    ]
                );
                $this->driver = 'mysql';

                // If MySQL database on server is freshly created and tables dont exist yet,
                // automatically create schema and seed it from repo data
                try {
                    $this->pdo->query('SELECT 1 FROM cv_profile LIMIT 1');
                    $this->ensureMysqlSchemaUpgrades();
                } catch (PDOException $tableMissingEx) {
                    $this->initializeMysqlSchema();
                }
                return;
            } catch (PDOException $e) {
                $this->pdo = null;
            }
        }

        // 2. In local dev mode use In-Repo JSON / SQLite
        if (($this->config['app']['env'] ?? 'development') === 'development' && file_exists($this->jsonPath)) {
            $this->driver = 'json-in-repo';
            return;
        }

        // 3. Fallback local SQLite database in repo
        $sqlitePath = (string)($this->config['db']['sqlite_path'] ?? (__DIR__ . '/../database/local_dev.sqlite'));
        if (extension_loaded('pdo_sqlite')) {
            try {
                $isNew = !file_exists($sqlitePath);
                $this->pdo = new PDO('sqlite:' . $sqlitePath, null, null, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
                if ($isNew || !$this->hasSqliteTables()) {
                    $this->initializeSqliteSchema();
                }
                $this->driver = 'sqlite-in-repo';
                return;
            } catch (PDOException $e) {
                $this->pdo = null;
            }
        }

        if (file_exists($this->jsonPath)) {
            $this->driver = 'json-in-repo';
            return;
        }

        $this->driver = 'php-in-repo';
    }

    // Automatically create MySQL tables on server and seed them from repository
    public function initializeMysqlSchema(): void
    {
        if (!$this->pdo) {
            return;
        }

        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS `cv_profile` (
              `id` int(11) NOT NULL PRIMARY KEY,
              `full_name` varchar(120) NOT NULL,
              `subtitle_cs` varchar(255) NOT NULL,
              `subtitle_en` varchar(255) NOT NULL,
              `bio_cs` text NOT NULL,
              `bio_en` text NOT NULL,
              `location_cs` varchar(120) NOT NULL,
              `location_en` varchar(120) NOT NULL,
              `email` varchar(120) NOT NULL,
              `phone` varchar(60) NOT NULL,
              `website` varchar(160) DEFAULT '',
              `github` varchar(160) DEFAULT '',
              `linkedin` varchar(160) DEFAULT '',
              `availability_cs` varchar(160) NOT NULL,
              `availability_en` varchar(160) NOT NULL,
              `avatar_url` longtext DEFAULT NULL,
              `years_exp_badge` varchar(20) DEFAULT '5+'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `cv_roles` (
              `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
              `slug` varchar(32) NOT NULL UNIQUE,
              `badge_code` varchar(32) NOT NULL,
              `icon` text NOT NULL,
              `level_cs` varchar(64) NOT NULL,
              `level_en` varchar(64) NOT NULL,
              `title_cs` varchar(120) NOT NULL,
              `title_en` varchar(120) NOT NULL,
              `summary_cs` text NOT NULL,
              `summary_en` text NOT NULL,
              `sort_order` int(11) NOT NULL DEFAULT 1
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `cv_skills` (
              `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
              `role_slug` varchar(32) NOT NULL,
              `name_cs` varchar(120) NOT NULL,
              `name_en` varchar(120) NOT NULL,
              `proficiency` int(11) NOT NULL DEFAULT 80,
              `years_exp` varchar(40) NOT NULL,
              `tags` varchar(255) NOT NULL,
              `sort_order` int(11) NOT NULL DEFAULT 1
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `cv_experience` (
              `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
              `period_cs` varchar(80) NOT NULL,
              `period_en` varchar(80) NOT NULL,
              `role_cs` varchar(160) NOT NULL,
              `role_en` varchar(160) NOT NULL,
              `company` varchar(160) NOT NULL,
              `description_cs` text NOT NULL,
              `description_en` text NOT NULL,
              `achievements_cs` text NOT NULL,
              `achievements_en` text NOT NULL,
              `role_tags` varchar(120) NOT NULL,
              `sort_order` int(11) NOT NULL DEFAULT 1
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `cv_projects` (
              `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
              `title_cs` varchar(160) NOT NULL,
              `title_en` varchar(160) NOT NULL,
              `subtitle_cs` varchar(200) NOT NULL,
              `subtitle_en` varchar(200) NOT NULL,
              `description_cs` text NOT NULL,
              `description_en` text NOT NULL,
              `outcome_cs` text NOT NULL,
              `outcome_en` text NOT NULL,
              `tech_stack` varchar(255) NOT NULL,
              `role_tags` varchar(120) NOT NULL,
              `demo_url` varchar(255) DEFAULT '#',
              `repo_url` varchar(255) DEFAULT '#',
              `sort_order` int(11) NOT NULL DEFAULT 1
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `cv_education` (
              `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
              `period` varchar(64) NOT NULL,
              `title_cs` varchar(160) NOT NULL,
              `title_en` varchar(160) NOT NULL,
              `institution_cs` varchar(160) NOT NULL,
              `institution_en` varchar(160) NOT NULL,
              `details_cs` text NOT NULL,
              `details_en` text NOT NULL,
              `role_tags` varchar(120) NOT NULL,
              `sort_order` int(11) NOT NULL DEFAULT 1
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `cv_socials` (
              `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
              `title` varchar(120) NOT NULL,
              `url` varchar(255) NOT NULL,
              `icon` text NOT NULL,
              `sort_order` int(11) NOT NULL DEFAULT 1
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `cv_users` (
              `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
              `username` varchar(60) NOT NULL UNIQUE,
              `password_hash` varchar(255) NOT NULL,
              `display_name` varchar(120) NOT NULL,
              `role` varchar(32) NOT NULL DEFAULT 'admin',
              `last_login_at` datetime DEFAULT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        $seed = $this->seedData;
        if (!empty($seed['profile'])) {
            $this->insertRow('cv_profile', $seed['profile']);
        }
        foreach ($seed['roles'] ?? [] as $row) {
            $this->insertRow('cv_roles', $row);
        }
        foreach ($seed['skills'] ?? [] as $row) {
            $this->insertRow('cv_skills', $row);
        }
        foreach ($seed['experience'] ?? [] as $row) {
            $this->insertRow('cv_experience', $row);
        }
        foreach ($seed['projects'] ?? [] as $row) {
            $this->insertRow('cv_projects', $row);
        }
        foreach ($seed['education'] ?? [] as $row) {
            $this->insertRow('cv_education', $row);
        }
        foreach ($seed['socials'] ?? [] as $row) {
            $this->insertRow('cv_socials', $row);
        }
        // Note: No default user is created here - admin creates own account on first run
    }

    private function ensureMysqlSchemaUpgrades(): void
    {
        if (!$this->pdo) {
            return;
        }
        try {
            $this->pdo->query('SELECT avatar_url, years_exp_badge FROM cv_profile LIMIT 1');
        } catch (PDOException $e) {
            try {
                $this->pdo->exec("ALTER TABLE cv_profile ADD COLUMN avatar_url LONGTEXT DEFAULT NULL, ADD COLUMN years_exp_badge VARCHAR(20) DEFAULT '5+'");
            } catch (PDOException $ignored) {
            }
        }

        try {
            $this->pdo->query('SELECT custom_texts_json FROM cv_profile LIMIT 1');
        } catch (PDOException $e) {
            try {
                $this->pdo->exec('ALTER TABLE cv_profile ADD COLUMN custom_texts_json LONGTEXT DEFAULT NULL');
            } catch (PDOException $ignored) {
            }
        }

        try {
            $this->pdo->query('SELECT 1 FROM cv_users LIMIT 1');
        } catch (PDOException $e) {
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS `cv_users` (
                  `id` int(11) NOT NULL AUTO_INCREMENT,
                  `username` varchar(60) NOT NULL,
                  `password_hash` varchar(255) NOT NULL,
                  `display_name` varchar(120) NOT NULL,
                  `role` varchar(32) NOT NULL DEFAULT 'admin',
                  `last_login_at` datetime DEFAULT NULL,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `username` (`username`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");
        }

        try {
            $this->pdo->query('SELECT 1 FROM cv_socials LIMIT 1');
        } catch (PDOException $e) {
            try {
                $this->pdo->exec("
                    CREATE TABLE IF NOT EXISTS `cv_socials` (
                      `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      `title` varchar(120) NOT NULL,
                      `url` varchar(255) NOT NULL,
                      `icon` text NOT NULL,
                      `sort_order` int(11) NOT NULL DEFAULT 1
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                ");
                foreach ($this->seedData['socials'] ?? [] as $row) {
                    $this->insertRow('cv_socials', $row);
                }
            } catch (PDOException $ignored) {
            }
        }
        try {
            $this->pdo->exec('ALTER TABLE cv_roles MODIFY COLUMN icon TEXT NOT NULL');
        } catch (PDOException $ignored) {
        }

        foreach (self::ENTITY_MAP as $meta) {
            $tbl = $meta['table'];
            try {
                $this->pdo->exec(sprintf('ALTER TABLE `%s` MODIFY COLUMN `id` int(11) NOT NULL AUTO_INCREMENT', $tbl));
            } catch (PDOException $ignored) {
            }
        }
    }

    private function hasSqliteTables(): bool
    {
        if (!$this->pdo) {
            return false;
        }
        try {
            $this->pdo->query('SELECT avatar_url FROM cv_profile LIMIT 1');
            $stmt = $this->pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='cv_users'");
            return (bool)$stmt->fetchColumn();
        } catch (PDOException $e) {
            return false;
        }
    }

    public function initializeSqliteSchema(): void
    {
        if (!$this->pdo) {
            return;
        }

        $this->pdo->exec('
            DROP TABLE IF EXISTS cv_profile;
            DROP TABLE IF EXISTS cv_roles;
            DROP TABLE IF EXISTS cv_skills;
            DROP TABLE IF EXISTS cv_experience;
            DROP TABLE IF EXISTS cv_projects;
            DROP TABLE IF EXISTS cv_education;
            DROP TABLE IF EXISTS cv_socials;
            DROP TABLE IF EXISTS cv_users;

            CREATE TABLE cv_profile (
                id INTEGER PRIMARY KEY,
                full_name TEXT, subtitle_cs TEXT, subtitle_en TEXT,
                bio_cs TEXT, bio_en TEXT, location_cs TEXT, location_en TEXT,
                email TEXT, phone TEXT, website TEXT, github TEXT, linkedin TEXT,
                availability_cs TEXT, availability_en TEXT,
                avatar_url TEXT, years_exp_badge TEXT
            );
            CREATE TABLE cv_roles (
                id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE, badge_code TEXT,
                icon TEXT, level_cs TEXT, level_en TEXT, title_cs TEXT, title_en TEXT,
                summary_cs TEXT, summary_en TEXT, sort_order INTEGER
            );
            CREATE TABLE cv_skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT, role_slug TEXT,
                name_cs TEXT, name_en TEXT, proficiency INTEGER,
                years_exp TEXT, tags TEXT, sort_order INTEGER
            );
            CREATE TABLE cv_experience (
                id INTEGER PRIMARY KEY AUTOINCREMENT, period_cs TEXT, period_en TEXT,
                role_cs TEXT, role_en TEXT, company TEXT,
                description_cs TEXT, description_en TEXT,
                achievements_cs TEXT, achievements_en TEXT,
                role_tags TEXT, sort_order INTEGER
            );
            CREATE TABLE cv_projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT, title_cs TEXT, title_en TEXT,
                subtitle_cs TEXT, subtitle_en TEXT,
                description_cs TEXT, description_en TEXT,
                outcome_cs TEXT, outcome_en TEXT,
                tech_stack TEXT, role_tags TEXT,
                demo_url TEXT, repo_url TEXT, sort_order INTEGER
            );
            CREATE TABLE cv_education (
                id INTEGER PRIMARY KEY AUTOINCREMENT, period TEXT,
                title_cs TEXT, title_en TEXT,
                institution_cs TEXT, institution_en TEXT,
                details_cs TEXT, details_en TEXT,
                role_tags TEXT, sort_order INTEGER
            );
            CREATE TABLE cv_socials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                url TEXT,
                icon TEXT,
                sort_order INTEGER
            );
            CREATE TABLE cv_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password_hash TEXT,
                display_name TEXT,
                role TEXT,
                last_login_at TEXT
            );
        ');

        $defaultSeed = require __DIR__ . '/../database/seed_data.php';
        $this->insertRow('cv_profile', $defaultSeed['profile']);
        foreach ($defaultSeed['roles'] as $row) {
            $this->insertRow('cv_roles', $row);
        }
        foreach ($defaultSeed['skills'] as $row) {
            $this->insertRow('cv_skills', $row);
        }
        foreach ($defaultSeed['experience'] as $row) {
            $this->insertRow('cv_experience', $row);
        }
        foreach ($defaultSeed['projects'] as $row) {
            $this->insertRow('cv_projects', $row);
        }
        foreach ($defaultSeed['education'] as $row) {
            $this->insertRow('cv_education', $row);
        }
        foreach ($defaultSeed['socials'] ?? [] as $row) {
            $this->insertRow('cv_socials', $row);
        }
    }

    private function insertRow(string $table, array $row): void
    {
        if (!$this->pdo) {
            return;
        }
        $columns = array_keys($row);
        $placeholders = array_map(fn(string $col) => ':' . $col, $columns);
        $verb = ($this->driver === 'mysql') ? 'REPLACE INTO' : 'INSERT OR REPLACE INTO';
        $sql = sprintf(
            '%s %s (%s) VALUES (%s)',
            $verb,
            $table,
            implode(', ', $columns),
            implode(', ', $placeholders)
        );
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($row);
    }

    public function getDriverName(): string
    {
        return $this->driver;
    }

    // Check if at least one admin user exists in database
    public function hasAnyUser(): bool
    {
        if ($this->pdo !== null) {
            try {
                $stmt = $this->pdo->query('SELECT COUNT(*) FROM cv_users');
                return ((int)$stmt->fetchColumn()) > 0;
            } catch (PDOException $e) {
                return false;
            }
        }
        return !empty($this->seedData['users']);
    }

    // Create initial admin user on first run
    public function createInitialAdminUser(string $username, string $passwordHash, string $displayName): array
    {
        $userRow = [
            'id'            => 1,
            'username'      => trim($username),
            'password_hash' => $passwordHash,
            'display_name'  => trim($displayName) !== '' ? trim($displayName) : trim($username),
            'role'          => 'admin',
            'last_login_at' => date('Y-m-d H:i:s'),
        ];

        if ($this->pdo !== null) {
            $stmt = $this->pdo->prepare('
                INSERT INTO cv_users (username, password_hash, display_name, role, last_login_at)
                VALUES (:username, :password_hash, :display_name, :role, :last_login_at)
            ');
            $stmt->execute([
                'username'      => $userRow['username'],
                'password_hash' => $userRow['password_hash'],
                'display_name'  => $userRow['display_name'],
                'role'          => $userRow['role'],
                'last_login_at' => $userRow['last_login_at'],
            ]);
            $userRow['id'] = (int)$this->pdo->lastInsertId() ?: 1;
            return $userRow;
        }

        $this->seedData['users'] = [$userRow];
        $this->saveJsonFallback();
        return $userRow;
    }

    public function findUserByUsername(string $username): ?array
    {
        if ($this->pdo !== null) {
            try {
                $stmt = $this->pdo->prepare('SELECT * FROM cv_users WHERE username = :u LIMIT 1');
                $stmt->execute(['u' => $username]);
                $row = $stmt->fetch();
                if (is_array($row)) {
                    return $row;
                }
            } catch (PDOException $e) {
            }
        }

        foreach ($this->seedData['users'] ?? [] as $u) {
            if (($u['username'] ?? '') === $username) {
                return $u;
            }
        }
        return null;
    }

    public function updateUserPasswordHash(int $userId, string $newHash): void
    {
        if ($this->pdo !== null) {
            try {
                $stmt = $this->pdo->prepare('UPDATE cv_users SET password_hash = :p WHERE id = :id');
                $stmt->execute(['p' => $newHash, 'id' => $userId]);
            } catch (PDOException $e) {
            }
        }
    }

    public function touchUserLogin(int $userId): void
    {
        if ($this->pdo !== null) {
            try {
                $stmt = $this->pdo->prepare('UPDATE cv_users SET last_login_at = :ts WHERE id = :id');
                $stmt->execute(['ts' => date('Y-m-d H:i:s'), 'id' => $userId]);
            } catch (PDOException $e) {
            }
        }
    }

    private function ensureValidEntityIds(string $entity, array $rows): array
    {
        if (empty($rows) || !isset(self::ENTITY_MAP[$entity])) {
            return $rows;
        }

        $meta = self::ENTITY_MAP[$entity];
        $table = $meta['table'];
        $cols = $meta['columns'];

        $needsRepair = false;
        $maxId = 0;
        $seen = [];

        foreach ($rows as $r) {
            $rawId = $r['id'] ?? null;
            $intId = (is_numeric($rawId) ? (int)$rawId : 0);
            if ($intId <= 0 || isset($seen[$intId])) {
                $needsRepair = true;
            } else {
                $seen[$intId] = true;
                if ($intId > $maxId) {
                    $maxId = $intId;
                }
            }
        }

        $normalized = [];
        $used = [];
        foreach ($rows as $r) {
            $rawId = $r['id'] ?? null;
            $intId = (is_numeric($rawId) ? (int)$rawId : 0);
            if ($intId <= 0 || isset($used[$intId])) {
                $maxId++;
                $intId = $maxId;
            }
            $used[$intId] = true;
            $r['id'] = $intId;
            $normalized[] = $r;
        }

        if ($needsRepair) {
            if ($this->pdo !== null) {
                try {
                    $this->pdo->exec(sprintf('DELETE FROM %s', $table));
                    $colsWithId = array_merge(['id'], $cols);
                    $placeholders = array_map(fn(string $c) => ':' . $c, $colsWithId);
                    $sql = sprintf(
                        'INSERT INTO %s (%s) VALUES (%s)',
                        $table,
                        implode(', ', $colsWithId),
                        implode(', ', $placeholders)
                    );
                    $stmt = $this->pdo->prepare($sql);
                    foreach ($normalized as $item) {
                        $bindRow = ['id' => (int)$item['id']];
                        foreach ($cols as $col) {
                            if ($col === 'proficiency') {
                                $bindRow[$col] = max(0, min(100, (int)($item[$col] ?? 80)));
                            } elseif ($col === 'sort_order') {
                                $bindRow[$col] = (int)($item[$col] ?? 99);
                            } else {
                                $bindRow[$col] = (string)($item[$col] ?? '');
                            }
                        }
                        $stmt->execute($bindRow);
                    }
                } catch (PDOException $ignored) {
                }
            } else {
                $this->seedData[$entity] = $normalized;
                $this->saveJsonFallback();
            }
        }

        return $normalized;
    }

    public function getAllData(): array
    {
        $hasUser = $this->hasAnyUser();

        if ($this->pdo !== null) {
            try {
                $profile = $this->pdo->query('SELECT * FROM cv_profile ORDER BY id ASC LIMIT 1')->fetch() ?: $this->seedData['profile'];
                if (!empty($profile['custom_texts_json']) && is_string($profile['custom_texts_json'])) {
                    $decodedCustom = json_decode($profile['custom_texts_json'], true);
                    if (is_array($decodedCustom)) {
                        $profile = array_merge($profile, $decodedCustom);
                    }
                }
                $roles = $this->ensureValidEntityIds('roles', $this->pdo->query('SELECT * FROM cv_roles ORDER BY sort_order ASC, id ASC')->fetchAll());
                $skills = $this->ensureValidEntityIds('skills', $this->pdo->query('SELECT * FROM cv_skills ORDER BY sort_order ASC, id ASC')->fetchAll());
                $experience = $this->ensureValidEntityIds('experience', $this->pdo->query('SELECT * FROM cv_experience ORDER BY sort_order ASC, id ASC')->fetchAll());
                $projects = $this->ensureValidEntityIds('projects', $this->pdo->query('SELECT * FROM cv_projects ORDER BY sort_order ASC, id ASC')->fetchAll());
                $education = $this->ensureValidEntityIds('education', $this->pdo->query('SELECT * FROM cv_education ORDER BY sort_order ASC, id ASC')->fetchAll());
                $socials = $this->ensureValidEntityIds('socials', $this->pdo->query('SELECT * FROM cv_socials ORDER BY sort_order ASC, id ASC')->fetchAll());

                return [
                    'driver'        => $this->driver,
                    'needs_setup'   => !$hasUser,
                    'profile'       => array_merge($this->seedData['profile'], $profile),
                    'roles'         => $roles,
                    'skills'        => $skills,
                    'experience'    => $experience,
                    'projects'      => $projects,
                    'education'     => $education,
                    'socials'       => $socials,
                ];
            } catch (PDOException $e) {
            }
        }

        return [
            'driver'        => $this->driver,
            'needs_setup'   => !$hasUser,
            'profile'       => $this->seedData['profile'],
            'roles'         => $this->ensureValidEntityIds('roles', $this->seedData['roles'] ?? []),
            'skills'        => $this->ensureValidEntityIds('skills', $this->seedData['skills'] ?? []),
            'experience'    => $this->ensureValidEntityIds('experience', $this->seedData['experience'] ?? []),
            'projects'      => $this->ensureValidEntityIds('projects', $this->seedData['projects'] ?? []),
            'education'     => $this->ensureValidEntityIds('education', $this->seedData['education'] ?? []),
            'socials'       => $this->ensureValidEntityIds('socials', $this->seedData['socials'] ?? []),
        ];
    }

    public function updateProfile(array $input): array
    {
        $current = $this->getAllData()['profile'];
        $updated = ['id' => (int)($current['id'] ?? 1)];

        foreach (self::PROFILE_COLUMNS as $col) {
            $updated[$col] = array_key_exists($col, $input)
                ? trim((string)$input[$col])
                : (string)($current[$col] ?? '');
        }

        // Save extended profile fields and custom section texts (primary_stack, ui_*)
        $extraFields = [];
        foreach ($current as $k => $v) {
            if ($k !== 'id' && $k !== 'custom_texts_json' && !in_array($k, self::PROFILE_COLUMNS, true) && is_scalar($v)) {
                $extraFields[$k] = (string)$v;
            }
        }
        foreach ($input as $k => $v) {
            if ($k !== 'id' && $k !== 'custom_texts_json' && !in_array($k, self::PROFILE_COLUMNS, true) && is_scalar($v)) {
                $extraFields[$k] = trim((string)$v);
            }
        }

        if ($this->pdo !== null) {
            $dbParams = $updated;
            $colsToUpdate = self::PROFILE_COLUMNS;
            try {
                $this->pdo->query('SELECT custom_texts_json FROM cv_profile LIMIT 1');
                $colsToUpdate[] = 'custom_texts_json';
                $dbParams['custom_texts_json'] = json_encode($extraFields, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            } catch (PDOException $ignored) {
            }

            $setParts = array_map(fn(string $c) => "$c = :$c", $colsToUpdate);
            $sql = 'UPDATE cv_profile SET ' . implode(', ', $setParts) . ' WHERE id = :id';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($dbParams);
            $this->syncJsonFileIfLocal();
            return array_merge($updated, $extraFields);
        }

        $merged = array_merge($updated, $extraFields);
        $this->seedData['profile'] = $merged;
        $this->saveJsonFallback();
        return $merged;
    }

    public function createItem(string $entity, array $input): array
    {
        $meta = $this->getEntityMeta($entity);
        $table = $meta['table'];
        $cols = $meta['columns'];

        $row = [];
        foreach ($cols as $col) {
            if ($col === 'proficiency') {
                $row[$col] = max(0, min(100, (int)($input[$col] ?? 80)));
            } elseif ($col === 'sort_order') {
                $row[$col] = (int)($input[$col] ?? 99);
            } else {
                $row[$col] = trim((string)($input[$col] ?? ''));
            }
        }

        if ($this->pdo !== null) {
            $this->getAllData();
            $maxStmt = $this->pdo->query(sprintf('SELECT COALESCE(MAX(id), 0) FROM %s', $table));
            $nextId = max(1, ((int)$maxStmt->fetchColumn()) + 1);
            $colsWithId = array_merge(['id'], $cols);
            $rowWithId = array_merge(['id' => $nextId], $row);
            $placeholders = array_map(fn(string $c) => ':' . $c, $colsWithId);
            $sql = sprintf(
                'INSERT INTO %s (%s) VALUES (%s)',
                $table,
                implode(', ', $colsWithId),
                implode(', ', $placeholders)
            );
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($rowWithId);
            $lastId = (int)$this->pdo->lastInsertId();
            $finalId = $lastId > 0 ? $lastId : $nextId;
            $row = array_merge(['id' => $finalId], $row);
            $this->syncJsonFileIfLocal();
            return $row;
        }

        $items = $this->seedData[$entity] ?? [];
        $maxId = 0;
        foreach ($items as $it) {
            if ((int)($it['id'] ?? 0) > $maxId) {
                $maxId = (int)$it['id'];
            }
        }
        $row = array_merge(['id' => $maxId + 1], $row);
        $this->seedData[$entity][] = $row;
        $this->saveJsonFallback();
        return $row;
    }

    public function updateItem(string $entity, int $id, array $input): ?array
    {
        $meta = $this->getEntityMeta($entity);
        $table = $meta['table'];
        $cols = $meta['columns'];

        $all = $this->getAllData()[$entity] ?? [];
        $existing = null;
        foreach ($all as $item) {
            if ((int)($item['id'] ?? 0) === $id) {
                $existing = $item;
                break;
            }
        }
        if ($existing === null) {
            return null;
        }

        $updated = ['id' => $id];
        foreach ($cols as $col) {
            $val = array_key_exists($col, $input) ? $input[$col] : ($existing[$col] ?? '');
            if ($col === 'proficiency') {
                $updated[$col] = max(0, min(100, (int)$val));
            } elseif ($col === 'sort_order') {
                $updated[$col] = (int)$val;
            } else {
                $updated[$col] = trim((string)$val);
            }
        }

        if ($this->pdo !== null) {
            $setParts = array_map(fn(string $c) => "$c = :$c", $cols);
            $sql = sprintf('UPDATE %s SET %s WHERE id = :id', $table, implode(', ', $setParts));
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($updated);
            $this->syncJsonFileIfLocal();
            return $updated;
        }

        foreach ($this->seedData[$entity] as $idx => $item) {
            if ((int)($item['id'] ?? 0) === $id) {
                $this->seedData[$entity][$idx] = $updated;
                break;
            }
        }
        $this->saveJsonFallback();
        return $updated;
    }

    public function reorderItems(string $entity, array $orderedIds): array
    {
        $meta = $this->getEntityMeta($entity);
        $table = $meta['table'];

        $cleanIds = array_values(array_filter(array_map('intval', $orderedIds), fn(int $id) => $id > 0));

        if ($this->pdo !== null) {
            $this->getAllData();
            $stmt = $this->pdo->prepare(sprintf('UPDATE %s SET sort_order = :sort_order WHERE id = :id', $table));
            foreach ($cleanIds as $idx => $itemId) {
                $stmt->execute([
                    'sort_order' => $idx + 1,
                    'id'         => $itemId,
                ]);
            }
            $this->syncJsonFileIfLocal();
            return $this->getAllData()[$entity] ?? [];
        }

        $items = $this->ensureValidEntityIds($entity, $this->seedData[$entity] ?? []);
        $orderMap = [];
        foreach ($cleanIds as $idx => $itemId) {
            $orderMap[$itemId] = $idx + 1;
        }
        foreach ($items as &$item) {
            $id = (int)($item['id'] ?? 0);
            if (isset($orderMap[$id])) {
                $item['sort_order'] = $orderMap[$id];
            }
        }
        unset($item);

        usort($items, fn(array $a, array $b) => ((int)($a['sort_order'] ?? 999)) <=> ((int)($b['sort_order'] ?? 999)));
        $this->seedData[$entity] = array_values($items);
        $this->saveJsonFallback();
        return $this->seedData[$entity];
    }

    public function deleteItem(string $entity, int $id): bool
    {
        $meta = $this->getEntityMeta($entity);
        $table = $meta['table'];

        if ($this->pdo !== null) {
            $stmt = $this->pdo->prepare(sprintf('DELETE FROM %s WHERE id = :id', $table));
            $stmt->execute(['id' => $id]);
            $deleted = $stmt->rowCount() > 0;
            $this->syncJsonFileIfLocal();
            return $deleted;
        }

        $beforeCount = count($this->seedData[$entity] ?? []);
        $this->seedData[$entity] = array_values(array_filter(
            $this->seedData[$entity] ?? [],
            fn(array $item) => (int)($item['id'] ?? 0) !== $id
        ));
        $afterCount = count($this->seedData[$entity]);
        if ($afterCount !== $beforeCount) {
            $this->saveJsonFallback();
            return true;
        }
        return false;
    }

    public function resetToDefaultSeed(): array
    {
        $defaultSeed = require __DIR__ . '/../database/seed_data.php';
        $this->seedData = $defaultSeed;

        if ($this->pdo !== null && $this->driver === 'sqlite-in-repo') {
            $this->initializeSqliteSchema();
        } elseif ($this->pdo !== null && $this->driver === 'mysql') {
            $this->pdo->exec('DELETE FROM cv_profile; DELETE FROM cv_roles; DELETE FROM cv_skills; DELETE FROM cv_experience; DELETE FROM cv_projects; DELETE FROM cv_education;');
            $this->insertRow('cv_profile', $defaultSeed['profile']);
            foreach ($defaultSeed['roles'] as $row) {
                $this->insertRow('cv_roles', $row);
            }
            foreach ($defaultSeed['skills'] as $row) {
                $this->insertRow('cv_skills', $row);
            }
            foreach ($defaultSeed['experience'] as $row) {
                $this->insertRow('cv_experience', $row);
            }
            foreach ($defaultSeed['projects'] as $row) {
                $this->insertRow('cv_projects', $row);
            }
            foreach ($defaultSeed['education'] as $row) {
                $this->insertRow('cv_education', $row);
            }
        }

        $this->saveJsonFallback();
        return $this->getAllData();
    }

    private function getEntityMeta(string $entity): array
    {
        if (!isset(self::ENTITY_MAP[$entity])) {
            throw new InvalidArgumentException('Nepodporovaná entita: ' . $entity);
        }
        return self::ENTITY_MAP[$entity];
    }

    private function syncJsonFileIfLocal(): void
    {
        if ($this->driver === 'sqlite-in-repo') {
            $current = $this->getAllData();
            unset($current['driver']);
            @file_put_contents(
                $this->jsonPath,
                json_encode($current, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
            );
        }
    }

    private function saveJsonFallback(): void
    {
        $export = [
            'profile'    => $this->seedData['profile'],
            'roles'      => $this->seedData['roles'],
            'skills'     => $this->seedData['skills'],
            'experience' => $this->seedData['experience'],
            'projects'   => $this->seedData['projects'],
            'education'  => $this->seedData['education'],
            'socials'    => $this->seedData['socials'] ?? [],
            'users'      => $this->seedData['users'] ?? [],
        ];
        @file_put_contents(
            $this->jsonPath,
            json_encode($export, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        );
    }
}
