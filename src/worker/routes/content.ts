import type { Env, SessionUser } from '../types';
import { HttpError, json } from '../lib/http';
import { allowUnreviewedContent } from '../lib/content-access';
import { searchEngine, SearchEngine, normalizeEs } from '../../shared/search-engine';
import type { CompactGrammarItem, CompactLessonItem, SearchResponse } from '../../shared/search-engine';

/** مفاتيح الإجابة التي لا تغادر الخادم أبدًا — تُحذف من حزمة القراءة العامة. */
const ANSWER_KEY_FIELDS = new Set(['answerKey', 'correctOptionIds', 'accepted', 'isCorrect', 'correctAnswer', 'explanationAr']);

function stripAnswerKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripAnswerKeys);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (ANSWER_KEY_FIELDS.has(k)) continue;
      out[k] = stripAnswerKeys(v);
    }
    return out;
  }
  return value;
}

/**
 * حزمة درس للقراءة. القاعدة: المنشور فقط يُقدَّم للعامة.
 * المستخدم ذو صلاحية content.read يمكنه معاينة إصدار غير منشور بـ ?preview=1.
 * المحتوى يُقدَّم بعد حذف مفاتيح الإجابة — نشر درس لا يكشف إجاباته للعامة.
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
        content: stripAnswerKeys(JSON.parse(row.content_json)),
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

/**
 * البحث الذكي: المفردات والتصريفات من الفهرس الثابت المضمّن في الحزمة
 * (بلا بيانات دروس عمدًا)، والدروس والقواعد من قاعدة البيانات وفق قاعدة
 * الرؤية نفسها المطبقة في كل مكان: المنشور فقط، والمسودات فقط عندما يسمح
 * allowUnreviewedContent (تطوير صريح، لا إنتاج). ملفات المحتوى المصدرية
 * لا تحمل حالة نشر، فالفهرس الثابت لا يجوز أن يحمل الدروس أبدًا — وإلا
 * تسرّبت عناوين المسودات وأهدافها وتراكيبها لأي زائر عبر حزمة الواجهة
 * أو عبر هذا المسار نفسه. يعمل محليًا وخفيفًا دون أي تكلفة خارجية.
 */
export async function searchContent(req: Request, env: Env, requestId: string): Promise<Response> {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? '';
  const level = url.searchParams.get('level') ?? undefined;
  const kind = (url.searchParams.get('kind') as 'all' | 'vocab' | 'grammar' | 'lesson') ?? undefined;
  const limitParam = parseInt(url.searchParams.get('limit') ?? '20', 10);
  const limit = Math.min(50, Math.max(1, isNaN(limitParam) ? 20 : limitParam));

  const includeDrafts = allowUnreviewedContent(env);
  const wantsLessons = kind === undefined || kind === 'all' || kind === 'lesson' || kind === 'grammar';

  // المفردات والتصريفات: من الفهرس الثابت (لا دروس فيه).
  const vocabRes = searchEngine.search(q, { level, kind, limit });

  // الدروس والقواعد: من قاعدة البيانات فقط، بعد فلترة الرؤية.
  let lessonRes: SearchResponse | null = null;
  if (wantsLessons) {
    const statusFilter = includeDrafts
      ? "l.status IN ('published','draft') AND lv.status IN ('published','draft')"
      : "l.status = 'published' AND lv.status = 'published'";
    const rows = await env.DB.prepare(
      `SELECT l.slug, l.title_ar, l.level_code, l.objective_ar, lv.content_json
       FROM lessons l JOIN lesson_versions lv ON lv.id = l.current_version_id
       WHERE ${statusFilter}`,
    ).all<{ slug: string; title_ar: string; level_code: string; objective_ar: string; content_json: string }>();

    const lessons: CompactLessonItem[] = [];
    const grammar: CompactGrammarItem[] = [];
    const seenTopics = new Set<string>();
    for (const row of rows.results) {
      // content_json يحمل مفاتيح الإجابة — نستخرج منه التراكيب ومواضيع
      // القواعد فقط، ولا يغادر الخادم أبدًا.
      let structures: string[] = [];
      let topics: string[] = [];
      try {
        const content = JSON.parse(row.content_json) as { targetStructures?: unknown; grammarTopics?: unknown };
        if (Array.isArray(content.targetStructures)) {
          structures = content.targetStructures.filter((s): s is string => typeof s === 'string');
        }
        if (Array.isArray(content.grammarTopics)) {
          topics = content.grammarTopics.filter((s): s is string => typeof s === 'string');
        }
      } catch {
        // محتوى تالف: الدرس يُبحث بعنوانه وهدفه فقط.
      }
      lessons.push({
        s: row.slug, t: row.title_ar, l: row.level_code, u: null,
        o: row.objective_ar || undefined, g: topics, st: structures,
      });
      for (const topic of topics) {
        const key = normalizeEs(topic);
        if (!seenTopics.has(key)) {
          seenTopics.add(key);
          grammar.push({ t: topic, l: row.level_code, s: row.slug, a: row.title_ar });
        }
      }
    }
    const lessonEngine = new SearchEngine({
      version: '1.0.0', generatedAt: '', vocab: [], forms: {}, lessons, grammar,
    });
    lessonRes = lessonEngine.search(q, { level, kind, limit });
  }

  // دمج النتيجتين وترتيبهما بالدرجة: كل نتيجة ضمن أفضل `limit` لنوعها،
  // فأفضل `limit` إجمالًا مجموعة جزئية منهما — لا يُسقَط الأعلى درجة.
  const results = [...vocabRes.results, ...(lessonRes?.results ?? [])]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  const result: SearchResponse = {
    query: vocabRes.query,
    total: vocabRes.total + (lessonRes?.total ?? 0),
    results,
    suggestion: vocabRes.suggestion ?? lessonRes?.suggestion ?? null,
    executionMs: vocabRes.executionMs + (lessonRes?.executionMs ?? 0),
    ...(includeDrafts ? { contentProvenance: 'unreviewed_sample' } : {}),
  };

  return json(
    result,
    {
      headers: {
        'Cache-Control': includeDrafts ? 'no-store' : 'public, max-age=120, stale-while-revalidate=600',
      },
    },
    requestId,
  );
}
