#!/usr/bin/env node
/**
 * tools/lib/account-tools.mjs — عمليات حسابات مشتركة بين الأدوات والاختبارات
 * ==========================================================================
 * مرآة مقصودة لمنطق `src/worker/lib/password.ts` و`src/worker/lib/ids.ts`
 * و`normalizeEmail` في مسارات المصادقة — بلا اعتماديات، قابلة للاستيراد من
 * اختبارات vitest التي تقارنها بمصدر الحقيقة (TS) في الاتجاهين.
 *
 * قاعدة: أي تغيير في سياسة كلمة المرور في الـWorker يجب أن يُعكس هنا،
 * واختبار `tests/admin-create.test.ts` يفشل إن انحرفا (تحقق hash↔verify
 * متبادَل). لا تُعدّل هذا الملف لتجاوز سياسة — عدّل المصدرين معًا.
 *
 * تحذير أمني: هذه الوحدة تتعامل مع الـpepper وكلمات المرور. لا تطبع قيمها
 * أبدًا، ولا تسجّلها في ملفات أو تقارير.
 */
import { timingSafeEqual as nodeTimingSafeEqual } from 'node:crypto';

export const MIN_ITERATIONS = 20_000;
export const MAX_ITERATIONS = 2_000_000;
export const FREE_TIER_SAFE_ITERATIONS = 30_000;
export const OWASP_ITERATIONS_SHA256 = 600_000;
export const FORMAT_V1 = 'pbkdf2-sha256';
export const FORMAT_LEGACY = 'pbkdf2';
export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 200;

export class PasswordPolicyError extends Error {
  constructor(code, message) {
    super(code + ': ' + message);
    this.code = code;
  }
}

/** مطابقة `resolvePolicy` في الـWorker: افتراضي OWASP، قصّ لأعلى عند 20k، قصّ لأسفل عند 2M. */
export function resolvePolicyLike(env, opts = {}) {
  const raw = Number(env.PBKDF2_ITERATIONS);
  let iterations = Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : OWASP_ITERATIONS_SHA256;
  if (iterations < MIN_ITERATIONS) {
    iterations = MIN_ITERATIONS;
  }
  if (iterations > MAX_ITERATIONS) iterations = MAX_ITERATIONS;

  const pepper = env.PASSWORD_PEPPER ?? '';
  const requirePepper = opts.requirePepper ?? env.ENVIRONMENT !== 'test';
  if (!pepper) {
    if (requirePepper) {
      throw new PasswordPolicyError('PEPPER_MISSING', 'PASSWORD_PEPPER غير مضبوط.');
    }
    return { iterations, pepper: '', hasPepper: false };
  }
  if (pepper.length < 32 && requirePepper) {
    throw new PasswordPolicyError('PEPPER_WEAK', 'PASSWORD_PEPPER أقصر من 32 حرفًا.');
  }
  return { iterations, pepper, hasPepper: true };
}

export function b64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromB64url(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : '';
  const bin = atob(b64 + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function timingSafeEqualLocal(a, b) {
  if (a.length !== b.length) return false;
  return nodeTimingSafeEqual(Buffer.from(a), Buffer.from(b));
}

const enc = new TextEncoder();

async function initialKeyMaterial(password, pepper) {
  if (!pepper) return enc.encode(password);
  const key = await crypto.subtle.importKey('raw', enc.encode(pepper), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(password));
  return new Uint8Array(sig);
}

async function derive(kim, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', kim, 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    256,
  );
  return new Uint8Array(bits);
}

/** مطابقة `hashPassword`: ملح 16 بايتًا، وتجزئة 32 بايتًا، والصيغة v1. */
export async function hashPasswordLocal(password, policy) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const kim = await initialKeyMaterial(password, policy.pepper);
  const hash = await derive(kim, salt, policy.iterations);
  return `${FORMAT_V1}$${policy.iterations}$${b64url(salt)}$${b64url(hash)}`;
}

function parseStored(stored) {
  const parts = stored.split('$');
  if (parts.length !== 4) return null;
  const legacy = parts[0] === FORMAT_LEGACY;
  if (!legacy && parts[0] !== FORMAT_V1) return null;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1_000 || iterations > MAX_ITERATIONS) return null;
  try {
    const salt = fromB64url(parts[2]);
    const hash = fromB64url(parts[3]);
    if (salt.length !== 16 || hash.length !== 32) return null;
    return { legacy, iterations, salt, hash };
  } catch {
    return null;
  }
}

