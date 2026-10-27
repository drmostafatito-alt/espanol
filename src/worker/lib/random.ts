/* ============================================================================
   عشوائية خادمية آمنة لخلط مواضع الإجابات (إصلاح DEFECT-1)
   ----------------------------------------------------------------------------
   العيب السابق: خلط حتمي ببذرة من قيم يعرفها العميل (attemptId/userId/
   معرّفات الأسئلة والتمارين) — أي قارئ للكود يعيد حساب الترتيب ويستخرج
   موضع الإجابة الصحيحة دون أي معرفة بالمحتوى.

   القاعدة هنا:
   * الإنتاج يستخدم `crypto.getRandomValues` حصرًا (متاح في Workers وNode ≥19).
   * لا بذرة، لا مدخل من العميل، لا قيمة تُرسل إليه تتيح إعادة الحساب.
   * حقن مصدر بديل متاح **للاختبارات فقط** عبر setRandomSourceForTests،
     حتى تكون اختبارات الهجوم حتمية بلا اعتماد على مصادفات إحصائية.
     كود الإنتاج لا يستدعي هذه الدالة أبدًا، ولا توجد أي طريق (طلب/بيئة)
     لاستدعائها من خارج الاختبارات.
   ========================================================================== */

type RandomSource = () => number;

let testSource: RandomSource | null = null;

/** للاختبارات فقط: حقن مصدر عشوائية حتمي (أو null للعودة إلى الآمن). */
export function setRandomSourceForTests(src: RandomSource | null): void {
  testSource = src;
}

/** مصدر الإنتاج الآمن: عدد في [0,1) من مولّد النظام التشفيري. */
export function secureRandomFloat(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0]! / 4294967296;
}

function activeSource(rand?: RandomSource): RandomSource {
  return rand ?? testSource ?? secureRandomFloat;
}

/**
 * خلط Fisher–Yates لنسخة من المصفوفة بمصدر عشوائي خادمي.
 * الأحجام هنا صغيرة (خيارات/عناصر ≤ ~10) فانحراف التحويل العائم مهمل.
 */
export function shuffleSecure<T>(items: readonly T[], rand?: RandomSource): T[] {
  const out = [...items];
  if (out.length < 2) return out;
  const next = activeSource(rand);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    const tmp = out[i]!;
    out[i] = out[j]!;
    out[j] = tmp;
  }
  return out;
}
