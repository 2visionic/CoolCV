import React from 'react';
import Icon from './Icon.tsx';
import type { LangCode } from '../types/cv';

export interface TopbarProps {
  lang: LangCode;
  toggleLang: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  t: (key: string) => string;
  innerCard: string;
}

// Top bar inside main sheet with public switchers for language, theme and print
export default function Topbar({
  lang,
  toggleLang,
  isDark,
  toggleTheme,
  t,
  innerCard,
}: TopbarProps) {
  return (
    <header className="flex flex-wrap items-center justify-end gap-2.5 pb-6 mb-8 border-b border-white/[0.07] no-print">
      <button
        type="button"
        onClick={toggleLang}
        className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${innerCard}`}
        title="Přepnout jazyk CZ / EN"
      >
        <Icon name="translate" className="text-base text-purple-400" />
        <span>{lang.toUpperCase()}</span>
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${innerCard}`}
        title="Přepnout tmavý / světlý režim"
      >
        <Icon name={isDark ? 'light_mode' : 'dark_mode'} className="text-base text-amber-400" />
        <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 hover:opacity-95 shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all"
      >
        <Icon name="print" className="text-base" />
        <span>{t('paper_mode_btn')}</span>
      </button>
    </header>
  );
}
