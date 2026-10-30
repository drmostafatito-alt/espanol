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
      // 1560 لا 1567: درس العيّنة `content/exemplars/lesson-prea1-hola-me-llamo.json`
      // يكرّر درس المنهج نفسه (slug واحد) بسبعة تمارين بمعرّفات مختلفة. المحتوى
      // الحقيقي (drafts) هو المرجع، والعيّنة تُسقَط من الاستيراد بدل إدخال نسختين
      // للدرس الواحد (ملفها باقٍ في المستودع ومُبلَّغ في سجل الاستيراد).
      expect(count('exercises')).toBe(1560);
      expect(count('vocabulary_entries')).toBe(8577);
      // الروابط: 2122 زوجًا مخططًا (يتحقق منها السكربت نفسه: موجودة 2122/2122،
      // بلا مفقود)، و2165 صفًا إجمالًا — الفرق روابط تصدرها خطط المجلدات خارج
      // مجموعة collectGlobalLinks (مشروع، بمفتاح فريد). قاعدة العمل المحلية
      // تحوي 2170 لتراكم 5 روابط قديمة عبر تاريخ المحتوى (الاستيراد إلحاقي
      // بلا حذف) — ليست تكرارًا: كل زوج فريد بمفتاحه.
      // 2165 بدل 2163: حُسمت إحالتان في الدرس نفسه — «fui» تشير إلى ir و«visto»
      // إلى ver (LESSON_FORM_OVERRIDES في tools/lib/content-plan.mjs، الحسم مكتوب
      // من نص الدرسين) فصارتا رابطين فعليين بدل إحالتين غير محلولة.
      expect(count('lesson_vocabulary')).toBe(2165);
      /* سير العمل: كل درس مستورد له قرار صريح في سياسة الإفراج
         (content/review/release-policy.v1.json). الحالة تُشتق من المصدر نفسه
         لا من أرقام مكتوبة يدويًا: كل slug مُفرَج عنه ⇒ published/approved،
         وغيره ⇒ draft/unreviewed. */
      const policy = JSON.parse(
        readFileSync(join(process.cwd(), 'content/review/release-policy.v1.json'), 'utf8'),
      ) as { lessons: Record<string, { released: boolean }>; totals: { released: number } };
      const releasedSlugs = new Set(
        Object.entries(policy.lessons).filter(([, v]) => v.released).map(([slug]) => slug),
      );
      const rows = db
        .prepare(
          `SELECT l.slug, l.status, lv.review_state
             FROM lessons l JOIN lesson_versions lv ON lv.id = l.current_version_id`,
        )
        .all() as Array<{ slug: string; status: string; review_state: string }>;
      expect(rows.length).toBe(258);
      let publishedCount = 0;
      for (const row of rows) {
        const want = releasedSlugs.has(row.slug);
        expect(row.status, `حالة ${row.slug}`).toBe(want ? 'published' : 'draft');
        expect(row.review_state, `مراجعة ${row.slug}`).toBe(want ? 'approved' : 'unreviewed');
        if (want) publishedCount += 1;
      }
      expect(publishedCount).toBeGreaterThanOrEqual(policy.totals.released - 1); // -1: درس عيّنة مكرر يُسقَط
      /* إثبات المصدر: سجل مراجعة آلي لكل نسخة مُفرج عنها (3 مراحل)، بلا اسم
         مراجع بشري — reviewer_id NULL في كل صفّ. */
      expect((db.prepare("SELECT COUNT(*) AS n FROM content_review_records").get() as { n: number }).n).toBe(publishedCount * 3);
      expect((db.prepare("SELECT COUNT(*) AS n FROM content_review_records WHERE reviewer_id IS NOT NULL").get() as { n: number }).n).toBe(0);
      expect((db.prepare("SELECT COUNT(*) AS n FROM content_review_records WHERE decision <> 'passed'").get() as { n: number }).n).toBe(0);
      expect((db.prepare(`SELECT COUNT(*) AS n FROM lessons l
        JOIN lesson_versions lv ON lv.id = l.current_version_id
        WHERE l.status = 'published'
          AND (SELECT COUNT(*) FROM content_review_records r WHERE r.target_id = lv.id) <> 3`).get() as { n: number }).n).toBe(0);
      db.close();

      // إعادة التطبيق: نفس الأعداد تمامًا — بلا صفوف مكررة وبلا إصدارات جديدة
      const r2 = run(['--local-test', '--db-file', dbPath], 300_000);
      expect(r2.status, r2.stderr.slice(-500)).toBe(0);
      const db2 = new DatabaseSync(dbPath);
      const count2 = (t: string) => (db2.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get() as { n: number }).n;
      expect(count2('lessons')).toBe(258);
      expect(count2('exercises')).toBe(1560);
      expect(count2('vocabulary_entries')).toBe(8577);
      expect(count2('lesson_vocabulary')).toBe(2165);
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
