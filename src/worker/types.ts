/* ============================================================================
   Español بالعربي — أنواع البيئة والـ D1 (بلا اعتماد على حزم خارجية)
   ========================================================================== */

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: { duration?: number; changes?: number; last_row_id?: number };
}
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

export interface Env {
  DB: D1Database;
  ASSETS?: { fetch(request: Request): Promise<Response> };
  ENVIRONMENT: string;
  APP_ORIGIN: string;
  MEDIA_ORIGIN: string;
  /** عدد تكرارات PBKDF2 — يُقيَّد بين 20,000 و2,000,000 داخل password.ts */
  PBKDF2_ITERATIONS: string;
  SESSION_TTL_DAYS: string;
  /** سر خارج القاعدة لتجزئة كلمات المرور (wrangler secret). إلزامي في غير بيئة الاختبار. */
  PASSWORD_PEPPER?: string;
  /** 'false' يغلق التسجيل العام — يُستخدم كبوابة حتى اعتماد سياسة كلمات مرور مناسبة */
  ALLOW_PUBLIC_SIGNUP?: string;
  /** 'true' يسمح بخدمة محتوى draft في التطوير فقط، مع وسم «عينة غير مراجعة» */
  ALLOW_UNREVIEWED_CONTENT?: string;
  /** تطوير/اختبار محلي فقط: رفع حد التسجيل لكل عنوان في الساعة (الافتراضي 10) */
  SIGNUP_RATE_LIMIT_PER_HOUR?: string;
  VAPID_PUBLIC_KEY?: string;
}

export type RoleCode =
  | 'learner' | 'super_admin' | 'admin' | 'content_manager'
  | 'language_reviewer' | 'support_agent' | 'analyst';

export interface UserRow {
  id: string;
  email_normalized: string;
  email_display: string;
  password_hash: string;
  role_id: string;
  role_code: RoleCode;
  status: 'active' | 'suspended' | 'pending_deletion' | 'deleted';
  failed_login_count: number;
  locked_until: string | null;
  created_at: string;
}

export interface SessionUser {
  id: string;
  email: string;
  displayName: string | null;
  role: RoleCode;
  explanationStyle: 'fusha' | 'eg' | 'fusha_eg';
  audioVariant: 'es-ES' | 'es-419';
  dailyGoalMinutes: number;
  permissions: string[];
}
