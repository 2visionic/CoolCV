import React, { useState, useEffect, useMemo, useRef } from 'react';
import Icon from './Icon';
import { UI_TEXT } from '../i18n/translations';
import type {
  CvDataPayload,
  ProfileData,
  RolePillar,
  AuthUser,
  BackendCryptoReport,
  ApiLogEntry,
  ApiCallResult,
  BackofficeTab,
} from '../types/cv';

export interface BackofficeProps {
  cvData: CvDataPayload;
  setCvData: React.Dispatch<React.SetStateAction<CvDataPayload>>;
  jwtToken: string;
  setJwtToken: (token: string) => void;
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;
  cryptoReport: BackendCryptoReport | null;
  setCryptoReport: (report: BackendCryptoReport | null) => void;
  callApi: (route: string, method?: string, body?: any, tokenOverride?: string | null) => Promise<ApiCallResult>;
  showToast: (msg: string, isError?: boolean) => void;
  apiLogs: ApiLogEntry[];
  onTriggerPhotoUpload: () => void;
  isUploadingPhoto?: boolean;
  photoUploadProgress?: number;
  onCloseModal: () => void;
  onLoginSuccess: () => void;
  avatarSrc: string;
  surfaceCard: string;
  innerCard: string;
  mutedText: string;
  secondaryText: string;
}

