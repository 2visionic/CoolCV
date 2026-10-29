import React from 'react';
import Icon from './Icon';
import type {
  ProfileData,
  RolePillar,
  RoleFilter,
  ExperienceItem,
  EducationItem,
  SkillItem,
} from '../types/cv';

export interface StructuredResumeProps {
  profile: ProfileData;
  roles: RolePillar[];
  roleMap: Record<string, RolePillar>;
  activeRole: RoleFilter;
  setActiveRole: (role: RoleFilter) => void;
  filteredExperience: ExperienceItem[];
  filteredEducation: EducationItem[];
  filteredSkills: SkillItem[];
  isDark: boolean;
  field: (row: any, base: string) => string;
  t: (key: string) => string;
  innerCard: string;
  mutedText: string;
  secondaryText: string;
}

// Structured resume layout with live filtering by role pillars
export default function StructuredResume({
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
}: StructuredResumeProps): React.ReactElement {
  const pillTagClass = isDark
    ? 'bg-white/[0.06] text-slate-200 border-white/15'
    : 'bg-purple-100/90 text-purple-900 border-purple-300';

  const periodBadgeClass = isDark
    ? 'bg-purple-500/15 text-purple-300 border-purple-500/25'
    : 'bg-purple-100 text-purple-800 border-purple-300';

  return (
    <section id="sec-resume" className="space-y-8">
      <div className="flex flex-col items-start gap-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('resume_title')}</h2>
        <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${mutedText}`}>
          {t('resume_sub')}
        </p>

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-6">
            <h3 className="text-lg font-extrabold flex items-center gap-2.5">
              <Icon
                name="work_history"
                className={`text-2xl ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
              />
              <span>{t('exp_heading')}</span>
            </h3>

            <div className="space-y-6">
              {filteredExperience.map((exp) => {
                const tags = String(exp.role_tags || '')
                  .split(',')
                  .map((x) => x.trim())
                  .filter(Boolean);
                const achs = String(field(exp, 'achievements') || '')
                  .split('|')
                  .map((x) => x.trim())
                  .filter(Boolean);

                return (
                  <article key={exp.id} className={`rounded-3xl p-7 sm:p-8 transition-all print-card ${innerCard}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-xs font-mono font-extrabold ${
                          isDark ? 'text-purple-400' : 'text-purple-700'
                        }`}
                      >
                        {field(exp, 'period')}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {tags.map((slug) => (
                          <span
                            key={slug}
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${pillTagClass}`}
                          >
                            {roleMap[slug]?.badge_code || field(roleMap[slug], 'title') || slug}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h4 className="text-lg sm:text-xl font-extrabold mb-1">{field(exp, 'role')}</h4>
                    <div
                      className={`text-xs sm:text-sm font-bold mb-4 ${
                        isDark ? 'text-fuchsia-400' : 'text-fuchsia-700'
                      }`}
                    >
                      {exp.company}
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed mb-5 ${secondaryText}`}>
                      {field(exp, 'description')}
                    </p>

                    {achs.length > 0 && (
                      <ul className="space-y-2 pt-2">
                        {achs.map((ach, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium">
                            <Icon
                              name="check_circle"
                              className={`text-base shrink-0 mt-0.5 ${
                                isDark ? 'text-emerald-400' : 'text-emerald-600'
                              }`}
                            />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-lg font-extrabold flex items-center gap-2.5">
            <Icon
              name="auto_awesome"
              className={`text-2xl ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'}`}
            />
            <span>{t('skills_heading')}</span>
          </h3>

          <div className="space-y-4">
            {filteredSkills.map((skill) => {
              const skillTags = String(skill.role_slug || '')
                .split(',')
                .map((x) => x.trim())
                .filter(Boolean);

              return (
                <div key={skill.id} className={`rounded-2xl p-5 sm:p-6 print-card ${innerCard}`}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-sm">{field(skill, 'name')}</span>
                    <span
                      className={`text-xs font-mono font-extrabold shrink-0 ${
                        isDark ? 'text-purple-400' : 'text-purple-700'
                      }`}
                    >
                      {skill.proficiency}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div
                      className={`flex-1 h-2 rounded-full overflow-hidden ${
                        isDark ? 'bg-black/35' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>

                    {skillTags.length > 0 && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {skillTags.map((slug) => (
                          <span
                            key={slug}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${periodBadgeClass}`}
                          >
                            {roleMap[slug]?.badge_code || slug}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`flex items-center justify-between text-[11px] ${mutedText}`}>
                    <span className={`font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                      {skill.years_exp}
                    </span>
                    <span className="truncate max-w-[70%]">{skill.tags}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-2">
        <h3 className="text-lg font-extrabold flex items-center gap-2.5">
          <Icon
            name="school"
            className={`text-2xl ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
          />
          <span>{t('edu_heading')}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEducation.map((edu) => {
            const eduTags = String(edu.role_tags || '')
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean);

            return (
              <article key={edu.id} className={`rounded-3xl p-6 sm:p-7 print-card ${innerCard}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div
                    className={`text-xs font-mono font-extrabold ${
                      isDark ? 'text-indigo-400' : 'text-indigo-700'
                    }`}
                  >
                    {edu.period}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {eduTags.map((slug) => (
                      <span
                        key={slug}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${pillTagClass}`}
                      >
                        {roleMap[slug]?.badge_code || field(roleMap[slug], 'title') || slug}
                      </span>
                    ))}
                  </div>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold mb-1">{field(edu, 'title')}</h4>
                <div className={`text-xs font-bold mb-3 ${mutedText}`}>{field(edu, 'institution')}</div>
                <p className={`text-xs sm:text-sm leading-relaxed ${secondaryText}`}>{field(edu, 'details')}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
