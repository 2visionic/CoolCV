import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

// Standalone Light-Mode Web CV PDF template builder & Puppeteer vector PDF renderer
// Mirrors backend/pdf_template.php 1:1 with exact 16mm margins, section coordinates, and crisp #cbd5e1/#d8b4fe borders
const UI_FALLBACK = {
  cs: {
    hello: 'AHOJ, JSEM',
    tagline_1: 'Navrhuji UX zážitky a tvořím kód, který má ',
    tagline_highlight: 'Dopad.',
    years_exp: 'Let praxe v oboru',
    trusted_tech: 'Hlavní technologický stack & nástroje',
    services_title: 'Čtyři pilíře mé odbornosti',
    resume_title: 'Pracovní zkušenosti, Vzdělání & Dovednosti',
    exp_heading: 'Pracovní zkušenosti & Praxe',
    edu_heading: 'Vzdělání & Certifikace',
    skills_heading: 'Technické & UX Dovednosti',
    projects_title: 'Vybrané projekty & Případové studie',
  },
  en: {
    hello: "HELLO, I'M",
    tagline_1: 'I Design Experiences & Engineer Code That Makes an ',
    tagline_highlight: 'Impact.',
    years_exp: 'Years of Experience',
    trusted_tech: 'Core Technology Stack & Ecosystem',
    services_title: 'Services & Core Disciplines',
    resume_title: 'Work Experience, Education & Skills',
    exp_heading: 'Work Experience',
    edu_heading: 'Education & Certifications',
    skills_heading: 'Technical & UX Skills',
    projects_title: 'Featured Projects & Case Studies',
  },
};

