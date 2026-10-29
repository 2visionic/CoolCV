import type { LangCode } from '../types/cv';

export const DEFAULT_PORTRAIT_SVG: string =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" fill="none">
  <defs>
    <linearGradient id="hoodie" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e2235"/>
      <stop offset="100%" stop-color="#0f111c"/>
    </linearGradient>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f3c6a8"/>
      <stop offset="100%" stop-color="#d99b78"/>
    </linearGradient>
  </defs>
  <path d="M70 480 C85 355 155 320 240 320 C325 320 395 355 410 480 Z" fill="url(#hoodie)"/>
  <path d="M155 335 C190 380 290 380 325 335" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round" opacity="0.45"/>
  <rect x="206" y="255" width="68" height="85" rx="28" fill="url(#skin)"/>
  <rect x="166" y="108" width="148" height="178" rx="68" fill="url(#skin)"/>
  <path d="M156 175 C145 110 190 72 248 76 C305 72 340 115 324 175 C315 138 285 118 240 120 C195 118 170 140 156 175 Z" fill="#181824"/>
  <path d="M168 115 C195 68 288 68 315 118 C280 95 205 95 168 115 Z" fill="#232334"/>
  <rect x="184" y="168" width="46" height="32" rx="10" stroke="#1e1b4b" stroke-width="5" fill="#ffffff" fill-opacity="0.12"/>
  <rect x="250" y="168" width="46" height="32" rx="10" stroke="#1e1b4b" stroke-width="5" fill="#ffffff" fill-opacity="0.12"/>
  <line x1="230" y1="182" x2="250" y2="182" stroke="#1e1b4b" stroke-width="5"/>
  <circle cx="207" cy="184" r="5" fill="#1e1b4b"/>
  <circle cx="273" cy="184" r="5" fill="#1e1b4b"/>
  <path d="M218 238 Q240 252 262 238" stroke="#7c4a32" stroke-width="4.5" stroke-linecap="round" fill="none"/>
