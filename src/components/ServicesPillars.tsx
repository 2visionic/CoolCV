import React from 'react';
import Icon from './Icon.tsx';
import type { RolePillar } from '../types/cv';

export interface ServicesPillarsProps {
  roles: RolePillar[];
  activeRole: string;
  setActiveRole: (slug: string) => void;
  isDark: boolean;
  field: (row: Record<string, any> | undefined, base: string) => string;
  t: (key: string) => string;
  innerCard: string;
  mutedText: string;
  secondaryText: string;
}

// Section with 4 main pillars in 2x2 grid on desktop and 1x1 on mobile
export default function ServicesPillars({
  roles,
  activeRole,
  setActiveRole,
  isDark,
  field,
  t,
  innerCard,
  mutedText,
  secondaryText,
}: ServicesPillarsProps) {
  return (
    <section id="sec-pillars" className="space-y-8">
      <div className="flex flex-col items-start gap-2.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('services_title')}</h2>
        <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${mutedText}`}>{t('services_sub')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
        {roles.map((role) => {
          const isSelected = activeRole === role.slug;
          return (
            <article
              key={role.id}
              onClick={() => setActiveRole(isSelected ? 'all' : role.slug)}
              className={`cursor-pointer rounded-3xl p-7 sm:p-8 transition-all duration-200 flex flex-col justify-between print-card ${innerCard} ${
                isSelected ? 'ring-2 ring-purple-500 bg-purple-500/[0.08]' : 'hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br border flex items-center justify-center shadow-inner ${
                      isDark
                        ? 'from-fuchsia-500/20 via-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400'
                        : 'from-fuchsia-500/15 via-purple-500/15 to-indigo-500/15 border-purple-300 text-purple-700'
                    }`}
                  >
                    <Icon name={role.icon || 'code'} className="text-2xl" />
                  </div>
                  <span
                    className={`text-[11px] font-extrabold uppercase tracking-wider ${
                      isDark ? 'text-purple-300' : 'text-purple-700'
                    }`}
                  >
                    {field(role, 'level')}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold mb-3">{field(role, 'title')}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${secondaryText}`}>
                  {field(role, 'summary')}
                </p>
              </div>

              <div
                className={`pt-2 flex items-center justify-between text-xs font-bold no-print ${
                  isDark ? 'text-purple-400' : 'text-purple-700'
                }`}
              >
                <span>{isSelected ? '✓ Aktivní filtr' : t('filter_active')}</span>
                <Icon name="arrow_forward" className="text-base" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
