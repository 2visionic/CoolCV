(function () {
  'use strict';
  const { useState, useEffect, useMemo, useRef } = React;


  // --- src/types/cv.ts ---
// TypeScript data models for React frontend, Backoffice and PHP REST API









  // --- src/i18n/translations.ts ---

const DEFAULT_PORTRAIT_SVG =
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

const UI_TEXT = {
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


  // --- src/components/Icon.tsx ---



// Icon componet: if name contain <svg, render custom SVG, otherwise Google Material Symbol
function Icon({ name, className = 'text-xl', filled = false }) {
  const raw = String(name || '').trim();
  const isCustomSvg = raw.startsWith('<svg') || raw.includes('<svg');

  if (isCustomSvg) {
    return (
      React.createElement("span", { className: `inline-flex items-center justify-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em] [&>svg]:fill-current ${className}`, "aria-hidden": "true", dangerouslySetInnerHTML: { __html: raw } })
    );
  }

  return (
    React.createElement("span", { className: `material-symbols-rounded ${filled ? 'material-symbols-filled' : ''} ${className}`, "aria-hidden": "true" }, raw || 'Apps')
  );
}


  // --- src/components/Sidebar.tsx ---







// Left navigation sidebar, on smaller screen it floats on top with hamburger toggle
function Sidebar({
  profile,
  socials,
  view,
  setView,
  activeSection,
  setActiveSection,
  onOpenBackoffice,
  isLoginModalOpen,
  onDownloadPdf,
  isGeneratingPdf,
  lang,
  toggleLang,
  isDark,
  toggleTheme,
  t,
  surfaceCard,
  innerCard,
  mutedText,
  secondaryText,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', icon: 'home', label: t('nav_home'), targetView: 'cv' },
    { id: 'pillars', icon: 'design_services', label: t('nav_pillars'), targetView: 'cv' },
    { id: 'resume', icon: 'description', label: t('nav_resume'), targetView: 'cv' },
    { id: 'portfolio', icon: 'folder_open', label: t('nav_portfolio'), targetView: 'cv' },
    { id: 'backoffice', icon: 'admin_panel_settings', label: t('nav_backoffice'), targetView: 'backoffice' },
  ];

  const defaultSocials = [
    { id: 1, icon: 'language', url: profile.website || '#top', title: 'Portfolio Web' },
    { id: 2, icon: 'code', url: profile.github || 'https://github.com', title: 'GitHub' },
    { id: 3, icon: 'work', url: profile.linkedin || 'https://linkedin.com', title: 'LinkedIn' },
    { id: 4, icon: 'mail', url: `mailto:${profile.email || ''}`, title: 'Email' },
  ];

  const activeSocials = socials && socials.length > 0 ? socials : defaultSocials;
  const dividerBorder = isDark ? 'border-white/[0.07]' : 'border-slate-200';
  const iconAccent = isDark ? 'text-purple-400' : 'text-purple-600';

  return (
    React.createElement("aside", { className: `w-full xl:w-[300px] shrink-0 rounded-none xl:rounded-3xl border-t-0 border-x-0 xl:border px-4 py-3 sm:px-6 sm:py-3.5 xl:p-7 sticky top-0 xl:top-8 z-40 backdrop-blur-xl no-print transition-all ${surfaceCard}` }, React.createElement("div", { className: "flex items-center gap-2.5" }, React.createElement("button", { type: "button", onClick: toggleLang, className: `flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${innerCard}`, title: lang === 'cs' ? 'Přepnout jazyk CS → EN' : 'Switch language EN → CS' }, React.createElement(Icon, { name: "translate", className: `text-base ${iconAccent}` }), React.createElement("span", null, lang === 'cs' ? 'CS' : 'EN'), React.createElement(Icon, { name: "arrow_forward", className: "text-sm opacity-60" }), React.createElement("span", { className: "opacity-75" }, lang === 'cs' ? 'EN' : 'CS')), React.createElement("button", { type: "button", onClick: toggleTheme, className: `flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${innerCard}`, title: "Přepnout tmavý / světlý režim" }, React.createElement(Icon, { name: isDark ? 'light_mode' : 'dark_mode', className: `text-base ${isDark ? 'text-amber-400' : 'text-amber-600'}` }), React.createElement("span", null, isDark ? 'Light' : 'Dark')), React.createElement("button", { type: "button", onClick: () => setIsMenuOpen((prev) => !prev), "aria-expanded": isMenuOpen, "aria-label": isMenuOpen ? 'Close menu' : 'Open menu', title: isMenuOpen ? 'Zavřít menu' : 'Otevřít menu', className: `xl:hidden w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all ${innerCard}` }, React.createElement("span", { className: "relative w-5 h-4 block" }, React.createElement("span", { className: `block absolute left-0 w-5 h-[2px] rounded-full bg-current transition-all duration-300 ease-in-out origin-center ${
                isMenuOpen ? 'top-[7px] rotate-45' : 'top-[1px] rotate-0'
              }` }), React.createElement("span", { className: `block absolute left-0 top-[7px] w-5 h-[2px] rounded-full bg-current transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              }` }), React.createElement("span", { className: `block absolute left-0 w-5 h-[2px] rounded-full bg-current transition-all duration-300 ease-in-out origin-center ${
                isMenuOpen ? 'top-[7px] -rotate-45' : 'top-[13px] rotate-0'
              }` })))), React.createElement("div", { className: `overflow-hidden transition-all duration-300 ease-in-out xl:overflow-visible xl:max-h-none xl:opacity-100 xl:mt-5 ${
          isMenuOpen ? 'max-h-[640px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0 xl:mt-5'
        }` }, React.createElement("nav", { className: "flex flex-col gap-1.5 xl:gap-2" }, navItems.map((item) => {
            const isActive =
              item.targetView === 'backoffice'
                ? view === 'backoffice' || isLoginModalOpen
                : view === 'cv' && !isLoginModalOpen && activeSection === item.id;

            return (
              React.createElement("button", { key: item.id, type: "button", onClick: () => {
                  setIsMenuOpen(false);
                  if (item.targetView === 'backoffice') {
                    onOpenBackoffice();
                  } else {
                    setView('cv');
                    setActiveSection(item.id);
                    if (item.id !== 'home') {
                      setTimeout(() => {
                        document.getElementById(`sec-${item.id}`)?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }
                }, className: `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-purple-600/30 via-fuchsia-600/20 to-transparent text-purple-300 border border-purple-500/30 shadow-sm'
                      : 'bg-gradient-to-r from-purple-500/15 via-fuchsia-500/10 to-transparent text-purple-900 border border-purple-300 shadow-sm font-bold'
                    : `${secondaryText} ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-200/60'}`
                }` }, React.createElement(Icon, { name: item.icon, filled: isActive, className: `text-xl ${
                    isActive ? (isDark ? 'text-fuchsia-400' : 'text-purple-700') : mutedText
                  }` }), React.createElement("span", null, item.label))
            );
          })), React.createElement("div", { className: "mt-4 xl:mt-6 flex flex-col sm:flex-row xl:flex-col gap-3" }, React.createElement("a", { href: `mailto:${profile.email || 'jan.novak@example.cz'}`, onClick: () => setIsMenuOpen(false), className: "w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow-lg shadow-purple-500/25 transition-all" }, React.createElement(Icon, { name: "mail", className: "text-base" }), React.createElement("span", null, t('hire_me'))), React.createElement("button", { type: "button", onClick: () => {
              setIsMenuOpen(false);
              onDownloadPdf();
            }, disabled: isGeneratingPdf, className: `w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all disabled:opacity-60 ${innerCard}` }, React.createElement(Icon, { name: isGeneratingPdf ? 'progress_activity' : 'picture_as_pdf', className: `text-base ${iconAccent} ${isGeneratingPdf ? 'animate-spin' : ''}` }), React.createElement("span", null, isGeneratingPdf
                ? lang === 'cs'
                  ? 'Generuji PDF...'
                  : 'Generating PDF...'
                : t('download_cv')))), activeSocials.length > 0 && (
          React.createElement("div", { className: `mt-4 xl:mt-6 pt-4 xl:pt-6 border-t ${dividerBorder} flex flex-wrap items-center justify-center gap-2.5` }, activeSocials.map((soc, i) => (
              React.createElement("a", { key: soc.id || i, href: soc.url, target: String(soc.url || '').startsWith('http') ? '_blank' : undefined, rel: "noopener noreferrer", title: soc.title, "aria-label": soc.title, className: `w-10 h-10 rounded-full flex items-center justify-center transition-all ${innerCard}` }, React.createElement(Icon, { name: soc.icon, className: `text-lg ${iconAccent}` }))
            )))
        )))
  );
}


  // --- src/components/Topbar.tsx ---





// Top bar inside main sheet with public switchers for language, theme and print
function Topbar({
  lang,
  toggleLang,
  isDark,
  toggleTheme,
  t,
  innerCard,
}) {
  return (
    React.createElement("header", { className: "flex flex-wrap items-center justify-end gap-2.5 pb-6 mb-8 border-b border-white/[0.07] no-print" }, React.createElement("button", { type: "button", onClick: toggleLang, className: `px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${innerCard}`, title: "Přepnout jazyk CZ / EN" }, React.createElement(Icon, { name: "translate", className: "text-base text-purple-400" }), React.createElement("span", null, lang.toUpperCase())), React.createElement("button", { type: "button", onClick: toggleTheme, className: `px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${innerCard}`, title: "Přepnout tmavý / světlý režim" }, React.createElement(Icon, { name: isDark ? 'light_mode' : 'dark_mode', className: "text-base text-amber-400" }), React.createElement("span", { className: "hidden sm:inline" }, isDark ? 'Light' : 'Dark')), React.createElement("button", { type: "button", onClick: () => window.print(), className: "px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 hover:opacity-95 shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all" }, React.createElement(Icon, { name: "print", className: "text-base" }), React.createElement("span", null, t('paper_mode_btn'))))
  );
}


  // --- src/components/HeroSection.tsx ---





// Hero section with avatar, circular upload progress, 3 contact items under it, and main tech stack
function HeroSection({
  firstName,
  lastName,
  fullName,
  profile,
  avatarSrc,
  isUploadingPhoto = false,
  photoUploadProgress = 0,
  isDark,
  field,
  t,
  surfaceCard,
  innerCard,
  mutedText,
  secondaryText,
}) {
  const defaultStackItems = [
    'Figma UX/UI',
    'TypeScript & ES6+',
    'React 18 (.tsx)',
    'PHP 8 & MySQL',
    'C# .NET Core',
  ];
  const stackIcons = ['draw', 'code_blocks', 'deployed_code', 'dns', 'terminal', 'auto_awesome', 'bolt', 'layers'];
  const rawStackStr =
    typeof profile.primary_stack === 'string' && profile.primary_stack.trim() !== ''
      ? profile.primary_stack
      : defaultStackItems.join(', ');

  const techStack = rawStackStr
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((label, idx) => ({
      icon: stackIcons[idx % stackIcons.length],
      label,
    }));

  const positionText =
    field(profile, 'subtitle') || 'UX Designer • JavaScript & PHP Developer • Junior C# .NET Core';
  const locationText = field(profile, 'location') || 'Praha / Česká republika (Remote)';
  const emailText = profile.email || 'jan.novak@example.cz';
  const phoneText = profile.phone || '+420 777 123 456';

  return (
    React.createElement("section", { id: "sec-home", className: "space-y-12" }, React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start" }, React.createElement("div", { className: "lg:col-span-8 space-y-5" }, React.createElement("div", null, React.createElement("div", { className: `inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border ${
                isDark
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/25'
                  : 'bg-purple-100/90 text-purple-800 border-purple-300'
              }` }, React.createElement("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), React.createElement("span", null, field(profile, 'availability')))), React.createElement("div", { className: "space-y-1.5" }, React.createElement("h1", { className: "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]" }, React.createElement("span", null, firstName, " "), React.createElement("span", { className: `bg-gradient-to-r bg-clip-text text-transparent ${
                  isDark
                    ? 'from-purple-400 via-fuchsia-400 to-indigo-400'
                    : 'from-purple-600 via-fuchsia-600 to-indigo-600'
                }` }, lastName)), React.createElement("div", { className: `text-base sm:text-lg font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}` }, positionText)), React.createElement("p", { className: "text-xl sm:text-2xl font-bold leading-snug max-w-3xl" }, t('tagline_1'), React.createElement("span", { className: `bg-gradient-to-r bg-clip-text text-transparent ${
                isDark ? 'from-fuchsia-400 to-purple-400' : 'from-fuchsia-600 to-purple-600'
              }` }, t('tagline_highlight'))), React.createElement("p", { className: `text-sm sm:text-base leading-relaxed max-w-3xl ${secondaryText}` }, field(profile, 'bio')), React.createElement("div", { className: "pt-2 no-print" }, React.createElement("a", { href: "#sec-resume", className: "inline-flex px-7 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 hover:opacity-95 shadow-xl shadow-purple-500/25 items-center gap-2.5 transition-all" }, React.createElement("span", null, t('cta_work')), React.createElement(Icon, { name: "arrow_forward", className: "text-lg" })))), React.createElement("div", { className: "lg:col-span-4 flex flex-col items-center gap-6 w-full" }, React.createElement("div", { className: "relative w-52 h-52 sm:w-60 sm:h-60 lg:w-64 lg:h-64 flex items-center justify-center shrink-0" }, React.createElement("div", { className: "absolute inset-3 rounded-full hero-portrait-aura opacity-90 blur-[2px] shadow-2xl shadow-purple-600/30" }), isUploadingPhoto && (
              React.createElement("svg", { className: "absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)] -rotate-90 pointer-events-none z-20", viewBox: "0 0 120 120" }, React.createElement("defs", null, React.createElement("linearGradient", { id: "heroAvatarProgressGrad", x1: "0%", y1: "0%", x2: "100%", y2: "100%" }, React.createElement("stop", { offset: "0%", stopColor: "#ec4899" }), React.createElement("stop", { offset: "50%", stopColor: "#a855f7" }), React.createElement("stop", { offset: "100%", stopColor: "#6366f1" }))), React.createElement("circle", { cx: "60", cy: "60", r: "54", fill: "none", stroke: "rgba(168, 85, 247, 0.22)", strokeWidth: "4.5" }), React.createElement("circle", { cx: "60", cy: "60", r: "54", fill: "none", stroke: "url(#heroAvatarProgressGrad)", strokeWidth: "4.5", strokeLinecap: "round", strokeDasharray: "339.29", strokeDashoffset: 339.29 - (339.29 * Math.min(100, Math.max(0, photoUploadProgress))) / 100, className: "transition-all duration-100 ease-out" }))
            ), React.createElement("div", { className: `relative w-[86%] h-[86%] rounded-full overflow-hidden border-4 flex items-end justify-center ${
                isDark ? 'border-white/15 bg-[#151828] shadow-inner' : 'border-white bg-slate-100 shadow-lg'
              }` }, React.createElement("img", { src: avatarSrc, alt: fullName, className: "w-full h-full object-cover object-center" }), isUploadingPhoto && (
                React.createElement("div", { className: "absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2.5" }, React.createElement("div", { className: "flex items-center gap-2" }, React.createElement("span", { className: "w-3 h-3 rounded-full bg-fuchsia-400 animate-bounce", style: { animationDelay: '0ms' } }), React.createElement("span", { className: "w-3 h-3 rounded-full bg-purple-400 animate-bounce", style: { animationDelay: '150ms' } }), React.createElement("span", { className: "w-3 h-3 rounded-full bg-indigo-400 animate-bounce", style: { animationDelay: '300ms' } })), React.createElement("span", { className: "text-xs sm:text-sm font-extrabold font-mono text-white tracking-wider" }, `${Math.round(photoUploadProgress)}%`))
              )), React.createElement("div", { className: `absolute -bottom-2 -right-2 px-4 py-3 rounded-2xl backdrop-blur-xl ${surfaceCard} text-center` }, React.createElement("div", { className: `text-2xl sm:text-3xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent ${
                  isDark ? 'from-fuchsia-400 to-indigo-400' : 'from-fuchsia-600 to-indigo-600'
                }` }, profile.years_exp_badge || '5+'), React.createElement("div", { className: `text-[11px] font-semibold leading-tight mt-0.5 ${mutedText}` }, t('years_exp')))), React.createElement("div", { className: "w-fit max-w-full mx-auto flex flex-col items-start gap-3 pt-1 text-left" }, React.createElement("div", { className: "flex items-center gap-3" }, React.createElement(Icon, { name: "call", className: `text-xl shrink-0 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}` }), React.createElement("a", { href: `tel:${phoneText.replace(/\s+/g, '')}`, className: "text-sm sm:text-base font-extrabold tracking-tight hover:text-purple-500 transition-colors break-words" }, phoneText)), React.createElement("div", { className: "flex items-center gap-3" }, React.createElement(Icon, { name: "mail", className: `text-xl shrink-0 ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'}` }), React.createElement("a", { href: `mailto:${emailText}`, className: "text-sm sm:text-base font-extrabold tracking-tight hover:text-purple-500 transition-colors break-all" }, emailText)), React.createElement("div", { className: "flex items-center gap-3" }, React.createElement(Icon, { name: "location_on", className: `text-xl shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}` }), React.createElement("span", { className: "text-sm sm:text-base font-extrabold tracking-tight break-words" }, locationText))))), React.createElement("div", { className: `rounded-3xl p-6 sm:p-8 space-y-3.5 print-card ${innerCard}` }, React.createElement("div", { className: `text-xs font-bold tracking-[0.18em] uppercase ${mutedText}` }, t('trusted_tech')), React.createElement("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-2.5" }, techStack.map((tech, idx) => (
            React.createElement("div", { key: idx, className: "flex items-center gap-2 text-sm sm:text-base font-bold tracking-tight" }, React.createElement(Icon, { name: tech.icon, className: `text-xl ${isDark ? 'text-purple-400' : 'text-purple-600'}` }), React.createElement("span", null, tech.label))
          )))))
  );
}


  // --- src/components/ServicesPillars.tsx ---





// Section with 4 main pillars in 2x2 grid on desktop and 1x1 on mobile
function ServicesPillars({
  roles,
  activeRole,
  setActiveRole,
  isDark,
  field,
  t,
  innerCard,
  mutedText,
  secondaryText,
}) {
  return (
    React.createElement("section", { id: "sec-pillars", className: "space-y-8" }, React.createElement("div", { className: "flex flex-col items-start gap-2.5" }, React.createElement("h2", { className: "text-2xl sm:text-3xl font-extrabold tracking-tight" }, t('services_title')), React.createElement("p", { className: `text-xs sm:text-sm max-w-2xl leading-relaxed ${mutedText}` }, t('services_sub'))), React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7" }, roles.map((role) => {
          const isSelected = activeRole === role.slug;
          return (
            React.createElement("article", { key: role.id, onClick: () => setActiveRole(isSelected ? 'all' : role.slug), className: `cursor-pointer rounded-3xl p-7 sm:p-8 transition-all duration-200 flex flex-col justify-between print-card ${innerCard} ${
                isSelected ? 'ring-2 ring-purple-500 bg-purple-500/[0.08]' : 'hover:-translate-y-1'
              }` }, React.createElement("div", null, React.createElement("div", { className: "flex items-center justify-between gap-3 mb-6" }, React.createElement("div", { className: `w-14 h-14 rounded-full bg-gradient-to-br border flex items-center justify-center shadow-inner ${
                      isDark
                        ? 'from-fuchsia-500/20 via-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400'
                        : 'from-fuchsia-500/15 via-purple-500/15 to-indigo-500/15 border-purple-300 text-purple-700'
                    }` }, React.createElement(Icon, { name: role.icon || 'code', className: "text-2xl" })), React.createElement("span", { className: `text-[11px] font-extrabold uppercase tracking-wider ${
                      isDark ? 'text-purple-300' : 'text-purple-700'
                    }` }, field(role, 'level'))), React.createElement("h3", { className: "text-lg font-extrabold mb-3" }, field(role, 'title')), React.createElement("p", { className: `text-xs sm:text-sm leading-relaxed mb-6 ${secondaryText}` }, field(role, 'summary'))), React.createElement("div", { className: `pt-2 flex items-center justify-between text-xs font-bold no-print ${
                  isDark ? 'text-purple-400' : 'text-purple-700'
                }` }, React.createElement("span", null, isSelected ? '✓ Aktivní filtr' : t('filter_active')), React.createElement(Icon, { name: "arrow_forward", className: "text-base" })))
          );
        })))
  );
}


  // --- src/components/StructuredResume.tsx ---





// Structured resume layout with live filtering by role pillars
function StructuredResume({
  roles,
  roleMap,
  activeRole,
  setActiveRole,
  filteredExperience,
  filteredEducation,
  filteredSkills,
  isDark,
  field,
  t,
  innerCard,
  mutedText,
  secondaryText,
}) {
  const pillTagClass = isDark
    ? 'bg-white/[0.06] text-slate-200 border-white/15'
    : 'bg-purple-100/90 text-purple-900 border-purple-300';

  const periodBadgeClass = isDark
    ? 'bg-purple-500/15 text-purple-300 border-purple-500/25'
    : 'bg-purple-100 text-purple-800 border-purple-300';

  return (
    React.createElement("section", { id: "sec-resume", className: "space-y-8" }, React.createElement("div", { className: "flex flex-col items-start gap-3" }, React.createElement("h2", { className: "text-2xl sm:text-3xl font-extrabold tracking-tight" }, t('resume_title')), React.createElement("p", { className: `text-xs sm:text-sm max-w-2xl leading-relaxed ${mutedText}` }, t('resume_sub')), React.createElement("div", { className: "flex flex-wrap items-center gap-2 pt-2 no-print" }, React.createElement("button", { type: "button", onClick: () => setActiveRole('all'), className: `px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeRole === 'all'
                ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-md'
                : innerCard
            }` }, t('filter_all')), roles.map((r) => (
            React.createElement("button", { key: r.slug, type: "button", onClick: () => setActiveRole(r.slug), className: `px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeRole === r.slug
                  ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-md'
                  : innerCard
              }` }, React.createElement(Icon, { name: r.icon || 'code', className: "text-base" }), React.createElement("span", null, r.badge_code))
          )))), React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start" }, React.createElement("div", { className: "lg:col-span-7 space-y-10" }, React.createElement("div", { className: "space-y-6" }, React.createElement("h3", { className: "text-lg font-extrabold flex items-center gap-2.5" }, React.createElement(Icon, { name: "work_history", className: `text-2xl ${isDark ? 'text-purple-400' : 'text-purple-600'}` }), React.createElement("span", null, t('exp_heading'))), React.createElement("div", { className: "space-y-6" }, filteredExperience.map((exp) => {
                const tags = String(exp.role_tags || '')
                  .split(',')
                  .map((x) => x.trim())
                  .filter(Boolean);
                const achs = String(field(exp, 'achievements') || '')
                  .split('|')
                  .map((x) => x.trim())
                  .filter(Boolean);

                return (
                  React.createElement("article", { key: exp.id, className: `rounded-3xl p-7 sm:p-8 transition-all print-card ${innerCard}` }, React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 mb-3" }, React.createElement("span", { className: `text-xs font-mono font-extrabold ${
                          isDark ? 'text-purple-400' : 'text-purple-700'
                        }` }, field(exp, 'period')), React.createElement("div", { className: "flex flex-wrap items-center gap-1.5" }, tags.map((slug) => (
                          React.createElement("span", { key: slug, className: `px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${pillTagClass}` }, roleMap[slug]?.badge_code || field(roleMap[slug], 'title') || slug)
                        )))), React.createElement("h4", { className: "text-lg sm:text-xl font-extrabold mb-1" }, field(exp, 'role')), React.createElement("div", { className: `text-xs sm:text-sm font-bold mb-4 ${
                        isDark ? 'text-fuchsia-400' : 'text-fuchsia-700'
                      }` }, exp.company), React.createElement("p", { className: `text-xs sm:text-sm leading-relaxed mb-5 ${secondaryText}` }, field(exp, 'description')), achs.length > 0 && (
                      React.createElement("ul", { className: "space-y-2 pt-2" }, achs.map((ach, i) => (
                          React.createElement("li", { key: i, className: "flex items-start gap-2.5 text-xs sm:text-sm font-medium" }, React.createElement(Icon, { name: "check_circle", className: `text-base shrink-0 mt-0.5 ${
                                isDark ? 'text-emerald-400' : 'text-emerald-600'
                              }` }), React.createElement("span", null, ach))
                        )))
                    ))
                );
              })))), React.createElement("div", { className: "lg:col-span-5 space-y-6" }, React.createElement("h3", { className: "text-lg font-extrabold flex items-center gap-2.5" }, React.createElement(Icon, { name: "auto_awesome", className: `text-2xl ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'}` }), React.createElement("span", null, t('skills_heading'))), React.createElement("div", { className: "space-y-4" }, filteredSkills.map((skill) => {
              const skillTags = String(skill.role_slug || '')
                .split(',')
                .map((x) => x.trim())
                .filter(Boolean);

              return (
                React.createElement("div", { key: skill.id, className: `rounded-2xl p-5 sm:p-6 print-card ${innerCard}` }, React.createElement("div", { className: "flex items-center justify-between gap-2 mb-2" }, React.createElement("span", { className: "font-bold text-sm" }, field(skill, 'name')), React.createElement("span", { className: `text-xs font-mono font-extrabold shrink-0 ${
                        isDark ? 'text-purple-400' : 'text-purple-700'
                      }` }, skill.proficiency, "%")), React.createElement("div", { className: "flex items-center gap-2.5 mb-2.5" }, React.createElement("div", { className: `flex-1 h-2 rounded-full overflow-hidden ${
                        isDark ? 'bg-black/35' : 'bg-slate-200'
                      }` }, React.createElement("div", { className: "h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500", style: { width: `${skill.proficiency}%` } })), skillTags.length > 0 && (
                      React.createElement("div", { className: "flex items-center gap-1.5 shrink-0" }, skillTags.map((slug) => (
                          React.createElement("span", { key: slug, className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${periodBadgeClass}` }, roleMap[slug]?.badge_code || slug)
                        )))
                    )), React.createElement("div", { className: `flex items-center justify-between text-[11px] ${mutedText}` }, React.createElement("span", { className: `font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}` }, skill.years_exp), React.createElement("span", { className: "truncate max-w-[70%]" }, skill.tags)))
              );
            })))), React.createElement("div", { className: "space-y-6 pt-2" }, React.createElement("h3", { className: "text-lg font-extrabold flex items-center gap-2.5" }, React.createElement(Icon, { name: "school", className: `text-2xl ${isDark ? 'text-indigo-400' : 'text-indigo-600'}` }), React.createElement("span", null, t('edu_heading'))), React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, filteredEducation.map((edu) => {
            const eduTags = String(edu.role_tags || '')
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean);

            return (
              React.createElement("article", { key: edu.id, className: `rounded-3xl p-6 sm:p-7 print-card ${innerCard}` }, React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 mb-2" }, React.createElement("div", { className: `text-xs font-mono font-extrabold ${
                      isDark ? 'text-indigo-400' : 'text-indigo-700'
                    }` }, edu.period), React.createElement("div", { className: "flex flex-wrap items-center gap-1.5" }, eduTags.map((slug) => (
                      React.createElement("span", { key: slug, className: `px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${pillTagClass}` }, roleMap[slug]?.badge_code || field(roleMap[slug], 'title') || slug)
                    )))), React.createElement("h4", { className: "text-base sm:text-lg font-extrabold mb-1" }, field(edu, 'title')), React.createElement("div", { className: `text-xs font-bold mb-3 ${mutedText}` }, field(edu, 'institution')), React.createElement("p", { className: `text-xs sm:text-sm leading-relaxed ${secondaryText}` }, field(edu, 'details')))
            );
          }))))
  );
}


  // --- src/components/FeaturedProjects.tsx ---





// Featured projects section and bottom statistics banner
function FeaturedProjects({
  filteredProjects,
  profile,
  roles,
  roleMap,
  activeRole,
  setActiveRole,
  isDark,
  field,
  t,
  innerCard,
  mutedText,
  secondaryText,
}) {
  const darkGradients = [
    'from-indigo-600/40 via-purple-600/30 to-slate-900',
    'from-fuchsia-600/40 via-purple-600/30 to-slate-900',
    'from-emerald-600/35 via-teal-600/25 to-slate-900',
    'from-blue-600/40 via-indigo-600/30 to-slate-900',
  ];

  const lightGradients = [
    'from-indigo-500/20 via-purple-500/15 to-indigo-100/90 border-b border-indigo-200/80',
    'from-fuchsia-500/20 via-purple-500/15 to-fuchsia-100/90 border-b border-fuchsia-200/80',
    'from-emerald-500/20 via-teal-500/15 to-teal-100/90 border-b border-teal-200/80',
    'from-blue-500/20 via-indigo-500/15 to-blue-100/90 border-b border-blue-200/80',
  ];

  const gradients = isDark ? darkGradients : lightGradients;
  const icons = ['dashboard', 'receipt_long', 'inventory_2', 'badge'];

  const stats = [
    {
      icon: profile.ui_stat_1_icon || 'sentiment_satisfied',
      num: t('stat_1_num'),
      label: t('stat_1'),
    },
    {
      icon: profile.ui_stat_2_icon || 'folder_open',
      num: t('stat_2_num'),
      label: t('stat_2'),
    },
    {
      icon: profile.ui_stat_3_icon || 'local_cafe',
      num: t('stat_3_num'),
      label: t('stat_3'),
    },
    {
      icon: profile.ui_stat_4_icon || 'emoji_events',
      num: t('stat_4_num'),
      label: t('stat_4'),
    },
  ];

  return (
    React.createElement(React.Fragment, null, React.createElement("section", { id: "sec-portfolio", className: "space-y-8" }, React.createElement("div", { className: "flex flex-col items-start gap-3" }, React.createElement("h2", { className: "text-2xl sm:text-3xl font-extrabold tracking-tight" }, t('projects_title')), React.createElement("p", { className: `text-xs sm:text-sm max-w-2xl leading-relaxed ${mutedText}` }, t('projects_sub')), React.createElement("div", { className: "flex flex-wrap items-center gap-2 pt-2 no-print" }, React.createElement("button", { type: "button", onClick: () => setActiveRole('all'), className: `px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'all'
                  ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-md'
                  : innerCard
              }` }, t('filter_all')), roles.map((r) => (
              React.createElement("button", { key: r.slug, type: "button", onClick: () => setActiveRole(r.slug), className: `px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeRole === r.slug
                    ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-md'
                    : innerCard
                }` }, React.createElement(Icon, { name: r.icon || 'code', className: "text-base" }), React.createElement("span", null, r.badge_code))
            )))), React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8" }, filteredProjects.map((proj, idx) => {
            const tags = String(proj.role_tags || '')
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean);

            return (
              React.createElement("article", { key: proj.id, className: `rounded-3xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 print-card ${innerCard}` }, React.createElement("div", null, React.createElement("div", { className: `h-44 p-6 bg-gradient-to-br ${
                      gradients[idx % gradients.length]
                    } flex flex-col justify-between relative overflow-hidden no-print` }, React.createElement("div", { className: "flex items-start justify-between gap-2 z-10" }, React.createElement("div", { className: "flex flex-wrap gap-1.5" }, tags.map((slug) => (
                          React.createElement("span", { key: slug, className: `px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border ${
                              isDark
                                ? 'bg-black/45 text-white border-white/15'
                                : 'bg-white/90 text-purple-900 border-purple-300/80 shadow-sm'
                            }` }, roleMap[slug]?.badge_code || field(roleMap[slug], 'title') || slug)
                        ))), React.createElement(Icon, { name: icons[idx % icons.length], className: `text-3xl shrink-0 ${isDark ? 'text-white/80' : 'text-purple-700/80'}` })), React.createElement("div", { className: `w-full backdrop-blur-md rounded-xl p-3 border text-xs font-mono truncate z-10 ${
                        isDark
                          ? 'bg-black/45 border-white/10 text-white/90'
                          : 'bg-white/90 border-purple-200 text-slate-800 font-semibold shadow-sm'
                      }` }, proj.tech_stack)), React.createElement("div", { className: "p-7 sm:p-8 space-y-2.5" }, React.createElement("div", { className: `text-xs font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}` }, field(proj, 'subtitle')), React.createElement("h3", { className: "text-xl font-extrabold" }, field(proj, 'title')), proj.demo_url && !String(proj.demo_url).startsWith('#') && (
                      React.createElement("div", { className: "pt-0.5" }, React.createElement("a", { href: /^https?:\/\//i.test(String(proj.demo_url))
                              ? String(proj.demo_url)
                              : `https://${proj.demo_url}`, target: "_blank", rel: "noopener noreferrer", className: `inline-flex items-center gap-1.5 text-xs font-bold hover:underline ${
                            isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-700 hover:text-indigo-900'
                          }` }, React.createElement(Icon, { name: "language", className: "text-sm" }), React.createElement("span", null, String(proj.demo_url).replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')), React.createElement(Icon, { name: "open_in_new", className: "text-xs opacity-75" })))
                    ), React.createElement("p", { className: `text-xs sm:text-sm leading-relaxed pb-2 ${secondaryText}` }, field(proj, 'description')), React.createElement("div", { className: `p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-start gap-2.5 ${
                        isDark
                          ? 'bg-purple-500/10 border-purple-500/20'
                          : 'bg-purple-50 border-purple-200 text-slate-800'
                      }` }, React.createElement(Icon, { name: "trending_up", className: `text-lg shrink-0 mt-0.5 ${
                          isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'
                        }` }), React.createElement("span", null, field(proj, 'outcome'))))))
            );
          }))), React.createElement("section", { className: "rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-rose-500 via-fuchsia-600 to-indigo-600 text-white shadow-2xl shadow-purple-900/30 no-print" }, React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-8" }, stats.map((st, i) => (
            React.createElement("div", { key: i, className: "flex items-center gap-4" }, React.createElement("div", { className: "w-14 h-14 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0" }, React.createElement(Icon, { name: st.icon, className: "text-3xl text-white" })), React.createElement("div", null, React.createElement("div", { className: "text-2xl sm:text-3xl font-extrabold leading-none mb-1" }, st.num), React.createElement("div", { className: "text-xs font-medium text-white/90" }, st.label)))
          )))))
  );
}


  // --- src/components/CryptoShowcase.tsx ---





// Live showcase of encryption on PHP backend (AES-256-CBC + HMAC) and API token
function CryptoShowcase({
  probePlaintext,
  setProbePlaintext,
  liveCryptoProbe,
  onRunCryptoProbe,
  onOpenBackoffice,
  t,
  innerCard,
  secondaryText,
}) {
  return (
    React.createElement("section", { id: "sec-security", className: "space-y-8 no-print" }, React.createElement("div", { className: "flex flex-col lg:flex-row lg:items-end justify-between gap-4" }, React.createElement("div", null, React.createElement("div", { className: "text-xs font-bold tracking-[0.2em] uppercase text-emerald-400 mb-2" }, t('crypto_badge')), React.createElement("h2", { className: "text-2xl sm:text-3xl font-extrabold tracking-tight" }, t('crypto_title')), React.createElement("p", { className: `text-xs sm:text-sm mt-2 max-w-3xl ${secondaryText}` }, t('crypto_sub'))), React.createElement("button", { type: "button", onClick: onOpenBackoffice, className: "px-6 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 to-indigo-500 shadow-lg flex items-center gap-2 shrink-0" }, React.createElement(Icon, { name: "lock_open", className: "text-base" }), React.createElement("span", null, "Otevřít plný React + TS Backoffice & CRUD Editor"))), React.createElement("div", { className: `rounded-3xl p-7 sm:p-9 space-y-6 ${innerCard}` }, React.createElement("div", { className: "flex flex-col sm:flex-row gap-3" }, React.createElement("input", { type: "text", value: probePlaintext, onChange: (e) => setProbePlaintext(e.target.value), placeholder: "Zadejte libovolný text nebo payload k zašifrování na PHP backendu...", className: "flex-1 px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-mono focus:outline-none focus:border-purple-500" }), React.createElement("button", { type: "button", onClick: onRunCryptoProbe, className: "px-6 py-3.5 rounded-2xl font-bold text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 flex items-center gap-2 shrink-0" }, React.createElement(Icon, { name: "encrypted", className: "text-lg" }), React.createElement("span", null, "Zašifrovat na Backendu (POST api.php?route=crypto/inspect)"))), liveCryptoProbe && (
          React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono text-xs" }, React.createElement("div", { className: "p-5 rounded-2xl bg-black/35 border border-white/10 space-y-2" }, React.createElement("div", { className: "text-purple-400 font-bold uppercase" }, "1. Algoritmus & IV (128-bit)"), React.createElement("div", { className: "text-slate-300 break-all" }, liveCryptoProbe.encryption_process?.algorithm), React.createElement("div", { className: "text-slate-400" }, `IV (Hex): ${liveCryptoProbe.encryption_process?.iv_hex}`)), React.createElement("div", { className: "p-5 rounded-2xl bg-black/35 border border-white/10 space-y-2" }, React.createElement("div", { className: "text-fuchsia-400 font-bold uppercase" }, "2. AES-256 Ciphertext & HMAC-SHA256"), React.createElement("div", { className: "text-slate-300 break-all" }, `Cipher: ${liveCryptoProbe.encryption_process?.ciphertext_base64}`), React.createElement("div", { className: "text-slate-400 break-all" }, `HMAC: ${liveCryptoProbe.encryption_process?.hmac_sha256_hex}`)), React.createElement("div", { className: "p-5 rounded-2xl bg-black/35 border border-emerald-500/25 space-y-2" }, React.createElement("div", { className: "text-emerald-400 font-bold uppercase" }, "3. Backend Dešifrování & Verifikace"), React.createElement("div", { className: "text-emerald-300" }, `HMAC Integrity: ${
                  liveCryptoProbe.decryption_verify?.verified_hmac ? 'VERIFIED (OK)' : 'FAILED'
                }`), React.createElement("div", { className: "text-slate-300 break-all" }, `Výstup: "${liveCryptoProbe.decryption_verify?.decrypted_raw}"`)))
        )))
  );
}


  // --- src/components/PdfResumeTemplate.tsx ---




// Clean A4 document template styled after the clean product/info sheet layout
function PdfResumeTemplate({
  profile,
  roles,
  roleMap,
  skills,
  experience,
  education,
  projects,
  socials,
  avatarSrc,
  lang,
  field,
  t,
}) {
  const fullName = profile.full_name || 'Jan Novák';
  const isDefaultSvgAvatar = !avatarSrc || avatarSrc.startsWith('data:image/svg+xml');

  const primaryStackStr =
    typeof profile.primary_stack === 'string' && profile.primary_stack.trim() !== ''
      ? profile.primary_stack
      : 'Figma UX/UI, TypeScript & ES6+, React 18 (.tsx), PHP 8 & MySQL, C# .NET Core';

  const stackItems = primaryStackStr
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const visibleSocials = (socials || []).filter(
    (s) => s && typeof s.url === 'string' && s.url.trim() !== '' && s.url.trim() !== '#'
  );

  const sectionBoxStyle = {
    border: '1px solid #d5e0ec',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    marginBottom: '24px',
    overflow: 'hidden',
  };

  const sectionHeaderStyle = {
    backgroundColor: '#eef4fa',
    borderBottom: '1px solid #d5e0ec',
    padding: '10px 18px',
    fontSize: '12.5px',
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.01em',
  };

  const sectionBodyStyle = {
    padding: '16px 18px',
    backgroundColor: '#ffffff',
  };

  const iconWrapStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: '6px',
    lineHeight: 1,
  };

  return (
    React.createElement("div", { id: "coolcv-pdf-sheet", style: {
        width: '760px',
        backgroundColor: '#ffffff',
        color: '#1e293b',
        fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
        boxSizing: 'border-box',
        padding: '36px 40px',
        lineHeight: 1.5,
      } }, React.createElement("table", { style: {
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          marginBottom: '22px',
        } }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", { style: { width: '58%', verticalAlign: 'middle', paddingRight: '16px' } }, React.createElement("table", { style: { borderCollapse: 'collapse' } }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", { style: { verticalAlign: 'middle', paddingRight: '16px' } }, React.createElement("div", { style: {
                          width: '64px',
                          height: '64px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#162238',
                        } }, isDefaultSvgAvatar ? (
                          React.createElement("svg", { viewBox: "0 0 120 120", style: { width: '64px', height: '64px', display: 'block' } }, React.createElement("rect", { width: "120", height: "120", fill: "#162238" }), React.createElement("circle", { cx: "60", cy: "44", r: "20", fill: "#94a3b8" }), React.createElement("path", { d: "M24 108 C24 80 96 80 96 108", fill: "#94a3b8" }))
                        ) : (
                          React.createElement("img", { src: avatarSrc, alt: fullName, style: {
                              width: '64px',
                              height: '64px',
                              objectFit: 'cover',
                              objectPosition: 'top center',
                              display: 'block',
                            } })
                        ))), React.createElement("td", { style: { verticalAlign: 'middle' } }, React.createElement("div", { style: {
                          fontSize: '22px',
                          fontWeight: 800,
                          color: '#0f172a',
                          letterSpacing: '-0.02em',
                          lineHeight: 1.15,
                        } }, fullName), React.createElement("div", { style: {
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color: '#64748b',
                          marginTop: '4px',
                        } }, field(profile, 'subtitle'))))))), React.createElement("td", { style: {
                width: '42%',
                verticalAlign: 'middle',
                textAlign: 'right',
                fontSize: '10.5px',
                lineHeight: 1.65,
                color: '#334155',
              } }, visibleSocials.slice(0, 1).map((soc) => (
                React.createElement("div", { key: soc.id, style: { fontWeight: 700, color: '#0284c7' } }, React.createElement("span", { style: iconWrapStyle }, React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "#0284c7", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("circle", { cx: "12", cy: "12", r: "10" }), React.createElement("line", { x1: "2", y1: "12", x2: "22", y2: "12" }), React.createElement("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" }))), React.createElement("span", null, soc.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')))
              )), React.createElement("div", { style: { fontWeight: 700, color: '#0f172a' } }, React.createElement("span", { style: iconWrapStyle }, React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "#0284c7", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }))), React.createElement("span", null, profile.phone || '+420 777 123 456')), React.createElement("div", null, React.createElement("span", { style: iconWrapStyle }, React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "#0284c7", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), React.createElement("polyline", { points: "22,6 12,13 2,6" }))), React.createElement("span", null, profile.email || 'jan.novak@example.cz')), React.createElement("div", { style: { color: '#64748b' } }, React.createElement("span", { style: iconWrapStyle }, React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "#64748b", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), React.createElement("circle", { cx: "12", cy: "10", r: "3" }))), React.createElement("span", null, field(profile, 'location') || 'Praha / Remote')))))), React.createElement("div", { style: { marginBottom: '26px' }, className: "pdf-avoid-break" }, React.createElement("div", { style: {
            backgroundColor: '#162238',
            color: '#ffffff',
            borderRadius: '4px',
            padding: '16px 20px',
            marginBottom: '14px',
          } }, React.createElement("div", { style: {
              fontSize: '9.5px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#93c5fd',
              marginBottom: '4px',
            } }, field(profile, 'subtitle')), React.createElement("div", { style: {
              fontSize: '15px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.35,
            } }, React.createElement("span", null, t('tagline_1')), React.createElement("span", { style: { color: '#f59e0b' } }, t('tagline_highlight')))), React.createElement("p", { style: {
            fontSize: '10.8px',
            lineHeight: 1.65,
            color: '#334155',
            margin: '0 0 10px 0',
          } }, field(profile, 'bio')), stackItems.length > 0 && (
          React.createElement("div", { style: {
              fontSize: '10.2px',
              lineHeight: 1.55,
              color: '#1e293b',
            } }, React.createElement("strong", { style: { color: '#0f172a' } }, lang === 'cs' ? 'Hlavní technologický stack: ' : 'Core Tech Stack: '), React.createElement("span", { style: { color: '#334155' } }, stackItems.join(' • ')))
        )), React.createElement("div", { style: sectionBoxStyle }, React.createElement("div", { style: sectionHeaderStyle }, React.createElement("span", { style: iconWrapStyle }, React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "#0284c7", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }), React.createElement("polyline", { points: "2 17 12 22 22 17" }), React.createElement("polyline", { points: "2 12 12 17 22 12" }))), React.createElement("span", null, t('services_title'))), React.createElement("div", { style: sectionBodyStyle }, roles.map((role, idx) => (
            React.createElement("div", { key: role.slug, className: "pdf-avoid-break", style: {
                marginBottom: idx === roles.length - 1 ? '0' : '14px',
                paddingBottom: idx === roles.length - 1 ? '0' : '12px',
                borderBottom: idx === roles.length - 1 ? 'none' : '1px solid #f1f5f9',
              } }, React.createElement("table", { style: { width: '100%', borderCollapse: 'collapse' } }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", { style: {
                        fontSize: '11.2px',
                        fontWeight: 800,
                        color: '#0f172a',
                        verticalAlign: 'baseline',
                      } }, field(role, 'title')), React.createElement("td", { style: {
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#64748b',
                        textAlign: 'right',
                        verticalAlign: 'baseline',
                      } }, field(role, 'level'), " • ", role.badge_code)))), React.createElement("p", { style: {
                  fontSize: '10.3px',
                  lineHeight: 1.55,
                  color: '#334155',
                  margin: '3px 0 0 0',
                } }, field(role, 'summary')))
          )))), React.createElement("div", { style: sectionBoxStyle, className: "pdf-avoid-break" }, React.createElement("div", { style: sectionHeaderStyle }, React.createElement("span", { style: iconWrapStyle }, React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "#0284c7", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("polyline", { points: "16 18 22 12 16 6" }), React.createElement("polyline", { points: "8 6 2 12 8 18" }))), React.createElement("span", null, t('skills_heading'))), React.createElement("div", { style: sectionBodyStyle }, skills.map((skill, idx) => {
            const formattedTags = (skill.tags || '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
              .join(' • ');
            return (
              React.createElement("div", { key: skill.id, style: {
                  fontSize: '10.4px',
                  lineHeight: 1.55,
                  color: '#334155',
                  marginBottom: idx === skills.length - 1 ? '0' : '8px',
                } }, React.createElement("strong", { style: { color: '#0f172a' } }, field(skill, 'name'), " (", skill.proficiency, " %):"), ' ', React.createElement("span", null, formattedTags), React.createElement("span", { style: { color: '#64748b', fontSize: '9.5px' } }, ' ', "[", roleMap[skill.role_slug]?.badge_code || skill.role_slug, "]"))
            );
          }))), React.createElement("div", { style: sectionBoxStyle }, React.createElement("div", { style: sectionHeaderStyle }, React.createElement("span", { style: iconWrapStyle }, React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "#0284c7", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("rect", { x: "2", y: "7", width: "20", height: "14", rx: "2", ry: "2" }), React.createElement("path", { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }))), React.createElement("span", null, t('exp_heading'))), React.createElement("div", { style: sectionBodyStyle }, experience.map((exp, idx) => (
            React.createElement("div", { key: exp.id, className: "pdf-avoid-break", style: {
                marginBottom: idx === experience.length - 1 ? '0' : '15px',
                paddingBottom: idx === experience.length - 1 ? '0' : '13px',
                borderBottom: idx === experience.length - 1 ? 'none' : '1px solid #f1f5f9',
              } }, React.createElement("table", { style: { width: '100%', borderCollapse: 'collapse' } }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", { style: {
                        fontSize: '11.2px',
                        fontWeight: 800,
                        color: '#0f172a',
                        verticalAlign: 'baseline',
                      } }, React.createElement("span", null, field(exp, 'role')), React.createElement("span", { style: { color: '#0284c7', fontWeight: 700 } }, " — ", exp.company)), React.createElement("td", { style: {
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#64748b',
                        textAlign: 'right',
                        verticalAlign: 'baseline',
                        whiteSpace: 'nowrap',
                      } }, field(exp, 'period'))))), React.createElement("p", { style: {
                  fontSize: '10.3px',
                  lineHeight: 1.55,
                  color: '#334155',
                  margin: '4px 0 0 0',
                } }, field(exp, 'description')))
          )))), React.createElement("div", { style: sectionBoxStyle, className: "pdf-avoid-break" }, React.createElement("div", { style: sectionHeaderStyle }, React.createElement("span", { style: iconWrapStyle }, React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "#0284c7", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M22 10v6M2 10l10-5 10 5-10 5z" }), React.createElement("path", { d: "M6 12v5c3 3 9 3 12 0v-5" }))), React.createElement("span", null, t('edu_heading'))), React.createElement("div", { style: sectionBodyStyle }, React.createElement("table", { style: { width: '100%', borderCollapse: 'collapse' } }, React.createElement("thead", null, React.createElement("tr", { style: { borderBottom: '1px solid #e2e8f0' } }, React.createElement("th", { style: {
                    textAlign: 'left',
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    paddingBottom: '7px',
                    width: '22%',
                  } }, lang === 'cs' ? 'Období' : 'Period'), React.createElement("th", { style: {
                    textAlign: 'left',
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    paddingBottom: '7px',
                    width: '46%',
                  } }, lang === 'cs' ? 'Obor / Certifikace' : 'Degree / Certification'), React.createElement("th", { style: {
                    textAlign: 'right',
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    paddingBottom: '7px',
                    width: '32%',
                  } }, lang === 'cs' ? 'Instituce' : 'Institution'))), React.createElement("tbody", null, education.map((edu, idx) => (
                React.createElement("tr", { key: edu.id, style: {
                    borderBottom: idx === education.length - 1 ? 'none' : '1px solid #f1f5f9',
                  } }, React.createElement("td", { style: {
                      padding: '9px 8px 9px 0',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#475569',
                      verticalAlign: 'top',
                    } }, edu.period), React.createElement("td", { style: {
                      padding: '9px 8px',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: '#0f172a',
                      verticalAlign: 'top',
                    } }, field(edu, 'title')), React.createElement("td", { style: {
                      padding: '9px 0 9px 8px',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#0284c7',
                      textAlign: 'right',
                      verticalAlign: 'top',
                    } }, field(edu, 'institution')))
              )))))), React.createElement("div", { style: { ...sectionBoxStyle, marginBottom: '22px' } }, React.createElement("div", { style: sectionHeaderStyle }, React.createElement("span", { style: iconWrapStyle }, React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "#0284c7", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("rect", { x: "3", y: "3", width: "7", height: "7" }), React.createElement("rect", { x: "14", y: "3", width: "7", height: "7" }), React.createElement("rect", { x: "14", y: "14", width: "7", height: "7" }), React.createElement("rect", { x: "3", y: "14", width: "7", height: "7" }))), React.createElement("span", null, t('projects_title'))), React.createElement("div", { style: sectionBodyStyle }, projects.map((proj, idx) => (
            React.createElement("div", { key: proj.id, className: "pdf-avoid-break", style: {
                marginBottom: idx === projects.length - 1 ? '0' : '15px',
                paddingBottom: idx === projects.length - 1 ? '0' : '13px',
                borderBottom: idx === projects.length - 1 ? 'none' : '1px solid #f1f5f9',
              } }, React.createElement("table", { style: { width: '100%', borderCollapse: 'collapse' } }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", { style: {
                        fontSize: '11.2px',
                        fontWeight: 800,
                        color: '#0f172a',
                        verticalAlign: 'baseline',
                      } }, React.createElement("span", null, field(proj, 'title')), React.createElement("span", { style: { color: '#0284c7', fontWeight: 600, fontSize: '10.3px' } }, ' ', "— ", field(proj, 'subtitle'))), React.createElement("td", { style: {
                        fontSize: '9.5px',
                        fontWeight: 600,
                        color: '#64748b',
                        textAlign: 'right',
                        verticalAlign: 'baseline',
                      } }, (proj.tags || '')
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .join(' • '))))), React.createElement("p", { style: {
                  fontSize: '10.3px',
                  lineHeight: 1.55,
                  color: '#334155',
                  margin: '4px 0 0 0',
                } }, field(proj, 'description')))
          )))), React.createElement("div", { className: "pdf-avoid-break", style: {
          paddingTop: '14px',
          borderTop: '1px solid #d5e0ec',
          textAlign: 'center',
          fontSize: '9.8px',
          color: '#475569',
        } }, React.createElement("div", { style: { fontWeight: 700, color: '#0f172a', marginBottom: '4px' } }, React.createElement("span", null, fullName), React.createElement("span", null, "  |  ", profile.phone || '+420 777 123 456'), React.createElement("span", null, "  |  ", profile.email || 'jan.novak@example.cz'), React.createElement("span", null, "  |  ", field(profile, 'location') || 'Praha / Remote')), visibleSocials.length > 0 && (
          React.createElement("div", { style: { fontSize: '9.2px', color: '#0284c7', fontWeight: 600 } }, visibleSocials.map((soc, i) => (
              React.createElement("span", { key: soc.id }, i > 0 ? '   •   ' : '', soc.label, ": ", soc.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))
            )))
        )))
  );
}


  // --- src/components/Backoffice.tsx ---








const BRAND_SVG_PRESETS = [
  {
    label: 'GitHub SVG',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>',
  },
  {
    label: 'LinkedIn SVG',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>',
  },
  {
    label: 'X / Twitter SVG',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  },
  {
    label: 'Instagram SVG',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>',
  },
  {
    label: 'YouTube SVG',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>',
  },
  {
    label: 'Discord SVG',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/></svg>',
  },
];

const MATERIAL_ICON_PRESETS = [
  'language',
  'mail',
  'code',
  'work',
  'share',
  'rocket_launch',
  'dns',
  'terminal',
  'draw',
  'deployed_code',
];

// Backoffice admin panel for manage CV content, socials, role pillars, photo and system
function Backoffice({
  cvData,
  setCvData,
  setJwtToken,
  authUser,
  setAuthUser,
  cryptoReport,
  setCryptoReport,
  callApi,
  showToast,
  apiLogs,
  onTriggerPhotoUpload,
  isUploadingPhoto = false,
  photoUploadProgress = 0,
  onCloseModal,
  onLoginSuccess,
  avatarSrc,
  surfaceCard,
  innerCard,
  mutedText,
  secondaryText,
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState(cvData.profile || ({}));
  const [editingItem, setEditingItem] = useState(null);
  const [needsSetup, setNeedsSetup] = useState(Boolean(cvData.needs_setup));

  useEffect(() => {
    if (cvData.profile && Object.keys(cvData.profile).length > 0) {
      setProfileForm(cvData.profile);
    }
  }, [cvData.profile]);

  const roles = cvData.roles || [];
  const roleMap = useMemo(() => {
    const m = {};
    roles.forEach((r) => {
      m[r.slug] = r;
    });
    return m;
  }, [roles]);

  useEffect(() => {
    setProfileForm(cvData.profile || ({}));
    if (cvData.needs_setup !== undefined) {
      setNeedsSetup(Boolean(cvData.needs_setup));
    }
  }, [cvData.profile, cvData.needs_setup]);

  useEffect(() => {
    (async () => {
      const statusRes = await callApi('auth/setup-status', 'GET');
      if (statusRes.ok && typeof statusRes.data?.needs_setup === 'boolean') {
        setNeedsSetup(statusRes.data.needs_setup);
        setCvData((prev) => ({ ...prev, needs_setup: statusRes.data.needs_setup }));
      }
    })();
  }, []);

  async function handleInitialSetup(e) {
    e.preventDefault();
    if (password !== passwordConfirm) {
      showToast('Zadaná hesla se neshodují.', true);
      return;
    }
    if (password.length < 6) {
      showToast('Heslo musí mít alespoň 6 znaků.', true);
      return;
    }
    const res = await callApi('auth/setup', 'POST', {
      username,
      password,
      display_name: displayName || username,
    });
    if (res.ok && res.data?.data?.access_token) {
      const d = res.data.data;
      setJwtToken(d.access_token);
      localStorage.setItem('coolcv_jwt_token', d.access_token);
      setAuthUser(d.user);
      setCryptoReport(d.backend_crypto);
      setNeedsSetup(false);
      setCvData((prev) => ({ ...prev, needs_setup: false }));
      setPassword('');
      setPasswordConfirm('');
      showToast('Administrátorský účet byl vytvořen a přihlášen!');
      onLoginSuccess();
    } else {
      showToast(res.data?.error || 'Vytvoření účtu selhalo.', true);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const res = await callApi('auth/login', 'POST', { username, password });
    if (res.ok && res.data?.data?.access_token) {
      const d = res.data.data;
      setJwtToken(d.access_token);
      localStorage.setItem('coolcv_jwt_token', d.access_token);
      setAuthUser(d.user);
      setCryptoReport(d.backend_crypto);
      setPassword('');
      showToast('Přihlášení do Backoffice proběhlo úspěšně!');
      onLoginSuccess();
    } else {
      if (res.data?.needs_setup) {
        setNeedsSetup(true);
        setCvData((prev) => ({ ...prev, needs_setup: true }));
      }
      showToast(res.data?.error || 'Přihlášení selhalo.', true);
    }
  }

  async function handleLogout() {
    await callApi('auth/logout', 'POST');
    setJwtToken('');
    setAuthUser(null);
    setCryptoReport(null);
    localStorage.removeItem('coolcv_jwt_token');
    onCloseModal();
    showToast('Odhlášeno.');
  }

  async function reloadCv() {
    const res = await callApi('cv', 'GET');
    if (res.ok && res.data?.data) {
      setCvData(res.data.data);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    const res = await callApi('profile', 'PUT', profileForm);
    if (res.ok) {
      showToast('Osobní profil byl uložen.');
      await reloadCv();
    } else {
      showToast(res.data?.error || 'Uložení selhalo.', true);
    }
  }

  async function handleSaveEntity(entity, e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const payload = Object.fromEntries(formData.entries());
    const id = Number(payload.id || editingItem?.id || 0);
    if (id > 0) {
      payload.id = id;
    } else {
      delete payload.id;
    }
    const method = id > 0 ? 'PUT' : 'POST';
    const route = id > 0 ? `${entity}&id=${id}` : entity;

    const res = await callApi(route, method, payload);
    if (res.ok) {
      showToast(id > 0 ? `Záznam #${id} byl aktualizován.` : 'Nová položka byla vytvořena.');
      setEditingItem(null);
      await reloadCv();
      return true;
    } else {
      showToast(res.data?.error || 'Chyba při ukládání.', true);
      return false;
    }
  }

  async function handleDeleteEntity(entity, id) {
    const res = await callApi(`${entity}&id=${id}`, 'DELETE');
    if (res.ok) {
      showToast(`Záznam #${id} byl smazán.`);
      await reloadCv();
    } else {
      showToast(res.data?.error || 'Chyba při mazání.', true);
    }
  }

  async function handleReorderEntity(entity, reorderedItems) {
    const normalized = reorderedItems.map((it, idx) => ({
      ...it,
      sort_order: idx + 1,
    }));
    setCvData((prev) => ({
      ...prev,
      [entity]: normalized,
    }));

    const orderedIds = normalized.map((it) => Number(it.id));
    const res = await callApi(`${entity}/reorder`, 'POST', {
      action: 'reorder',
      ordered_ids: orderedIds,
    });

    if (res.ok) {
      if (Array.isArray(res.data?.data)) {
        setCvData((prev) => ({
          ...prev,
          [entity]: res.data.data,
        }));
      }
      showToast('Pořadí položek bylo uloženo.');
    } else {
      showToast(res.data?.error || 'Uložení pořadí selhalo.', true);
      await reloadCv();
    }
  }

  // Backoffice navigation tabs with Material Symbols icons
  const tabs = [
    { id: 'profile', icon: 'person', label: 'Osobní profil & Fotka' },
    { id: 'sections', icon: 'edit_note', label: 'Texty sekcí & Titulky' },
    { id: 'socials', icon: 'share', label: `Profily & Sítě (${(cvData.socials || []).length})` },
    { id: 'roles', icon: 'category', label: `Pilíře & Filtry (${(cvData.roles || []).length})` },
    { id: 'skills', icon: 'auto_awesome', label: `Dovednosti (${(cvData.skills || []).length})` },
    { id: 'experience', icon: 'work_history', label: `Zkušenosti (${(cvData.experience || []).length})` },
    { id: 'projects', icon: 'folder_open', label: `Projekty (${(cvData.projects || []).length})` },
    { id: 'education', icon: 'school', label: `Vzdělání (${(cvData.education || []).length})` },
    { id: 'system', icon: 'dns', label: 'Systém' },
  ];

  const profileFields = [
    ['full_name', 'Celé jméno'],
    ['years_exp_badge', 'Odznak let praxe (např. 5+)'],
    ['subtitle_cs', 'Pozice / Podtitul (CZ)'],
    ['subtitle_en', 'Position / Subtitle (EN)'],
    ['email', 'E-mail'],
    ['phone', 'Telefon'],
    ['location_cs', 'Místo konání práce (CZ)'],
    ['location_en', 'Location (EN)'],
    ['availability_cs', 'Dostupnost (CZ)'],
    ['availability_en', 'Availability (EN)'],
    ['website', 'Web / Portfolio URL'],
    ['primary_stack', 'Hlavní technologický stack (oddělený čárkou)'],
  ];

  const sectionTextGroups = [
    {
      groupTitle: '1. Úvodní Hero sekce & Hlavní stack',
      icon: 'home',
      keys: [
        ['tagline_1', 'Hlavní slogan – 1. část'],
        ['tagline_highlight', 'Hlavní slogan – zvýrazněné slovo'],
        ['cta_work', 'Text tlačítka pod bio'],
        ['years_exp', 'Popisek u odznaku let praxe'],
        ['trusted_tech', 'Nadpis boxu Hlavní technologický stack & nástroje'],
      ],
    },
    {
      groupTitle: '2. Sekce Hlavní pilíře (Služby & Role)',
      icon: 'design_services',
      keys: [
        ['services_title', 'Hlavní titulek sekce pilířů'],
        ['services_sub', 'Podtitulek / popis sekce pilířů'],
        ['filter_all', 'Text tlačítka filtru „Všechny obory“'],
      ],
    },
    {
      groupTitle: '3. Sekce Strukturovaný životopis (Praxe, Vzdělání & Dovednosti)',
      icon: 'description',
      keys: [
        ['resume_title', 'Hlavní titulek sekce životopisu'],
        ['resume_sub', 'Podtitulek / popis sekce životopisu'],
        ['exp_heading', 'Nadpis bloku Pracovní zkušenosti'],
        ['edu_heading', 'Nadpis bloku Vzdělání & Certifikace'],
        ['skills_heading', 'Nadpis bloku Technické & UX Dovednosti'],
      ],
    },
    {
      groupTitle: '4. Sekce Vybrané projekty & Statistiky',
      icon: 'folder_open',
      keys: [
        ['projects_title', 'Hlavní titulek sekce projektů'],
        ['projects_sub', 'Podtitulek / popis sekce projektů'],
        ['stat_1_num', 'Statistika 1 – číslo / hodnota (např. 80+)'],
        ['stat_1', 'Statistika 1 – popisek'],
        ['stat_2_num', 'Statistika 2 – číslo / hodnota (např. 120+)'],
        ['stat_2', 'Statistika 2 – popisek'],
        ['stat_3_num', 'Statistika 3 – číslo / hodnota (např. 5+)'],
        ['stat_3', 'Statistika 3 – popisek'],
        ['stat_4_num', 'Statistika 4 – číslo / hodnota (např. 4 v 1)'],
        ['stat_4', 'Statistika 4 – popisek'],
      ],
    },
    {
      groupTitle: '5. Boční menu & Akční tlačítka',
      icon: 'menu',
      keys: [
        ['nav_home', 'Menu: Úvod'],
        ['nav_pillars', 'Menu: Služby & Role'],
        ['nav_resume', 'Menu: Strukturované CV'],
        ['nav_portfolio', 'Menu: Projekty'],
        ['hire_me', 'Tlačítko: Napsat zprávu'],
        ['download_cv', 'Tlačítko: Stáhnout CV'],
      ],
    },
  ];

  if (!authUser) {
    return (
      React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md no-print" }, React.createElement("div", { className: `relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl ${surfaceCard}` }, needsSetup ? (
            React.createElement("form", { onSubmit: handleInitialSetup, className: "flex flex-col flex-1 min-h-0 overflow-hidden", autoComplete: "off" }, React.createElement("div", { className: "shrink-0 px-7 pt-6 pb-5 sm:px-9 sm:pt-7 sm:pb-5 border-b border-white/[0.08] flex items-start justify-between gap-4" }, React.createElement("div", { className: "space-y-1.5" }, React.createElement("div", { className: "flex items-center gap-2.5 text-emerald-400 font-mono text-xs font-bold" }, React.createElement(Icon, { name: "person_add", className: "text-xl" }), React.createElement("span", null, "PRVNÍ SPUŠTĚNÍ • NASTAVENÍ ÚČTU")), React.createElement("h2", { className: "text-2xl font-extrabold" }, "Vytvoření administrátorského účtu"), React.createElement("p", { className: `text-xs sm:text-sm leading-relaxed ${secondaryText}` }, "V databázi zatím neexistuje žádný administrátorský účet. Zvolte si své přihlašovací jméno a heslo.")), React.createElement("button", { type: "button", onClick: onCloseModal, className: `shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${innerCard}`, title: "Zavřít" }, React.createElement(Icon, { name: "close", className: "text-lg" }))), React.createElement("div", { className: "flex-1 min-h-0 overflow-y-auto px-7 py-6 sm:px-9 sm:py-6 space-y-4" }, React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold uppercase mb-2" }, "Zobrazované jméno"), React.createElement("input", { type: "text", value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: "např. Jan Novák", className: "w-full px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold" })), React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold uppercase mb-2" }, "Uživatelské jméno (min. 3 znaky)"), React.createElement("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Zvolte uživatelské jméno", className: "w-full px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold", required: true })), React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold uppercase mb-2" }, "Heslo (min. 6 znaků)"), React.createElement("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Zvolte silné heslo", className: "w-full px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold", required: true })), React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold uppercase mb-2" }, "Potvrzení hesla"), React.createElement("input", { type: "password", value: passwordConfirm, onChange: (e) => setPasswordConfirm(e.target.value), placeholder: "Zopakujte heslo", className: "w-full px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold", required: true })))), React.createElement("div", { className: "shrink-0 px-7 py-4 sm:px-9 sm:py-5 border-t border-white/[0.08] flex items-center justify-end gap-3" }, React.createElement("button", { type: "button", onClick: onCloseModal, className: `px-5 py-3.5 rounded-2xl font-bold text-xs ${innerCard}` }, "Zrušit"), React.createElement("button", { type: "submit", className: "px-6 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 shadow-xl flex items-center gap-2" }, React.createElement(Icon, { name: "verified_user", className: "text-base" }), React.createElement("span", null, "Vytvořit účet & Přihlásit"))))
          ) : (
            React.createElement("form", { onSubmit: handleLogin, className: "flex flex-col flex-1 min-h-0 overflow-hidden", autoComplete: "on" }, React.createElement("div", { className: "shrink-0 px-7 pt-6 pb-5 sm:px-9 sm:pt-7 sm:pb-5 border-b border-white/[0.08] flex items-start justify-between gap-4" }, React.createElement("div", { className: "space-y-1.5" }, React.createElement("div", { className: "flex items-center gap-2.5 text-purple-400 font-mono text-xs font-bold" }, React.createElement(Icon, { name: "lock", className: "text-xl" }), React.createElement("span", null, "AUTORIZACE DO BACKOFFICE")), React.createElement("h2", { className: "text-2xl font-extrabold" }, "Přihlášení do Backoffice"), React.createElement("p", { className: `text-xs sm:text-sm leading-relaxed ${secondaryText}` }, "Zadejte své přihlašovací údaje pro přístup ke správě životopisu a projektů.")), React.createElement("button", { type: "button", onClick: onCloseModal, className: `shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${innerCard}`, title: "Zavřít" }, React.createElement(Icon, { name: "close", className: "text-lg" }))), React.createElement("div", { className: "flex-1 min-h-0 overflow-y-auto px-7 py-6 sm:px-9 sm:py-6 space-y-4" }, React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold uppercase mb-2" }, "Uživatelské jméno"), React.createElement("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Zadejte uživatelské jméno", className: "w-full px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold", required: true })), React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold uppercase mb-2" }, "Heslo"), React.createElement("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Zadejte heslo", className: "w-full px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold", required: true }))), React.createElement("div", { className: "shrink-0 px-7 py-4 sm:px-9 sm:py-5 border-t border-white/[0.08] flex items-center justify-end gap-3" }, React.createElement("button", { type: "button", onClick: onCloseModal, className: `px-5 py-3.5 rounded-2xl font-bold text-xs ${innerCard}` }, "Zrušit"), React.createElement("button", { type: "submit", className: "px-6 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 shadow-xl flex items-center gap-2" }, React.createElement(Icon, { name: "login", className: "text-base" }), React.createElement("span", null, "Přihlásit se"))))
          )))
    );
  }

  return (
    React.createElement("div", { className: "space-y-10" }, React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.07]" }, React.createElement("div", { className: "space-y-1" }, React.createElement("div", { className: "text-xs font-bold tracking-[0.2em] uppercase text-fuchsia-400" }, "BACKOFFICE ADMINISTRACE"), React.createElement("h1", { className: "text-2xl sm:text-3xl font-extrabold" }, "Správa obsahu CV, sociálních sítí, pilířů a systému")), React.createElement("div", { className: "flex items-center gap-3" }, React.createElement("button", { type: "button", onClick: handleLogout, className: "px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-2" }, React.createElement(Icon, { name: "logout", className: "text-base" }), React.createElement("span", null, "Odhlásit (", authUser.display_name || authUser.username, ")")))), React.createElement("div", { className: "space-y-8" }, React.createElement("div", { className: "flex flex-wrap gap-2.5" }, tabs.map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              React.createElement("button", { key: tab.id, type: "button", onClick: () => {
                  setActiveTab(tab.id);
                  setEditingItem(null);
                }, className: `px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isTabActive
                    ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-lg'
                    : innerCard
                }` }, React.createElement(Icon, { name: tab.icon, className: "text-lg" }), React.createElement("span", null, tab.label))
            );
          })), activeTab === 'profile' && (
          React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" }, React.createElement("div", { className: `lg:col-span-4 rounded-3xl p-7 text-center space-y-5 ${innerCard}` }, React.createElement("div", { className: "relative w-44 h-44 mx-auto flex items-center justify-center" }, isUploadingPhoto && (
                  React.createElement("svg", { className: "absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20", viewBox: "0 0 120 120" }, React.createElement("defs", null, React.createElement("linearGradient", { id: "boAvatarProgressGrad", x1: "0%", y1: "0%", x2: "100%", y2: "100%" }, React.createElement("stop", { offset: "0%", stopColor: "#ec4899" }), React.createElement("stop", { offset: "50%", stopColor: "#a855f7" }), React.createElement("stop", { offset: "100%", stopColor: "#6366f1" }))), React.createElement("circle", { cx: "60", cy: "60", r: "56", fill: "none", stroke: "rgba(168, 85, 247, 0.2)", strokeWidth: "5" }), React.createElement("circle", { cx: "60", cy: "60", r: "56", fill: "none", stroke: "url(#boAvatarProgressGrad)", strokeWidth: "5", strokeLinecap: "round", strokeDasharray: "351.86", strokeDashoffset: 351.86 - (351.86 * Math.min(100, Math.max(0, photoUploadProgress))) / 100, className: "transition-all duration-100 ease-out" }))
                ), React.createElement("div", { className: `relative w-40 h-40 rounded-full overflow-hidden border-4 bg-[#151828] transition-all ${
                    isUploadingPhoto ? 'border-transparent' : 'border-purple-500/40'
                  }` }, React.createElement("img", { src: avatarSrc, alt: "Avatar", className: "w-full h-full object-cover" }), isUploadingPhoto && (
                    React.createElement("div", { className: "absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2" }, React.createElement("div", { className: "flex items-center gap-1.5" }, React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-bounce", style: { animationDelay: '0ms' } }), React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce", style: { animationDelay: '150ms' } }), React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce", style: { animationDelay: '300ms' } })), React.createElement("span", { className: "text-xs font-extrabold font-mono text-white tracking-wider" }, `${Math.round(photoUploadProgress)}%`))
                  ))), React.createElement("div", null, React.createElement("h3", { className: "font-extrabold text-base" }, "Profilová fotografie"), React.createElement("p", { className: `text-xs mt-1 ${mutedText}` }, "Automatická komprese v prohlížeči (HTML5 Canvas) + uložení přes REST API.")), React.createElement("button", { type: "button", onClick: onTriggerPhotoUpload, disabled: isUploadingPhoto, className: "w-full py-3.5 px-5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 to-indigo-500 shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 transition-all" }, React.createElement(Icon, { name: "cloud_upload", className: "text-base" }), React.createElement("span", null, isUploadingPhoto
                    ? `Nahrávám fotku (${Math.round(photoUploadProgress)} %)...`
                    : 'Vybrat a nahrát novou fotku'))), React.createElement("form", { onSubmit: handleSaveProfile, className: `lg:col-span-8 rounded-3xl p-7 sm:p-8 space-y-5 ${innerCard}` }, React.createElement("h3", { className: "text-lg font-extrabold flex items-center gap-2" }, React.createElement(Icon, { name: "badge", className: "text-purple-400" }), React.createElement("span", null, "Úprava osobního profilu a kontaktů")), React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, profileFields.map(([key, label]) => (
                  React.createElement("div", { key: key }, React.createElement("label", { className: "block text-xs font-bold mb-1.5 text-slate-400" }, label), React.createElement("input", { type: "text", value: profileForm[key] || '', onChange: (e) => setProfileForm((prev) => ({ ...prev, [key]: e.target.value })), className: "w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-medium" }))
                ))), React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold mb-1.5 text-slate-400" }, "Osobní bio (CZ)"), React.createElement("textarea", { rows: 3, value: profileForm.bio_cs || '', onChange: (e) => setProfileForm((prev) => ({ ...prev, bio_cs: e.target.value })), className: "w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-medium" })), React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold mb-1.5 text-slate-400" }, "Personal Bio (EN)"), React.createElement("textarea", { rows: 3, value: profileForm.bio_en || '', onChange: (e) => setProfileForm((prev) => ({ ...prev, bio_en: e.target.value })), className: "w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-medium" })), React.createElement("button", { type: "submit", className: "px-7 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 to-indigo-500 shadow-lg flex items-center gap-2" }, React.createElement(Icon, { name: "save", className: "text-base" }), React.createElement("span", null, "Uložit změny profilu"))))
        ), activeTab === 'sections' && (
          React.createElement("form", { onSubmit: handleSaveProfile, className: "space-y-6" }, React.createElement("div", { className: "flex items-center justify-between gap-4" }, React.createElement("div", { className: "min-w-0 flex-1" }, React.createElement("h2", { className: "text-xl font-extrabold flex items-center gap-2" }, React.createElement(Icon, { name: "edit_note", className: "text-purple-400" }), React.createElement("span", null, "Texty sekcí, titulky a podtitulky (CZ / EN)")), React.createElement("p", { className: `text-xs mt-1 leading-relaxed ${mutedText}` }, "Zde můžete upravit nadpisy, štítky, titulky a podtitulky všech sekcí na webu i v generovaném PDF životopisu.")), React.createElement("button", { type: "submit", className: "shrink-0 whitespace-nowrap px-6 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg flex items-center gap-2" }, React.createElement(Icon, { name: "save", className: "text-base" }), React.createElement("span", null, "Uložit texty"))), sectionTextGroups.map((group, gIdx) => (
              React.createElement("div", { key: gIdx, className: `rounded-3xl p-6 sm:p-8 space-y-5 ${innerCard}` }, React.createElement("h3", { className: "text-base font-extrabold flex items-center gap-2.5 border-b border-white/10 pb-3" }, React.createElement(Icon, { name: group.icon, className: "text-xl text-purple-400" }), React.createElement("span", null, group.groupTitle)), React.createElement("div", { className: "space-y-4" }, group.keys.map(([tKey, label]) => {
                    const statNumMatch = tKey.match(/^stat_([1-4])_num$/);
                    if (statNumMatch) {
                      const statIdx = Number(statNumMatch[1]);
                      const defaultStatIcons = [
                        'sentiment_satisfied',
                        'folder_open',
                        'local_cafe',
                        'emoji_events',
                      ];
                      const statIconPresets = [
                        'sentiment_satisfied',
                        'folder_open',
                        'local_cafe',
                        'emoji_events',
                        'rocket_launch',
                        'verified',
                        'bolt',
                        'code',
                        'workspace_premium',
                        'trending_up',
                        'groups',
                        'star',
                        'schedule',
                        'auto_awesome',
                      ];
                      const csField = `ui_${tKey}_cs`;
                      const enField = `ui_${tKey}_en`;
                      const iconField = `ui_stat_${statIdx}_icon`;
                      const currentNum =
                        profileForm[csField] !== undefined && profileForm[csField] !== ''
                          ? String(profileForm[csField])
                          : profileForm[enField] !== undefined && profileForm[enField] !== ''
                          ? String(profileForm[enField])
                          : UI_TEXT.cs[tKey] || '';
                      const currentIcon =
                        profileForm[iconField] !== undefined &&
                        String(profileForm[iconField]).trim() !== ''
                          ? String(profileForm[iconField]).trim()
                          : defaultStatIcons[statIdx - 1];

                      return (
                        React.createElement("div", { key: tKey, className: "p-4 rounded-2xl bg-black/25 border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-4" }, React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold mb-1.5 text-purple-300" }, label), React.createElement("input", { type: "text", value: currentNum, onChange: (e) => {
                                const val = e.target.value;
                                setProfileForm((prev) => ({
                                  ...prev,
                                  [csField]: val,
                                  [enField]: val,
                                }));
                              }, className: "w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-extrabold" })), React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold mb-1.5 text-slate-400" }, `Statistika ${statIdx} – ikona (Material Symbol)`), React.createElement("div", { className: "flex items-center gap-2.5" }, React.createElement("div", { className: "w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0" }, React.createElement(Icon, { name: currentIcon, className: "text-xl text-purple-300" })), React.createElement("input", { type: "text", value: currentIcon, onChange: (e) =>
                                  setProfileForm((prev) => ({
                                    ...prev,
                                    [iconField]: e.target.value,
                                  })), placeholder: "např. rocket_launch", className: "flex-1 px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-mono" })), React.createElement("div", { className: "flex flex-wrap gap-1.5 mt-2" }, statIconPresets.map((ic) => (
                                React.createElement("button", { key: ic, type: "button", title: ic, onClick: () =>
                                    setProfileForm((prev) => ({
                                      ...prev,
                                      [iconField]: ic,
                                    })), className: `w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                                    currentIcon === ic
                                      ? 'bg-purple-600 text-white border-purple-400 shadow'
                                      : 'bg-black/30 text-slate-400 border-white/10 hover:text-white hover:border-purple-500/40'
                                  }` }, React.createElement(Icon, { name: ic, className: "text-sm" }))
                              )))))
                      );
                    }

                    const csField = `ui_${tKey}_cs`;
                    const enField = `ui_${tKey}_en`;
                    const currentCs =
                      profileForm[csField] !== undefined && profileForm[csField] !== ''
                        ? String(profileForm[csField])
                        : UI_TEXT.cs[tKey] || '';
                    const currentEn =
                      profileForm[enField] !== undefined && profileForm[enField] !== ''
                        ? String(profileForm[enField])
                        : UI_TEXT.en[tKey] || '';

                    return (
                      React.createElement("div", { key: tKey, className: "p-4 rounded-2xl bg-black/25 border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-4" }, React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold mb-1.5 text-purple-300" }, `${label} (CZ)`), React.createElement("input", { type: "text", value: currentCs, onChange: (e) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                [csField]: e.target.value,
                              })), className: "w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-medium" })), React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold mb-1.5 text-slate-400" }, `${label} (EN)`), React.createElement("input", { type: "text", value: currentEn, onChange: (e) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                [enField]: e.target.value,
                              })), className: "w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-medium" })))
                    );
                  })))
            )), React.createElement("div", { className: "flex justify-end" }, React.createElement("button", { type: "submit", className: "px-7 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg flex items-center gap-2" }, React.createElement(Icon, { name: "save", className: "text-base" }), React.createElement("span", null, "Uložit všechny texty sekcí"))))
        ), activeTab === 'socials' && (
          React.createElement(CrudCollectionPanel, { entity: "socials", title: "Profily & Sociální sítě", subtitle: "Správa odkazů v bočním panelu (GitHub, LinkedIn, X, Instagram, Web...). U každé sítě můžete zvolit Material Symbol ikonu nebo vložit/nahrát vlastní SVG kód ikony.", items: cvData.socials || [], roles: roles, roleMap: roleMap, editingItem: editingItem, setEditingItem: setEditingItem, onSave: (e) => handleSaveEntity('socials', e), onDelete: (id) => handleDeleteEntity('socials', id), onReorder: (reordered) => handleReorderEntity('socials', reordered), surfaceCard: surfaceCard, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText })
        ), activeTab === 'roles' && (
          React.createElement(CrudCollectionPanel, { entity: "roles", title: "Pilíře odbornosti & Filtry", subtitle: "Tyto pilíře tvoří hlavní karty odbornosti na webu a zároveň slouží jako přepínače filtru pro Zkušenosti, Vzdělání, Dovednosti a Projekty.", items: cvData.roles || [], roles: roles, roleMap: roleMap, editingItem: editingItem, setEditingItem: setEditingItem, onSave: (e) => handleSaveEntity('roles', e), onDelete: (id) => handleDeleteEntity('roles', id), onReorder: (reordered) => handleReorderEntity('roles', reordered), surfaceCard: surfaceCard, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText })
        ), activeTab === 'skills' && (
          React.createElement(CrudCollectionPanel, { entity: "skills", title: "Technické & UX Dovednosti", subtitle: "Správa dovedností a jejich zařazení k jednotlivým pilířům odbornosti.", items: cvData.skills || [], roles: roles, roleMap: roleMap, editingItem: editingItem, setEditingItem: setEditingItem, onSave: (e) => handleSaveEntity('skills', e), onDelete: (id) => handleDeleteEntity('skills', id), onReorder: (reordered) => handleReorderEntity('skills', reordered), surfaceCard: surfaceCard, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText })
        ), activeTab === 'experience' && (
          React.createElement(CrudCollectionPanel, { entity: "experience", title: "Pracovní zkušenosti & Praxe", subtitle: "Správa pracovních zkušeností. Pomocí checkboxů v modálu přiřadíte zkušenost k pilířům, podle kterých se filtruje na webu.", items: cvData.experience || [], roles: roles, roleMap: roleMap, editingItem: editingItem, setEditingItem: setEditingItem, onSave: (e) => handleSaveEntity('experience', e), onDelete: (id) => handleDeleteEntity('experience', id), onReorder: (reordered) => handleReorderEntity('experience', reordered), surfaceCard: surfaceCard, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText })
        ), activeTab === 'projects' && (
          React.createElement(CrudCollectionPanel, { entity: "projects", title: "Vybrané projekty & Případové studie", subtitle: "Správa projektů v portfoliu a jejich propojení s pilíři odbornosti.", items: cvData.projects || [], roles: roles, roleMap: roleMap, editingItem: editingItem, setEditingItem: setEditingItem, onSave: (e) => handleSaveEntity('projects', e), onDelete: (id) => handleDeleteEntity('projects', id), onReorder: (reordered) => handleReorderEntity('projects', reordered), surfaceCard: surfaceCard, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText })
        ), activeTab === 'education' && (
          React.createElement(CrudCollectionPanel, { entity: "education", title: "Vzdělání & Certifikace", subtitle: "Správa dosaženého vzdělání, kurzů a certifikací.", items: cvData.education || [], roles: roles, roleMap: roleMap, editingItem: editingItem, setEditingItem: setEditingItem, onSave: (e) => handleSaveEntity('education', e), onDelete: (id) => handleDeleteEntity('education', id), onReorder: (reordered) => handleReorderEntity('education', reordered), surfaceCard: surfaceCard, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText })
        ), activeTab === 'system' && (
          React.createElement("div", { className: "space-y-7" }, React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4" }, React.createElement("div", null, React.createElement("h2", { className: "text-xl font-extrabold flex items-center gap-2" }, React.createElement(Icon, { name: "dns", className: "text-purple-400" }), React.createElement("span", null, "Systémová diagnostika, Šifrování & REST API Log")), React.createElement("p", { className: `text-xs mt-1 ${mutedText}` }, "Aktivní databázový driver: ", React.createElement("strong", { className: "text-purple-300" }, cvData.driver || 'mysql'))), React.createElement("div", { className: "flex flex-wrap items-center gap-3" }, React.createElement("button", { type: "button", onClick: async () => {
                    const res = await callApi('auth/refresh', 'POST');
                    if (res.ok && res.data?.data) {
                      setJwtToken(res.data.data.access_token);
                      localStorage.setItem('coolcv_jwt_token', res.data.data.access_token);
                      setCryptoReport(res.data.data.backend_crypto);
                      showToast('JWT token byl obnoven!');
                    }
                  }, className: `px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${innerCard}` }, React.createElement(Icon, { name: "refresh", className: "text-base text-purple-400" }), React.createElement("span", null, "Obnovit JWT Token")), React.createElement("button", { type: "button", onClick: async () => {
                    const res = await callApi('system/reset', 'POST');
                    if (res.ok && res.data?.data) {
                      setCvData(res.data.data);
                      showToast('Databáze byla obnovena do výchozích dat!');
                    }
                  }, className: "px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-2" }, React.createElement(Icon, { name: "restart_alt", className: "text-base" }), React.createElement("span", null, "Reset DB do výchozích dat")))), cryptoReport && (
              React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-7" }, React.createElement("div", { className: `rounded-3xl p-7 sm:p-8 space-y-5 ${innerCard}` }, React.createElement("div", { className: "flex items-center justify-between" }, React.createElement("h3", { className: "text-lg font-extrabold flex items-center gap-2" }, React.createElement(Icon, { name: "token", className: "text-purple-400" }), React.createElement("span", null, "JWT Bearer Token (HS256)")), React.createElement("span", { className: "px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-500/20 text-emerald-300" }, "RFC 7519 Verified")), React.createElement("div", { className: "p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs break-all leading-relaxed" }, React.createElement("span", { className: "text-rose-400" }, cryptoReport.jwt_hs256?.header_b64), ".", React.createElement("span", { className: "text-purple-400" }, cryptoReport.jwt_hs256?.payload_b64), ".", React.createElement("span", { className: "text-emerald-400" }, cryptoReport.jwt_hs256?.signature_b64)), React.createElement("pre", { className: "p-4 rounded-2xl bg-black/35 border border-white/10 font-mono text-xs overflow-auto" }, JSON.stringify(cryptoReport.jwt_hs256?.decoded_payload, null, 2))), React.createElement("div", { className: `rounded-3xl p-7 sm:p-8 space-y-5 ${innerCard}` }, React.createElement("div", { className: "flex items-center justify-between" }, React.createElement("h3", { className: "text-lg font-extrabold flex items-center gap-2" }, React.createElement(Icon, { name: "enhanced_encryption", className: "text-fuchsia-400" }), React.createElement("span", null, "PHP Backend AES-256-CBC + HMAC")), React.createElement("span", { className: "px-3 py-1 rounded-full text-[11px] font-mono bg-purple-500/20 text-purple-300" }, "OpenSSL Active")), React.createElement("div", { className: "space-y-3 font-mono text-xs" }, React.createElement("div", { className: "p-3.5 rounded-xl bg-black/35 border border-white/10" }, React.createElement("div", { className: "text-slate-400 mb-1" }, "Algoritmus & Odvození klíčů (HKDF):"), React.createElement("div", { className: "text-emerald-300 font-bold" }, cryptoReport.aes_256_backend?.algorithm)), React.createElement("div", { className: "p-3.5 rounded-xl bg-black/35 border border-white/10 break-all" }, React.createElement("div", { className: "text-slate-400 mb-1" }, "Initialization Vector (128-bit IV Hex):"), React.createElement("div", { className: "text-purple-300" }, cryptoReport.aes_256_backend?.iv_hex)), React.createElement("div", { className: "p-3.5 rounded-xl bg-black/35 border border-white/10 break-all" }, React.createElement("div", { className: "text-slate-400 mb-1" }, "HMAC-SHA256 Autentizační Tag:"), React.createElement("div", { className: "text-fuchsia-300" }, cryptoReport.aes_256_backend?.hmac_sha256_hex)))))
            ), React.createElement("div", { className: `rounded-3xl p-7 sm:p-8 space-y-4 ${innerCard}` }, React.createElement("div", { className: "flex items-center justify-between" }, React.createElement("h3", { className: "text-base font-extrabold flex items-center gap-2" }, React.createElement(Icon, { name: "terminal", className: "text-emerald-400" }), React.createElement("span", null, "Živý REST API Network Log")), React.createElement("span", { className: `text-xs font-mono ${mutedText}` }, apiLogs.length, " záznamů")), React.createElement("div", { className: "space-y-2 max-h-80 overflow-y-auto font-mono text-xs" }, apiLogs.map((log) => (
                  React.createElement("div", { key: log.id, className: "p-3 rounded-xl bg-black/35 border border-white/10 flex items-center justify-between gap-4" }, React.createElement("span", { className: "text-purple-300 font-bold" }, `${log.method} ${log.url}`), React.createElement("span", { className: "text-emerald-400" }, `HTTP ${log.status} (${log.ms} ms)`))
                )))))
        )))
  );
}

