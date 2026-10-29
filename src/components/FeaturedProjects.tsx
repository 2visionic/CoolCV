import React from 'react';
import Icon from './Icon';
import type { ProjectItem, ProfileData, RolePillar, RoleFilter } from '../types/cv';

export interface FeaturedProjectsProps {
  filteredProjects: ProjectItem[];
  profile: ProfileData;
  roles: RolePillar[];
  roleMap: Record<string, RolePillar>;
  activeRole: RoleFilter;
  setActiveRole: (role: RoleFilter) => void;
  isDark: boolean;
  field: (row: any, base: string) => string;
  t: (key: string) => string;
  innerCard: string;
  mutedText: string;
  secondaryText: string;
}

// Featured projects section and bottom statistics banner
export default function FeaturedProjects({
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
}: FeaturedProjectsProps): React.ReactElement {
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
    <>
      <section id="sec-portfolio" className="space-y-8">
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('projects_title')}</h2>
          <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${mutedText}`}>{t('projects_sub')}</p>

          <div className="flex flex-wrap items-center gap-2 pt-2 no-print">
            <button
              type="button"
              onClick={() => setActiveRole('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'all'
                  ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-md'
                  : innerCard
              }`}
            >
              {t('filter_all')}
            </button>

            {roles.map((r) => (
              <button
                key={r.slug}
                type="button"
                onClick={() => setActiveRole(r.slug)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeRole === r.slug
                    ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-md'
                    : innerCard
                }`}
              >
                <Icon name={r.icon || 'code'} className="text-base" />
                <span>{r.badge_code}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8">
          {filteredProjects.map((proj, idx) => {
            const tags = String(proj.role_tags || '')
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean);

            return (
              <article
                key={proj.id}
                className={`rounded-3xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 print-card ${innerCard}`}
              >
                <div>
                  <div
                    className={`h-44 p-6 bg-gradient-to-br ${
                      gradients[idx % gradients.length]
                    } flex flex-col justify-between relative overflow-hidden no-print`}
                  >
                    <div className="flex items-start justify-between gap-2 z-10">
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((slug) => (
                          <span
                            key={slug}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border ${
                              isDark
                                ? 'bg-black/45 text-white border-white/15'
                                : 'bg-white/90 text-purple-900 border-purple-300/80 shadow-sm'
                            }`}
                          >
                            {roleMap[slug]?.badge_code || field(roleMap[slug], 'title') || slug}
                          </span>
                        ))}
                      </div>
                      <Icon
                        name={icons[idx % icons.length]}
                        className={`text-3xl shrink-0 ${isDark ? 'text-white/80' : 'text-purple-700/80'}`}
                      />
                    </div>
                    <div
                      className={`w-full backdrop-blur-md rounded-xl p-3 border text-xs font-mono truncate z-10 ${
                        isDark
                          ? 'bg-black/45 border-white/10 text-white/90'
                          : 'bg-white/90 border-purple-200 text-slate-800 font-semibold shadow-sm'
                      }`}
                    >
                      {proj.tech_stack}
                    </div>
                  </div>

                  <div className="p-7 sm:p-8 space-y-2.5">
                    <div className={`text-xs font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                      {field(proj, 'subtitle')}
                    </div>
                    <h3 className="text-xl font-extrabold">{field(proj, 'title')}</h3>
                    {proj.demo_url && !String(proj.demo_url).startsWith('#') && (
                      <div className="pt-0.5">
                        <a
                          href={
                            /^https?:\/\//i.test(String(proj.demo_url))
                              ? String(proj.demo_url)
                              : `https://${proj.demo_url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 text-xs font-bold hover:underline ${
                            isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-700 hover:text-indigo-900'
                          }`}
                        >
                          <Icon name="language" className="text-sm" />
                          <span>{String(proj.demo_url).replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')}</span>
                          <Icon name="open_in_new" className="text-xs opacity-75" />
                        </a>
                      </div>
                    )}
                    <p className={`text-xs sm:text-sm leading-relaxed pb-2 ${secondaryText}`}>
                      {field(proj, 'description')}
                    </p>
                    <div
                      className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-start gap-2.5 ${
                        isDark
                          ? 'bg-purple-500/10 border-purple-500/20'
                          : 'bg-purple-50 border-purple-200 text-slate-800'
                      }`}
                    >
                      <Icon
                        name="trending_up"
                        className={`text-lg shrink-0 mt-0.5 ${
                          isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'
                        }`}
                      />
                      <span>{field(proj, 'outcome')}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-rose-500 via-fuchsia-600 to-indigo-600 text-white shadow-2xl shadow-purple-900/30 no-print">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((st, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
                <Icon name={st.icon} className="text-3xl text-white" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold leading-none mb-1">{st.num}</div>
                <div className="text-xs font-medium text-white/90">{st.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
