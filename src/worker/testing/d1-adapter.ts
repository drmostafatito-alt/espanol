/**
 * محوّل D1 → SQLite للاختبارات المحلية في Node.
 * يدعم node:sqlite المدمج في Node 22+ كخيار أصيل بلا اعتماديات native compilations،
 * مع دعم بديل لـ better-sqlite3.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { D1Database, D1PreparedStatement, D1Result } from '../types';

let SqliteDatabase: any;

try {
  const nodeSqlite = await import('node:sqlite');
  if (nodeSqlite && nodeSqlite.DatabaseSync) {
    SqliteDatabase = nodeSqlite.DatabaseSync;
  }
} catch {
  // fallback below
}

if (!SqliteDatabase) {
  try {
    const bSqlite = await import('better-sqlite3');
    SqliteDatabase = bSqlite.default || bSqlite;
  } catch {
    throw new Error('تعذر تحميل أي محرك SQLite (node:sqlite أو better-sqlite3)');
  }
}

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
  constructor(private db: any, private sql: string, private args: unknown[] = []) {}

  bind(...values: unknown[]): D1PreparedStatement {
    return new Stmt(this.db, this.sql, norm(values));
  }

  /** تنفيذ متزامن (يُستخدم داخل المعاملات) */
  execSync<T = unknown>(): D1Result<T> {
    const isReader = /^\s*(SELECT|PRAGMA|WITH)\b/i.test(this.sql);
    const stmt = this.db.prepare(this.sql);
    if (isReader || (stmt.reader ?? false)) {
      const rows = stmt.all(...(this.args as [])) as T[];
      return { results: rows, success: true, meta: { duration: 0 } };
    }
    const info = stmt.run(...(this.args as []));
    return { results: [], success: true, meta: { changes: info.changes ?? 0, last_row_id: Number(info.lastInsertRowid ?? 0) } };
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
  constructor(private db: any) {}

  prepare(query: string): D1PreparedStatement {
    return new Stmt(this.db, query);
  }

  async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    const out: D1Result<T>[] = [];
    if (typeof this.db.transaction === 'function') {
      const tx = this.db.transaction(() => {
        for (const s of statements) out.push((s as Stmt).execSync<T>());
      });
      tx();
    } else {
      this.db.exec('BEGIN');
      try {
        for (const s of statements) out.push((s as Stmt).execSync<T>());
        this.db.exec('COMMIT');
      } catch (e) {
        this.db.exec('ROLLBACK');
        throw e;
      }
    }
    return out;
  }

  async exec(query: string): Promise<{ count: number; duration: number }> {
    this.db.exec(query);
    return { count: 1, duration: 0 };
  }
}

export interface TestDb { d1: D1Database; raw: any }

/** قاعدة في الذاكرة مع كل الترحيلات مطبقة */
export function createTestDb(): TestDb {
  const raw = new SqliteDatabase(':memory:');
  if (typeof raw.pragma === 'function') {
    raw.pragma('foreign_keys = ON');
  } else {
    raw.exec('PRAGMA foreign_keys = ON;');
    raw.pragma = (str: string) => raw.exec(`PRAGMA ${str};`);
  }
  const dir = join(ROOT, 'db', 'migrations');
  const files = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.sql')).sort() : [];
  if (!files.length) throw new Error('لا توجد ملفات ترحيل في db/migrations');
  for (const f of files) raw.exec(readFileSync(join(dir, f), 'utf8'));
  return { d1: new D1Sqlite(raw), raw };
}