// Datatable panel with "Add new item" button, Drag & Drop sorting, icon actions and popup modal for edit
function CrudCollectionPanel({
  entity,
  title,
  subtitle,
  items,
  roles,
  roleMap,
  editingItem,
  setEditingItem,
  onSave,
  onDelete,
  onReorder,
  surfaceCard,
  innerCard,
  mutedText,
}) {
  const [selectedSlugs, setSelectedSlugs] = useState([]);
  const [iconValue, setIconValue] = useState('language');
  const [iconMode, setIconMode] = useState('material');
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const svgFileInputRef = useRef(null);

  const isSortable = ['experience', 'skills', 'socials', 'projects', 'education', 'roles'].includes(entity);
  const usesRoleSlug = entity === 'skills';
  const usesRoleTags = entity === 'experience' || entity === 'projects' || entity === 'education';
  const hasPillarPairing = usesRoleSlug || usesRoleTags;
  const hasIconField = entity === 'socials' || entity === 'roles';

  const displayItems = useMemo(() => {
    if (!isSortable || draggedId === null || dragOverIndex === null) {
      return items;
    }
    const fromIdx = items.findIndex((it) => Number(it.id) === Number(draggedId));
    if (fromIdx === -1 || fromIdx === dragOverIndex) {
      return items;
    }
    const copy = [...items];
    const [moved] = copy.splice(fromIdx, 1);
    copy.splice(dragOverIndex, 0, moved);
    return copy;
  }, [items, isSortable, draggedId, dragOverIndex]);

  function commitDragReorder() {
    if (!isSortable || draggedId === null || dragOverIndex === null) {
      setDraggedId(null);
      setDragOverIndex(null);
      return;
    }
    const fromIdx = items.findIndex((it) => Number(it.id) === Number(draggedId));
    const toIdx = dragOverIndex;
    setDraggedId(null);
    setDragOverIndex(null);

    if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
      const next = [...items];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      onReorder(next);
    }
  }

  useEffect(() => {
    if (!editingItem) {
      setSelectedSlugs([]);
      return;
    }

    if (hasIconField) {
      const initialIcon = String(editingItem.icon || (entity === 'socials' ? 'language' : 'code')).trim();
      setIconValue(initialIcon);
      setIconMode(initialIcon.startsWith('<svg') || initialIcon.includes('<svg') ? 'svg' : 'material');
    }

    const rawVal = usesRoleSlug ? editingItem.role_slug : editingItem.role_tags;
    if (rawVal) {
      const parsed = String(rawVal)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      setSelectedSlugs(parsed);
    } else if (roles.length > 0) {
      setSelectedSlugs([roles[0].slug]);
    } else {
      setSelectedSlugs([]);
    }
  }, [editingItem, entity]);

  function togglePillarCheckbox(slug) {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((item) => item !== slug);
      }
      return [...prev, slug];
    });
  }

  function handleSvgFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rawText = typeof ev.target?.result === 'string' ? ev.target.result.trim() : '';
      const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/i);
      if (svgMatch) {
        setIconValue(svgMatch[0]);
        setIconMode('svg');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  const fieldsByEntity = {
    socials: [
      ['title', 'Název profilu / sociální sítě (např. GitHub, LinkedIn, X, Web)', ''],
      ['url', 'Cílová URL adresa nebo mailto: odkaz', 'https://'],
    ],
    roles: [
      ['slug', 'Unikátní identifikátor filtru (slug, např. ux, js, php, dotnet)', ''],
      ['badge_code', 'Zkrácený odznak pilulky / filtru (např. UX / UI)', ''],
      ['title_cs', 'Hlavní název pilíře (CZ, např. UX Designer)', ''],
      ['title_en', 'Pillar Title (EN, e.g. UX Designer)', ''],
      ['level_cs', 'Úroveň (CZ, např. Mid–Senior)', 'Mid–Senior'],
      ['level_en', 'Level (EN, e.g. Mid–Senior)', 'Mid–Senior'],
      ['summary_cs', 'Popis pilíře (CZ)', ''],
      ['summary_en', 'Pillar Summary (EN)', ''],
    ],
    skills: [
      ['name_cs', 'Název dovednosti (CZ)', ''],
      ['name_en', 'Skill Name (EN)', ''],
      ['proficiency', 'Úroveň (0-100 %)', '90'],
      ['years_exp', 'Praxe (např. 4+ roky)', '4+ roky'],
      ['tags', 'Klíčová slova / technologie', 'Figma, React, TypeScript, PHP'],
    ],
    experience: [
      ['period_cs', 'Období (CZ)', '2024 – Současnost'],
      ['period_en', 'Period (EN)', '2024 – Present'],
      ['role_cs', 'Pozice (CZ)', ''],
      ['role_en', 'Role (EN)', ''],
      ['company', 'Společnost', ''],
      ['description_cs', 'Popis (CZ)', ''],
      ['description_en', 'Description (EN)', ''],
      ['achievements_cs', 'Úspěchy CZ (oddělené svislítkem |)', ''],
      ['achievements_en', 'Achievements EN (separated by |)', ''],
    ],
    projects: [
      ['title_cs', 'Název projektu (CZ)', ''],
      ['title_en', 'Project Title (EN)', ''],
      ['subtitle_cs', 'Podtitul (CZ)', ''],
      ['subtitle_en', 'Subtitle (EN)', ''],
      ['demo_url', 'Webová adresa projektu (URL)', 'https://www.projekt.cz'],
      ['tech_stack', 'Použité technologie', 'React, TypeScript, PHP 8, MySQL'],
      ['description_cs', 'Popis projektu (CZ)', ''],
      ['description_en', 'Project Description (EN)', ''],
      ['outcome_cs', 'Výsledek / Dopad (CZ)', ''],
      ['outcome_en', 'Outcome / Impact (EN)', ''],
    ],
    education: [
      ['period', 'Období', '2024 – 2025'],
      ['title_cs', 'Název studia / certifikace (CZ)', ''],
      ['title_en', 'Title (EN)', ''],
      ['institution_cs', 'Instituce (CZ)', ''],
      ['institution_en', 'Institution (EN)', ''],
      ['details_cs', 'Podrobnosti (CZ)', ''],
      ['details_en', 'Details (EN)', ''],
    ],
  };

  const fields = fieldsByEntity[entity] || [];
  const isEditingExisting = Number(editingItem?.id || 0) > 0;

  return (
    React.createElement("div", { className: "space-y-5" }, React.createElement("div", { className: "flex items-center justify-between gap-4" }, React.createElement("div", { className: "space-y-1 min-w-0 flex-1" }, React.createElement("h2", { className: "text-xl font-extrabold" }, `${title} (${items.length})`), React.createElement("p", { className: `text-xs leading-relaxed ${mutedText}` }, subtitle)), React.createElement("button", { type: "button", onClick: () => setEditingItem({}), className: "shrink-0 whitespace-nowrap px-5 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 hover:opacity-95 shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all" }, React.createElement(Icon, { name: "add", className: "text-lg" }), React.createElement("span", null, "Přidat"))), React.createElement("div", { className: `rounded-3xl p-6 sm:p-7 space-y-3 ${innerCard}`, onDragOver: (e) => {
          if (isSortable && draggedId !== null) {
            e.preventDefault();
          }
        }, onDrop: (e) => {
          if (isSortable && draggedId !== null) {
            e.preventDefault();
            commitDragReorder();
          }
        } }, isSortable && items.length > 1 && (
          React.createElement("div", { className: "flex items-center gap-2 pb-1 text-[11px] font-semibold text-purple-300" }, React.createElement(Icon, { name: "drag_indicator", className: "text-base text-purple-400" }), React.createElement("span", null, "Řazení položek: uchopte položku za placeholder vlevo a přetáhněte ji myší (Drag & Drop)."))
        ), displayItems.length === 0 ? (
          React.createElement("div", { className: `py-10 text-center text-sm ${mutedText}` }, "Zatím zde nejsou žádné položky. Klikněte na „Přidat“.")
        ) : (
          displayItems.map((it, idx) => {
            const rawTags = usesRoleSlug ? it.role_slug : it.role_tags;
            const itemSlugs = hasPillarPairing
              ? String(rawTags || '')
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];
            const isSvgIcon = String(it.icon || '').includes('<svg');
            const isBeingDragged = draggedId !== null && Number(it.id) === Number(draggedId);

            return (
              React.createElement("div", { key: it.id, draggable: isSortable, onDragStart: (e) => {
                  if (!isSortable) return;
                  setDraggedId(Number(it.id));
                  setDragOverIndex(idx);
                  e.dataTransfer.effectAllowed = 'move';
                  try {
                    e.dataTransfer.setData('text/plain', String(it.id));
                  } catch (_) {}
                }, onDragOver: (e) => {
                  if (!isSortable || draggedId === null) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverIndex !== idx) {
                    setDragOverIndex(idx);
                  }
                }, onDrop: (e) => {
                  if (!isSortable || draggedId === null) return;
                  e.preventDefault();
                  e.stopPropagation();
                  commitDragReorder();
                }, onDragEnd: () => {
                  if (draggedId !== null) {
                    commitDragReorder();
                  }
                }, className: `p-4 sm:p-5 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isBeingDragged
                    ? 'border-2 border-dashed border-purple-500 bg-purple-500/15 shadow-lg scale-[0.995]'
                    : 'bg-black/25 border border-white/10 hover:border-purple-500/35'
                }` }, React.createElement("div", { className: "flex items-start sm:items-center gap-3.5 min-w-0 flex-1" }, isSortable && (
                    React.createElement("div", { title: "Táhněte myší pro změnu pořadí (Drag & Drop)", className: `w-11 h-12 rounded-xl border border-dashed flex flex-col items-center justify-center shrink-0 select-none cursor-grab active:cursor-grabbing transition-all ${
                        isBeingDragged
                          ? 'bg-purple-500/30 border-purple-400 text-purple-200'
                          : 'bg-white/[0.04] border-white/20 hover:border-purple-400/60 hover:bg-purple-500/15 text-purple-400'
                      }` }, React.createElement(Icon, { name: "drag_indicator", className: "text-lg leading-none" }), React.createElement("span", { className: "text-[10px] font-mono font-extrabold leading-none mt-0.5" }, `#${idx + 1}`))
                  ), React.createElement("div", { className: "min-w-0 space-y-2 flex-1" }, React.createElement("div", { className: "flex flex-wrap items-center gap-3" }, hasIconField && (
                        React.createElement("div", { className: "w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0" }, React.createElement(Icon, { name: it.icon || 'language', className: "text-xl" }))
                      ), entity === 'roles' && (
                        React.createElement("span", { className: "px-3 py-1 rounded-lg text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30" }, it.badge_code)
                      ), React.createElement("span", { className: "font-extrabold text-sm sm:text-base truncate" }, it.title || it.name_cs || it.role_cs || it.title_cs), hasIconField && (
                        React.createElement("span", { className: "px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.06] text-slate-300 border border-white/10" }, isSvgIcon ? 'Vlastní SVG ikona' : `Material: ${it.icon}`)
                      ), entity === 'skills' && (
                        React.createElement("span", { className: "text-xs font-mono font-bold text-purple-400" }, it.proficiency, "%")
                      )), React.createElement("div", { className: `text-xs truncate ${mutedText}` }, entity === 'socials'
                        ? it.url
                        : entity === 'roles'
                          ? `Filtr slug: "${it.slug}" • ${it.level_cs} • ${it.summary_cs}`
                          : entity === 'projects'
                            ? `${it.demo_url && !String(it.demo_url).startsWith('#') ? `${it.demo_url} • ` : ''}${it.tech_stack || ''}`
                            : entity === 'experience'
                              ? `${it.period_cs ? `${it.period_cs} • ` : ''}${it.company || ''}`
                              : entity === 'education'
                                ? `${it.period ? `${it.period} • ` : ''}${it.institution_cs || ''}`
                                : it.company || it.tech_stack || it.institution_cs || it.tags || it.period_cs || it.period), hasPillarPairing && itemSlugs.length > 0 && (
                      React.createElement("div", { className: "flex flex-wrap items-center gap-1.5 pt-0.5" }, itemSlugs.map((slug) => {
                          const pillar = roleMap[slug];
                          return (
                            React.createElement("span", { key: slug, className: "px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25 inline-flex items-center gap-1.5" }, React.createElement(Icon, { name: pillar?.icon || 'label', className: "text-sm text-fuchsia-400" }), React.createElement("span", null, pillar ? `${pillar.badge_code} — ${pillar.title_cs}` : slug))
                          );
                        }))
                    ))), React.createElement("div", { className: "flex items-center gap-2 shrink-0 self-end sm:self-center" }, React.createElement("button", { type: "button", onClick: () => setEditingItem(it), className: "w-10 h-10 rounded-xl bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/25 flex items-center justify-center transition-all", title: "Upravit položku" }, React.createElement(Icon, { name: "edit", className: "text-lg" })), React.createElement("button", { type: "button", onClick: () => onDelete(it.id), className: "w-10 h-10 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/25 flex items-center justify-center transition-all", title: "Smazat položku" }, React.createElement(Icon, { name: "delete", className: "text-lg" }))))
            );
          })
        )), editingItem !== null && (
        React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md no-print" }, React.createElement("div", { className: `relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl ${surfaceCard}` }, React.createElement("form", { onSubmit: async (e) => {
                await onSave(e);
              }, className: "flex flex-col flex-1 min-h-0 overflow-hidden" }, React.createElement("div", { className: "shrink-0 px-7 pt-6 pb-5 sm:px-9 sm:pt-7 sm:pb-5 border-b border-white/[0.08] flex items-center justify-between gap-4" }, React.createElement("div", { className: "min-w-0" }, React.createElement("div", { className: "text-xs font-bold tracking-[0.2em] uppercase text-fuchsia-400 mb-1" }, isEditingExisting ? `EDITACE POLOŽKY #${editingItem.id}` : 'NOVÁ POLOŽKA'), React.createElement("h3", { className: "text-xl sm:text-2xl font-extrabold truncate" }, isEditingExisting ? `Upravit záznam v sekci ${title}` : `Přidat položku do sekce ${title}`)), React.createElement("button", { type: "button", onClick: () => setEditingItem(null), className: `shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${innerCard}`, title: "Zavřít modální okno" }, React.createElement(Icon, { name: "close", className: "text-lg" }))), React.createElement("div", { className: "flex-1 min-h-0 overflow-y-auto px-7 py-6 sm:px-9 sm:py-6 space-y-5" }, React.createElement("input", { type: "hidden", name: "id", value: isEditingExisting ? String(editingItem.id) : '' }), React.createElement("input", { type: "hidden", name: "sort_order", value: isEditingExisting ? String(editingItem.sort_order ?? 1) : String(items.length + 1) }), hasIconField && (
                  React.createElement("div", { className: "rounded-2xl p-4 sm:p-5 bg-black/25 border border-white/10 space-y-4" }, React.createElement("input", { type: "hidden", name: "icon", value: iconValue }), React.createElement("input", { ref: svgFileInputRef, type: "file", accept: ".svg,image/svg+xml", className: "hidden", onChange: handleSvgFileUpload }), React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-3" }, React.createElement("div", { className: "flex items-center gap-3" }, React.createElement("div", { className: "w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0" }, React.createElement(Icon, { name: iconValue, className: "text-2xl" })), React.createElement("div", null, React.createElement("div", { className: "text-xs font-extrabold uppercase tracking-wider text-purple-300" }, "Ikona položky (živý náhled)"), React.createElement("div", { className: `text-[11px] ${mutedText}` }, "Zvolte Material Symbol nebo vložte / nahrajte vlastní SVG kód ikony"))), React.createElement("div", { className: "flex items-center gap-2" }, React.createElement("button", { type: "button", onClick: () => {
                            setIconMode('material');
                            if (iconValue.includes('<svg')) setIconValue('language');
                          }, className: `px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            iconMode === 'material'
                              ? 'bg-purple-500 text-white shadow'
                              : 'bg-white/[0.06] text-slate-300 hover:bg-white/10'
                          }` }, React.createElement(Icon, { name: "interests", className: "text-base" }), React.createElement("span", null, "Material Symbol")), React.createElement("button", { type: "button", onClick: () => setIconMode('svg'), className: `px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            iconMode === 'svg'
                              ? 'bg-purple-500 text-white shadow'
                              : 'bg-white/[0.06] text-slate-300 hover:bg-white/10'
                          }` }, React.createElement(Icon, { name: "code", className: "text-base" }), React.createElement("span", null, "Vlastní SVG kód")))), iconMode === 'material' ? (
                      React.createElement("div", { className: "space-y-3" }, React.createElement("div", null, React.createElement("label", { className: "block text-xs font-bold mb-1.5 text-slate-400" }, "Název Google Material Symbol ikony"), React.createElement("input", { type: "text", value: iconValue.includes('<svg') ? '' : iconValue, onChange: (e) => setIconValue(e.target.value), placeholder: "např. language, mail, code, work, share...", className: "w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-mono" })), React.createElement("div", { className: "flex flex-wrap items-center gap-1.5" }, MATERIAL_ICON_PRESETS.map((preset) => (
                            React.createElement("button", { key: preset, type: "button", onClick: () => setIconValue(preset), className: `px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                                iconValue === preset
                                  ? 'bg-purple-500/25 border-purple-400 text-white'
                                  : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/25'
                              }` }, React.createElement(Icon, { name: preset, className: "text-base text-purple-400" }), React.createElement("span", null, preset))
                          ))))
                    ) : (
                      React.createElement("div", { className: "space-y-3" }, React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2" }, React.createElement("label", { className: "block text-xs font-bold text-slate-400" }, "SVG kód ikony (<svg ...>...</svg>)"), React.createElement("button", { type: "button", onClick: () => svgFileInputRef.current?.click(), className: "px-3 py-1.5 rounded-xl text-xs font-bold bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-500/30 flex items-center gap-1.5 transition-all" }, React.createElement(Icon, { name: "upload_file", className: "text-base" }), React.createElement("span", null, "Nahrát .svg soubor z disku"))), React.createElement("textarea", { rows: 4, value: iconValue, onChange: (e) => setIconValue(e.target.value), placeholder: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="..."/></svg>', className: "w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-xs font-mono leading-relaxed" }), React.createElement("div", { className: "space-y-1.5" }, React.createElement("div", { className: `text-[11px] font-semibold ${mutedText}` }, "Rychlé šablony SVG ikon známých sítí:"), React.createElement("div", { className: "flex flex-wrap items-center gap-1.5" }, BRAND_SVG_PRESETS.map((brand) => (
                              React.createElement("button", { key: brand.label, type: "button", onClick: () => setIconValue(brand.svg), className: "px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-black/30 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 text-slate-300 flex items-center gap-1.5 transition-all" }, React.createElement(Icon, { name: brand.svg, className: "text-sm text-purple-400" }), React.createElement("span", null, brand.label))
                            )))))
                    ))
                ), hasPillarPairing && (
                  React.createElement("div", { className: "space-y-2.5" }, React.createElement("label", { className: "block text-xs font-bold uppercase tracking-wider text-purple-300" }, "Přiřazení k pilířům odbornosti (určuje zobrazení pilulek a chování filtru na webu)"), React.createElement("input", { type: "hidden", name: usesRoleSlug ? 'role_slug' : 'role_tags', value: selectedSlugs.join(',') }), React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5" }, roles.map((role) => {
                        const isChecked = selectedSlugs.includes(role.slug);
                        return (
                          React.createElement("label", { key: role.slug, className: `cursor-pointer rounded-2xl p-3.5 border flex items-center gap-3 transition-all ${
                              isChecked
                                ? 'bg-purple-500/20 border-purple-500 text-white shadow-sm'
                                : 'bg-black/25 border-white/10 text-slate-300 hover:border-white/25'
                            }` }, React.createElement("input", { type: "checkbox", checked: isChecked, onChange: () => togglePillarCheckbox(role.slug), className: "w-4 h-4 accent-purple-500 rounded cursor-pointer" }), React.createElement(Icon, { name: role.icon || 'code', className: "text-xl text-purple-400 shrink-0" }), React.createElement("div", { className: "min-w-0" }, React.createElement("div", { className: "text-xs font-extrabold truncate" }, role.badge_code), React.createElement("div", { className: `text-[11px] truncate ${mutedText}` }, role.title_cs)))
                        );
                      })))
                ), React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, fields.map(([name, label, def]) => {
                    const isWide =
                      name === 'url' ||
                      name === 'demo_url' ||
                      name === 'title' ||
                      name.includes('description') ||
                      name.includes('achievements') ||
                      name.includes('summary') ||
                      name.includes('details') ||
                      name.includes('outcome');
                    const isOptional = name === 'demo_url' || name.includes('achievements');

                    return (
                      React.createElement("div", { key: name, className: isWide ? 'sm:col-span-2' : '' }, React.createElement("label", { className: "block text-xs font-bold mb-1.5 text-slate-400" }, label), React.createElement("input", { type: "text", name: name, defaultValue: editingItem[name] ?? def, key: `${entity}-${editingItem.id || 'new'}-${name}`, required: !isOptional, className: "w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-medium" }))
                    );
                  }))), React.createElement("div", { className: "shrink-0 px-7 py-4 sm:px-9 sm:py-5 border-t border-white/[0.08] flex items-center justify-end gap-3" }, React.createElement("button", { type: "button", onClick: () => setEditingItem(null), className: `px-5 py-3 rounded-xl font-bold text-xs ${innerCard}` }, "Zrušit"), React.createElement("button", { type: "submit", className: "px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 to-indigo-500 shadow-lg flex items-center gap-2" }, React.createElement(Icon, { name: "save", className: "text-base" }), React.createElement("span", null, isEditingExisting ? 'Uložit změny' : 'Vytvořit položku'))))))
      ))
  );
}


  // --- src/App.tsx ---










