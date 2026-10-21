# تصميم قاعدة البيانات (D1 / SQLite)

الـ DDL القابل للتنفيذ: [`db/migrations/0001_init.sql`](../db/migrations/0001_init.sql) · البذور: [`0002_seed_reference.sql`](../db/migrations/0002_seed_reference.sql)

## 1. مبادئ التصميم

1. **المعرّفات نصية (TEXT, ULID/uuid)** لا أعداد صفوف → آمنة عند إعادة الترتيب وتصدير المحتوى وإعادة الاستيراد.
2. **المحتوى مُصدَّر (versioned)**: كل درس منشور له `lesson_versions` كامل، وأي تعديل ينشئ إصدارًا جديدًا. النتائج القديمة تشير إلى `lesson_version_id` المستخدم.
3. **التطبيع**: المعنى/التصريف/العبارة الاصطلاحية كيانات منفصلة، لا حقول نصية مدمجة. لا JSON متكرر ضخم في المحاولات.
4. **الخادم مصدر الحقيقة**: كل XP يمر عبر `xp_ledger` بمفتاح idempotency فريد.
5. **حدود D1**: لا صف > 2 MB (لا JSON ضخم)، ≤ 100,000 كتابة/يوم، ≤ 50 استعلام/استدعاء → تصميم يقلل الكتابات و`batch()`.
6. **حذف آمن**: المحتوى المنشور يُؤرشف لا يُحذف؛ حذف المستخدم يحذف بياناته الشخصية بالتتابع.

## 2. خريطة الكيانات

```
roles ─┬─< role_permissions
       └─< users ─┬─< sessions
                  ├─1 user_profiles / user_settings / notification_preferences / user_stats
                  ├─< user_lesson_progress >─ lessons
                  ├─< user_exercise_attempts >─ exercises
                  ├─< user_vocabulary_progress >─ vocabulary_entries
                  ├─< review_schedule (item_type,item_id)          ← عام (مفردات/تراكيب/أخطاء)
                  ├─< xp_ledger            ← كل XP
                  ├─< daily_activity / daily_goals
                  ├─< user_achievements >─ achievements
                  ├─< user_path_progress >─ programs
                  ├─< assessment_results
                  ├─< push_subscriptions / notification_deliveries
                  └─< learning_events / offline_sync_receipts

levels ─< programs ─< units ─< lessons ─< lesson_versions ─< exercises ─┬─< exercise_options
                                                                        └─< exercise_items
lessons ─< lesson_vocabulary >─ vocabulary_entries ─< vocabulary_senses / _forms / _tags / _tag_links
sentences ─< sentence_translations
media_assets ─1:1─ audio_assets | image_assets
grammar_topics ─< lesson_grammar >─ lessons
content_sources ─< vocabulary_entries / sentences / content_review_records
```

## 3. الجداول (45) — الغرض والمفاتيح

### أ) الهوية والصلاحيات
| الجدول | الغرض | مفتاح/قيود | فهارس |
| --- | --- | --- | --- |
| `roles` | 7 أدوار (learner + 6 إداريين) | `code` UNIQUE | — |
| `role_permissions` | صلاحيات دقيقة | PK(role_id, permission) | — |
| `users` | الحساب | `email_normalized` UNIQUE · `status IN(active,suspended,deleted)` | `(status)`, `(created_at)` |
| `user_profiles` | بيانات العرض/التفضيلات | PK=user_id, CASCADE | — |
| `user_settings` | إعدادات مرنة key/value | PK(user_id,key) | — |
| `sessions` | جلسات معتمة (تخزين hash) | PK=id(hash) | `(user_id, expires_at)` |
| `password_reset_tokens` | استعادة كلمة المرور | `token_hash` UNIQUE | `(user_id)` |
| `verification_tokens` | تحقق البريد/الغرض | `token_hash` UNIQUE | `(user_id, purpose)` |
| `rate_limits` | حدود المعدل | PK(bucket, window_start) | — |

