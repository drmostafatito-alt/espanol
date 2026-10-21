-- =====================================================================
-- Español بالعربي — 0002_seed_reference.sql
-- بذور مرجعية فقط (ليست بيانات مستخدمين ولا تقدمًا وهميًا):
--   الأدوار والصلاحيات · المستويات · أنواع التمارين الـ28 · الإنجازات · إعدادات افتراضية · مواضع الإعلان
-- ملاحظة: لا تُزرع دروس أو كلمات أو نتائج هنا. المحتوى يُستورد من content/ بعد التحقق.
-- =====================================================================

-- 1) الأدوار
INSERT OR IGNORE INTO roles (id, code, name_ar, description_ar) VALUES
 ('role_learner','learner','متعلّم','الدور الافتراضي لكل حساب جديد: تعلّم ومراجعة وإبلاغ عن محتوى فقط'),
 ('role_super','super_admin','مدير أعلى','كل الصلاحيات بما فيها إدارة الأدوار والإعدادات الحساسة'),
 ('role_admin','admin','مدير','إدارة المحتوى والمستخدمين والإعدادات، بلا تغيير الأدوار'),
 ('role_content','content_manager','مسؤول محتوى','إنشاء وتحرير الدروس والمفردات وإرسالها للمراجعة'),
 ('role_reviewer','language_reviewer','مراجع لغوي','مراجعة الإسبانية والترجمة العربية واعتماد الجودة'),
 ('role_support','support_agent','دعم فني','الاطلاع على المستخدمين ومعالجة البلاغات وطلبات الخصوصية'),
 ('role_analyst','analyst','محلل','قراءة الإحصاءات والتقارير دون تعديل');

-- 2) الصلاحيات
WITH perms(permission) AS (VALUES
  ('learn.read'),('learn.submit'),('profile.manage'),('reports.create'))
INSERT OR IGNORE INTO role_permissions (role_id, permission)
SELECT (SELECT id FROM roles WHERE code='learner'), permission FROM perms;

WITH perms(permission) AS (VALUES
  ('content.read'),('content.create'),('content.edit'),('content.review_es'),('content.review_ar'),
  ('content.publish'),('content.archive'),('vocab.manage'),('media.manage'),
  ('users.read'),('users.manage'),('users.suspend'),('privacy.handle'),
  ('notifications.manage'),('ads.manage'),
  ('settings.read'),('settings.manage'),
  ('reports.read'),('reports.handle'),('analytics.read'),('audit.read'),('roles.manage'))
INSERT OR IGNORE INTO role_permissions (role_id, permission)
SELECT (SELECT id FROM roles WHERE code='super_admin'), permission FROM perms;

WITH perms(permission) AS (VALUES
  ('content.read'),('content.create'),('content.edit'),('content.review_es'),('content.review_ar'),
  ('content.publish'),('content.archive'),('vocab.manage'),('media.manage'),
  ('users.read'),('users.manage'),('users.suspend'),('privacy.handle'),
  ('notifications.manage'),('ads.manage'),
  ('settings.read'),('settings.manage'),
  ('reports.read'),('reports.handle'),('analytics.read'),('audit.read'))
INSERT OR IGNORE INTO role_permissions (role_id, permission)
SELECT (SELECT id FROM roles WHERE code='admin'), permission FROM perms;

WITH perms(permission) AS (VALUES
  ('content.read'),('content.create'),('content.edit'),('vocab.manage'),('media.manage'),
  ('reports.read'),('reports.handle'),('analytics.read'))
INSERT OR IGNORE INTO role_permissions (role_id, permission)
SELECT (SELECT id FROM roles WHERE code='content_manager'), permission FROM perms;

WITH perms(permission) AS (VALUES
  ('content.read'),('content.review_es'),('content.review_ar'),('content.publish'),
  ('reports.read'),('analytics.read'))
INSERT OR IGNORE INTO role_permissions (role_id, permission)
SELECT (SELECT id FROM roles WHERE code='language_reviewer'), permission FROM perms;

WITH perms(permission) AS (VALUES
  ('content.read'),('users.read'),('privacy.handle'),('reports.read'),('reports.handle'))
INSERT OR IGNORE INTO role_permissions (role_id, permission)
SELECT (SELECT id FROM roles WHERE code='support_agent'), permission FROM perms;

WITH perms(permission) AS (VALUES
  ('content.read'),('analytics.read'),('reports.read'))
INSERT OR IGNORE INTO role_permissions (role_id, permission)
SELECT (SELECT id FROM roles WHERE code='analyst'), permission FROM perms;

