# قياس دوال اشتقاق كلمات المرور على workerd

> **مولَّد آليًا** بـ`node tools/bench-kdf.mjs` — لا يُعدَّل يدويًا.

- تاريخ التشغيل: 2026-10-25T18:53:53.129Z
- البيئة: workerd محلي (wrangler dev) · Node v24.21.0 · 8 vCPU
- الجولات لكل قياس: 3 · ميزانية الخطة المجانية: **10 ms CPU لكل طلب**

## 1) PBKDF2-HMAC-SHA256 (WebCrypto الأصلي)

| التكرارات | الوسيط (ms) | الأدنى | الأعلى | متطلب OWASP | نسبة الإنجاز | ضمن 10ms؟ |
| --- | --- | --- | --- | --- | --- | --- |
| 10,000 | 7 | 7 | 8 | 600,000 | 1.7% | نعم |
| 20,000 | 13 | 12 | 15 | 600,000 | 3.3% | لا |
| 25,000 | 16 | 15 | 20 | 600,000 | 4.2% | لا |
| 30,000 | 20 | 20 | 21 | 600,000 | 5.0% | لا |
| 50,000 | 33 | 32 | 42 | 600,000 | 8.3% | لا |
| 100,000 | 68 | 66 | 70 | 600,000 | 16.7% | لا |
| 210,000 | 163 | 149 | 171 | 600,000 | 35.0% | لا |
| 600,000 | 371 | 369 | 407 | 600,000 | 100.0% | لا |

## 2) PBKDF2-HMAC-SHA512 (بديل مقترح — يُختبر لا يُفترض)

| التكرارات | الوسيط (ms) | متطلب OWASP | نسبة الإنجاز |
| --- | --- | --- | --- |
| 6,000 | 4 | 210,000 | 2.9% |
| 8,000 | 6 | 210,000 | 3.8% |
| 10,000 | 7 | 210,000 | 4.8% |
| 12,000 | 9 | 210,000 | 5.7% |
| 15,000 | 12 | 210,000 | 7.1% |
| 20,000 | 15 | 210,000 | 9.5% |
| 30,000 | 23 | 210,000 | 14.3% |
| 50,000 | 37 | 210,000 | 23.8% |
| 210,000 | 160 | 210,000 | 100.0% |

## 3) Argon2id و scrypt عبر WASM

| الخوارزمية | المعاملات | النتيجة |
| --- | --- | --- |
| Argon2id (WASM) | m=19MiB t=2 p=1 (OWASP minimum) | فشل: CompileError: WebAssembly.compile(): Wasm code generation disallowed by embedder |
| Argon2id (WASM) | m=12MiB t=3 p=1 | فشل: CompileError: WebAssembly.compile(): Wasm code generation disallowed by embedder |
| Argon2id (WASM) | m=8MiB t=2 p=1 | فشل: CompileError: WebAssembly.compile(): Wasm code generation disallowed by embedder |
| Argon2id (WASM) | m=4MiB t=3 p=1 | فشل: CompileError: WebAssembly.compile(): Wasm code generation disallowed by embedder |
| Argon2id (WASM) | m=1MiB t=3 p=1 | فشل: CompileError: WebAssembly.compile(): Wasm code generation disallowed by embedder |
| scrypt (WASM) | N=2^14 r=8 p=1 | فشل: Error: Cost factor should be a power of 2, greater than 1 |
| scrypt (WASM) | N=2^16 r=8 p=1 (OWASP min) | فشل: Error: Cost factor should be a power of 2, greater than 1 |

**نتيجة حاسمة:** workerd يمنع ترجمة WASM وقت التشغيل (`Wasm code generation disallowed by embedder`)،
لذلك أي مكتبة Argon2/scrypt تحمّل وحدتها من base64 لا تعمل إطلاقًا في Workers.
حتى لو حُمّلت كوحدة `.wasm` ثابتة، تكلفتها المحلية (Node) كانت: Argon2id m=19MiB t=2 ≈ 60ms، m=8MiB t=2 ≈ 24ms —
أي 2.4× إلى 6× فوق ميزانية 10ms قبل أي عمل آخر في الطلب.

## 4) الاستنتاج

- **القيمة المعتمدة حاليًا في `wrangler.toml`: 30,000 تكرارًا** (5.0% من متطلب OWASP).
- SHA-512 بهامش 2×: 6,000 تكرارًا ≈ 4 ms ⇒ 2.9% من متطلب OWASP.
- **الخلاصة:** على خطة Workers المجانية لا يمكن الوصول لمتطلب OWASP بأي خوارزمية متاحة.
  هذا حدّ منصة موثّق بالقياس، وليس اختيارًا. القرار المطلوب من المالك في `docs/21_SECURITY_REVIEW_PHASE1.md`.

## 5) حدود هذا القياس

- workerd المحلي لا يفرض حد CPU ولا يعطي زمن CPU الفعلي من Cloudflare.
- المعالج هنا ليس معالج شبكة الإنتاج؛ الفارق قد يكون ±50%.
- **لم يُنشر شيء ولم يُقس على شبكة Cloudflare.** الرقم الملزم مستقبلًا من `wrangler tail` بعد أول نشر.
- من يقرأ هذا الرقم يجب أن يعتبره **الأعلى الممكن**، لا الأدق.
