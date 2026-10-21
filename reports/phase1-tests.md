# نتائج اختبارات المرحلة 1

تاريخ التشغيل: 2026-10-21T05:59:38Z

## 1) اختبارات الوحدة والتكامل (vitest — منطق الخادم على SQLite في الذاكرة)
```
 Test Files  4 passed (4)
      Tests  45 passed (45)

التفصيل:
  tests/auth.test.ts   18  ← T1,T1b–T1e,T2,T2b,S1,S5,S5b,S6,S7,S9,S10 + حدود الإدخال + المحتوى
  tests/lib.test.ts    12  ← التجزئة، الملح، المقارنة الزمنية، ULID، حد المعدل، قواعد كلمة المرور
  tests/audio.test.ts  14  ← عقد الصوت: R2 أولًا، بديل، لا تداخل، منع تكرار، سرعة، إلغاء، تشخيص
  tests/pbkdf2-calibration.test.ts 1 ← يكتب reports/pbkdf2-calibration.md
```

## 2) فحص DDL ومعايير المحتوى
```
- لا شيء ✅

**النتيجة: PASS**
---
## الأخطاء (0)
## التنبيهات (10)
**النتيجة: PASS**
```

## 3) بناء الواجهة (vite production build)
```
dist/index.html                   1.07 kB │ gzip:  0.67 kB
dist/assets/index-CmcFq4L_.css    5.68 kB │ gzip:  1.91 kB
dist/assets/index-CDdrMWuN.js   248.75 kB │ gzip: 77.18 kB

✓ built in 170ms
```

## 4) اختبار دخان على workerd حقيقي + D1 (لا محاكي)
```
✅ GET /api/health يعمل ويصل إلى D1 — levels=6
✅ الإعدادات العامة تُقرأ من القاعدة
✅ كلمة مرور ضعيفة مرفوضة (400)
✅ إنشاء حساب حقيقي (201) + كوكي جلسة — دور=learner
✅ الكوكي HttpOnly + SameSite=Lax
✅ GET /api/auth/me بالجلسة
✅ حفظ التفضيلات في الخادم
✅ المتعلم لا يصل إلى مسار الإدارة (403)
✅ طلب من أصل خارجي مرفوض (CSRF)
✅ بريد مكرر يُرفض دون كشف
✅ كلمة مرور خاطئة (401)
✅ الخروج يُبطل الجلسة في الخادم
✅ SPA fallback يخدم index.html

13/13 اختبار دخان ناجح على http://127.0.0.1:8787
```

> ملاحظة: اختبار الدخان يطلب تشغيل `npm run worker:dev` أولًا. نتائج أعلاه من تشغيل فعلي.