### ب) المنهج والمحتوى
| الجدول | الغرض | ملاحظات القيود |
| --- | --- | --- |
| `levels` | PREA1,A1,A2,B1,B2,C1 | `code` PK، `sort_order` UNIQUE |
| `programs` | المسار الأساسي أو مسار مستقل | `kind IN('main','path')` · `slug` UNIQUE |
| `units` | وحدات داخل برنامج | UNIQUE(program_id, slug) |
| `lessons` | درس (مؤشر للإصدار الحالي) | UNIQUE(unit_id, slug) · `status` |
| `lesson_versions` | لقطة كاملة للدرس | UNIQUE(lesson_id, version_no) · `content_json` (≤2MB) |
| `exercises` | تمرين داخل إصدار درس | `type` من `exercise_types` · `answer_key_json` |
| `exercise_options` | خيارات/مشتتات | `is_correct`, `distractor_rationale_ar` |
| `exercise_items` | عناصر داخل التمرين (فراغات/مقاطع) | UNIQUE(exercise_id, ordinal) |
| `exercise_types` | سجل الأنواع الـ28 (للعرض والتحقق) | `code` PK |
| `grammar_topics` | شرح قاعدة | `slug` UNIQUE |
| `lesson_grammar` | ربط درس↔قاعدة | PK(lesson_id, topic_id) |
| `lesson_vocabulary` | مفردات الدرس (جديد/مراجعة) | PK(lesson_id, entry_id) · `is_new` |
| `sentences` | جمل سياقية | `text_es` · `level_code` · `audio_asset_id` |
| `sentence_translations` | ترجمة عربية بأسلوبين | UNIQUE(sentence_id, locale, style) |
| `vocabulary_entries` | المدخل المعجمي (الكلمة نفسها) | `headword_normalized` UNIQUE ← منع التكرار |
| `vocabulary_senses` | معنى مستقل | UNIQUE(entry_id, sense_no) |
| `vocabulary_forms` | تصريف/جمع/مؤنث | UNIQUE(entry_id, form_kind, form_es, tense, person) |
| `vocabulary_tags` + `vocabulary_tag_links` | موضوعات | PK(target) |
| `content_sources` | مصدر البيانات/الترخيص | — |
| `content_reports` | بلاغات المستخدمين | `status` |
| `content_review_records` | سجل مراحل المراجعة العشر | — |

### ج) الوسائط
| الجدول | الغرض |
| --- | --- |
| `media_assets` | الأصل في R2 (`r2_key` UNIQUE, `bytes`, `checksum`, `license`, `status`) |
| `audio_assets` | 1:1 مع media: `text_es`, `text_hash`, `voice_id`, `variant(es-ES/es-419)`, `duration_ms` |
| `image_assets` | 1:1 مع media: `alt_ar`, `tags`, `author` |

> **سبب الفصل:** `media_assets` يوحّد التخزين/الترخيص/الفحص، والجدولان المتخصصان يحملان حقولًا تعليمية مختلفة (نص الصوت/البديل النصي للصورة).

### د) التقدم والتحفيز
| الجدول | الغرض | قيود حماية |
| --- | --- | --- |
| `user_lesson_progress` | حالة كل درس | PK(user_id, lesson_id) · `lesson_version_id` المسجّل |
| `user_exercise_attempts` | محاولة لكل سؤال | `client_event_id` UNIQUE ← idempotency |
| `user_vocabulary_progress` | حالة الكلمة (seen/learning/familiar/stable) | PK(user_id, entry_id) |
| `review_schedule` | جدولة SM-2 | PK(user_id, item_type, item_id) |
| `learning_events` | سجل أحداث موحّد | `idempotency_key` UNIQUE |
| `user_path_progress` | تقدم لكل مسار مستقل | PK(user_id, program_id) |
| `user_stats` | مجاميع سريعة (XP/سلسلة/دقائق) | PK=user_id |
| `xp_ledger` | كل منح XP | `idempotency_key` UNIQUE ← منع التكرار والتلاعب |
| `achievements` / `user_achievements` | إنجازات | PK(user_id, achievement_id) |
| `daily_goals` / `daily_activity` | هدف اليوم ونشاط يومي | PK(user_id, date_local) |
| `assessment_results` | نتائج تحديد المستوى/اختبارات الوحدات | `kind`, `passed` |

### هـ) الإشعارات والإدارة
| الجدول | الغرض |
| --- | --- |
| `push_subscriptions` | اشتراك Web Push (`endpoint` UNIQUE) |
| `notifications` / `notification_deliveries` | حملات وحالة كل تسليم (UNIQUE(notification_id,user_id,channel)) |
| `notification_preferences` | تفضيلات ومواعيد هادئة ومنطقة زمنية |
| `offline_sync_receipts` | إيصالات مزامنة (مفتاح idempotency PK) |
| `admin_settings` | إعدادات المنصة (JSON، مفتاح/قيمة) |
| `admin_audit_logs` | سجل تدقيق لكل عملية حساسة |
| `ads_configuration` | مواضع إعلان مقيدة (لا JS اعتباطي) |
| `legal_document_versions` | نسخ السياسات (خصوصية/شروط/كوكيز/إعلانات) |
| `config_history` | تاريخ تغييرات الإعدادات المهمة |

