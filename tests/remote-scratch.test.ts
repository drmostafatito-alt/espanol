/* مسار القاعدة البعيدة التجريبية — الحواجز + الاختبار المحلي الكامل */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const ROOT = join(import.meta.dirname, '..');

function run(args: string[], timeout = 30_000) {
  return spawnSync(process.execPath, ['tools/remote-scratch-setup.mjs', ...args], {
    cwd: ROOT, encoding: 'utf8', timeout,
  });
}

describe('حواجز اسم القاعدة التجريبية', () => {
  it('يرفض أي اسم ليس es-ar-scratch قبل أي اتصال', () => {
    for (const name of ['es-ar-prod', 'es-ar-production', 'es-ar-scratch-prod', 'my-db', 'es-ar-scratch_TEST', '']) {
      const r = run(['--database', name, '--dry-run']);
      expect(r.status, `الاسم: ${name || '(فارغ)'}`).toBe(2);
    }
    expect(run(['--database', 'es-ar-scratch-20261028', '--dry-run']).status).toBe(0);
    expect(run(['--database', 'es-ar-scratch', '--dry-run']).status).toBe(0);
  });

  it('يرفض الحذف والاختبار المحلي بأسماء إنتاجية', () => {
    expect(run(['--teardown', '--database', 'es-ar-prod']).status).toBe(2);
    expect(run(['--local-test', '--db-file', '/tmp/prod-copy.db']).status).toBe(2);
  });

  it('وضع dry-run عن بُعد يطبع الخطة ولا ينفذ شيئًا', () => {
    const r = run(['--database', 'es-ar-scratch-20261028', '--dry-run']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('wrangler d1 create es-ar-scratch-20261028');
    expect(r.stdout).toContain('0001_init.sql');
    expect(r.stdout).not.toContain('not authenticated');
  });
});

describe('التصدير إلى SQL', () => {
  it('يولّد ملفًا قابلًا للتقسيم بلا BEGIN وبلا كتابة في قاعدة', () => {
    const dir = mkdtempSync(join(tmpdir(), 'espanol-export-test-'));
    try {
      const sqlPath = join(dir, 'content.sql');
      const manifestPath = join(dir, 'manifest.json');
      const r = spawnSync(process.execPath, ['tools/export-content-sql.mjs', '--out', sqlPath, '--manifest', manifestPath], {
        cwd: ROOT, encoding: 'utf8', timeout: 300_000,
      });
      expect(r.status).toBe(0);
      const text = readFileSync(sqlPath, 'utf8');
      expect(text).toContain('__ES_AR_STMT_BOUNDARY__');
      expect(text).not.toMatch(/^BEGIN/m);
      expect(text).toContain('ON CONFLICT');
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      const chunks = text.split('\n-- __ES_AR_STMT_BOUNDARY__\n').map(c => c.trim()).filter(Boolean);
      expect(chunks.length).toBe(manifest.total);
      expect(manifest.total).toBeGreaterThan(100_000);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 300_000);
});

describe('المسار الكامل على ملف تجريبي محلي', () => {
  it('ترحيلات + محتوى + تحقق، ثم إعادة تطبيق بلا تكرار', () => {
    const dir = mkdtempSync(join(tmpdir(), 'espanol-scratch-test-'));
    const dbPath = join(dir, 'scratch.db');
    try {
      const r1 = run(['--local-test', '--db-file', dbPath], 300_000);
      expect(r1.status, r1.stderr.slice(-500)).toBe(0);
      const db = new DatabaseSync(dbPath);
      const count = (t: string) => (db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get() as { n: number }).n;
      expect(count('schema_migrations')).toBe(5);
      expect(count('lessons')).toBe(258);
      expect(count('exercises')).toBe(1567);
      expect(count('vocabulary_entries')).toBe(8577);
      // الروابط: 2120 زوجًا مخططًا (يتحقق منها السكربت نفسه: موجودة 2120/2120،
      // بلا مفقود)، و2163 صفًا إجمالًا — الفرق روابط تصدرها خطط المجلدات خارج
      // مجموعة collectGlobalLinks (مشروع، بمفتاح فريد). قاعدة العمل المحلية
      // تحوي 2168 لتراكم 5 روابط قديمة عبر تاريخ المحتوى (الاستيراد إلحاقي
      // بلا حذف) — ليست تكرارًا: كل زوج فريد بمفتاحه.
      expect(count('lesson_vocabulary')).toBe(2163);
      expect((db.prepare("SELECT COUNT(*) AS n FROM lessons WHERE status <> 'draft'").get() as { n: number }).n).toBe(0);
      expect((db.prepare("SELECT COUNT(*) AS n FROM lesson_versions WHERE review_state <> 'unreviewed'").get() as { n: number }).n).toBe(0);
      db.close();

      // إعادة التطبيق: نفس الأعداد تمامًا — بلا صفوف مكررة وبلا إصدارات جديدة
      const r2 = run(['--local-test', '--db-file', dbPath], 300_000);
      expect(r2.status, r2.stderr.slice(-500)).toBe(0);
      const db2 = new DatabaseSync(dbPath);
      const count2 = (t: string) => (db2.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get() as { n: number }).n;
      expect(count2('lessons')).toBe(258);
      expect(count2('exercises')).toBe(1567);
      expect(count2('vocabulary_entries')).toBe(8577);
      expect(count2('lesson_vocabulary')).toBe(2163);
      expect(count2('schema_migrations')).toBe(5);
      db2.close();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 300_000);

  it('dry-run المحلي لا ينشئ الملف أصلًا', () => {
    const dir = mkdtempSync(join(tmpdir(), 'espanol-scratch-dry-'));
    const dbPath = join(dir, 'scratch.db');
    try {
      const r = run(['--local-test', '--db-file', dbPath, '--dry-run']);
      expect(r.status).toBe(0);
      expect(existsSync(dbPath)).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