let toastTimer = null;

// Main React 18 root componet connecting Frontend Web CV and Backoffice admin
function App() {
  const initial = window.__INITIAL_STATE__ || {};
  const [theme, setTheme] = useState(initial.theme || 'dark');
  const [lang, setLang] = useState(initial.lang || 'cs');
  const [view, setView] = useState(initial.initialView || 'cv');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(initial.initialView === 'backoffice');
  const [activeRole, setActiveRole] = useState('all');
  const [activeSection, setActiveSection] = useState('home');
  const [cvData, setCvData] = useState(
    initial.cvData || {
      driver: 'loading',
      profile: {},
      roles: [],
      skills: [],
      experience: [],
      projects: [],
      education: [],
      socials: [],
    }
  );

  const [jwtToken, setJwtToken] = useState(() => localStorage.getItem('coolcv_jwt_token') || '');
  const [authUser, setAuthUser] = useState(null);
  const [cryptoReport, setCryptoReport] = useState(null);
  const [apiLogs, setApiLogs] = useState([]);
  const [toast, setToast] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadProgress, setPhotoUploadProgress] = useState(0);

  const fileInputRef = useRef(null);

  const isDark = theme === 'dark';
  const t = (key) => {
    const normalizedKey =
      key === 'hello_im' ? 'hello' : key === 'pillars_title' ? 'services_title' : key;
    const customVal =
      cvData.profile?.[`ui_${normalizedKey}_${lang}`] ||
      cvData.profile?.[`ui_${normalizedKey}`] ||
      (normalizedKey.endsWith('_num') ? cvData.profile?.[`ui_${normalizedKey}_cs`] : '');
    if (typeof customVal === 'string' && customVal.trim() !== '') {
      return customVal;
    }
    return UI_TEXT[lang]?.[normalizedKey] || UI_TEXT.cs[normalizedKey] || normalizedKey;
  };
  const field = (row, base) => {
    if (!row) return '';
    return row[`${base}_${lang}`] || row[`${base}_cs`] || row[base] || '';
  };

  function showToast(msg, isError = false) {
    setToast({ msg, isError });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(null), 3800);
  }

  async function callApi(
    route, method = 'GET', body = null, tokenOverride = null
  ) {
    const activeTok = tokenOverride !== null ? tokenOverride : jwtToken;
    const url = `api.php?route=${route}`;
    const headers = {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
    if (activeTok) {
      headers['Authorization'] = `Bearer ${activeTok}`;
      headers['X-Api-Token'] = activeTok;
    }
    const options = { method, headers, credentials: 'same-origin' };
    if (body !== null && method !== 'GET') {
      headers['Content-Type'] = 'application/json; charset=utf-8';
      headers['X-HTTP-Method-Override'] = method;
      options.body = JSON.stringify(body);
    }

    try {
      const res = await fetch(url, options);
      const json = await res.json();
      const entry = {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        method,
        url,
        status: res.status,
        ms: json?.meta?.execution_ms ?? '-',
        response: json,
      };
      setApiLogs((prev) => [entry, ...prev.slice(0, 14)]);
      return { ok: res.ok && json.ok !== false, status: res.status, data: json };
    } catch (err) {
      return { ok: false, status: 500, data: { error: err?.message || 'Network error' } };
    }
  }

  useEffect(() => {
    (async () => {
      const cvRes = await callApi('cv', 'GET');
      if (cvRes.ok && cvRes.data?.data) {
        setCvData(cvRes.data.data);
      }
      if (jwtToken) {
        const meRes = await callApi('auth/me', 'GET', null, jwtToken);
        if (meRes.ok) {
          setAuthUser(meRes.data.user);
          setCryptoReport(meRes.data.backend_crypto);
        } else {
          setJwtToken('');
          localStorage.removeItem('coolcv_jwt_token');
        }
      }
    })();
  }, []);

  async function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      await fetch(`?theme=${next}&ajax=1`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    } catch (_) {}
  }

  async function toggleLang() {
    const next = lang === 'cs' ? 'en' : 'cs';
    setLang(next);
    document.documentElement.setAttribute('lang', next);
    try {
      await fetch(`?lang=${next}&ajax=1`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    } catch (_) {}
  }

  async function ensureHtml2PdfLoaded() {
    if (typeof window.html2pdf === 'function') {
      return window.html2pdf;
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'assets/js/html2pdf.bundle.min.js';
      script.onload = () => {
        if (typeof window.html2pdf === 'function') {
          resolve(window.html2pdf);
        } else {
          reject(new Error('Knihovna pro PDF se nenačetla.'));
        }
      };
      script.onerror = () => reject(new Error('Nelze načíst knihovnu pro generování PDF.'));
      document.head.appendChild(script);
    });
  }

  async function loadMontserratPdfFontBase64() {
    try {
      const res = await fetch('assets/fonts/Montserrat-Regular.ttf');
      if (!res.ok) return '';
      const buf = await res.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = '';
      const chunk = 8192;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
      }
      return window.btoa(binary);
    } catch (_) {
      return '';
    }
  }

  function extractInteractiveLayer(idoc, pageEl) {
    if (!idoc || !pageEl) return { links: [], texts: [] };
    const pageRect = pageEl.getBoundingClientRect();
    const scaleX = 210 / (pageRect.width || 794);
    const scaleY = 297 / (pageRect.height || 1123);
    const links = [];
    const texts = [];

    const anchors = pageEl.querySelectorAll('a[href]');
    anchors.forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return;
      const r = a.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        links.push({
          url: href,
          x: Math.max(0, (r.left - pageRect.left) * scaleX - 1),
          y: Math.max(0, (r.top - pageRect.top) * scaleY - 1),
          w: r.width * scaleX + 2,
          h: r.height * scaleY + 2,
        });
      }
    });

    const walker = idoc.createTreeWalker(pageEl, 4);
    let node;
    while ((node = walker.nextNode())) {
      const raw = node.nodeValue || '';
      if (!raw.trim()) continue;
      const parentEl = node.parentElement;
      if (!parentEl) continue;
      if (parentEl.closest('.material-symbols-rounded, script, style, svg')) continue;

      const comp = idoc.defaultView ? idoc.defaultView.getComputedStyle(parentEl) : null;
      const fontSizePx = comp ? parseFloat(comp.fontSize) || 10 : 10;
      const fontSizePt = Math.max(5.5, Math.min(34, fontSizePx * 0.75));

      const tokenRegex = /\S+\s*/g;
      let match;
      let currentLine = null;

      while ((match = tokenRegex.exec(raw)) !== null) {
        const range = idoc.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const r = range.getBoundingClientRect();
        if (!r || r.width <= 0 || r.height <= 0) continue;

        if (!currentLine || Math.abs(r.top - currentLine.top) > 3.5) {
          if (currentLine && currentLine.text.trim()) {
            texts.push({
              text: currentLine.text.replace(/\s+/g, ' ').trim(),
              x: (currentLine.left - pageRect.left) * scaleX,
              y: (currentLine.bottom - pageRect.top - currentLine.height * 0.18) * scaleY,
              fontSizePt,
            });
          }
          currentLine = {
            text: match[0],
            top: r.top,
            left: r.left,
            bottom: r.bottom,
            height: r.height,
          };
        } else {
          currentLine.text += match[0];
          currentLine.bottom = Math.max(currentLine.bottom, r.bottom);
          currentLine.height = Math.max(currentLine.height, r.height);
        }
      }

      if (currentLine && currentLine.text.trim()) {
        texts.push({
          text: currentLine.text.replace(/\s+/g, ' ').trim(),
          x: (currentLine.left - pageRect.left) * scaleX,
          y: (currentLine.bottom - pageRect.top - currentLine.height * 0.18) * scaleY,
          fontSizePt,
        });
      }
    }

    return { links, texts };
  }

  function applyInteractiveLayerToPdfPage(pdf, layout, hasFont) {
    if (!pdf || !layout) return;
    if (hasFont && Array.isArray(layout.texts) && layout.texts.length > 0) {
      try {
        pdf.setFont('Montserrat', 'normal');
        pdf.internal.write('3 Tr');
        layout.texts.forEach((item) => {
          if (!item.text) return;
          pdf.setFontSize(item.fontSizePt);
          pdf.text(item.text, item.x, item.y);
        });
        pdf.internal.write('0 Tr');
      } catch (_) {}
    }
    if (Array.isArray(layout.links) && layout.links.length > 0) {
      layout.links.forEach((lnk) => {
        try {
          pdf.link(lnk.x, lnk.y, lnk.w, lnk.h, { url: lnk.url });
        } catch (_) {}
      });
    }
  }

  // Request PDF from backend/pdf_template.php with live dynamic cvData and directly download .pdf file
  async function handleDownloadPdf() {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const latestRes = await callApi('cv', 'GET');
      const liveCvData = latestRes.ok && latestRes.data?.data ? latestRes.data.data : cvData;
      if (latestRes.ok && latestRes.data?.data) {
        setCvData(latestRes.data.data);
      }

      const safeName = String(liveCvData.profile?.full_name || 'Jan-Novak')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const filename = `${safeName || 'CoolCV'}-CV-${lang.toUpperCase()}.pdf`;

      const res = await fetch(`api.php?route=cv/pdf&lang=${lang}&t=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          lang,
          cvData: liveCvData,
        }),
      });

      if (!res.ok) {
        let errMsg = 'Chyba při generování PDF na serveru.';
        try {
          const errJson = await res.json();
          if (errJson?.error) errMsg = errJson.error;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const contentType = (res.headers.get('content-type') || '').toLowerCase();

      if (contentType.includes('application/json')) {
        const json = await res.json();
        if (json?.html) {
          const html2pdfLib = await ensureHtml2PdfLoaded();
          const savedScrollY = window.scrollY || 0;
          window.scrollTo(0, 0);

          const iframe = document.createElement('iframe');
          iframe.style.position = 'fixed';
          iframe.style.left = '0';
          iframe.style.top = '0';
          iframe.style.width = '794px';
          iframe.style.height = '2300px';
          iframe.style.border = '0';
          iframe.style.opacity = '0.01';
          iframe.style.pointerEvents = 'none';
          iframe.style.zIndex = '9991';
          document.body.appendChild(iframe);

          try {
            const idoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!idoc || !iframe.contentWindow) {
              throw new Error('Nelze inicializovat PDF plátno.');
            }

            idoc.open();
            idoc.write(json.html);
            idoc.close();

            await new Promise((resolve) => {
              const s = idoc.createElement('script');
              s.src = 'assets/js/html2pdf.bundle.min.js';
              s.onload = () => resolve(true);
              s.onerror = () => resolve(false);
              idoc.head.appendChild(s);
            });

            await new Promise((resolve) => {
              let done = false;
              const finish = () => {
                if (!done) {
                  done = true;
                  resolve(true);
                }
              };
              if (idoc.readyState === 'complete') {
                setTimeout(finish, 600);
              } else {
                iframe.onload = () => setTimeout(finish, 600);
                setTimeout(finish, 1200);
              }
            });

            try {
              if (idoc.fonts && idoc.fonts.ready) {
                await idoc.fonts.ready;
              }
            } catch (_) {}

            await new Promise((r) => setTimeout(r, 400));

            const page1 = idoc.getElementById('pdf-page-1');
            const page2 = idoc.getElementById('pdf-page-2');
            if (!page1) {
              throw new Error('Šablona PDF nebyla nalezena.');
            }

            const hasPage2 = Boolean(page2 && page2.innerText && page2.innerText.trim().length > 0);
            const page1Layout = extractInteractiveLayer(idoc, page1);
            const page2Layout = hasPage2 ? extractInteractiveLayer(idoc, page2) : null;
            const fontB64 = await loadMontserratPdfFontBase64();

            const iframeH2p = (iframe.contentWindow && iframe.contentWindow['html2pdf']) || html2pdfLib;

            const worker1 = iframeH2p()
              .set({
                margin: 0,
                filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                  scale: 2.5,
                  useCORS: true,
                  allowTaint: true,
                  backgroundColor: '#ffffff',
                  width: 794,
                  height: 1123,
                  windowWidth: 794,
                  scrollX: 0,
                  scrollY: 0,
                },
                jsPDF: {
                  unit: 'mm',
                  format: 'a4',
                  orientation: 'portrait',
                  compress: true,
                },
              })
              .from(page1);

            const pdf = await worker1.toPdf().get('pdf');
            while (pdf.internal.getNumberOfPages() > 1) {
              pdf.deletePage(pdf.internal.getNumberOfPages());
            }

            let hasUnicodeFont = false;
            if (fontB64 && typeof pdf.addFileToVFS === 'function' && typeof pdf.addFont === 'function') {
              try {
                pdf.addFileToVFS('Montserrat-Regular.ttf', fontB64);
                pdf.addFont('Montserrat-Regular.ttf', 'Montserrat', 'normal', 'Identity-H');
                hasUnicodeFont = true;
              } catch (_) {}
            }

            pdf.setPage(1);
            applyInteractiveLayerToPdfPage(pdf, page1Layout, hasUnicodeFont);

            if (hasPage2 && page2) {
              page1.style.display = 'none';
              page2.classList.remove('page-break');
              page2.style.pageBreakBefore = 'auto';
              page2.style.breakBefore = 'auto';
              const canvas2 = await iframeH2p()
                .set({
                  margin: 0,
                  image: { type: 'jpeg', quality: 0.98 },
                  html2canvas: {
                    scale: 2.5,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    width: 794,
                    height: 1123,
                    windowWidth: 794,
                    scrollX: 0,
                    scrollY: 0,
                  },
                  jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: true,
                  },
                })
                .from(page2)
                .toCanvas()
                .get('canvas');

              const imgData2 = canvas2.toDataURL('image/jpeg', 0.98);
              pdf.addPage();
              pdf.setPage(2);
              pdf.addImage(imgData2, 'JPEG', 0, 0, 210, 297);
              applyInteractiveLayerToPdfPage(pdf, page2Layout, hasUnicodeFont);
            }

            const pdfBuffer = pdf.output('arraybuffer');
            const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
            const blobUrl = window.URL.createObjectURL(pdfBlob);
            const dlLink = document.createElement('a');
            dlLink.style.display = 'none';
            dlLink.href = blobUrl;
            dlLink.download = filename;
            document.body.appendChild(dlLink);
            dlLink.click();
            setTimeout(() => {
              if (dlLink.parentNode) {
                dlLink.parentNode.removeChild(dlLink);
              }
              window.URL.revokeObjectURL(blobUrl);
            }, 15000);
          } finally {
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
            window.scrollTo(0, savedScrollY);
          }

          showToast(
            lang === 'cs'
              ? `PDF životopis (${filename}) s aktuálními daty byl úspěšně stažen!`
              : `PDF resume (${filename}) with live data downloaded successfully!`
          );
          return;
        }
      }

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);

      showToast(
        lang === 'cs'
          ? `Vektorové PDF (${filename}) bylo úspěšně vygenerováno a staženo!`
          : `Vector PDF resume (${filename}) downloaded successfully!`
      );
    } catch (err) {
      showToast(err?.message || 'Chyba při generování PDF.', true);
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  function uploadPhotoWithProgress(compressedDataUrl, token, onProgress) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const url = 'api.php?route=profile/photo';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('X-Api-Token', token);
      }

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable && ev.total > 0) {
          const ratio = ev.loaded / ev.total;
          onProgress(Math.min(92, Math.round(35 + ratio * 57)));
        }
      };

      xhr.onload = () => {
        let json = {};
        try {
          json = JSON.parse(xhr.responseText || '{}');
        } catch (_) {}
        const entry = {
          id: Date.now() + Math.random(),
          time: new Date().toLocaleTimeString(),
          method: 'POST',
          url,
          status: xhr.status,
          ms: json?.meta?.execution_ms ?? '-',
          response: json,
        };
        setApiLogs((prev) => [entry, ...prev.slice(0, 14)]);
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300 && json.ok !== false,
          status: xhr.status,
          data: json,
        });
      };

      xhr.onerror = () => {
        resolve({ ok: false, status: 500, data: { error: 'Network error' } });
      };

      xhr.send(JSON.stringify({ photo_data_url: compressedDataUrl }));
    });
  }

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!jwtToken || !authUser) {
      setIsLoginModalOpen(true);
      showToast(
        lang === 'cs'
          ? 'Pro nahrání fotografie se nejprve přihlaste.'
          : 'Please sign in first.',
        true
      );
      return;
    }

    setIsUploadingPhoto(true);
    setPhotoUploadProgress(8);

    const reader = new FileReader();
    reader.onprogress = (ev) => {
      if (ev.lengthComputable && ev.total > 0) {
        const p = Math.round(8 + (ev.loaded / ev.total) * 18);
        setPhotoUploadProgress((prev) => Math.max(prev, p));
      }
    };
    reader.onload = (ev) => {
      const resultStr = typeof ev.target?.result === 'string' ? ev.target.result : '';
      if (!resultStr) {
        setIsUploadingPhoto(false);
        setPhotoUploadProgress(0);
        return;
      }

      setPhotoUploadProgress(28);
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const maxDim = 560;
        let w = img.width;
        let hDim = img.height;
        if (w > hDim && w > maxDim) {
          hDim = Math.round((hDim * maxDim) / w);
          w = maxDim;
        } else if (hDim >= w && hDim > maxDim) {
          w = Math.round((w * maxDim) / hDim);
          hDim = maxDim;
        }
        canvas.width = w;
        canvas.height = hDim;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, hDim);
        }
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setPhotoUploadProgress(38);

        // Smooth visual progress step alongside real XHR upload so circle progress animates cleanly
        const animTimer = setInterval(() => {
          setPhotoUploadProgress((prev) => (prev < 90 ? prev + 6 : prev));
        }, 70);

        const [upRes] = await Promise.all([
          uploadPhotoWithProgress(compressedDataUrl, jwtToken, (pct) => {
            setPhotoUploadProgress((prev) => Math.max(prev, pct));
          }),
          new Promise((r) => setTimeout(r, 650)),
        ]);

        clearInterval(animTimer);
        setPhotoUploadProgress(100);
        await new Promise((r) => setTimeout(r, 240));

        if (upRes.ok && upRes.data?.data) {
          setCvData((prev) => ({ ...prev, profile: upRes.data.data }));
          showToast(
            lang === 'cs'
              ? 'Profilová fotografie byla úspěšně nahrána přes REST API!'
              : 'Profile photo uploaded via REST API!'
          );
        } else {
          showToast(upRes.data?.error || 'Nahrání fotky selhalo.', true);
        }

        setIsUploadingPhoto(false);
        setPhotoUploadProgress(0);
      };
      img.onerror = () => {
        setIsUploadingPhoto(false);
        setPhotoUploadProgress(0);
        showToast('Nepodařilo se načíst vybraný obrázek.', true);
      };
      img.src = resultStr;
    };
    reader.readAsDataURL(file);
  }

  const profile = cvData.profile || ({});
  const roles = cvData.roles || [];
  const roleMap = useMemo(() => {
    const m = {};
    roles.forEach((r) => {
      m[r.slug] = r;
    });
    return m;
  }, [roles]);

  const filteredSkills = useMemo(() => {
    const list = cvData.skills || [];
    if (activeRole === 'all') return list;
    return list.filter((s) =>
      String(s.role_slug || '')
        .split(',')
        .map((x) => x.trim())
        .includes(activeRole)
    );
  }, [cvData.skills, activeRole]);

  const filteredExperience = useMemo(() => {
    const list = cvData.experience || [];
    if (activeRole === 'all') return list;
    return list.filter((item) =>
      String(item.role_tags || '')
        .split(',')
        .map((x) => x.trim())
        .includes(activeRole)
    );
  }, [cvData.experience, activeRole]);

  const filteredProjects = useMemo(() => {
    const list = cvData.projects || [];
    if (activeRole === 'all') return list;
    return list.filter((item) =>
      String(item.role_tags || '')
        .split(',')
        .map((x) => x.trim())
        .includes(activeRole)
    );
  }, [cvData.projects, activeRole]);

  const filteredEducation = useMemo(() => {
    const list = cvData.education || [];
    if (activeRole === 'all') return list;
    return list.filter((item) =>
      String(item.role_tags || '')
        .split(',')
        .map((x) => x.trim())
        .includes(activeRole)
    );
  }, [cvData.education, activeRole]);

  const fullName = profile.full_name || 'Jan Novák';
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || 'Jan';
  const lastName = nameParts.slice(1).join(' ') || 'Novák';
  const avatarSrc =
    profile.avatar_url && profile.avatar_url.length > 10 ? profile.avatar_url : DEFAULT_PORTRAIT_SVG;

  const pageBg = isDark ? 'bg-[#090a10] text-slate-100' : 'bg-[#f1f5f9] text-slate-900';
  const surfaceCard = isDark
    ? 'bg-[#121521] border border-white/[0.07] shadow-[0_20px_50px_rgba(0,0,0,0.45)]'
    : 'bg-white border border-slate-200 shadow-[0_12px_35px_rgba(15,23,42,0.06)]';
  const innerCard = isDark
    ? 'bg-[#181c2b] border border-white/[0.06] hover:border-purple-500/40 shadow-lg'
    : 'bg-slate-50/90 border border-slate-200 hover:border-purple-400 shadow-sm';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-600';
  const secondaryText = isDark ? 'text-slate-300' : 'text-slate-700';

  const showBackofficeFullPage = view === 'backoffice' && Boolean(authUser);
  const showLoginModal = !authUser && (isLoginModalOpen || view === 'backoffice');

  return (
    React.createElement("div", { className: `min-h-screen transition-colors duration-300 ${pageBg} pb-4 sm:pb-6 lg:pb-10 xl:p-10` }, React.createElement("input", { ref: fileInputRef, type: "file", accept: "image/*", className: "hidden", onChange: handlePhotoSelect }), toast && (
        React.createElement("div", { className: `fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-sm shadow-2xl border transition-all ${
            toast.isError
              ? 'bg-rose-600 text-white border-rose-400'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/40'
          }` }, React.createElement(Icon, { name: toast.isError ? 'error' : 'verified', className: "text-xl" }), React.createElement("span", null, toast.msg))
      ), showLoginModal && (
        React.createElement(Backoffice, { cvData: cvData, setCvData: setCvData, jwtToken: jwtToken, setJwtToken: setJwtToken, authUser: authUser, setAuthUser: setAuthUser, cryptoReport: cryptoReport, setCryptoReport: setCryptoReport, callApi: callApi, showToast: showToast, apiLogs: apiLogs, onTriggerPhotoUpload: () => fileInputRef.current?.click(), isUploadingPhoto: isUploadingPhoto, photoUploadProgress: photoUploadProgress, onCloseModal: () => {
            setIsLoginModalOpen(false);
            setView('cv');
          }, onLoginSuccess: () => {
            setIsLoginModalOpen(false);
            setView('backoffice');
          }, avatarSrc: avatarSrc, surfaceCard: surfaceCard, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText })
      ), React.createElement("div", { className: "max-w-[1460px] mx-auto flex flex-col xl:flex-row gap-4 sm:gap-7 lg:gap-9 items-start" }, React.createElement(Sidebar, { profile: profile, socials: cvData.socials || [], view: showBackofficeFullPage ? 'backoffice' : 'cv', setView: setView, activeSection: activeSection, setActiveSection: setActiveSection, onOpenBackoffice: () => {
            if (authUser) {
              setView('backoffice');
            } else {
              setIsLoginModalOpen(true);
            }
          }, isLoginModalOpen: showLoginModal, onDownloadPdf: handleDownloadPdf, isGeneratingPdf: isGeneratingPdf, lang: lang, toggleLang: toggleLang, isDark: isDark, toggleTheme: toggleTheme, t: t, surfaceCard: surfaceCard, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText }), React.createElement("div", { className: "flex-1 min-w-0 w-full px-3 sm:px-6 lg:px-10 xl:px-0" }, React.createElement("main", { className: `w-full rounded-3xl p-6 sm:p-10 lg:p-14 print-sheet transition-all ${surfaceCard}` }, showBackofficeFullPage ? (
            React.createElement(Backoffice, { cvData: cvData, setCvData: setCvData, jwtToken: jwtToken, setJwtToken: setJwtToken, authUser: authUser, setAuthUser: setAuthUser, cryptoReport: cryptoReport, setCryptoReport: setCryptoReport, callApi: callApi, showToast: showToast, apiLogs: apiLogs, onTriggerPhotoUpload: () => fileInputRef.current?.click(), isUploadingPhoto: isUploadingPhoto, photoUploadProgress: photoUploadProgress, onCloseModal: () => {
                setIsLoginModalOpen(false);
                setView('cv');
              }, onLoginSuccess: () => {
                setIsLoginModalOpen(false);
                setView('backoffice');
              }, avatarSrc: avatarSrc, surfaceCard: surfaceCard, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText })
          ) : (
            React.createElement("div", { className: "space-y-16 lg:space-y-20" }, React.createElement(HeroSection, { firstName: firstName, lastName: lastName, fullName: fullName, profile: profile, avatarSrc: avatarSrc, isUploadingPhoto: isUploadingPhoto, photoUploadProgress: photoUploadProgress, field: field, t: t, isDark: isDark, surfaceCard: surfaceCard, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText }), React.createElement(ServicesPillars, { roles: roles, activeRole: activeRole, setActiveRole: setActiveRole, field: field, t: t, isDark: isDark, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText }), React.createElement(StructuredResume, { profile: profile, roles: roles, roleMap: roleMap, activeRole: activeRole, setActiveRole: setActiveRole, filteredExperience: filteredExperience, filteredEducation: filteredEducation, filteredSkills: filteredSkills, field: field, t: t, isDark: isDark, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText }), React.createElement(FeaturedProjects, { filteredProjects: filteredProjects, profile: profile, roles: roles, roleMap: roleMap, activeRole: activeRole, setActiveRole: setActiveRole, field: field, t: t, isDark: isDark, innerCard: innerCard, mutedText: mutedText, secondaryText: secondaryText }))
          )))), isGeneratingPdf && (
        React.createElement("div", { className: "fixed inset-0 z-[9995] bg-[#090a10]/90 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-white" }, React.createElement("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-2xl" }, React.createElement(Icon, { name: "picture_as_pdf", className: "text-3xl animate-pulse" })), React.createElement("div", { className: "text-base font-extrabold tracking-tight" }, lang === 'cs'
              ? 'Generuji vektorové PDF životopisu...'
              : 'Generating vector PDF resume...'))
      ))
  );
}


  // --- src/main.tsx ---

const rootEl =
  document.getElementById('root') || document.getElementById('react-root');

if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    React.createElement(React.StrictMode, null, React.createElement(App, null))
  );
}


})();
