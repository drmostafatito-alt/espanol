/**
 * محوّل D1 → SQLite (better-sqlite3) للاختبارات المحلية في Node.
 *
 * ⚠️ لماذا يوجد هذا الملف؟
 *   wrangler 4 يتطلب Node ≥ 22 والبيئة الحالية Node 20.20. لذلك تُختبر نفس دالة
 *   `worker.fetch` في Node عبر محوّل يحاكي واجهة D1: prepare/bind/first/all/run/batch/exec.
 *   هذا **اختلاف بيئة موثّق**، ولا يُغني عن smoke test على workerd/D1 حقيقي قبل النشر
 *   (المرحلة 2+). انظر docs/11_TESTING.md §7.
 */
import Database from 'better-sqlite3';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { D1Database, D1PreparedStatement, D1Result } from '../types';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

function norm(values: unknown[]): unknown[] {
  return values.map(v => {
    if (v === undefined) return null;
    if (typeof v === 'boolean') return v ? 1 : 0;
    if (v instanceof Uint8Array) return Buffer.from(v);
    return v;
  });
}

class Stmt implements D1PreparedStatement {
  constructor(private db: Database.Database, private sql: string, private args: unknown[] = []) {}

  bind(...values: unknown[]): D1PreparedStatement {
    return new Stmt(this.db, this.sql, norm(values));
  }

  /** تنفيذ متزامن (يُستخدم داخل المعاملات) */
  execSync<T = unknown>(): D1Result<T> {
    const stmt = this.db.prepare(this.sql);
    if (stmt.reader) {
      const rows = stmt.all(...(this.args as [])) as T[];
      return { results: rows, success: true, meta: { duration: 0 } };
    }
    const info = stmt.run(...(this.args as []));
    return { results: [], success: true, meta: { changes: info.changes, last_row_id: Number(info.lastInsertRowid) } };
  }

  async first<T = unknown>(colName?: string): Promise<T | null> {
    const row = this.db.prepare(this.sql).get(...(this.args as [])) as Record<string, unknown> | undefined;
    if (!row) return null;
    return colName ? ((row[colName] as T) ?? null) : (row as T);
  }

  async all<T = unknown>(): Promise<D1Result<T>> {
    return this.execSync<T>();
  }

  async run(): Promise<D1Result> {
    return this.execSync();
  }
}

export class D1Sqlite implements D1Database {
  constructor(private db: Database.Database) {}

  prepare(query: string): D1PreparedStatement {
    return new Stmt(this.db, query);
  }

  async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    const out: D1Result<T>[] = [];
    const tx = this.db.transaction(() => {
      for (const s of statements) out.push((s as Stmt).execSync<T>());
    });
    tx();
    return out;
  }

  async exec(query: string): Promise<{ count: number; duration: number }> {
    this.db.exec(query);
    return { count: 1, duration: 0 };
  }
}

export interface TestDb { d1: D1Database; raw: Database.Database }

/** قاعدة في الذاكرة مع كل الترحيلات مطبقة */
export function createTestDb(): TestDb {
  const raw = new Database(':memory:');
  raw.pragma('foreign_keys = ON');
  const dir = join(ROOT, 'db', 'migrations');
  const files = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.sql')).sort() : [];
  if (!files.length) throw new Error('لا توجد ملفات ترحيل في db/migrations');
  for (const f of files) raw.exec(readFileSync(join(dir, f), 'utf8'));
  return { d1: new D1Sqlite(raw), raw };
}
