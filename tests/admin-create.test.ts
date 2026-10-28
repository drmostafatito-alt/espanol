/* أداة إنشاء المدير الأعلى — تكافؤ التجزئة مع الـWorker وحواجز الأداة */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import {
  generateAdminPassword,
  generatedPasswordLooksStrong,
  hashPasswordLocal,
  verifyPasswordLocal,
  resolvePolicyLike,
  newUlid,
  normalizeEmailLocal,
  EMAIL_RE,
  readDotEnvVars,
// @ts-ignore — وحدة .mjs مشتركة مع الأدوات
} from '../tools/lib/account-tools.mjs';
import {
  hashPassword,
  verifyPassword,
  resolvePolicy,
  passwordProblems,
} from '../src/worker/lib/password';
import { normalizeEmail } from '../src/worker/routes/auth';

const ROOT = join(import.meta.dirname, '..');
const PEPPER = 'test-pepper-0123456789abcdefghijklmnopqr';
const POLICY = { iterations: 30_000, pepper: PEPPER, hasPepper: true };

describe('تكافؤ التجزئة بين الأداة والـWorker', () => {
  it('تجزئة الأداة يقبلها تحقق الـWorker، والعكس', async () => {
    const h1 = await hashPasswordLocal('Cairo2026learn!', POLICY);
    expect(await verifyPassword('Cairo2026learn!', h1, POLICY)).toBe(true);
    expect(await verifyPassword('wrong-password-1', h1, POLICY)).toBe(false);

    const h2 = await hashPassword('Cairo2026learn!', POLICY);
    expect(await verifyPasswordLocal('Cairo2026learn!', h2, POLICY)).toBe(true);
    expect(await verifyPasswordLocal('wrong-password-1', h2, POLICY)).toBe(false);
  });

  it('صيغة التجزئة v1 كما في الـWorker', async () => {
    const h = await hashPasswordLocal('Cairo2026learn!', POLICY);
    expect(h.startsWith('pbkdf2-sha256$30000$')).toBe(true);
    expect(h.split('$')).toHaveLength(4);
  });

  it('سياسة الأداة تطابق سياسة الـWorker', () => {
    expect(resolvePolicyLike({ PASSWORD_PEPPER: PEPPER }).iterations).toBe(
      resolvePolicy({ PASSWORD_PEPPER: PEPPER }).iterations,
    );
    expect(resolvePolicyLike({ PBKDF2_ITERATIONS: '30000', PASSWORD_PEPPER: PEPPER }).iterations).toBe(30_000);
    expect(resolvePolicyLike({ PBKDF2_ITERATIONS: '5', PASSWORD_PEPPER: PEPPER }).iterations).toBe(20_000);
    expect(() => resolvePolicyLike({ ENVIRONMENT: 'production' }).code).toThrow;
    expect(() => resolvePolicyLike({ ENVIRONMENT: 'production' })).toThrowError(/PEPPER_MISSING/);
    expect(() => resolvePolicyLike({ PASSWORD_PEPPER: 'short', ENVIRONMENT: 'production' })).toThrowError(/PEPPER_WEAK/);
  });

  it('كلمات المرور المولّدة تجتاز سياسة الـWorker كاملة', async () => {
    const seen = new Set();
    for (let i = 0; i < 50; i++) {
      const pw = generateAdminPassword(24);
      expect(pw).toHaveLength(24);
      expect(generatedPasswordLooksStrong(pw)).toBe(true);
      expect(passwordProblems(pw, { email: 'admin@example.com' })).toEqual([]);
      seen.add(pw);
    }
    expect(seen.size).toBe(50);
  });

  it('ULID والبريد يطابقان الـWorker', () => {
    expect(newUlid()).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    expect(newUlid(1_000)).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    expect(normalizeEmailLocal('  Admin@Example.COM ')).toBe(normalizeEmail('  Admin@Example.COM '));
    expect(normalizeEmailLocal('Admin@Example.COM')).toBe('admin@example.com');
    expect(EMAIL_RE.test('admin@example.com')).toBe(true);
    expect(EMAIL_RE.test('not-an-email')).toBe(false);
  });

  it('قراءة .dev.vars بلا توسعة ولا طباعة', () => {
    const vars = readDotEnvVars('# تعليق\nPASSWORD_PEPPER="abc def"\nPBKDF2_ITERATIONS=30000\nEMPTY=\nBAD LINE\n');
    expect(vars.PASSWORD_PEPPER).toBe('abc def');
    expect(vars.PBKDF2_ITERATIONS).toBe('30000');
    expect(vars.EMPTY).toBe('');
    expect(vars['BAD LINE']).toBeUndefined();
  });
});

function runCli(args: string[], env: Record<string, string | undefined>) {
  const childEnv: Record<string, string> = { ...process.env } as Record<string, string>;
  // إلغاء قراءة .dev.vars الحقيقي (يحمل pepper وهميًا) حتى تكون الاختبارات حتمية.
  childEnv.ESPANOL_DOTENV_PATH = '/tmp/espanol-admin-test-no-dotenv';
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) delete childEnv[k];
    else childEnv[k] = v;
  }
  return spawnSync(process.execPath, ['tools/admin-create.mjs', ...args], {
    cwd: ROOT,
    env: childEnv,
    encoding: 'utf8',
    timeout: 30_000,
  });
}