-- 3) المستويات (تهيئة + 5 مستويات CEFR)
INSERT OR IGNORE INTO levels (code, title_ar, description_ar, sort_order, min_accuracy_pass) VALUES
 ('PREA1','التمهيد — من الصفر','الحروف والأصوات والقراءة الأولى والتحية. لا يشترط معرفة مسبقة.',0,80),
 ('A1','A1 — التواصل الأساسي','التعريف بالنفس، الأسرة، العمل، الطعام، الأسعار، الاتجاهات، الحاضر البسيط.',1,80),
 ('A2','A2 — الاستقلال اليومي','التسوق، السكن، المواصلات، الطبيب، الماضي البسيط، المقارنة، الأمر.',2,80),
 ('B1','B1 — التواصل المستقل','سرد التجارب، السفر، الهاتف، العمل، الآراء، المستقبل والشرط، الـsubjuntivo الأول.',3,80),
 ('B2','B2 — الطلاقة العملية','الاجتماعات، الشكاوى، التفاوض، نقل الكلام، الشرط المركب، التعبيرات الاصطلاحية.',4,80),
 ('C1','C1 — الاستخدام المتقدم','المناقشات، المحاضرات، المعاني الضمنية، الأسلوب، الكتابة المهنية المطولة.',5,80);

-- 4) أنواع التمارين الـ28 (محرك قابل للتوسع)
INSERT OR IGNORE INTO exercise_types (code, name_ar, skills, needs_audio, needs_image, is_auto_graded, sort_order) VALUES
 ('image_choice','اختيار الصورة الصحيحة','reading,vocabulary',0,1,1,1),
 ('word_choice','اختيار الكلمة المناسبة','reading,vocabulary',0,0,1,2),
 ('fill_blank','إكمال الفراغ','reading,grammar',0,0,1,3),
 ('listen_choose','الاستماع واختيار ما سُمِع','listening',1,0,1,4),
 ('match_pairs','المطابقة بين الكلمة والمعنى','reading,vocabulary',0,0,1,5),
 ('word_order','ترتيب الكلمات لتكوين جملة','grammar,writing',0,0,1,6),
 ('dialogue_order','ترتيب الجمل لتكوين حوار','reading,pragmatics',0,0,1,7),
 ('distinguish_similar','التمييز بين جمل متشابهة','reading,grammar',0,0,1,8),
 ('type_missing_word','كتابة الكلمة الناقصة','writing,vocabulary',0,0,1,9),
 ('write_sentence','كتابة جملة كاملة','writing,grammar',0,0,0,10),
 ('translate_short','ترجمة جملة قصيرة','writing,translation',0,0,1,11),
 ('identify_speaker','تحديد المتحدث المناسب','listening',1,0,1,12),
 ('choose_reply','اختيار الرد الطبيعي','pragmatics,listening',1,0,1,13),
 ('find_fix_error','اكتشاف خطأ وتصحيحه','grammar,writing',0,0,1,14),
 ('conjugate_in_context','تصريف فعل داخل جملة','grammar',0,0,1,15),
 ('preposition_choice','اختيار حرف الجر','grammar',0,0,1,16),
 ('reconstruct_audio_sentence','إعادة بناء جملة مسموعة','listening,writing',1,0,1,17),
 ('dictation','إملاء صوتي متدرج','listening,writing',1,0,1,18),
 ('speak_with_text','التحدث باستخدام نص قصير','speaking,pronunciation',0,0,0,19),
 ('speak_free','التحدث دون نص','speaking,fluency',0,0,0,20),
 ('roleplay_simulation','محاكاة موقف واقعي','speaking,pragmatics',1,0,0,21),
 ('phone_call_response','الاستجابة لمكالمة هاتفية','listening,speaking',1,0,0,22),
 ('resolve_customer_issue','حل مشكلة عميل','speaking,pragmatics',0,0,0,23),
 ('write_email','كتابة رسالة بريد إلكتروني','writing,register',0,0,0,24),
 ('summarize_dialogue','تلخيص حوار','reading,writing',1,0,0,25),
 ('infer_meaning','فهم المعنى من السياق','reading,vocabulary',0,0,1,26),
 ('recall_previous_word','استدعاء كلمة سابقة','vocabulary',0,0,1,27),
 ('review_common_errors','مراجعة أخطاء متكررة','grammar,vocabulary',0,0,1,28);

