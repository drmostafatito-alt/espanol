-- =====================================================================
-- Español بالعربي — 0001_init.sql
-- المخطط الأساسي لـ Cloudflare D1 (SQLite 3)
-- القيود المرجعية: docs/03_DATABASE_SCHEMA.md
-- ملاحظات:
--   * كل المعرّفات TEXT (ULID) لا أعداد صفوف.
--   * المحتوى المنشور يُؤرشف لا يُحذف.
--   * XP لا يُكتب إلا عبر xp_ledger بمفتاح idempotency فريد.
--   * D1 يفرض المفاتيح الأجنبية افتراضيًا؛ كل CASCADE مقصود.
-- =====================================================================

-- ---------------------------------------------------------------------
-- أ) الهوية والصلاحيات
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id          TEXT PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE CHECK (code IN ('learner','super_admin','admin','content_manager','language_reviewer','support_agent','analyst')),
  name_ar     TEXT NOT NULL,
  description_ar TEXT,
  is_system   INTEGER NOT NULL DEFAULT 1 CHECK (is_system IN (0,1)),
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id     TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission  TEXT NOT NULL CHECK (length(permission) <= 64),
  PRIMARY KEY (role_id, permission)
);

CREATE TABLE IF NOT EXISTS users (
  id                  TEXT PRIMARY KEY,
  email_normalized    TEXT NOT NULL UNIQUE,          -- lower(trim(email)) — منع التكرار
  email_display       TEXT NOT NULL,                 -- الصيغة كما كتبها المستخدم
  password_hash       TEXT NOT NULL,                 -- pbkdf2$iters$salt$hash
  role_id             TEXT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  status              TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','pending_deletion','deleted')),
  email_verified_at   TEXT,
  failed_login_count  INTEGER NOT NULL DEFAULT 0,
  locked_until        TEXT,
  last_login_at       TEXT,
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id             TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name        TEXT,
  avatar_key          TEXT,                          -- مفتاح أصل أو أيقونة مولدة محليًا
  explanation_style   TEXT NOT NULL DEFAULT 'fusha_eg' CHECK (explanation_style IN ('fusha','eg','fusha_eg')),
  audio_variant       TEXT NOT NULL DEFAULT 'es-ES' CHECK (audio_variant IN ('es-ES','es-419')),
  timezone            TEXT NOT NULL DEFAULT 'Africa/Cairo',
  daily_goal_minutes  INTEGER NOT NULL DEFAULT 10 CHECK (daily_goal_minutes BETWEEN 5 AND 120),
  learning_goal       TEXT CHECK (learning_goal IS NULL OR learning_goal IN ('general','travel','work','callcenter','exam','conversation')),
  onboarding_completed_at TEXT,
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key         TEXT NOT NULL CHECK (length(key) <= 64),
  value_json  TEXT NOT NULL,
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (user_id, key)
);

CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT PRIMARY KEY,                     -- sha256(token) بصيغة hex
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  expires_at   TEXT NOT NULL,
  last_seen_at TEXT,
  ip_hash      TEXT,                                 -- hash لا IP صريح
  user_agent   TEXT,
  revoked_at   TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_exp ON sessions(user_id, expires_at);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TEXT NOT NULL,
  used_at     TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_prt_user ON password_reset_tokens(user_id);

CREATE TABLE IF NOT EXISTS verification_tokens (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose    TEXT NOT NULL CHECK (purpose IN ('email_verify','email_change','admin_invite')),
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at    TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_vt_user_purpose ON verification_tokens(user_id, purpose);

CREATE TABLE IF NOT EXISTS rate_limits (
  bucket        TEXT NOT NULL CHECK (length(bucket) <= 120),
  window_start  INTEGER NOT NULL,                    -- unix seconds مقربة
  count         INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, window_start)
);

-- ---------------------------------------------------------------------
-- ب) المنهج والمحتوى
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS levels (
  code              TEXT PRIMARY KEY CHECK (code IN ('PREA1','A1','A2','B1','B2','C1')),
  title_ar          TEXT NOT NULL,
  description_ar    TEXT,
  sort_order        INTEGER NOT NULL UNIQUE,
  min_accuracy_pass INTEGER NOT NULL DEFAULT 80 CHECK (min_accuracy_pass BETWEEN 50 AND 100),
  is_active         INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1))
);

