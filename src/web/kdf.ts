/* ============================================================================
   اشتقاق كلمة المرور في المتصفح — الطبقة الثانية لحماية كلمة المرور
   ----------------------------------------------------------------------------
   لماذا في المتصفح؟ حد Cloudflare Workers المجاني 10ms CPU/طلب، ولا يكفي
   لـ600,000 تكرار PBKDF2 (متطلب OWASP ≈ 94ms). المتصفح مجاني تمامًا، فيشتق
   المفتاح هنا بـ600,000 تكرار على ملح حتمي من الخادم (HMAC بالـpepper)، ثم
   يطبّق الخادم طبقة ثانية (30,000 + pepper). من يسرق قاعدة البيانات يحتاج
   ≥630,000 تكرار لكل تخمين، ولا يستطيع حتى بدء الاشتقاق بلا pepper.

   كلمة المرور نفسها لا تُرسل إلى الخادم إطلاقًا في هذا المسار.
   ========================================================================== */

const enc = new TextEncoder();

function b64urlToBytes(value: string): Uint8Array {
  const b64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** هل يستطيع هذا المتصفح الاشتقاق؟ (WebCrypto مع PBKDF2+SHA-256) */
export function supportsClientKdf(): boolean {
  return typeof crypto !== 'undefined' && !!crypto.subtle && typeof crypto.subtle.deriveBits === 'function';
}

/**
 * يشتق 32 بايت من كلمة المرور على الملح المعطى، ويعيد b64url.
 * لا يُخزَّن الناتج في أي مكان في المتصفح (لا localStorage ولا sessionStorage).
 */
export async function deriveKeyB64(password: string, saltB64: string, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: b64urlToBytes(saltB64) as unknown as BufferSource, iterations, hash: 'SHA-256' },
    key,
    256,
  );
  return bytesToB64url(new Uint8Array(bits));
}