</svg>`);

export const UI_TEXT: Record<LangCode, Record<string, string>> = {
  cs: {
    hello: 'AHOJ, JSEM',
    tagline_1: 'Navrhuji UX zážitky a tvořím kód, který má ',
    tagline_highlight: 'Dopad.',
    cta_work: 'Zobrazit CV & Práci',
    cta_backoffice: 'React Backoffice & API',
    years_exp: 'Let praxe v oboru',
    trusted_tech: 'Hlavní technologický stack & nástroje',
    nav_home: 'Úvod',
    nav_pillars: 'Služby & Role',
    nav_resume: 'Strukturované CV',
    nav_portfolio: 'Projekty',
    nav_security: 'API & Šifrování',
    nav_backoffice: 'Backoffice Správa',
    freelance_title: 'Otevřený pro projekty & spolupráci',
    freelance_sub: 'Hledáte UX Designera nebo TS / React / PHP / .NET vývojáře?',
    hire_me: 'Napsat zprávu',
    download_cv: 'Stáhnout CV',
    follow_me: 'PROFILY & SÍTĚ',
    what_i_do: 'CO DĚLÁM A KDO JSEM',
    services_title: 'Čtyři pilíře mé odbornosti',
    services_sub: 'Kliknutím na libovolnou roli okamžitě vyfiltrujete strukturovaný životopis i projekty níže.',
    filter_all: 'Všechny obory (Full-Profile)',
    filter_active: 'Filtrovat CV podle této role',
    resume_badge: 'STRUKTUROVANÝ ŽIVOTOPIS (PAPER-STYLE LAYOUT)',
    resume_title: 'Pracovní zkušenosti, Vzdělání & Dovednosti',
    resume_sub: 'Přehled mých pracovních zkušeností, dosaženého vzdělání a klíčových dovedností s možností filtrace podle oboru.',
    exp_heading: 'Pracovní zkušenosti & Praxe',
    edu_heading: 'Vzdělání & Certifikace',
    skills_heading: 'Technické & UX Dovednosti',
    my_work: 'UKÁZKY PRÁCE',
    projects_title: 'Vybrané projekty & Případové studie',
    projects_sub: 'Ukázky reálných projektů a architektur propojujících UX/UI design, frontend v Reactu a TypeScriptu i backend v PHP a .NET.',
    stat_1_num: '80+',
    stat_1: 'Úspěšných obrazovek & návrhů',
    stat_2_num: '120+',
    stat_2: 'Nasazených funkcí & API',
    stat_3_num: '5+',
    stat_3: 'Let praxe v UX & vývoji',
    stat_4_num: '4 v 1',
    stat_4: 'Propojené obory (UX•TS•PHP•.NET)',
    crypto_badge: 'BACKEND SECURITY & REST API SHOWCASE',
    crypto_title: 'Živá ukázka API Tokenu a AES-256 Šifrování na Backendu',
    crypto_sub: 'Ověřte si v reálném čase, jak PHP backend podepisuje JWT tokeny (HMAC-SHA256) a šifruje data pomocí OpenSSL AES-256-CBC.',
    photo_upload_btn: 'Nahrát fotku',
    paper_mode_btn: 'Tisk A4 CV',
  },
  en: {
    hello: "HELLO, I'M",
    tagline_1: 'I Design Experiences & Engineer Code That Makes an ',
    tagline_highlight: 'Impact.',
    cta_work: 'View My CV & Work',
    cta_backoffice: 'React Backoffice & API',
    years_exp: 'Years of Experience',
    trusted_tech: 'Core Technology Stack & Ecosystem',
    nav_home: 'Home',
    nav_pillars: 'Services & Roles',
    nav_resume: 'Structured CV',
    nav_portfolio: 'Portfolio',
    nav_security: 'API & Encryption',
    nav_backoffice: 'Backoffice Admin',
    freelance_title: 'Available for Projects & Roles',
    freelance_sub: 'Looking for a UX Designer or TS / React / PHP / .NET Developer?',
    hire_me: 'Send Message',
    download_cv: 'Download CV',
    follow_me: 'PROFILES & NETWORKS',
    what_i_do: 'WHAT I DO',
    services_title: 'Services & Core Disciplines',
    services_sub: 'Click any discipline card below to dynamically filter the structured resume and portfolio.',
    filter_all: 'All Disciplines (Full Profile)',
    filter_active: 'Filter CV by this role',
    resume_badge: 'STRUCTURED RESUME (PAPER-STYLE LAYOUT)',
    resume_title: 'Work Experience, Education & Skills',
    resume_sub: 'Overview of my professional experience, education, and core competencies with interactive discipline filtering.',
    exp_heading: 'Work Experience',
    edu_heading: 'Education & Certifications',
    skills_heading: 'Technical & UX Skills',
    my_work: 'MY WORK',
    projects_title: 'Featured Projects & Case Studies',
    projects_sub: 'Selected case studies and architectures combining UX/UI design, React & TypeScript frontend, and PHP / .NET backend.',
    stat_1_num: '80+',
    stat_1: 'Designed Screens & Flows',
    stat_2_num: '120+',
    stat_2: 'Delivered Modules & APIs',
    stat_3_num: '5+',
    stat_3: 'Years of Experience',
    stat_4_num: '4 in 1',
    stat_4: 'Core Pillars (UX•TS•PHP•.NET)',
    crypto_badge: 'BACKEND SECURITY & REST API SHOWCASE',
    crypto_title: 'Live API Token & Backend AES-256 Encryption Inspector',
    crypto_sub: 'See in real time how the PHP backend signs JWT tokens (HMAC-SHA256) and encrypts payloads with OpenSSL AES-256-CBC.',
    photo_upload_btn: 'Upload Photo',
    paper_mode_btn: 'Print A4 CV',
  },
};