/** مطابقة `verifyPassword` (بما فيها مسار الترحيل legacy). */
export async function verifyPasswordLocal(password, stored, policy) {
  const p = parseStored(stored);
  if (!p) return false;
  const kim = p.legacy
    ? enc.encode(password + policy.pepper)
    : await initialKeyMaterial(password, policy.pepper);
  const actual = await derive(kim, p.salt, p.iterations);
  return timingSafeEqualLocal(actual, p.hash);
}

/* ---------- توليد كلمة مرور لمرة واحدة ---------- */

const LOWER = 'abcdefghjkmnpqrstuvwxyz'; // بلا l/o الملتبسة
const UPPER = 'ABCDEFGHJKMNPQRSTUVWXYZ'; // بلا I/O الملتبسة
const DIGITS = '23456789'; // بلا 0/1 الملتبسة
const SYMBOLS = '!@#%^*+-=?';
const ALL = LOWER + UPPER + DIGITS + SYMBOLS;

function pickN(str, n, rand) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(str[rand[i] % str.length]);
  return out;
}

/**
 * كلمة مرور عشوائية 24 حرفًا بتركيبة مضمونة (حروف صغيرة/كبيرة/أرقام/رمز)،
 * مولّدة من `crypto.getRandomValues` فقط. لا تُخزَّن ولا تُسجَّل — تُطبع مرة
 * واحدة للمشغّل ويتحمل هو حفظها وتغييرها فور أول دخول.
 */
export function generateAdminPassword(length = 24) {
  if (length < MIN_PASSWORD_LENGTH) throw new Error('طول كلمة المرور المطلوب أقل من الحد الأدنى.');
  const rand = crypto.getRandomValues(new Uint8Array(length * 2 + 16));
  let i = 0;
  const take = (n) => { const s = rand.slice(i, i + n); i += n; return s; };
  const chars = [
    ...pickN(LOWER, 3, take(3)),
    ...pickN(UPPER, 3, take(3)),
    ...pickN(DIGITS, 3, take(3)),
    ...pickN(SYMBOLS, 1, take(1)),
    ...pickN(ALL, length - 10, take(length - 10)),
  ];
  // خلط Fisher-Yates بعشوائية تشفيرية
  for (let j = chars.length - 1; j > 0; j--) {
    const k = take(1)[0] % (j + 1);
    [chars[j], chars[k]] = [chars[k], chars[j]];
  }
  return chars.join('');
}

/** فحوص رخيصة مطابقة لجوهر `passwordProblems` (الفحص الكامل في الـWorker). */
export function generatedPasswordLooksStrong(pw) {
  if (typeof pw !== 'string') return false;
  if (pw.length < MIN_PASSWORD_LENGTH || pw.length > MAX_PASSWORD_LENGTH) return false;
  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(pw)) return false;
  if (!/[0-9]/.test(pw)) return false;
  if (new Set(pw).size <= 2) return false;
  return true;
}

/* ---------- معرّفات وبريد وبيئة ---------- */

const ENC = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford base32

function encodeTime(now, len) {
  let out = '';
  let t = now;
  for (let i = 0; i < len; i++) {
    out = ENC[t % 32] + out;
    t = Math.floor(t / 32);
  }
  return out;
}

/** مطابقة `ulid()`: 10 محارف زمنية + 16 محرفًا عشوائيًا = 26 محرفًا. */
export function newUlid(now = Date.now()) {
  const time = encodeTime(now, 10);
  const rand = new Uint8Array(16);
  crypto.getRandomValues(rand);
  let out = '';
  for (let i = 0; i < 16; i++) out += ENC[rand[i] % 32];
  return time + out;
}

/** مطابقة `normalizeEmail`: تقليم ثم أحرف صغيرة. */
export const normalizeEmailLocal = (e) => e.trim().toLowerCase();

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/**
 * قراءة ملف `.dev.vars` (صيغة KEY=VALUE، بلا توسعة متغيّرات).
 * تُستخدم قيمه فقط عند غياب متغيّر البيئة نفسه. لا تطبع القيم أبدًا.
 */
export function readDotEnvVars(text) {
  const out = {};
  for (const rawLine of String(text).split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const body = line.startsWith('export ') ? line.slice(7).trim() : line;
    const eq = body.indexOf('=');
    if (eq <= 0) continue;
    const key = body.slice(0, eq).trim();
    let value = body.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) out[key] = value;
  }
  return out;
}
