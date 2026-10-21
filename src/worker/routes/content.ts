import type { Env, SessionUser } from '../types';
import { HttpError, json } from '../lib/http';
import { allowUnreviewedContent } from '../lib/content-access';

/**
 * حزمة درس للقراءة. القاعدة: المنشور فقط يُقدَّم للعامة.
 * المستخدم ذو صلاحية content.read يمكنه معاينة إصدار غير منشور بـ ?preview=1.
 */
export async function getLesson(req: Request, env: Env, requestId: string, user: SessionUser | null): Promise<Response> {
  const url = new URL(req.url);
  const parts = url.pathname.split('/');
  const slug = decodeURIComponent(parts[parts.length - 1] || '');
  if (!/^[a-z0-9-]{3,64}$/.test(slug)) throw new HttpError(400, 'INVALID_SLUG', 'معرّف الدرس غير صحيح.');

  const preview = url.searchParams.get('preview') === '1' && !!user?.permissions.includes('content.read');
  const row = await env.DB.prepare(
    `SELECT l.id, l.slug, l.title_ar, l.level_code, l.status, lv.id AS version_id, lv.version_no, lv.content_json, lv.content_hash
     FROM lessons l
     JOIN lesson_versions lv ON lv.id = l.current_version_id
     WHERE l.slug = ? ${preview ? '' : "AND l.status = 'published' AND lv.status = 'published'"}`,
  ).bind(slug).first<{
    id: string; slug: string; title_ar: string; level_code: string; status: string;
    version_id: string; version_no: number; content_json: string; content_hash: string;
  }>();

  if (!row) throw new HttpError(404, 'LESSON_NOT_FOUND', 'هذا الدرس غير متاح.');

  return json(
    {
      lesson: {
        id: row.id,
        slug: row.slug,
        titleAr: row.title_ar,
        level: row.level_code,
        versionId: row.version_id,
        versionNo: row.version_no,
        contentHash: row.content_hash,
        content: JSON.parse(row.content_json),
      },
    },
    { headers: { 'ETag': `"${row.content_hash}"`, 'Cache-Control': 'public, max-age=60, stale-while-revalidate=600' } },
    requestId,
  );
}

/**
 * كتالوج المسارات. المنشور فقط افتراضيًا.
 * في التطوير فقط (وبمفتاح صريح) تُعرض المسودات أيضًا، موسومة بأنها عينة غير مراجعة —
 * وإلا لظهرت المنصة فارغة تمامًا بينما المحتوى موجود، وهذا تضليل معكوس.
 */
export async function listPaths(_req: Request, env: Env, requestId: string): Promise<Response> {
  const includeDrafts = allowUnreviewedContent(env);
  const programFilter = includeDrafts ? "p.status IN ('published','draft')" : "p.status = 'published'";
  const unitFilter = includeDrafts ? "u.status IN ('published','draft')" : "u.status = 'published'";
  const lessonFilter = includeDrafts ? "l.status IN ('published','draft')" : "l.status = 'published'";

  const rows = await env.DB.prepare(
    `SELECT p.slug, p.title_ar, p.kind, p.level_code, p.category, p.estimated_minutes, p.status AS program_status,
            (SELECT COUNT(*) FROM units u WHERE u.program_id = p.id AND ${unitFilter}) AS units_count,
            (SELECT COUNT(*) FROM lessons l JOIN units u2 ON u2.id = l.unit_id
              WHERE u2.program_id = p.id AND ${lessonFilter}) AS lessons_count
     FROM programs p
     WHERE ${programFilter} AND p.is_active = 1
     ORDER BY p.kind DESC, p.sort_order`,
  ).all<{ program_status: string } & Record<string, unknown>>();

  const paths = rows.results.map(r => ({
    ...r,
    ...(includeDrafts && r.program_status !== 'published' ? { provenance: 'unreviewed_sample' } : {}),
  }));

  return json(
    { paths, ...(includeDrafts ? { contentProvenance: 'unreviewed_sample' } : {}) },
    { headers: { 'Cache-Control': includeDrafts ? 'no-store' : 'public, max-age=300' } },
    requestId,
  );
}