export interface CrudCollectionPanelProps {
  entity: string;
  title: string;
  subtitle: string;
  items: any[];
  roles: RolePillar[];
  roleMap: Record<string, RolePillar>;
  editingItem: Record<string, any> | null;
  setEditingItem: (item: Record<string, any> | null) => void;
  onSave: (e: React.FormEvent<HTMLFormElement>) => Promise<boolean>;
  onDelete: (id: number) => void;
  onReorder: (reorderedItems: any[]) => Promise<void> | void;
  surfaceCard: string;
  innerCard: string;
  mutedText: string;
  secondaryText: string;
}

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
export default function Backoffice({
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
}: BackofficeProps): React.ReactElement {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<BackofficeTab>('profile');
  const [profileForm, setProfileForm] = useState<ProfileData>(cvData.profile || ({} as ProfileData));
  const [editingItem, setEditingItem] = useState<Record<string, any> | null>(null);
  const [needsSetup, setNeedsSetup] = useState<boolean>(Boolean(cvData.needs_setup));

  useEffect(() => {
    if (cvData.profile && Object.keys(cvData.profile).length > 0) {
      setProfileForm(cvData.profile);
    }
  }, [cvData.profile]);

  const roles: RolePillar[] = cvData.roles || [];
  const roleMap = useMemo<Record<string, RolePillar>>(() => {
    const m: Record<string, RolePillar> = {};
    roles.forEach((r) => {
      m[r.slug] = r;
    });
    return m;
  }, [roles]);

  useEffect(() => {
    setProfileForm(cvData.profile || ({} as ProfileData));
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

  async function handleInitialSetup(e: React.FormEvent<HTMLFormElement>) {
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

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
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

  async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await callApi('profile', 'PUT', profileForm);
    if (res.ok) {
      showToast('Osobní profil byl uložen.');
      await reloadCv();
    } else {
      showToast(res.data?.error || 'Uložení selhalo.', true);
    }
  }

  async function handleSaveEntity(entity: string, e: React.FormEvent<HTMLFormElement>): Promise<boolean> {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const payload: Record<string, any> = Object.fromEntries(formData.entries());
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

  async function handleDeleteEntity(entity: string, id: number) {
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

  const profileFields: Array<[string, string]> = [
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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md no-print"
      >
        <div
          className={`relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl ${surfaceCard}`}
        >
          {needsSetup ? (
            <form
              onSubmit={handleInitialSetup}
              className="flex flex-col flex-1 min-h-0 overflow-hidden"
              autoComplete="off"
            >
              <div className="shrink-0 px-7 pt-6 pb-5 sm:px-9 sm:pt-7 sm:pb-5 border-b border-white/[0.08] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-mono text-xs font-bold">
                    <Icon name="person_add" className="text-xl" />
                    <span>PRVNÍ SPUŠTĚNÍ • NASTAVENÍ ÚČTU</span>
                  </div>
                  <h2 className="text-2xl font-extrabold">Vytvoření administrátorského účtu</h2>
                  <p className={`text-xs sm:text-sm leading-relaxed ${secondaryText}`}>
                    V databázi zatím neexistuje žádný administrátorský účet. Zvolte si své přihlašovací jméno a heslo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onCloseModal}
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${innerCard}`}
                  title="Zavřít"
                >
                  <Icon name="close" className="text-lg" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto px-7 py-6 sm:px-9 sm:py-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">Zobrazované jméno</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="např. Jan Novák"
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-2">Uživatelské jméno (min. 3 znaky)</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Zvolte uživatelské jméno"
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">Heslo (min. 6 znaků)</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Zvolte silné heslo"
                      className="w-full px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">Potvrzení hesla</label>
                    <input
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="Zopakujte heslo"
                      className="w-full px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="shrink-0 px-7 py-4 sm:px-9 sm:py-5 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className={`px-5 py-3.5 rounded-2xl font-bold text-xs ${innerCard}`}
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 shadow-xl flex items-center gap-2"
                >
                  <Icon name="verified_user" className="text-base" />
                  <span>Vytvořit účet &amp; Přihlásit</span>
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleLogin}
              className="flex flex-col flex-1 min-h-0 overflow-hidden"
              autoComplete="on"
            >
              <div className="shrink-0 px-7 pt-6 pb-5 sm:px-9 sm:pt-7 sm:pb-5 border-b border-white/[0.08] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 text-purple-400 font-mono text-xs font-bold">
                    <Icon name="lock" className="text-xl" />
                    <span>AUTORIZACE DO BACKOFFICE</span>
                  </div>
                  <h2 className="text-2xl font-extrabold">Přihlášení do Backoffice</h2>
                  <p className={`text-xs sm:text-sm leading-relaxed ${secondaryText}`}>
                    Zadejte své přihlašovací údaje pro přístup ke správě životopisu a projektů.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onCloseModal}
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${innerCard}`}
                  title="Zavřít"
                >
                  <Icon name="close" className="text-lg" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto px-7 py-6 sm:px-9 sm:py-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">Uživatelské jméno</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Zadejte uživatelské jméno"
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-2">Heslo</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Zadejte heslo"
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="shrink-0 px-7 py-4 sm:px-9 sm:py-5 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className={`px-5 py-3.5 rounded-2xl font-bold text-xs ${innerCard}`}
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 shadow-xl flex items-center gap-2"
                >
                  <Icon name="login" className="text-base" />
                  <span>Přihlásit se</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.07]">
        <div className="space-y-1">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-fuchsia-400">
            BACKOFFICE ADMINISTRACE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Správa obsahu CV, sociálních sítí, pilířů a systému
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-2"
          >
            <Icon name="logout" className="text-base" />
            <span>Odhlásit ({authUser.display_name || authUser.username})</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-wrap gap-2.5">
          {tabs.map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as BackofficeTab);
                  setEditingItem(null);
                }}
                className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isTabActive
                    ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-lg'
                    : innerCard
                }`}
              >
                <Icon name={tab.icon} className="text-lg" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className={`lg:col-span-4 rounded-3xl p-7 text-center space-y-5 ${innerCard}`}>
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                {isUploadingPhoto && (
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20"
                    viewBox="0 0 120 120"
                  >
                    <defs>
                      <linearGradient id="boAvatarProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="60"
                      cy="60"
                      r="56"
                      fill="none"
                      stroke="rgba(168, 85, 247, 0.2)"
                      strokeWidth="5"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="56"
                      fill="none"
                      stroke="url(#boAvatarProgressGrad)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="351.86"
                      strokeDashoffset={351.86 - (351.86 * Math.min(100, Math.max(0, photoUploadProgress))) / 100}
                      className="transition-all duration-100 ease-out"
                    />
                  </svg>
                )}

                <div
                  className={`relative w-40 h-40 rounded-full overflow-hidden border-4 bg-[#151828] transition-all ${
                    isUploadingPhoto ? 'border-transparent' : 'border-purple-500/40'
                  }`}
                >
                  <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />

                  {isUploadingPhoto && (
                    <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <span
                          className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                      <span className="text-xs font-extrabold font-mono text-white tracking-wider">
                        {`${Math.round(photoUploadProgress)}%`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-base">Profilová fotografie</h3>
                <p className={`text-xs mt-1 ${mutedText}`}>
                  Automatická komprese v prohlížeči (HTML5 Canvas) + uložení přes REST API.
                </p>
              </div>
              <button
                type="button"
                onClick={onTriggerPhotoUpload}
                disabled={isUploadingPhoto}
                className="w-full py-3.5 px-5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 to-indigo-500 shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
              >
                <Icon name="cloud_upload" className="text-base" />
                <span>
                  {isUploadingPhoto
                    ? `Nahrávám fotku (${Math.round(photoUploadProgress)} %)...`
                    : 'Vybrat a nahrát novou fotku'}
                </span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className={`lg:col-span-8 rounded-3xl p-7 sm:p-8 space-y-5 ${innerCard}`}>
              <h3 className="text-lg font-extrabold flex items-center gap-2">
                <Icon name="badge" className="text-purple-400" />
                <span>Úprava osobního profilu a kontaktů</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileFields.map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs font-bold mb-1.5 text-slate-400">{label}</label>
                    <input
                      type="text"
                      value={profileForm[key] || ''}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-medium"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-400">Osobní bio (CZ)</label>
                <textarea
                  rows={3}
                  value={profileForm.bio_cs || ''}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, bio_cs: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-400">Personal Bio (EN)</label>
                <textarea
                  rows={3}
                  value={profileForm.bio_en || ''}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, bio_en: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 to-indigo-500 shadow-lg flex items-center gap-2"
              >
                <Icon name="save" className="text-base" />
                <span>Uložit změny profilu</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'sections' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <Icon name="edit_note" className="text-purple-400" />
                  <span>Texty sekcí, titulky a podtitulky (CZ / EN)</span>
                </h2>
                <p className={`text-xs mt-1 leading-relaxed ${mutedText}`}>
                  Zde můžete upravit nadpisy, štítky, titulky a podtitulky všech sekcí na webu i v generovaném PDF životopisu.
                </p>
              </div>

              <button
                type="submit"
                className="shrink-0 whitespace-nowrap px-6 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg flex items-center gap-2"
              >
                <Icon name="save" className="text-base" />
                <span>Uložit texty</span>
              </button>
            </div>

            {sectionTextGroups.map((group, gIdx) => (
              <div key={gIdx} className={`rounded-3xl p-6 sm:p-8 space-y-5 ${innerCard}`}>
                <h3 className="text-base font-extrabold flex items-center gap-2.5 border-b border-white/10 pb-3">
                  <Icon name={group.icon} className="text-xl text-purple-400" />
                  <span>{group.groupTitle}</span>
                </h3>

                <div className="space-y-4">
                  {group.keys.map(([tKey, label]) => {
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
                        <div
                          key={tKey}
                          className="p-4 rounded-2xl bg-black/25 border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-4"
                        >
                          <div>
                            <label className="block text-xs font-bold mb-1.5 text-purple-300">
                              {label}
                            </label>
                            <input
                              type="text"
                              value={currentNum}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProfileForm((prev) => ({
                                  ...prev,
                                  [csField]: val,
                                  [enField]: val,
                                }));
                              }}
                              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-extrabold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold mb-1.5 text-slate-400">
                              {`Statistika ${statIdx} – ikona (Material Symbol)`}
                            </label>
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                                <Icon name={currentIcon} className="text-xl text-purple-300" />
                              </div>
                              <input
                                type="text"
                                value={currentIcon}
                                onChange={(e) =>
                                  setProfileForm((prev) => ({
                                    ...prev,
                                    [iconField]: e.target.value,
                                  }))
                                }
                                placeholder="např. rocket_launch"
                                className="flex-1 px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-mono"
                              />
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {statIconPresets.map((ic) => (
                                <button
                                  key={ic}
                                  type="button"
                                  title={ic}
                                  onClick={() =>
                                    setProfileForm((prev) => ({
                                      ...prev,
                                      [iconField]: ic,
                                    }))
                                  }
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                                    currentIcon === ic
                                      ? 'bg-purple-600 text-white border-purple-400 shadow'
                                      : 'bg-black/30 text-slate-400 border-white/10 hover:text-white hover:border-purple-500/40'
                                  }`}
                                >
                                  <Icon name={ic} className="text-sm" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
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
                      <div
                        key={tKey}
                        className="p-4 rounded-2xl bg-black/25 border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-4"
                      >
                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-purple-300">
                            {`${label} (CZ)`}
                          </label>
                          <input
                            type="text"
                            value={currentCs}
                            onChange={(e) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                [csField]: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-slate-400">
                            {`${label} (EN)`}
                          </label>
                          <input
                            type="text"
                            value={currentEn}
                            onChange={(e) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                [enField]: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-medium"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-7 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg flex items-center gap-2"
              >
                <Icon name="save" className="text-base" />
                <span>Uložit všechny texty sekcí</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === 'socials' && (
          <CrudCollectionPanel
            entity="socials"
            title="Profily & Sociální sítě"
            subtitle="Správa odkazů v bočním panelu (GitHub, LinkedIn, X, Instagram, Web...). U každé sítě můžete zvolit Material Symbol ikonu nebo vložit/nahrát vlastní SVG kód ikony."
            items={cvData.socials || []}
            roles={roles}
            roleMap={roleMap}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            onSave={(e) => handleSaveEntity('socials', e)}
            onDelete={(id) => handleDeleteEntity('socials', id)}
            onReorder={(reordered) => handleReorderEntity('socials', reordered)}
            surfaceCard={surfaceCard}
            innerCard={innerCard}
            mutedText={mutedText}
            secondaryText={secondaryText}
          />
        )}

        {activeTab === 'roles' && (
          <CrudCollectionPanel
            entity="roles"
            title="Pilíře odbornosti & Filtry"
            subtitle="Tyto pilíře tvoří hlavní karty odbornosti na webu a zároveň slouží jako přepínače filtru pro Zkušenosti, Vzdělání, Dovednosti a Projekty."
            items={cvData.roles || []}
            roles={roles}
            roleMap={roleMap}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            onSave={(e) => handleSaveEntity('roles', e)}
            onDelete={(id) => handleDeleteEntity('roles', id)}
            onReorder={(reordered) => handleReorderEntity('roles', reordered)}
            surfaceCard={surfaceCard}
            innerCard={innerCard}
            mutedText={mutedText}
            secondaryText={secondaryText}
          />
        )}

        {activeTab === 'skills' && (
          <CrudCollectionPanel
            entity="skills"
            title="Technické & UX Dovednosti"
            subtitle="Správa dovedností a jejich zařazení k jednotlivým pilířům odbornosti."
            items={cvData.skills || []}
            roles={roles}
            roleMap={roleMap}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            onSave={(e) => handleSaveEntity('skills', e)}
            onDelete={(id) => handleDeleteEntity('skills', id)}
            onReorder={(reordered) => handleReorderEntity('skills', reordered)}
            surfaceCard={surfaceCard}
            innerCard={innerCard}
            mutedText={mutedText}
            secondaryText={secondaryText}
          />
        )}

        {activeTab === 'experience' && (
          <CrudCollectionPanel
            entity="experience"
            title="Pracovní zkušenosti & Praxe"
            subtitle="Správa pracovních zkušeností. Pomocí checkboxů v modálu přiřadíte zkušenost k pilířům, podle kterých se filtruje na webu."
            items={cvData.experience || []}
            roles={roles}
            roleMap={roleMap}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            onSave={(e) => handleSaveEntity('experience', e)}
            onDelete={(id) => handleDeleteEntity('experience', id)}
            onReorder={(reordered) => handleReorderEntity('experience', reordered)}
            surfaceCard={surfaceCard}
            innerCard={innerCard}
            mutedText={mutedText}
            secondaryText={secondaryText}
          />
        )}

        {activeTab === 'projects' && (
          <CrudCollectionPanel
            entity="projects"
            title="Vybrané projekty & Případové studie"
            subtitle="Správa projektů v portfoliu a jejich propojení s pilíři odbornosti."
            items={cvData.projects || []}
            roles={roles}
            roleMap={roleMap}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            onSave={(e) => handleSaveEntity('projects', e)}
            onDelete={(id) => handleDeleteEntity('projects', id)}
            onReorder={(reordered) => handleReorderEntity('projects', reordered)}
            surfaceCard={surfaceCard}
            innerCard={innerCard}
            mutedText={mutedText}
            secondaryText={secondaryText}
          />
        )}

        {activeTab === 'education' && (
          <CrudCollectionPanel
            entity="education"
            title="Vzdělání & Certifikace"
            subtitle="Správa dosaženého vzdělání, kurzů a certifikací."
            items={cvData.education || []}
            roles={roles}
            roleMap={roleMap}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            onSave={(e) => handleSaveEntity('education', e)}
            onDelete={(id) => handleDeleteEntity('education', id)}
            onReorder={(reordered) => handleReorderEntity('education', reordered)}
            surfaceCard={surfaceCard}
            innerCard={innerCard}
            mutedText={mutedText}
            secondaryText={secondaryText}
          />
        )}

        {activeTab === 'system' && (
          <div className="space-y-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <Icon name="dns" className="text-purple-400" />
                  <span>Systémová diagnostika, Šifrování &amp; REST API Log</span>
                </h2>
                <p className={`text-xs mt-1 ${mutedText}`}>
                  Aktivní databázový driver: <strong className="text-purple-300">{cvData.driver || 'mysql'}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    const res = await callApi('auth/refresh', 'POST');
                    if (res.ok && res.data?.data) {
                      setJwtToken(res.data.data.access_token);
                      localStorage.setItem('coolcv_jwt_token', res.data.data.access_token);
                      setCryptoReport(res.data.data.backend_crypto);
                      showToast('JWT token byl obnoven!');
                    }
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${innerCard}`}
                >
                  <Icon name="refresh" className="text-base text-purple-400" />
                  <span>Obnovit JWT Token</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const res = await callApi('system/reset', 'POST');
                    if (res.ok && res.data?.data) {
                      setCvData(res.data.data);
                      showToast('Databáze byla obnovena do výchozích dat!');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-2"
                >
                  <Icon name="restart_alt" className="text-base" />
                  <span>Reset DB do výchozích dat</span>
                </button>
              </div>
            </div>

            {cryptoReport && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                <div className={`rounded-3xl p-7 sm:p-8 space-y-5 ${innerCard}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold flex items-center gap-2">
                      <Icon name="token" className="text-purple-400" />
                      <span>JWT Bearer Token (HS256)</span>
                    </h3>
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-500/20 text-emerald-300">
                      RFC 7519 Verified
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs break-all leading-relaxed">
                    <span className="text-rose-400">{cryptoReport.jwt_hs256?.header_b64}</span>.
                    <span className="text-purple-400">{cryptoReport.jwt_hs256?.payload_b64}</span>.
                    <span className="text-emerald-400">{cryptoReport.jwt_hs256?.signature_b64}</span>
                  </div>

                  <pre className="p-4 rounded-2xl bg-black/35 border border-white/10 font-mono text-xs overflow-auto">
                    {JSON.stringify(cryptoReport.jwt_hs256?.decoded_payload, null, 2)}
                  </pre>
                </div>

                <div className={`rounded-3xl p-7 sm:p-8 space-y-5 ${innerCard}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold flex items-center gap-2">
                      <Icon name="enhanced_encryption" className="text-fuchsia-400" />
                      <span>PHP Backend AES-256-CBC + HMAC</span>
                    </h3>
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-purple-500/20 text-purple-300">
                      OpenSSL Active
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3.5 rounded-xl bg-black/35 border border-white/10">
                      <div className="text-slate-400 mb-1">Algoritmus &amp; Odvození klíčů (HKDF):</div>
                      <div className="text-emerald-300 font-bold">{cryptoReport.aes_256_backend?.algorithm}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/35 border border-white/10 break-all">
                      <div className="text-slate-400 mb-1">Initialization Vector (128-bit IV Hex):</div>
                      <div className="text-purple-300">{cryptoReport.aes_256_backend?.iv_hex}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/35 border border-white/10 break-all">
                      <div className="text-slate-400 mb-1">HMAC-SHA256 Autentizační Tag:</div>
                      <div className="text-fuchsia-300">{cryptoReport.aes_256_backend?.hmac_sha256_hex}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`rounded-3xl p-7 sm:p-8 space-y-4 ${innerCard}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <Icon name="terminal" className="text-emerald-400" />
                  <span>Živý REST API Network Log</span>
                </h3>
                <span className={`text-xs font-mono ${mutedText}`}>{apiLogs.length} záznamů</span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs">
                {apiLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-black/35 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <span className="text-purple-300 font-bold">{`${log.method} ${log.url}`}</span>
                    <span className="text-emerald-400">{`HTTP ${log.status} (${log.ms} ms)`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
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
}: CrudCollectionPanelProps): React.ReactElement {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [iconValue, setIconValue] = useState<string>('language');
  const [iconMode, setIconMode] = useState<string>('material');
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const svgFileInputRef = useRef<HTMLInputElement | null>(null);

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

  function togglePillarCheckbox(slug: string) {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((item) => item !== slug);
      }
      return [...prev, slug];
    });
  }

  function handleSvgFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

  const fieldsByEntity: Record<string, Array<[string, string, string]>> = {
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
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 min-w-0 flex-1">
          <h2 className="text-xl font-extrabold">{`${title} (${items.length})`}</h2>
          <p className={`text-xs leading-relaxed ${mutedText}`}>{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setEditingItem({})}
          className="shrink-0 whitespace-nowrap px-5 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 hover:opacity-95 shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all"
        >
          <Icon name="add" className="text-lg" />
          <span>Přidat</span>
        </button>
      </div>

      <div
        className={`rounded-3xl p-6 sm:p-7 space-y-3 ${innerCard}`}
        onDragOver={(e) => {
          if (isSortable && draggedId !== null) {
            e.preventDefault();
          }
        }}
        onDrop={(e) => {
          if (isSortable && draggedId !== null) {
            e.preventDefault();
            commitDragReorder();
          }
        }}
      >
        {isSortable && items.length > 1 && (
          <div className="flex items-center gap-2 pb-1 text-[11px] font-semibold text-purple-300">
            <Icon name="drag_indicator" className="text-base text-purple-400" />
            <span>Řazení položek: uchopte položku za placeholder vlevo a přetáhněte ji myší (Drag &amp; Drop).</span>
          </div>
        )}

        {displayItems.length === 0 ? (
          <div className={`py-10 text-center text-sm ${mutedText}`}>
            Zatím zde nejsou žádné položky. Klikněte na „Přidat“.
          </div>
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
              <div
                key={it.id}
                draggable={isSortable}
                onDragStart={(e) => {
                  if (!isSortable) return;
                  setDraggedId(Number(it.id));
                  setDragOverIndex(idx);
                  e.dataTransfer.effectAllowed = 'move';
                  try {
                    e.dataTransfer.setData('text/plain', String(it.id));
                  } catch (_) {}
                }}
                onDragOver={(e) => {
                  if (!isSortable || draggedId === null) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverIndex !== idx) {
                    setDragOverIndex(idx);
                  }
                }}
                onDrop={(e) => {
                  if (!isSortable || draggedId === null) return;
                  e.preventDefault();
                  e.stopPropagation();
                  commitDragReorder();
                }}
                onDragEnd={() => {
                  if (draggedId !== null) {
                    commitDragReorder();
                  }
                }}
                className={`p-4 sm:p-5 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isBeingDragged
                    ? 'border-2 border-dashed border-purple-500 bg-purple-500/15 shadow-lg scale-[0.995]'
                    : 'bg-black/25 border border-white/10 hover:border-purple-500/35'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  {isSortable && (
                    <div
                      title="Táhněte myší pro změnu pořadí (Drag & Drop)"
                      className={`w-11 h-12 rounded-xl border border-dashed flex flex-col items-center justify-center shrink-0 select-none cursor-grab active:cursor-grabbing transition-all ${
                        isBeingDragged
                          ? 'bg-purple-500/30 border-purple-400 text-purple-200'
                          : 'bg-white/[0.04] border-white/20 hover:border-purple-400/60 hover:bg-purple-500/15 text-purple-400'
                      }`}
                    >
                      <Icon name="drag_indicator" className="text-lg leading-none" />
                      <span className="text-[10px] font-mono font-extrabold leading-none mt-0.5">
                        {`#${idx + 1}`}
                      </span>
                    </div>
                  )}

                  <div className="min-w-0 space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      {hasIconField && (
                        <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                          <Icon name={it.icon || 'language'} className="text-xl" />
                        </div>
                      )}

                      {entity === 'roles' && (
                        <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {it.badge_code}
                        </span>
                      )}

                      <span className="font-extrabold text-sm sm:text-base truncate">
                        {it.title || it.name_cs || it.role_cs || it.title_cs}
                      </span>

                      {hasIconField && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.06] text-slate-300 border border-white/10">
                          {isSvgIcon ? 'Vlastní SVG ikona' : `Material: ${it.icon}`}
                        </span>
                      )}

                      {entity === 'skills' && (
                        <span className="text-xs font-mono font-bold text-purple-400">{it.proficiency}%</span>
                      )}
                    </div>

                    <div className={`text-xs truncate ${mutedText}`}>
                      {entity === 'socials'
                        ? it.url
                        : entity === 'roles'
                          ? `Filtr slug: "${it.slug}" • ${it.level_cs} • ${it.summary_cs}`
                          : entity === 'projects'
                            ? `${it.demo_url && !String(it.demo_url).startsWith('#') ? `${it.demo_url} • ` : ''}${it.tech_stack || ''}`
                            : entity === 'experience'
                              ? `${it.period_cs ? `${it.period_cs} • ` : ''}${it.company || ''}`
                              : entity === 'education'
                                ? `${it.period ? `${it.period} • ` : ''}${it.institution_cs || ''}`
                                : it.company || it.tech_stack || it.institution_cs || it.tags || it.period_cs || it.period}
                    </div>

                    {hasPillarPairing && itemSlugs.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {itemSlugs.map((slug) => {
                          const pillar = roleMap[slug];
                          return (
                            <span
                              key={slug}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25 inline-flex items-center gap-1.5"
                            >
                              <Icon name={pillar?.icon || 'label'} className="text-sm text-fuchsia-400" />
                              <span>
                                {pillar ? `${pillar.badge_code} — ${pillar.title_cs}` : slug}
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setEditingItem(it)}
                    className="w-10 h-10 rounded-xl bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/25 flex items-center justify-center transition-all"
                    title="Upravit položku"
                  >
                    <Icon name="edit" className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(it.id)}
                    className="w-10 h-10 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/25 flex items-center justify-center transition-all"
                    title="Smazat položku"
                  >
                    <Icon name="delete" className="text-lg" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {editingItem !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md no-print"
        >
          <div
            className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl ${surfaceCard}`}
          >
            <form
              onSubmit={async (e) => {
                await onSave(e);
              }}
              className="flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <div className="shrink-0 px-7 pt-6 pb-5 sm:px-9 sm:pt-7 sm:pb-5 border-b border-white/[0.08] flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs font-bold tracking-[0.2em] uppercase text-fuchsia-400 mb-1">
                    {isEditingExisting ? `EDITACE POLOŽKY #${editingItem.id}` : 'NOVÁ POLOŽKA'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold truncate">
                    {isEditingExisting ? `Upravit záznam v sekci ${title}` : `Přidat položku do sekce ${title}`}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${innerCard}`}
                  title="Zavřít modální okno"
                >
                  <Icon name="close" className="text-lg" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto px-7 py-6 sm:px-9 sm:py-6 space-y-5">
                <input type="hidden" name="id" value={isEditingExisting ? String(editingItem.id) : ''} />
                <input
                  type="hidden"
                  name="sort_order"
                  value={isEditingExisting ? String(editingItem.sort_order ?? 1) : String(items.length + 1)}
                />

                {hasIconField && (
                  <div className="rounded-2xl p-4 sm:p-5 bg-black/25 border border-white/10 space-y-4">
                    <input type="hidden" name="icon" value={iconValue} />
                    <input
                      ref={svgFileInputRef}
                      type="file"
                      accept=".svg,image/svg+xml"
                      className="hidden"
                      onChange={handleSvgFileUpload}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
                          <Icon name={iconValue} className="text-2xl" />
                        </div>
                        <div>
                          <div className="text-xs font-extrabold uppercase tracking-wider text-purple-300">
                            Ikona položky (živý náhled)
                          </div>
                          <div className={`text-[11px] ${mutedText}`}>
                            Zvolte Material Symbol nebo vložte / nahrajte vlastní SVG kód ikony
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIconMode('material');
                            if (iconValue.includes('<svg')) setIconValue('language');
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            iconMode === 'material'
                              ? 'bg-purple-500 text-white shadow'
                              : 'bg-white/[0.06] text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <Icon name="interests" className="text-base" />
                          <span>Material Symbol</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIconMode('svg')}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            iconMode === 'svg'
                              ? 'bg-purple-500 text-white shadow'
                              : 'bg-white/[0.06] text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <Icon name="code" className="text-base" />
                          <span>Vlastní SVG kód</span>
                        </button>
                      </div>
                    </div>

                    {iconMode === 'material' ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-slate-400">
                            Název Google Material Symbol ikony
                          </label>
                          <input
                            type="text"
                            value={iconValue.includes('<svg') ? '' : iconValue}
                            onChange={(e) => setIconValue(e.target.value)}
                            placeholder="např. language, mail, code, work, share..."
                            className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-mono"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {MATERIAL_ICON_PRESETS.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setIconValue(preset)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                                iconValue === preset
                                  ? 'bg-purple-500/25 border-purple-400 text-white'
                                  : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/25'
                              }`}
                            >
                              <Icon name={preset} className="text-base text-purple-400" />
                              <span>{preset}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="block text-xs font-bold text-slate-400">
                            SVG kód ikony (&lt;svg ...&gt;...&lt;/svg&gt;)
                          </label>
                          <button
                            type="button"
                            onClick={() => svgFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-500/30 flex items-center gap-1.5 transition-all"
                          >
                            <Icon name="upload_file" className="text-base" />
                            <span>Nahrát .svg soubor z disku</span>
                          </button>
                        </div>

                        <textarea
                          rows={4}
                          value={iconValue}
                          onChange={(e) => setIconValue(e.target.value)}
                          placeholder='<svg viewBox="0 0 24 24" fill="currentColor"><path d="..."/></svg>'
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-xs font-mono leading-relaxed"
                        />

                        <div className="space-y-1.5">
                          <div className={`text-[11px] font-semibold ${mutedText}`}>
                            Rychlé šablony SVG ikon známých sítí:
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {BRAND_SVG_PRESETS.map((brand) => (
                              <button
                                key={brand.label}
                                type="button"
                                onClick={() => setIconValue(brand.svg)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-black/30 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 text-slate-300 flex items-center gap-1.5 transition-all"
                              >
                                <Icon name={brand.svg} className="text-sm text-purple-400" />
                                <span>{brand.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {hasPillarPairing && (
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">
                      Přiřazení k pilířům odbornosti (určuje zobrazení pilulek a chování filtru na webu)
                    </label>
                    <input
                      type="hidden"
                      name={usesRoleSlug ? 'role_slug' : 'role_tags'}
                      value={selectedSlugs.join(',')}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {roles.map((role) => {
                        const isChecked = selectedSlugs.includes(role.slug);
                        return (
                          <label
                            key={role.slug}
                            className={`cursor-pointer rounded-2xl p-3.5 border flex items-center gap-3 transition-all ${
                              isChecked
                                ? 'bg-purple-500/20 border-purple-500 text-white shadow-sm'
                                : 'bg-black/25 border-white/10 text-slate-300 hover:border-white/25'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePillarCheckbox(role.slug)}
                              className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                            />
                            <Icon name={role.icon || 'code'} className="text-xl text-purple-400 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-extrabold truncate">{role.badge_code}</div>
                              <div className={`text-[11px] truncate ${mutedText}`}>{role.title_cs}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fields.map(([name, label, def]) => {
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
                      <div key={name} className={isWide ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs font-bold mb-1.5 text-slate-400">{label}</label>
                        <input
                          type="text"
                          name={name}
                          defaultValue={editingItem[name] ?? def}
                          key={`${entity}-${editingItem.id || 'new'}-${name}`}
                          required={!isOptional}
                          className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-xs sm:text-sm font-medium"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="shrink-0 px-7 py-4 sm:px-9 sm:py-5 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className={`px-5 py-3 rounded-xl font-bold text-xs ${innerCard}`}
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 to-indigo-500 shadow-lg flex items-center gap-2"
                >
                  <Icon name="save" className="text-base" />
                  <span>{isEditingExisting ? 'Uložit změny' : 'Vytvořit položku'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