const RAW_PORTRAIT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" fill="none">
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
</svg>`;

const DEFAULT_PORTRAIT_SVG_B64 =
  'data:image/svg+xml;base64,' + Buffer.from(RAW_PORTRAIT_SVG, 'utf-8').toString('base64');

function esc(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function field(row, base, lang) {
  if (!row) return '';
  return String(row[`${base}_${lang}`] || row[`${base}_cs`] || row[base] || '');
}

function t(profile, key, lang) {
  const normalized = key === 'hello_im' ? 'hello' : key === 'pillars_title' ? 'services_title' : key;
  const customVal = profile?.[`ui_${normalized}_${lang}`];
  if (typeof customVal === 'string' && customVal.trim() !== '') {
    return customVal.trim();
  }
  return UI_FALLBACK[lang]?.[normalized] || UI_FALLBACK.cs[normalized] || normalized;
}

function renderIcon(iconVal, extraClass = '') {
  const trim = String(iconVal || '').trim();
  if (trim.startsWith('<svg') || trim.includes('<svg')) {
    return `<span class="inline-flex items-center justify-center shrink-0 ${esc(extraClass)}" style="width:1em;height:1em;">${trim}</span>`;
  }
  return `<span class="material-symbols-rounded ${esc(extraClass)}">${esc(trim || 'code')}</span>`;
}

export function buildResumeHtml(cvData, lang = 'cs') {
  const safeLang = lang === 'en' ? 'en' : 'cs';
  const profile = cvData?.profile || {};
  const roles = Array.isArray(cvData?.roles) ? cvData.roles : [];
  const skills = Array.isArray(cvData?.skills) ? cvData.skills : [];
  const experience = Array.isArray(cvData?.experience) ? cvData.experience : [];
  const education = Array.isArray(cvData?.education) ? cvData.education : [];
  const projects = Array.isArray(cvData?.projects) ? cvData.projects : [];
  const socials = Array.isArray(cvData?.socials) ? cvData.socials : [];

  const roleMap = {};
  for (const r of roles) {
    if (r?.slug) roleMap[r.slug] = r;
  }

  const fullName = String(profile.full_name || 'Jan Novák').trim();
  const parts = fullName.split(/\s+/);
  const firstName = parts[0] || 'Jan';
  const lastName = parts.slice(1).join(' ') || 'Novák';

  const defaultStackItems = ['Figma UX/UI', 'TypeScript & ES6+', 'React 18 (.tsx)', 'PHP 8 & MySQL'];
  const stackIcons = ['draw', 'code_blocks', 'deployed_code', 'dns', 'terminal', 'auto_awesome', 'bolt', 'layers'];
  const primaryStack =
    typeof profile.primary_stack === 'string' && profile.primary_stack.trim() !== ''
      ? profile.primary_stack
      : defaultStackItems.join(', ');
  const stackItems = primaryStack
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  const avatarUrl = String(profile.avatar_url || '');
  const avatarSrc = avatarUrl.length > 10 ? avatarUrl : DEFAULT_PORTRAIT_SVG_B64;

  const positionText =
    field(profile, 'subtitle', safeLang) || 'UX Designer • JavaScript & PHP Developer • Junior C# .NET Core';
  const emailText = String(profile.email || 'jan.novak@example.cz');
  const phoneText = String(profile.phone || '+420 777 123 456');
  const phoneHref = phoneText.replace(/\s+/g, '');
  const yearsBadge = String(profile.years_exp_badge || '5+');

  const page1Skills = skills.slice(0, 6);

  const rawWebsite = String(profile.website || 'https://coolcv.example.cz').trim();
  const websiteHref = /^https?:\/\//i.test(rawWebsite) ? rawWebsite : `https://${rawWebsite}`;
  const websiteClean = rawWebsite.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  const websiteDisplay = websiteClean.toLowerCase().startsWith('www.') ? websiteClean : `www.${websiteClean}`;

  const projGradients = [
    'from-indigo-500/15 via-purple-500/10 to-indigo-100/80 border-b border-[#eeeeee]',
    'from-fuchsia-500/15 via-purple-500/10 to-fuchsia-100/80 border-b border-[#eeeeee]',
    'from-emerald-500/15 via-teal-500/10 to-teal-100/80 border-b border-[#eeeeee]',
    'from-blue-500/15 via-indigo-500/10 to-blue-100/80 border-b border-[#eeeeee]',
  ];
  const projIcons = ['dashboard', 'receipt_long', 'inventory_2', 'badge'];

  const activeSocials =
    socials.length > 0
      ? socials
      : [
          { title: 'Web', url: websiteHref, icon: 'public' },
          { title: 'GitHub', url: String(profile.github || 'https://github.com'), icon: 'code' },
          { title: 'LinkedIn', url: String(profile.linkedin || 'https://linkedin.com'), icon: 'work' },
          { title: 'E-mail', url: `mailto:${emailText}`, icon: 'mail' },
        ];

  return `<!DOCTYPE html>
<html lang="${esc(safeLang)}" data-theme="light">
<head>
  <meta charset="UTF-8">
  <title>${esc(fullName)} — CV (${esc(safeLang.toUpperCase())})</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Montserrat', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    };
  </script>
  <style>
    @page {
      size: A4 portrait;
      margin: 16mm;
    }
    html, body {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      margin: 0;
      padding: 0;
    }
    img {
      display: inline-block !important;
    }
    .pdf-sheet {
      width: 100%;
      margin: 0 auto;
    }
    @media screen {
      body {
        width: 794px;
        margin: 0;
        padding: 0;
        background-color: #ffffff;
      }
      .pdf-sheet {
        width: 794px !important;
        height: 1123px !important;
        min-height: 1123px !important;
        max-height: 1123px !important;
        padding: 54px 58px !important;
        box-sizing: border-box !important;
        background-color: #ffffff !important;
        overflow: hidden !important;
      }
    }
    @media print {
      .pdf-sheet {
        width: 100% !important;
        padding: 0 !important;
      }
    }
    .material-symbols-rounded {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      user-select: none;
      line-height: 1;
    }
    .hero-portrait-aura {
      background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%);
    }
    .cv-card {
      background-color: #ffffff;
      border: none;
      box-shadow: 0 2px 10px rgba(15, 23, 42, 0.055), 0 1px 2px rgba(15, 23, 42, 0.035);
    }
    .exp-divider {
      border-bottom: 1px solid #eeeeee;
    }
    .two-col-resume {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 264px;
      column-gap: 44px;
      align-items: start;
    }
    .avoid-break {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
    }
  </style>
</head>
<body class="bg-white text-slate-900 antialiased">

  <!-- ==================== STRANA 1 ==================== -->
  <div id="pdf-page-1" class="pdf-sheet">

    <!-- 1. HERO SEKCE -->
    <section class="avoid-break">
      <div style="display: grid; grid-template-columns: minmax(0, 1fr) 190px; column-gap: 28px; align-items: start;">
        <div style="padding-top: 2px; min-width: 0;">
          <div style="display: flex; flex-wrap: wrap; align-items: center; column-gap: 18px; row-gap: 6px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-rounded" style="font-size: 13.5px; color: #4f46e5;">call</span>
              <a href="tel:${esc(phoneHref)}" style="font-size: 10px; font-weight: 800; color: #0f172a; text-decoration: none;">
                ${esc(phoneText)}
              </a>
            </div>

            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-rounded" style="font-size: 13.5px; color: #c026d3;">mail</span>
              <a href="mailto:${esc(emailText)}" style="font-size: 10px; font-weight: 800; color: #0f172a; text-decoration: none;">
                ${esc(emailText)}
              </a>
            </div>
          </div>

          <h1 style="font-size: 38px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.02; margin: 0 0 3px 0;">
            <span class="text-slate-900">${esc(firstName)} </span>
            <span style="color: #7c3aed;">${esc(lastName)}</span>
          </h1>

          <div style="font-size: 11.4px; font-weight: 700; color: #7c3aed; line-height: 1.3; margin-bottom: 14px;">
            ${esc(positionText)}
          </div>

          <p style="font-size: 14.5px; font-weight: 800; line-height: 1.25; color: #0f172a; margin: 0 0 10px 0;">
            <span>${esc(t(profile, 'tagline_1', safeLang).trimEnd() + ' ')}</span>
            <span style="color: #c026d3;">${esc(t(profile, 'tagline_highlight', safeLang))}</span>
          </p>

          <p style="font-size: 10.2px; line-height: 1.52; color: #64748b; margin: 0;">
            ${esc(field(profile, 'bio', safeLang))}
          </p>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; margin-top: -4px;">
          <div style="position: relative; width: 184px; height: 184px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <div class="hero-portrait-aura" style="position: absolute; inset: 6px; border-radius: 9999px; opacity: 0.9; filter: blur(3px); box-shadow: 0 10px 26px rgba(139, 92, 246, 0.26);"></div>

            <div style="position: relative; width: 86%; height: 86%; border-radius: 9999px; overflow: hidden; border: 3px solid #ffffff; background-color: #f1f5f9; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08); display: flex; align-items: flex-end; justify-content: center;">
              ${
                avatarUrl.length > 10 && !avatarUrl.startsWith('data:image/svg')
                  ? `<img src="${esc(avatarSrc)}" alt="${esc(fullName)}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">`
                  : RAW_PORTRAIT_SVG.replace('<svg ', '<svg style="width:100%;height:100%;display:block;" ')
              }
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. PILÍŘE ODBORNOSTI -->
    ${
      roles.length > 0
        ? `
      <section class="avoid-break" style="margin-top: 32px; margin-bottom: 42px;">
        <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); column-gap: 12px; row-gap: 10px;">
          ${roles
            .map(
              (role) => `
            <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
              <div style="width: 30px; height: 30px; border-radius: 9999px; background-color: #f3e8ff; border: 1px solid #d8b4fe; color: #7c3aed; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${renderIcon(role.icon || 'code', 'text-[13.5px]')}
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 1px; min-width: 0;">
                <h3 style="font-size: 9.8px; font-weight: 800; color: #0f172a; line-height: 1.15; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
                  ${esc(field(role, 'title', safeLang))}
                </h3>
                <span style="font-size: 8px; font-weight: 700; color: #7c3aed; line-height: 1.15;">
                  ${esc(field(role, 'level', safeLang))}
                </span>
              </div>
            </div>`
            )
            .join('')}
        </div>
      </section>`
        : ''
    }

    <!-- 3. DVOUSLOUPCOVÁ SEKCE NA STRANĚ 1 -->
    <section>
      <div class="two-col-resume">
        <div>
          <h2 style="font-size: 12.2px; font-weight: 800; color: #0f172a; margin: 0 0 22px 0; line-height: 1.2;">
            ${esc(t(profile, 'exp_heading', safeLang))}
          </h2>

          <div>
            ${experience
              .slice(0, 3)
              .map((exp, expIdx, arr) => {
                const expTags = String(exp.role_tags || '')
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean);
                const achs = field(exp, 'achievements', safeLang)
                  .split('|')
                  .map((s) => s.trim())
                  .filter(Boolean);
                const firstAch = achs[0] || '';
                const isLastExp = expIdx === arr.length - 1;
                const padStyle =
                  expIdx === 0
                    ? 'padding-bottom: 22px;'
                    : isLastExp
                      ? 'padding-top: 22px;'
                      : 'padding: 22px 0;';
                return `
              <article class="${isLastExp ? '' : 'exp-divider'} avoid-break" style="${padStyle}">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 10px;">
                  <span style="font-size: 9.2px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #7c3aed;">
                    ${esc(field(exp, 'period', safeLang))}
                  </span>
                  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 4px;">
                    ${expTags
                      .map((slug) => {
                        const badgeLabel =
                          roleMap[slug]?.badge_code || field(roleMap[slug], 'title', safeLang) || slug;
                        return `<span style="padding: 1.5px 6.5px; border-radius: 9999px; font-size: 7.8px; font-weight: 700; background-color: #f5f3ff; color: #581c87; border: 1px solid #d8b4fe;">${esc(badgeLabel)}</span>`;
                      })
                      .join('')}
                  </div>
                </div>

                <h3 style="font-size: 12.8px; font-weight: 800; color: #0f172a; line-height: 1.26; margin: 0 0 3px 0;">
                  ${esc(field(exp, 'role', safeLang))}
                </h3>
                <div style="font-size: 9.5px; font-weight: 700; color: #c026d3; margin-bottom: 8px;">
                  ${esc(exp.company || '')}
                </div>
                <p style="font-size: 9.3px; line-height: 1.46; color: #64748b; margin: 0 0 10px 0;">
                  ${esc(field(exp, 'description', safeLang))}
                </p>

                ${
                  firstAch
                    ? `<div style="display: flex; align-items: flex-start; gap: 6px; font-size: 9.3px; font-weight: 600; color: #1e293b; line-height: 1.36;">
                    <span class="material-symbols-rounded" style="font-size: 12.5px; color: #16a34a; flex-shrink: 0; margin-top: 1px;">check_circle</span>
                    <span>${esc(firstAch)}</span>
                  </div>`
                    : ''
                }
              </article>`;
              })
              .join('')}
          </div>
        </div>

        <div style="padding-top: 38px; display: flex; flex-direction: column; gap: 14px;">
          ${page1Skills
            .map((skill) => {
              const skillTags = String(skill.role_slug || '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
              const prof = Math.max(0, Math.min(100, Number(skill.proficiency || 0)));
              return `
            <div class="cv-card avoid-break" style="border-radius: 14px; padding: 11px 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 5px;">
                <span style="font-size: 9.4px; font-weight: 800; color: #0f172a; line-height: 1.3;">${esc(field(skill, 'name', safeLang))}</span>
                <span style="font-size: 9px; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #7c3aed; flex-shrink: 0;">${prof}%</span>
              </div>

              <div style="display: flex; align-items: center; gap: 7px; margin-bottom: 6px;">
                <div style="flex: 1; height: 5px; border-radius: 9999px; overflow: hidden; background-color: #e2e8f0;">
                  <div style="height: 100%; border-radius: 9999px; background: linear-gradient(90deg, #d946ef 0%, #a855f7 50%, #6366f1 100%); width: ${prof}%;"></div>
                </div>
                ${
                  skillTags.length > 0
                    ? `<div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                    ${skillTags
                      .map((slug) => {
                        const badgeLabel = roleMap[slug]?.badge_code || slug;
                        return `<span style="padding: 1.5px 6.5px; border-radius: 9999px; font-size: 7.6px; font-weight: 700; background-color: #f5f3ff; color: #6b21a8; border: 1px solid #d8b4fe; white-space: nowrap; line-height: 1.2;">${esc(badgeLabel)}</span>`;
                      })
                      .join('')}
                  </div>`
                    : ''
                }
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 8.2px; color: #94a3b8;">
                <span style="font-weight: 700; color: #7c3aed;">${esc(skill.years_exp || '')}</span>
                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 72%;">${esc(skill.tags || '')}</span>
              </div>
            </div>`;
            })
            .join('')}

          <div style="padding-top: 2px; text-align: right; font-size: 9px; font-weight: 700; color: #64748b;">
            ${safeLang === 'en' ? '...and many more at ' : '...a mnoho dalších na '}
            <a href="${esc(websiteHref)}" target="_blank" rel="noopener noreferrer" style="color: #7c3aed; font-weight: 800; text-decoration: none;">
              ${esc(websiteDisplay)}
            </a>
          </div>
        </div>
      </div>
    </section>

  </div>

  <!-- ==================== STRANA 2 ==================== -->
  <div id="pdf-page-2" class="pdf-sheet page-break">

    <!-- 1. VZDĚLÁNÍ & CERTIFIKACE (2 sloupce 50/50) -->
    ${
      education.length > 0
        ? `
      <section class="avoid-break">
        <h2 style="font-size: 12.2px; font-weight: 800; color: #0f172a; margin: 0 0 20px 0; line-height: 1.2;">
          ${esc(t(profile, 'edu_heading', safeLang))}
        </h2>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); column-gap: 36px; row-gap: 20px;">
          ${education
            .map((edu) => {
              const eduTags = String(edu.role_tags || '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
              return `
            <article class="exp-divider avoid-break" style="padding-bottom: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 8px;">
                <span style="font-size: 9px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #7c3aed;">
                  ${esc(edu.period || '')}
                </span>
                <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 4px;">
                  ${eduTags
                    .map((slug) => {
                      const badgeLabel =
                        roleMap[slug]?.badge_code || field(roleMap[slug], 'title', safeLang) || slug;
                      return `<span style="padding: 1.5px 6.5px; border-radius: 9999px; font-size: 7.8px; font-weight: 700; background-color: #f5f3ff; color: #581c87; border: 1px solid #d8b4fe;">${esc(badgeLabel)}</span>`;
                    })
                    .join('')}
                </div>
              </div>
              <h3 style="font-size: 12px; font-weight: 800; color: #0f172a; line-height: 1.28; margin: 0 0 3px 0;">
                ${esc(field(edu, 'title', safeLang))}
              </h3>
              <div style="font-size: 9.2px; font-weight: 700; color: #c026d3; margin-bottom: 6px;">
                ${esc(field(edu, 'institution', safeLang))}
              </div>
              <p style="font-size: 9px; line-height: 1.44; color: #64748b; margin: 0;">
                ${esc(field(edu, 'details', safeLang))}
              </p>
            </article>`;
            })
            .join('')}
        </div>
      </section>`
        : ''
    }

    <!-- 2. VYBRANÉ PROJEKTY & PŘÍPADOVÉ STUDIE -->
    ${
      projects.length > 0
        ? `
      <section class="avoid-break" style="margin-top: 36px;">
        <h2 style="font-size: 12px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">
          ${esc(t(profile, 'projects_title', safeLang))}
        </h2>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          ${projects
            .slice(0, 6)
            .map((proj, idx) => {
              const projTags = String(proj.role_tags || '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
              const gradClass = projGradients[idx % projGradients.length];
              const projIcon = projIcons[idx % projIcons.length];
              const demoUrl = String(proj.demo_url || '').trim();
              const hasValidDemo = demoUrl !== '' && !demoUrl.startsWith('#');
              const demoHref = /^https?:\/\//i.test(demoUrl) ? demoUrl : `https://${demoUrl}`;
              const demoLabel = demoUrl.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
              return `
            <article class="cv-card avoid-break" style="border-radius: 14px; border: 1px solid #eee; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="padding: 10px; background-color: #f8fafc; border-bottom: 1px solid #eee; display: flex; flex-direction: column; justify-content: space-between; gap: 6px;">
                  <div style="display: flex; flex-wrap: wrap; gap: 4px; width: 100%;">
                    ${projTags
                      .map((slug) => {
                        const badgeLabel =
                          roleMap[slug]?.badge_code || field(roleMap[slug], 'title', safeLang) || slug;
                        return `<span style="padding: 1.5px 6px; border-radius: 9999px; font-size: 7.5px; font-weight: 700; background-color: #ffffff; border: 1px solid #d8b4fe; color: #581c87;">${esc(badgeLabel)}</span>`;
                      })
                      .join('')}
                  </div>

                  <div style="width: 100%; box-sizing: border-box; border-radius: 7px; padding: 4px 7px; font-size: 7.5px; line-height: 1.35; font-family: 'JetBrains Mono', monospace; white-space: normal; word-break: break-word; background-color: #ffffff; border: 1px solid #e9d5ff; color: #1e293b; font-weight: 600;">
                    ${esc(proj.tech_stack || '')}
                  </div>
                </div>

                <div style="padding: 10px; display: flex; flex-direction: column; gap: 3.5px;">
                  <div style="font-size: 8px; font-weight: 700; color: #7c3aed;">${esc(field(proj, 'subtitle', safeLang))}</div>
                  <h3 style="font-size: 10.5px; font-weight: 800; color: #0f172a; line-height: 1.25; margin: 0;">${esc(field(proj, 'title', safeLang))}</h3>

                  ${
                    hasValidDemo
                      ? `<div>
                      <a href="${esc(demoHref)}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; font-size: 8.2px; font-weight: 700; color: #4f46e5; text-decoration: none;">
                        <span class="material-symbols-rounded" style="font-size: 10px;">public</span>
                        <span style="text-decoration: none;">${esc(demoLabel)}</span>
                        <span class="material-symbols-rounded" style="font-size: 8.5px; opacity: 0.75;">open_in_new</span>
                      </a>
                    </div>`
                      : ''
                  }

                  <p style="font-size: 8.2px; line-height: 1.4; color: #64748b; margin: 1px 0 0 0;">
                    ${esc(field(proj, 'description', safeLang))}
                  </p>
                </div>
              </div>
            </article>`;
            })
            .join('')}
        </div>
      </section>`
        : ''
    }

    <!-- 3. ODKAZY NA SÍTĚ NA KONCI DOKUMENTU -->
    ${
      activeSocials.length > 0
        ? `
      <footer class="avoid-break" style="margin-top: 38px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; column-gap: 22px; row-gap: 10px;">
          ${activeSocials
            .map((soc) => {
              const socTitle = String(soc.title || 'Odkaz').trim();
              const rawSocUrl = String(soc.url || '').trim();
              let socHref = websiteHref;
              let socDisplay = websiteDisplay;
              if (rawSocUrl !== '' && !rawSocUrl.startsWith('#')) {
                if (rawSocUrl.toLowerCase().startsWith('mailto:')) {
                  socHref = rawSocUrl;
                  socDisplay = rawSocUrl.slice(7);
                } else if (rawSocUrl.toLowerCase().startsWith('tel:')) {
                  socHref = rawSocUrl;
                  socDisplay = rawSocUrl.slice(4);
                } else {
                  socHref = /^https?:\/\//i.test(rawSocUrl) ? rawSocUrl : `https://${rawSocUrl}`;
                  socDisplay = rawSocUrl.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
                }
              }
              const socIcon = String(soc.icon || 'public');
              return `
            <a href="${esc(socHref)}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 7px; text-decoration: none;">
              <span style="width: 24px; height: 24px; border-radius: 9999px; background-color: #f3e8ff; border: 1px solid #d8b4fe; color: #7c3aed; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${renderIcon(socIcon, 'text-[12px]')}
              </span>
              <span style="display: inline-flex; align-items: baseline; gap: 4px; font-size: 8.8px; line-height: 1.2;">
                ${socTitle ? `<span style="font-weight: 800; color: #0f172a;">${esc(socTitle)}:</span>` : ''}
                <span style="font-weight: 700; color: #7c3aed;">${esc(socDisplay)}</span>
              </span>
            </a>`;
            })
            .join('')}
        </div>
      </footer>`
        : ''
    }

  </div>

</body>
</html>`;
}

function findChromeExecutable() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error('Nebyl nalezen prohlížeč Chrome ani Edge pro Puppeteer renderování PDF.');
}

export async function renderResumePdfBuffer(cvData, lang = 'cs') {
  const executablePath = findChromeExecutable();
  const html = buildResumeHtml(cvData, lang);
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, 250));
    const pdfBytes = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '16mm',
        right: '16mm',
        bottom: '16mm',
        left: '16mm',
      },
    });
    return Buffer.from(pdfBytes);
  } finally {
    await browser.close();
  }
}
