import React, { useState } from 'react';
import Icon from './Icon.tsx';
import type { AppView, LangCode, ProfileData, SocialItem } from '../types/cv';

export interface SidebarProps {
  profile: ProfileData;
  socials: SocialItem[];
  view: AppView;
  setView: (v: AppView) => void;
  activeSection: string;
  setActiveSection: (s: string) => void;
  onOpenBackoffice: () => void;
  isLoginModalOpen: boolean;
  onDownloadPdf: () => void;
  isGeneratingPdf?: boolean;
  lang: LangCode;
  toggleLang: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  t: (key: string) => string;
  surfaceCard: string;
  innerCard: string;
  mutedText: string;
  secondaryText: string;
}

interface NavItem {
  id: string;
  icon: string;
  label: string;
  targetView: AppView;
}

// Left navigation sidebar, on smaller screen it floats on top with hamburger toggle
export default function Sidebar({
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
}: SidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navItems: NavItem[] = [
    { id: 'home', icon: 'home', label: t('nav_home'), targetView: 'cv' },
    { id: 'pillars', icon: 'design_services', label: t('nav_pillars'), targetView: 'cv' },
    { id: 'resume', icon: 'description', label: t('nav_resume'), targetView: 'cv' },
    { id: 'portfolio', icon: 'folder_open', label: t('nav_portfolio'), targetView: 'cv' },
    { id: 'backoffice', icon: 'admin_panel_settings', label: t('nav_backoffice'), targetView: 'backoffice' },
  ];

  const defaultSocials: SocialItem[] = [
    { id: 1, icon: 'language', url: profile.website || '#top', title: 'Portfolio Web' },
    { id: 2, icon: 'code', url: profile.github || 'https://github.com', title: 'GitHub' },
    { id: 3, icon: 'work', url: profile.linkedin || 'https://linkedin.com', title: 'LinkedIn' },
    { id: 4, icon: 'mail', url: `mailto:${profile.email || ''}`, title: 'Email' },
  ];

  const activeSocials = socials && socials.length > 0 ? socials : defaultSocials;
  const dividerBorder = isDark ? 'border-white/[0.07]' : 'border-slate-200';
  const iconAccent = isDark ? 'text-purple-400' : 'text-purple-600';

  return (
    <aside
      className={`w-full xl:w-[300px] shrink-0 rounded-none xl:rounded-3xl border-t-0 border-x-0 xl:border px-4 py-3 sm:px-6 sm:py-3.5 xl:p-7 sticky top-0 xl:top-8 z-40 backdrop-blur-xl no-print transition-all ${surfaceCard}`}
    >
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleLang}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${innerCard}`}
          title={lang === 'cs' ? 'Přepnout jazyk CS → EN' : 'Switch language EN → CS'}
        >
          <Icon name="translate" className={`text-base ${iconAccent}`} />
          <span>{lang === 'cs' ? 'CS' : 'EN'}</span>
          <Icon name="arrow_forward" className="text-sm opacity-60" />
          <span className="opacity-75">{lang === 'cs' ? 'EN' : 'CS'}</span>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${innerCard}`}
          title="Přepnout tmavý / světlý režim"
        >
          <Icon name={isDark ? 'light_mode' : 'dark_mode'} className={`text-base ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          title={isMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
          className={`xl:hidden w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all ${innerCard}`}
        >
          <span className="relative w-5 h-4 block">
            <span
              className={`block absolute left-0 w-5 h-[2px] rounded-full bg-current transition-all duration-300 ease-in-out origin-center ${
                isMenuOpen ? 'top-[7px] rotate-45' : 'top-[1px] rotate-0'
              }`}
            />
            <span
              className={`block absolute left-0 top-[7px] w-5 h-[2px] rounded-full bg-current transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              }`}
            />
            <span
              className={`block absolute left-0 w-5 h-[2px] rounded-full bg-current transition-all duration-300 ease-in-out origin-center ${
                isMenuOpen ? 'top-[7px] -rotate-45' : 'top-[13px] rotate-0'
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out xl:overflow-visible xl:max-h-none xl:opacity-100 xl:mt-5 ${
          isMenuOpen ? 'max-h-[640px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0 xl:mt-5'
        }`}
      >
        <nav className="flex flex-col gap-1.5 xl:gap-2">
          {navItems.map((item) => {
            const isActive =
              item.targetView === 'backoffice'
                ? view === 'backoffice' || isLoginModalOpen
                : view === 'cv' && !isLoginModalOpen && activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
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
                }}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-purple-600/30 via-fuchsia-600/20 to-transparent text-purple-300 border border-purple-500/30 shadow-sm'
                      : 'bg-gradient-to-r from-purple-500/15 via-fuchsia-500/10 to-transparent text-purple-900 border border-purple-300 shadow-sm font-bold'
                    : `${secondaryText} ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-200/60'}`
                }`}
              >
                <Icon
                  name={item.icon}
                  filled={isActive}
                  className={`text-xl ${
                    isActive ? (isDark ? 'text-fuchsia-400' : 'text-purple-700') : mutedText
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-4 xl:mt-6 flex flex-col sm:flex-row xl:flex-col gap-3">
          <a
            href={`mailto:${profile.email || 'jan.novak@example.cz'}`}
            onClick={() => setIsMenuOpen(false)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow-lg shadow-purple-500/25 transition-all"
          >
            <Icon name="mail" className="text-base" />
            <span>{t('hire_me')}</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onDownloadPdf();
            }}
            disabled={isGeneratingPdf}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all disabled:opacity-60 ${innerCard}`}
          >
            <Icon
              name={isGeneratingPdf ? 'progress_activity' : 'picture_as_pdf'}
              className={`text-base ${iconAccent} ${isGeneratingPdf ? 'animate-spin' : ''}`}
            />
            <span>
              {isGeneratingPdf
                ? lang === 'cs'
                  ? 'Generuji PDF...'
                  : 'Generating PDF...'
                : t('download_cv')}
            </span>
          </button>
        </div>

        {activeSocials.length > 0 && (
          <div className={`mt-4 xl:mt-6 pt-4 xl:pt-6 border-t ${dividerBorder} flex flex-wrap items-center justify-center gap-2.5`}>
            {activeSocials.map((soc, i) => (
              <a
                key={soc.id || i}
                href={soc.url}
                target={String(soc.url || '').startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                title={soc.title}
                aria-label={soc.title}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${innerCard}`}
              >
                <Icon name={soc.icon} className={`text-lg ${iconAccent}`} />
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
