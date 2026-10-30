import React from 'react';
import Icon from './Icon.tsx';
import type { ProfileData } from '../types/cv';

export interface HeroSectionProps {
  firstName: string;
  lastName: string;
  fullName: string;
  profile: ProfileData;
  avatarSrc: string;
  isUploadingPhoto?: boolean;
  photoUploadProgress?: number;
  isDark: boolean;
  field: (row: Record<string, any> | undefined, base: string) => string;
  t: (key: string) => string;
  surfaceCard: string;
  innerCard: string;
  mutedText: string;
  secondaryText: string;
}

// Hero section with avatar, circular upload progress, 3 contact items under it, and main tech stack
export default function HeroSection({
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
}: HeroSectionProps) {
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
    <section id="sec-home" className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-8 space-y-5">
          <div>
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border ${
                isDark
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/25'
                  : 'bg-purple-100/90 text-purple-800 border-purple-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{field(profile, 'availability')}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
              <span>{firstName} </span>
              <span
                className={`bg-gradient-to-r bg-clip-text text-transparent ${
                  isDark
                    ? 'from-purple-400 via-fuchsia-400 to-indigo-400'
                    : 'from-purple-600 via-fuchsia-600 to-indigo-600'
                }`}
              >
                {lastName}
              </span>
            </h1>

            <div className={`text-base sm:text-lg font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
              {positionText}
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-bold leading-snug max-w-3xl">
            {t('tagline_1').trimEnd()}{' '}
            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isDark ? 'from-fuchsia-400 to-purple-400' : 'from-fuchsia-600 to-purple-600'
              }`}
            >
              {t('tagline_highlight')}
            </span>
          </p>

          <p className={`text-sm sm:text-base leading-relaxed max-w-3xl ${secondaryText}`}>
            {field(profile, 'bio')}
          </p>

          <div className="pt-2 no-print">
            <a
              href="#sec-resume"
              className="inline-flex px-7 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 hover:opacity-95 shadow-xl shadow-purple-500/25 items-center gap-2.5 transition-all"
            >
              <span>{t('cta_work')}</span>
              <Icon name="arrow_forward" className="text-lg" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center gap-6 w-full">
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 lg:w-64 lg:h-64 flex items-center justify-center shrink-0">
            <div className="absolute inset-3 rounded-full hero-portrait-aura opacity-90 blur-[2px] shadow-2xl shadow-purple-600/30" />

            {isUploadingPhoto && (
              <svg
                className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)] -rotate-90 pointer-events-none z-20"
                viewBox="0 0 120 120"
              >
                <defs>
                  <linearGradient id="heroAvatarProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(168, 85, 247, 0.22)"
                  strokeWidth="4.5"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#heroAvatarProgressGrad)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeDasharray="339.29"
                  strokeDashoffset={339.29 - (339.29 * Math.min(100, Math.max(0, photoUploadProgress))) / 100}
                  className="transition-all duration-100 ease-out"
                />
              </svg>
            )}

            <div
              className={`relative w-[86%] h-[86%] rounded-full overflow-hidden border-4 flex items-end justify-center ${
                isDark ? 'border-white/15 bg-[#151828] shadow-inner' : 'border-white bg-slate-100 shadow-lg'
              }`}
            >
              <img
                src={avatarSrc}
                alt={fullName}
                className="w-full h-full object-cover object-center"
              />

              {isUploadingPhoto && (
                <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full bg-fuchsia-400 animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-3 h-3 rounded-full bg-purple-400 animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold font-mono text-white tracking-wider">
                    {`${Math.round(photoUploadProgress)}%`}
                  </span>
                </div>
              )}
            </div>

            <div className={`absolute -bottom-2 -right-2 px-4 py-3 rounded-2xl backdrop-blur-xl ${surfaceCard} text-center`}>
              <div
                className={`text-2xl sm:text-3xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent ${
                  isDark ? 'from-fuchsia-400 to-indigo-400' : 'from-fuchsia-600 to-indigo-600'
                }`}
              >
                {profile.years_exp_badge || '5+'}
              </div>
              <div className={`text-[11px] font-semibold leading-tight mt-0.5 ${mutedText}`}>{t('years_exp')}</div>
            </div>
          </div>

          <div className="w-fit max-w-full mx-auto flex flex-col items-start gap-3 pt-1 text-left">
            <div className="flex items-center gap-3">
              <Icon
                name="call"
                className={`text-xl shrink-0 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
              />
              <a
                href={`tel:${phoneText.replace(/\s+/g, '')}`}
                className="text-sm sm:text-base font-extrabold tracking-tight hover:text-purple-500 transition-colors break-words"
              >
                {phoneText}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Icon
                name="mail"
                className={`text-xl shrink-0 ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'}`}
              />
              <a
                href={`mailto:${emailText}`}
                className="text-sm sm:text-base font-extrabold tracking-tight hover:text-purple-500 transition-colors break-all"
              >
                {emailText}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Icon
                name="location_on"
                className={`text-xl shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
              />
              <span className="text-sm sm:text-base font-extrabold tracking-tight break-words">
                {locationText}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-3xl p-6 sm:p-8 space-y-3.5 print-card ${innerCard}`}>
        <div className={`text-xs font-bold tracking-[0.18em] uppercase ${mutedText}`}>
          {t('trusted_tech')}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-2.5">
          {techStack.map((tech, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm sm:text-base font-bold tracking-tight">
              <Icon
                name={tech.icon}
                className={`text-xl ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
              />
              <span>{tech.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