CREATE TABLE IF NOT EXISTS programs (
  id              TEXT PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  title_ar        TEXT NOT NULL,
  description_ar  TEXT,
  kind            TEXT NOT NULL DEFAULT 'path' CHECK (kind IN ('main','path')),
  level_code      TEXT REFERENCES levels(code) ON DELETE SET NULL,
  category        TEXT,                              -- vocabulary|listening|grammar|travel|callcenter...
  estimated_minutes INTEGER,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_programs_kind ON programs(kind, sort_order);

CREATE TABLE IF NOT EXISTS units (
  id            TEXT PRIMARY KEY,
  program_id    TEXT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  level_code    TEXT REFERENCES levels(code) ON DELETE SET NULL,
  slug          TEXT NOT NULL,
  title_ar      TEXT NOT NULL,
  objective_ar  TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  UNIQUE (program_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_units_program_sort ON units(program_id, sort_order);

CREATE TABLE IF NOT EXISTS lessons (
  id                 TEXT PRIMARY KEY,
  unit_id            TEXT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  slug               TEXT NOT NULL UNIQUE,
  title_ar           TEXT NOT NULL,
  level_code         TEXT REFERENCES levels(code) ON DELETE SET NULL,
  objective_ar       TEXT NOT NULL,
  estimated_minutes  INTEGER NOT NULL DEFAULT 8 CHECK (estimated_minutes BETWEEN 2 AND 90),
  skills_json        TEXT NOT NULL DEFAULT '[]',      -- ["reading","listening","speaking","writing","grammar"]
  status             TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  current_version_id TEXT,
  unlock_rule_json   TEXT NOT NULL DEFAULT '{"type":"sequential"}',
  mastery_criteria_json TEXT NOT NULL DEFAULT '{"min_accuracy":80,"min_reviews_passed":1}',
  offline_priority   INTEGER NOT NULL DEFAULT 0 CHECK (offline_priority BETWEEN 0 AND 2),
  sort_order         INTEGER NOT NULL DEFAULT 0,
  created_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (unit_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_lessons_unit_sort ON lessons(unit_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_lessons_status ON lessons(status);

CREATE TABLE IF NOT EXISTS lesson_versions (
  id             TEXT PRIMARY KEY,
  lesson_id      TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  version_no     INTEGER NOT NULL,
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  content_json   TEXT NOT NULL,                      -- لقطة كاملة (≤2MB) تُتحقق بمخطط JSON
  content_hash   TEXT NOT NULL,
  change_summary TEXT,
  review_state   TEXT NOT NULL DEFAULT 'unreviewed' CHECK (review_state IN ('unreviewed','spanish_reviewed','translation_reviewed','approved','rejected')),
  created_by     TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_by    TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  published_at   TEXT,
  UNIQUE (lesson_id, version_no)
);
CREATE INDEX IF NOT EXISTS idx_lv_lesson ON lesson_versions(lesson_id, version_no DESC);
CREATE INDEX IF NOT EXISTS idx_lv_status ON lesson_versions(status);

CREATE TABLE IF NOT EXISTS exercise_types (
  code            TEXT PRIMARY KEY,
  name_ar         TEXT NOT NULL,
  skills          TEXT NOT NULL,                     -- csv: listening,writing,...
  needs_audio     INTEGER NOT NULL DEFAULT 0 CHECK (needs_audio IN (0,1)),
  needs_image     INTEGER NOT NULL DEFAULT 0,
  is_auto_graded  INTEGER NOT NULL DEFAULT 1,        -- 0 = تقييم بمعيار/بشري
  sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS exercises (
  id                TEXT PRIMARY KEY,
  lesson_version_id TEXT NOT NULL REFERENCES lesson_versions(id) ON DELETE CASCADE,
  type              TEXT NOT NULL REFERENCES exercise_types(code) ON DELETE RESTRICT,
  prompt_json       TEXT NOT NULL,                   -- نص السؤال/المهمة
  answer_key_json   TEXT NOT NULL,                   -- إجابات مقبولة + قواعد التحقق
  explanation_ar    TEXT NOT NULL,                   -- تفسير إلزامي
  error_feedback_json TEXT NOT NULL DEFAULT '{}',    -- رسائل خطأ مفيدة لكل حالة
  difficulty        INTEGER NOT NULL DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
  skills_json       TEXT NOT NULL DEFAULT '[]',
  media_json        TEXT NOT NULL DEFAULT '{}',      -- مراجع audio/image keys
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_ex_lv_sort ON exercises(lesson_version_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_ex_type ON exercises(type);

CREATE TABLE IF NOT EXISTS exercise_options (
  id                     TEXT PRIMARY KEY,
  exercise_id            TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  item_id                TEXT,                       -- إن ارتبط الخيار بفراغ/عنصر
  text                   TEXT NOT NULL,
  is_correct             INTEGER NOT NULL DEFAULT 0 CHECK (is_correct IN (0,1)),
  distractor_rationale_ar TEXT,                      -- لماذا هذا المشتت مُصمَّم
  sort_order             INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_opt_ex ON exercise_options(exercise_id, sort_order);

CREATE TABLE IF NOT EXISTS exercise_items (
  id          TEXT PRIMARY KEY,
  exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  ordinal     INTEGER NOT NULL,
  item_type   TEXT NOT NULL CHECK (item_type IN ('blank','word_bank_token','segment','pair','slot')),
  payload_json TEXT NOT NULL DEFAULT '{}',
  UNIQUE (exercise_id, ordinal)
);

CREATE TABLE IF NOT EXISTS grammar_topics (
  id            TEXT PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  level_code    TEXT REFERENCES levels(code) ON DELETE SET NULL,
  title_ar      TEXT NOT NULL,
  explanation_md TEXT NOT NULL,
  eg_note_md    TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lesson_grammar (
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  topic_id  TEXT NOT NULL REFERENCES grammar_topics(id) ON DELETE CASCADE,
  is_primary INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (lesson_id, topic_id)
);

CREATE TABLE IF NOT EXISTS content_sources (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  url         TEXT,
  publisher   TEXT,
  license     TEXT,
  accessed_at TEXT,
  notes       TEXT
);

CREATE TABLE IF NOT EXISTS vocabulary_entries (
  id                  TEXT PRIMARY KEY,
  headword_es         TEXT NOT NULL,                 -- كما تُكتب
  headword_normalized TEXT NOT NULL UNIQUE,          -- lower + trim + توحيد المسافات → منع التكرار
  entry_kind          TEXT NOT NULL DEFAULT 'word' CHECK (entry_kind IN ('word','expression','collocation','idiom')),
  pos                 TEXT CHECK (pos IN ('noun','verb','adj','adv','pron','prep','conj','det','interj','num','phrase')),
  gender              TEXT CHECK (gender IN ('m','f','mf',NULL)),
  plural_es           TEXT,
  level_code          TEXT REFERENCES levels(code) ON DELETE SET NULL,
  frequency_rank      INTEGER,
  frequency_source_id TEXT REFERENCES content_sources(id) ON DELETE SET NULL,
  ipa                 TEXT,
  pronunciation_hint_ar TEXT,
  register            TEXT CHECK (register IN ('neutral','informal','formal','colloquial_spain','colloquial_latam','vulgar')),
  status              TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  notes_ar            TEXT,
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_vocab_level ON vocabulary_entries(level_code);
CREATE INDEX IF NOT EXISTS idx_vocab_freq ON vocabulary_entries(frequency_rank);
CREATE INDEX IF NOT EXISTS idx_vocab_status ON vocabulary_entries(status);
CREATE INDEX IF NOT EXISTS idx_vocab_pos ON vocabulary_entries(pos);

CREATE TABLE IF NOT EXISTS vocabulary_senses (
  id                TEXT PRIMARY KEY,
  entry_id          TEXT NOT NULL REFERENCES vocabulary_entries(id) ON DELETE CASCADE,
  sense_no          INTEGER NOT NULL DEFAULT 1,
  meaning_ar_fusha  TEXT NOT NULL,
  meaning_ar_eg     TEXT,
  gloss_es          TEXT,                            -- شرح أحادي بالإسبانية
  register          TEXT CHECK (register IN ('neutral','informal','formal','colloquial_spain','colloquial_latam')),
  domain            TEXT,
  example_sentence_id TEXT REFERENCES sentences(id) ON DELETE SET NULL,
  usage_note_ar     TEXT,
  common_error_ar   TEXT,
  UNIQUE (entry_id, sense_no)
);
CREATE INDEX IF NOT EXISTS idx_sense_entry ON vocabulary_senses(entry_id);

CREATE TABLE IF NOT EXISTS vocabulary_forms (
  id        TEXT PRIMARY KEY,
  entry_id  TEXT NOT NULL REFERENCES vocabulary_entries(id) ON DELETE CASCADE,
  form_kind TEXT NOT NULL CHECK (form_kind IN ('conjugation','plural','feminine','participle','gerund','diminutive')),
  form_es   TEXT NOT NULL,
  tense     TEXT,
  mood      TEXT,
  person    TEXT,
  is_irregular INTEGER NOT NULL DEFAULT 0,
  UNIQUE (entry_id, form_kind, form_es, tense, person)
);
CREATE INDEX IF NOT EXISTS idx_forms_entry ON vocabulary_forms(entry_id);

CREATE TABLE IF NOT EXISTS vocabulary_tags (
  id      TEXT PRIMARY KEY,
  slug    TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS vocabulary_tag_links (
  entry_id TEXT NOT NULL REFERENCES vocabulary_entries(id) ON DELETE CASCADE,
  tag_id   TEXT NOT NULL REFERENCES vocabulary_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, tag_id)
);

CREATE TABLE IF NOT EXISTS sentences (
  id             TEXT PRIMARY KEY,
  text_es        TEXT NOT NULL,
  level_code     TEXT REFERENCES levels(code) ON DELETE SET NULL,
  register       TEXT NOT NULL DEFAULT 'neutral' CHECK (register IN ('neutral','informal','formal','colloquial_spain','colloquial_latam')),
  audio_asset_id TEXT,                               -- FK مؤجل منطقيًا (media_assets)
  image_asset_id TEXT,
  source_id      TEXT REFERENCES content_sources(id) ON DELETE SET NULL,
  variant_note_ar TEXT,                              -- فروق إسبانيا/أمريكا اللاتينية
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_sent_level ON sentences(level_code);

CREATE TABLE IF NOT EXISTS sentence_translations (
  id          TEXT PRIMARY KEY,
  sentence_id TEXT NOT NULL REFERENCES sentences(id) ON DELETE CASCADE,
  locale      TEXT NOT NULL DEFAULT 'ar' CHECK (locale IN ('ar','en')),
  style       TEXT NOT NULL DEFAULT 'fusha' CHECK (style IN ('fusha','eg')),
  text        TEXT NOT NULL,
  is_primary  INTEGER NOT NULL DEFAULT 0,
  UNIQUE (sentence_id, locale, style)
);

CREATE TABLE IF NOT EXISTS content_reports (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('lesson','exercise','vocabulary','sentence','audio')),
  target_id   TEXT NOT NULL,
  reason_code TEXT NOT NULL CHECK (reason_code IN ('wrong_translation','wrong_answer','unnatural_spanish','audio_mismatch','ambiguous','other')),
  note        TEXT,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','triaged','fixed','rejected')),
  handled_by  TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  resolved_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_reports_status ON content_reports(status, created_at);

CREATE TABLE IF NOT EXISTS content_review_records (
  id          TEXT PRIMARY KEY,
  target_type TEXT NOT NULL CHECK (target_type IN ('lesson_version','vocabulary_entry','exercise','program')),
  target_id   TEXT NOT NULL,
  stage       TEXT NOT NULL CHECK (stage IN ('language_es','translation_ar','naturalness','level_fit','answer_key','media','automated','human_final','publish')),
  reviewer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  decision    TEXT NOT NULL CHECK (decision IN ('passed','failed','needs_changes','waived')),
  notes       TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_review_target ON content_review_records(target_type, target_id, created_at DESC);

-- ---------------------------------------------------------------------
-- ج) الوسائط (R2)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_assets (
  id         TEXT PRIMARY KEY,
  kind       TEXT NOT NULL CHECK (kind IN ('audio','image')),
  r2_key     TEXT NOT NULL UNIQUE,
  mime       TEXT NOT NULL,
  bytes      INTEGER NOT NULL CHECK (bytes > 0),
  width      INTEGER,
  height     INTEGER,
  checksum   TEXT NOT NULL,                          -- sha256
  license    TEXT NOT NULL DEFAULT 'original' CHECK (license IN ('original','cc0','cc_by','licensed','generated')),
  attribution TEXT,
  status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','missing','archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_media_status ON media_assets(kind, status);

CREATE TABLE IF NOT EXISTS audio_assets (
  id             TEXT PRIMARY KEY,
  media_asset_id TEXT NOT NULL UNIQUE REFERENCES media_assets(id) ON DELETE CASCADE,
  text_es        TEXT NOT NULL,
  text_hash      TEXT NOT NULL,                      -- sha256(text+voice+variant+speed)
  voice_id       TEXT NOT NULL,
  variant        TEXT NOT NULL DEFAULT 'es-ES' CHECK (variant IN ('es-ES','es-419')),
  speed          REAL NOT NULL DEFAULT 1.0 CHECK (speed BETWEEN 0.5 AND 1.5),
  duration_ms    INTEGER,
  reviewed_by    TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at    TEXT
);
CREATE INDEX IF NOT EXISTS idx_audio_texthash ON audio_assets(text_hash);

CREATE TABLE IF NOT EXISTS image_assets (
  id             TEXT PRIMARY KEY,
  media_asset_id TEXT NOT NULL UNIQUE REFERENCES media_assets(id) ON DELETE CASCADE,
  alt_ar         TEXT NOT NULL,
  tags           TEXT,
  author         TEXT
);

-- ---------------------------------------------------------------------
-- د) التقدم والتحفيز
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id         TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  lesson_version_id TEXT,
  status            TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','mastered')),
  best_accuracy     INTEGER NOT NULL DEFAULT 0 CHECK (best_accuracy BETWEEN 0 AND 100),
  attempts_count    INTEGER NOT NULL DEFAULT 0,
  first_started_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  completed_at      TEXT,
  last_activity_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_ulp_user_status ON user_lesson_progress(user_id, status);

CREATE TABLE IF NOT EXISTS user_exercise_attempts (
  id                TEXT PRIMARY KEY,
  client_event_id   TEXT NOT NULL UNIQUE,            -- idempotency
  user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id         TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  lesson_version_id TEXT NOT NULL,
  exercise_id       TEXT NOT NULL,
  is_correct        INTEGER NOT NULL CHECK (is_correct IN (0,1)),
  score             INTEGER NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  answer_json       TEXT NOT NULL,
  duration_ms       INTEGER,
  source            TEXT NOT NULL DEFAULT 'online' CHECK (source IN ('online','offline_sync')),
  created_at        TEXT NOT NULL,                   -- وقت الخادم
  occurred_at       TEXT,                            -- وقت الجهاز (معلوماتي فقط)
  server_recorded_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_attempts_user_time ON user_exercise_attempts(user_id, server_recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_user_ex ON user_exercise_attempts(user_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_attempts_lesson ON user_exercise_attempts(lesson_id);

CREATE TABLE IF NOT EXISTS user_vocabulary_progress (
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_id       TEXT NOT NULL REFERENCES vocabulary_entries(id) ON DELETE CASCADE,
  state          TEXT NOT NULL DEFAULT 'seen' CHECK (state IN ('seen','learning','familiar','stable')),
  exposures      INTEGER NOT NULL DEFAULT 0,
  correct_count  INTEGER NOT NULL DEFAULT 0,
  wrong_count    INTEGER NOT NULL DEFAULT 0,
  first_seen_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_seen_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (user_id, entry_id)
);
CREATE INDEX IF NOT EXISTS idx_uvp_state ON user_vocabulary_progress(user_id, state);

CREATE TABLE IF NOT EXISTS review_schedule (
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type        TEXT NOT NULL CHECK (item_type IN ('vocab','structure','error','listening')),
  item_id          TEXT NOT NULL,
  ease             REAL NOT NULL DEFAULT 2.5 CHECK (ease BETWEEN 1.3 AND 3.0),
  interval_days    INTEGER NOT NULL DEFAULT 0,
  repetitions      INTEGER NOT NULL DEFAULT 0,
  lapses           INTEGER NOT NULL DEFAULT 0,
  due_at           TEXT NOT NULL,
  last_reviewed_at TEXT,
  last_quality     INTEGER,
  suspended        INTEGER NOT NULL DEFAULT 0 CHECK (suspended IN (0,1)),
  PRIMARY KEY (user_id, item_type, item_id)
);
CREATE INDEX IF NOT EXISTS idx_review_due ON review_schedule(user_id, due_at);

CREATE TABLE IF NOT EXISTS learning_events (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,                     -- lesson_started|lesson_completed|review_done|...
  payload_json    TEXT NOT NULL DEFAULT '{}',
  content_version_id TEXT,
  idempotency_key TEXT NOT NULL UNIQUE,
  occurred_at     TEXT,
  recorded_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_events_user_time ON learning_events(user_id, recorded_at DESC);

CREATE TABLE IF NOT EXISTS user_path_progress (
  user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id        TEXT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  current_unit_id   TEXT,
  last_lesson_id    TEXT,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  xp_in_path        INTEGER NOT NULL DEFAULT 0,
  accuracy_avg      INTEGER,
  updated_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (user_id, program_id)
);

CREATE TABLE IF NOT EXISTS user_stats (
  user_id           TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  xp_total          INTEGER NOT NULL DEFAULT 0,
  minutes_total     INTEGER NOT NULL DEFAULT 0,
  streak_current    INTEGER NOT NULL DEFAULT 0,
  streak_longest    INTEGER NOT NULL DEFAULT 0,
  last_study_date   TEXT,                            -- YYYY-MM-DD في منطقة المستخدم
  reviews_done      INTEGER NOT NULL DEFAULT 0,
  words_seen        INTEGER NOT NULL DEFAULT 0,
  words_stable      INTEGER NOT NULL DEFAULT 0,
  updated_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS xp_ledger (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount          INTEGER NOT NULL CHECK (amount BETWEEN -1000 AND 1000),
  reason          TEXT NOT NULL CHECK (reason IN ('lesson_complete','review_session','daily_goal','achievement','correction')),
  ref_type        TEXT,
  ref_id          TEXT,
  idempotency_key TEXT NOT NULL UNIQUE,              -- يمنع منح XP مرتين لنفس الحدث
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_xp_user_time ON xp_ledger(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS achievements (
  id           TEXT PRIMARY KEY,
  code         TEXT NOT NULL UNIQUE,
  title_ar     TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  criteria_json TEXT NOT NULL,
  xp_reward    INTEGER NOT NULL DEFAULT 0,
  is_active    INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1))
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS daily_goals (
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_local      TEXT NOT NULL,                     -- YYYY-MM-DD
  target_xp       INTEGER NOT NULL DEFAULT 20,
  target_minutes  INTEGER NOT NULL DEFAULT 10,
  completed_xp    INTEGER NOT NULL DEFAULT 0,
  completed_minutes INTEGER NOT NULL DEFAULT 0,
  met_at          TEXT,
  PRIMARY KEY (user_id, date_local)
);

CREATE TABLE IF NOT EXISTS daily_activity (
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_local       TEXT NOT NULL,
  minutes          INTEGER NOT NULL DEFAULT 0,
  xp_earned        INTEGER NOT NULL DEFAULT 0,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  reviews_done     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, date_local)
);

CREATE TABLE IF NOT EXISTS assessment_results (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind        TEXT NOT NULL CHECK (kind IN ('placement','unit_test','level_test','callcenter_sim')),
  program_id  TEXT REFERENCES programs(id) ON DELETE SET NULL,
  unit_id     TEXT REFERENCES units(id) ON DELETE SET NULL,
  score       INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed      INTEGER NOT NULL DEFAULT 0 CHECK (passed IN (0,1)),
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_assess_user ON assessment_results(user_id, created_at DESC);

-- ---------------------------------------------------------------------
-- هـ) الإشعارات، المزامنة، الإدارة
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint    TEXT NOT NULL UNIQUE,
  p256dh      TEXT NOT NULL,
  auth        TEXT NOT NULL,
  user_agent  TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_used_at TEXT,
  revoked_at  TEXT
);
CREATE INDEX IF NOT EXISTS idx_push_user ON push_subscriptions(user_id);

CREATE TABLE IF NOT EXISTS notifications (
  id           TEXT PRIMARY KEY,
  title_ar     TEXT NOT NULL,
  body_ar      TEXT NOT NULL,
  url          TEXT,
  audience_json TEXT NOT NULL DEFAULT '{"type":"all"}',
  scheduled_at TEXT,
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','sending','sent','cancelled')),
  created_by   TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  sent_at      TEXT
);
CREATE INDEX IF NOT EXISTS idx_notif_sched ON notifications(status, scheduled_at);

CREATE TABLE IF NOT EXISTS notification_deliveries (
  id              TEXT PRIMARY KEY,
  notification_id TEXT NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel         TEXT NOT NULL CHECK (channel IN ('in_app','push')),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed','read','skipped')),
  error_code      TEXT,
  sent_at         TEXT,
  UNIQUE (notification_id, user_id, channel)
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id          TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  push_enabled     INTEGER NOT NULL DEFAULT 0 CHECK (push_enabled IN (0,1)),
  review_reminder  INTEGER NOT NULL DEFAULT 1 CHECK (review_reminder IN (0,1)),
  streak_reminder  INTEGER NOT NULL DEFAULT 1 CHECK (streak_reminder IN (0,1)),
  product_updates  INTEGER NOT NULL DEFAULT 0 CHECK (product_updates IN (0,1)),
  reminder_hour    INTEGER NOT NULL DEFAULT 20 CHECK (reminder_hour BETWEEN 0 AND 23),
  quiet_start_hour INTEGER CHECK (quiet_start_hour IS NULL OR quiet_start_hour BETWEEN 0 AND 23),
  quiet_end_hour   INTEGER CHECK (quiet_end_hour IS NULL OR quiet_end_hour BETWEEN 0 AND 23)
);

CREATE TABLE IF NOT EXISTS offline_sync_receipts (
  idempotency_key TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL,
  payload_hash    TEXT NOT NULL,
  result_json     TEXT NOT NULL DEFAULT '{}',
  received_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  applied         INTEGER NOT NULL DEFAULT 1 CHECK (applied IN (0,1))
);

CREATE TABLE IF NOT EXISTS admin_settings (
  key         TEXT PRIMARY KEY CHECK (length(key) <= 80),
  value_json  TEXT NOT NULL,
  is_public   INTEGER NOT NULL DEFAULT 0 CHECK (is_public IN (0,1)),  -- ما يُكاش ويُقدَّم للجميع
  updated_by  TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id            TEXT PRIMARY KEY,
  actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action        TEXT NOT NULL,
  target_type   TEXT,
  target_id     TEXT,
  before_json   TEXT,
  after_json    TEXT,
  request_id    TEXT,
  ip_hash       TEXT,
  result        TEXT NOT NULL DEFAULT 'success' CHECK (result IN ('success','denied','error')),
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_actor_time ON admin_audit_logs(actor_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action_time ON admin_audit_logs(action, created_at DESC);

CREATE TABLE IF NOT EXISTS ads_configuration (
  slot_code   TEXT PRIMARY KEY CHECK (slot_code IN ('home_footer','path_end','dictionary_side','result_below','legal_page')),
  is_enabled  INTEGER NOT NULL DEFAULT 0 CHECK (is_enabled IN (0,1)),
  provider    TEXT CHECK (provider IS NULL OR provider IN ('none','adsense','custom_placeholder')),
  settings_json TEXT NOT NULL DEFAULT '{}',           -- لا يُسمح بحقن <script> اعتباطي
  notes_ar    TEXT,
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS legal_document_versions (
  id          TEXT PRIMARY KEY,
  doc_type    TEXT NOT NULL CHECK (doc_type IN ('privacy','terms','cookies','ads','refund')),
  locale      TEXT NOT NULL DEFAULT 'ar',
  version     TEXT NOT NULL,
  body_md     TEXT NOT NULL,
  effective_at TEXT NOT NULL,
  published_at TEXT,
  UNIQUE (doc_type, locale, version)
);

CREATE TABLE IF NOT EXISTS config_history (
  id         TEXT PRIMARY KEY,
  key        TEXT NOT NULL,
  old_value_json TEXT,
  new_value_json TEXT,
  changed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_confighist_key ON config_history(key, created_at DESC);
