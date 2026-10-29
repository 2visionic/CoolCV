// TypeScript data models for React frontend, Backoffice and PHP REST API

export type ThemeMode = 'dark' | 'light';
export type LangCode = 'cs' | 'en';
export type AppView = 'cv' | 'backoffice';
export type ViewMode = AppView;
export type RoleSlug = string;
export type RoleFilter = string;
export type CrudEntityName = 'roles' | 'skills' | 'experience' | 'projects' | 'education' | 'socials';
export type BackofficeTab = 'profile' | 'sections' | 'socials' | 'roles' | 'skills' | 'experience' | 'projects' | 'education' | 'system';

export interface ProfileData {
  id?: number;
  full_name: string;
  subtitle_cs: string;
  subtitle_en: string;
  bio_cs: string;
  bio_en: string;
  location_cs: string;
  location_en: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  availability_cs: string;
  availability_en: string;
  avatar_url?: string;
  years_exp_badge?: string;
  [key: string]: string | number | undefined;
}

export interface RolePillar {
  id: number;
  slug: string;
  badge_code: string;
  icon: string;
  level_cs: string;
  level_en: string;
  title_cs: string;
  title_en: string;
  summary_cs: string;
  summary_en: string;
  sort_order: number;
  [key: string]: string | number | undefined;
}

export interface SkillItem {
  id: number;
  role_slug: string;
  name_cs: string;
  name_en: string;
  proficiency: number;
  years_exp: string;
  tags: string;
  sort_order?: number;
  [key: string]: string | number | undefined;
}

export interface ExperienceItem {
  id: number;
  period_cs: string;
  period_en: string;
  role_cs: string;
  role_en: string;
  company: string;
  description_cs: string;
  description_en: string;
  achievements_cs: string;
  achievements_en: string;
  role_tags: string;
  sort_order?: number;
  [key: string]: string | number | undefined;
}

export interface ProjectItem {
  id: number;
  title_cs: string;
  title_en: string;
  subtitle_cs: string;
  subtitle_en: string;
  description_cs: string;
  description_en: string;
  outcome_cs: string;
  outcome_en: string;
  tech_stack: string;
  role_tags: string;
  demo_url?: string;
  repo_url?: string;
  sort_order?: number;
  [key: string]: string | number | undefined;
}

export interface EducationItem {
  id: number;
  period: string;
  title_cs: string;
  title_en: string;
  institution_cs: string;
  institution_en: string;
  details_cs: string;
  details_en: string;
  role_tags: string;
  sort_order?: number;
  [key: string]: string | number | undefined;
}

export interface SocialItem {
  id: number;
  title: string;
  url: string;
  icon: string;
  sort_order?: number;
  [key: string]: string | number | undefined;
}

export interface CvDataPayload {
  driver: string;
  needs_setup?: boolean;
  profile: ProfileData;
  roles: RolePillar[];
  skills: SkillItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  socials?: SocialItem[];
}

export interface AuthUser {
  id: number;
  username: string;
  display_name: string;
  role: string;
}

export interface JwtClaims {
  iss: string;
  sub: number;
  username: string;
  display_name: string;
  role: string;
  iat: number;
  exp: number;
}

export interface BackendCryptoReport {
  jwt_hs256: {
    standard: string;
    algorithm: string;
    header_b64: string;
    payload_b64: string;
    signature_b64: string;
    decoded_header: { alg: string; typ: string };
    decoded_payload: JwtClaims;
  };
  aes_256_backend: {
    algorithm: string;
    key_derivation: string;
    iv_hex: string;
    ciphertext_base64: string;
    hmac_sha256_hex: string;
    encrypted_envelope: string;
    plaintext_bytes: number;
    encrypted_at: string;
    roundtrip_verified: boolean;
    decrypted_preview: Record<string, unknown> | null;
  };
  password_hashing: {
    algorithm: string;
    cost_factor: number;
    hash_sample: string;
  };
}

export interface LiveCryptoProbeData {
  input_plaintext: string;
  encryption_process: {
    algorithm: string;
    key_derivation: string;
    iv_hex: string;
    ciphertext_base64: string;
    hmac_sha256_hex: string;
    encrypted_envelope: string;
    plaintext_bytes: number;
    encrypted_at: string;
  };
  decryption_verify: {
    verified_hmac: boolean;
    iv_hex: string;
    decrypted_raw: string;
  } | null;
}

export interface ApiLogEntry {
  id: number;
  time: string;
  method: string;
  url: string;
  status: number;
  ms: number | string;
  response: unknown;
}

export interface ApiCallResult<T = any> {
  ok: boolean;
  status: number;
  data: T;
}

declare global {
  interface Window {
    __INITIAL_STATE__?: {
      theme?: ThemeMode;
      lang?: LangCode;
      initialView?: ViewMode;
      cvData?: CvDataPayload;
    };
    html2pdf?: any;
  }
}
