/* ============================================================================
   البريد الصادر — طبقة واحدة قابلة للاستبدال
   ----------------------------------------------------------------------------
   لماذا ملف منفصل؟
     التحقق من البريد واستعادة كلمة المرور يحتاجان إرسال رسالة. المزوّد اختياري
     (Resend: خطة مجانية 3,000 رسالة/شهر، 100/يوم، بلا بطاقة). غيابه **لا يُعطّل
     التسجيل**: نُنشئ الرمز وننجح الطلب، لكن لا نرسل شيئًا ونُعلن ذلك في السجل
     (وسم `mailer:not_configured`) بدل الادعاء بأن بريدًا أُرسل.
   ----------------------------------------------------------------------------
   الحدود الأمنية:
     • لا يُسجَّل مفتاح ولا نص الرسالة كاملًا (الرابط سرّي). في التطوير فقط، وعند
       `DEBUG_MAIL_OUTBOX="true"` صراحةً، يُحفظ الصندوق في الذاكرة لعرضه لاختبارات
       E2E محليًا. الإنتاج يمنعه، وبوابة preflight تفشل إذا ظهر في إعداد الإنتاج.
     • أي فشل من المزوّد يُعاد كـ{ delivered:false } لا كاستثناء: طلب استعادة كلمة
       المرور يجب أن يعطي نفس الرد دائمًا (لا كشف وجود الحساب).
   ========================================================================== */

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** للتصنيف في السجل والصندوق التطويري: verify_email | reset_password */
  kind: 'verify_email' | 'reset_password';
}

export interface MailResult {
  delivered: boolean;
  provider: 'resend' | 'none';
  error?: string;
}

interface OutboxItem {
  at: string;
  to: string;
  subject: string;
  text: string;
  kind: MailMessage['kind'];
}

/** صندوق تطويري في الذاكرة (يُقرأ عبر مسار محلي محجوب في الإنتاج). */
const OUTBOX: OutboxItem[] = [];
const OUTBOX_MAX = 50;

export function mailConfigured(env: { RESEND_API_KEY?: string }): boolean {
  return typeof env.RESEND_API_KEY === 'string' && env.RESEND_API_KEY.trim().length > 0;
}

export function outboxEnabled(env: { ENVIRONMENT?: string; DEBUG_MAIL_OUTBOX?: string }): boolean {
  return env.ENVIRONMENT !== 'production' && env.DEBUG_MAIL_OUTBOX === 'true';
}

export function readOutbox(env: { ENVIRONMENT?: string; DEBUG_MAIL_OUTBOX?: string }): OutboxItem[] {
  return outboxEnabled(env) ? [...OUTBOX] : [];
}

export function clearOutbox(): void {
  OUTBOX.length = 0;
}

function remember(env: { ENVIRONMENT?: string; DEBUG_MAIL_OUTBOX?: string }, msg: MailMessage): void {
  if (!outboxEnabled(env)) return;
  OUTBOX.push({ at: new Date().toISOString(), to: msg.to, subject: msg.subject, text: msg.text, kind: msg.kind });
  if (OUTBOX.length > OUTBOX_MAX) OUTBOX.splice(0, OUTBOX.length - OUTBOX_MAX);
}

/**
 * يرسل رسالة عبر Resend إن كان المفتاح مضبوطًا. لا يرفع استثناءً أبدًا.
 * `from` إلزامي من الإعداد (MAIL_FROM) — لا نضع نطاقًا وهميًا يسبب رفض المزوّد.
 */
export async function sendMail(
  env: { RESEND_API_KEY?: string; MAIL_FROM?: string; ENVIRONMENT?: string; DEBUG_MAIL_OUTBOX?: string },
  msg: MailMessage,
): Promise<MailResult> {
  remember(env, msg);
  if (!mailConfigured(env)) {
    console.log(JSON.stringify({ level: 'warn', event: 'mailer.not_configured', kind: msg.kind }));
    return { delivered: false, provider: 'none' };
  }
  if (!env.MAIL_FROM || !env.MAIL_FROM.includes('@')) {
    console.log(JSON.stringify({ level: 'error', event: 'mailer.missing_from', kind: msg.kind }));
    return { delivered: false, provider: 'resend', error: 'MAIL_FROM_MISSING' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: env.MAIL_FROM, to: [msg.to], subject: msg.subject, text: msg.text, html: msg.html }),
    });
    if (!res.ok) {
      // لا نطبع جسم الاستجابة (قد يحوي بريدًا) — الرمز وحده يكفي للتشخيص.
      console.log(JSON.stringify({ level: 'error', event: 'mailer.send_failed', status: res.status, kind: msg.kind }));
      return { delivered: false, provider: 'resend', error: `HTTP_${res.status}` };
    }
    return { delivered: true, provider: 'resend' };
  } catch (err) {
    console.log(JSON.stringify({ level: 'error', event: 'mailer.send_error', kind: msg.kind, message: String((err as Error).message ?? err).slice(0, 120) }));
    return { delivered: false, provider: 'resend', error: 'NETWORK' };
  }
}
