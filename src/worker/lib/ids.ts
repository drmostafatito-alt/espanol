/* معرّفات ULID (29 حرفًا بترتيب زمني) — آمنة للترتيب والفرز، بلا اعتماديات */

const ENC = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford base32

function encodeTime(now: number, len: number): string {
  let out = '';
  let t = now;
  for (let i = 0; i < len; i++) {
    out = ENC[t % 32] + out;
    t = Math.floor(t / 32);
  }
  return out;
}

export function ulid(now = Date.now()): string {
  const time = encodeTime(now, 10);
  const rand = new Uint8Array(16);
  crypto.getRandomValues(rand);
  let out = '';
  for (let i = 0; i < 16; i++) out += ENC[rand[i]! % 32];
  return time + out;
}

/** معرّف ثابت مشتق من بذرة — لإعادة استيراد المحتوى دون تغيير الهوية */
export async function stableId(prefix: string, seed: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(seed));
  const bytes = new Uint8Array(digest).slice(0, 12);
  let out = '';
  for (const b of bytes) out += ENC[b % 32];
  return `${prefix}_${out}`;
}