-- 5) إنجازات أساسية (المعايير تُقيَّم على الخادم)
INSERT OR IGNORE INTO achievements (id, code, title_ar, description_ar, criteria_json, xp_reward) VALUES
 ('ach_first_lesson','first_lesson','أول خطوة','أكملت درسك الأول على المنصة','{"type":"lessons_completed","count":1}',10),
 ('ach_unit_1','first_unit','الوحدة الأولى','أكملت أول وحدة كاملة','{"type":"units_completed","count":1}',30),
 ('ach_streak_7','streak_7','أسبوع متواصل','سبعة أيام تعلّم متتالية','{"type":"streak_days","count":7}',50),
 ('ach_streak_30','streak_30','شهر من العادة','ثلاثون يومًا من التعلّم','{"type":"streak_days","count":30}',150),
 ('ach_words_100','words_100','مئة كلمة مستقرة','100 كلمة وصلت حالة الاستقرار بعد مراجعات متباعدة','{"type":"words_stable","count":100}',100),
 ('ach_reviews_50','reviews_50','مراجع منتظم','50 مراجعة منجزة','{"type":"reviews_done","count":50}',60),
 ('ach_a1_done','a1_done','أنجزت A1','اجتزت اختبار مستوى A1 بدرجة النجاح','{"type":"level_completed","code":"A1"}',200),
 ('ach_cc_module_1','cc_call_basics','أساسيات المكالمات','أكملت الوحدة الأولى من مسار الكول سنتر','{"type":"program_unit","slug":"callcenter-basics"}',80);

-- 6) إعدادات افتراضية (قابلة للتغيير من لوحة الإدارة)
INSERT OR IGNORE INTO admin_settings (key, value_json, is_public) VALUES
 ('branding.platform_name','"Español بالعربي"',1),
 ('branding.tagline','"تعلّم الإسبانية من الصفر حتى C1 — بالعربي وبالمواقف الحقيقية"',1),
 ('branding.logo_asset_key','null',1),
 ('branding.color_primary','"#1F7A5C"',1),
 ('branding.color_accent','"#D97706"',1),
 ('branding.color_bg','"#FAF8F4"',1),
 ('branding.font_arabic','"Noto Kufi Arabic"',1),
 ('branding.font_spanish','"Source Sans 3"',1),
 ('contact.email','"support@example.com"',1),
 ('contact.whatsapp','null',1),
 ('contact.support_hours_ar','"السبت–الخميس، 10:00–18:00 (توقيت القاهرة)"',1),
 ('legal.privacy_url','"/privacy"',1),
 ('legal.terms_url','"/terms"',1),
 ('legal.cookies_url','"/cookies"',1),
 ('legal.ads_url','"/ads-policy"',1),
 ('learning.default_pass_score','80',1),
 ('learning.default_daily_goal_minutes','10',1),
 ('learning.review_daily_limit','40',0),
 ('learning.placement_test_max_questions','20',0),
 ('learning.max_attempts_per_lesson_session','60',0),
 ('audio.default_variant','"es-ES"',1),
 ('audio.enable_browser_fallback','true',1),
 ('audio.disclosure_ar','"الصوت الأساسي مسجَّل/مولَّد مسبقًا. عند غيابه يستخدم المتصفح صوت الجهاز وقد تختلف الجودة والنبرة."',1),
 ('offline.max_bundle_mb','25',1),
 ('offline.prefetch_next_lessons','1',0),
 ('privacy.analytics_enabled','false',1),
 ('privacy.ads_enabled','false',1),
 ('privacy.retention_attempts_days','180',0),
 ('features.maintenance_mode','false',1),
 ('features.maintenance_message_ar','"المنصة تحت صيانة قصيرة. تقدّمك محفوظ ولن يُفقد."',1),
 ('features.push_enabled','false',1),
 ('features.registration_enabled','true',1),
 ('email.delivery_configured','false',0),
 ('email.reset_link_ttl_minutes','30',0);

-- 7) مواضع الإعلان (مُعطَّلة افتراضيًا؛ لا حقن JS)
INSERT OR IGNORE INTO ads_configuration (slot_code, is_enabled, provider, settings_json, notes_ar) VALUES
 ('home_footer',0,'none','{}','أسفل الصفحة الرئيسية بعد المحتوى التعليمي'),
 ('path_end',0,'none','{}','نهاية صفحة المسار، لا داخل الدرس'),
 ('dictionary_side',0,'none','{}','جانب صفحة القاموس على الشاشات الكبيرة فقط'),
 ('result_below',0,'none','{}','أسفل شاشة النتيجة، بعد أزرار الإجراء'),
 ('legal_page',0,'none','{}','في الصفحات القانونية فقط');
