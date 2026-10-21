-- =============================================================================
-- 0004 — نظام المراجعة المتباعدة (SRS) + روابط المفردات بالدروس والحزم
-- -----------------------------------------------------------------------------
-- قرارات موثّقة (docs/AUTONOMOUS_EXECUTION_STATUS.md › D-01…D-04):
--   * جدول البطاقات هو `review_schedule` الموجود في 0001 (فارغ وغير مستخدم قبل
--     هذا الترحيل) — نُوسّعه بدل تعريف جدول موازٍ لنفس المفهوم.
--   * سجل المراجعات في `srs_reviews` مع قيد فريد (user_id, client_event_id)
--     ⇒ منع تكرار المراجعة بنفس نمط منع تكرار XP في المرحلة 2.
--   * لا تغيير هدّام: كل الإضافات أعمدة بقيم افتراضية أو جداول جديدة.
-- =============================================================================

-- ---------- 1) توسيع بطاقات المراجعة ----------
-- kind: recognition (كلمة ← معنى) | production (معنى ← كلمة) | listening (صوت ← كلمة)
-- listening لا تُولَّد قبل توفّر ملفات صوتية معتمدة.
ALTER TABLE review_schedule ADD COLUMN card_kind TEXT NOT NULL DEFAULT 'recognition';
-- state: new | learning | review | relearning | suspended
ALTER TABLE review_schedule ADD COLUMN state TEXT NOT NULL DEFAULT 'new';
ALTER TABLE review_schedule ADD COLUMN scheduler_version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE review_schedule ADD COLUMN created_at TEXT;
-- معرّف المصدر الذي وُلدت منه البطاقة (درس أو حزمة) — للتدقيق لا للعرض
ALTER TABLE review_schedule ADD COLUMN origin_ref TEXT;

CREATE INDEX IF NOT EXISTS idx_review_due_state ON review_schedule(user_id, state, due_at);
CREATE INDEX IF NOT EXISTS idx_review_item ON review_schedule(user_id, item_type, item_id);

-- ---------- 2) سجل المراجعات (أثر كامل + منع التكرار) ----------
CREATE TABLE IF NOT EXISTS srs_reviews (
  id                  TEXT PRIMARY KEY,
  client_event_id     TEXT NOT NULL,
  user_id             TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type           TEXT NOT NULL,
  item_id             TEXT NOT NULL,
  card_kind           TEXT NOT NULL DEFAULT 'recognition',
  rating              INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 4),
  prev_state          TEXT,
  prev_interval_days  INTEGER,
  prev_ease           REAL,
  prev_due_at         TEXT,
  next_state          TEXT NOT NULL,
  next_interval_days  INTEGER NOT NULL,
  next_ease           REAL NOT NULL,
  next_due_at         TEXT NOT NULL,
  response_ms         INTEGER,
  scheduler_version   INTEGER NOT NULL DEFAULT 1,
  reviewed_at         TEXT NOT NULL,
  UNIQUE (user_id, client_event_id)
);
CREATE INDEX IF NOT EXISTS idx_srs_reviews_user_time ON srs_reviews(user_id, reviewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_srs_reviews_card ON srs_reviews(user_id, item_type, item_id);

-- ---------- 3) ربط الدروس بمفرداتها (لتوليد البطاقات بعد إتمام الدرس) ----------
CREATE TABLE IF NOT EXISTS lesson_vocabulary (
  lesson_id  TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  entry_id   TEXT NOT NULL REFERENCES vocabulary_entries(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'new' CHECK (role IN ('new','review')),
  PRIMARY KEY (lesson_id, entry_id)
);
CREATE INDEX IF NOT EXISTS idx_lesson_vocab_entry ON lesson_vocabulary(entry_id);

-- ---------- 4) حزم المفردات (مسار المفردات الأساسية) ----------
CREATE TABLE IF NOT EXISTS vocabulary_bundles (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  title_ar    TEXT NOT NULL,
  level_code  TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  source_id   TEXT REFERENCES content_sources(id) ON DELETE SET NULL,
  notes_ar    TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS vocabulary_bundle_entries (
  bundle_id  TEXT NOT NULL REFERENCES vocabulary_bundles(id) ON DELETE CASCADE,
  entry_id   TEXT NOT NULL REFERENCES vocabulary_entries(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bundle_id, entry_id)
);
CREATE INDEX IF NOT EXISTS idx_bundle_entries ON vocabulary_bundle_entries(bundle_id, sort_order);
