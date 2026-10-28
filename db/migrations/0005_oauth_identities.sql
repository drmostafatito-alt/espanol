-- =============================================================================
-- 0005 — هويات المصادقة الخارجية (Google OAuth 2.0)
-- -----------------------------------------------------------------------------
-- قرار مالك 2026-10-28: مصادقة خارجية مجانية (خيار «ج» في docs/SECURITY_BLOCKERS.md)
-- بدل خطة Workers المدفوعة. النطاق: الهوية فقط (openid/email/profile) — بلا وصول
-- إلى أي API من Google. لا تغيير هدّام: جدول جديد فقط، وعمود password_hash يبقى
-- NOT NULL (حسابات OAuth فقط تحمل تجزئة كلمة مرور عشوائية غير قابلة للاستخدام،
-- يُرمى نصها فور إنشائها — انظر src/worker/routes/auth.ts).
-- =============================================================================

CREATE TABLE IF NOT EXISTS oauth_identities (
  id               TEXT PRIMARY KEY,
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider         TEXT NOT NULL CHECK (provider IN ('google')),
  provider_subject TEXT NOT NULL,
  email_at_link    TEXT NOT NULL,
  created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_used_at     TEXT,
  UNIQUE (provider, provider_subject),
  UNIQUE (user_id, provider)
);
CREATE INDEX IF NOT EXISTS idx_oauth_identities_user ON oauth_identities(user_id);
