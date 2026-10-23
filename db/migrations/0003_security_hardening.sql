-- =============================================================================
-- 0003 — تحصين أمني بعد مراجعة المرحلة 1
-- لا تغيير في الأعمدة (توافق خلفي كامل) — فهارس وتتبّع مهاجرات فقط.
-- =============================================================================

-- تتبّع المهاجرات: يجعل التطبيق متكررًا بأمان ويعرف ما طُبِّق فعلًا
CREATE TABLE IF NOT EXISTS schema_migrations (
  name        TEXT PRIMARY KEY,
  checksum    TEXT NOT NULL,
  applied_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- تنظيف الجلسات المنتهية يستعلم بالتاريخ وحده (كان الفهرس مركبًا مع user_id)
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_last_seen ON sessions(last_seen_at);

-- حد المعدل: تنظيف النوافذ القديمة
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- سجل التدقيق: الاستعلامات الأخيرة أولًا
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON admin_audit_logs(actor_user_id, created_at DESC);

-- البحث عن المستخدمين بحالة معينة أثناء الإدارة
CREATE INDEX IF NOT EXISTS idx_users_locked ON users(locked_until) WHERE locked_until IS NOT NULL;