function scratchDb(): { dir: string; dbPath: string } {
  const dir = mkdtempSync(join(tmpdir(), 'espanol-admin-test-'));
  const dbPath = join(dir, 'scratch.db');
  const db = new DatabaseSync(dbPath);
  const migDir = join(ROOT, 'db/migrations');
  for (const f of readdirSync(migDir).filter(x => x.endsWith('.sql')).sort()) {
    db.exec(readFileSync(join(migDir, f), 'utf8'));
  }
  db.close();
  return { dir, dbPath };
}

describe('حواجز أداة admin-create', () => {
  it('ترفض العمل عن بُعد والبريد السيئ والملف الإنتاجي الاسم', () => {
    expect(runCli(['--remote', '--email', 'a@b.com'], {}).status).toBe(2);
    expect(runCli([], {}).status).toBe(2);
    expect(runCli(['--email', 'not-an-email'], {}).status).toBe(2);
    expect(runCli(['--email', 'a@b.com', '--bogus'], {}).status).toBe(2);
    expect(runCli(['--email', 'a@b.com', '--db-file', '/tmp/prod-copy.db'], {}).status).toBe(2);
    // بيئة production في الشل وحدها لا تُرفض: الأداة محلية بالبناء ولا تملك
    // مسارًا بعيدًا؛ الحماية في database_id والاسم والمسار، لا في اسم البيئة.
    // لكن بلا pepper تُرفض حتمًا (انظر الاختبار التالي).
  });

  it('ترفض غياب الـpepper أو قصره في أي بيئة ولا تنشئ شيئًا', () => {
    const { dir, dbPath } = scratchDb();
    try {
      const noPepper = runCli(['--email', 'admin@example.com', '--db-file', dbPath], {
        PASSWORD_PEPPER: undefined,
        PBKDF2_ITERATIONS: '30000',
        ENVIRONMENT: 'test',
      });
      expect(noPepper.status).toBe(2);
      const weak = runCli(['--email', 'admin2@example.com', '--db-file', dbPath], {
        PASSWORD_PEPPER: 'short',
        PBKDF2_ITERATIONS: '30000',
        ENVIRONMENT: 'production',
      });
      expect(weak.status).toBe(2);
      const db = new DatabaseSync(dbPath);
      expect((db.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number }).n).toBe(0);
      db.close();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('إنشاء مدير أعلى على قاعدة تجريبية', () => {
  it('ينشئ الحساب ويتحقق من التجزئة عبر الـWorker، ويرفض التكرار', async () => {
    const { dir, dbPath } = scratchDb();
    try {
      const r = runCli(['--email', 'Admin@Example.com', '--db-file', dbPath, '--display-name', 'مدير أول'], {
        PASSWORD_PEPPER: PEPPER,
        PBKDF2_ITERATIONS: '30000',
        ENVIRONMENT: 'production',
      });
      expect(r.status).toBe(0);
      expect(r.stdout).toContain('super_admin');
      expect(r.stdout).toContain('admin@example.com');
      const pwLine = r.stdout.split('\n').find(l => /^[A-Za-z0-9!@#%^*+\-=?]{24}$/.test(l.trim()));
      expect(pwLine, 'كلمة المرور المطبوعة مرة واحدة').toBeDefined();
      const pw = pwLine!.trim();
      expect(r.stdout).not.toContain('pbkdf2-sha256$');

      const db = new DatabaseSync(dbPath);
      const row = db.prepare(
        "SELECT u.id, u.email_normalized, u.password_hash, u.status, u.email_verified_at, r.code AS role FROM users u JOIN roles r ON r.id=u.role_id WHERE u.email_normalized='admin@example.com'",
      ).get() as Record<string, unknown>;
      expect(row.role).toBe('super_admin');
      expect(row.status).toBe('active');
      expect(row.email_verified_at).toBeNull();
      expect(db.prepare('SELECT COUNT(*) AS n FROM user_profiles WHERE user_id=?').get(row.id as string)).toMatchObject({ n: 1 });
      expect(db.prepare('SELECT COUNT(*) AS n FROM user_stats WHERE user_id=?').get(row.id as string)).toMatchObject({ n: 1 });
      expect(db.prepare('SELECT COUNT(*) AS n FROM notification_preferences WHERE user_id=?').get(row.id as string)).toMatchObject({ n: 1 });
      expect(await verifyPassword(pw, row.password_hash as string, POLICY)).toBe(true);
      db.close();

      const dup = runCli(['--email', 'admin@example.com', '--db-file', dbPath], {
        PASSWORD_PEPPER: PEPPER,
        PBKDF2_ITERATIONS: '30000',
        ENVIRONMENT: 'production',
      });
      expect(dup.status).toBe(1);
      const db2 = new DatabaseSync(dbPath);
      expect((db2.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number }).n).toBe(1);
      db2.close();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('وضع dry-run لا يكتب شيئًا', () => {
    const { dir, dbPath } = scratchDb();
    try {
      const r = runCli(['--email', 'dry@example.com', '--db-file', dbPath, '--dry-run'], {
        PASSWORD_PEPPER: PEPPER,
        PBKDF2_ITERATIONS: '30000',
        ENVIRONMENT: 'production',
      });
      expect(r.status).toBe(0);
      const db = new DatabaseSync(dbPath);
      expect((db.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number }).n).toBe(0);
      db.close();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