## 4. قرارات دمج/استبعاد موثقة

| مقترح الموجز | القرار | السبب |
| --- | --- | --- |
| `path_units` منفصل | **دُمج** في `units` + `programs.kind='path'` | المسار المستقل يحتاج نفس الهيكل تمامًا؛ جدول منفصل يكرر المنطق |
| `migration_history` | **لم يُنشأ** | `d1_migrations` (التي يديرها wrangler) هي مصدر الحقيقة؛ تكرارها يسبب تضاربًا |
| `verification_tokens` | أُنشئ بغرض `purpose` | يخدم تحقق البريد وأي تحقق مستقبلي بجدول واحد |
| `roles` أو آلية مكافئة | جدولان `roles`+`role_permissions` | صلاحيات دقيقة مطلوبة (7 أدوار: learner + 6 إدارية) |
| `user_settings` | key/value | يمنع migration لكل تفضيل جديد |
| `notification_preferences` | جدول مستقل | استعلامات الإرسال تحتاجه بكثافة |

## 5. الفهارس الحاكمة (منع N+1 وحدود D1)

| الاستعلام | الفهرس |
| --- | --- |
| محاولات مستخدم مرتبة زمنيًا | `idx_attempts_user_time(user_id, created_at DESC)` |
| استحقاقات المراجعة | `idx_review_due(user_id, due_at)` |
| درس تالٍ في برنامج | `idx_lessons_unit_sort(unit_id, sort_order)` |
| بحث قاموس | `idx_vocab_norm(headword_normalized)` + FTS5 |
| جلسات منتهية | `idx_sessions_user_exp(user_id, expires_at)` |
| مهام إشعارات مستحقة | `idx_notif_sched(status, scheduled_at)` |
| تدقيق إداري | `idx_audit_actor_time(actor_user_id, created_at DESC)` |

## 6. الثبات والمعاملات

- `batch()` للقراءات المتعددة، و`batch` ذري للكتابات المترابطة (محاولات + تقدم + XP + مراجعة).
- كل كتابة تقدم تحمل `client_event_id`/`idempotency_key`؛ التكرار يُسقط بصمت مع إرجاع نفس النتيجة.
- حالات تعارض المزامنة: الأحدث لا يفوز تلقائيًا؛ القاعدة: **المحاولة تُقبل مرة واحدة لكل eventId** ثم تُحتسب. `user_lesson_progress` يُحدَّث دائمًا بـ`best_accuracy = max(old, new)` لمنع التراجع الناتج عن إعادة إرسال قديمة.
- `review_schedule` لا يُحدَّث إلا من محاولة `created_at` أحدث من `last_reviewed_at` للعنصر (منع رجوع الجدولة).

## 7. الاستبقاء والحجم (تقدير لضبط 500 MB)

| البيانات | التقدير | ملاحظة |
| --- | --- | --- |
| 5,000 مدخل × (مدخل+3 معانٍ+أمثلة) | ≈ 12 MB | نصوص فقط |
| 30,000 جملة + ترجمتان | ≈ 20 MB | — |
| 20,000 تمرين + خيارات | ≈ 30 MB | إصدار واحد؛ الإصدارات القديمة تُؤرشف |
| 200 درس × إصدار | ≈ 15 MB | JSON مضغوط نصيًا |
| مستخدم واحد/شهر (≈600 محاولة) | ≈ 300 KB | 10,000 مستخدم نشط ≈ 3 GB **يتجاوز 500 MB** |
| **الحد** | 500 MB/قاعدة | ← |

**الخطة:** (1) تقليم المحاولات > 180 يومًا بعد تجميعها في `daily_activity` و`user_vocabulary_progress`، (2) `PRAGMA`/أرشفة الإصدارات القديمة غير المرجعية إلى R2 كـ JSON، (3) عند تجاوز 350 MB → قرار المالك: قاعدة ثانية للمحتوى (قراءة فقط، 5 GB للحساب) أو Workers Paid. المراقبة عبر صفحة حالة الإدارة (`/admin/status`).

## 8. النسخ الاحتياطي

- D1 Time Travel: 7 أيام (Free). تصدير دوري `wrangler d1 export` إلى R2 (شهريًا) بسكربت موثق.
- المحتوى: Git هو النسخة الاحتياطية الحقيقية (JSON في المستودع).
- لا أسرار في نسخ التصدير (الجداول لا تحتوي كلمات مرور بصيغة قابلة للاستخدام، لكن تُستثنى `sessions`/`tokens` من التصدير الدوري).
