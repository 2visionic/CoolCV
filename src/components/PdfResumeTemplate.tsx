import React from 'react';
import type {
  ProfileData,
  RolePillar,
  SkillItem,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  SocialItem,
  LangCode,
} from '../types/cv';

export interface PdfResumeTemplateProps {
  profile: ProfileData;
  roles: RolePillar[];
  roleMap: Record<string, RolePillar>;
  skills: SkillItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  socials: SocialItem[];
  avatarSrc: string;
  lang: LangCode;
  field: (row: any, base: string) => string;
  t: (key: string) => string;
}

// Clean A4 document template styled after the clean product/info sheet layout
export default function PdfResumeTemplate({
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
}: PdfResumeTemplateProps): React.ReactElement {
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
    <div
      id="coolcv-pdf-sheet"
      style={{
        width: '760px',
        backgroundColor: '#ffffff',
        color: '#1e293b',
        fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
        boxSizing: 'border-box',
        padding: '36px 40px',
        lineHeight: 1.5,
      }}
    >
      {/* 1. HLAVIČKA DOKUMENTU: Fotka + Jméno vlevo, Kontakty s ikonami vpravo */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          marginBottom: '22px',
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: '58%', verticalAlign: 'middle', paddingRight: '16px' }}>
              <table style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: 'middle', paddingRight: '16px' }}>
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#162238',
                        }}
                      >
                        {isDefaultSvgAvatar ? (
                          <svg
                            viewBox="0 0 120 120"
                            style={{ width: '64px', height: '64px', display: 'block' }}
                          >
                            <rect width="120" height="120" fill="#162238" />
                            <circle cx="60" cy="44" r="20" fill="#94a3b8" />
                            <path
                              d="M24 108 C24 80 96 80 96 108"
                              fill="#94a3b8"
                            />
                          </svg>
                        ) : (
                          <img
                            src={avatarSrc}
                            alt={fullName}
                            style={{
                              width: '64px',
                              height: '64px',
                              objectFit: 'cover',
                              objectPosition: 'top center',
                              display: 'block',
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <div
                        style={{
                          fontSize: '22px',
                          fontWeight: 800,
                          color: '#0f172a',
                          letterSpacing: '-0.02em',
                          lineHeight: 1.15,
                        }}
                      >
                        {fullName}
                      </div>
                      <div
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color: '#64748b',
                          marginTop: '4px',
                        }}
                      >
                        {field(profile, 'subtitle')}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Pravý blok kontaktů s čistými SVG ikonami */}
            <td
              style={{
                width: '42%',
                verticalAlign: 'middle',
                textAlign: 'right',
                fontSize: '10.5px',
                lineHeight: 1.65,
                color: '#334155',
              }}
            >
              {visibleSocials.slice(0, 1).map((soc) => (
                <div key={soc.id} style={{ fontWeight: 700, color: '#0284c7' }}>
                  <span style={iconWrapStyle}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </span>
                  <span>{soc.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                </div>
              ))}

              <div style={{ fontWeight: 700, color: '#0f172a' }}>
                <span style={iconWrapStyle}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span>{profile.phone || '+420 777 123 456'}</span>
              </div>

              <div>
                <span style={iconWrapStyle}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <span>{profile.email || 'jan.novak@example.cz'}</span>
              </div>

              <div style={{ color: '#64748b' }}>
                <span style={iconWrapStyle}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <span>{field(profile, 'location') || 'Praha / Remote'}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 2. TMAVÝ HERO BANNER + ÚVODNÍ BIO ODSTAVEC (podle vzoru) */}
      <div style={{ marginBottom: '26px' }} className="pdf-avoid-break">
        <div
          style={{
            backgroundColor: '#162238',
            color: '#ffffff',
            borderRadius: '4px',
            padding: '16px 20px',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              fontSize: '9.5px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#93c5fd',
              marginBottom: '4px',
            }}
          >
            {field(profile, 'subtitle')}
          </div>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.35,
            }}
          >
            <span>{t('tagline_1')}</span>
            <span style={{ color: '#f59e0b' }}>{t('tagline_highlight')}</span>
          </div>
        </div>

        <p
          style={{
            fontSize: '10.8px',
            lineHeight: 1.65,
            color: '#334155',
            margin: '0 0 10px 0',
          }}
        >
          {field(profile, 'bio')}
        </p>

        {stackItems.length > 0 && (
          <div
            style={{
              fontSize: '10.2px',
              lineHeight: 1.55,
              color: '#1e293b',
            }}
          >
            <strong style={{ color: '#0f172a' }}>
              {lang === 'cs' ? 'Hlavní technologický stack: ' : 'Core Tech Stack: '}
            </strong>
            <span style={{ color: '#334155' }}>{stackItems.join(' • ')}</span>
          </div>
        )}
      </div>

      {/* 3. SEKCE: CO PŘINÁŠÍM DO TÝMU (4 PILÍŘE) */}
      <div style={sectionBoxStyle}>
        <div style={sectionHeaderStyle}>
          <span style={iconWrapStyle}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </span>
          <span>{t('services_title')}</span>
        </div>
        <div style={sectionBodyStyle}>
          {roles.map((role, idx) => (
            <div
              key={role.slug}
              className="pdf-avoid-break"
              style={{
                marginBottom: idx === roles.length - 1 ? '0' : '14px',
                paddingBottom: idx === roles.length - 1 ? '0' : '12px',
                borderBottom: idx === roles.length - 1 ? 'none' : '1px solid #f1f5f9',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontSize: '11.2px',
                        fontWeight: 800,
                        color: '#0f172a',
                        verticalAlign: 'baseline',
                      }}
                    >
                      {field(role, 'title')}
                    </td>
                    <td
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#64748b',
                        textAlign: 'right',
                        verticalAlign: 'baseline',
                      }}
                    >
                      {field(role, 'level')} • {role.badge_code}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p
                style={{
                  fontSize: '10.3px',
                  lineHeight: 1.55,
                  color: '#334155',
                  margin: '3px 0 0 0',
                }}
              >
                {field(role, 'summary')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SEKCE: TECHNICKÉ DOVEDNOSTI (přehledný výčet s odrážkami • jako Informácie o hoteli) */}
      <div style={sectionBoxStyle} className="pdf-avoid-break">
        <div style={sectionHeaderStyle}>
          <span style={iconWrapStyle}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </span>
          <span>{t('skills_heading')}</span>
        </div>
        <div style={sectionBodyStyle}>
          {skills.map((skill, idx) => {
            const formattedTags = (skill.tags || '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
              .join(' • ');
            return (
              <div
                key={skill.id}
                style={{
                  fontSize: '10.4px',
                  lineHeight: 1.55,
                  color: '#334155',
                  marginBottom: idx === skills.length - 1 ? '0' : '8px',
                }}
              >
                <strong style={{ color: '#0f172a' }}>
                  {field(skill, 'name')} ({skill.proficiency} %):
                </strong>{' '}
                <span>{formattedTags}</span>
                <span style={{ color: '#64748b', fontSize: '9.5px' }}>
                  {' '}
                  [{roleMap[skill.role_slug]?.badge_code || skill.role_slug}]
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SEKCE: PRACOVNÍ ZKUŠENOSTI */}
      <div style={sectionBoxStyle}>
        <div style={sectionHeaderStyle}>
          <span style={iconWrapStyle}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </span>
          <span>{t('exp_heading')}</span>
        </div>
        <div style={sectionBodyStyle}>
          {experience.map((exp, idx) => (
            <div
              key={exp.id}
              className="pdf-avoid-break"
              style={{
                marginBottom: idx === experience.length - 1 ? '0' : '15px',
                paddingBottom: idx === experience.length - 1 ? '0' : '13px',
                borderBottom: idx === experience.length - 1 ? 'none' : '1px solid #f1f5f9',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontSize: '11.2px',
                        fontWeight: 800,
                        color: '#0f172a',
                        verticalAlign: 'baseline',
                      }}
                    >
                      <span>{field(exp, 'role')}</span>
                      <span style={{ color: '#0284c7', fontWeight: 700 }}> — {exp.company}</span>
                    </td>
                    <td
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#64748b',
                        textAlign: 'right',
                        verticalAlign: 'baseline',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {field(exp, 'period')}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p
                style={{
                  fontSize: '10.3px',
                  lineHeight: 1.55,
                  color: '#334155',
                  margin: '4px 0 0 0',
                }}
              >
                {field(exp, 'description')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. SEKCE: VZDĚLÁNÍ & CERTIFIKACE (čistá tabulka jako Termíny a ceny ve vzoru) */}
      <div style={sectionBoxStyle} className="pdf-avoid-break">
        <div style={sectionHeaderStyle}>
          <span style={iconWrapStyle}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </span>
          <span>{t('edu_heading')}</span>
        </div>
        <div style={sectionBodyStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th
                  style={{
                    textAlign: 'left',
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    paddingBottom: '7px',
                    width: '22%',
                  }}
                >
                  {lang === 'cs' ? 'Období' : 'Period'}
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    paddingBottom: '7px',
                    width: '46%',
                  }}
                >
                  {lang === 'cs' ? 'Obor / Certifikace' : 'Degree / Certification'}
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    paddingBottom: '7px',
                    width: '32%',
                  }}
                >
                  {lang === 'cs' ? 'Instituce' : 'Institution'}
                </th>
              </tr>
            </thead>
            <tbody>
              {education.map((edu, idx) => (
                <tr
                  key={edu.id}
                  style={{
                    borderBottom: idx === education.length - 1 ? 'none' : '1px solid #f1f5f9',
                  }}
                >
                  <td
                    style={{
                      padding: '9px 8px 9px 0',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#475569',
                      verticalAlign: 'top',
                    }}
                  >
                    {edu.period}
                  </td>
                  <td
                    style={{
                      padding: '9px 8px',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: '#0f172a',
                      verticalAlign: 'top',
                    }}
                  >
                    {field(edu, 'title')}
                  </td>
                  <td
                    style={{
                      padding: '9px 0 9px 8px',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#0284c7',
                      textAlign: 'right',
                      verticalAlign: 'top',
                    }}
                  >
                    {field(edu, 'institution')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. SEKCE: VYBRANÉ PROJEKTY (čisté položky jako Fakultatívne výlety ve vzoru) */}
      <div style={{ ...sectionBoxStyle, marginBottom: '22px' }}>
        <div style={sectionHeaderStyle}>
          <span style={iconWrapStyle}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </span>
          <span>{t('projects_title')}</span>
        </div>
        <div style={sectionBodyStyle}>
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="pdf-avoid-break"
              style={{
                marginBottom: idx === projects.length - 1 ? '0' : '15px',
                paddingBottom: idx === projects.length - 1 ? '0' : '13px',
                borderBottom: idx === projects.length - 1 ? 'none' : '1px solid #f1f5f9',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontSize: '11.2px',
                        fontWeight: 800,
                        color: '#0f172a',
                        verticalAlign: 'baseline',
                      }}
                    >
                      <span>{field(proj, 'title')}</span>
                      <span style={{ color: '#0284c7', fontWeight: 600, fontSize: '10.3px' }}>
                        {' '}
                        — {field(proj, 'subtitle')}
                      </span>
                    </td>
                    <td
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 600,
                        color: '#64748b',
                        textAlign: 'right',
                        verticalAlign: 'baseline',
                      }}
                    >
                      {(proj.tags || '')
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .join(' • ')}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p
                style={{
                  fontSize: '10.3px',
                  lineHeight: 1.55,
                  color: '#334155',
                  margin: '4px 0 0 0',
                }}
              >
                {field(proj, 'description')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 8. PATIČKA DOKUMENTU (podle vzoru) */}
      <div
        className="pdf-avoid-break"
        style={{
          paddingTop: '14px',
          borderTop: '1px solid #d5e0ec',
          textAlign: 'center',
          fontSize: '9.8px',
          color: '#475569',
        }}
      >
        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
          <span>{fullName}</span>
          <span> &nbsp;|&nbsp; {profile.phone || '+420 777 123 456'}</span>
          <span> &nbsp;|&nbsp; {profile.email || 'jan.novak@example.cz'}</span>
          <span> &nbsp;|&nbsp; {field(profile, 'location') || 'Praha / Remote'}</span>
        </div>
        {visibleSocials.length > 0 && (
          <div style={{ fontSize: '9.2px', color: '#0284c7', fontWeight: 600 }}>
            {visibleSocials.map((soc, i) => (
              <span key={soc.id}>
                {i > 0 ? '   •   ' : ''}
                {soc.label}: {soc.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
